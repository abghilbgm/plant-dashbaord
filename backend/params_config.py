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
    "dashboard_key": {
      "machine": "Exact Machine Name",   # from DB master list
      "description": "...",
      "parameters": [
        {
          "name": "Exact Parameter Name",  # from DB master list
          "category": "UI Section",
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

# Column names in raw_parameter_fact
COL_MACHINE = "machine_name"     # adjust if different
COL_PARAMETER = "parameter_name" # adjust if different
COL_VALUE = "value"              # adjust if different
COL_TIMESTAMP = "timestamp"      # adjust if different

# ============================================================
# DASHBOARDS & PARAMETERS
# ============================================================
DASHBOARDS = {

    # --------------------------------------------------------
    # OVERALL PLANT KPIs
    # --------------------------------------------------------
    "overall_plant": {
        "description": "Plant-wide Production & Efficiency",
        "machine": "OVERALL_PLANT",
        "parameters": [
            {"name": "Hydrate", "category": "Production"},
            {"name": "Bauxite Consumption", "category": "Raw Material"},
            {"name": "Bauxite FOM", "category": "Raw Material"},
            {"name": "Bauxite Receipt Own", "category": "Raw Material"},
            {"name": "Lime Cao", "category": "Raw Material"},
            {"name": "Energy For Hydrate", "category": "Efficiency"},
            {"name": "Boiler Oil", "category": "Efficiency"},
            {"name": "Caustic Charged", "category": "Efficiency"},
            {"name": "Caustic Soda (Liq With Residue)", "category": "Efficiency"},
            {"name": "Fresh Water Supply From Pump House", "category": "Water"},
            {"name": "Total Fresh Water From Pump House", "category": "Water"},
            {"name": "Mill Water to Standard Plant", "category": "Water"},
            {"name": "Mill Water to Specials Plant", "category": "Water"},
            {"name": "Lagoon Water (Treated)", "category": "Water"},
            {"name": "Hydrate PnB", "category": "Plan & Budget"},
            {"name": "Energy For Hydrate PnB", "category": "Plan & Budget"},
            {"name": "Boiler Oil PnB", "category": "Plan & Budget"},
            {"name": "Caustic Charged PnB", "category": "Plan & Budget"},
        ]
    },

    # --------------------------------------------------------
    # BOILER & STEAM
    # --------------------------------------------------------
    "boiler_steam": {
        "description": "Steam Generation & Distribution",
        "machine": "Boiler_Section",
        "parameters": [
            {"name": "Boiler Total Steam Flow", "category": "Steam"},
            {"name": "Steam Flow To Digester", "category": "Steam"},
            {"name": "Process Steam Flow", "category": "Steam"},
            {"name": "Steam Flow To 13A", "category": "Steam"},
            {"name": "Steam Flow To 13B", "category": "Steam"},
            {"name": "Auxilary Steam Flow", "category": "Steam"},
            {"name": "Evaporation Factor Steam", "category": "Efficiency"},
            {"name": "Make Up Water Flow", "category": "Water"},
            {"name": "Condensate Temperature", "category": "Temperature"},
            {"name": "Evaporation Factor Steam PnB", "category": "Plan & Budget"},
        ]
    },

    # --------------------------------------------------------
    # CALCINATION
    # --------------------------------------------------------
    "calcination": {
        "description": "Calcination Section",
        "machine": "Calcination_Section",
        "parameters": [
            {"name": "Total Sx Production", "category": "Production"},
            {"name": "Total Spls  Production", "category": "Production"},
            {"name": "Hydrate Cutting As Alumina", "category": "Production"},
            {"name": "Calcinable Hydrate Stock", "category": "Stock"},
            {"name": "NG Consumption SX", "category": "Energy"},
            {"name": "TOTAL_EVACUATION", "category": "Dispatch"},
            {"name": "Total Sx Production PnB", "category": "Plan & Budget"},
        ]
    },

    # --------------------------------------------------------
    # DIGESTION
    # --------------------------------------------------------
    "digestion": {
        "description": "Digestion Section",
        "machine": "DIGESTION",
        "parameters": [
            {"name": "SLURRY_FLOW", "category": "Flow"},
            {"name": "MIX_LIQUOR_FLOW", "category": "Flow"},
            {"name": "STEAM_FLOW_TO_LSH_AND_DIGESTER", "category": "Steam"},
            {"name": "DIGESTER_1_TEMPERATURE", "category": "Temperature"},
            {"name": "IBSH_OUTLET_TEMPERATURE", "category": "Temperature"},
            {"name": "LSH_OUTLET_TEMPERATURE", "category": "Temperature"},
            {"name": "BLOWOFF_SLURRY_OUTLET_TEMPERATURE", "category": "Temperature"},
            {"name": "PDS_TANK_HOLDING_TIME", "category": "Process"},
        ]
    },

    # --------------------------------------------------------
    # PRECIPITATION
    # --------------------------------------------------------
    "precipitation": {
        "description": "Precipitation Section",
        "machine": "Precipitation_Section",
        "parameters": [
            {"name": "PHE Inlet Temp", "category": "Temperature"},
            {"name": "PHE Outlet Temp", "category": "Temperature"},
            {"name": "Fine Seed Tonnage", "category": "Process"},
            {"name": "Coarse Seed 1 Tonnage", "category": "Process"},
            {"name": "Green Liq Flow", "category": "Flow"},
            {"name": "13A Steam Flow", "category": "Steam"},
            {"name": "13A RC Flow", "category": "Flow"},
            {"name": "Regular Filling Flow", "category": "Flow"},
        ]
    },

    # --------------------------------------------------------
    # EVAPORATION
    # --------------------------------------------------------
    "evaporation": {
        "description": "Evaporation Section",
        "machine": "Evaporatoration",
        "parameters": [
            {"name": "13A Steam Flow", "category": "Steam"},
            {"name": "13A RC Flow", "category": "Flow"},
            {"name": "Spent Liq Flow 13A", "category": "Flow"},
            {"name": "13A 1st Body Liq Temp", "category": "Temperature"},
            {"name": "13A 2nd Body Liq Temp", "category": "Temperature"},
            {"name": "13B Steam Flow", "category": "Steam"},
        ]
    },
}


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_dashboard_config(name):
    """
    Get dashboard config by name.
    Returns (machine_name, param_names, meta) or None.
    - machine_name: str (exact DB machine name)
    - param_names: list of str (exact DB parameter names)
    - meta: dict {param_name: {"category": ...}}
    """
    dash = DASHBOARDS.get(name)
    if not dash:
        return None

    machine_name = dash["machine"]
    param_names = [p["name"] for p in dash["parameters"]]
    meta = {
        p["name"]: {"category": p["category"]}
        for p in dash["parameters"]
    }
    return machine_name, param_names, meta


def get_all_dashboards():
    """Return list of all dashboard keys and descriptions."""
    return [
        {"name": key, "description": cfg["description"], "machine": cfg["machine"]}
        for key, cfg in DASHBOARDS.items()
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
