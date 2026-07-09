### Multi-stage Dockerfile: build frontend, run FastAPI backend

FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
COPY frontend/ ./
RUN npm ci --silent && npm run build

FROM python:3.11-slim
WORKDIR /app

# Install system deps needed by some Python packages and for runtime
RUN apt-get update && apt-get install -y --no-install-recommends build-essential curl ca-certificates && rm -rf /var/lib/apt/lists/*

# Create virtualenv
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip and install backend requirements
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy application files
COPY backend /app/backend
COPY app.py /app/app.py

# Copy built frontend into expected location
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

ENV DATABRICKS_APP_PORT=8000
EXPOSE 8000

CMD ["python", "app.py"]
