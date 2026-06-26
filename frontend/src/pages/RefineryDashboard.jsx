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

/* ═══════════════════════════════════════════════════════
   BLG - REFINERY OVERVIEW DASHBOARD
   World-class industrial plant monitoring UI
   ═══════════════════════════════════════════════════════ */

// ─── NAV TABS ───────────────────────────────────────────
const NAV_TABS = [
  "Home", "Overview", "Red Area", "White Area", "Calcination",
  "Quality", "Granulometry", "Asset Monitoring", "Dispatch", "EMS", "Analytics", "Overall DPR"
];

// ─── MOCK DATA (will be replaced by API) ───────────────
const RAW_MATERIALS = [
  { name: "Bauxite", icon: "\u26CF", quality: [{label:"TAA%", value:"37.1%", sparkline:[36,37,38,37,37.1]}, {label:"SiO2%", value:"5.1%", sparkline:[5,5.2,5.1,5,5.1]}], stock: "134504", unit: "t" },
  { name: "Oil", icon: "\u25C9", quality: [{label:"GCV", value:"10,232", sparkline:[10200,10233,10232]}, {label:"Moisture", value:"0.45%", sparkline:[0.4,0.45,0.43]}], stock: "2217", unit: "kl" },
  { name: "Lime", icon: "\u25A3", quality: [{label:"CaO%", value:"82.2%", sparkline:[80,82,82.2]}, {label:"SiO2%", value:"1.7%", sparkline:[1.6,1.7,1.74]}], stock: "580", unit: "t" },
  { name: "Caustic", icon: "\u25C6", quality: [{label:"NaOH", value:"47.8", sparkline:[45,47,47.8]}], stock: "1446", unit: "t" },
];

const PRODUCTION_DATA = [
  { name: "Calcination", today: [563, 733], mtd: [15252, 17600], ytd: [74, 70], unit: "t" },
  { name: "Hydrate", today: [890, 937], mtd: [21043, 22480], ytd: [89, 87], unit: "t" },
  { name: "Vanadium", today: [1.3, 1.1], mtd: [20.7, 26.4], ytd: [75.6, 26.4], unit: "t" },
  { name: "Microfine Alumina", today: [8, 11], mtd: [386, 253], ytd: [985, 910], unit: "t" },
];

const CRITICAL_PARAMS = [
  { label: "Bauxite Charge", value: 126.41, unit: "", gauge: true, max: 200 },
  { label: "PGL Ratio", value: 0.67, unit: "", gauge: true, max: 1 },
  { label: "SPL Ratio", value: 0.33, unit: "", gauge: true, max: 1 },
  { label: "Plant Flow", value: 344.87, unit: "m3/h", gauge: false },
];

const POWER_DATA = [
  { label: "Hydrate Energy", value: "9.49", unit: "GJ/T", sub: "GJ/T" },
  { label: "KWH/T", value: "436.23", unit: "", mtd: "305.10", ytd: "" },
  { label: "PHR", value: "2440.70", unit: "", mtd: "2283.75" },
  { label: "Calcination Energy", value: "3.30", unit: "GJ/T" },
  { label: "Coal Consumption", value: "1.024", unit: "t/t", mtd: "0.745" },
  { label: "Power Generation", value: "15.85", unit: "MW" },
];

const EFFICIENCY_DATA = [
  { label: "Process Steam", value: 2.68, plan: 2.84, unit: "t/t", trend: "down" },
  { label: "Soda Loss", value: 135.57, plan: 164.83, unit: "", trend: "down" },
  { label: "Steam Economy", value: 3.40, plan: 3.10, unit: "t/t", trend: "down" },
  { label: "Overall Recovery", value: 92.1, plan: 89.86, unit: "%", trend: "up" },
  { label: "Liquor Productivity", value: 75.0, plan: 86.57, unit: "gpl", trend: "down" },
  { label: "Plant Availability", value: 89.10, plan: 100.0, unit: "%", trend: "up" },
  { label: "Furnace Oil", value: 74.00, plan: 76.58, unit: "kl/t", trend: "up" },
  { label: "Bauxite Factor", value: 3.12, plan: 3.18, unit: "t/t", trend: "up" },
];

