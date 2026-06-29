import React, { useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { API_BASE, SECTIONS, TIME_RANGES, getDateString } from "../utils/config";
import GaugeChart from "../components/common/GaugeChart";
import KPICard from "../components/common/KPICard";
import SparkLine from "../components/common/SparkLine";
import MiniBar from "../components/common/MiniBar";
import "./RefineryDashboard.css";

/* ═══════════════════════════════════════════════════════
   BLG - REFINERY OVERVIEW DASHBOARD
   World-class industrial plant monitoring UI
   ═══════════════════════════════════════════════════════ */

const NAV_TABS = [
  "Home", "Overview", "Red Area", "White Area", "Calcination",
  "Quality", "Granulometry", "Asset Monitoring", "Dispatch", "EMS", "Analytics", "Overall DPR"
];

const COST_DATA = { rawMaterial: "24,304", power: "1,670" };

const QUALITY_TRENDS = [
  { time: "06/18", fe2o3: 0.010, sio2: 0.006, na2o: 0.18 },
  { time: "06/19", fe2o3: 0.009, sio2: 0.005, na2o: 0.17 },
  { time: "06/20", fe2o3: 0.011, sio2: 0.006, na2o: 0.18 },
  { time: "06/21", fe2o3: 0.008, sio2: 0.006, na2o: 0.175 },
  { time: "06/22", fe2o3: 0.010, sio2: 0.005, na2o: 0.16 },
  { time: "06/23", fe2o3: 0.012, sio2: 0.006, na2o: 0.17 },
  { time: "06/24", fe2o3: 0.010, sio2: 0.006, na2o: 0.18 },
  { time: "06/25", fe2o3: 0.011, sio2: 0.007, na2o: 0.18 },
];

export default function RefineryDashboard() {
  const [activeTab, setActiveTab] = useState("Home");
  const [currentTime, setCurrentTime] = useState(new Date());

  // --- TIME RANGE STATE ---
  const [timeRange, setTimeRange] = useState("today");
  const [selectedDate, setSelectedDate] = useState(getDateString(0));
  const [customFrom, setCustomFrom] = useState(getDateString(-7));
  const [customTo, setCustomTo] = useState(getDateString(0));

  // --- DATA STATE ---
  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // --- Compute active date based on time range ---
  const getActiveDate = useCallback(() => {
    if (timeRange === "today") return getDateString(0);
    if (timeRange === "yesterday") return getDateString(-1);
    if (timeRange === "custom") return customTo;
    return selectedDate;
  }, [timeRange, selectedDate, customTo]);

  // --- FETCH DATA FROM API ---
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    const date = getActiveDate();
    const dashboardsToFetch = [
      "overall_plant", "boiler_steam", "calcination", "digestion", 
      "precipitation", "clarification", "red_mud", "liquor_flow", 
      "bauxite_quality", "vibration_monitoring", "dispatch", 
      "environmental", "shift_kpis", "steam_power"
    ];

    try {
      const results = await Promise.allSettled(
        dashboardsToFetch.map(name =>
          fetch(`${API_BASE}/dashboard/${name}?date=${date}`).then(r => r.json())
        )
      );

      const newData = {};
      results.forEach((result, idx) => {
        if (result.status === "fulfilled" && result.value.parameters) {
          const dashName = dashboardsToFetch[idx];
          newData[dashName] = {};
          result.value.parameters.forEach(p => {
            newData[dashName][p.name] = {
              today: p.today,
              yesterday: p.yesterday,
              mtd: p.mtd,
              name: p.name,
              unit: p.unit,
              category: p.category,
            };
          });
        }
      });

      setLiveData(newData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [getActiveDate]);

  // --- Fetch on mount and when date changes ---
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 5 * 60 * 1000); // Auto-refresh every 5 min
    return () => clearInterval(interval);
  }, [fetchAllData]);

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.background = "#080c14";
    document.body.style.color = "#f3f4f6";
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => { clearInterval(t); document.body.style.overflow = ""; };
  }, []);

  // --- Data Getter Helpers ---
  const getVal = (dashboard, paramName, field, fallbackValue) => {
    let val = liveData?.[dashboard]?.[paramName]?.[field];
    if ((val === null || val === undefined) && field === "today") {
      val = liveData?.[dashboard]?.[paramName]?.["yesterday"];
    }
    return (val !== null && val !== undefined) ? val : fallbackValue;
  };

  const getValFormatted = (dashboard, paramName, field, fallbackValue, decimals = 2) => {
    let val = liveData?.[dashboard]?.[paramName]?.[field];
    if ((val === null || val === undefined) && field === "today") {
      val = liveData?.[dashboard]?.[paramName]?.["yesterday"];
    }
    if (val === null || val === undefined) return fallbackValue;
    return typeof val === "number" ? val.toLocaleString(undefined, { maximumFractionDigits: decimals }) : val;
  };

  // --- Live-mapped UI Arrays ---
  const RAW_MATERIALS = [
    { 
      name: "Bauxite", 
      quality: [
        { label: "THA%", value: getValFormatted("bauxite_quality", "THA", "today", "37.1%", 2) + "%", sparkline: [36, 37, 38, 37, 37.1] }, 
        { label: "SiO2%", value: getValFormatted("bauxite_quality", "K_SIO2", "today", "5.1%", 2) + "%", sparkline: [5, 5.2, 5.1, 5, 5.1] }
      ], 
      stock: getValFormatted("overall_plant", "Bauxite Consumption", "today", "2,500", 0), 
      stockLabel: "Consumption",
      unit: "t" 
    },
    { 
      name: "Caustic", 
      quality: [
        { label: "NaOH", value: "47.8", sparkline: [45, 47, 47.8] }
      ], 
      stock: getValFormatted("overall_plant", "Caustic Charged", "today", "1,446", 0), 
      stockLabel: "Consumption",
      unit: "t" 
    },
  ];

  const PRODUCTION_DATA = [
    { 
      name: "Calcination", 
      today: [getVal("calcination", "Total Sx Production", "today", 563), 733], 
      mtd: [getVal("calcination", "Total Sx Production", "mtd", 15252), 17600], 
      ytd: [74, 70], 
      unit: "t" 
    },
    { 
      name: "Hydrate", 
      today: [getVal("overall_plant", "Hydrate", "today", 890), getVal("overall_plant", "Hydrate PnB", "today", 937)], 
      mtd: [getVal("overall_plant", "Hydrate", "mtd", 21043), getVal("overall_plant", "Hydrate PnB", "mtd", 22480)], 
      ytd: [89, 87], 
      unit: "t" 
    },
    { 
      name: "Vanadium", 
      today: [1.3, 1.1], 
      mtd: [20.7, 26.4], 
      ytd: [75.6, 26.4], 
      unit: "t" 
    },
    { 
      name: "Microfine Alumina", 
      today: [8, 11], 
      mtd: [386, 253], 
      ytd: [985, 910], 
      unit: "t" 
    },
  ];

  const CRITICAL_PARAMS = [
    { label: "Bauxite Charge", value: getVal("digestion", "SLURRY_FLOW", "today", 126.41), unit: "", gauge: true, max: 200 },
    { label: "PGL Ratio", value: getVal("liquor_flow", "PGL_A_C", "today", 0.67), unit: "", gauge: true, max: 1 },
    { label: "SPL Ratio", value: getVal("liquor_flow", "SPENT_LIQUOR_A_C", "today", 0.33), unit: "", gauge: true, max: 1 },
    { label: "Plant Flow", value: getVal("liquor_flow", "PGL_FLOW", "today", 344.87), unit: "m3/h", gauge: false },
  ];

  const POWER_DATA = [
    { label: "Hydrate Energy", value: getValFormatted("overall_plant", "Energy For Hydrate", "today", "9.49"), unit: "GJ/T", sub: "GJ/T" },
    { label: "KWH/T", value: "436.23", unit: "", mtd: "305.10", ytd: "" },
    { label: "PHR", value: "2440.70", unit: "", mtd: "2283.75" },
    { label: "Calcination Energy", value: "3.30", unit: "GJ/T" },
    { label: "Coal Consumption", value: "1.024", unit: "t/t", mtd: "0.745" },
    { 
      label: "Power Generation", 
      value: (() => {
        const val = liveData?.["steam_power"]?.["TURBINE_LOAD"]?.["today"];
        if (val === null || val === undefined) return "15.85";
        return typeof val === "number" ? (val / 1000).toFixed(2) : val;
      })(), 
      unit: "MW" 
    },
  ];

  const EFFICIENCY_DATA = [
    { label: "Process Steam", value: getVal("boiler_steam", "Process Steam Flow", "today", 2.68), plan: 2.84, unit: "t/t", trend: "down" },
    { label: "Soda Loss", value: getVal("overall_plant", "Caustic Soda (Liq With Residue)", "today", 135.57), plan: 164.83, unit: "", trend: "down" },
    { label: "Steam Economy", value: 3.40, plan: 3.10, unit: "t/t", trend: "down" },
    { label: "Overall Recovery", value: 92.1, plan: 89.86, unit: "%", trend: "up" },
    { label: "Liquor Productivity", value: 75.0, plan: 86.57, unit: "gpl", trend: "down" },
    { label: "Plant Availability", value: 89.10, plan: 100.0, unit: "%", trend: "up" },
    { label: "Furnace Oil", value: getVal("overall_plant", "Boiler Oil", "today", 74.00), plan: 76.58, unit: "kl/t", trend: "up" },
    { label: "Bauxite Factor", value: getVal("overall_plant", "BX_FACTOR", "today", 3.12), plan: 3.18, unit: "t/t", trend: "up" },
  ];

  const DISPATCH_DATA = [
    { label: "Alumina", value: getValFormatted("calcination", "TOTAL_EVACUATION", "mtd", "6,792"), unit: "ton" },
    { label: "Hydrate", value: getValFormatted("overall_plant", "Hydrate", "mtd", "3,945"), unit: "ton" },
    { label: "MF Alumina", value: "384", unit: "ton" },
  ];

  const WATER_DATA = [
    { label: "Intake", value: getValFormatted("overall_plant", "Fresh Water Supply From Pump House", "today", "33"), unit: "m3/h", sub: "6.36 m3/ton" },
    { label: "Consumption", value: getValFormatted("overall_plant", "Total Fresh Water From Pump House", "today", "192"), unit: "m3/h", sub: "5.15 m3/ton" },
  ];

  // --- Dynamic Dashboard Table Renderer ---
  const renderDashboardTables = (dashNames) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {dashNames.map(dashName => {
          const dashParams = liveData?.[dashName];
          if (!dashParams) return null;

          // Group by category
          const grouped = {};
          Object.values(dashParams).forEach(p => {
            const cat = p.category || "General Parameters";
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(p);
          });

          return (
            <div key={dashName}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--accent-cyan)", marginBottom: 12, borderBottom: "1px solid var(--border-card)", paddingBottom: 6, textTransform: "capitalize", letterSpacing: "0.5px" }}>
                {dashName.replace("_", " ")} Telemetry
              </div>
              {Object.keys(grouped).map(cat => (
                <div key={cat} className="dashboard-section" style={{ marginBottom: 20 }}>
                  <h3 className="dashboard-section-title">{cat}</h3>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                          <th style={{ textAlign: "left", padding: "12px 14px", color: "var(--text-sub)", width: "40%", fontSize: 11 }}>Parameter Descriptor</th>
                          <th style={{ textAlign: "center", padding: "12px 14px", color: "var(--text-sub)", fontSize: 11 }}>Today</th>
                          <th style={{ textAlign: "center", padding: "12px 14px", color: "var(--text-sub)", fontSize: 11 }}>Yesterday</th>
                          <th style={{ textAlign: "center", padding: "12px 14px", color: "var(--text-sub)", fontSize: 11 }}>MTD / Average</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grouped[cat].map(p => (
                          <tr key={p.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                            <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--text-main)" }}>{p.name} {p.unit ? `(${p.unit})` : ""}</td>
                            <td style={{ textAlign: "center", padding: "12px 14px", color: "var(--accent-green)", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: "bold" }}>
                              {p.today !== null && p.today !== undefined ? p.today.toLocaleString(undefined, { maximumFractionDigits: 3 }) : "--"}
                            </td>
                            <td style={{ textAlign: "center", padding: "12px 14px", color: "var(--accent-cyan)", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                              {p.yesterday !== null && p.yesterday !== undefined ? p.yesterday.toLocaleString(undefined, { maximumFractionDigits: 3 }) : "--"}
                            </td>
                            <td style={{ textAlign: "center", padding: "12px 14px", color: "var(--accent-orange)", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                              {p.mtd !== null && p.mtd !== undefined ? p.mtd.toLocaleString(undefined, { maximumFractionDigits: 3 }) : "--"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "Home":
      case "Overview":
        return (
          <>
            {/* Row 1: Raw Material | Production | Product Quality | Critical Process | Cost */}
            <div className="dashboard-top-grid">
              {/* RAW MATERIAL */}
              <section className="dashboard-section" style={{ gridRow: "1 / 3" }}>
                <h3 className="dashboard-section-title">Raw Material</h3>
                {RAW_MATERIALS.map(mat => (
                  <div key={mat.name} className="raw-card">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 12, color: "var(--text-main)" }}>{mat.name}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 4, alignItems: "center" }}>
                      <div>
                        {mat.quality.map(q => (
                          <div key={q.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <SparkLine data={q.sparkline} color="var(--accent-cyan)" />
                            <span style={{ fontSize: 10, color: "var(--text-sub)" }}>{q.label}</span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-main)" }}>{q.value}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase" }}>{mat.stockLabel || "Stock"} ({mat.unit})</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent-rose)", fontFamily: "'JetBrains Mono', monospace" }}>{mat.stock}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* PRODUCTION */}
              <section className="dashboard-section">
                <h3 className="dashboard-section-title">Production</h3>
                {PRODUCTION_DATA.map(prod => (
                  <div key={prod.name} className="prod-card">
                    <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 8, color: "var(--text-main)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{prod.name}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, fontSize: 10 }}>
                      <div>
                        <div style={{ color: "var(--text-muted)", marginBottom: 2 }}>Today ({prod.unit})</div>
                        <div style={{ display: "flex", gap: 4, flexDirection: "column" }}>
                          {prod.today.map((v, i) => (
                            <span key={i} style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? "var(--accent-cyan)" : "var(--text-sub)", fontFamily: "'JetBrains Mono', monospace" }}>
                              {typeof v === "number" ? v.toLocaleString() : v}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: "var(--text-muted)", marginBottom: 2 }}>MTD ({prod.unit})</div>
                        <div style={{ display: "flex", gap: 4, flexDirection: "column" }}>
                          {prod.mtd.map((v, i) => (
                            <span key={i} style={{ fontSize: 12, fontWeight: 700, color: v > prod.mtd[1] ? "var(--accent-rose)" : i === 0 ? "var(--accent-cyan)" : "var(--text-sub)", fontFamily: "'JetBrains Mono', monospace" }}>
                              {typeof v === "number" ? v.toLocaleString() : v}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: "var(--text-muted)", marginBottom: 2 }}>YTD (kt)</div>
                        <div style={{ display: "flex", gap: 4, flexDirection: "column" }}>
                          {prod.ytd.map((v, i) => (
                            <span key={i} style={{ fontSize: 12, fontWeight: 700, color: "var(--text-sub)", fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <MiniBar data={[...prod.today, ...prod.mtd.map(x => typeof x === "number" ? x / 100 : 0)]} colors={["var(--accent-cyan)", "rgba(255,255,255,0.1)", "var(--accent-green)", "rgba(255,255,255,0.1)"]} />
                  </div>
                ))}
              </section>

              {/* PRODUCT QUALITY */}
              <section className="dashboard-section">
                <h3 className="dashboard-section-title">Product Quality</h3>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 4, color: "var(--text-sub)" }}>Fe2O3 %  <span style={{ color: "var(--accent-rose)", fontWeight: 700, fontFamily: "monospace" }}>0.01%</span></div>
                  <ResponsiveContainer width="100%" height={70}>
                    <LineChart data={QUALITY_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="time" tick={{ fontSize: 8, fill: "var(--text-muted)" }} />
                      <YAxis tick={{ fontSize: 8, fill: "var(--text-muted)" }} domain={[0, 0.015]} />
                      <Line type="monotone" dataKey="fe2o3" stroke="var(--accent-rose)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 4, color: "var(--text-sub)" }}>SiO2 %  <span style={{ color: "var(--accent-cyan)", fontWeight: 700, fontFamily: "monospace" }}>0.006%</span></div>
                  <ResponsiveContainer width="100%" height={70}>
                    <LineChart data={QUALITY_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="time" tick={{ fontSize: 8, fill: "var(--text-muted)" }} />
                      <YAxis tick={{ fontSize: 8, fill: "var(--text-muted)" }} domain={[0, 0.01]} />
                      <Line type="monotone" dataKey="sio2" stroke="var(--accent-cyan)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 4, color: "var(--text-sub)" }}>Na2O %  <span style={{ color: "var(--accent-purple)", fontWeight: 700, fontFamily: "monospace" }}>0.18%</span></div>
                  <ResponsiveContainer width="100%" height={70}>
                    <LineChart data={QUALITY_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="time" tick={{ fontSize: 8, fill: "var(--text-muted)" }} />
                      <YAxis tick={{ fontSize: 8, fill: "var(--text-muted)" }} domain={[0.15, 0.20]} />
                      <Line type="monotone" dataKey="na2o" stroke="var(--accent-purple)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* CRITICAL PROCESS PARAMETER */}
              <section className="dashboard-section">
                <h3 className="dashboard-section-title">Critical Process</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {CRITICAL_PARAMS.map(p => (
                    <div key={p.label} className="crit-card">
                      {p.gauge ? (
                        <GaugeChart value={p.value} max={p.max} label={p.label} />
                      ) : (
                        <div style={{ textAlign: "center", padding: "10px 0" }}>
                          <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-main)", fontFamily: "'JetBrains Mono', monospace" }}>{p.value}<span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 2 }}>{p.unit}</span></div>
                          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>{p.label}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* COST */}
                <div style={{ marginTop: 12, background: "#f8fafb", border: "1px solid #e2e8f0", borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 6, borderBottom: "1px solid #e2e8f0", paddingBottom: 4, textTransform: "uppercase", color: "var(--accent-cyan)" }}>Cost (&#8377;/t)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)", fontFamily: "'JetBrains Mono', monospace" }}>{COST_DATA.rawMaterial}</div>
                      <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Raw Material</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)", fontFamily: "'JetBrains Mono', monospace" }}>{COST_DATA.power}</div>
                      <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Power</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* POWER */}
              <section className="dashboard-section">
                <h3 className="dashboard-section-title">Power</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {POWER_DATA.map(p => (
                    <div key={p.label} className="power-card">
                      <div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 2 }}>{p.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)", fontFamily: "'JetBrains Mono', monospace" }}>{p.value}<span style={{ fontSize: 9, color: "var(--text-muted)", marginLeft: 2 }}>{p.unit}</span></div>
                      {p.mtd && <div style={{ fontSize: 9, color: "var(--accent-cyan)", marginTop: 2 }}>MTD: {p.mtd}</div>}
                    </div>
                  ))}
                </div>
                {/* Coal Stock & Quality */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <div className="power-card" style={{ textAlign: "center", background: "#fff8e6", borderColor: "rgba(245, 158, 11, 0.25)" }}>
                    <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Coal Stock</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "var(--accent-orange)", fontFamily: "'JetBrains Mono', monospace" }}>50,237<span style={{ fontSize: 10 }}> t</span></div>
                  </div>
                  <div className="power-card" style={{ textAlign: "center", background: "#fef2f2", borderColor: "rgba(244, 63, 94, 0.25)" }}>
                    <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Coal Quality</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "var(--accent-rose)", fontFamily: "'JetBrains Mono', monospace" }}>3,224.94<span style={{ fontSize: 10 }}> GCV</span></div>
                    <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>MTD: 3,239.36</div>
                  </div>
                </div>
              </section>
            </div>

            {/* Row 2: Efficiency + Dispatch + Water */}
            <div className="dashboard-bottom-grid">
              {/* EFFICIENCY */}
              <section className="dashboard-section" style={{ gridColumn: "1 / 4" }}>
                <h3 className="dashboard-section-title">Efficiency Parameters</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
                  {EFFICIENCY_DATA.map(e => (
                    <KPICard key={e.label} label={e.label} value={e.value} unit={e.unit} trend={e.trend} plan={e.plan} />
                  ))}
                </div>
              </section>

              {/* DISPATCH */}
              <section className="dashboard-section">
                <h3 className="dashboard-section-title">Dispatch (MTD)</h3>
                {DISPATCH_DATA.map(d => (
                  <div key={d.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #e8edf3" }}>
                    <span style={{ fontSize: 11, color: "var(--text-sub)" }}>{d.label}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "var(--accent-cyan)", fontFamily: "'JetBrains Mono', monospace" }}>{d.value}<span style={{ fontSize: 9, color: "var(--text-muted)" }}> {d.unit}</span></span>
                  </div>
                ))}
              </section>

              {/* WATER */}
              <section className="dashboard-section">
                <h3 className="dashboard-section-title">Water Balance</h3>
                {WATER_DATA.map(w => (
                  <div key={w.label} style={{ padding: "8px 0", borderBottom: "1px solid #e8edf3" }}>
                    <div style={{ fontSize: 10, color: "var(--text-sub)" }}>{w.label}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "var(--accent-cyan)", fontFamily: "'JetBrains Mono', monospace" }}>{w.value}<span style={{ fontSize: 10, color: "var(--text-muted)" }}> {w.unit}</span></div>
                    <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>{w.sub}</div>
                  </div>
                ))}
              </section>
            </div>
          </>
        );
      case "Red Area":
        return renderDashboardTables(["digestion", "clarification", "red_mud"]);
      case "White Area":
        return renderDashboardTables(["precipitation", "liquor_flow"]);
      case "Calcination":
        return renderDashboardTables(["calcination"]);
      case "Quality":
        return renderDashboardTables(["bauxite_quality", "efficiency"]);
      case "Granulometry":
        return renderDashboardTables(["efficiency"]);
      case "Asset Monitoring":
        return renderDashboardTables(["vibration_monitoring"]);
      case "Dispatch":
        return renderDashboardTables(["dispatch"]);
      case "EMS":
        return renderDashboardTables(["environmental"]);
      case "Overall DPR":
        return renderDashboardTables(["shift_kpis"]);
      case "Analytics":
        return (
          <div className="dashboard-section" style={{ padding: "3rem", textAlign: "center" }}>
            <h3 className="dashboard-section-title">Telemetry Analytics</h3>
            <p style={{ color: "var(--text-sub)" }}>Select dynamic parameters on other tabs to view live real-time trend overlays.</p>
          </div>
        );
      default:
        return <div>Section not configured.</div>;
    }
  };

  return (
    <div className="dashboard-root">
      {/* ═══ HEADER ═══ */}
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <div className="dashboard-logo">
            {/* Hindalco Logo SVG */}
            <svg width="150" height="38" viewBox="0 0 150 38" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="hindalcoText" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0072BC"/>
                  <stop offset="100%" stopColor="#29ABE2"/>
                </linearGradient>
              </defs>
              <text x="0" y="28" style={{ fontSize: 26, fontWeight: 900, fill: "url(#hindalcoText)", fontFamily: "'Inter', Arial, sans-serif", letterSpacing: -0.5 }}>HINDALCO</text>
              {/* Blue plus */}
              <line x1="125" y1="5" x2="125" y2="21" stroke="#29ABE2" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="117" y1="13" x2="133" y2="13" stroke="#29ABE2" strokeWidth="3.5" strokeLinecap="round"/>
              {/* Green plus */}
              <line x1="136" y1="13" x2="136" y2="31" stroke="#00A651" strokeWidth="2.8" strokeLinecap="round"/>
              <line x1="128" y1="22" x2="144" y2="22" stroke="#00A651" strokeWidth="2.8" strokeLinecap="round"/>
            </svg>
            <div style={{ marginLeft: 16, borderLeft: "2px solid rgba(255,255,255,0.15)", paddingLeft: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "0.3px" }}>Belgaum Refinery</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", letterSpacing: 1, fontWeight: 500 }}>PLANT MONITORING DASHBOARD</div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontFamily: "'JetBrains Mono', monospace" }}>
          {currentTime.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} | {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </header>

      {/* ═══ NAV BAR ═══ */}
      <nav className="dashboard-nav">
        {NAV_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`dashboard-nav-btn ${activeTab === tab ? "active" : ""}`}>
            {tab}
          </button>
        ))}
      </nav>

      {/* ═══ TIME RANGE SELECTOR ═══ */}
      <div className="dashboard-time-bar">
        <div className="dashboard-time-bar-left">
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-sub)", marginRight: 12 }}>Data Range:</span>
          {TIME_RANGES.map(tr => (
            <button key={tr.value} onClick={() => setTimeRange(tr.value)}
              className={`dashboard-time-btn ${timeRange === tr.value ? "active" : ""}`}>
              {tr.label}
            </button>
          ))}
          {timeRange === "custom" && (
            <span style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 12 }}>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="dashboard-date-input" />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>to</span>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="dashboard-date-input" />
            </span>
          )}
          {timeRange !== "custom" && timeRange !== "today" && timeRange !== "yesterday" && (
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="dashboard-date-input" style={{ marginLeft: 12 }} />
          )}
        </div>
        <div className="dashboard-time-bar-right">
          {loading && <span style={{ fontSize: 11, color: "var(--accent-orange)" }}>Loading Telemetry...</span>}
          {lastUpdated && !loading && (
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>Sync: {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
          )}
          <button onClick={fetchAllData} className="dashboard-refresh-btn">Refresh</button>
        </div>
      </div>

      {/* ═══ MAIN GRID ═══ */}
      <main className="dashboard-main">
        {renderActiveTabContent()}
      </main>
    </div>
  );
}
