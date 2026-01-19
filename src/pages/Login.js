import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const resp = await fetch("http://localhost:5123/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await resp.json();

      if (resp.ok && data.token) {
        login(data.user, data.token);
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        alert(data.message || "Login failed");
        navigate("/register")
      }
    } catch (err) {
      console.error(err);
      alert("Login error");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Korisničko ime</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />
        <label>Lozinka</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;