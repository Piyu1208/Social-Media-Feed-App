import { useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const { user, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() && !password) {
        setError("Please provide email and password.");
        return;
    }

    try {
        setLoading(true);
        const res = await api.post("/auth/login", {
            email,
            password
        });

        setAuth(res.data.user);
        navigate("/");
    } catch (err) {
        setError(err.response?.data?.message || "Login failed.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <div>
        <h2>Login</h2>
        <p>Login to continue</p>
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          name="password"
          placeholder="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>

        <button 
        type="submit"
        disabled={loading}
        >
            {loading ? "Logging in..." : "Login"}
        </button>

        <button
        onClick={(e) => navigate("/signup")}
        >
            Go to Signup page
        </button>


      </form>

      {error && <h3>{error}</h3>}
    </div>
  );
}
