import React, { useState } from "react";
import "./login.css";

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("auth_token", data.token);
        onSuccess && onSuccess();
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="login-root">
      <form className="login-card" onSubmit={submit}>
        <h2>Admin Login</h2>
        <label>Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="login-error">{error}</div>}
        <button type="submit">Sign in</button>
        <div className="login-hint">Use username <strong>admin</strong> and password <strong>1234</strong></div>
      </form>
    </div>
  );
}
