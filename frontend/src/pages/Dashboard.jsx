import Header from "../components/Header";
import KPI from "../components/KPI";
import ProductionChart from "../components/ProductionChart";
import TrendChart from "../components/TrendChart";
import Gauge from "../components/Gauge";

function Dashboard() {
  return (
    <div className="app">

      <Header />

      {/* TOP GRID */}
      <div className="grid-top">

        {/* RAW MATERIAL */}
        <div className="panel">
          <h3>Raw Material</h3>

          <div className="mini-grid">
            <KPI title="Bauxite" value="113,949" color="#e76f51" />
            <KPI title="Oil" value="2,621" color="#f4a261" />
            <KPI title="Lime" value="405" color="#457b9d" />
            <KPI title="Caustic" value="2,667" color="#2a9d8f" />
          </div>
        </div>

        {/* PRODUCTION */}
        <div className="panel">
          <h3>Production</h3>

          <div className="row">
            <ProductionChart title="Calcination" />
            <ProductionChart title="Hydrate" />
          </div>
        </div>

        {/* QUALITY */}
        <div className="panel">
          <h3>Product Quality</h3>

          <div className="row">
            <TrendChart title="Fe2O3 %" />
            <TrendChart title="SiO2 %" />
          </div>
        </div>

        {/* PARAMETERS */}
        <div className="panel">
          <h3>Critical</h3>

          <div className="grid-2">
            <Gauge title="Bauxite Charge" value={60} />
            <Gauge title="PGL Ratio" value={68} />
            <Gauge title="SPL Ratio" value={34} />
            <Gauge title="Flow" value={45} />
          </div>
        </div>

        {/* COST */}
        <div className="panel">
          <h3>Cost</h3>

          <KPI title="Raw" value="24,304" color="#6a4c93" />
          <KPI title="Power" value="1,670" color="#277da1" />
        </div>

      </div>

      {/* BOTTOM GRID */}
      <div className="grid-bottom">

        <div className="panel">
          <h3>Efficiency</h3>
          <p>Steam | Soda Loss | Recovery | Liquor</p>
        </div>

        <div className="panel">
          <h3>Dispatch</h3>
          <p>Alumina: 5,893</p>
          <p>Hydrate: 2,652</p>
        </div>

        <div className="panel">
          <h3>Water</h3>
          <p>Intake / Consumption</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;