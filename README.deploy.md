Deployment to Fly.io (recommended)

1. Install Fly CLI if needed:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```
2. Log in and initialize the app:
   ```bash
   flyctl auth login
   cd /Users/gowtham/Downloads/plant-dashboard
   flyctl apps create plant-dashboard --org personal
   ```
3. Deploy the app:
   ```bash
   flyctl deploy
   ```
4. If you need to update environment variables later:
   ```bash
   flyctl secrets set DATABRICKS_APP_PORT=8000
   ```

Notes:
- `fly.toml` is configured to use the existing `Dockerfile` and listen on port `8000`.
- The Dockerfile builds the frontend, installs Python dependencies, and starts `app.py`.
- `app.py` reads `DATABRICKS_APP_PORT` and serves the built frontend from `/frontend/dist`.

Local test before push:
```bash
# Build image locally and run
docker build -t plant-dashboard:local .
docker run -p 8000:8000 plant-dashboard:local
```

When deployed, Fly.io provides a public URL for your service.
