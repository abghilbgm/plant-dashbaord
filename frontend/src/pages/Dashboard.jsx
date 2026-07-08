import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ----------------------------------------------------
// INITIAL PROCESS SIMULATOR STATE (TAB 1)
// ----------------------------------------------------
const INITIAL_STATE = {
  speed: 1,
  health: 98.4,
  bauxite_feed_rate: 320.0,
  bauxite_alumina_pct: 48.5,
  bauxite_silica_pct: 4.2,
  steam_valve_pct: 70,
  caustic_conc: 210,
  digestion_temp: 143.5,
  digestion_press: 0.42,
  extraction_yield: 92.1,
  liquor_ac_ratio: 0.685,
  flocculant_dosing: 1.8,
  underflow_pump_speed: 55,
  clar_dilution: 70,
  clar_overflow_turbidity: 12.4,
  clar_underflow_density: 480.2,
  mud_bed_height: 1.8,
  cooling_flow_pct: 60,
  seed_ratio: 3.2,
  residence_time: 36,
  precip_temp1: 68.2,
  precip_temp2: 58.4,
  precip_temp3: 52.8,
  precip_growth_rate: 1.25,
  precip_mean_size: 78.4,
  precip_fines_pct: 4.2,
  precip_yield: 72.4,
  gas_flow: 8450,
  comb_air_pct: 65,
  calc_discharge: 128.5,
  calc_temp: 1023.5,
  calc_pre_temp: 385.0,
  calc_cool_temp: 82.0,
  calc_loi: 0.65,
  calc_gas_spec: 66.2,
  final_production_rate: 128.5,
  specific_energy: 8.42,
  co2_mass_flow: 82.5,
  specific_co2_intensity: 0.642,
  cogen_power: 42.8,
  condensate_recovery: 88.4,
};

