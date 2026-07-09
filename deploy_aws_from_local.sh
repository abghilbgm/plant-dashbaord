#!/usr/bin/env bash
set -euo pipefail

# deploy_aws_from_local.sh
# Automates: upload source to S3, create CodeBuild role & project, run build (push to ECR), create App Runner service
# Run from repository root where buildspec.yml and project files exist.

REGION=$(aws configure get region || echo "")
if [ -z "$REGION" ]; then
  echo "AWS region not set. Run 'aws configure' and set a default region, then re-run."
  exit 1
fi

ACCOUNT=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || true)
if [ -z "$ACCOUNT" ]; then
  echo "AWS credentials not configured or invalid. Run 'aws configure' then re-run."
  exit 1
fi

echo "Account: $ACCOUNT  Region: $REGION"

# Requirements check
if ! command -v jq >/dev/null 2>&1; then
  echo "Please install 'jq' (brew install jq) and re-run."
  exit 1
fi

REPO_NAME="plant-dashboard"
CB_PROJECT="plant-dashboard-codebuild"
CB_ROLE="codebuild-plant-dashboard-role"
S3_BUCKET="${ACCOUNT}-${REPO_NAME}-source-$(date +%s)"
S3_KEY="${REPO_NAME}.tar.gz"
IMAGE_URI="${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}:latest"
APP_RUNNER_SERVICE="plant-dashboard-service"

echo "Creating S3 bucket: $S3_BUCKET"
aws s3api create-bucket --bucket "$S3_BUCKET" --create-bucket-configuration LocationConstraint="$REGION" --region "$REGION" || true

echo "Archiving repo to /tmp/$S3_KEY"
tar --exclude='.git' -czf /tmp/$S3_KEY .

echo "Uploading source to s3://$S3_BUCKET/$S3_KEY"
aws s3 cp /tmp/$S3_KEY s3://$S3_BUCKET/$S3_KEY --region "$REGION"

# Create CodeBuild role if it doesn't exist
if ! aws iam get-role --role-name "$CB_ROLE" >/dev/null 2>&1; then
  echo "Creating IAM role $CB_ROLE for CodeBuild"
  cat > /tmp/codebuild-trust.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "codebuild.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
  aws iam create-role --role-name "$CB_ROLE" --assume-role-policy-document file:///tmp/codebuild-trust.json
  aws iam attach-role-policy --role-name "$CB_ROLE" --policy-arn arn:aws:iam::aws:policy/AWSCodeBuildAdminAccess
  aws iam attach-role-policy --role-name "$CB_ROLE" --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser
  aws iam attach-role-policy --role-name "$CB_ROLE" --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess
  echo "Waiting for role propagation..."
  sleep 10
fi

ROLE_ARN=$(aws iam get-role --role-name "$CB_ROLE" --query 'Role.Arn' --output text)

# Create or update CodeBuild project using S3 source
if ! aws codebuild batch-get-projects --names "$CB_PROJECT" --query 'projects[0].name' --output text >/dev/null 2>&1; then
  echo "Creating CodeBuild project $CB_PROJECT"
  aws codebuild create-project \
    --name "$CB_PROJECT" \
    --source type=S3,location="${S3_BUCKET}/${S3_KEY}" \
    --artifacts type=NO_ARTIFACTS \
    --environment type=LINUX_CONTAINER,computeType=BUILD_GENERAL1_MEDIUM,image=aws/codebuild/standard:8.0,privilegedMode=true \
    --service-role "$ROLE_ARN" \
    --region "$REGION"
else
  echo "CodeBuild project $CB_PROJECT already exists; updating source to S3 package"
  aws codebuild update-project \
    --name "$CB_PROJECT" \
    --source type=S3,location="${S3_BUCKET}/${S3_KEY}" \
    --region "$REGION"
fi

# Start build
echo "Starting CodeBuild build..."
BUILD_ID=$(aws codebuild start-build --project-name "$CB_PROJECT" --region "$REGION" --query 'build.id' --output text)
echo "Build started: $BUILD_ID"
DEEP_LINK=$(aws codebuild batch-get-builds --ids "$BUILD_ID" --region "$REGION" --query 'builds[0].logs.deepLink' --output text)
echo "Logs: $DEEP_LINK"

# Poll for build completion
echo "Polling build status..."
while true; do
  STATUS=$(aws codebuild batch-get-builds --ids "$BUILD_ID" --region "$REGION" --query 'builds[0].buildStatus' --output text)
  echo "Build status: $STATUS"
  if [[ "$STATUS" == "SUCCEEDED" ]]; then
    break
  fi
  if [[ "$STATUS" == "FAILED" || "$STATUS" == "FAULT" || "$STATUS" == "TIMED_OUT" || "$STATUS" == "STOPPED" ]]; then
    echo "Build failed with status $STATUS"
    exit 1
  fi
  sleep 8
done

echo "Build succeeded. Image should be in ECR at: $IMAGE_URI"

# Create App Runner service
echo "Creating App Runner service from ECR image..."
CREATE_OUT=$(aws apprunner create-service \
  --service-name "$APP_RUNNER_SERVICE" \
  --source-configuration ImageRepository="{ImageIdentifier=\"$IMAGE_URI\",ImageRepositoryType=\"ECR\",ImageConfiguration={Port=\"8000\"}}" \
  --instance-configuration Cpu=1024,Memory=2048 \
  --region "$REGION" || true)

if echo "$CREATE_OUT" | grep -q "ServiceArn"; then
  SERVICE_ARN=$(echo "$CREATE_OUT" | jq -r '.Service.ServiceArn')
  echo "App Runner service created: $SERVICE_ARN"
else
  echo "App Runner create output:"
  echo "$CREATE_OUT"
  SERVICE_ARN=$(aws apprunner list-services --region "$REGION" --query "ServiceSummaryList[?ServiceName=='$APP_RUNNER_SERVICE'].ServiceArn | [0]" --output text)
  if [ -z "$SERVICE_ARN" ]; then
    echo "Unable to create or find App Runner service. Exiting."
    exit 1
  fi
fi

echo "Waiting for App Runner service to be RUNNING..."
while true; do
  SVC_STATUS=$(aws apprunner describe-service --service-arn "$SERVICE_ARN" --region "$REGION" --query 'Service.Status' --output text)
  echo "Service status: $SVC_STATUS"
  if [[ "$SVC_STATUS" == "RUNNING" ]]; then
    break
  fi
  if [[ "$SVC_STATUS" == "FAILED" ]]; then
    echo "App Runner failed to start."
    aws apprunner describe-service --service-arn "$SERVICE_ARN" --region "$REGION" --output json
    exit 1
  fi
  sleep 8
done

SERVICE_URL=$(aws apprunner describe-service --service-arn "$SERVICE_ARN" --region "$REGION" --query 'Service.ServiceUrl' --output text)
echo "App Runner is running. Public URL:"
echo "$SERVICE_URL"
