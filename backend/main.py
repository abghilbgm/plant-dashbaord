from fastapi import FastAPI
import requests
import sqlite3
from datetime import datetime, timedelta
import warnings

warnings.filterwarnings("ignore")

app = FastAPI()

API_URL = "https://hindalco-belagavi.covacsis.com/api/third-party/raw-param/facts/dynamic-query"
AUTH = ("report", "ipf@2014")


# ---------- DB ----------
def get_config(name):

    con = sqlite3.connect("database.db")
    cur = con.cursor()

    cur.execute("SELECT machine_id FROM dashboards WHERE name=?", (name,))
    row = cur.fetchone()

    if not row:
        return None

    machine_id = row[0]

    cur.execute("""
        SELECT parameter_id, display_name, unit
        FROM parameters
        WHERE dashboard_name=?
        ORDER BY display_order
    """, (name,))

    rows = cur.fetchall()
    con.close()

    param_ids = []
    meta = {}

    for r in rows:
        pid = r[0]
        param_ids.append(pid)
        meta[pid] = {"name": r[1], "unit": r[2]}

    return machine_id, param_ids, meta


# ---------- TIME ----------
def get_epoch(date, hour=None):

    if hour is None:
        start = datetime.strptime(date + " 00:00:00", "%Y-%m-%d %H:%M:%S")
        end = datetime.strptime(date + " 23:59:59", "%Y-%m-%d %H:%M:%S")
    else:
        start = datetime.strptime(date, "%Y-%m-%d") + timedelta(hours=hour)
        end = start + timedelta(hours=1)

    return int(start.timestamp() * 1000), int(end.timestamp() * 1000)


# ---------- API CALL ----------
def fetch(machine_id, param_ids, start, end):

    payload = [
        {
            "machineId": machine_id,
            "parameterId": pid,
            "minDate": start,
            "maxDate": end
        }
        for pid in param_ids
    ]

    res = requests.post(API_URL, json=payload, auth=AUTH, verify=False)

    if res.status_code != 200:
        return []

    return res.json()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/data")
def get_data():
    return [
        {"timestamp": "10:00", "hydrate": 120, "calcination": 95},
        {"timestamp": "11:00", "hydrate": 130, "calcination": 100},
    ]
# ---------- DASHBOARD ----------
@app.get("/api/dashboard/{name}")
def dashboard(name: str, date: str):

    config = get_config(name)
    if not config:
        return {"error": "not found"}

    machine_id, param_ids, meta = config

    start, end = get_epoch(date)

    raw = fetch(machine_id, param_ids, start, end)

    output = []

    for item in raw:
        pid = item["parameterId"]

        output.append({
            "parameterId": pid,
            "name": meta[pid]["name"],
            "value": item.get("meanValue"),
            "unit": meta[pid]["unit"]
        })

    return {"parameters": output}


# ---------- TREND ----------
@app.get("/api/trend/{name}")
def trend(name: str, date: str):

    config = get_config(name)
    if not config:
        return {"error": "not found"}

    machine_id, param_ids, _ = config

    result = {pid: [] for pid in param_ids}

    for h in range(24):
        start, end = get_epoch(date, h)

        raw = fetch(machine_id, param_ids, start, end)

        for item in raw:
            pid = item["parameterId"]

            result[pid].append({
                "time": f"{h:02d}:00",
                "value": item.get("meanValue")
            })

    return result