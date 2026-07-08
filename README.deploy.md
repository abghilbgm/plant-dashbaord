Deployment to Render (recommended)

1. Create a free account on Render (https://render.com).
2. Create a new Web Service.
   - Connect your GitHub repo (or push this repo to GitHub first).
   - Choose "Docker" as the environment.
   - Point Render to the repository and root `Dockerfile`.
   - For the free plan, select `free` and enable auto-deploy from the selected branch.
3. Environment variables (optional):
   - `DATABRICKS_APP_PORT` — default 8000 (Dockerfile sets it).
4. Render will build the Docker image, run migrations (none), and expose your app.

Notes:
- The Dockerfile builds the frontend with Node, then installs Python deps and runs `app.py`.
- If you prefer not to use Docker, you can create two services: a static site for `frontend/dist` and a Python web service for `backend` (advanced).

Local test before push:

```bash
# Build image locally and run
docker build -t plant-dashboard:local .
docker run -p 8000:8000 plant-dashboard:local
```

When deployed, Render provides a public URL for your service.
