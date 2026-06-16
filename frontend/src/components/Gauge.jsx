import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Gauge({ title, value }) {
  return (
    <div className="panel">
      <div className="title">{title}</div>

      <div style={{ width: "80px", margin: "auto" }}>
        <CircularProgressbar value={value} text={`${value}`} />
      </div>
    </div>
  );
}

export default Gauge;