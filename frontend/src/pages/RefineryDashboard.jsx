import React, { useState, useEffect, useCallback, useMemo } from "react";
import { API_BASE, GROUPS, SECTIONS, TIME_RANGES, getDateString } from "../utils/config";
import "./RefineryDashboard.css";

// Load hidden params from localStorage
const STORAGE_KEY = "hindalco_hidden_params";
const loadHidden = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
};
const saveHidden = (h) => localStorage.setItem(STORAGE_KEY, JSON.stringify(h));

export default function RefineryDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRange, setTimeRange] = useState("today");
  const [selectedDate, setSelectedDate] = useState(getDateString(0));
  const [customFrom, setCustomFrom] = useState(getDateString(-7));
  const [customTo, setCustomTo] = useState(getDateString(0));
  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [hiddenParams, setHiddenParams] = useState(loadHidden);
  const [activeGroup, setActiveGroup] = useState(GROUPS[0]?.id || "");
  const [settingsSearch, setSettingsSearch] = useState("");

  const getActiveDate = useCallback(() => {
    if (timeRange === "today") return getDateString(0);
    if (timeRange === "yesterday") return getDateString(-1);
    if (timeRange === "custom") return customTo;
    return selectedDate;
  }, [timeRange, selectedDate, customTo]);

  // Fetch data for all machines in visible sections
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    const date = getActiveDate();
    const dashKeys = [...new Set(SECTIONS.map(s => s.dashboard))];

    try {
      const results = await Promise.allSettled(
        dashKeys.map(name =>
          fetch(`${API_BASE}/dashboard/${name}?date=${date}`).then(r => r.json())
        )
      );
      const newData = {};
      results.forEach((result, idx) => {
        if (result.status === "fulfilled" && result.value.parameters) {
          const dashName = dashKeys[idx];
          newData[dashName] = {};
          result.value.parameters.forEach(p => {
            newData[dashName][p.name] = { today: p.today, yesterday: p.yesterday, mtd: p.mtd };
          });
        }
      });
      setLiveData(newData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [getActiveDate]);

  useEffect(() => { fetchAllData(); const i = setInterval(fetchAllData, 5*60*1000); return ()=>clearInterval(i); }, [fetchAllData]);
  useEffect(() => { const t = setInterval(()=>setCurrentTime(new Date()), 60000); return ()=>clearInterval(t); }, []);

  // Toggle param visibility
  const toggleParam = (machine, paramName) => {
    const key = `${machine}::${paramName}`;
    setHiddenParams(prev => {
      const next = { ...prev };
      if (next[key]) delete next[key]; else next[key] = true;
      saveHidden(next);
      return next;
    });
  };

  // Toggle entire machine
  const toggleMachine = (machine, params, hide) => {
    setHiddenParams(prev => {
      const next = { ...prev };
      params.forEach(p => {
        const key = `${machine}::${p.name}`;
        if (hide) next[key] = true; else delete next[key];
      });
      saveHidden(next);
      return next;
    });
  };

  const isParamHidden = (machine, paramName) => !!hiddenParams[`${machine}::${paramName}`];

  const fmt = (val) => {
    if (val === null || val === undefined) return "\u2014";
    if (typeof val === "number") {
      if (Math.abs(val) >= 10000) return val.toLocaleString("en-IN", { maximumFractionDigits: 0 });
      if (Math.abs(val) >= 100) return val.toLocaleString("en-IN", { maximumFractionDigits: 1 });
      if (Math.abs(val) >= 1) return val.toFixed(2);
      return val.toFixed(3);
    }
    return val;
  };

  const getVal = (dashboard, paramName, field) => liveData?.[dashboard]?.[paramName]?.[field] ?? null;

  const getTrend = (dashboard, paramName) => {
    const today = getVal(dashboard, paramName, "today");
    const yesterday = getVal(dashboard, paramName, "yesterday");
    if (today === null || yesterday === null || yesterday === 0) return { arrow: "", color: "#8a9bb0", pct: "" };
    const pct = ((today - yesterday) / Math.abs(yesterday) * 100).toFixed(1);
    if (today > yesterday) return { arrow: "\u25b2", color: "#00A651", pct: `+${pct}%` };
    if (today < yesterday) return { arrow: "\u25bc", color: "#e53e3e", pct: `${pct}%` };
    return { arrow: "", color: "#8a9bb0", pct: "" };
  };

  // Filter visible sections
  const visibleSections = useMemo(() => {
    return SECTIONS.map(s => ({
      ...s,
      params: s.params.filter(p => !isParamHidden(s.dashboard, p.name))
    })).filter(s => s.params.length > 0);
  }, [hiddenParams]);

  // Group visible sections by group
  const groupedSections = useMemo(() => {
    const map = {};
    visibleSections.forEach(s => {
      if (!map[s.group]) map[s.group] = { title: s.groupTitle, sections: [] };
      map[s.group].sections.push(s);
    });
    return map;
  }, [visibleSections]);

  return (
    <div className="dashboard-root">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <div className="dashboard-logo">
            <svg width="145" height="36" viewBox="0 0 145 36" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="hTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff"/>
                  <stop offset="100%" stopColor="#bae6fd"/>
                </linearGradient>
              </defs>
              <text x="0" y="25" style={{ fontSize: 22, fontWeight: 900, fill: "url(#hTextGrad)", fontFamily: "Inter, sans-serif", letterSpacing: -0.5 }}>HINDALCO</text>
              <line x1="118" y1="4" x2="118" y2="18" stroke="#7dd3fc" strokeWidth="2.8" strokeLinecap="round"/>
              <line x1="111" y1="11" x2="125" y2="11" stroke="#7dd3fc" strokeWidth="2.8" strokeLinecap="round"/>
              <line x1="129" y1="11" x2="129" y2="27" stroke="#86efac" strokeWidth="2.4" strokeLinecap="round"/>
              <line x1="122" y1="19" x2="136" y2="19" stroke="#86efac" strokeWidth="2.4" strokeLinecap="round"/>
            </svg>
            <div className="header-divider"></div>
            <div>
              <div className="header-plant-name">Belgaum Refinery</div>
              <div className="header-plant-sub">Plant Monitoring Dashboard</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="header-time">
            {currentTime.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} &bull; {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </div>
          <button className="settings-btn" onClick={() => setShowSettings(true)} title="Configure Parameters">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>
        </div>
      </header>

      {/* TIME RANGE BAR */}
      <div className="dashboard-time-bar">
        <div className="dashboard-time-bar-left">
          <span className="time-bar-label">Period:</span>
          {TIME_RANGES.map(tr => (
            <button key={tr.value} onClick={() => setTimeRange(tr.value)}
              className={`dashboard-time-btn ${timeRange === tr.value ? "active" : ""}`}>
              {tr.label}
            </button>
          ))}
          {timeRange === "custom" && (
            <span className="custom-date-row">
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="dashboard-date-input" />
              <span className="date-sep">to</span>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="dashboard-date-input" />
            </span>
          )}
        </div>
        <div className="dashboard-time-bar-right">
          {loading && <span className="loading-indicator">Fetching data...</span>}
          {lastUpdated && !loading && (
            <span className="last-updated">Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
          )}
          <button onClick={fetchAllData} className="dashboard-refresh-btn">{"\u21bb"} Refresh</button>
        </div>
      </div>

      {/* GROUP TABS */}
      <div className="group-tabs">
        {GROUPS.map(g => (
          <button key={g.id} onClick={() => setActiveGroup(g.id)}
            className={`group-tab ${activeGroup === g.id ? "active" : ""}`}>
            {g.title}
            <span className="group-tab-count">{g.machines.length}</span>
          </button>
        ))}
      </div>

      {/* MAIN CONTENT — Show active group's machines */}
      <main className="dashboard-main">
        {visibleSections.filter(s => s.group === activeGroup).map(section => (
          <section key={section.id} className="dashboard-section">
            <h3 className="dashboard-section-title">
              <span className="section-icon"></span>
              {section.title}
            </h3>
            <div className="param-grid">
              {section.params.map(p => {
                const today = getVal(section.dashboard, p.name, "today");
                const yesterday = getVal(section.dashboard, p.name, "yesterday");
                const mtd = getVal(section.dashboard, p.name, "mtd");
                const trend = getTrend(section.dashboard, p.name);
                const hasData = today !== null || yesterday !== null || mtd !== null;
                return (
                  <div key={p.name} className={`param-card ${hasData ? "has-data" : "no-data"}`}>
                    <div className="param-label">{p.label}</div>
                    <div className="param-value-row">
                      <span className="param-value">{fmt(today)}</span>
                      <span className="param-unit">{p.unit || ""}</span>
                    </div>
                    {hasData && trend.arrow && (
                      <div className="param-trend" style={{ color: trend.color }}>{trend.arrow} {trend.pct}</div>
                    )}
                    <div className="param-compare">
                      <div className="param-compare-item">
                        <span className="compare-label">Yesterday</span>
                        <span className="compare-value">{fmt(yesterday)}</span>
                      </div>
                      <div className="param-compare-item">
                        <span className="compare-label">MTD</span>
                        <span className="compare-value mtd">{fmt(mtd)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
        {visibleSections.filter(s => s.group === activeGroup).length === 0 && (
          <div className="empty-state">
            <p>All parameters in this group are hidden.</p>
            <button onClick={() => setShowSettings(true)} className="dashboard-refresh-btn">Open Settings to enable</button>
          </div>
        )}
      </main>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-modal" onClick={e => e.stopPropagation()}>
            <div className="settings-header">
              <h2>Configure Parameters</h2>
              <button className="settings-close" onClick={() => setShowSettings(false)}>&times;</button>
            </div>
            <div className="settings-search">
              <input type="text" placeholder="Search parameters..." value={settingsSearch}
                onChange={e => setSettingsSearch(e.target.value)} className="settings-search-input" />
            </div>
            <div className="settings-body">
              {GROUPS.map(g => (
                <div key={g.id} className="settings-group">
                  <div className="settings-group-title">{g.title}</div>
                  {g.machines.map(m => {
                    const visibleCount = m.params.filter(p => !isParamHidden(m.machine, p.name)).length;
                    const filtered = settingsSearch
                      ? m.params.filter(p => p.name.toLowerCase().includes(settingsSearch.toLowerCase()) || m.machine.toLowerCase().includes(settingsSearch.toLowerCase()))
                      : m.params;
                    if (filtered.length === 0) return null;
                    return (
                      <div key={m.machine} className="settings-machine">
                        <div className="settings-machine-header">
                          <span className="settings-machine-name">{m.machine.replace(/_/g, " ")}</span>
                          <span className="settings-machine-count">{visibleCount}/{m.params.length}</span>
                          <button className="settings-toggle-all" onClick={() => toggleMachine(m.machine, m.params, visibleCount > 0)}>
                            {visibleCount > 0 ? "Hide All" : "Show All"}
                          </button>
                        </div>
                        <div className="settings-params-list">
                          {filtered.map(p => (
                            <label key={p.name} className="settings-param-item">
                              <input type="checkbox" checked={!isParamHidden(m.machine, p.name)}
                                onChange={() => toggleParam(m.machine, p.name)} />
                              <span className="settings-param-name">{p.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
