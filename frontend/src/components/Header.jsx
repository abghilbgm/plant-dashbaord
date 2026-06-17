function Header() {
  return (
    <div>
      <div style={{
        background: "#1e3a5f",
        color: "white",
        padding: "10px"
      }}>
        <h2>BLG - Refinery Overview</h2>
      </div>

      <div style={{
        background: "#ff7a00",
        padding: "5px"
      }}>
        {["Home", "Overview", "Red Area", "White Area", "Calcination", "Quality", "Dispatch"].map(tab => (
          <span
            key={tab}
            style={{
              marginRight: "15px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {tab}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Header;
