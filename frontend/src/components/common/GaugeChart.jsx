import React from "react";

export default function GaugeChart({ value, max, label }) {
  const numericVal = parseFloat(value) || 0;
  const pct = Math.min((numericVal / max) * 100, 100);
  const angle = (pct / 100) * 180;
  const color = pct > 80 ? "#f43f5e" : pct > 60 ? "#f59e0b" : "#10b981"; // modern rose, amber, emerald
  return (
    <div style={{ textAlign: "center", padding: "8px 0" }}>
      <div style={{ position: "relative", width: 80, height: 45, margin: "0 auto" }}>
        <svg viewBox="0 0 100 50" style={{ width: "100%", height: "100%" }}>
          <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
          <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${(angle / 180) * 141.37} 141.37`} />
        </svg>
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", fontSize: 13, fontWeight: 700, color: "#f3f4f6", fontFamily: "monospace" }}>
          {value}
        </div>
      </div>
      <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2, fontWeight: 500 }}>{label}</div>
    </div>
  );
}
