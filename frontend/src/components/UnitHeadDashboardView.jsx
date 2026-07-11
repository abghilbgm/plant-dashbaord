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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchWeather() {
      setLoading(true);
      try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endAug = new Date(today.getFullYear(), 7, 31);
        const endForecast = new Date(today);
        endForecast.setDate(endForecast.getDate() + 15);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const fmt = (d) => {
          const m = (d.getMonth() + 1).toString().padStart(2, '0');
          const day = d.getDate().toString().padStart(2, '0');
          return `${d.getFullYear()}-${m}-${day}`;
        };

        const archiveUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${PLANT_LAT}&longitude=${PLANT_LON}&start_date=${fmt(startOfMonth)}&end_date=${fmt(yesterday)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode&timezone=Asia%2FKolkata`;
        
        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${PLANT_LAT}&longitude=${PLANT_LON}&start_date=${fmt(startOfMonth)}&end_date=${fmt(endForecast)}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,precipitation_probability_max&models=ecmwf_ifs025,gfs_seamless,jma_seamless&timezone=Asia%2FKolkata`;

        const climateStart = new Date(endForecast);
        climateStart.setDate(climateStart.getDate() + 1);
        const climateUrl = `https://climate-api.open-meteo.com/v1/climate?latitude=${PLANT_LAT}&longitude=${PLANT_LON}&start_date=${fmt(climateStart)}&end_date=${fmt(endAug)}&models=MPI_ESM1_2_XR&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=Asia%2FKolkata`;

        const [resArc, resFor, resCli] = await Promise.all([
          fetch(archiveUrl).then(r => r.json()).catch(() => ({})),
          fetch(forecastUrl).then(r => r.json()).catch(() => ({})),
          fetch(climateUrl).then(r => r.json()).catch(() => ({}))
        ]);

        if (cancelled) return;

        const dateMap = new Map();
        const getDay = (dateStr) => {
          if (!dateMap.has(dateStr)) {
            dateMap.set(dateStr, {
              date: dateStr, actual: null, ecmwf: null, gfs: null, jma: null, climate: null,
              weathercode: null, maxTemp: null, minTemp: null, rain: null, wind: null, rainProb: null
            });
          }
          return dateMap.get(dateStr);
        };

        if (resArc && resArc.daily && resArc.daily.time) {
          resArc.daily.time.forEach((t, i) => {
            const d = getDay(t);
            d.actual = resArc.daily.precipitation_sum[i];
            d.weathercode = resArc.daily.weathercode[i];
            d.maxTemp = resArc.daily.temperature_2m_max[i];
            d.minTemp = resArc.daily.temperature_2m_min[i];
            d.rain = resArc.daily.precipitation_sum[i];
            d.wind = resArc.daily.windspeed_10m_max[i];
          });
        }

        if (resFor && resFor.daily && resFor.daily.time) {
          resFor.daily.time.forEach((t, i) => {
            const d = getDay(t);
            if (d.weathercode === null) d.weathercode = resFor.daily.weather_code_ecmwf_ifs025?.[i] ?? resFor.daily.weather_code?.[i] ?? 0;
            if (d.maxTemp === null) d.maxTemp = resFor.daily.temperature_2m_max_ecmwf_ifs025?.[i] ?? resFor.daily.temperature_2m_max?.[i] ?? 0;
            if (d.minTemp === null) d.minTemp = resFor.daily.temperature_2m_min_ecmwf_ifs025?.[i] ?? resFor.daily.temperature_2m_min?.[i] ?? 0;
            if (d.rain === null) d.rain = resFor.daily.precipitation_sum_ecmwf_ifs025?.[i] ?? resFor.daily.precipitation_sum?.[i] ?? 0;
            if (d.wind === null) d.wind = resFor.daily.windspeed_10m_max_ecmwf_ifs025?.[i] ?? resFor.daily.windspeed_10m_max?.[i] ?? 0;
            d.rainProb = resFor.daily.precipitation_probability_max?.[i] ?? null;

            d.ecmwf = resFor.daily.precipitation_sum_ecmwf_ifs025?.[i] ?? null;
            d.gfs = resFor.daily.precipitation_sum_gfs_seamless?.[i] ?? null;
            d.jma = resFor.daily.precipitation_sum_jma_seamless?.[i] ?? null;
          });
        }

        if (resCli && resCli.daily && resCli.daily.time) {
          resCli.daily.time.forEach((t, i) => {
            const d = getDay(t);
            if (d.maxTemp === null) d.maxTemp = resCli.daily.temperature_2m_max?.[i] ?? 0;
            if (d.minTemp === null) d.minTemp = resCli.daily.temperature_2m_min?.[i] ?? 0;
            if (d.rain === null) d.rain = resCli.daily.precipitation_sum?.[i] ?? 0;
            if (d.wind === null) d.wind = resCli.daily.windspeed_10m_max?.[i] ?? 0;

            d.climate = resCli.daily.precipitation_sum?.[i] ?? null;
          });
        }

        const sortedDates = Array.from(dateMap.keys()).sort();
        if (sortedDates.length > 0) {
          setWeather({
            time: sortedDates,
            weathercode: sortedDates.map(t => dateMap.get(t).weathercode),
            temperature_2m_max: sortedDates.map(t => dateMap.get(t).maxTemp),
            temperature_2m_min: sortedDates.map(t => dateMap.get(t).minTemp),
            precipitation_sum: sortedDates.map(t => dateMap.get(t).rain),
            precipitation_probability_max: sortedDates.map(t => dateMap.get(t).rainProb),
            windspeed_10m_max: sortedDates.map(t => dateMap.get(t).wind),
            rain_actual: sortedDates.map(t => dateMap.get(t).actual),
            rain_ecmwf: sortedDates.map(t => dateMap.get(t).ecmwf),
            rain_gfs: sortedDates.map(t => dateMap.get(t).gfs),
            rain_jma: sortedDates.map(t => dateMap.get(t).jma),
            rain_climate: sortedDates.map(t => dateMap.get(t).climate)
          });
          setError(null);
        } else {
          setError("Failed to load weather data.");
        }
      } catch (e) {
        if (!cancelled) setError("Failed to load weather data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchWeather();
    const timer = setInterval(fetchWeather, 60 * 60 * 1000);
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


      {/* WEATHER FORECAST CARD – Extended */}
      <div className="uh-card weather-card span-all">
        <div className="uh-card-header">
          <h3>🌦️ Extended Weather Forecast (till Aug 31) — {PLANT_LABEL}</h3>
          <span className="wx-source">Sources: Historical, ECMWF, GFS, JMA, Climate (MPI_ESM)</span>
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

            {/* Trend Chart (Rainfall) */}
            <div style={{ width: '100%', height: 350, marginTop: 10, marginBottom: 30 }}>
              <h4 style={{ color: '#e2e8f0', marginBottom: 10, textAlign: 'center' }}>Rainfall (Actual vs Predicted)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={wx.time.map((t, i) => ({
                    name: new Date(t).getDate() + ' ' + SHORT_MONTHS[new Date(t).getMonth()],
                    actual: wx.rain_actual[i],
                    ecmwf: wx.rain_ecmwf[i],
                    gfs: wx.rain_gfs[i],
                    jma: wx.rain_jma[i],
                    climate: wx.rain_climate[i]
                  }))}
                  margin={{ top: 10, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid stroke="#2d3748" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#a0aec0" fontSize={12} tickMargin={10} />
                  <YAxis stroke="#63b3ed" fontSize={12} unit="mm" allowDecimals={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568', borderRadius: 8, color: '#e2e8f0' }} itemStyle={{ color: '#e2e8f0' }} />
                  <Legend wrapperStyle={{ paddingTop: 20 }} />
                  <Bar dataKey="actual" name="Actual (Historical)" fill="#38a169" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Line type="monotone" dataKey="ecmwf" name="ECMWF Predicted" stroke="#63b3ed" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="gfs" name="GFS Predicted" stroke="#f6ad55" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="jma" name="JMA Predicted" stroke="#ecc94b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="climate" name="Climate Predicted" stroke="#b794f4" strokeWidth={2} strokeDasharray="5 5" dot={false} />
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
                
                const tDate = new Date();
                const todayStr = `${tDate.getFullYear()}-${(tDate.getMonth()+1).toString().padStart(2,'0')}-${tDate.getDate().toString().padStart(2,'0')}`;
                const isToday = dateStr === todayStr;
                
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
