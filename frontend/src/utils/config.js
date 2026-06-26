/**
 * DASHBOARD CONFIGURATION
 * =======================
 * Single source of truth for frontend parameter display.
 *
 * To add a new parameter:
 *   1. Add it to params_config.py in backend (for data fetching)
 *   2. Add it to the relevant section below (for UI rendering)
 *
 * To add a new section:
 *   1. Add new entry to SECTIONS array
 *   2. Map the parameter IDs to the section
 */

// API base path (relative, works in Databricks App)
export const API_BASE = "/api";

// Default dashboard to load
export const DEFAULT_DASHBOARD = "efficiency";

// ============================================================
// DASHBOARD SECTIONS - Controls the Overview page layout
// Each section maps to a visual block on the dashboard
// ============================================================
export const SECTIONS = [
  {
    id: "raw_material",
    title: "Raw Material",
    type: "raw_material",  // card type for rendering
    dashboard: "bauxite_quality",  // which backend dashboard to fetch from
    params: [
      // paramId maps to params_config.py -> id
      { paramId: 1541, displayAs: "quality", label: "TAA%" },
      { paramId: 1542, displayAs: "quality", label: "R. Silica%" },
      { paramId: 1544, displayAs: "stock", label: "Slurry Density" },
      { paramId: 1546, displayAs: "stock", label: "Slurry Charge" },
    ],
  },
  {
    id: "production",
    title: "Production",
    type: "production",
    dashboard: "efficiency",
    params: [
      { paramId: 1444, label: "Hydrate Production", unit: "T" },
      { paramId: 1445, label: "Evacuation", unit: "T" },
    ],
  },
  {
    id: "quality",
    title: "Product Quality",
    type: "line_chart",
    dashboard: "efficiency",
    params: [
      { paramId: 1441, label: "PSD +100", unit: "%", color: "#e53e3e" },
      { paramId: 1442, label: "PSD +200", unit: "%", color: "#2b6cb0" },
      { paramId: 1448, label: "PSD +325", unit: "%", color: "#805ad5" },
    ],
  },
  {
    id: "critical_process",
    title: "Critical Process Parameter",
    type: "gauge",
    dashboard: "efficiency",
    params: [
      { paramId: 1453, label: "THA", unit: "%", max: 50 },
      { paramId: 1454, label: "K Silica", unit: "%", max: 10 },
      { paramId: 1455, label: "Slurry Density", unit: "gm/cc", max: 2.5 },
      { paramId: 1456, label: "Slurry Charge", unit: "m3/h", max: 200 },
    ],
  },
  {
    id: "efficiency",
    title: "Efficiency",
    type: "kpi_strip",
    dashboard: "efficiency",
    params: [
      { paramId: 1446, label: "Bx Factor", unit: "T/T" },
      { paramId: 1447, label: "Total Steam", unit: "T/T" },
      { paramId: 1450, label: "Hydrate Power", unit: "kWh/T" },
      { paramId: 1451, label: "Caustic Soda Loss", unit: "kg/T" },
      { paramId: 1452, label: "Last Wash Soda", unit: "gpl" },
    ],
  },
  {
    id: "power",
    title: "Power",
    type: "kpi_grid",
    dashboard: "steam_power",
    params: [
      { paramId: 1561, label: "HP Steam Flow", unit: "t/h" },
      { paramId: 1562, label: "MP Steam Flow", unit: "t/h" },
      { paramId: 1563, label: "LP Steam Flow", unit: "t/h" },
      { paramId: 1564, label: "Cogen Power", unit: "MW" },
      { paramId: 1565, label: "Grid Export", unit: "MW" },
      { paramId: 1566, label: "Boiler Efficiency", unit: "%" },
    ],
  },
  {
    id: "water",
    title: "Water Dashboard",
    type: "kpi_grid",
    dashboard: "water_condensate",
    params: [
      { paramId: 1571, label: "Raw Water Intake", unit: "m3/h" },
      { paramId: 1572, label: "Process Water Flow", unit: "m3/h" },
      { paramId: 1573, label: "Condensate Return", unit: "m3/h" },
      { paramId: 1574, label: "Condensate Recovery", unit: "%" },
    ],
  },
  {
    id: "calcination",
    title: "Calcination",
    type: "kpi_grid",
    dashboard: "calcination",
    params: [
      { paramId: 1531, label: "Furnace Temp", unit: "\u00b0C" },
      { paramId: 1532, label: "Fuel Gas Flow", unit: "Nm3/h" },
      { paramId: 1536, label: "LOI", unit: "%" },
      { paramId: 1537, label: "Specific Gas", unit: "Nm3/t" },
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
