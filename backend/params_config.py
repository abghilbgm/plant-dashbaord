"""
PARAMETERS CONFIGURATION (AUTO-GENERATED FROM MASTER CSV)
============================================================
All 90 machines, 551 unique parameters.
Grouped by plant section.
"""

# ============================================================
# DATABASE CONFIGURATION
# ============================================================
DB_CONFIG = {
    "host": "216.48.180.239",
    "port": 3306,
    "database": "covacsis",
    "user": "covacsis",
    "password": "covacsis123",
}

DB_TABLE = "raw_parameter_fact"

# Column names in the DB table (adjust if different)
COL_MACHINE = "machine_name"
COL_PARAMETER = "parameter_name"
COL_VALUE = "parameter_value"
COL_TIMESTAMP = "timestamp"

# ============================================================
# MACHINE GROUPS (for frontend sections)
# ============================================================
MACHINE_GROUPS = {
    "calcination": {
        "label": "Calcination",
        "machines": ["KILN_1", "KILN_2", "KILN_3", "KILN_4", "PCH", "Calcination_Section"],
    },
    "alumina_downstream": {
        "label": "Alumina Downstream",
        "machines": ["MM_1&3", "MM_1", "MM_3", "ABM_1", "ABM_2", "ABM_3", "ABM_4", "ABM_5", "AFG", "NAFG", "CBM", "CBM_2"],
    },
    "hydrate_downstream": {
        "label": "Hydrate Downstream",
        "machines": ["HBM_1", "HBM_2", "HBM_3", "HBM_4", "SFD", "SFD_1", "SFD_2", "ACM_120", "ACM_60", "NACM_120", "Hydrate_Cutting", "Coated_Hydrate", "STANDARD_HYDRATE", "Third_Party_Milling", "Blender"],
    },
    "water": {
        "label": "Water",
        "machines": ["Refinery_Water_Mapping", "Cooling_Tower_26", "Specials_Water_Network", "Specials_cooling_water_Network", "Specials_Compressed_Air_Network", "Specials_Compressors"],
    },
    "evaporation": {
        "label": "Evaporation",
        "machines": ["Evaporatoration", "13A First Effect", "13A Second Effect", "13A Third Effect", "13A Fourth Effect", "13A Fifth Effect", "13A Sixth Effect", "13A Seventh Effect", "13B First Effect", "13B Second Effect", "13B Third Effect", "13B Fourth Effect", "13B Fifth Effect", "13B Sixth Effect"],
    },
    "refinery": {
        "label": "Refinery",
        "machines": ["OVERALL_PLANT", "DIGESTION", "Precipitation_Section", "Wash_Thickner_Section", "First_Wash_Section", "Filter_Press_Section", "Filter_Press_1", "Filter_Press_2", "LIQ_A", "LIQ_B", "LIQ_C", "LIQ_D", "BALL_MILL_A", "BALL_MILL_B", "BALL_MILL_C", "BALL_MILL_D", "OVERALL_BALL_MILL", "T_3", "T_4", "T_5", "T_6", "T_7", "Specials_Section", "Auxiliary_Section", "Lime_Building", "High_Rating_Pumps"],
    },
    "boiler_biomass": {
        "label": "Boiler & Biomass",
        "machines": ["Boiler_Section", "Boiler_1", "Boiler_2", "Boiler_3", "Boiler_4", "Boiler_5", "BIO_MASS"],
    },
    "other": {
        "label": "Other",
        "machines": ["OT", "RECRUITMENT", "ABSENTEEISM", "CSR"],
    },
}

