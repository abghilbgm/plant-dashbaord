import { BarChart, Bar, XAxis, Tooltip } from "recharts";

const data = [
  { t: "10", v: 10 },
  { t: "11", v: 20 },
  { t: "12", v: 15 },
];

function BarTrendChart({ title }) {
  return (
    <div className="panel">
      <div className="title">{title}</div>

      <BarChart width={180} height={120} data={data}>
        <XAxis dataKey="t" />
        <Tooltip />
        <Bar dataKey="v" fill="#3b82f6" />
      </BarChart>
    </div>
  );
}

export default BarTrendChart;
