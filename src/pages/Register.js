import { useState } from "react";
import { useNavigate } from "react-router";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert("Lozinke ne odgovaraju!");
      return;
    }
    try {
      const resp = await fetch("http://localhost:5123/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await resp.json();
      if (resp.ok) {
        alert("Korisnik registriran!");
        navigate("/login");
      } else {
        alert(data.message || "Neuspješna registracija");
      }
    } catch (err) {
      console.error(err);
      alert("Registration error");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <label>Repeat Password</label>
        <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;