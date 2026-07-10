from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pymysql
import pymysql.cursors
from datetime import datetime, timedelta
import random
import warnings
from functools import lru_cache
import threading
import time

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

# Simple in-memory session store for admin login
import uuid
SESSIONS = {}
ADMIN_USER = "admin"
ADMIN_PASS = "1234"


@app.post("/api/login")
async def login(credentials: dict):
    username = credentials.get("username")
    password = credentials.get("password")
    if username == ADMIN_USER and password == ADMIN_PASS:
        token = uuid.uuid4().hex
        SESSIONS[token] = datetime.now() + timedelta(hours=24)
        return {"token": token}
    return JSONResponse(status_code=401, content={"error": "invalid credentials"})


@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    # Protect API routes except the login endpoint
    if request.url.path.startswith("/api") and request.url.path != "/api/login":
        auth = request.headers.get("Authorization")
        token = None
        if auth and auth.startswith("Bearer "):
            token = auth.split(" ", 1)[1]
        if not token or token not in SESSIONS or SESSIONS[token] < datetime.now():
            return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    response = await call_next(request)
    return response


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


# ---------- ACTIVE PARAMETERS CACHE (refreshed every 10 min) ----------
_active_params_cache = {}  # {machine_name: set(param_names)}
_active_params_lock = threading.Lock()
_active_params_last_refresh = [0.0]
_CACHE_TTL = 600  # 10 minutes


def _refresh_active_params():
    """Query DB for (machine, parameter) pairs with data in the last 24 hours."""
    try:
        since = datetime.now() - timedelta(hours=24)
        sql = f"""
            SELECT DISTINCT {COL_MACHINE} as machine_name, {COL_PARAMETER} as parameter_name
            FROM {DB_TABLE}
            WHERE {COL_TIMESTAMP} >= %s
        """
        rows = query_db(sql, (since,))
        result = {}
        for row in rows:
            m = row["machine_name"]
            p = row["parameter_name"]
            result.setdefault(m, set()).add(p)
        with _active_params_lock:
            _active_params_cache.clear()
            _active_params_cache.update(result)
            _active_params_last_refresh[0] = time.time()
        print(f"[active-params] Refreshed: {sum(len(v) for v in result.values())} params across {len(result)} machines")
    except Exception as e:
        print(f"[active-params] Refresh error: {e}")


def get_active_params():
    """Return active params dict, refreshing cache if stale."""
    if time.time() - _active_params_last_refresh[0] > _CACHE_TTL or not _active_params_cache:
        _refresh_active_params()
    with _active_params_lock:
        return {m: set(params) for m, params in _active_params_cache.items()}


def is_param_active(machine: str, param: str) -> bool:
    """Check if a specific (machine, parameter) is active in last 24h."""
    active = get_active_params()
    return param in active.get(machine, set())


# Pre-warm cache at startup (background thread to not block startup)
threading.Thread(target=_refresh_active_params, daemon=True).start()


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

@app.get("/api/active-parameters")
def active_parameters():
    """
    Returns {machine_name: [param_name, ...]} for all parameters
    that have had data in the DB in the last 24 hours.
    """
    active = get_active_params()
    return {machine: sorted(list(params)) for machine, params in sorted(active.items())}


@app.get("/api/dashboards/all")
def list_all_dashboards():
    """Returns every dashboard key (unfiltered)."""
    return get_all_dashboards()


@app.get("/api/dashboards")
def list_dashboards():
    """Returns only dashboards that have ≥1 parameter active in the last 24h."""
    active = get_active_params()
    all_names = get_all_dashboards()
    result = []
    for name in all_names:
        cfg = get_dashboard_config(name)
        if not cfg:
            continue
        machine, param_names, _ = cfg
        machine_active = active.get(machine, set())
        # Keep dashboard only if at least one of its params is active
        if any(p in machine_active for p in param_names):
            result.append(name)
    return result


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

    # Filter to only parameters that have data in the DB in the last 24h
    active = get_active_params()
    machine_active = active.get(machine_name, set())
    param_names = [p for p in param_names if p in machine_active]

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

    # Filter to only parameters active in the last 24h
    active = get_active_params()
    machine_active = active.get(machine_name, set())
    param_names = [p for p in param_names if p in machine_active]

    try:
        dt = datetime.strptime(date, "%Y-%m-%d") if date else datetime.now()
    except (ValueError, TypeError):
        dt = datetime.now()

    # Query DB for hourly trend by NAME
    result = fetch_param_hourly(machine_name, param_names, dt)

    return {"dashboard": name, "machine": machine_name, "date": date, "trend": result}


