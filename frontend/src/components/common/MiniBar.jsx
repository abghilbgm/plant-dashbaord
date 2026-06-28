import React from "react";

export default function MiniBar({ data, colors }) {
  const maxVal = Math.max(...data) || 1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 32, marginTop: 4 }}>
      {data.map((v, i) => (
        <div key={i} style={{ width: 14, height: `${(v / maxVal) * 100}%`, minHeight: 4, background: colors[i % colors.length], borderRadius: "2px 2px 0 0" }} />
      ))}
    </div>
  );
}
