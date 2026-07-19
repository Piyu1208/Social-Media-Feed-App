import { useState } from "react";
import validator from "validator";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

  const { user, setAuth } = useAuth();

  const startedTypingPassword = password.length > 0;

  const emailError =
    email && !validator.isEmail(email) ? "Please enter a valid email." : "";

  const passwordValid =
    password && !validator.isStrongPassword(password);

  const confirmPasswordError =
    confirmPassword && password !== confirmPassword
      ? "Passwords do not match."
      : "";

  const isFromValid =
    email &&
    password &&
    confirmPassword &&
    !emailError &&
    !passwordValid &&
    !confirmPasswordError;

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>;]/.test(password),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const res = await api.post("/auth/signup", {
        email,
        password,
      });
      console.log(res);

      setAuth({_id: res.data?._id});
      navigate("/verify-email");

    } catch (err) {
      setError(err.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p>Sign up to continue</p>
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
        />

        {touched.email && emailError && <p>{emailError}</p>}

        <input
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
        />

        <input
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() =>
            setTouched((prev) => ({ ...prev, confirmPassword: true }))
          }
        />

        {touched.confirmPassword && confirmPasswordError && (
          <p>{confirmPasswordError}</p>
        )}

        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>

        <button disabled={!isFromValid || loading} type="submit">
          {loading ? "Signing up..." : "Signup"}
        </button>

        {error ? <h3>{error}</h3> : null}
      </form>

      <div>
        <p>Password must contain:</p>
        <div>
          <p>{startedTypingPassword ? checks.length ? "✅" : "❌" : "•"} At least 8 characters</p>
          <p>{startedTypingPassword ? checks.uppercase ? "✅" : "❌" : "•"} One uppercase letter</p>
          <p>{startedTypingPassword ? checks.lowercase ? "✅" : "❌" : "•"} One lowercase letter</p>
          <p>{startedTypingPassword ? checks.number ? "✅" : "❌" : "•"} One number</p>
          <p>{startedTypingPassword ? checks.special ? "✅" : "❌" : "•"} One special character</p>
        </div>
      </div>
    </div>
  );
}