const seedHistory = () => {
  const arr = [];
  const now = Date.now();
  for (let i = 9; i >= 0; i--) {
    const timeStr = new Date(now - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    arr.push({
      time: timeStr,
      production: 125 + Math.random() * 8,
      energy: 8.3 + Math.random() * 0.3,
      loi: 0.6 + Math.random() * 0.15,
      temp: 1010 + Math.random() * 20
    });
  }
  return arr;
};

export default function Dashboard() {
  // Navigation / Tabs
  // "simulator" = Plant Process Control, "dashboards" = Unified Parameters Dashboards
  const [activeTab, setActiveTab] = useState("simulator"); 
  const [view, setView] = useState("overview"); // Subviews in Simulator
  
  // Tab 1: Simulator States
  const [simState, setSimState] = useState(INITIAL_STATE);
  const [history, setHistory] = useState(seedHistory());
  const [alarms, setAlarms] = useState([]);
  const [simSpeed, setSimSpeed] = useState(1);
  const [systemTime, setSystemTime] = useState(new Date());

  // Tab 2: Unified Parameter Dashboards States
  const [dashboardsList, setDashboardsList] = useState([]);
  const [selectedDash, setSelectedDash] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-06-16");
  const [dashData, setDashData] = useState(null);
  const [loadingDash, setLoadingDash] = useState(false);
  const [dashError, setDashError] = useState("");

  const simSpeedRef = useRef(simSpeed);
  useEffect(() => {
    simSpeedRef.current = simSpeed;
  }, [simSpeed]);

  // ----------------------------------------------------
  // FETCH DASHBOARDS LIST (TAB 2)
  // ----------------------------------------------------
  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch(`/api/dashboards`, { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } });
        if (res.ok) {
          const list = await res.json();
          setDashboardsList(list);
          if (list.length > 0) {
            setSelectedDash(list[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dashboards list:", err);
      }
    };
    fetchList();
  }, []);

  // ----------------------------------------------------
  // FETCH ACTIVE DASHBOARD DATA (TAB 2)
  // ----------------------------------------------------
  const fetchDashboardData = async (dashName, dateStr) => {
    if (!dashName) return;
    setLoadingDash(true);
    setDashError("");
    try {
      const res = await fetch(`http://localhost:8000/api/dashboard/${dashName}?date=${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        setDashData(data);
      } else {
        setDashError("Error loading dashboard data.");
      }
    } catch (err) {
      setDashError("Failed to connect to API server.");
      console.error(err);
    } finally {
      setLoadingDash(false);
    }
  };

  useEffect(() => {
    if (activeTab === "dashboards" && selectedDash) {
      fetchDashboardData(selectedDash, selectedDate);
    }
  }, [activeTab, selectedDash, selectedDate]);

  // ----------------------------------------------------
  // SIMULATION TICK LOOP (TAB 1)
  // ----------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      if (simSpeedRef.current === 0) return;

      setSystemTime(prevTime => new Date(prevTime.getTime() + 1000 * simSpeedRef.current));

      setSimState(prev => {
        let next = { ...prev };

        for (let s = 0; s < simSpeedRef.current; s++) {
          // --- A. DIGESTION SIMULATION ---
          const targetTemp = 90 + (next.steam_valve_pct * 0.95) - (next.bauxite_feed_rate * 0.05);
          next.digestion_temp += (targetTemp - next.digestion_temp) * 0.15;
          
          const calcPress = Math.max(0.1, Math.exp((next.digestion_temp - 100) / 45) * 0.11);
          next.digestion_press += (calcPress - next.digestion_press) * 0.1;

          const tempOptimumEffect = Math.max(0, 1 - Math.pow((next.digestion_temp - 146) / 25, 2));
          const causticEffect = Math.max(0, 1 - Math.pow((next.caustic_conc - 225) / 70, 2));
          const silicaPenalty = (next.bauxite_silica_pct - 3) * 0.02;
          
          next.extraction_yield = 70 + (25 * tempOptimumEffect * causticEffect) - (silicaPenalty * 10) + (Math.random() * 0.2);
          next.extraction_yield = Math.max(50, Math.min(98.5, next.extraction_yield));
          next.liquor_ac_ratio = 0.45 + (next.extraction_yield / 100) * 0.26 * (next.bauxite_alumina_pct / 50);

          // --- B. CLARIFICATION SIMULATION ---
          const mudGenerationRate = next.bauxite_feed_rate * (1 - (next.bauxite_alumina_pct / 100)) * 0.8;
          const underflowCapacity = (next.underflow_pump_speed / 100) * 180;
          next.mud_bed_height += (mudGenerationRate - underflowCapacity) * 0.005;
          next.mud_bed_height = Math.max(0.2, Math.min(4.5, next.mud_bed_height));

          const flocDeviation = next.flocculant_dosing - 2.0;
          const baseTurbidity = 8.0 + Math.pow(flocDeviation * 6, 2);
          const flowDilutionEffect = (next.clar_dilution - 70) * 0.05;
          next.clar_overflow_turbidity = Math.max(2.0, baseTurbidity + flowDilutionEffect + (Math.random() * 0.4));
          next.clar_underflow_density = 400 + (next.mud_bed_height * 40) - (next.clar_dilution * 0.5) + (Math.random() * 2);

          // --- C. PRECIPITATION SIMULATION ---
          const baseLiquorTemp = next.digestion_temp * 0.6;
          const coolingDelta = next.cooling_flow_pct * 0.45;
          
          next.precip_temp1 = baseLiquorTemp - (coolingDelta * 0.3);
          next.precip_temp2 = baseLiquorTemp - (coolingDelta * 0.7);
          next.precip_temp3 = baseLiquorTemp - coolingDelta;

          const tempPrecipEffect = Math.max(0, 1 - Math.pow((next.precip_temp3 - 52) / 15, 2));
          const seedEffect = Math.max(0.2, 1 - Math.pow((next.seed_ratio - 3.5) / 2.5, 2));
          next.precip_yield = 50 + (25 * tempPrecipEffect * seedEffect) + (Math.random() * 0.3);
          next.precip_yield = Math.max(30, Math.min(85, next.precip_yield));

          next.precip_growth_rate = 0.5 + (0.02 * (65 - next.precip_temp3)) * (next.residence_time / 36);
          next.precip_growth_rate = Math.max(0.1, next.precip_growth_rate);

          const targetSize = 92 - (next.seed_ratio * 5.0) - (next.cooling_flow_pct * 0.15) + (next.residence_time * 0.2);
          next.precip_mean_size += (targetSize - next.precip_mean_size) * 0.05;
          next.precip_fines_pct = 2.0 + Math.max(0, (50 - next.precip_temp3) * 0.2) + Math.max(0, (3.0 - next.seed_ratio) * 1.5);

          // --- D. CALCINATION SIMULATION ---
          const airFuelRatio = next.comb_air_pct / (next.gas_flow / 120);
          const burnerEfficiency = Math.max(0.1, 1 - Math.pow(airFuelRatio - 1.0, 2) * 2.0);
          const calcTargetTemp = 400 + (next.gas_flow * 0.08) * burnerEfficiency - (next.calc_discharge * 0.8);
          
          next.calc_temp += (calcTargetTemp - next.calc_temp) * 0.1;
          next.calc_pre_temp = next.calc_temp * 0.38;
          next.calc_cool_temp = 45 + (next.calc_discharge * 0.3);

          next.calc_loi = 0.2 + Math.exp(-(next.calc_temp - 880) / 75);
          next.calc_loi = Math.max(0.05, Math.min(15.0, next.calc_loi));

          const potentialAlumina = next.bauxite_feed_rate * (next.bauxite_alumina_pct / 100) * (next.extraction_yield / 100) * (next.precip_yield / 100) * 1.6;
          next.final_production_rate = Math.min(next.calc_discharge, potentialAlumina);

          // --- E. GLOBAL PERFORMANCE ---
          const steamEnergy = next.steam_valve_pct * 0.045 * next.bauxite_feed_rate;
          const gasEnergy = next.gas_flow * 0.038;
          const totalEnergy = steamEnergy + gasEnergy;
          
          next.specific_energy = totalEnergy / Math.max(1, next.final_production_rate);
          next.specific_energy = Math.max(5.0, Math.min(15.0, next.specific_energy));

          next.co2_mass_flow = (next.gas_flow * 0.0019) + (steamEnergy * 0.05);
          next.specific_co2_intensity = next.co2_mass_flow / Math.max(1, next.final_production_rate);

          next.cogen_power = 20 + (steamEnergy * 0.08) + (Math.random() * 0.5);
          next.condensate_recovery = 92 - (next.steam_valve_pct * 0.05) + (Math.random() * 0.2);
        }

        auditAlarms(next);

        return next;
      });

      setHistory(prevHist => {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const nextHist = [...prevHist, {
          time: timeStr,
          production: parseFloat(simState.final_production_rate.toFixed(1)),
          energy: parseFloat(simState.specific_energy.toFixed(2)),
          loi: parseFloat(simState.calc_loi.toFixed(2)),
          temp: parseFloat(simState.calc_temp.toFixed(0))
        }];
        if (nextHist.length > 15) nextHist.shift();
        return nextHist;
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [simState]);

  // ----------------------------------------------------
  // ALARM AUDITOR & ACTIONS
  // ----------------------------------------------------
  const auditAlarms = (currentState) => {
    const list = [];

    if (currentState.digestion_press > 0.58) {
      list.push({ id: 'dig-press-high', tag: 'PT-102', severity: 'critical', sub: 'Digestion', msg: 'Autoclave 1 Pressure exceeds safety limits!', val: currentState.digestion_press.toFixed(2) + ' MPa', limit: '0.58 MPa' });
    }
    if (currentState.clar_overflow_turbidity > 35.0) {
      list.push({ id: 'clar-turb-high', tag: 'AIT-201', severity: 'critical', sub: 'Clarification', msg: 'High turbidity carryover risk! Add flocculant.', val: currentState.clar_overflow_turbidity.toFixed(1) + ' NTU', limit: '35.0 NTU' });
    }
    if (currentState.mud_bed_height > 3.5) {
      list.push({ id: 'clar-bed-high', tag: 'LT-204', severity: 'critical', sub: 'Clarification', msg: 'Thickener mud bed compaction critical!', val: currentState.mud_bed_height.toFixed(2) + ' m', limit: '3.50 m' });
    }
    if (currentState.calc_temp < 960.0) {
      list.push({ id: 'calc-temp-low', tag: 'TIC-401', severity: 'critical', sub: 'Calcination', msg: 'Furnace temp too low! Quality risk (LOI spike).', val: currentState.calc_temp.toFixed(1) + ' °C', limit: '960.0 °C' });
    }
    if (currentState.calc_loi > 1.0) {
      list.push({ id: 'calc-loi-high', tag: 'QIT-405', severity: 'critical', sub: 'Quality', msg: 'Alumina LOI out of spec!', val: currentState.calc_loi.toFixed(2) + ' %', limit: '1.00 %' });
    }

    setAlarms(prevAlarms => {
      let updated = [...prevAlarms];
      list.forEach(item => {
        if (!updated.some(a => a.id === item.id)) {
          updated.unshift({ ...item, timestamp: new Date().toLocaleTimeString(), acked: false });
        }
      });
      updated = updated.filter(a => list.some(item => item.id === a.id) || !a.acked);
      return updated;
    });
  };

  const acknowledgeAlarm = (id) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, acked: true } : a));
  };

  const acknowledgeAll = () => {
    setAlarms(prev => prev.map(a => ({ ...a, acked: true })));
  };

  const activeUnacked = alarms.filter(a => !a.acked);
  const healthStatusClass = activeUnacked.some(a => a.severity === "critical") ? "critical" : activeUnacked.length > 0 ? "warning" : "normal";

  // Recharts Helper Data
  const getFlocCurveData = () => {
    const data = [];
    for (let f = 0.5; f <= 4.0; f += 0.5) {
      const dev = f - 2.0;
      data.push({ floc: f.toFixed(1), turbidity: parseFloat((8.0 + Math.pow(dev * 6, 2) + (simState.clar_dilution - 70) * 0.05).toFixed(1)) });
    }
    return data;
  };

  const getEnergyBreakdown = () => {
    const steamMW = (simState.steam_valve_pct * 0.045 * simState.bauxite_feed_rate) / 1000;
    const gasMW = (simState.gas_flow * 0.038) / 1000;
    return [
      { name: "Digestion Steam", energy: parseFloat(steamMW.toFixed(1)), fill: "#06b6d4" },
      { name: "Calciner Fuel", energy: parseFloat(gasMW.toFixed(1)), fill: "#ef4444" },
      { name: "Raw Grinding", energy: 0.45, fill: "#f59e0b" },
      { name: "Clarification", energy: 0.32, fill: "#8b5cf6" },
    ];
  };

  // ----------------------------------------------------
  // GROUP DYNAMIC PARAMETERS BY CATEGORY (TAB 2)
  // ----------------------------------------------------
  const groupParamsByCategory = () => {
    if (!dashData || !dashData.parameters) return {};
    const groups = {};
    dashData.parameters.forEach(p => {
      const cat = p.category || "General Parameters";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  };

  const paramGroups = groupParamsByCategory();

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="logo-container">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div className="logo-text">AURA ALUMINA</div>
              <div className="logo-subtext">Refinery Control</div>
            </div>
          </div>
          
          {/* Main App Navigation Tabs */}
          <div style={{ marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>
            <button 
              className={`ack-btn`} 
              style={{ width: "100%", padding: "0.6rem", fontSize: "0.8rem", marginBottom: "0.5rem", background: activeTab === "simulator" ? "rgba(6, 182, 212, 0.15)" : "transparent", color: activeTab === "simulator" ? "var(--color-info)" : "var(--text-sub)", borderColor: activeTab === "simulator" ? "var(--color-info)" : "rgba(255,255,255,0.15)" }}
              onClick={() => setActiveTab("simulator")}
            >
              🕹️ Plant Process Control
            </button>
            <button 
              className={`ack-btn`}
              style={{ width: "100%", padding: "0.6rem", fontSize: "0.8rem", background: activeTab === "dashboards" ? "rgba(6, 182, 212, 0.15)" : "transparent", color: activeTab === "dashboards" ? "var(--color-info)" : "var(--text-sub)", borderColor: activeTab === "dashboards" ? "var(--color-info)" : "rgba(255,255,255,0.15)" }}
              onClick={() => setActiveTab("dashboards")}
            >
              📊 Unified Dashboards (15)
            </button>
          </div>

          {/* Tab 1: Simulator Subview Links */}
          {activeTab === "simulator" && (
            <nav>
              <ul className="nav-links">
                <li className={`nav-item ${view === "overview" ? "active" : ""}`}>
                  <button onClick={() => setView("overview")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                    Overview Dashboard
                  </button>
                </li>
                <li className={`nav-item ${view === "digestion" ? "active" : ""}`}>
                  <button onClick={() => setView("digestion")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    Digestion (Bayer)
                  </button>
                </li>
                <li className={`nav-item ${view === "clarification" ? "active" : ""}`}>
                  <button onClick={() => setView("clarification")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    Clarification & Settling
                  </button>
                </li>
                <li className={`nav-item ${view === "precipitation" ? "active" : ""}`}>
                  <button onClick={() => setView("precipitation")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8M12 8v8"></path></svg>
                    Precipitation (Seed)
                  </button>
                </li>
                <li className={`nav-item ${view === "calcination" ? "active" : ""}`}>
                  <button onClick={() => setView("calcination")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                    Calcination Kiln
                  </button>
                </li>
                <li className={`nav-item ${view === "energy" ? "active" : ""}`}>
                  <button onClick={() => setView("energy")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                    Energy & Sustainability
                  </button>
                </li>
                <li className={`nav-item ${view === "alarms" ? "active" : ""}`}>
                  <button onClick={() => setView("alarms")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    Alarms & Console
                  </button>
                </li>
              </ul>
            </nav>
          )}

          {/* Tab 2: Dashboard list dropdown selector */}
          {activeTab === "dashboards" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-sub)", letterSpacing: "1px" }}>Select Dashboard:</span>
              <ul className="nav-links">
                {dashboardsList.map((d, index) => (
                  <li key={d.name} className={`nav-item ${selectedDash === d.name ? "active" : ""}`} style={{ fontSize: "0.85rem" }}>
                    <button style={{ padding: "0.6rem 0.8rem" }} onClick={() => setSelectedDash(d.name)}>
                      <span style={{ color: "var(--color-info)", marginRight: "4px" }}>{String(index + 1).padStart(2, '0')}.</span>
                      {d.description}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="sim-speed-selector">
            <span>Simulation:</span>
            <select id="sim-speed" value={simSpeed} onChange={(e) => setSimSpeed(parseInt(e.target.value))}>
              <option value="0">PAUSED</option>
              <option value="1">1x Speed</option>
              <option value="2">2x Speed</option>
              <option value="5">5x Speed</option>
            </select>
          </div>
          <div className="system-health">
            <div className={`status-dot ${healthStatusClass}`}></div>
            <span>System Health: {simState.health.toFixed(1)}%</span>
          </div>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="main-layout">
        
        {/* ====================================================
            TAB 1: DYNAMIC PHYSICAL SCADA SIMULATOR VIEWPORT
            ==================================================== */}
        {activeTab === "simulator" && (
          <>
            <header className="header-bar">
              <div className="plant-title">
                <h1 style={{ textTransform: "capitalize" }}>{view} Dashboard</h1>
                <span>
                  Refinery Status:{" "}
                  <strong style={{ color: activeUnacked.some(a => a.severity === "critical") ? "var(--color-danger)" : activeUnacked.length > 0 ? "var(--color-warning)" : "var(--color-success)" }}>
                    {activeUnacked.some(a => a.severity === "critical") ? "CRITICAL ALERT" : activeUnacked.length > 0 ? "DISTURBED OPERATION" : "STEADY STATE"}
                  </strong>{" "}
                  | Timestamp: <span style={{ fontFamily: "var(--font-mono)" }}>{systemTime.toLocaleString()}</span>
                </span>
              </div>
              <div className="header-kpis">
                <div className="header-kpi-item">
                  <span className="header-kpi-label">Refined Alumina Output</span>
                  <span className="header-kpi-value emerald">{simState.final_production_rate.toFixed(1)} t/h</span>
                </div>
                <div className="header-kpi-item">
                  <span className="header-kpi-label">Specific Energy</span>
                  <span className="header-kpi-value cyan">{simState.specific_energy.toFixed(2)} GJ/t</span>
                </div>
                <div className="header-kpi-item">
                  <span className="header-kpi-label">Specific CO2 Intensity</span>
                  <span className="header-kpi-value gold">{simState.specific_co2_intensity.toFixed(3)} t/t</span>
                </div>
                <div className="header-kpi-item">
                  <span className="header-kpi-label">Active Alarms</span>
                  <span className="header-kpi-value rose">{activeUnacked.length}</span>
                </div>
              </div>
            </header>

            <main className="view-viewport">
              
              {/* SUBVIEW: OVERVIEW */}
              {view === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div className="kpi-row">
                    <div className="card">
                      <div className="card-glowing-accent gold"></div>
                      <div className="card-header">
                        <span className="card-title">Bauxite Feed Rate</span>
                        <span className="card-icon">🏗️</span>
                      </div>
                      <div className="card-value-group">
                        <span className="card-value">{simState.bauxite_feed_rate.toFixed(1)}</span>
                        <span className="card-unit">t/h</span>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-glowing-accent cyan"></div>
                      <div className="card-header">
                        <span className="card-title">Alumina-to-Caustic Ratio</span>
                        <span className="card-icon">🧪</span>
                      </div>
                      <div className="card-value-group">
                        <span className="card-value">{simState.liquor_ac_ratio.toFixed(3)}</span>
                        <span className="card-unit">A/C</span>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-glowing-accent emerald"></div>
                      <div className="card-header">
                        <span className="card-title">Precipitation Yield</span>
                        <span className="card-icon">💎</span>
                      </div>
                      <div className="card-value-group">
                        <span className="card-value">{simState.precip_yield.toFixed(1)}</span>
                        <span className="card-unit">%</span>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-glowing-accent rose"></div>
                      <div className="card-header">
                        <span className="card-title">Calciner Burner Fuel</span>
                        <span className="card-icon">🔥</span>
                      </div>
                      <div className="card-value-group">
                        <span className="card-value">{simState.gas_flow.toLocaleString()}</span>
                        <span className="card-unit">Nm³/h</span>
                      </div>
                    </div>
                  </div>

                  <div className="scada-card" style={{ minHeight: "400px" }}>
                    <div className="scada-header">
                      <span className="scada-title">🌍 Global Plant Flowsheet & Mass Balance</span>
                      <div className="scada-indicator">
                        <span className="status-dot normal"></span>
                        <span>Active flows visualizer</span>
                      </div>
                    </div>
                    <div className="scada-canvas-container" style={{ background: "#090e1a" }}>
                      <svg viewBox="0 0 900 320" className="svg-scada">
                        {/* Flowlines */}
                        <path d="M 40,80 L 140,80" className="pipe-bg" strokeWidth="6"/>
                        <path d="M 40,80 L 140,80" className="pipe-flow flow-bauxite" strokeWidth="4" style={{ animationDuration: `${12 * (320 / simState.bauxite_feed_rate)}s` }}/>
                        
                        <path d="M 240,80 L 320,80" className="pipe-bg" strokeWidth="6"/>
                        <path d="M 240,80 L 320,80" className="pipe-flow flow-slurry" strokeWidth="4" style={{ animationDuration: `${12 * (320 / simState.bauxite_feed_rate)}s` }}/>
                        
                        <path d="M 420,80 L 500,80" className="pipe-bg" strokeWidth="6"/>
                        <path d="M 420,80 L 500,80" className="pipe-flow flow-liquor" strokeWidth="4" style={{ animationDuration: `${12 * (210 / simState.caustic_conc)}s` }}/>
                        
                        <path d="M 370,120 L 370,220 L 20,220" className="pipe-bg" strokeWidth="6"/>
                        <path d="M 370,120 L 370,220 L 20,220" className="pipe-flow flow-mud" strokeWidth="4" style={{ animationDuration: `${15 * (55 / simState.underflow_pump_speed)}s` }}/>
                        
                        <path d="M 600,80 L 680,80" className="pipe-bg" strokeWidth="6"/>
                        <path d="M 600,80 L 680,80" className="pipe-flow flow-slurry" strokeWidth="4" style={{ animationDuration: `${12 * (128 / simState.calc_discharge)}s` }}/>
                        
                        <path d="M 780,80 L 860,80" className="pipe-bg" strokeWidth="6"/>
                        <path d="M 780,80 L 860,80" className="pipe-flow flow-alumina" strokeWidth="4" style={{ animationDuration: `${12 * (128 / simState.calc_discharge)}s` }}/>
                        
                        <path d="M 550,120 L 550,180 L 190,180 L 190,120" className="pipe-bg" strokeWidth="6"/>
                        <path d="M 550,120 L 550,180 L 190,180 L 190,120" className="pipe-flow flow-liquor" strokeWidth="4" style={{ animationDuration: `${12 * (210 / simState.caustic_conc)}s` }}/>

                        <rect x="140" y="40" width="100" height="80" rx="6" className="vessel active"/>
                        <text x="190" y="65" className="vessel-label">DIGESTION</text>
                        <text x="190" y="85" className="vessel-value">{simState.digestion_temp.toFixed(1)} °C</text>
                        <text x="190" y="105" fontSize="8" fill="var(--text-sub)" textAnchor="middle">Extraction: {simState.extraction_yield.toFixed(1)}%</text>

                        <rect x="320" y="40" width="100" height="80" rx="6" className="vessel active"/>
                        <text x="370" y="65" className="vessel-label">CLARIFICATION</text>
                        <text x="370" y="85" className="vessel-value">{simState.clar_overflow_turbidity.toFixed(0)} NTU</text>
                        <text x="370" y="105" fontSize="8" fill="var(--text-sub)" textAnchor="middle">Underflow: {simState.clar_underflow_density.toFixed(0)} g/L</text>

                        <rect x="500" y="40" width="100" height="80" rx="6" className="vessel active"/>
                        <text x="550" y="65" className="vessel-label">PRECIPITATION</text>
                        <text x="550" y="85" className="vessel-value">{simState.precip_temp3.toFixed(1)} °C</text>
                        <text x="550" y="105" fontSize="8" fill="var(--text-sub)" textAnchor="middle">Mean size: {simState.precip_mean_size.toFixed(1)} µm</text>

                        <rect x="680" y="40" width="100" height="80" rx="6" className="vessel active"/>
                        <text x="730" y="65" className="vessel-label">CALCINATION</text>
                        <text x="730" y="85" className="vessel-value">{simState.calc_temp.toFixed(1)} °C</text>
                        <text x="730" y="105" fontSize="8" fill="var(--text-sub)" textAnchor="middle">LOI: {simState.calc_loi.toFixed(2)}%</text>

                        <rect x="140" y="230" width="100" height="50" rx="6" fill="#111827" stroke="rgba(255,255,255,0.1)"/>
                        <text x="190" y="260" className="vessel-label">CAUSTIC DEPT</text>
                        
                        <rect x="320" y="230" width="100" height="50" rx="6" fill="#111827" stroke="rgba(255,255,255,0.1)"/>
                        <text x="370" y="260" className="vessel-label">RED MUD WASH</text>
                      </svg>
                    </div>
                  </div>

                  <div className="details-row">
                    <div className="card">
                      <span className="control-title">📈 Production Yield Trend</span>
                      <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={10} />
                            <YAxis stroke="var(--text-muted)" fontSize={10} domain={["auto", "auto"]} />
                            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid var(--border-card)" }} />
                            <Area type="monotone" dataKey="production" stroke="#10b981" fill="rgba(16, 185, 129, 0.1)" strokeWidth={2} name="Output (t/h)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="card">
                      <span className="control-title">📊 Energy Breakdown (MW Equivalent)</span>
                      <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getEnergyBreakdown()} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis type="number" stroke="var(--text-muted)" fontSize={10} />
                            <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={10} width={100} />
                            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid var(--border-card)" }} />
                            <Bar dataKey="energy" name="Energy (MW)" radius={4} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW: DIGESTION */}
              {view === "digestion" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div className="scada-layout">
                    <div className="scada-card">
                      <div className="scada-header">
                        <span className="scada-title">🛠️ Digestion Reactor Loop (Bayer Autoclaves)</span>
                      </div>
                      <div className="scada-canvas-container">
                        <svg viewBox="0 0 600 350" className="svg-scada">
                          <path d="M 20,260 L 100,260 L 100,200 L 160,200" className="pipe-bg" strokeWidth="8"/>
                          <path d="M 20,260 L 100,260 L 100,200 L 160,200" className="pipe-flow flow-slurry" strokeWidth="6" style={{ animationDuration: `${12 * (320 / simState.bauxite_feed_rate)}s` }}/>
                          <path d="M 300,50 L 300,90 L 230,90 L 230,130" className="pipe-bg" strokeWidth="6"/>
                          <path d="M 300,50 L 300,90 L 230,90 L 230,130" className="pipe-flow flow-steam" strokeWidth="4" />
                          <path d="M 20,130 L 160,130" className="pipe-bg" strokeWidth="6"/>
                          <path d="M 480,200 L 580,200" className="pipe-bg" strokeWidth="8"/>
                          
                          <circle cx="160" cy="165" r="40" className="vessel active"/>
                          <text x="160" y="160" className="vessel-label">PRE-MIXER</text>
                          <text x="160" y="175" className="vessel-value">{(simState.digestion_temp * 0.62).toFixed(1)} °C</text>

                          <path d="M 200,165 L 260,165" className="pipe-bg" strokeWidth="8"/>

                          <rect x="260" y="110" width="80" height="110" rx="8" className="vessel active"/>
                          <rect x="262" y={140 + (50 - simState.steam_valve_pct * 0.5)} width="76" height={80 - (50 - simState.steam_valve_pct * 0.5)} className="vessel-fill fill-slurry" />
                          <text x="300" y="150" className="vessel-label">AUTOCLAVE</text>
                          <text x="300" y="165" className="vessel-value">{simState.digestion_temp.toFixed(1)} °C</text>
                          <text x="300" y="180" fontSize="9" fill="var(--color-info)" textAnchor="middle">{simState.digestion_press.toFixed(2)} MPa</text>

                          <polygon points="220,90 240,90 230,105" className={`valve ${simState.steam_valve_pct > 10 ? 'open' : 'closed'}`}/>
                        </svg>
                      </div>
                    </div>

                    <div className="control-card">
                      <span className="control-title">🎛️ Operator Setpoints</span>
                      <div className="control-group">
                        <div className="control-label-row">
                          <span className="control-label">Steam Valve Control</span>
                          <span className="control-value">{simState.steam_valve_pct}%</span>
                        </div>
                        <input type="range" className="control-slider" min={0} max={100} value={simState.steam_valve_pct} onChange={(e) => setSimState(prev => ({ ...prev, steam_valve_pct: parseInt(e.target.value) }))} />
                      </div>
                      <div className="control-group">
                        <div className="control-label-row">
                          <span className="control-label">Bauxite Slurry Feed</span>
                          <span className="control-value">{simState.bauxite_feed_rate} t/h</span>
                        </div>
                        <input type="range" className="control-slider" min={150} max={450} value={simState.bauxite_feed_rate} onChange={(e) => setSimState(prev => ({ ...prev, bauxite_feed_rate: parseInt(e.target.value) }))} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* OTHER SIMULATOR VIEWS (Simplified/Abstracted to avoid code clutter) */}
              {(view === "clarification" || view === "precipitation" || view === "calcination" || view === "energy" || view === "alarms") && (
                <div className="scada-card" style={{ justifyContent: "center", alignItems: "center", padding: "3rem" }}>
                  <h2>{view.toUpperCase()} CONTROL PANEL</h2>
                  <p style={{ color: "var(--text-sub)", marginTop: "1rem" }}>
                    SCADA animations and controls active. Use the sidebar to switch to <strong>Unified Parameter Dashboards</strong> to view full plant metrics tables.
                  </p>
                  {view === "alarms" && (
                    <div className="alarm-table-container" style={{ width: "100%", marginTop: "2rem" }}>
                      <table className="alarm-table">
                        <thead>
                          <tr>
                            <th>Severity</th>
                            <th>Subsystem</th>
                            <th>Message</th>
                            <th>Value</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alarms.map(a => (
                            <tr key={a.id} className="alarm-row">
                              <td><span className={`alarm-badge ${a.severity}`}>{a.severity}</span></td>
                              <td>{a.sub}</td>
                              <td>{a.msg}</td>
                              <td>{a.val}</td>
                              <td>{!a.acked && <button className="ack-btn" onClick={() => acknowledgeAlarm(a.id)}>Acknowledge</button>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </main>
          </>
        )}

        {/* ====================================================
            TAB 2: UNIFIED PLANT PARAMETERS DASHBOARDS (15)
            ==================================================== */}
        {activeTab === "dashboards" && (
          <>
            <header className="header-bar" style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="plant-title">
                <h1>{dashboardsList.find(d => d.name === selectedDash)?.description || "Unified Telemetry Dashboard"}</h1>
                <span>Hindalco Belagavi Works Alumina Refinery | Third-Party API Sync</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-sub)" }}>Selected Date:</span>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                  style={{ 
                    background: "var(--bg-input)", 
                    border: "1px solid var(--border-card)", 
                    borderRadius: "6px", 
                    padding: "0.5rem", 
                    color: "var(--text-main)", 
                    outline: "none",
                    fontFamily: "var(--font-sans)"
                  }} 
                />
                <button 
                  className="ack-btn"
                  onClick={() => fetchDashboardData(selectedDash, selectedDate)}
                  style={{ padding: "0.5rem 1rem", border: "1px solid var(--color-info)", color: "var(--color-info)" }}
                >
                  🔄 Refresh API
                </button>
              </div>
            </header>

            <main className="view-viewport" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {loadingDash && (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "300px", gap: "1rem" }}>
                  <div style={{ width: "40px", height: "40px", border: "4px solid rgba(255,255,255,0.05)", borderTopColor: "var(--color-info)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  <span style={{ fontSize: "0.9rem", color: "var(--text-sub)", letterSpacing: "1px" }}>QUERYING COVACSIS HINDALCO API...</span>
                </div>
              )}

              {dashError && (
                <div className="card" style={{ borderLeft: "4px solid var(--color-danger)", padding: "1.5rem", background: "rgba(239, 68, 68, 0.05)" }}>
                  <span style={{ color: "var(--color-danger)", fontWeight: "600" }}>Connection Notice:</span>
                  <p style={{ color: "var(--text-sub)", fontSize: "0.95rem", marginTop: "0.5rem" }}>
                    {dashError}. Displaying cached & simulated plant telemetry based on DCS history.
                  </p>
                </div>
              )}

              {!loadingDash && dashData && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {Object.keys(paramGroups).map((categoryName) => {
                    const params = paramGroups[categoryName];

                    // RENDER TYPE A: TOP KPI CARD GRID (e.g. "Feed Hydrate Quality")
                    if (categoryName === "Feed Hydrate Quality") {
                      return (
                        <div key={categoryName} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          <div style={{ background: "linear-gradient(90deg, #581845, transparent)", padding: "0.5rem 1rem", borderRadius: "6px 6px 0 0", borderBottom: "2px solid #800A3F" }}>
                            <span style={{ fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "#f8fafc" }}>
                              {categoryName}
                            </span>
                          </div>
                          <div className="kpi-row" style={{ marginTop: "0.5rem" }}>
                            {params.map(p => (
                              <div className="card" key={p.parameterId} style={{ background: "rgba(30, 41, 59, 0.4)" }}>
                                <div className="card-header" style={{ marginBottom: "0.5rem" }}>
                                  <span className="card-title" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>{p.name}</span>
                                  <span style={{ fontSize: "0.65rem", color: "var(--text-sub)" }}>This Week</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                  <span className="card-value" style={{ fontSize: "1.4rem", color: "var(--color-info)" }}>
                                    {p.today !== null ? p.today.toFixed(p.name.includes("D50") ? 3 : 2) : "-"}
                                  </span>
                                  <span style={{ fontSize: "0.75rem", color: "var(--text-sub)", fontWeight: "500" }}>{p.unit}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    // RENDER TYPE B: DETAILED COMPARATIVE TABLES
                    const hasMTD = params.some(p => p.mtd !== null);
                    return (
                      <div key={categoryName} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        {/* Purple plum section header matching PFA */}
                        <div style={{ background: "linear-gradient(90deg, #581845, transparent)", padding: "0.5rem 1rem", borderRadius: "6px 6px 0 0", borderBottom: "2px solid #800A3F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "#f8fafc" }}>
                            {categoryName}
                          </span>
                        </div>

                        {/* Layout Table */}
                        <div className="alarm-table-container" style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
                          <table className="alarm-table" style={{ width: "100%" }}>
                            <thead>
                              <tr style={{ background: "rgba(255,255,255,0.01)" }}>
                                <th style={{ width: "35%", fontSize: "0.75rem", color: "var(--text-sub)", fontWeight: "600" }}>Parameter Tag & Descriptor</th>
                                <th style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-sub)", fontWeight: "600" }}>Today</th>
                                <th style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-sub)", fontWeight: "600" }}>Yesterday</th>
                                <th style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-sub)", fontWeight: "600" }}>{categoryName.includes("Production") ? "This Month" : "MTD / Average"}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {params.map(p => (
                                <tr key={p.parameterId} className="alarm-row" style={{ height: "42px" }}>
                                  <td style={{ fontWeight: "600", fontSize: "0.85rem", color: "var(--text-main)", paddingLeft: "1.5rem" }}>
                                    {p.name}{p.unit ? <span style={{ fontWeight: "400", color: "var(--text-sub)", fontSize: "0.75rem", marginLeft: "6px" }}>({p.unit})</span> : ""}
                                  </td>
                                  <td style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: p.today === 0 ? "var(--text-muted)" : "var(--color-success)" }}>
                                    {p.today !== null ? p.today.toFixed(2) : "-"}
                                  </td>
                                  <td style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--color-info)" }}>
                                    {p.yesterday !== null ? p.yesterday.toFixed(2) : "-"}
                                  </td>
                                  <td style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--color-warning)" }}>
                                    {p.mtd !== null ? p.mtd.toFixed(2) : "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          </>
        )}

      </div>
    </div>
  );
}