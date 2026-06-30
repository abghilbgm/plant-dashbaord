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
COL_VALUE = "value"
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
            {"name": "0 LB FT I/L"},
            {"name": "0 LB FT Vap"},
            {"name": "0 LB Htr I/L"},
            {"name": "0LB Heater Inlet Temp"},
            {"name": "10 LB FB O/L"},
            {"name": "10 LB Ft Vap"},
            {"name": "PDS-1 I/L temperature"},
            {"name": "20 LB FT I/L"},
            {"name": "20 LB Htr O/L"},
            {"name": "4A LSH Steam PRS Press"},
            {"name": "Digester Steam Flow"},
            {"name": "TT4_MXL_LOOP_FLOW"},
            {"name": "Booster Pump O/L"},
            {"name": "Dig - 2"},
            {"name": "Heater 2 Outlet Temp"},
            {"name": "Dig - 3"},
            {"name": "Flow 0 LB"},
            {"name": "RED GLW"},
            {"name": "Dig - 4"},
            {"name": "Digester-2 pressure"},
            {"name": "Digester-3 pressure"},
            {"name": "Digester-5 pressure"},
            {"name": "Heater 9 Outlet Temp"},
            {"name": "Thick Liq flow to TT-3"},
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
            {"name": "13A RC Flow"},
            {"name": "13A Spent Liq Feed Flow"},
            {"name": "13B Spent Liq Feed Flow"},
            {"name": "HWT_UF_14"},
            {"name": "13B Steam Flow"},
            {"name": "Treated Water To White Area"},
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