const DISPATCH_DATA = [
  { label: "Alumina", value: "6,792", unit: "ton" },
  { label: "Hydrate", value: "3,945", unit: "ton" },
  { label: "MF Alumina", value: "384", unit: "ton" },
];

const WATER_DATA = [
  { label: "Intake", value: "33", unit: "m3/h", sub: "6.36 m3/ton" },
  { label: "Consumption", value: "192", unit: "m3/h", sub: "5.15 m3/ton" },
];

const COST_DATA = { rawMaterial: "24,304", power: "1670" };

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

// ─── MINI COMPONENTS ────────────────────────────────────

function GaugeChart({ value, max, label }) {
  const pct = Math.min((value / max) * 100, 100);
  const angle = (pct / 100) * 180;
  const color = pct > 80 ? "#e53e3e" : pct > 60 ? "#dd6b20" : "#38a169";
  return (
    <div style={{ textAlign: "center", padding: "8px 0" }}>
      <div style={{ position: "relative", width: 80, height: 45, margin: "0 auto" }}>
        <svg viewBox="0 0 100 50" style={{ width: "100%", height: "100%" }}>
          <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
          <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${(angle / 180) * 141.37} 141.37`} />
        </svg>
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", fontSize: 14, fontWeight: 700, color: "#1a202c" }}>
          {value}
        </div>
      </div>
      <div style={{ fontSize: 10, color: "#718096", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function KPICard({ label, value, unit, trend, plan }) {
  const isUp = trend === "up";
  const trendColor = isUp ? "#38a169" : "#e53e3e";
  return (
    <div style={styles.effCard}>
      <div style={{ fontSize: 11, color: "#4a5568", fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#1a202c" }}>{value}</span>
        <span style={{ fontSize: 10, color: "#718096" }}>{unit}</span>
      </div>
      {plan && (
        <div style={{ fontSize: 10, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ color: trendColor }}>{isUp ? "\u25B2" : "\u25BC"}</span>
          <span style={{ color: "#718096" }}>P&B: {plan}</span>
        </div>
      )}
    </div>
  );
}

function MiniBar({ data, colors }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 32 }}>
      {data.map((v, i) => (
        <div key={i} style={{ width: 14, height: `${(v / Math.max(...data)) * 100}%`, minHeight: 4, background: colors[i % colors.length], borderRadius: "2px 2px 0 0" }} />
      ))}
    </div>
  );
}

function SparkLine({ data, color = "#e53e3e" }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 20, w = 50;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

// ─── MAIN DASHBOARD ─────────────────────────────────────
export default function RefineryDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [currentTime, setCurrentTime] = useState(new Date());

  // --- TIME RANGE STATE ---
  const [timeRange, setTimeRange] = useState("today");
  const [selectedDate, setSelectedDate] = useState(getDateString(0));
  const [customFrom, setCustomFrom] = useState(getDateString(-7));
  const [customTo, setCustomTo] = useState(getDateString(0));

  // --- DATA STATE ---
  const [liveData, setLiveData] = useState({});  // { dashboard_name: { paramId: {today, yesterday, mtd} } }
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
    const dashboardsToFetch = [...new Set(SECTIONS.map(s => s.dashboard))];

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
            newData[dashName][p.parameterId] = {
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

  // --- Helper: get param value from live data ---
  const getParamValue = (dashboard, paramId, field = "today") => {
    return liveData?.[dashboard]?.[paramId]?.[field] ?? "--";
  };

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.background = "#f0f2f5";
    document.body.style.color = "#1a202c";
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => { clearInterval(t); document.body.style.overflow = ""; };
  }, []);

  return (
    <div style={styles.root}>
      {/* ═══ HEADER ═══ */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <div style={styles.logoBox}>AB</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>BLG - Refinery Overview</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", letterSpacing: 1 }}>ADITYA BIRLA HINDALCO</div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
          {currentTime.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} | {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </header>

      {/* ═══ NAV BAR ═══ */}
      <nav style={styles.nav}>
        {NAV_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ ...styles.navBtn, ...(activeTab === tab ? styles.navBtnActive : {}) }}>
            {tab}
          </button>
        ))}
      </nav>

      {/* ═══ TIME RANGE SELECTOR ═══ */}
      <div style={styles.timeBar}>
        <div style={styles.timeBarLeft}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#4a5568", marginRight: 12 }}>Data Range:</span>
          {TIME_RANGES.map(tr => (
            <button key={tr.value} onClick={() => setTimeRange(tr.value)}
              style={{ ...styles.timeBtn, ...(timeRange === tr.value ? styles.timeBtnActive : {}) }}>
              {tr.label}
            </button>
          ))}
          {timeRange === "custom" && (
            <span style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 12 }}>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} style={styles.dateInput} />
              <span style={{ fontSize: 11, color: "#718096" }}>to</span>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} style={styles.dateInput} />
            </span>
          )}
          {timeRange !== "custom" && timeRange !== "today" && timeRange !== "yesterday" && (
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ ...styles.dateInput, marginLeft: 12 }} />
          )}
        </div>
        <div style={styles.timeBarRight}>
          {loading && <span style={{ fontSize: 10, color: "#dd6b20" }}>\u23F3 Loading...</span>}
          {lastUpdated && !loading && (
            <span style={{ fontSize: 10, color: "#718096" }}>Last updated: {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
          )}
          <button onClick={fetchAllData} style={styles.refreshBtn}>\u21BB Refresh</button>
        </div>
      </div>

      {/* ═══ MAIN GRID ═══ */}
      <main style={styles.main}>
        {/* Row 1: Raw Material | Production | Product Quality | Critical Process | Cost */}
        <div style={styles.topGrid}>
          {/* RAW MATERIAL */}
          <section style={{ ...styles.section, gridRow: "1 / 3" }}>
            <h3 style={styles.sectionTitle}>Raw Material</h3>
            {RAW_MATERIALS.map(mat => (
              <div key={mat.name} style={styles.rawCard}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{mat.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 12 }}>{mat.name}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 4, alignItems: "center" }}>
                  <div>
                    {mat.quality.map(q => (
                      <div key={q.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <SparkLine data={q.sparkline} />
                        <span style={{ fontSize: 10, color: "#4a5568" }}>{q.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 600 }}>{q.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, color: "#718096" }}>Stock ({mat.unit})</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#c53030" }}>{mat.stock}</div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* PRODUCTION */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Production</h3>
            {PRODUCTION_DATA.map(prod => (
              <div key={prod.name} style={styles.prodCard}>
                <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 6 }}>{prod.name}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, fontSize: 10 }}>
                  <div>
                    <div style={{ color: "#718096", marginBottom: 2 }}>Today ({prod.unit})</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {prod.today.map((v, i) => (
                        <span key={i} style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? "#2b6cb0" : "#4a5568" }}>{v}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#718096", marginBottom: 2 }}>MTD ({prod.unit})</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {prod.mtd.map((v, i) => (
                        <span key={i} style={{ fontSize: 13, fontWeight: 700, color: v > prod.mtd[1] ? "#c53030" : i === 0 ? "#2b6cb0" : "#4a5568" }}>{v.toLocaleString()}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#718096", marginBottom: 2 }}>YTD (kt)</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {prod.ytd.map((v, i) => (
                        <span key={i} style={{ fontSize: 13, fontWeight: 700, color: "#4a5568" }}>{v}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <MiniBar data={[...prod.today, ...prod.mtd.map(x => x/100)]} colors={["#4299e1","#a0aec0","#48bb78","#a0aec0"]} />
              </div>
            ))}
          </section>

          {/* PRODUCT QUALITY */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Product Quality</h3>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Fe2O3 %  <span style={{color:"#38a169", fontWeight:800}}>0.01%</span></div>
              <ResponsiveContainer width="100%" height={70}>
                <LineChart data={QUALITY_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 8 }} />
                  <YAxis tick={{ fontSize: 8 }} domain={[0, 0.015]} />
                  <Line type="monotone" dataKey="fe2o3" stroke="#e53e3e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>SiO2 %  <span style={{color:"#38a169", fontWeight:800}}>0.006%</span></div>
              <ResponsiveContainer width="100%" height={70}>
                <LineChart data={QUALITY_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 8 }} />
                  <YAxis tick={{ fontSize: 8 }} domain={[0, 0.01]} />
                  <Line type="monotone" dataKey="sio2" stroke="#2b6cb0" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Na2O %  <span style={{color:"#38a169", fontWeight:800}}>0.18%</span></div>
              <ResponsiveContainer width="100%" height={70}>
                <LineChart data={QUALITY_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 8 }} />
                  <YAxis tick={{ fontSize: 8 }} domain={[0.15, 0.20]} />
                  <Line type="monotone" dataKey="na2o" stroke="#805ad5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* CRITICAL PROCESS PARAMETER */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Critical Process Parameter</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {CRITICAL_PARAMS.map(p => (
                <div key={p.label} style={styles.critCard}>
                  {p.gauge ? (
                    <GaugeChart value={p.value} max={p.max} label={p.label} />
                  ) : (
                    <div style={{ textAlign: "center", padding: "12px 0" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#1a202c" }}>{p.value}<span style={{ fontSize: 10, color: "#718096" }}>{p.unit}</span></div>
                      <div style={{ fontSize: 10, color: "#718096" }}>{p.label}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* COST */}
            <div style={{ marginTop: 12, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6, borderBottom: "1px solid #e2e8f0", paddingBottom: 4 }}>Cost (\u20B9/t)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{COST_DATA.rawMaterial}</div>
                  <div style={{ fontSize: 9, color: "#718096" }}>Raw Material</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{COST_DATA.power}</div>
                  <div style={{ fontSize: 9, color: "#718096" }}>Power</div>
                </div>
              </div>
            </div>
          </section>

          {/* POWER */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Power</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {POWER_DATA.map(p => (
                <div key={p.label} style={styles.powerCard}>
                  <div style={{ fontSize: 9, color: "#718096", marginBottom: 2 }}>{p.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#1a202c" }}>{p.value}<span style={{ fontSize: 9, color: "#718096", marginLeft: 2 }}>{p.unit}</span></div>
                  {p.mtd && <div style={{ fontSize: 9, color: "#4299e1" }}>MTD: {p.mtd}</div>}
                </div>
              ))}
            </div>
            {/* Coal Stock & Quality */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
              <div style={{ ...styles.powerCard, textAlign: "center", background: "#fffbeb" }}>
                <div style={{ fontSize: 9, color: "#718096" }}>Coal Stock</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#d69e2e" }}>50237<span style={{ fontSize: 10 }}>ton</span></div>
              </div>
              <div style={{ ...styles.powerCard, textAlign: "center", background: "#fef2f2" }}>
                <div style={{ fontSize: 9, color: "#718096" }}>Coal Quality</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#c53030" }}>3224.94<span style={{ fontSize: 10 }}>GCV</span></div>
                <div style={{ fontSize: 9, color: "#718096" }}>MTD: 3,239.36</div>
              </div>
            </div>
          </section>
        </div>

        {/* Row 2: Efficiency + Dispatch + Water */}
        <div style={styles.bottomGrid}>
          {/* EFFICIENCY */}
          <section style={{ ...styles.section, gridColumn: "1 / 4" }}>
            <h3 style={styles.sectionTitle}>Efficiency</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8 }}>
              {EFFICIENCY_DATA.map(e => (
                <KPICard key={e.label} label={e.label} value={e.value} unit={e.unit} trend={e.trend} plan={e.plan} />
              ))}
            </div>
          </section>

          {/* DISPATCH */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Dispatch Overview (MTD)</h3>
            {DISPATCH_DATA.map(d => (
              <div key={d.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #edf2f7" }}>
                <span style={{ fontSize: 11, color: "#4a5568" }}>{d.label}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#2b6cb0" }}>{d.value}<span style={{ fontSize: 9, color: "#718096" }}>{d.unit}</span></span>
              </div>
            ))}
          </section>

          {/* WATER */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Water Dashboard</h3>
            {WATER_DATA.map(w => (
              <div key={w.label} style={{ padding: "8px 0", borderBottom: "1px solid #edf2f7" }}>
                <div style={{ fontSize: 10, color: "#718096" }}>{w.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#2b6cb0" }}>{w.value}<span style={{ fontSize: 10, color: "#718096" }}>{w.unit}</span></div>
                <div style={{ fontSize: 9, color: "#4a5568" }}>{w.sub}</div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

// ─── STYLES ─────────────────────────────────────────────
const styles = {
  root: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    background: "#f0f2f5",
    minHeight: "100vh",
    fontSize: 13,
  },
  header: {
    background: "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)",
    padding: "8px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 16 },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoBox: {
    width: 36, height: 36, borderRadius: 6,
    background: "linear-gradient(135deg, #ed8936, #c53030)",
    display: "grid", placeItems: "center",
    color: "#fff", fontWeight: 900, fontSize: 12,
  },
  nav: {
    background: "linear-gradient(90deg, #dd6b20 0%, #c53030 100%)",
    padding: "0 16px",
    display: "flex",
    gap: 0,
    overflowX: "auto",
  },
  navBtn: {
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    fontWeight: 600,
    padding: "8px 14px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    borderBottom: "2px solid transparent",
    transition: "all 0.2s",
  },
  navBtnActive: {
    color: "#fff",
    background: "rgba(255,255,255,0.15)",
    borderBottom: "2px solid #fff",
  },
  timeBar: {
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  timeBarLeft: { display: "flex", alignItems: "center", gap: 4 },
  timeBarRight: { display: "flex", alignItems: "center", gap: 12 },
  timeBtn: {
    background: "#edf2f7",
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    padding: "4px 10px",
    fontSize: 10,
    fontWeight: 600,
    color: "#4a5568",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  timeBtnActive: {
    background: "#dd6b20",
    borderColor: "#dd6b20",
    color: "#fff",
  },
  dateInput: {
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    padding: "4px 8px",
    fontSize: 11,
    color: "#2d3748",
    outline: "none",
  },
  refreshBtn: {
    background: "#2b6cb0",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "5px 12px",
    fontSize: 10,
    fontWeight: 600,
    cursor: "pointer",
  },
  main: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1.5fr 1.2fr 1.2fr 1.2fr",
    gap: 10,
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "3fr 1fr 1fr",
    gap: 10,
  },
  section: {
    background: "#ffffff",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    padding: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 800,
    color: "#1a202c",
    borderBottom: "2px solid #dd6b20",
    paddingBottom: 4,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rawCard: {
    border: "1px solid #edf2f7",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  prodCard: {
    border: "1px solid #edf2f7",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  critCard: {
    border: "1px solid #edf2f7",
    borderRadius: 6,
    padding: 4,
  },
  powerCard: {
    border: "1px solid #edf2f7",
    borderRadius: 6,
    padding: 8,
  },
  effCard: {
    border: "1px solid #edf2f7",
    borderRadius: 6,
    padding: 8,
    textAlign: "center",
  },
};
