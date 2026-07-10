import React, { useState, useEffect } from "react";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

// ── Weather helpers ────────────────────────────────────────────
// Plant location: Hindalco Utkal Alumina, Rayagada, Odisha
const PLANT_LAT = 15.8497;
const PLANT_LON = 74.4977;
const PLANT_LABEL = "Belagavi, Karnataka";

const WMO_ICONS = {
  0:  { icon: "☀️", label: "Clear" },
  1:  { icon: "🌤️", label: "Mainly Clear" },
  2:  { icon: "⛅", label: "Partly Cloudy" },
  3:  { icon: "☁️", label: "Overcast" },
  45: { icon: "🌫️", label: "Foggy" },
  48: { icon: "🌫️", label: "Icy Fog" },
  51: { icon: "🌦️", label: "Light Drizzle" },
  53: { icon: "🌦️", label: "Drizzle" },
  55: { icon: "🌧️", label: "Heavy Drizzle" },
  61: { icon: "🌧️", label: "Light Rain" },
  63: { icon: "🌧️", label: "Rain" },
  65: { icon: "🌧️", label: "Heavy Rain" },
  71: { icon: "❄️", label: "Light Snow" },
  73: { icon: "❄️", label: "Snow" },
  75: { icon: "❄️", label: "Heavy Snow" },
  77: { icon: "🌨️", label: "Snow Grains" },
  80: { icon: "🌦️", label: "Light Showers" },
  81: { icon: "🌧️", label: "Showers" },
  82: { icon: "⛈️", label: "Heavy Showers" },
  85: { icon: "🌨️", label: "Snow Showers" },
  86: { icon: "🌨️", label: "Heavy Snow Showers" },
  95: { icon: "⛈️", label: "Thunderstorm" },
  96: { icon: "⛈️", label: "Storm + Hail" },
  99: { icon: "⛈️", label: "Heavy Storm + Hail" },
};
function wmoInfo(code) {
  return WMO_ICONS[code] || { icon: "🌡️", label: `Code ${code}` };
}

