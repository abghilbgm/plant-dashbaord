/**
 * DASHBOARD CONFIGURATION (NAME-BASED)
 * =====================================
 * Uses exact parameter names from the database master list.
 * No parameter IDs — just names as they appear in the DB.
 *
 * To add a new parameter:
 *   1. Add it to params_config.py (backend) with exact DB name
 *   2. Add it here in the relevant section with a display label
 */

// API base path (relative for Databricks App, proxied in Vite dev)
export const API_BASE = "/api";

// ============================================================
// DASHBOARD SECTIONS — Controls the Overview page layout
// "dashboard" = key in backend params_config.py
// "name" = exact parameter name from DB (case-sensitive!)
// "label" = what to show on the UI
// ============================================================
export const SECTIONS = [
  {
    id: "production",
    title: "Production",
    type: "kpi_grid",
    dashboard: "overall_plant",
    params: [
      { name: "Hydrate", label: "Hydrate Production", unit: "T" },
      { name: "Bauxite Consumption", label: "Bauxite Consumption", unit: "T" },
      { name: "Bauxite FOM", label: "Bauxite FOM", unit: "T" },
      { name: "Hydrate PnB", label: "Hydrate P&B", unit: "T" },
    ],
  },
  {
    id: "raw_material",
    title: "Raw Material",
    type: "kpi_grid",
    dashboard: "overall_plant",
    params: [
      { name: "Bauxite Receipt Own", label: "Bauxite Receipt", unit: "T" },
      { name: "Lime Cao", label: "Lime CaO", unit: "%" },
      { name: "Caustic Charged", label: "Caustic Charged", unit: "kg/T" },
      { name: "Caustic Soda (Liq With Residue)", label: "Caustic Soda Loss", unit: "kg/T" },
    ],
  },
  {
    id: "efficiency",
    title: "Efficiency",
    type: "kpi_strip",
    dashboard: "overall_plant",
    params: [
      { name: "Energy For Hydrate", label: "Energy/Hydrate", unit: "kWh/T" },
      { name: "Boiler Oil", label: "Boiler Oil", unit: "kg/T" },
      { name: "Caustic Charged", label: "Caustic Charged", unit: "kg/T" },
      { name: "Caustic Charged PnB", label: "Caustic P&B", unit: "kg/T" },
      { name: "Energy For Hydrate PnB", label: "Energy P&B", unit: "kWh/T" },
    ],
  },
  {
    id: "steam",
    title: "Steam & Power",
    type: "kpi_grid",
    dashboard: "boiler_steam",
    params: [
      { name: "Boiler Total Steam Flow", label: "Total Steam", unit: "TPH" },
      { name: "Steam Flow To Digester", label: "Steam to Digester", unit: "TPH" },
      { name: "Process Steam Flow", label: "Process Steam", unit: "TPH" },
      { name: "Evaporation Factor Steam", label: "Evap Factor", unit: "T/T" },
      { name: "Make Up Water Flow", label: "Make Up Water", unit: "m3/hr" },
      { name: "Condensate Temperature", label: "Condensate Temp", unit: "\u00b0C" },
    ],
  },
  {
    id: "calcination",
    title: "Calcination",
    type: "kpi_grid",
    dashboard: "calcination",
    params: [
      { name: "Total Sx Production", label: "Sx Production", unit: "T" },
      { name: "Total Spls  Production", label: "Spls Production", unit: "T" },
      { name: "Calcinable Hydrate Stock", label: "Hydrate Stock", unit: "T" },
      { name: "NG Consumption SX", label: "NG Consumption", unit: "SCM" },
      { name: "TOTAL_EVACUATION", label: "Total Evacuation", unit: "" },
    ],
  },
  {
    id: "digestion",
    title: "Digestion",
    type: "kpi_grid",
    dashboard: "digestion",
    params: [
      { name: "SLURRY_FLOW", label: "Slurry Flow", unit: "m3/hr" },
      { name: "MIX_LIQUOR_FLOW", label: "Mix Liquor Flow", unit: "m3/hr" },
      { name: "STEAM_FLOW_TO_LSH_AND_DIGESTER", label: "Steam to Digester", unit: "TPH" },
      { name: "DIGESTER_1_TEMPERATURE", label: "Digester 1 Temp", unit: "\u00b0C" },
      { name: "IBSH_OUTLET_TEMPERATURE", label: "IBSH Outlet Temp", unit: "\u00b0C" },
      { name: "PDS_TANK_HOLDING_TIME", label: "PDS Holding Time", unit: "Hrs" },
    ],
  },
  {
    id: "water",
    title: "Water Dashboard",
    type: "kpi_grid",
    dashboard: "overall_plant",
    params: [
      { name: "Fresh Water Supply From Pump House", label: "Fresh Water Intake", unit: "m3/hr" },
      { name: "Mill Water to Standard Plant", label: "Mill Water (Std)", unit: "m3/hr" },
      { name: "Mill Water to Specials Plant", label: "Mill Water (Spl)", unit: "m3/hr" },
      { name: "Lagoon Water (Treated)", label: "Lagoon Water", unit: "MLD" },
    ],
  },
  {
    id: "precipitation",
    title: "Precipitation",
    type: "kpi_grid",
    dashboard: "precipitation",
    params: [
      { name: "PHE Inlet Temp", label: "PHE Inlet Temp", unit: "\u00b0C" },
      { name: "PHE Outlet Temp", label: "PHE Outlet Temp", unit: "\u00b0C" },
      { name: "Fine Seed Tonnage", label: "Fine Seed", unit: "tph" },
      { name: "Green Liq Flow", label: "Green Liq Flow", unit: "m3/hr" },
    ],
  },
];

// ============================================================
// TIME RANGE OPTIONS
// ============================================================
export const TIME_RANGES = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "7d" },
  { label: "MTD", value: "mtd" },
  { label: "Custom", value: "custom" },
];

// ============================================================
// HELPER: Get today's date string
// ============================================================
export function getDateString(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}
