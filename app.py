import subprocess
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
FRONTEND_DIST = os.path.join(FRONTEND_DIR, "dist")
BACKEND_DIR = os.path.join(BASE_DIR, "backend")

# ──────────────────────────────────────────────
# 1. Build frontend if dist/ doesn't exist yet
# ──────────────────────────────────────────────
if not os.path.exists(FRONTEND_DIST):
    print("[startup] Building frontend...")
    try:
        subprocess.run(["npm", "install"], cwd=FRONTEND_DIR, check=True)
        subprocess.run(["npm", "run", "build"], cwd=FRONTEND_DIR, check=True)
        print("[startup] Frontend build complete.")
    except FileNotFoundError:
        print("[startup] npm not found, attempting to install Node.js...")
        try:
            subprocess.run(["apt-get", "update", "-qq"], check=True)
            subprocess.run(
                ["apt-get", "install", "-y", "-qq", "nodejs", "npm"],
                check=True,
            )
            subprocess.run(["npm", "install"], cwd=FRONTEND_DIR, check=True)
            subprocess.run(["npm", "run", "build"], cwd=FRONTEND_DIR, check=True)
            print("[startup] Frontend build complete (after installing Node.js).")
        except Exception as e:
            print(f"[startup] WARNING: frontend build failed: {e}")
    except subprocess.CalledProcessError as e:
        print(f"[startup] WARNING: frontend build error: {e}")
else:
    print("[startup] Frontend dist/ already exists, skipping build.")

# ──────────────────────────────────────────────
# 2. Install backend dependencies & set up FastAPI
# ──────────────────────────────────────────────
reqs_file = os.path.join(BACKEND_DIR, "requirements.txt")
if os.path.exists(reqs_file):
    print("[startup] Installing backend dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-q", "-r", reqs_file], check=True)

sys.path.insert(0, BACKEND_DIR)
os.chdir(BACKEND_DIR)

from main import app  # noqa: E402

# ──────────────────────────────────────────────
# 3. Serve frontend static files (if built)
# ──────────────────────────────────────────────
if os.path.exists(FRONTEND_DIST):
    from fastapi.staticfiles import StaticFiles

    # Mount at "/" AFTER API routes so /api/* still resolves first
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
    print(f"[startup] Serving frontend from {FRONTEND_DIST}")
else:
    print("[startup] No frontend dist/ found; serving API only.")

# ──────────────────────────────────────────────
# 4. Run uvicorn
# ──────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("DATABRICKS_APP_PORT", "8000"))
    print(f"[startup] Starting uvicorn on 0.0.0.0:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
