"""
PARAMETERS CONFIGURATION
========================
Single source of truth for all plant parameters.

To add a new parameter:
  1. Add entry to the relevant dashboard section below
  2. Update frontend layout if needed (src/utils/config.js)

To add a new dashboard:
  1. Add new key to DASHBOARDS dict
  2. Add corresponding frontend section

Structure:
  DASHBOARDS = {
    "dashboard_name": {
      "machine_id": <int>,          # Covacsis machine ID
      "description": "...",
      "parameters": [
        {
          "id": <int>,              # Covacsis parameter ID
          "name": "Display Name",
          "unit": "unit",
          "category": "Section Name",
        },
        ...
      ]
    }
  }
"""

# ============================================================
# DATABASE CONFIGURATION (PostgreSQL)
# ============================================================
DB_CONFIG = {
    "host": "216.48.180.239",
    "port": 3306,
    "database": "covacsis",
    "user": "covacsis",
    "password": "covacsis123",
}

# Table that stores raw parameter values
DB_TABLE = "raw_parameter_fact"

# Legacy API config (kept as fallback, not used when DB is available)
API_URL = "https://hindalco-belagavi.covacsis.com/api/third-party/raw-param/facts/dynamic-query"
API_AUTH = ("report", "ipf@2014")

# ============================================================
# DASHBOARDS & PARAMETERS
# ============================================================
DASHBOARDS = {

    # --------------------------------------------------------
    # DASHBOARD 1: EFFICIENCY & KEY KPIs
    # --------------------------------------------------------
    "efficiency": {
        "machine_id": 18,
        "description": "Key Efficiencies & Hydrate Quality",
        "parameters": [
            # --- Feed Hydrate Quality ---
            {"id": 1441, "name": "PSD +100", "unit": "%", "category": "Feed Hydrate Quality"},
            {"id": 1442, "name": "PSD +200", "unit": "%", "category": "Feed Hydrate Quality"},
            {"id": 1448, "name": "PSD +325", "unit": "%", "category": "Feed Hydrate Quality"},
            {"id": 1449, "name": "SODA", "unit": "%", "category": "Feed Hydrate Quality"},
            {"id": 1443, "name": "PSD D50", "unit": "micron", "category": "Feed Hydrate Quality"},

            # --- Production ---
            {"id": 1444, "name": "Hydrate Production", "unit": "T", "category": "Production"},
            {"id": 1445, "name": "Evacuation", "unit": "T", "category": "Production"},

            # --- Key Efficiencies ---
            {"id": 1446, "name": "Bx Factor", "unit": "T/T", "category": "Key Efficiencies"},
            {"id": 1447, "name": "Total Steam", "unit": "T/T", "category": "Key Efficiencies"},
            {"id": 1450, "name": "Hydrate Power", "unit": "kWh/T", "category": "Key Efficiencies"},
            {"id": 1451, "name": "Caustic Soda Loss", "unit": "kg/T", "category": "Key Efficiencies"},
            {"id": 1452, "name": "Last Wash Soda", "unit": "gpl", "category": "Key Efficiencies"},

            # --- Bauxite Quality ---
            {"id": 1453, "name": "THA", "unit": "%", "category": "Bauxite Quality"},
            {"id": 1454, "name": "K Silica", "unit": "%", "category": "Bauxite Quality"},
            {"id": 1455, "name": "Slurry Density", "unit": "gm/cc", "category": "Bauxite Quality"},
            {"id": 1456, "name": "Slurry Charge", "unit": "m3/h", "category": "Bauxite Quality"},

            # --- Mixed Liquor Flow ---
            {"id": 1457, "name": "Total Mixed Liq Flow", "unit": "m3/h", "category": "Mixed Liquor Flow"},
            {"id": 1458, "name": "PGL Flow", "unit": "m3/h", "category": "Mixed Liquor Flow"},
        ]
    },

    # --------------------------------------------------------
    # DASHBOARD 2: DIGESTION
    # --------------------------------------------------------
    "digestion": {
        "machine_id": 18,
        "description": "Digestion Reactor Operations",
        "parameters": [
            {"id": 1501, "name": "Autoclave 1 Temp", "unit": "\u00b0C", "category": "Temperature Profile"},
            {"id": 1502, "name": "Autoclave 2 Temp", "unit": "\u00b0C", "category": "Temperature Profile"},
            {"id": 1503, "name": "Autoclave 3 Temp", "unit": "\u00b0C", "category": "Temperature Profile"},
            {"id": 1504, "name": "Reactor 1 Pressure", "unit": "MPa", "category": "Pressure & Density"},
            {"id": 1505, "name": "Digestion Feed Density", "unit": "g/L", "category": "Pressure & Density"},
            {"id": 1506, "name": "Caustic Strength", "unit": "g/L", "category": "Pressure & Density"},
            {"id": 1507, "name": "Steam Supply Flow", "unit": "t/h", "category": "Steam & Heat Recovery"},
            {"id": 1508, "name": "Flash Steam Recovery", "unit": "t/h", "category": "Steam & Heat Recovery"},
        ]
    },

    # --------------------------------------------------------
    # DASHBOARD 3: CALCINATION
    # --------------------------------------------------------
    "calcination": {
        "machine_id": 18,
        "description": "Fluidized Bed Alumina Calciner",
        "parameters": [
            {"id": 1531, "name": "Furnace Chamber Temp", "unit": "\u00b0C", "category": "Burner Thermodynamics"},
            {"id": 1532, "name": "Burner Fuel Gas Flow", "unit": "Nm3/h", "category": "Burner Thermodynamics"},
            {"id": 1533, "name": "Primary Combustion Air", "unit": "m3/h", "category": "Burner Thermodynamics"},
            {"id": 1534, "name": "Preheater Cyclone Temp", "unit": "\u00b0C", "category": "Product & Gas Cooling"},
            {"id": 1535, "name": "Alumina Cooler Exit Temp", "unit": "\u00b0C", "category": "Product & Gas Cooling"},
            {"id": 1536, "name": "Loss on Ignition (LOI)", "unit": "%", "category": "Quality Analytics"},
            {"id": 1537, "name": "Specific Gas Consumed", "unit": "Nm3/t", "category": "Quality Analytics"},
        ]
    },

    # --------------------------------------------------------
    # DASHBOARD 4: STEAM & POWER
    # --------------------------------------------------------
    "steam_power": {
        "machine_id": 18,
        "description": "Steam Generation & Cogen Power House",
        "parameters": [
            {"id": 1561, "name": "HP Steam Flow", "unit": "t/h", "category": "Steam House"},
            {"id": 1562, "name": "MP Steam Flow", "unit": "t/h", "category": "Steam House"},
            {"id": 1563, "name": "LP Steam Flow", "unit": "t/h", "category": "Steam House"},
            {"id": 1564, "name": "Cogen Turbine Generator", "unit": "MW", "category": "Electricity"},
            {"id": 1565, "name": "Grid Power Export", "unit": "MW", "category": "Electricity"},
            {"id": 1566, "name": "Boiler Thermal Efficiency", "unit": "%", "category": "Electricity"},
        ]
    },

    # --------------------------------------------------------
    # DASHBOARD 5: WATER & CONDENSATE
    # --------------------------------------------------------
    "water_condensate": {
        "machine_id": 18,
        "description": "Water Intake, Recirculation & Recovery",
        "parameters": [
            {"id": 1571, "name": "Raw Water Intake", "unit": "m3/h", "category": "Water Balance"},
            {"id": 1572, "name": "Process Water Flow", "unit": "m3/h", "category": "Water Balance"},
            {"id": 1573, "name": "Condensate Return Flow", "unit": "m3/h", "category": "Condensate Loop"},
            {"id": 1574, "name": "Condensate Recovery Ratio", "unit": "%", "category": "Condensate Loop"},
        ]
    },

    # --------------------------------------------------------
    # DASHBOARD 6: DISPATCH
    # --------------------------------------------------------
    "dispatch": {
        "machine_id": 18,
        "description": "Alumina Dispatch & Evacuation Silos",
        "parameters": [
            {"id": 1444, "name": "Hydrate Production", "unit": "T", "category": "Dispatch"},
            {"id": 1445, "name": "Evacuation", "unit": "T", "category": "Dispatch"},
        ]
    },
}


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_dashboard_config(name):
    """Get dashboard config by name. Returns (machine_id, param_ids, meta) or None."""
    dash = DASHBOARDS.get(name)
    if not dash:
        return None

    machine_id = dash["machine_id"]
    param_ids = [p["id"] for p in dash["parameters"]]
    meta = {
        p["id"]: {"name": p["name"], "unit": p["unit"], "category": p["category"]}
        for p in dash["parameters"]
    }
    return machine_id, param_ids, meta


def get_all_dashboards():
    """Return list of all dashboard names and descriptions."""
    return [
        {"name": name, "description": cfg["description"]}
        for name, cfg in DASHBOARDS.items()
    ]


def get_parameters_by_category(name):
    """Return parameters grouped by category for a dashboard."""
    dash = DASHBOARDS.get(name)
    if not dash:
        return {}

    grouped = {}
    for p in dash["parameters"]:
        cat = p["category"]
        if cat not in grouped:
            grouped[cat] = []
        grouped[cat].append(p)
    return grouped
