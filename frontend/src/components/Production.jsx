function Block({ title, today, mtd, ytd }) {
  return (
    <div style={{
      marginBottom: "10px",
      padding: "10px",
      background: "#eef3ff",
      borderRadius: "6px"
    }}>
      <h4>{title}</h4>
      <div>Today: {today}</div>
      <div>MTD: {mtd}</div>
      <div>YTD: {ytd}</div>
    </div>
  );
}

function Production() {
  return (
    <div className="panel">
      <h3>Production</h3>

      <Block title="Calcination" today="733" mtd="13189" ytd="11000" />
      <Block title="Hydrate" today="937" mtd="16758" ytd="14050" />
      <Block title="Vanadium" today="0.9" mtd="10.0" ytd="65.0" />
      <Block title="Microfine Alumina" today="0" mtd="121" ytd="721" />

    </div>
  );
}

export default Production;