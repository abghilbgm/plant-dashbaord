import { BarChart, Bar, XAxis, Tooltip } from "recharts";

const data = [
  { name: "Today", value: 733 },
  { name: "MTD", value: 13189 },
  { name: "YTD", value: 11000 }
];

function ProductionChart({ title }) {
  return (
    <div className="panel">
      <div className="title">{title}</div>

      <BarChart width={250} height={150} data={data}>
        <XAxis dataKey="name" />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </div>
  );
}

export default ProductionChart;