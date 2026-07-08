function Item({ name, stock, value }) {
  return (
    <div style={{
      borderBottom: "1px solid #eee",
      padding: "8px 0"
    }}>
      <strong>{name}</strong>
      <div>Stock: {stock}</div>
      <div>{value}</div>
    </div>
  );
}

function RawMaterial() {
  return (
    <div className="panel">
      <h3>Raw Material</h3>

      <Item name="Bauxite" stock="113949" value="TAA: 37.1%" />
      <Item name="Oil" stock="2621" value="GCV: 10232" />
      <Item name="Lime" stock="405" value="CaO: 73%" />
      <Item name="Caustic" stock="2667" value="NaOH: 47%" />
    </div>
  );
}

export default RawMaterial;
