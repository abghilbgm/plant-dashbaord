function Card({ title, stock, quality }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "10px",
      marginBottom: "10px",
      background: "#f5f5f5"
    }}>
      <h4>{title}</h4>
      <p>Stock: {stock}</p>
      <p>Quality: {quality}</p>
    </div>
  );
}

function RawMaterial() {
  return (
    <div>
      <h3>Raw Material</h3>
      <Card title="Bauxite" stock="113949" quality="TAA: 37%" />
      <Card title="Oil" stock="2621" quality="GCV: 10232" />
      <Card title="Lime" stock="405" quality="CaO: 73%" />
      <Card title="Caustic" stock="2667" quality="NaOH: 47%" />
    </div>
  );
}

export default RawMaterial;