import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { t: "10", v: 0.01 },
  { t: "11", v: 0.02 },
  { t: "12", v: 0.015 },
];

function TrendChart({ title }) {
  return (
    <div className="panel">
      <div className="title">{title}</div>

      <LineChart width={180} height={120} data={data}>
        <XAxis dataKey="t" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="v"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </div>
  );
}

export default TrendChart;