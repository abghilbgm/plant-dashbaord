import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { time: "10:00", value: 0.01 },
  { time: "11:00", value: 0.02 },
  { time: "12:00", value: 0.015 },
];

function Quality() {
  return (
    <div>
      <h3>Product Quality</h3>
      <LineChart width={250} height={150} data={data}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line dataKey="value" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}

export default Quality;