# ============================================================
# ALL MACHINES AND THEIR PARAMETERS
# ============================================================
DASHBOARDS = {
    "13A Fifth Effect": {
        "machine": "13A Fifth Effect",
        "parameters": [
            {"name": "13A Fifth Body Level"},
            {"name": "13A Fi"},
        ]
    },
    "13A First Effect": {
        "machine": "13A First Effect",
        "parameters": [
            {"name": "13A First Body Level"},
            {"name": "13A Fi"},
        ]
    },
    "13A Fourth Effect": {
        "machine": "13A Fourth Effect",
        "parameters": [
            {"name": "13A Fourth Body Level"},
            {"name": "13A Fo"},
        ]
    },
    "13A Second Effect": {
        "machine": "13A Second Effect",
        "parameters": [
            {"name": "13A Second Body Level"},
            {"name": "13A Se"},
        ]
    },
    "13A Seventh Effect": {
        "machine": "13A Seventh Effect",
        "parameters": [
            {"name": "13A Seventh Body Level"},
            {"name": "13A Seve"},
        ]
    },
    "13A Sixth Effect": {
        "machine": "13A Sixth Effect",
        "parameters": [
            {"name": "13A Sixth Body Level"},
            {"name": "13A Si"},
        ]
    },
    "13A Third Effect": {
        "machine": "13A Third Effect",
        "parameters": [
            {"name": "13A Third Body Level"},
            {"name": "13A Th"},
        ]
    },
    "13B Fifth Effect": {
        "machine": "13B Fifth Effect",
        "parameters": [
            {"name": "13B Fifth Body Level"},
            {"name": "13B Fi"},
        ]
    },
    "13B First Effect": {
        "machine": "13B First Effect",
        "parameters": [
            {"name": "13B First Body Level"},
            {"name": "13B Fi"},
        ]
    },
    "13B Fourth Effect": {
        "machine": "13B Fourth Effect",
        "parameters": [
            {"name": "13B Fourth Body Level"},
            {"name": "13B Fo"},
        ]
    },
    "13B Second Effect": {
        "machine": "13B Second Effect",
        "parameters": [
            {"name": "13B Second Body Level"},
            {"name": "13B Se"},
        ]
    },
    "13B Sixth Effect": {
        "machine": "13B Sixth Effect",
        "parameters": [
            {"name": "13B Sixth Body Level"},
            {"name": "13B Si"},
        ]
    },
    "13B Third Effect": {
        "machine": "13B Third Effect",
        "parameters": [
            {"name": "13B Third Body Level"},
            {"name": "13B Th"},
        ]
    },
    "ABM_1": {
        "machine": "ABM_1",
        "parameters": [
            {"name": "ABM-01 Motor Current"},
            {"name": "Feed Bin Load Cell Inverse"},
            {"name": "Motor Load"},
            {"name": "Feed Bin Load Cell"},
            {"name": "MAIN_GEARBOX_TEMPREATURE"},
            {"name": "ABM-01 Motor C"},
        ]
    },
    "ABM_2": {
        "machine": "ABM_2",
        "parameters": [
            {"name": "ABM-02 Motor Current"},
            {"name": "Product Bin Load Cell"},
            {"name": "Motor Load"},
            {"name": "ABM"},
        ]
    },
    "ABM_3": {
        "machine": "ABM_3",
        "parameters": [
            {"name": "ABM-03 Motor Current"},
            {"name": "Feed Bin Load Cell"},
            {"name": "Vent Filter DP"},
            {"name": "Motor Load"},
            {"name": "Product Bin Load Cell"},
            {"name": "ABM-03 M"},
        ]
    },
    "ABM_4": {
        "machine": "ABM_4",
        "parameters": [
            {"name": "Bearing Inlet Oil Temp"},
            {"name": "Vent Filter DP"},
            {"name": "Feed Bin Weight 1"},
            {"name": "Product Bin Weight BS"},
            {"name": "Main BRG Temp NDE"},
            {"name": "Feed Bin Weight 2"},
            {"name": "Mill Load"},
            {"name": "Feed Bi"},
        ]
    },
    "ABM_5": {
        "machine": "ABM_5",
        "parameters": [
            {"name": "Bearing Inlet Oil Temp"},
            {"name": "Product Bin Weight AS"},
            {"name": "Vent Filter DP"},
            {"name": "Mill Current"},
            {"name": "Main BRG Temp NDE"},
            {"name": "Product Bin Weight BS"},
            {"name": "Main BRG Temp DE"},
            {"name": "Mill Load"},
            {"name": "Bearing Inlet Oil Tem"},
        ]
    },
    "ABSENTEEISM": {
        "machine": "ABSENTEEISM",
        "parameters": [
            {"name": "ALUMINA_LAB_AND_ENVIRONMENT_HRS"},
            {"name": "BOILER_HOUSE_HRS"},
            {"name": "COMMERCIAL_ACCOUNTS_HRS"},
            {"name": "CORPORATE_SAFETY_HRS"},
            {"name": "CPP_ENGG_ELE_HRS"},
            {"name": "CPP_ENGG_HRS"},
            {"name": "CPP_PRODUCTION_HRS"},
            {"name": "CY_COUNT_OF_WORK_MEN_A"},
            {"name": "CY_COUNT_O"},
        ]
    },
    "ACM_120": {
        "machine": "ACM_120",
        "parameters": [
            {"name": "+325W"},
            {"name": "Air Flow"},
            {"name": "Air Pressure"},
            {"name": "Classifier Speed"},
            {"name": "Dust Collecotr DP"},
            {"name": "Feed Bin Load Cell"},
            {"name": "Feed Bin Weight"},
            {"name": "Motor Load"},
            {"name": "Feed RAL RPM"},
            {"name": "Feed RAL-6 Speed"},
            {"name": "Feed RAL-8 Speed"},
            {"name": "Product Bin Weight"},
            {"name": "Total Power"},
        ]
    },
    "ACM_60": {
        "machine": "ACM_60",
        "parameters": [
            {"name": "Classifier Speed"},
            {"name": "Dust Collecotr DP"},
            {"name": "Feed Bin Load Cell"},
            {"name": "Feed Bin Weight"},
            {"name": "Dust Collecotr"},
        ]
    },
    "AFG": {
        "machine": "AFG",
        "parameters": [
            {"name": "Classifier RPM"},
            {"name": "Load Cell Weight"},
            {"name": "Feed Bin Load Cell"},
            {"name": "DC Diff Pressure"},
            {"name": "Grinding Air Flow"},
            {"name": "Rinsing Air Press"},
        ]
    },
    "Auxiliary_Section": {
        "machine": "Auxiliary_Section",
        "parameters": [
            {"name": "29A_PHE_WATER_FLOW"},
            {"name": "HBD_FEED_FLOW"},
            {"name": "HBF_O_L_FLOW_TO_POND"},
            {"name": "OXALATE Filling Flow"},
            {"name": "OXALATE Tank_4 Temp"},
            {"name": "OXALATE_SEED_T_5_11_TO_T_4"},
            {"name": "OXLATE_UNIT_2_FLOW"},
            {"name": "OXLATE_UNIT_1_FLOW"},
            {"name": "TANK_1_LEVEL"},
            {"name": "TANK_9_TO_TANK_2_FLOW"},
            {"name": "T_29_10 Tank Temp"},
            {"name": "VANADIUM F"},
        ]
    },
    "BALL_MILL_A": {
        "machine": "BALL_MILL_A",
        "parameters": [
            {"name": "A_BIN_LVL"},
            {"name": "Liquor Feed Rate"},
            {"name": "BALL_MILL_A"},
            {"name": "BALL_MILL_A_KWH"},
            {"name": "BALL_MILL_A_ACTIVE_POWER"},
            {"name": "BALL_MILL_A_LIQUOR_FLOW"},
            {"name": ""},
        ]
    },
    "BALL_MILL_B": {
        "machine": "BALL_MILL_B",
        "parameters": [
            {"name": "BALLMILL_B_COARSE_SLURRY_MINUS_100W"},
            {"name": "BALLMILL_B_COARSE_SLURRY_MINUS_60W"},
            {"name": "BALLMILL_B_COARSE_SLURRY_PLUS_100W"},
            {"name": "BALLMILL_B_COARSE_SLURRY_PLUS_14W"},
            {"name": "BALLMILL_B_COARSE_SLURRY_PLUS_30W"},
            {"name": "BALLMILL_B_COARSE_SLURRY_PLUS_60W"},
            {"name": "BALLMILL_B_COARSE_SLURRY_SOLIDS"},
            {"name": "BALL_MILL_B"},
            {"name": "BALL_MILL_B_ACTIVE_POWER"},
            {"name": "BALL_MILL_B_LIQUOR_FLOW"},
            {"name": "Liquor Feed Rate"},
            {"name": "BALL_MILL_B_KWH"},
            {"name": "BALL_MILL_B_K"},
        ]
    },
    "BALL_MILL_C": {
        "machine": "BALL_MILL_C",
        "parameters": [
            {"name": "BALLMILL_C_COARSE_SLURRY_MINUS_60W"},
            {"name": "BALLMILL_C_COARSE_SLURRY_PLUS_100W"},
            {"name": "BALLMILL_C_COARSE_SLURRY_PLUS_14W"},
            {"name": "BALLMILL_C_COARSE_SLURRY_PLUS_30W"},
            {"name": "BALLMILL_C_COARSE_SLURRY_PLUS_60W"},
            {"name": "BALLMILL_C_COARSE_SLURRY_SOLIDS"},
            {"name": "BALLMILL_C_COARSE_SL"},
        ]
    },
    "BALL_MILL_D": {
        "machine": "BALL_MILL_D",
        "parameters": [
            {"name": "BALLMILL_D_COARSE_SLURRY_-MINUS_00W"},
            {"name": "BALLMILL_D_COARSE_SLURRY_MINUS_60W"},
            {"name": "BALLMILL_D_COARSE_SLURRY_PLUS_100W"},
            {"name": "BALLMILL_D_COARSE_SLURRY_PLUS_14W"},
            {"name": "BALLMILL_D_COARSE_SLURRY_PLUS_30W"},
            {"name": "BALLMILL_D_COARSE_SLURRY_PLUS_60W"},
            {"name": "BALLMILL_D_COARSE_SLURRY_SOLIDS"},
            {"name": "BALL_MILL_D_ACTIVE_POWER"},
            {"name": "BALL_MILL_D_KWH"},
            {"name": "BALL_MILL_D_LIQUOR_FLOW"},
            {"name": "D_BIN_LVL"},
            {"name": "Liquor Feed Rate"},
            {"name": "BALL_MILL_D"},
            {"name": ""},
        ]
    },
    "BIO_MASS": {
        "machine": "BIO_MASS",
        "parameters": [
            {"name": "BOILER_FEED_WATER_FLOW"},
            {"name": "DEAERATOR_TANK_LEVEL"},
            {"name": "BOILER_STEAM_DRUM_LEVEL_2"},
            {"name": "BOILER_O_L_SUPERHEATED_STEAM_FLOW_1"},
            {"name": "BOILER_FEED_WATER_FLO"},
        ]
    },
    "Blender": {
        "machine": "Blender",
        "parameters": [
            {"name": "BLENDED_HYDRATE_OPERATING_PLAN"},
            {"name": "BLENDED_HYDRATE_PRODUCTION"},
            {"name": "BLENDED_"},
        ]
    },
    "Boiler_1": {
        "machine": "Boiler_1",
        "parameters": [
            {"name": "BOILER-1_PHVAL"},
            {"name": "B_1_DRUM_LEVEL_TXR"},
            {"name": "Boiler 1 NG Flow"},
            {"name": "B_1_FEED_WATER_FLOW_TXR"},
            {"name": "B_1_AIR_FLOW"},
            {"name": "Boiler 1 Steam Flow"},
            {"name": "Boiler"},
        ]
    },
    "Boiler_2": {
        "machine": "Boiler_2",
        "parameters": [
            {"name": "BOILER_2_PHVAL"},
            {"name": "BOILER_2_PO4"},
            {"name": "BOILER_2_SULPHT_SO3"},
            {"name": "B_2_AIR_FLOW"},
            {"name": "Boiler 2 Steam Flow"},
            {"name": "B_2_COMBUSTION_AIR_PRSSURE_TXR"},
            {"name": "B_2_OXYGEN_ANALYZER"},
            {"name": "B_2_OX"},
        ]
    },
    "Boiler_3": {
        "machine": "Boiler_3",
        "parameters": [
            {"name": "BOILER_3_PHVAL"},
            {"name": "BOILER_3_SULPHT"},
            {"name": "B_3_OIL_PRESSURE_AFTER_C_V"},
            {"name": "BOILER_3_PO4"},
            {"name": "B_3_AIR_FLOW"},
            {"name": "Boiler 3 NG Flow"},
            {"name": "B_3_DRUM_LEVEL_TXR"},
            {"name": "B_3_FEED_WATER_FLOW_TXR"},
            {"name": "Boiler 3 Steam Flow"},
        ]
    },
    "Boiler_4": {
        "machine": "Boiler_4",
        "parameters": [
            {"name": "BOILER_4_PHVAL"},
            {"name": "B_4_DRUM_LEVEL_TXR"},
            {"name": "B_4_STEAM_DRUM_PRESSURE_TXR"},
            {"name": "Boiler 4 Steam Flow"},
            {"name": "B_4_AIR_FLOW"},
            {"name": "B_4_FURNACE_PRESSURE_TXR"},
            {"name": "Boiler 4 NG Flow"},
            {"name": "B_4_FEED_WATER_FLOW_TXR"},
            {"name": ""},
        ]
    },
    "Boiler_5": {
        "machine": "Boiler_5",
        "parameters": [
            {"name": "BOILER_5_PHVAL"},
            {"name": ""},
        ]
    },
    "Boiler_Section": {
        "machine": "Boiler_Section",
        "parameters": [
            {"name": "Auxilary Steam Flow"},
            {"name": "Boiler Total Steam Flow"},
            {"name": "Steam Flow To IBSH"},
            {"name": "Steam Flow To 13A"},
            {"name": "Steam Flow To Digester"},
            {"name": "Specials Steam Flow"},
            {"name": "Steam Flow To IBS"},
        ]
    },
    "CBM": {
        "machine": "CBM",
        "parameters": [
            {"name": "Classifier Outlet Pressure"},
            {"name": "Venturi Pressure"},
            {"name": "Classifier Outlet"},
        ]
    },
    "CBM_2": {
        "machine": "CBM_2",
        "parameters": [
            {"name": "DE_BEARING_TEMP"},
            {"name": "MAIN_GB_TEMP"},
            {"name": "NDE_BEARING_TEMP"},
            {"name": "DE_BEARING"},
        ]
    },
    "CSR": {
        "machine": "CSR",
        "parameters": [
            {"name": "COMPLETED"},
            {"name": "IN_PROGRESS"},
            {"name": "NO_OF_GD"},
            {"name": "PENDING"},
            {"name": "TOTAL_APPROVED_PROJECTS"},
            {"name": "TOTAL_BENEFICIARIES"},
            {"name": "TOTAL_RESOLVED"},
        ]
    },
    "Calcination_Section": {
        "machine": "Calcination_Section",
        "parameters": [
            {"name": "4A RC Flow"},
            {"name": "Mill Water To 9A Inj Tank"},
            {"name": "4A RC"},
        ]
    },
    "Coated_Hydrate": {
        "machine": "Coated_Hydrate",
        "parameters": [
            {"name": "COATED_HYDRATE_OPERATING_PLAN"},
            {"name": "COATED_HYDRATE_PRODUCTION"},
            {"name": "CO"},
        ]
    },
    "Cooling_Tower_26": {
        "machine": "Cooling_Tower_26",
        "parameters": [
            {"name": "COOLING_TOWER_15C_SODA"},
            {"name": "Cooling Tower Water Outlet Flow"},
            {"name": "Cooling Tower Water Inlet Temp"},
            {"name": "Cooling Tower Water Outlet T"},
        ]
    },
    "DIGESTION": {
        "machine": "DIGESTION",
        "parameters": [
            {"name": "Flow 0 LB"},
            {"name": "MCC_4A_1_ACTIVE_POWER"},
            {"name": "LSH_OUTLET_TEMPERATURE"},
            {"name": "0LB Heater Inlet Temp"},
            {"name": "Heater 15 Outlet Temp"},
            {"name": "LSH Chest Pressure"},
            {"name": "P_4A_1B_LOAD"},
            {"name": "GLAND_WATER_TANK_LVL"},
            {"name": "FRESH_CAUSTIC_TO_28A_5A_7A"},
            {"name": "E_4A_10_RC_SODA"},
            {"name": "E_4A_14_CC_SODA"},
            {"name": "BLOW_OFF_ALUMINA"},
            {"name": "4A RC Flow"},
            {"name": "Dig - 5"},
            {"name": "Blow Off"},
            {"name": "FT-4 I/L pressure"},
            {"name": "GLAND_WATER_FLOW"},
            {"name": "LSH_INLET_TEMPERATURE"},
            {"name": "Auxiliary Area Gland Water"},
            {"name": "Heater 8 Outlet Temp"},
            {"name": "SPENT_LIQUOR_RATIO"},
            {"name": "FILLING_RATIO"},
            {"name": "MIX_LIQ_TEMP"},
            {"name": "0 LB FT I/L"},
            {"name": "FT_3_O_L_TEMPERATURE"},
            {"name": "CAUSTIC_FLOW_TO_18A_TT_4"},
            {"name": "18A_TT2_LEVEL"},
            {"name": "E_4A_7_RC_SODA"},
            {"name": "MIX_LIQUOR_LIQUOR_SILICA_SIO2GPL"},
            {"name": "Dig - 6"},
            {"name": "10 LB Ft Vap"},
            {"name": "PDS-1 I/L temperature"},
            {"name": "Digester-5 pressure"},
            {"name": "FT-4 heater O/L temperature"},
            {"name": "MIX_LIQUOR_FLOW_TO_GRINDING"},
            {"name": "RC Flow"},
            {"name": "LHS _16 Outlet"},
            {"name": "FILLING_CONCENTRATION"},
            {"name": "P_18A_3A_LOAD"},
            {"name": "P_18A_3B_LOAD"},
            {"name": "4A_RC_CONDUCTIVITY"},
            {"name": "MIX_LIQUOR_CAUSTY"},
            {"name": "SAND_BALL_MILL_PRODUCT_PLUS_60W"},
            {"name": "MIX_LIQUOR_LIQUOR_SILICA_RTIO"},
            {"name": "BLOW_OFF_DAY_COMPOSITE_XRF05"},
            {"name": "IBSH_ACID_BATCH_ACDINHBTR-"},
            {"name": "MCC_4A_1_KWH"},
            {"name": "MCC_4D_4_KWH"},
            {"name": "MIX_LIQUOR_FLOW"},
            {"name": "FT4_INLET_TEMPERATURE"},
            {"name": "HEATER_11_TEMPERATURE"},
            {"name": "0_LB_FLASH_TANK_VACUUM"},
            {"name": "Heater 1 Outlet Temp"},
            {"name": "THA"},
            {"name": "4A_RC_TO_28A_TEMP"},
            {"name": "E_4A_3_RC_SODA"},
            {"name": "E_4A_1_RC_SODA"},
            {"name": "E_4A_16_CC_SODA"},
            {"name": "TT4_MXL_LOOP_FLOW"},
            {"name": "Digester-3 pressure"},
            {"name": "FT-3 heater O/L temperature"},
            {"name": "MCC_18D_3_ACTIVE_POWER"},
            {"name": "PDS1_LEVEL"},
            {"name": "DIGESTER_1_TEMPERATURE"},
            {"name": "STEAM_FLOW_TO_LSH_AND_DIGESTER"},
            {"name": "DIGESTER_6_TEMPERATURE"},
            {"name": "Heater 3 Outlet Temp"},
            {"name": "4A LSH Steam PRS Press"},
            {"name": "10 LB FT I/L"},
            {"name": "P_4A_1A_LOAD"},
            {"name": "4A RC Temp"},
            {"name": "18A-TT-3 Level"},
            {"name": "Dig - 4"},
            {"name": "10 LB FB O/L"},
            {"name": "0 LB FT Vap"},
            {"name": "MCC_4B_3_ACTIVE_POWER"},
            {"name": "PDS_3_LEVEL"},
            {"name": "Fine Slurry Density"},
            {"name": "SPENT_LIQUOR_CONCENTRATION"},
            {"name": "4A CC conductivity"},
            {"name": "DIGESTER_4_TEMPERATURE"},
            {"name": "DIGESTER_5_TEMPERATURE"},
            {"name": "20_LB_FLASH_TANK_VACUUM"},
            {"name": "10_LB_FLASH_TANK_VACUUM"},
            {"name": "MIX_LIQUOR_CONCENTRATION"},
            {"name": "SUSPENDED_SOLIDS"},
            {"name": "PDS_1_TEMPERATURE"},
            {"name": "E_4A_13_CC_SODA"},
            {"name": "PDS_TANK_1_DIG_INLET_LIQUOR_SILICA_RTIO"},
            {"name": "Dig - 2"},
            {"name": "FT - 4 O/L"},
            {"name": "20 LB Htr O/L"},
            {"name": "Digester-4 pressure"},
            {"name": "MCC_4B_3_KWH"},
            {"name": "Digester Mix Liq Flow"},
            {"name": "MAX_HT_FLOW"},
            {"name": "E_4A_4_RC_SODA"},
            {"name": "ACID_SHOT_4A_PHVAL"},
            {"name": "BLOW_OFF_FLOW"},
            {"name": "TT4_MXL_LOOP_DENSITY"},
            {"name": "Dig - 3"},
            {"name": "Digester-2 pressure"},
            {"name": "Blow off tank level-1"},
            {"name": "Booster pump O/L pressure"},
            {"name": "P_4A_1C_LOAD"},
            {"name": "E_4A_15_RC_SODA"},
            {"name": "VACCUM_CONDENSATE_SODA"},
            {"name": "ACID_BATCH_4A_ACDCONC"},
            {"name": "Digester-1 pressure"},
            {"name": "Dilution flow to blow off tank"},
            {"name": "SLURRY_FLOW"},
            {"name": "CLEAR_CONDENSATE_FLOW"},
            {"name": "PDS_TANK_HOLDING_TIME"},
            {"name": "Heater 6 Outlet Temp"},
            {"name": "Heater_ 10 Outlet Temp"},
            {"name": "LHS _14 Outlet"},
            {"name": "MAIN_MIX_LIQ_FLOW"},
            {"name": "18A_TT4_LEVEL"},
            {"name": "Dilution"},
            {"name": "SAND_BALL_MILL_PRODUCT_PLUS_14W"},
            {"name": "Booster Pump O/L"},
            {"name": "Flash tank-4 pressure"},
            {"name": "Boiler main steam header pressure"},
            {"name": "MCC_18A_1_ACTIVE_POWER"},
            {"name": "DIGESTER_2_TEMPERATURE"},
            {"name": "LHS _11 Outlet"},
            {"name": "Steam Flow To Digester"},
            {"name": "Total Al203"},
            {"name": "MIX_LIQ_CONDUCTIVITY"},
            {"name": "VACCUM_COND_TANK_LVL"},
            {"name": "RC_TANK_LVL"},
            {"name": "18A_TT1_LEVEL"},
            {"name": "BOR_PRED"},
            {"name": "PDS_TANK_1_DIG_INLET_LIQUOR_SILICA_SIO2GPL"},
            {"name": "20 LB FT I/L"},
            {"name": "Thickener feed temperature"},
            {"name": "MCC_4D_4_ACTIVE_POWER"},
            {"name": "BLOWOFF_SLURRY_OUTLET_TEMPERATURE"},
            {"name": "DIGESTER_3_TEMPERATURE"},
            {"name": "LHS HTR Outlet Temp"},
            {"name": "K_SILICA_IN_BAUXITE"},
            {"name": "PDS_6_LEVEL"},
            {"name": "SPENT_LIQ_FLOW_TO_18A_TT_4"},
            {"name": "E_4A_5_RC_SODA"},
            {"name": "E_4A_8_RC_SODA"},
            {"name": "E_4A_11_CC_SODA"},
            {"name": "ACID_SHOT_4A_ACDCONC"},
            {"name": "Thick Liq flow to TT-3"},
            {"name": "PDS-4 O/L temperature"},
            {"name": "MCC_4E_5_ACTIVE_POWER"},
            {"name": "IBSH_OUTLET_TEMPERATURE"},
            {"name": "IBSH Outlet Temperature(Stage-1)"},
            {"name": "Fresh Water To 4A Vacuum Condensate"},
            {"name": "Heater 2 Outlet Temp"},
            {"name": "4A LSH Steam Press Ctrl"},
            {"name": "BLOW_OFF_LIQUOR_SILICA_SIO2GPL"},
            {"name": "SAND_BALL_MILL_PRODUCT_MINUS_100W"},
            {"name": "E_4A_9_RC_SODA"},
            {"name": "Dig - 1"},
            {"name": "Flash tank-2 level"},
            {"name": "LSH O/L pressure"},
            {"name": "MCC_18A_1_KWH"},
            {"name": "PDS_4_LEVEL"},
            {"name": "HEATER_12_TEMPERATURE"},
            {"name": "HEATER_16_TEMPERATURE"},
            {"name": "IBSH Inlet Temperature"},
            {"name": "LHS _12 Outlet"},
            {"name": "BLOW_OFF_RATIO"},
            {"name": "PDS_5_LEVEL"},
            {"name": "PDS-5 O/L temperature"},
            {"name": "BLOW_OFF_CAUSTY"},
            {"name": "SAND_BALL_MILL_PRODUCT_SOLIDS"},
            {"name": "E_4A_6_RC_SODA"},
            {"name": "BLOW_OFF_LIQUOR_SILICA_RTIO"},
            {"name": "Digester-6 pressure"},
            {"name": "Flash tank-3 level"},
            {"name": "MCC_4E_6_KWH"},
            {"name": "Heater 4 Outlet Temp"},
            {"name": "Heater 7 Outlet Temp"},
            {"name": "MIX_LIQUOR_RATIO"},
            {"name": "Total Silica"},
            {"name": "SAND_BALL_MILL_PRODUCT_PLUS_30W"},
            {"name": "SAND_BALL_MILL_PRODUCT_MINUS_60W"},
            {"name": "SAND_BALL_MILL_PRODUCT_PLUS_100W"},
            {"name": "E_4A_2_RC_SODA"},
            {"name": "E_4A_12_CC_SODA"},
            {"name": "BLOW_OFF_RESIDUAL_GIBBSITE_HIC_RG01"},
            {"name": "RED GLW"},
            {"name": "0 LB Htr I/L"},
            {"name": "PDS-2 I/L temperature"},
            {"name": "FT-2 heater O/L temperature"},
            {"name": "MCC_18D_3_KWH"},
            {"name": "MCC_4E_5_KWH"},
            {"name": "MCC_4E_6_ACTIVE_POWER"},
            {"name": "PDS_2_LEVEL"},
            {"name": "HEATER_13_TEMPERATURE"},
            {"name": "HEATER_14_TEMPERATURE"},
            {"name": "Digester Steam Flow"},
            {"name": "Heater 5 Outlet Temp"},
            {"name": "Heater 9 Outlet Temp"},
            {"name": "LHS _13 Outlet"},
            {"name": "IBSH_ACID_BATCH_ACDCONC"},
            {"name": "ACID_BATCH_4A_ACDINHBTR-"},
            {"name": "Mix Liq Flow"},
        ]
    },
    "Evaporatoration": {
        "machine": "Evaporatoration",
        "parameters": [
            {"name": "13A 1st Body Chest Pressure"},
            {"name": "MAX_HT_FLOW"},
            {"name": "13A 6th body Pressure"},
            {"name": "Spent Outlet Temp"},
            {"name": "13A 2nd Product Flow"},
            {"name": "13B 5th body Pressure"},
            {"name": "13B 3rd body Pressure"},
            {"name": "13A 1s"},
        ]
    },
    "Filter_Press_1": {
        "machine": "Filter_Press_1",
        "parameters": [
            {"name": "Blowing"},
            {"name": "Wash Water Tank Level"},
            {"name": "Drip Tray Open"},
            {"name": "Releasing"},
            {"name": "Wash Tank Level"},
            {"name": "Emptying"},
            {"name": "Squeezing"},
            {"name": "Plate Taking"},
            {"name": "Feeding Delay"},
            {"name": "Squeez Tank Level"},
            {"name": "Holding Pressure"},
            {"name": "Plate Shifting"},
            {"name": "Cycle Waiting"},
            {"name": "Was"},
        ]
    },
    "Filter_Press_2": {
        "machine": "Filter_Press_2",
        "parameters": [
            {"name": "Blowing"},
            {"name": "Squeezing Water Tank Level"},
            {"name": "Cycle Waiting"},
            {"name": "Squeezing Pressure"},
            {"name": "Wash Water Tank Level"},
            {"name": "Wash Tank Level"},
            {"name": "Squeezing"},
            {"name": "Squ"},
        ]
    },
    "Filter_Press_Section": {
        "machine": "Filter_Press_Section",
        "parameters": [
            {"name": "DMS_CAKE_MOIST"},
            {"name": "DMS_CAKE_SOLIDS"},
            {"name": "FILTER_PRESS_DAY_COMPOSITE_XRF05"},
            {"name": "Fresh Water To Filter Press"},
            {"name": "FILTER_PRESS_DAY_COMPOSI"},
        ]
    },
    "First_Wash_Section": {
        "machine": "First_Wash_Section",
        "parameters": [
            {"name": "1ST_WASH_HYD_MOISTMA"},
            {"name": "1ST_WASH_HYD_PERCENTAGE_SODA_NA2O"},
            {"name": "FIRST_WASH_PF_VACCUM_PRESSURE"},
            {"name": "1ST_WASH_HY"},
        ]
    },
    "HBM_1": {
        "machine": "HBM_1",
        "parameters": [
            {"name": "Conveying Blower Pressure"},
            {"name": "Total Power"},
            {"name": "Motor Load"},
            {"name": "Product Bin Weight"},
            {"name": ""},
        ]
    },
    "HBM_2": {
        "machine": "HBM_2",
        "parameters": [
            {"name": "Conveying Blower Pressure"},
            {"name": "Total Power"},
            {"name": "Feed Bin Load Cell"},
            {"name": "Product Bin Weight BS"},
            {"name": "Conveying Blo"},
        ]
    },
    "HBM_3": {
        "machine": "HBM_3",
        "parameters": [
            {"name": "MILLED_ALUMINA_OPERATING_PLAN"},
            {"name": "MILLED_ALUMINA_PRODUCTION"},
            {"name": "MILLED_HYDRATE_OPERATING_PLAN"},
            {"name": "MILLED_HYDRATE_PRODUCTION"},
            {"name": "MILLED_ALUMINA_PRODUCTIO"},
        ]
    },
    "HBM_4": {
        "machine": "HBM_4",
        "parameters": [
            {"name": "MILLED_ALUMINA_OPERATING_PLAN"},
            {"name": "Motor Load"},
            {"name": "MILLED_HYDRATE_PRODUCTION"},
            {"name": "MILLED_HYDRATE_OPERATING_PLAN"},
            {"name": "MILLED_ALUMINA_PRODUCTION"},
            {"name": ""},
        ]
    },
    "High_Rating_Pumps": {
        "machine": "High_Rating_Pumps",
        "parameters": [
            {"name": "P-18A-3A"},
            {"name": "P-"},
        ]
    },
    "Hydrate_Cutting": {
        "machine": "Hydrate_Cutting",
        "parameters": [
            {"name": "HYDRATE_CUTTING_PRODUCTION"},
            {"name": "HYDRATE_"},
        ]
    },
    "KILN_1": {
        "machine": "KILN_1",
        "parameters": [
            {"name": "ALF3 Dosage"},
            {"name": "CO"},
            {"name": "FGT"},
            {"name": "ESP Inlet Temp"},
            {"name": "NG Flow"},
            {"name": "Kiln 1 NG Flow"},
            {"name": "Oil Flow"},
            {"name": "Feed Rate"},
            {"name": "HZT"},
            {"name": "Kiln 1 Cooler Outlet Temp"},
            {"name": "Wash Water To Pan Filter 1"},
        ]
    },
    "KILN_2": {
        "machine": "KILN_2",
        "parameters": [
            {"name": "61-1 Tank Load cell"},
            {"name": "61-1 Tan"},
        ]
    },
    "KILN_3": {
        "machine": "KILN_3",
        "parameters": [
            {"name": "20-1 tank load cell"},
            {"name": "O2"},
            {"name": "ESP i_l Draft"},
            {"name": "ESP i_l Temp"},
            {"name": "Kiln 3 Main Drive"},
            {"name": "Stack"},
            {"name": "Pre_Cal_NG_Flow"},
            {"name": "CO"},
            {"name": "FGT"},
            {"name": "NG Burner i_l Pressure"},
            {"name": ""},
        ]
    },
    "KILN_4": {
        "machine": "KILN_4",
        "parameters": [
            {"name": "73-1 tank load cell"},
            {"name": "T-9D-1"},
            {"name": "FGT"},
            {"name": "Hood Draft"},
            {"name": "Kiln 4 Oil Temp"},
            {"name": "CO"},
            {"name": "ESP Inlet Temp"},
            {"name": "T-9D-2"},
            {"name": "NG Temperature"},
            {"name": "ESP Outlet Temp"},
            {"name": "Stack"},
            {"name": "NG Skid"},
        ]
    },
    "LIQ_A": {
        "machine": "LIQ_A",
        "parameters": [
            {"name": "Cytec Flow LPH"},
            {"name": "Under Flow Rate"},
            {"name": "Synfloc Flow PPM"},
            {"name": "Synfloc Flow LPH"},
            {"name": "Cytec Flow PPM"},
            {"name": "Motor Load"},
        ]
    },
    "LIQ_B": {
        "machine": "LIQ_B",
        "parameters": [
            {"name": "Cytec Flow LPH"},
            {"name": "Under Flow Rate"},
            {"name": "Cytec Flow PPM"},
            {"name": "Wash Efficiency"},
            {"name": "Motor Load"},
            {"name": "Synfloc Flow PPM"},
            {"name": "Under Flow Ra"},
        ]
    },
    "LIQ_C": {
        "machine": "LIQ_C",
        "parameters": [
            {"name": "Cytec Flow LPH"},
            {"name": ""},
        ]
    },
    "LIQ_D": {
        "machine": "LIQ_D",
        "parameters": [
            {"name": "Cytec Flow LPH"},
            {"name": "Cytec Flow PPM"},
            {"name": "H_MUD_LEVEL"},
            {"name": "Motor Load"},
            {"name": "Under Flow"},
        ]
    },
    "Lime_Building": {
        "machine": "Lime_Building",
        "parameters": [
            {"name": "1A_TANK_LEVEL"},
            {"name": "1B Precoat Tank Temp"},
            {"name": "8A Steam Flow"},
            {"name": "8"},
        ]
    },
    "MM_1": {
        "machine": "MM_1",
        "parameters": [
            {"name": "Air Flow"},
            {"name": "Chamber Pressure"},
            {"name": "DC Diff Pressure"},
            {"name": "Feed Screw Frequency"},
            {"name": "Feed Tank"},
            {"name": "Product Tank"},
            {"name": "Venturi Press Psi"},
        ]
    },
    "MM_1&3": {
        "machine": "MM_1&3",
        "parameters": [
            {"name": "Feed Bin Load Cell"},
            {"name": "Product Bin Load Cell"},
            {"name": "MM1 Chamber Pressure"},
            {"name": "MM3 Venturi Pressure"},
            {"name": "Feed Bin Lo"},
        ]
    },
    "MM_3": {
        "machine": "MM_3",
        "parameters": [
            {"name": "Air Flow"},
            {"name": "Feed Tank"},
            {"name": "Chamber Pressure"},
            {"name": "Product Tank"},
            {"name": "DC Diff Pressure"},
            {"name": "Feed Screw Frequency"},
            {"name": "DC Diff Press"},
        ]
    },
    "NACM_120": {
        "machine": "NACM_120",
        "parameters": [
            {"name": "+325W"},
            {"name": "MILL_VIBRATION"},
            {"name": "AIR_FLOW"},
            {"name": "FEED_RAL_6_SPEED"},
            {"name": "Total Power Consumption"},
            {"name": "CLASSIFIER_SPEED"},
            {"name": "EXHAUST_FAN_CURRENT"},
            {"name": "FEED_RAL_8_SPEED"},
            {"name": "FEED_BIN_WEIGHT"},
            {"name": "CLASSIFIER_CURRENT"},
            {"name": "DUST_COLLECTOR_DP"},
            {"name": "EXHAUST_F"},
        ]
    },
    "NAFG": {
        "machine": "NAFG",
        "parameters": [
            {"name": "CENTRIFUGAL_COMPRESSOR_PRESSURE"},
            {"name": "COOLING_TOWER_PUMP_FLOW"},
            {"name": ""},
        ]
    },
    "OT": {
        "machine": "OT",
        "parameters": [
            {"name": "BOILER_HOUSE_BUDGET"},
            {"name": "BOILER_HOUSE_COST"},
            {"name": "BOILER_HOUSE_GT"},
            {"name": "CIVIL_ALUMINA_GT"},
            {"name": "COMMERCIAL_ACCOUNTS_BUDGET"},
            {"name": "COMMERCIAL_ACCOUNTS_GT"},
            {"name": "CPP_MECHANICAL_ENG_BUDGET"},
            {"name": "CPP_MECHANICAL_ENG_COST"},
            {"name": "CPP_ELECTRICAL_ENG_BUDGET"},
            {"name": "CPP_PRODUCTION_COST"},
            {"name": "DISPATCH_BUDGET"},
            {"name": "MATERIALS_STORES_BUDGET"},
            {"name": "MATERIALS_STORES_COST"},
            {"name": "CPP_MECHANICAL_ENG_GT"},
            {"name": "DISPATCH_COST"},
            {"name": "HIC_ALUMINA_GT"},
            {"name": "INSTRUMENTATION_ELECTRICAL_COST"},
            {"name": "MATERIALS_TRAFFIC_BUDGET"},
            {"name": "MATERIALS_TRAFFIC_GT"},
            {"name": "MECHANICAL_ALUMINA_BUDGET"},
            {"name": "PRODUCTION_ALUMINA"},
        ]
    },
    "OVERALL_BALL_MILL": {
        "machine": "OVERALL_BALL_MILL",
        "parameters": [
            {"name": "C_1A_3_BELT_WEIGH_FEEDER"},
            {"name": "FEED_BAUXITE_MINUS_10M"},
            {"name": "FEED_BAUXITE_PLUSH_10M"},
            {"name": "Fine Slurry Density"},
            {"name": "Fine Slurry Density Digestion"},
        ]
    },
    "OVERALL_PLANT": {
        "machine": "OVERALL_PLANT",
        "parameters": [
            {"name": "ALUMINA_PRODUCTION_SPECIAL_INCLUDING_SX"},
            {"name": "ALUMINA_PRODUCTION_S"},
        ]
    },
    "PCH": {
        "machine": "PCH",
        "parameters": [
            {"name": "MILL_WATER_FLOW_TO_PCH_SLURRY_TANK"},
            {"name": "PCH_TO_SGAC_DENSITY"},
            {"name": "PCH_SLURRY_TANK_LEVEL"},
            {"name": ""},
        ]
    },
    "Precipitation_Section": {
        "machine": "Precipitation_Section",
        "parameters": [
            {"name": "Flash Cooling Inlet Temperature"},
            {"name": "FC Flash Tank Level 1"},
            {"name": "Regular Filling Flow"},
            {"name": "Primary to 52 Tonnage"},
            {"name": "Compressor 4 Power"},
            {"name": "Treated Water To White Area"},
            {"name": "Tank _42 Temp"},
            {"name": "Coarse Seed 1 Density"},
            {"name": "FEED_HYD_+325"},
            {"name": "Total Residence Time"},
            {"name": "PPT51_AIR_FLOW"},
            {"name": "TT_1_UNDER_DENSITY"},
            {"name": "FINE_SLURRY_GRANULOMETRY_MINUS_60W"},
            {"name": "HASH_55_MALVERN_GRANULOMETRY_10uMLVN"},
            {"name": "COARSE_SEED_MALVERN_GRANULOMETRY_150uMLVN"},
            {"name": "TRAY_FEED_7_BOTTOM_DAYWISE_SOLIDS"},
            {"name": "HASH_47_HYDRATE_SOLIDS_GPL_SOLIDSGPL"},
            {"name": "FEED_HYDRATE_OCC_SODA_MONTHLY_NA2OASHYD"},
            {"name": "FINE_SEED_MALVERN_GRANULOMETRY_HILALP_001"},
            {"name": "COARSE_SEED_HYDRATE_SOLIDS_GPL_SOLIDSGPL"},
            {"name": "Flash Cooling Outlet Flow"},
            {"name": "Flash Cooling Water Outlet Flow"},
            {"name": "FC Hotwell Conductivity"},
            {"name": "Oxalate Filling Flow"},
            {"name": "Compressor 3 Power"},
            {"name": "Compressor 8 Power"},
            {"name": "Compressor 9 Power"},
            {"name": "MCC HT Compressor Power"},
            {"name": "Green Liquor Soda"},
            {"name": "Feed Hydrate 45u"},
            {"name": "Feed Hydrate 3_5u"},
            {"name": "Agglomeration Efficiency"},
            {"name": "Fine Seed 45m"},
            {"name": "TT_3_UNDERFLOW"},
            {"name": "AGGLO_TANK_MALVERN_GRANULOMETRY_SSA_M"},
            {"name": "BATCH_FILLING_HASH_56_CAUSTY"},
            {"name": "FINE_SLURRY_GRANULOMETRY_PLUS_100W"},
            {"name": "HASH_55_MALVERN_GRANULOMETRY_30uMLVN"},
            {"name": "HASH_55_MALVERN_GRANULOMETRY_3_5uMLVN"},
            {"name": "HAT_OCC_SODA_MONTHLY_NA2OASHYD"},
            {"name": "FINE_SEED_MALVERN_GRANULOMETRY_105uMLVN"},
            {"name": "HAT_MALVERN_GRANULOMETRY_20uMLVN"},
            {"name": "Primary Injection tank Level"},
            {"name": "PPT-55 Tank level"},
            {"name": "PHE Inlet Temp"},
            {"name": "Lime Building Steam Flow"},
            {"name": "MCC HT Compressor kWh"},
            {"name": "7A Vacuum Heater Condensate Flow"},
            {"name": "Spent Liq Tank-1 Level"},
            {"name": "Final Causticity"},
            {"name": "HAT SSA"},
            {"name": "13A Thick Liq Concentration"},
            {"name": "FRESH_CAUSTIC_TO_7A"},
            {"name": "HAT_SHIFT_WISE_CAUSTY"},
            {"name": "HASH_48_RTIO"},
            {"name": "FINE_SLURRY_GRANULOMETRY_MINUS_100W"},
            {"name": "COARSE_SEED_MALVERN_GRANULOMETRY_HILALP_001"},
            {"name": "COARSE_SEED_MALVERN_GRANULOMETRY_SSA_M"},
            {"name": "HASH_42_HYDRATE_SOLIDS_GPL_SOLIDSGPL"},
            {"name": "FILLING_LIQUOR_SILICA_SIO2GPL"},
            {"name": "SECONDRY_SEED_OCC_SODA_NA2OASHYD"},
            {"name": "FC Flash Tank Level Control"},
            {"name": "Hydro Cyclone Pressure"},
            {"name": "Tank _56 Temp"},
            {"name": "Stage 1 Heater Outlet Temp"},
            {"name": "Coarse Seed 2 Flow"},
            {"name": "Green Liq Concentration"},
            {"name": "HAT 45u"},
            {"name": "Batch Filling Ratio"},
            {"name": "Spent Liquor Concentration"},
            {"name": "THA"},
            {"name": "HYD_WASH_TANK_O_L_TEMP"},
            {"name": "TT_1_FLOW"},
            {"name": "TT_2_UNDERFLOW"},
            {"name": "HASH_48_CAUSTY"},
            {"name": "COARSE_SEED_MALVERN_GRANULOMETRY_20uMLVN"},
            {"name": "FINE_SEED_MALVERN_GRANULOMETRY_10uMLVN"},
            {"name": "KILN_FEED_HYD_MALVERN_GRANULOMETRY_HILALP_001"},
            {"name": "FLASH_COOLING_WATER_OUTLET_LINE_SODA"},
            {"name": "ACID_SHOT_6A_ACDCONC"},
            {"name": "HASH_48_HYDRATE_SOLIDS_GPL_SOLIDSGPL"},
            {"name": "COARSE_SEED_1_FLOW"},
            {"name": "Primary to #52 flow"},
            {"name": "13A Steam Flow"},
            {"name": "9A HST Overflow Return"},
            {"name": "Coarse Seed 2 Density"},
            {"name": "Heater 7-8 Inlet Temperature"},
            {"name": "Fine Seed 3_5u"},
            {"name": "7A_HEATER_COMMON_O_L_PR"},
            {"name": "TT_4_FLOW"},
            {"name": "COARSE_SEED_MALVERN_GRANULOMETRY_30uMLVN"},
            {"name": "COARSE_SEED_MALVERN_GRANULOMETRY_74uMLVN"},
            {"name": "FINE_SEED_OCC_SODA_MONTHLY_NA2OASAL"},
            {"name": "AGGLO_TANK_MALVERN_GRANULOMETRY_74uMLVN"},
            {"name": "HWT_UF_14"},
            {"name": "Spent Liq Tank-2 Level"},
            {"name": "Pump off Oxalate 2"},
            {"name": "Batch Circulation Hrs"},
            {"name": "13B Thick Liq Concentration"},
            {"name": "6A-TT-3"},
            {"name": "TT_1_UNDERFLOW"},
            {"name": "2ND_UF"},
            {"name": "AGGLO_TANK_MALVERN_GRANULOMETRY_3_5UMLVN"},
            {"name": "SPENT_LIQUOR_LIQUOR_SILICA_SIO2GPL"},
            {"name": "HAT_OCC_SODA_MONTHLY_NA2OASAL"},
            {"name": "AGGLO_TANK_MALVERN_GRANULOMETRY_20uMLVN"},
            {"name": "KILN_FEED_HYD_MALVERN_GRANULOMETRY_30UMLVN"},
            {"name": "15A_CT_MAKEUP_WATER_FLOW"},
            {"name": "FC Water Tank Level"},
            {"name": "Fine Seed Charge"},
            {"name": "T56 Temp"},
            {"name": "13A RC Flow"},
            {"name": "13B Spent Liq Feed Flow"},
            {"name": "Compressor 2 Power"},
            {"name": "PPT-56 Tank Level"},
            {"name": "Fine Seed Density"},
            {"name": "Seed Flow Primary To PPT 52"},
            {"name": "Filling Concentration"},
            {"name": "FINE_SLURRY_DAY_COMPOSITE_XRF05"},
            {"name": "7A_CAUSTIC_RTIO"},
            {"name": "HAT_MALVERN_GRANULOMETRY_30uMLVN"},
            {"name": "KILN_FEED_HYD_MALVERN_GRANULOMETRY_20uMLVN"},
            {"name": "FINE_SEED_HYDRATE_SOLIDS_GPL_SOLIDSGPL"},
            {"name": "HASH_52_HYDRATE_SOLIDS_GPL_SOLIDSGPL"},
            {"name": "HASH_47_OCC_SODA_NA2OASAL"},
            {"name": "PHE_WATER_OUTLET_LINE_SODA"},
            {"name": "Compressor Pressure"},
            {"name": "Special Filling temp"},
            {"name": "13A Spent Liq Feed Flow"},
            {"name": "5A/7A Steam Flow"},
            {"name": "Barometric Pressure"},
            {"name": "Heater 3-4 Inlet Temperature"},
            {"name": "Heater 5-6 Inlet Temperature"},
            {"name": "Feed Hydrate SSA"},
            {"name": "Tank 48 45u"},
            {"name": "Fine Seed Soda"},
            {"name": "SP_LIQ_HTR_2ND_STG_O_L_PR"},
            {"name": "FINE_SLURRY_GRANULOMETRY_PLUS_60W"},
            {"name": "COARSE_SEED_MALVERN_GRANULOMETRY_10uMLVN"},
            {"name": "COARSE_SEED_MALVERN_GRANULOMETRY_45uMLVN"},
            {"name": "FINE_SLURRY_LIQUOR_SILICA_RTIO"},
            {"name": "FINE_SEED_MALVERN_GRANULOMETRY_30uMLVN"},
            {"name": "AGGLO_TANK_MALVERN_GRANULOMETRY_105uMLVN"},
            {"name": "HAT_MALVERN_GRANULOMETRY_10uMLVN"},
            {"name": "HAT_MALVERN_GRANULOMETRY_105uMLVN"},
            {"name": "15A_CT_2ND_FEED_HOT_WATER_LINE_FLOW"},
            {"name": "Spent Liq common Inlet Pressure"},
            {"name": "Pri to HWT Den"},
            {"name": "6A-TT-4"},
            {"name": "9A Filtrate Injection Return Flow"},
            {"name": "PPT-56 Agitator Motor"},
            {"name": "HAT Ratio"},
            {"name": "HAT"},
            {"name": "Batch Filling Concentration"},
            {"name": "Suspended Hydrates"},
            {"name": "Filling Conc"},
            {"name": "PUMP_OFF_TEMP"},
            {"name": "TT_2_FLOW"},
            {"name": "HASH_55_MALVERN_GRANULOMETRY_SSA_M"},
            {"name": "HASH_42_OCC_SODA_NA2OASAL"},
            {"name": "FEED_HYDRATE_OCC_SODA_MONTHLY_NA2OASAL"},
            {"name": "Flash Cooling Inlet Flow"},
            {"name": "First Agglo Tank Temp T42"},
            {"name": "Oxalate Filling Temp"},
            {"name": "Oxalate Liq Temp"},
            {"name": "6A-TT-1"},
            {"name": "PPT-55 Agitator Motor"},
            {"name": "Stage 4 Heater Outlet Temp"},
            {"name": "Fine Seed D50"},
            {"name": "Spent Liquor Ratio"},
            {"name": "Spent Liquor Causticity"},
            {"name": "HAT Soda"},
            {"name": "Total Seed Tonnage"},
            {"name": "Residence time Agglo"},
            {"name": "First Agglo Temp"},
            {"name": "P_6A_4ABC_COMN_HDR_PRESS"},
            {"name": "TT_2_UNDER_DENSITY"},
            {"name": "FINE_SLURRY_GRANULOMETRY_SOLIDS"},
            {"name": "COARSE_SEED_MALVERN_GRANULOMETRY_105uMLVN"},
            {"name": "FINE_SLURRY_LIQUOR_SILICA_SIO2GPL"},
            {"name": "FILLING_LIQUOR_SILICA_RTIO"},
            {"name": "FINE_SEED_MALVERN_GRANULOMETRY_150uMLVN"},
            {"name": "AGGLO_TANK_MALVERN_GRANULOMETRY_10uMLVN"},
            {"name": "KILN_FEED_HYD_MALVERN_GRANULOMETRY_105uMLVN"},
            {"name": "KILN_FEED_HYD_MALVERN_GRANULOMETRY_74uMLVN"},
            {"name": "FINE_SLURRY_GRANULOMETRY_PLUS_14W"},
            {"name": "FLASH_COOLING_WATER_INLET_LINE_SODA"},
            {"name": "FC Flash Tank Vacuum"},
            {"name": "Fine Seed Flow"},
            {"name": "Filtrate"},
            {"name": "D50_PREDICTION"},
            {"name": "RED_AREA_UTILITY_AIRFLOW"},
            {"name": "CAUSTIC_CLEANING_TEMP"},
            {"name": "FILLING_LIQUOR_CAUSTY"},
            {"name": "FINE_SEED_OCC_SODA_MONTHLY_NA2OASHYD"},
            {"name": "AGGLO_TANK_MALVERN_GRANULOMETRY_30uMLVN"},
            {"name": "AGGLO_TANK_MALVERN_GRANULOMETRY_150uMLVN"},
            {"name": "FINE_SLURRY_GRANULOMETRY_PLUS_30W"},
            {"name": "Flash Cooling Outlet Temperature"},
            {"name": "Spent Liq common outlet Pressure"},
            {"name": "TFT Tank level"},
            {"name": "7A Stream Pressure"},
            {"name": "PPT_14 Underflow Density"},
            {"name": "Spent Liq Oxalate"},
            {"name": "FEED_HYD_SODA"},
            {"name": "FEED_HYD_+200"},
            {"name": "FEED_HYD_+100"},
            {"name": "GREEN_LIQUID_HEATER_INLET_TEMP"},
            {"name": "KILN_FEED_HYD_DAY_COMPOSITE_XRF05"},
            {"name": "HASH_55_MALVERN_GRANULOMETRY_45uMLVN"},
            {"name": "SPENT_LIQUOR_LIQUOR_SILICA_RTIO"},
            {"name": "HASH_48_OCC_SODA_NA2OASHYD"},
            {"name": "PPT-48 Temperature"},
            {"name": "Caustic Dosing"},
            {"name": "PHE Water flow"},
            {"name": "8A_STEAM_PRESSURE"},
            {"name": "Spent Liquor Temp Heater Outlet"},
            {"name": "13B Steam Flow"},
            {"name": "Compressor 6 Power"},
            {"name": "Compressor 7 Power"},
            {"name": "HAT D50"},
            {"name": "HAT 3_5u"},
            {"name": "Pump off Oxalate 1"},
            {"name": "Last Growth Temp"},
            {"name": "Compressor 1 Power"},
            {"name": "DRAWOFF_1_11_A_B_C_TEMP"},
            {"name": "TT_4_UNDERFLOW"},
            {"name": "TT_3_UNDER_DENSITY"},
            {"name": "7A_COMPRESSED_AIR_PR"},
            {"name": "HT_COMP_AIR_FLOW"},
            {"name": "COARSE_SEED_MALVERN_GRANULOMETRY_3_5uMLVN"},
            {"name": "7A_CAUSTIC_CAUSTY"},
            {"name": "HASH_56_HYDRATE_SOLIDS_GPL_SOLIDSGPL"},
            {"name": "HASH_42_OCC_SODA_NA2OASHYD"},
            {"name": "AGGLO_TANK_-_MALVERN_GRANULOMETRY_HILALP_001"},
            {"name": "KILN_FEED_HYD_MALVERN_GRANULOMETRY_150uMLVN"},
            {"name": "4A_TO_9A_CONDUCTIVITY"},
            {"name": "Compressor Flow"},
            {"name": "Spent Liquor Temp Heater Inlet"},
            {"name": "PHE Outlet Temp"},
            {"name": "Gland Water Flow 6A_7A"},
            {"name": "13B RC Flow"},
            {"name": "SSC Rxn Tank1 Temp"},
            {"name": "8D Lime charge"},
            {"name": "Compressor 5 Power"},
            {"name": "Spent Liq Heater Inlet Temp"},
            {"name": "45A Total Air flow"},
            {"name": "Fine Seed 45u"},
            {"name": "TT_4_UNDER_DENSITY"},
            {"name": "HASH_55_MALVERN_GRANULOMETRY_105uMLVN"},
            {"name": "HASH_55_MALVERN_GRANULOMETRY_20uMLVN"},
            {"name": "SECONDRY_SEED_OCC_SODA_NA2OASAL"},
            {"name": "FINE_SEED_MALVERN_GRANULOMETRY_20uMLVN"},
            {"name": "HAT_MALVERN_GRANULOMETRY_HILALP_001"},
            {"name": "HAT_MALVERN_GRANULOMETRY_74uMLVN"},
            {"name": "FC Main Conductivity"},
            {"name": "Fine Seed Tonnage"},
            {"name": "Coarse Seed 2 Tonnage"},
            {"name": "Green Liq Flow"},
            {"name": "Feed Hydrate D50"},
            {"name": "SP_LIQ_1ST_STAGE_O_L_PR"},
            {"name": "SP_LIQ_3RD_STG_HTR_O_L_PR"},
            {"name": "TT_3_FLOW"},
            {"name": "HASH_55_MALVERN_GRANULOMETRY_HILALP_001"},
            {"name": "HASH_55_MALVERN_GRANULOMETRY_74uMLVN"},
            {"name": "HASH_55_MALVERN_GRANULOMETRY_150uMLVN"},
            {"name": "HAT_MALVERN_GRANULOMETRY_150uMLVN"},
            {"name": "FINE_SEED_MALVERN_GRANULOMETRY_74uMLVN"},
            {"name": "HASH_55_HYDRATE_SOLIDS_GPL_SOLIDSGPL"},
            {"name": "HASH_48_OCC_SODA_NA2OASAL"},
            {"name": "15A_CT_OVERFLOW_WATER_FLOW"},
            {"name": "HWT 14 Den"},
            {"name": "Special Filling Flow"},
            {"name": "Coarse Seed 1 Tonnage"},
            {"name": "6A-TT-2"},
            {"name": "Tank_47 Temp"},
            {"name": "Tank _52 Temp"},
            {"name": "Initial Causticity"},
            {"name": "Fine Seed SSA"},
            {"name": "Filling Ratio"},
            {"name": "HST O_F"},
            {"name": "2ND_UF_DENSITY"},
            {"name": "7A_COMPRESSED_AIR_FLOW"},
            {"name": "KILN_FEED_HYD_MALVERN_GRANULOMETRY_10uMLVN"},
            {"name": "HASH_47_OCC_SODA_NA2OASHYD"},
        ]
    },
    "RECRUITMENT": {
        "machine": "RECRUITMENT",
        "parameters": [
            {"name": "AVG_AGE"},
            {"name": "AVG_TAT"},
            {"name": "EXTERNAL_HIRING"},
            {"name": "FEMALE"},
            {"name": "FEMALE_TWO"},
            {"name": "INTERVIEW_INPROCESS"},
            {"name": "IRS_HIRING"},
            {"name": "MALE"},
            {"name": "NO_OF_CLOSED_POSITIONS"},
            {"name": "NO_OF_EXITS"},
            {"name": "NO_OF_POSITIONS"},
            {"name": "NO_OF_POSITIONS_OPEN"},
            {"name": "RESIGNATION"},
            {"name": "RETIREMENT"},
            {"name": "TRANSFER"},
            {"name": "TRANSF"},
        ]
    },
    "Refinery_Water_Mapping": {
        "machine": "Refinery_Water_Mapping",
        "parameters": [
            {"name": "DRAIN_WATER_POINT-D_SODA"},
            {"name": "DRAIN_WATER_POINT_A_SODA"},
            {"name": "DRAIN_WATER_POINT_B_SODA"},
            {"name": "MAIN_DRAIN_WATER_SODA"},
            {"name": "MW_CT_26A_D"},
            {"name": "TREATED_WATER_SODA"},
            {"name": "TREATED_WATE"},
        ]
    },
    "SFD": {
        "machine": "SFD",
        "parameters": [
            {"name": "Feed Screw RPM"},
            {"name": "First Wash Hydrate Flow"},
            {"name": "NG consumption Precalciner"},
        ]
    },
    "SFD_1": {
        "machine": "SFD_1",
        "parameters": [
            {"name": "Appron Feeder Frequency"},
            {"name": "Total Power"},
            {"name": "SFD-1 Dryer Outlet Temperature"},
            {"name": "Appron Feeder Fr"},
        ]
    },
    "SFD_2": {
        "machine": "SFD_2",
        "parameters": [
            {"name": "Appron Feeder Frequency"},
            {"name": "Dryer Inlet Temperature"},
            {"name": "Dust Collector DP"},
            {"name": "Dust Collector Outlet Temperature"},
            {"name": "Draft Pressure"},
            {"name": "Dryer Outlet Temperature"},
            {"name": "NG consumption SFD 2"},
            {"name": "Dust Collector Outlet Tempera"},
        ]
    },
    "STANDARD_HYDRATE": {
        "machine": "STANDARD_HYDRATE",
        "parameters": [
            {"name": "+100D"},
            {"name": "+200D"},
            {"name": "LOM_HYD"},
            {"name": "MOISTURE"},
            {"name": "Na2OT"},
            {"name": "+325D"},
            {"name": "+"},
        ]
    },
    "Specials_Compressed_Air_Network": {
        "machine": "Specials_Compressed_Air_Network",
        "parameters": [
            {"name": "Airflow To 9A"},
            {"name": "PF Plant Air Flow"},
            {"name": "Airflow T"},
        ]
    },
    "Specials_Compressors": {
        "machine": "Specials_Compressors",
        "parameters": [
            {"name": "78 CC BOV"},
            {"name": "SC3 Outlet Temp"},
            {"name": "78 CC CW Inlet Temp"},
            {"name": "78 CC CW Inl"},
        ]
    },
    "Specials_Section": {
        "machine": "Specials_Section",
        "parameters": [
            {"name": "61-1 Tank Load cell"},
            {"name": "77-4 tank load cell"},
            {"name": "61-3 Tank Load cell"},
            {"name": "HT 2 compressor running time"},
            {"name": "74-5 tank load cell"},
            {"name": "77-9 tank load cell"},
            {"name": "HT 1 compressor running time"},
            {"name": "C66-8 compressor 8 running time load"},
            {"name": "61-4 Tank Load cell"},
            {"name": "77-8 tank load cell"},
            {"name": "77-7 tank"},
        ]
    },
    "Specials_Water_Network": {
        "machine": "Specials_Water_Network",
        "parameters": [
            {"name": "4A RC Flow"},
            {"name": "4A RC Temp"},
            {"name": "9A RC Temp"},
            {"name": "First Wash RC Flow"},
            {"name": "Fw RC Temp"},
            {"name": "HST TO First Wash Feed Slurry Temp"},
            {"name": "HST TO PF1 Feed Slurry Temp"},
            {"name": "K-1 RC Flow"},
            {"name": "K-2 RC Flow"},
            {"name": "Mill Water To 9A Inj Tank"},
            {"name": "Total Mill Water Flow"},
        ]
    },
    "Specials_cooling_water_Network": {
        "machine": "Specials_cooling_water_Network",
        "parameters": [
            {"name": "26E CW PHE Inlet Temp"},
            {"name": "26E CW PHE Outlet Temp"},
            {"name": "26"},
        ]
    },
    "T_3": {
        "machine": "T_3",
        "parameters": [
            {"name": "Motor Load"},
            {"name": "Synfloc Flow LPH"},
            {"name": "Synfloc Flow PPM"},
            {"name": "Under Flow Rate"},
        ]
    },
    "T_4": {
        "machine": "T_4",
        "parameters": [
            {"name": "Motor Load"},
            {"name": "Synfloc Flow LPH"},
            {"name": "Synfloc Flow PPM"},
            {"name": "Under Flow Rate"},
            {"name": "Motor Loa"},
        ]
    },
    "T_5": {
        "machine": "T_5",
        "parameters": [
            {"name": "Motor Load"},
            {"name": "Synfloc Flow LPH"},
            {"name": "Synfloc Flow PPM"},
            {"name": "Under Flow Rate"},
        ]
    },
    "T_6": {
        "machine": "T_6",
        "parameters": [
            {"name": "Motor Load"},
            {"name": "Synfloc Flow LPH"},
            {"name": "Synfloc Flow PPM"},
            {"name": "Under Flow Rate"},
        ]
    },
    "T_7": {
        "machine": "T_7",
        "parameters": [
            {"name": "Motor Load"},
            {"name": "Synfloc Flow LPH"},
            {"name": "Synfloc Flow PPM"},
            {"name": "Under Flow Rate"},
        ]
    },
    "Third_Party_Milling": {
        "machine": "Third_Party_Milling",
        "parameters": [
            {"name": "MILLED_ALUMINA_OPERATING_PLAN"},
            {"name": "MILLED_ALUMINA_PRODUCTION"},
            {"name": "MI"},
        ]
    },
    "Wash_Thickner_Section": {
        "machine": "Wash_Thickner_Section",
        "parameters": [
            {"name": "1ST_WASH_OVERFLOW_CAUSTY"},
            {"name": "Wash Filteration Pressure"},
            {"name": "Filter Press 2 Slurry Feed Flow"},
            {"name": "Filter Press 2 Squeezing Pressure"},
            {"name": "Filter Press 2 Hydraulic Pressure"},
            {"name": "Wash Water Flow"},
            {"name": "1ST_WASH_OVERFLOW_RTIO"},
            {"name": "28A Gland Water Flow"},
            {"name": "Liq_B Rake Motor Load"},
            {"name": "Filter Press 1 Squeezing Pressure"},
            {"name": "Filter Press 2 F"},
        ]
    },
}


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_dashboard_config(name):
    """Get machine config by name. Returns (machine_name, param_names) or None."""
    dash = DASHBOARDS.get(name)
    if not dash:
        return None
    machine = dash["machine"]
    param_names = [p["name"] for p in dash["parameters"]]
    meta = {p["name"]: {} for p in dash["parameters"]}
    return machine, param_names, meta


def get_all_dashboards():
    """Return list of all available dashboard keys."""
    return list(DASHBOARDS.keys())


def get_machines_in_group(group_key):
    """Return machines in a group."""
    grp = MACHINE_GROUPS.get(group_key, {})
    return grp.get("machines", [])
