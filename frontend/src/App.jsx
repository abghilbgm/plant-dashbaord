import React, { useState } from "react";
import RefineryDashboard from "./pages/RefineryDashboard";
import Login from "./Login";

function App() {
  const [token, setToken] = useState(localStorage.getItem("auth_token"));
  const onLogin = () => setToken(localStorage.getItem("auth_token"));

  if (!token) {
    return <Login onSuccess={onLogin} />;
  }

  return <RefineryDashboard />;
}

export default App;
