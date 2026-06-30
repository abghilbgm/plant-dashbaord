import React, { useState, useEffect, useCallback, useMemo } from "react";
import { API_BASE, GROUPS, SECTIONS, TIME_RANGES, getDateString } from "../utils/config";
import "./RefineryDashboard.css";

const STORAGE_KEY = "hindalco_hidden_params";
const loadHidden = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } };
const saveHidden = (h) => localStorage.setItem(STORAGE_KEY, JSON.stringify(h));

// Group order for Unit Head: Refinery first
const GROUP_ORDER = ["refinery","calcination","alumina_downstream","hydrate_downstream","evaporation","water","boiler_biomass","other"];

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
  const [activeGroup, setActiveGroup] = useState("refinery");
  const [settingsSearch, setSettingsSearch] = useState("");

  const orderedGroups = useMemo(() => {
    return GROUP_ORDER.map(id => GROUPS.find(g => g.id === id)).filter(Boolean);
  }, []);

  const getActiveDate = useCallback(() => {
    if (timeRange === "today") return getDateString(0);
    if (timeRange === "yesterday") return getDateString(-1);
    if (timeRange === "custom") return customTo;
    return selectedDate;
  }, [timeRange, selectedDate, customTo]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    const date = getActiveDate();
    const dashKeys = [...new Set(SECTIONS.map(s => s.dashboard))];
    try {
      const results = await Promise.allSettled(
        dashKeys.map(name => fetch(`${API_BASE}/dashboard/${encodeURIComponent(name)}?date=${date}`).then(r => r.json()))
      );
      const newData = {};
      results.forEach((result, idx) => {
        if (result.status === "fulfilled" && result.value.parameters) {
          newData[dashKeys[idx]] = {};
          result.value.parameters.forEach(p => {
            newData[dashKeys[idx]][p.name] = { today: p.today, yesterday: p.yesterday, mtd: p.mtd };
          });
        }
      });
      setLiveData(newData);
      setLastUpdated(new Date());
    } catch (err) { console.error("Fetch error:", err); }
    finally { setLoading(false); }
  }, [getActiveDate]);

  useEffect(() => { fetchAllData(); const i = setInterval(fetchAllData, 5*60*1000); return ()=>clearInterval(i); }, [fetchAllData]);
  useEffect(() => { const t = setInterval(()=>setCurrentTime(new Date()), 60000); return ()=>clearInterval(t); }, []);

  const toggleParam = (machine, paramName) => {
    const key = `${machine}::${paramName}`;
    setHiddenParams(prev => { const next = {...prev}; if(next[key]) delete next[key]; else next[key]=true; saveHidden(next); return next; });
  };
  const toggleMachine = (machine, params, hide) => {
    setHiddenParams(prev => { const next={...prev}; params.forEach(p=>{const k=`${machine}::${p.name}`; if(hide) next[k]=true; else delete next[k];}); saveHidden(next); return next; });
  };
  const isParamHidden = (machine, paramName) => !!hiddenParams[`${machine}::${paramName}`];

  const fmt = (val) => {
    if (val === null || val === undefined) return "\u2014";
    const n = Number(val);
    if (isNaN(n)) return val;
    if (Math.abs(n) >= 10000) return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
    if (Math.abs(n) >= 100) return n.toFixed(1);
    if (Math.abs(n) >= 1) return n.toFixed(2);
    return n.toFixed(3);
  };

  const getTrend = (today, yesterday) => {
    if (today == null || yesterday == null || yesterday === 0) return null;
    const pct = ((today - yesterday) / Math.abs(yesterday)) * 100;
    return pct;
  };

  const getVal = (dashboard, paramName, field) => liveData?.[dashboard]?.[paramName]?.[field] ?? null;

  const visibleSections = useMemo(() => {
    return SECTIONS.map(s => ({...s, params: s.params.filter(p => p.name && !isParamHidden(s.dashboard, p.name))})).filter(s => s.params.length > 0);
  }, [hiddenParams]);

  const activeSections = visibleSections.filter(s => s.group === activeGroup);

  // Count stats
  const totalParams = activeSections.reduce((acc, s) => acc + s.params.length, 0);
  const paramsWithData = activeSections.reduce((acc, s) => acc + s.params.filter(p => getVal(s.dashboard, p.name, "today") !== null).length, 0);

  return (
    <div className="uh-root">
      {/* EXECUTIVE HEADER */}
      <header className="uh-header">
        <div className="uh-header-left">
          <div className="uh-logo">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" fill="none" stroke="#29ABE2" strokeWidth="2"/>
              <circle cx="24" cy="24" r="18" fill="none" stroke="#0072BC" strokeWidth="1.5"/>
              <path d="M14 32 L24 12 L34 32 Z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
              <line x1="17" y1="26" x2="31" y2="26" stroke="#29ABE2" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="uh-title-area">
            <div className="uh-brand">HINDALCO INDUSTRIES LIMITED</div>
            <div className="uh-title">Speciality Alumina Refinery &mdash; Unit Head Dashboard</div>
          </div>
        </div>
        <div className="uh-header-right">
          <div className="uh-status-block">
            <div className="uh-status-dot"></div>
            <span>LIVE</span>
          </div>
          <div className="uh-time-block">
            <div className="uh-date">{currentTime.toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})}</div>
            <div className="uh-clock">{currentTime.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
          </div>
          <button className="uh-settings-btn" onClick={()=>setShowSettings(true)} title="Configure Parameters">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="uh-nav">
        <div className="uh-nav-tabs">
          {orderedGroups.map(g => (
            <button key={g.id} onClick={()=>setActiveGroup(g.id)} className={`uh-tab ${activeGroup===g.id?"active":""}`}>
              <span className="uh-tab-label">{g.title}</span>
              <span className="uh-tab-count">{visibleSections.filter(s=>s.group===g.id).length}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* CONTROL BAR */}
      <div className="uh-controls">
        <div className="uh-time-range">
          {TIME_RANGES.map(tr => (
            <button key={tr.value} onClick={()=>setTimeRange(tr.value)} className={`uh-tr-btn ${timeRange===tr.value?"active":""}`}>{tr.label}</button>
          ))}
          {timeRange === "custom" && (
            <span className="uh-custom-dates">
              <input type="date" value={customFrom} onChange={e=>setCustomFrom(e.target.value)} />
              <span className="uh-date-sep">to</span>
              <input type="date" value={customTo} onChange={e=>setCustomTo(e.target.value)} />
            </span>
          )}
        </div>
        <div className="uh-controls-right">
          <div className="uh-kpi-pill"><span className="uh-kpi-num">{activeSections.length}</span> Sections</div>
          <div className="uh-kpi-pill"><span className="uh-kpi-num">{totalParams}</span> Parameters</div>
          <div className="uh-kpi-pill data"><span className="uh-kpi-num">{paramsWithData}</span> Reporting</div>
          {loading && <span className="uh-loading-indicator">Fetching...</span>}
          {lastUpdated && !loading && <span className="uh-last-update">Updated {lastUpdated.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</span>}
          <button onClick={fetchAllData} className="uh-refresh-btn" title="Refresh Data">&#8635;</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="uh-main">
        {activeSections.map(section => (
          <div key={section.id} className="uh-section">
            <div className="uh-section-header">
              <span className="uh-section-icon">&#9670;</span>
              <span className="uh-section-name">{section.title}</span>
              <span className="uh-section-badge">{section.params.length} params</span>
            </div>
            <div className="uh-table-wrap">
              <table className="uh-table">
                <thead>
                  <tr>
                    <th className="th-param">Parameter</th>
                    <th className="th-val">Today</th>
                    <th className="th-val">Yesterday</th>
                    <th className="th-val">MTD Avg</th>
                    <th className="th-trend">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {section.params.map(p => {
                    const today = getVal(section.dashboard, p.name, "today");
                    const yesterday = getVal(section.dashboard, p.name, "yesterday");
                    const mtd = getVal(section.dashboard, p.name, "mtd");
                    const trend = getTrend(today, yesterday);
                    return (
                      <tr key={p.name} className={today !== null ? "" : "no-data"}>
                        <td className="td-param">{p.label || p.name}</td>
                        <td className="td-val td-today">{fmt(today)}</td>
                        <td className="td-val td-yesterday">{fmt(yesterday)}</td>
                        <td className="td-val td-mtd">{fmt(mtd)}</td>
                        <td className="td-trend">
                          {trend !== null && (
                            <span className={`trend-badge ${trend >= 0 ? "up" : "down"}`}>
                              {trend >= 0 ? "\u25B2" : "\u25BC"} {Math.abs(trend).toFixed(1)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {activeSections.length === 0 && (
          <div className="uh-empty">
            <p>No parameters visible for this section.</p>
            <button onClick={()=>setShowSettings(true)}>Open Settings to Configure</button>
          </div>
        )}
      </main>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="uh-overlay" onClick={()=>setShowSettings(false)}>
          <div className="uh-modal" onClick={e=>e.stopPropagation()}>
            <div className="uh-modal-header">
              <h2>Configure Dashboard Parameters</h2>
              <p className="uh-modal-sub">Select parameters to display on Unit Head view</p>
              <button className="uh-modal-close" onClick={()=>setShowSettings(false)}>&times;</button>
            </div>
            <div className="uh-modal-search">
              <input type="text" placeholder="Search machines or parameters..." value={settingsSearch} onChange={e=>setSettingsSearch(e.target.value)} />
            </div>
            <div className="uh-modal-body">
              {orderedGroups.map(g => (
                <div key={g.id} className="uh-modal-group">
                  <div className="uh-modal-group-title">{g.title}</div>
                  {g.machines.map(m => {
                    const vis = m.params.filter(p => p.name && !isParamHidden(m.machine, p.name)).length;
                    const total = m.params.filter(p => p.name).length;
                    const filtered = settingsSearch ? m.params.filter(p => p.name && (p.name.toLowerCase().includes(settingsSearch.toLowerCase()) || m.machine.toLowerCase().includes(settingsSearch.toLowerCase()))) : m.params.filter(p => p.name);
                    if (filtered.length === 0) return null;
                    return (
                      <div key={m.machine} className="uh-modal-machine">
                        <div className="uh-modal-machine-hdr">
                          <span className="uh-mm-name">{m.machine.replace(/_/g," ")}</span>
                          <span className="uh-mm-count">{vis}/{total}</span>
                          <button className="uh-mm-toggle" onClick={()=>toggleMachine(m.machine, m.params.filter(p=>p.name), vis>0)}>{vis>0?"Hide All":"Show All"}</button>
                        </div>
                        <div className="uh-modal-params">
                          {filtered.map(p => (
                            <label key={p.name} className="uh-param-label">
                              <input type="checkbox" checked={!isParamHidden(m.machine,p.name)} onChange={()=>toggleParam(m.machine,p.name)}/>
                              <span>{p.name}</span>
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