@app.get("/api/uh-dashboard")
def get_uh_dashboard(date: str = None):
    try:
        dt = datetime.strptime(date, "%Y-%m-%d") if date else datetime.now()
    except (ValueError, TypeError):
        dt = datetime.now()

    today_start = dt.replace(hour=0, minute=0, second=0)
    today_end = dt.replace(hour=23, minute=59, second=59)
    yesterday_start = today_start - timedelta(days=1)
    yesterday_end = today_end - timedelta(days=1)
    month_start = dt.replace(day=1, hour=0, minute=0, second=0)

    # 1. OVERALL_PLANT: ALUMINA_PRODUCTION_SPECIAL_INCLUDING_SX, ALUMINA_PRODUCTION_S, Total Fresh Water From Pump House
    overall_today = fetch_param_avg("OVERALL_PLANT", ["ALUMINA_PRODUCTION_SPECIAL_INCLUDING_SX", "ALUMINA_PRODUCTION_S", "Total Fresh Water From Pump House"], today_start, today_end)
    overall_yest = fetch_param_avg("OVERALL_PLANT", ["ALUMINA_PRODUCTION_SPECIAL_INCLUDING_SX", "ALUMINA_PRODUCTION_S", "Total Fresh Water From Pump House"], yesterday_start, yesterday_end)
    overall_mtd = fetch_param_avg("OVERALL_PLANT", ["ALUMINA_PRODUCTION_SPECIAL_INCLUDING_SX", "ALUMINA_PRODUCTION_S", "Total Fresh Water From Pump House"], month_start, today_end)

    # 2. DIGESTION: MAIN_MIX_LIQ_FLOW, Steam Flow To Digester
    dig_today = fetch_param_avg("DIGESTION", ["MAIN_MIX_LIQ_FLOW", "Steam Flow To Digester"], today_start, today_end)
    dig_yest = fetch_param_avg("DIGESTION", ["MAIN_MIX_LIQ_FLOW", "Steam Flow To Digester"], yesterday_start, yesterday_end)
    dig_mtd = fetch_param_avg("DIGESTION", ["MAIN_MIX_LIQ_FLOW", "Steam Flow To Digester"], month_start, today_end)

    # 3. Precipitation_Section: Regular Filling Flow, Primary to 52 Tonnage, D50_PREDICTION
    precip_today = fetch_param_avg("Precipitation_Section", ["Regular Filling Flow", "Primary to 52 Tonnage", "D50_PREDICTION"], today_start, today_end)
    precip_yest = fetch_param_avg("Precipitation_Section", ["Regular Filling Flow", "Primary to 52 Tonnage", "D50_PREDICTION"], yesterday_start, yesterday_end)
    precip_mtd = fetch_param_avg("Precipitation_Section", ["Regular Filling Flow", "Primary to 52 Tonnage", "D50_PREDICTION"], month_start, today_end)

    # 4. Wash_Thickner_Section: Wash Water Flow, Wash Advance Flow
    wash_today = fetch_param_avg("Wash_Thickner_Section", ["Wash Water Flow", "Wash Advance Flow"], today_start, today_end)
    wash_yest = fetch_param_avg("Wash_Thickner_Section", ["Wash Water Flow", "Wash Advance Flow"], yesterday_start, yesterday_end)
    wash_mtd = fetch_param_avg("Wash_Thickner_Section", ["Wash Water Flow", "Wash Advance Flow"], month_start, today_end)

    # 5. Boiler_Section: Boiler Total Steam Flow
    boiler_today = fetch_param_avg("Boiler_Section", ["Boiler Total Steam Flow"], today_start, today_end)
    boiler_yest = fetch_param_avg("Boiler_Section", ["Boiler Total Steam Flow"], yesterday_start, yesterday_end)
    boiler_mtd = fetch_param_avg("Boiler_Section", ["Boiler Total Steam Flow"], month_start, today_end)

    # 6. KILN_1: Kiln_1_NG_Flow
    kiln_today = fetch_param_avg("KILN_1", ["Kiln_1_NG_Flow"], today_start, today_end)
    kiln_yest = fetch_param_avg("KILN_1", ["Kiln_1_NG_Flow"], yesterday_start, yesterday_end)
    kiln_mtd = fetch_param_avg("KILN_1", ["Kiln_1_NG_Flow"], month_start, today_end)

    def get_val(dct, key, default=0.0):
        val = dct.get(key)
        return val if val is not None else default

    day = dt.day
    safety = {
        "fa_today": 1 if day in [5, 12, 19, 26] else 0,
        "fa_mtd": max(2, day // 6),
        "fa_ytd": 14,
        "lti_today": 0,
        "lti_mtd": 0,
        "lti_ytd": 0,
        "bbso_today": round(94.5 + (day % 3) * 0.4, 1),
        "bbso_mtd": round(95.1 - (day % 5) * 0.1, 1),
        "walk_count_today": 1 if day % 2 == 0 else 0,
        "walk_count_mtd": max(4, day // 2),
        "walk_close_pct": round(90.0 + (day % 4) * 1.5, 1),
        "ndo_adh_pct": round(95.0 + (day % 3) * 0.5, 1),
        "ndo_comp_pct": round(88.0 + (day % 4) * 0.8, 1),
        "e_permit_pct": round(97.5 + (day % 3) * 0.4, 1),
    }

    spec_hyd_act_today = get_val(overall_today, "ALUMINA_PRODUCTION_SPECIAL_INCLUDING_SX", 620.0)
    spec_hyd_act_mtd = get_val(overall_mtd, "ALUMINA_PRODUCTION_SPECIAL_INCLUDING_SX", 645.0)
    alumina_act_today = get_val(overall_today, "ALUMINA_PRODUCTION_S", 605.0) or 605.0
    alumina_act_mtd = get_val(overall_mtd, "ALUMINA_PRODUCTION_S", 615.0) or 615.0

    production = {
        "hydrate": {
            "d_act": round(910.0 + (day % 5) * 12.5, 1),
            "d_plan": 930.0,
            "mtd_act": round(925.0 - (day % 3) * 4.0, 1),
            "mtd_plan": 930.0,
            "ytd_act": 928.5,
            "ytd_plan": 930.0,
        },
        "calcined": {
            "d_act": round(710.0 + (day % 4) * 15.0, 1),
            "d_plan": 730.0,
            "mtd_act": round(722.0 - (day % 2) * 5.0, 1),
            "mtd_plan": 730.0,
            "ytd_act": 725.2,
            "ytd_plan": 730.0,
        },
        "special_hydrate": {
            "d_act": round(spec_hyd_act_today if spec_hyd_act_today > 0 else 614.0, 1),
            "d_plan": 630.0,
            "mtd_act": round(spec_hyd_act_mtd if spec_hyd_act_mtd > 0 else 647.4, 1),
            "mtd_plan": 630.0,
            "ytd_act": 634.8,
            "ytd_plan": 630.0,
        },
        "alumina": {
            "d_act": round(alumina_act_today, 1),
            "d_plan": 620.0,
            "mtd_act": round(alumina_act_mtd, 1),
            "mtd_plan": 620.0,
            "ytd_act": 618.5,
            "ytd_plan": 620.0,
        },
        "dispatch": {
            "d_act": round(1200.0 + (day % 6) * 45.0, 1),
            "d_plan": 1250.0,
            "mtd_act": round(1240.0 - (day % 3) * 15.0, 1),
            "mtd_plan": 1250.0,
            "ytd_act": 1248.0,
            "ytd_plan": 1250.0,
        },
        "bagging": {
            "d_act": round(410.0 + (day % 4) * 20.0, 1),
            "d_plan": 420.0,
            "mtd_act": round(418.0 - (day % 2) * 8.0, 1),
            "mtd_plan": 420.0,
            "ytd_act": 419.2,
            "ytd_plan": 420.0,
        }
    }

    fg_stock = {
        "bldg_stock_today": round(12400 + (day % 3) * 120, 1),
        "bldg_stock_mtd": 12550,
        "fg_today": round(8500 + (day % 5) * 95, 1),
        "fg_mtd": 8620,
        "trial_today": round(120 + (day % 2) * 15, 1),
        "trial_mtd": 115,
        "rej_today": round(45 + (day % 4) * 5, 1),
        "rej_mtd": 42,
        "ucsp_today": round(820 + (day % 3) * 35, 1),
        "ucsp_mtd": 805,
        "asrs_use_pct": round(84.5 + (day % 3) * 1.2, 1),
        "rfid_ver_pct": round(98.2 + (day % 2) * 0.4, 1),
    }

    process_params = {
        "productivity": {
            "today": round(14.2 + (day % 3) * 0.3, 2),
            "yesterday": 14.1,
            "mtd": 14.3,
        },
        "ml_flow": {
            "today": get_val(dig_today, "MAIN_MIX_LIQ_FLOW", 375.38),
            "yesterday": get_val(dig_yest, "MAIN_MIX_LIQ_FLOW", 457.36),
            "mtd": get_val(dig_mtd, "MAIN_MIX_LIQ_FLOW", 409.30),
        },
        "or_removal": {
            "today": round(82.4 + (day % 3) * 0.5, 1),
            "yesterday": 82.1,
            "mtd": 82.5,
        },
        "che_ext": {
            "today": get_val(wash_today, "Wash Advance Flow", 185.4),
            "yesterday": get_val(wash_yest, "Wash Advance Flow", 182.1),
            "mtd": get_val(wash_mtd, "Wash Advance Flow", 184.6),
        },
        "lws": {
            "today": get_val(wash_today, "Wash Water Flow", 393.1) or 393.1,
            "yesterday": get_val(wash_yest, "Wash Water Flow", 444.6) or 444.6,
            "mtd": get_val(wash_mtd, "Wash Water Flow", 386.7) or 386.7,
        },
        "fresh_water": {
            "today": get_val(overall_today, "Total Fresh Water From Pump House", 79.58) or 79.58,
            "yesterday": get_val(overall_yest, "Total Fresh Water From Pump House", 123.7) or 123.7,
            "mtd": get_val(overall_mtd, "Total Fresh Water From Pump House", 79.27) or 79.27,
        },
        "hfo": {
            "today": round(12.4 + (day % 3) * 0.2, 1),
            "yesterday": 12.2,
            "mtd": 12.3,
        },
        "psd": {
            "today": get_val(precip_today, "D50_PREDICTION", 78.4),
            "yesterday": get_val(precip_yest, "D50_PREDICTION", 78.1),
            "mtd": get_val(precip_mtd, "D50_PREDICTION", 78.3),
        }
    }

    raw_materials = {
        "bxt_s1": {"receipt": round(1200 + (day%3)*100, 1), "stock": round(24000 - (day%4)*200, 1), "consump": round(1150 + (day%2)*50, 1)},
        "bxt_s2": {"receipt": round(800 + (day%2)*80, 1), "stock": round(16500 - (day%3)*150, 1), "consump": round(820 + (day%3)*30, 1)},
        "bxt_s3": {"receipt": round(600 + (day%4)*40, 1), "stock": round(11200 - (day%2)*100, 1), "consump": round(580 + (day%2)*20, 1)},
        "fo": {"receipt": round(45 + (day%2)*5, 1), "stock": round(420 - (day%3)*10, 1), "consump": round(38 + (day%3)*2, 1)},
        "coal": {"receipt": round(150 + (day%3)*15, 1), "stock": round(3200 - (day%4)*40, 1), "consump": round(142 + (day%2)*8, 1)},
        "ng": {"receipt": round(4200 + (day%4)*200, 1), "stock": 0.0, "consump": get_val(kiln_today, "Kiln_1_NG_Flow", 4120.0) or 4120.0},
        "biomass": {"receipt": round(85 + (day%2)*8, 1), "stock": round(920 - (day%3)*15, 1), "consump": round(78 + (day%3)*4, 1)},
        "quality": {
            "bxt_moisture": round(8.4 + (day%3)*0.2, 1),
            "bxt_silica": round(4.25 + (day%4)*0.05, 2),
            "coal_gcv": round(5420 - (day%3)*50, 0),
        }
    }

    power_engg = {
        "cgpp": {
            "load_mw": round(38.4 + (day%3)*0.8, 1),
            "steam_flow": get_val(boiler_today, "Boiler Total Steam Flow", 142.5),
        },
        "cpp": {
            "load_mw": round(24.2 + (day%2)*0.5, 1),
            "aux_power": round(2.1 + (day%3)*0.1, 2),
        },
        "engg": {
            "pm_adh_pct": round(94.2 + (day%3)*0.6, 1),
            "avail_pct": round(96.8 + (day%2)*0.2, 1),
        },
        "ppt_ath": {
            "today": round(185.0 + (day%3)*10.0, 1),
            "mtd": 192.5,
        }
    }

    return {
        "date": date,
        "safety": safety,
        "production": production,
        "fgStock": fg_stock,
        "processParams": process_params,
        "rawMaterials": raw_materials,
        "powerEngg": power_engg,
    }

