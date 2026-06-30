from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pymysql
import pymysql.cursors
from datetime import datetime, timedelta
import random
import warnings

warnings.filterwarnings("ignore")

from params_config import get_dashboard_config, get_all_dashboards, DB_CONFIG, DB_TABLE, COL_MACHINE, COL_PARAMETER, COL_VALUE, COL_TIMESTAMP

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- DATABASE CONNECTION ----------
def get_db():
    return pymysql.connect(
        host=DB_CONFIG["host"],
        port=DB_CONFIG["port"],
        database=DB_CONFIG["database"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        cursorclass=pymysql.cursors.DictCursor
    )


def query_db(sql, params=None):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            return cur.fetchall()
    finally:
        conn.close()

# ---------- CONFIG (from params_config.py) ----------
def get_config(name):
    return get_dashboard_config(name)


# ---------- DATABASE QUERIES ----------
def fetch_param_avg(machine_name, param_names, start_dt, end_dt):
    """
    Query raw_parameter_fact for AVG value of parameters in a date range.
    Uses parameter NAMES (not IDs).
    Returns: {param_name: avg_value}
    """
    if not param_names:
        return {}
    try:
        placeholders = ", ".join(["%s"] * len(param_names))
        sql = f"""
            SELECT {COL_PARAMETER} as param_name, AVG({COL_VALUE} + 0.0) as avg_value
            FROM {DB_TABLE}
            WHERE {COL_MACHINE} = %s
              AND {COL_PARAMETER} IN ({placeholders})
              AND {COL_TIMESTAMP} >= %s
              AND {COL_TIMESTAMP} <= %s
            GROUP BY {COL_PARAMETER}
        """
        params = [machine_name] + list(param_names) + [start_dt, end_dt]
        rows = query_db(sql, params)
        return {
            row["param_name"]: round(float(row["avg_value"]), 3) if row["avg_value"] else None
            for row in rows
        }
    except Exception as e:
        print(f"[DB ERROR] fetch_param_avg: {e}")
        return {}


def fetch_param_hourly(machine_name, param_names, date_dt):
    """
    Query raw_parameter_fact for hourly averages for trend charts.
    Uses parameter NAMES.
    Returns: {param_name: [{time: "HH:00", value: float}, ...]}
    """
    if not param_names:
        return {}
    try:
        placeholders = ", ".join(["%s"] * len(param_names))
        sql = f"""
            SELECT {COL_PARAMETER} as param_name,
                   EXTRACT(HOUR FROM {COL_TIMESTAMP}) as hour,
                   AVG({COL_VALUE} + 0.0) as avg_value
            FROM {DB_TABLE}
            WHERE {COL_MACHINE} = %s
              AND {COL_PARAMETER} IN ({placeholders})
              AND {COL_TIMESTAMP} >= %s
              AND {COL_TIMESTAMP} < %s
            GROUP BY {COL_PARAMETER}, EXTRACT(HOUR FROM {COL_TIMESTAMP})
            ORDER BY {COL_PARAMETER}, hour
        """
        start_dt = date_dt.replace(hour=0, minute=0, second=0)
        end_dt = start_dt + timedelta(days=1)
        params = [machine_name] + list(param_names) + [start_dt, end_dt]
        rows = query_db(sql, params)

        result = {name: [] for name in param_names}
        hourly = {}
        for row in rows:
            pname = row["param_name"]
            h = int(row["hour"])
            if pname not in hourly:
                hourly[pname] = {}
            hourly[pname][h] = round(float(row["avg_value"]), 2) if row["avg_value"] else None

        for name in param_names:
            for h in range(24):
                val = hourly.get(name, {}).get(h)
                result[name].append({"time": f"{h:02d}:00", "value": val})

        return result
    except Exception as e:
        print(f"[DB ERROR] fetch_param_hourly: {e}")
        return {name: [] for name in param_names}


# ---------- API ENDPOINTS ----------

@app.get("/api/dashboards")
def list_dashboards():
    return get_all_dashboards()


@app.get("/api/schema")
def db_schema():
    """Utility: discover raw_parameter_fact columns."""
    try:
        sql = "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = %s ORDER BY ordinal_position"
        rows = query_db(sql, (DB_TABLE,))
        return {"table": DB_TABLE, "columns": [dict(r) for r in rows]}
    except Exception as e:
        return {"error": str(e)}


@app.get("/api/dashboard/{name}")
def dashboard(name: str, date: str = None):
    config = get_config(name)
    if not config:
        return {"error": "not found"}

    machine_name, param_names, meta = config

    # Calculate date ranges
    try:
        dt = datetime.strptime(date, "%Y-%m-%d") if date else datetime.now()
    except (ValueError, TypeError):
        dt = datetime.now()

    today_start = dt.replace(hour=0, minute=0, second=0)
    today_end = dt.replace(hour=23, minute=59, second=59)
    yesterday_start = today_start - timedelta(days=1)
    yesterday_end = today_end - timedelta(days=1)
    month_start = dt.replace(day=1, hour=0, minute=0, second=0)

    # Query PostgreSQL by parameter NAME
    today_vals = fetch_param_avg(machine_name, param_names, today_start, today_end)
    yesterday_vals = fetch_param_avg(machine_name, param_names, yesterday_start, yesterday_end)
    
    # Fetch day-before-yesterday as fallback
    dby_start = today_start - timedelta(days=2)
    dby_end = today_end - timedelta(days=2)
    dby_vals = fetch_param_avg(machine_name, param_names, dby_start, dby_end)
    
    mtd_vals = fetch_param_avg(machine_name, param_names, month_start, today_end)

    # Build output
    parameters_output = []
    for pname in param_names:
        yesterday_val = yesterday_vals.get(pname)
        if yesterday_val is None:
            yesterday_val = dby_vals.get(pname)
            
        parameters_output.append({
            "name": pname,
            "category": meta.get(pname, {}).get("category", ""),
            "today": today_vals.get(pname),
            "yesterday": yesterday_val,
            "mtd": mtd_vals.get(pname),
        })

    return {
        "dashboard": name,
        "machine": machine_name,
        "date": date,
        "parameters": parameters_output
    }


@app.get("/api/trend/{name}")
def trend(name: str, date: str = None):
    config = get_config(name)
    if not config:
        return {"error": "not found"}

    machine_name, param_names, meta = config
    try:
        dt = datetime.strptime(date, "%Y-%m-%d") if date else datetime.now()
    except (ValueError, TypeError):
        dt = datetime.now()

    # Query PostgreSQL for hourly trend by NAME
    result = fetch_param_hourly(machine_name, param_names, dt)

    return {"dashboard": name, "machine": machine_name, "date": date, "trend": result}
