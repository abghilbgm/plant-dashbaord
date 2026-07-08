function KPI({ title, value, color }) {
  return (
    <div className="panel">
      <div className="title">{title}</div>
      <div className="kpi" style={{ color }}>{value}</div>
    </div>
  );
}

export default KPI;
