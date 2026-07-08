function KPI({ title, value, color }) {
  return (
    <div className="kpi-box">
      <div className="kpi-title">{title}</div>
      <div className="kpi-value" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

export default KPI;