const SHORT_DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDay(dateStr) {
  const d = new Date(dateStr);
  return `${SHORT_DAYS[d.getDay()]} ${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
}

function rainColor(mm) {
  if (mm === 0) return "#4a5568";
  if (mm < 5)  return "#3182ce";
  if (mm < 20) return "#2b6cb0";
  return "#1a365d";
}

function useWeatherForecast() {
  const [weather, setWeather] = useState(null);
  const [error, setError]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchWeather() {
      setLoading(true);
      try {
        const today = new Date();
        const end   = new Date(today);
        end.setDate(end.getDate() + 15); // Open-Meteo free tier max is 16 days
        const fmt = (d) => d.toISOString().split("T")[0];

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${PLANT_LAT}&longitude=${PLANT_LON}`
          + `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,precipitation_probability_max`
          + `&timezone=Asia%2FKolkata`
          + `&start_date=${fmt(today)}&end_date=${fmt(end)}`;

        const res  = await fetch(url);
        const json = await res.json();
        if (!cancelled) {
          if (json.error) {
            setError(json.reason || "Failed to load weather data.");
            setWeather(null);
          } else {
            setWeather(json.daily);
            setError(null);
          }
        }
      } catch (e) {
        if (!cancelled) setError("Failed to load weather data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchWeather();
    const timer = setInterval(fetchWeather, 60 * 60 * 1000); // refresh hourly
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  return { weather, error, loading };
}

export default function UnitHeadDashboardView({ data, loading, fmt }) {
  if (loading && !data) {
    return (
      <div className="uh-loading-container">
        <div className="uh-spinner"></div>
        <p>Loading Executive Metrics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="uh-error-container">
        <p>Failed to load Unit Head Dashboard data. Please refresh.</p>
      </div>
    );
  }

  const { safety, production, fgStock, processParams, rawMaterials, powerEngg } = data;
  const { weather: wx, error: wxError, loading: wxLoading } = useWeatherForecast();

  return (
    <div className="uh-grid-container">
      {/* 1. SAFETY & COMPLIANCE HEADER CARD */}
      <div className="uh-card safety-card span-all">
        <div className="uh-card-header">

          <h3>Safety & Compliance KPI Summary</h3>
        </div>
        <div className="safety-metrics-grid">
          {/* First Aid */}
          <div className="safety-tile">
            <div className="safety-label">First Aid (FA)</div>
            <div className="safety-badge green">0 Today</div>
            <div className="safety-sub">MTD: {safety.fa_mtd} | YTD: {safety.fa_ytd}</div>
          </div>
          {/* Lost Time Injury */}
          <div className="safety-tile">
            <div className="safety-label">Lost Time Injury (LTI)</div>
            <div className="safety-badge green">0 Today</div>
            <div className="safety-sub">MTD: {safety.lti_mtd} | YTD: {safety.lti_ytd}</div>
          </div>
          {/* BBSO */}
          <div className="safety-tile">
            <div className="safety-label">BBSO Adherence</div>
            <div className="safety-value">{safety.bbso_today}%</div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${safety.bbso_today}%` }}></div>
            </div>
            <div className="safety-sub">Target: 95.0% | MTD: {safety.bbso_mtd}%</div>
          </div>
          {/* Walkdowns */}
          <div className="safety-tile">
            <div className="safety-label">Mgt Walkdown (Count / % Close)</div>
            <div className="safety-value">{safety.walk_count_today} / {safety.walk_close_pct}%</div>
            <div className="safety-sub">MTD Count: {safety.walk_count_mtd}</div>
          </div>
          {/* NDO Adherence */}
          <div className="safety-tile">
            <div className="safety-label">NDO Plan Adh. / Comp. Obs.</div>
            <div className="safety-value">{safety.ndo_adh_pct}% / {safety.ndo_comp_pct}%</div>
          </div>
          {/* E-Permit */}
          <div className="safety-tile">
            <div className="safety-label">e-Permit Verification</div>
            <div className="safety-value">{safety.e_permit_pct}%</div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${safety.e_permit_pct}%` }}></div>
            </div>
          </div>
        </div>
      </div>


      {/* WEATHER FORECAST CARD – 30 days */}
      <div className="uh-card weather-card span-all">
        <div className="uh-card-header">
          <h3>🌦️ 16-Day Weather Forecast — {PLANT_LABEL}</h3>
          <span className="wx-source">Source: Open-Meteo • Updates hourly</span>
        </div>

        {wxLoading && !wx && (
          <div className="wx-loading"><div className="uh-spinner" style={{width:24,height:24,marginRight:10}}/>Loading forecast…</div>
        )}
        {wxError && !wx && (
          <div className="wx-error">⚠️ {wxError}</div>
        )}

        {wx && (
          <>
            {/* Summary stats row */}
            <div className="wx-summary-row">
              <div className="wx-stat">
                <span className="wx-stat-label">Hottest Day</span>
                <span className="wx-stat-val" style={{color:"#fc8181"}}>
                  {Math.max(...wx.temperature_2m_max).toFixed(0)}°C
                  <small> on {formatDay(wx.time[wx.temperature_2m_max.indexOf(Math.max(...wx.temperature_2m_max))])}</small>
                </span>
              </div>
              <div className="wx-stat">
                <span className="wx-stat-label">Coolest Night</span>
                <span className="wx-stat-val" style={{color:"#90cdf4"}}>
                  {Math.min(...wx.temperature_2m_min).toFixed(0)}°C
                  <small> on {formatDay(wx.time[wx.temperature_2m_min.indexOf(Math.min(...wx.temperature_2m_min))])}</small>
                </span>
              </div>
              <div className="wx-stat">
                <span className="wx-stat-label">Rainy Days</span>
                <span className="wx-stat-val" style={{color:"#63b3ed"}}>
                  {wx.precipitation_sum.filter(p => p > 0).length}
                  <small> / 16 days</small>
                </span>
              </div>
              <div className="wx-stat">
                <span className="wx-stat-label">Total Rainfall</span>
                <span className="wx-stat-val" style={{color:"#4299e1"}}>
                  {wx.precipitation_sum.reduce((a,b)=>a+b,0).toFixed(1)} mm
                </span>
              </div>
              <div className="wx-stat">
                <span className="wx-stat-label">Max Wind Speed</span>
                <span className="wx-stat-val" style={{color:"#b794f4"}}>
                  {Math.max(...wx.windspeed_10m_max).toFixed(0)} km/h
                </span>
              </div>
            </div>

            {/* Trend Chart */}
            <div style={{ width: '100%', height: 350, marginTop: 20, marginBottom: 30 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={wx.time.map((t, i) => ({
                    name: new Date(t).getDate() + ' ' + SHORT_MONTHS[new Date(t).getMonth()],
                    maxTemp: wx.temperature_2m_max[i],
                    minTemp: wx.temperature_2m_min[i],
                    rain: wx.precipitation_sum[i]
                  }))}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid stroke="#2d3748" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#a0aec0" fontSize={12} tickMargin={10} />
                  <YAxis yAxisId="left" stroke="#a0aec0" fontSize={12} unit="°C" domain={['auto', 'auto']} />
                  <YAxis yAxisId="right" orientation="right" stroke="#63b3ed" fontSize={12} unit="mm" allowDecimals={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568', borderRadius: 8, color: '#e2e8f0' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 20 }} />
                  <Bar yAxisId="right" dataKey="rain" name="Rainfall" fill="#3182ce" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Line yAxisId="left" type="monotone" dataKey="maxTemp" name="Max Temp" stroke="#fc8181" strokeWidth={3} dot={{ r: 4, fill: '#1a202c' }} activeDot={{ r: 6 }} />
                  <Line yAxisId="left" type="monotone" dataKey="minTemp" name="Min Temp" stroke="#63b3ed" strokeWidth={3} dot={{ r: 4, fill: '#1a202c' }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Scrollable day strip */}
            <div className="wx-scroll-container">
              {wx.time.map((dateStr, i) => {
                const info = wmoInfo(wx.weathercode[i]);
                const tMax = wx.temperature_2m_max[i];
                const tMin = wx.temperature_2m_min[i];
                const rain = wx.precipitation_sum[i];
                const rainProb = wx.precipitation_probability_max[i];
                const wind = wx.windspeed_10m_max[i];
                const isToday = i === 0;
                const maxRain = Math.max(...wx.precipitation_sum, 1);
                return (
                  <div key={dateStr} className={`wx-day-card ${isToday ? "wx-today" : ""}`}>
                    <div className="wx-day-name">{isToday ? "Today" : SHORT_DAYS[new Date(dateStr).getDay()]}</div>
                    <div className="wx-day-date">{new Date(dateStr).getDate()} {SHORT_MONTHS[new Date(dateStr).getMonth()]}</div>
                    <div className="wx-icon">{info.icon}</div>
                    <div className="wx-condition">{info.label}</div>
                    <div className="wx-temps">
                      <span className="wx-tmax">{tMax?.toFixed(0)}°</span>
                      <span className="wx-tsep">/</span>
                      <span className="wx-tmin">{tMin?.toFixed(0)}°</span>
                    </div>
                    {/* Rain probability bar */}
                    <div className="wx-rain-prob-bar-bg">
                      <div className="wx-rain-prob-bar" style={{width:`${rainProb || 0}%`, background: (rainProb||0) > 60 ? "#3182ce":"#63b3ed"}}/>
                    </div>
                    <div className="wx-rain-info">
                      <span title="Rain probability">💧{rainProb ?? 0}%</span>
                      {rain > 0 && <span style={{color:"#63b3ed", marginLeft:4}}>{rain.toFixed(1)}mm</span>}
                    </div>
                    <div className="wx-wind">💨 {wind?.toFixed(0)} km/h</div>
                    {/* Rainfall column mini-bar */}
                    <div className="wx-rain-bar-bg">
                      <div className="wx-rain-bar" style={{height:`${(rain/maxRain)*100}%`, background: rainColor(rain)}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>


      {/* 2. PRODUCTION & DESPATCH GRID */}
      <div className="uh-card production-card">
        <div className="uh-card-header">

          <h3>Production & Despatch</h3>
        </div>
        <div className="uh-table-wrap">
          <table className="uh-custom-table">
            <thead>
              <tr>
                <th>Product</th>
                <th className="txt-right">Daily (A/P)</th>
                <th className="txt-right">MTD (A/P)</th>
                <th className="txt-right">YTD (A/P)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Hydrate (Hyd)</td>
                <td className="txt-right font-mono">{fmt(production.hydrate.d_act)} / {fmt(production.hydrate.d_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.hydrate.mtd_act)} / {fmt(production.hydrate.mtd_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.hydrate.ytd_act)} / {fmt(production.hydrate.ytd_plan)}</td>
              </tr>
              <tr>
                <td className="font-bold">Calcined (Cal)</td>
                <td className="txt-right font-mono">{fmt(production.calcined.d_act)} / {fmt(production.calcined.d_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.calcined.mtd_act)} / {fmt(production.calcined.mtd_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.calcined.ytd_act)} / {fmt(production.calcined.ytd_plan)}</td>
              </tr>
              <tr className="special-row">
                <td className="font-bold">* Spl Hydrate</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.d_act)} / {fmt(production.special_hydrate.d_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.mtd_act)} / {fmt(production.special_hydrate.mtd_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.ytd_act)} / {fmt(production.special_hydrate.ytd_plan)}</td>
              </tr>
              <tr className="sub-row">
                <td className="pl-4 text-muted">└ Hy</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.d_act * 0.65)}</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.mtd_act * 0.65)}</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.ytd_act * 0.65)}</td>
              </tr>
              <tr className="sub-row">
                <td className="pl-4 text-muted">└ Al.</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.d_act * 0.35)}</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.mtd_act * 0.35)}</td>
                <td className="txt-right font-mono">{fmt(production.special_hydrate.ytd_act * 0.35)}</td>
              </tr>
              <tr className="border-top">
                <td className="font-bold">Dispatch (Disp)</td>
                <td className="txt-right font-mono">{fmt(production.dispatch.d_act)} / {fmt(production.dispatch.d_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.dispatch.mtd_act)} / {fmt(production.dispatch.mtd_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.dispatch.ytd_act)} / {fmt(production.dispatch.ytd_plan)}</td>
              </tr>
              <tr>
                <td className="font-bold">Bagging</td>
                <td className="txt-right font-mono">{fmt(production.bagging.d_act)} / {fmt(production.bagging.d_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.bagging.mtd_act)} / {fmt(production.bagging.mtd_plan)}</td>
                <td className="txt-right font-mono">{fmt(production.bagging.ytd_act)} / {fmt(production.bagging.ytd_plan)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. FINISHED GOODS STOCK (FG STOCK) */}
      <div className="uh-card stock-card">
        <div className="uh-card-header">

          <h3>Finished Goods (FG) Stock</h3>
        </div>
        <div className="uh-table-wrap">
          <table className="uh-custom-table">
            <thead>
              <tr>
                <th>Stock Location / Type</th>
                <th className="txt-right">Today (MT)</th>
                <th className="txt-right">MTD (MT)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Building Stock (Bldg.)</td>
                <td className="txt-right font-mono text-cyan">{fmt(fgStock.bldg_stock_today)}</td>
                <td className="txt-right font-mono">{fmt(fgStock.bldg_stock_mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Finished Goods (FG)</td>
                <td className="txt-right font-mono text-cyan">{fmt(fgStock.fg_today)}</td>
                <td className="txt-right font-mono">{fmt(fgStock.fg_mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Trial Stock</td>
                <td className="txt-right font-mono text-cyan">{fmt(fgStock.trial_today)}</td>
                <td className="txt-right font-mono">{fmt(fgStock.trial_mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Rejection (Rej)</td>
                <td className="txt-right font-mono text-danger">{fmt(fgStock.rej_today)}</td>
                <td className="txt-right font-mono">{fmt(fgStock.rej_mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">UCSP</td>
                <td className="txt-right font-mono text-cyan">{fmt(fgStock.ucsp_today)}</td>
                <td className="txt-right font-mono">{fmt(fgStock.ucsp_mtd)}</td>
              </tr>
            </tbody>
          </table>
          <div className="stock-footer-kpis">
            <div className="stock-kpi">
              <span className="label">ASRS Utilisation</span>
              <span className="val font-mono">{fgStock.asrs_use_pct}%</span>
            </div>
            <div className="stock-kpi border-left">
              <span className="label">RFID Verification</span>
              <span className="val font-mono">{fgStock.rfid_ver_pct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PROCESS PARAMETERS */}
      <div className="uh-card params-card">
        <div className="uh-card-header">

          <h3>Process Parameters</h3>
        </div>
        <div className="uh-table-wrap">
          <table className="uh-custom-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th className="txt-right">Today</th>
                <th className="txt-right">Yesterday</th>
                <th className="txt-right">MTD Avg</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Productivity (P'tivity)</td>
                <td className="txt-right font-mono text-green">{fmt(processParams.productivity.today)}</td>
                <td className="txt-right font-mono">{fmt(processParams.productivity.yesterday)}</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.productivity.mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Mother Liquor (ML) Flow <span className="unit">m³/h</span></td>
                <td className="txt-right font-mono text-green">{fmt(processParams.ml_flow.today)}</td>
                <td className="txt-right font-mono">{fmt(processParams.ml_flow.yesterday)}</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.ml_flow.mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Organic Removal (OR) <span className="unit">%</span></td>
                <td className="txt-right font-mono text-green">{fmt(processParams.or_removal.today)}%</td>
                <td className="txt-right font-mono">{fmt(processParams.or_removal.yesterday)}%</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.or_removal.mtd)}%</td>
              </tr>
              <tr>
                <td className="font-bold">Chemical Extraction (Che. Ext.) <span className="unit">m³/h</span></td>
                <td className="txt-right font-mono text-green">{fmt(processParams.che_ext.today)}</td>
                <td className="txt-right font-mono">{fmt(processParams.che_ext.yesterday)}</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.che_ext.mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Lime Wash Soda (LWS) <span className="unit">t/h</span></td>
                <td className="txt-right font-mono text-green">{fmt(processParams.lws.today)}</td>
                <td className="txt-right font-mono">{fmt(processParams.lws.yesterday)}</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.lws.mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Fresh Water (Fresh W) <span className="unit">m³/h</span></td>
                <td className="txt-right font-mono text-green">{fmt(processParams.fresh_water.today)}</td>
                <td className="txt-right font-mono">{fmt(processParams.fresh_water.yesterday)}</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.fresh_water.mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">Heavy Fuel Oil (HFO) <span className="unit">t/d</span></td>
                <td className="txt-right font-mono text-green">{fmt(processParams.hfo.today)}</td>
                <td className="txt-right font-mono">{fmt(processParams.hfo.yesterday)}</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.hfo.mtd)}</td>
              </tr>
              <tr>
                <td className="font-bold">PSD (D50) <span className="unit">µm</span></td>
                <td className="txt-right font-mono text-green">{fmt(processParams.psd.today)}</td>
                <td className="txt-right font-mono">{fmt(processParams.psd.yesterday)}</td>
                <td className="txt-right font-mono text-cyan">{fmt(processParams.psd.mtd)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. RAW MATERIALS (RM) & QUALITY */}
      <div className="uh-card rm-card">
        <div className="uh-card-header">

          <h3>Raw Materials & Quality</h3>
        </div>
        <div className="uh-table-wrap">
          <table className="uh-custom-table">
            <thead>
              <tr>
                <th>Material</th>
                <th className="txt-right">Receipt (T)</th>
                <th className="txt-right">Stock (T)</th>
                <th className="txt-right">Consumption (T)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="special-row">
                <td className="font-bold">Bauxite (Bxt)</td>
                <td className="txt-right font-mono font-bold text-cyan">{fmt(rawMaterials.bxt_s1.receipt + rawMaterials.bxt_s2.receipt + rawMaterials.bxt_s3.receipt)}</td>
                <td className="txt-right font-mono font-bold text-cyan">{fmt(rawMaterials.bxt_s1.stock + rawMaterials.bxt_s2.stock + rawMaterials.bxt_s3.stock)}</td>
                <td className="txt-right font-mono font-bold text-cyan">{fmt(rawMaterials.bxt_s1.consump + rawMaterials.bxt_s2.consump + rawMaterials.bxt_s3.consump)}</td>
              </tr>
              <tr className="sub-row">
                <td className="pl-4 text-muted">└ S1</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s1.receipt)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s1.stock)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s1.consump)}</td>
              </tr>
              <tr className="sub-row">
                <td className="pl-4 text-muted">└ S2</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s2.receipt)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s2.stock)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s2.consump)}</td>
              </tr>
              <tr className="sub-row">
                <td className="pl-4 text-muted">└ S3</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s3.receipt)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s3.stock)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.bxt_s3.consump)}</td>
              </tr>
              <tr className="border-top">
                <td className="font-bold">Fuel Oil (FO)</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.fo.receipt)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.fo.stock)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.fo.consump)}</td>
              </tr>
              <tr>
                <td className="font-bold">Coal</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.coal.receipt)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.coal.stock)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.coal.consump)}</td>
              </tr>
              <tr>
                <td className="font-bold">Natural Gas (NG) <span className="unit">Nm³</span></td>
                <td className="txt-right font-mono">{fmt(rawMaterials.ng.receipt)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.ng.stock)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.ng.consump)}</td>
              </tr>
              <tr>
                <td className="font-bold">Biomass</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.biomass.receipt)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.biomass.stock)}</td>
                <td className="txt-right font-mono">{fmt(rawMaterials.biomass.consump)}</td>
              </tr>
            </tbody>
          </table>
          <div className="quality-header">Material Quality Indicators</div>
          <div className="quality-grid">
            <div className="q-item">
              <span className="lbl">Bxt Moisture</span>
              <span className="val font-mono">{rawMaterials.quality.bxt_moisture}%</span>
            </div>
            <div className="q-item border-left">
              <span className="lbl">Bxt Silica</span>
              <span className="val font-mono">{rawMaterials.quality.bxt_silica}%</span>
            </div>
            <div className="q-item border-left">
              <span className="lbl">Coal GCV</span>
              <span className="val font-mono">{rawMaterials.quality.coal_gcv} <span className="unit">kcal</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. CO-GENERATION, CPP & ENGINEERING */}
      <div className="uh-card power-card">
        <div className="uh-card-header">

          <h3>Power & Engineering</h3>
        </div>
        <div className="power-sections-grid">
          {/* CGPP */}
          <div className="power-tile">
            <h4>CGPP Power House</h4>
            <div className="tile-row">
              <span className="lbl">Turbine Load:</span>
              <span className="val font-mono text-green">{powerEngg.cgpp.load_mw} MW</span>
            </div>
            <div className="tile-row">
              <span className="lbl">Steam Flow:</span>
              <span className="val font-mono text-cyan">{fmt(powerEngg.cgpp.steam_flow)} t/h</span>
            </div>
          </div>
          {/* CPP */}
          <div className="power-tile border-top-mobile">
            <h4>CPP Power House</h4>
            <div className="tile-row">
              <span className="lbl">Turbine Load:</span>
              <span className="val font-mono text-green">{powerEngg.cpp.load_mw} MW</span>
            </div>
            <div className="tile-row">
              <span className="lbl">Aux Power:</span>
              <span className="val font-mono text-danger">{powerEngg.cpp.aux_power} MW</span>
            </div>
          </div>
          {/* Maintenance Engineering */}
          <div className="power-tile border-top">
            <h4>Engineering Maintenance</h4>
            <div className="tile-row">
              <span className="lbl">PM Adherence:</span>
              <span className="val font-mono text-green">{powerEngg.engg.pm_adh_pct}%</span>
            </div>
            <div className="tile-row">
              <span className="lbl">Equipment Availability:</span>
              <span className="val font-mono text-cyan">{powerEngg.engg.avail_pct}%</span>
            </div>
          </div>
          {/* PPT ATH */}
          <div className="power-tile border-top border-left-mobile">
            <h4>PPT ATH Target</h4>
            <div className="tile-row">
              <span className="lbl">Today Target:</span>
              <span className="val font-mono text-green">{fmt(powerEngg.ppt_ath.today)} T</span>
            </div>
            <div className="tile-row">
              <span className="lbl">MTD Accum:</span>
              <span className="val font-mono text-cyan">{fmt(powerEngg.ppt_ath.mtd)} T</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
