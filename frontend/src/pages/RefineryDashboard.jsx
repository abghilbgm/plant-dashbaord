import React, { useState, useEffect, useCallback, useMemo } from "react";
import { API_BASE, GROUPS, SECTIONS, TIME_RANGES, getDateString } from "../utils/config";
import "./RefineryDashboard.css";

const STORAGE_KEY = "hindalco_hidden_params";
const loadHidden = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } };
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

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    const date = getActiveDate();
    const dashKeys = [...new Set(SECTIONS.map(s => s.dashboard))];
    try {
      const results = await Promise.allSettled(
        dashKeys.map(name => fetch(`${API_BASE}/dashboard/${name}?date=${date}`).then(r => r.json()))
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
    if (typeof val === "number") {
      if (Math.abs(val) >= 10000) return val.toLocaleString("en-IN", { maximumFractionDigits: 0 });
      if (Math.abs(val) >= 100) return val.toLocaleString("en-IN", { maximumFractionDigits: 1 });
      if (Math.abs(val) >= 1) return val.toFixed(2);
      return val.toFixed(3);
    }
    return val;
  };

  const getVal = (dashboard, paramName, field) => liveData?.[dashboard]?.[paramName]?.[field] ?? null;

  const visibleSections = useMemo(() => {
    return SECTIONS.map(s => ({...s, params: s.params.filter(p => !isParamHidden(s.dashboard, p.name))})).filter(s => s.params.length > 0);
  }, [hiddenParams]);

  return (
    <div className="dpr-root">
      {/* HEADER */}
      <header className="dpr-header">
        <div className="dpr-header-left">
          <div className="dpr-logo-block">
            <svg width="160" height="44" viewBox="0 0 160 44">
              <rect width="160" height="44" rx="4" fill="#0057a0"/>
              <text x="80" y="18" textAnchor="middle" fill="#fff" style={{fontSize:9,fontWeight:600,fontFamily:'Inter,sans-serif',letterSpacing:'1.5px'}}>ADITYA BIRLA GROUP</text>
              <text x="80" y="34" textAnchor="middle" fill="#fff" style={{fontSize:14,fontWeight:900,fontFamily:'Inter,sans-serif',letterSpacing:'2px'}}>HINDALCO</text>
              <rect x="30" y="39" width="100" height="2" rx="1" fill="#29ABE2"/>
            </svg>
          </div>
          <div className="dpr-title-block">
            <div className="dpr-title">BLG - Refinery Overview</div>
            <div className="dpr-subtitle">Plant Parameters Dashboard</div>
          </div>
        </div>
        <div className="dpr-header-right">
          <span className="dpr-datetime">{currentTime.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})} {currentTime.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</span>
          <button className="dpr-settings-btn" onClick={()=>setShowSettings(true)} title="Configure Parameters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>
        </div>
      </header>

      {/* NAV TABS */}
      <nav className="dpr-nav">
        {GROUPS.map(g => (
          <button key={g.id} onClick={()=>setActiveGroup(g.id)} className={`dpr-nav-btn ${activeGroup===g.id?"active":""}`}>{g.title}</button>
        ))}
      </nav>

      {/* TIME BAR */}
      <div className="dpr-timebar">
        {TIME_RANGES.map(tr => (
          <button key={tr.value} onClick={()=>setTimeRange(tr.value)} className={`dpr-time-btn ${timeRange===tr.value?"active":""}`}>{tr.label}</button>
        ))}
        {timeRange === "custom" && (
          <span className="dpr-custom-dates">
            <input type="date" value={customFrom} onChange={e=>setCustomFrom(e.target.value)} />
            <span>to</span>
            <input type="date" value={customTo} onChange={e=>setCustomTo(e.target.value)} />
          </span>
        )}
        <span className="dpr-timebar-right">
          {loading && <span className="dpr-loading">Loading...</span>}
          {lastUpdated && !loading && <span className="dpr-updated">Last: {lastUpdated.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</span>}
          <button onClick={fetchAllData} className="dpr-refresh">{"\u21bb"}</button>
        </span>
      </div>

      {/* MAIN GRID */}
      <main className="dpr-main">
        {visibleSections.filter(s => s.group === activeGroup).map(section => (
          <div key={section.id} className="dpr-section">
            <div className="dpr-section-title">{section.title}</div>
            <table className="dpr-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Today</th>
                  <th>Yesterday</th>
                  <th>MTD</th>
                </tr>
              </thead>
              <tbody>
                {section.params.map(p => {
                  const today = getVal(section.dashboard, p.name, "today");
                  const yesterday = getVal(section.dashboard, p.name, "yesterday");
                  const mtd = getVal(section.dashboard, p.name, "mtd");
                  const hasData = today !== null;
                  return (
                    <tr key={p.name} className={hasData ? "" : "no-data"}>
                      <td className="dpr-param-name">{p.label}</td>
                      <td className="dpr-val today">{fmt(today)}</td>
                      <td className="dpr-val yesterday">{fmt(yesterday)}</td>
                      <td className="dpr-val mtd">{fmt(mtd)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
        {visibleSections.filter(s => s.group === activeGroup).length === 0 && (
          <div className="dpr-empty">All parameters hidden. Click <button onClick={()=>setShowSettings(true)}>Settings</button> to enable.</div>
        )}
      </main>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="dpr-overlay" onClick={()=>setShowSettings(false)}>
          <div className="dpr-modal" onClick={e=>e.stopPropagation()}>
            <div className="dpr-modal-header">
              <h2>Configure Parameters</h2>
              <button onClick={()=>setShowSettings(false)}>&times;</button>
            </div>
            <div className="dpr-modal-search">
              <input type="text" placeholder="Search parameters..." value={settingsSearch} onChange={e=>setSettingsSearch(e.target.value)} />
            </div>
            <div className="dpr-modal-body">
              {GROUPS.map(g => (
                <div key={g.id} className="dpr-modal-group">
                  <div className="dpr-modal-group-title">{g.title}</div>
                  {g.machines.map(m => {
                    const vis = m.params.filter(p => !isParamHidden(m.machine, p.name)).length;
                    const filtered = settingsSearch ? m.params.filter(p => p.name.toLowerCase().includes(settingsSearch.toLowerCase()) || m.machine.toLowerCase().includes(settingsSearch.toLowerCase())) : m.params;
                    if (filtered.length === 0) return null;
                    return (
                      <div key={m.machine} className="dpr-modal-machine">
                        <div className="dpr-modal-machine-hdr">
                          <span>{m.machine.replace(/_/g," ")}</span>
                          <span className="dpr-modal-count">{vis}/{m.params.length}</span>
                          <button onClick={()=>toggleMachine(m.machine, m.params, vis>0)}>{vis>0?"Hide All":"Show All"}</button>
                        </div>
                        <div className="dpr-modal-params">
                          {filtered.map(p => (
                            <label key={p.name}><input type="checkbox" checked={!isParamHidden(m.machine,p.name)} onChange={()=>toggleParam(m.machine,p.name)}/>{p.name}</label>
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
