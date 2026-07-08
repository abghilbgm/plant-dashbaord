import React from "react";

export default function KPICard({ label, value, unit, trend, plan }) {
  const isUp = trend === "up";
  const trendColor = isUp ? "#10b981" : "#f43f5e";
  return (
    <div className="eff-card">
      <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 3, justifyContent: "center" }}>
        <span style={{ fontSize: 19, fontWeight: 700, color: "#f3f4f6", fontFamily: "monospace" }}>{value}</span>
        {unit && <span style={{ fontSize: 9, color: "#6b7280", fontWeight: 500 }}>{unit}</span>}
      </div>
      {plan && (
        <div style={{ fontSize: 9, marginTop: 4, display: "flex", alignItems: "center", gap: 3, justifyContent: "center" }}>
          <span style={{ color: "#6b7280" }}>P&B: </span>
          <span style={{ color: trendColor, fontWeight: "600" }}>{plan}</span>
        </div>
      )}
    </div>
  );
}
