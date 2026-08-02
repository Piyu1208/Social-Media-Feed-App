import { useState } from "react";
import validator from "validator";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { AlertCircleIcon } from "lucide-react";

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
  const { setAuth } = useAuth();

  const startedTypingPassword = password.length > 0;

  const emailError =
    email.trim() && !validator.isEmail(email)
      ? "Please enter a valid email."
      : "";

  const passwordValid =
    password && !validator.isStrongPassword(password);

  const confirmPasswordError =
    confirmPassword && password !== confirmPassword
      ? "Passwords do not match."
      : "";

  const isFormValid =
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

    if (loading) return;

    setError(null);

    try {
      setLoading(true);
      setEmail(email.trim());

      const res = await api.post("/auth/signup", {
        email,
        password,
      });

      setAuth({ _id: res.data?._id });
      navigate("/verify-email");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[678px] flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-3xl rounded-xl border bg-card p-6 shadow-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">Create Account</h2>
              <p className="text-muted-foreground">
                Sign up to continue
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    aria-invalid={!!(touched.email && emailError)}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    onBlur={() =>
                      setTouched((prev) => ({
                        ...prev,
                        email: true,
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />

                  {touched.email && emailError && (
                    <p className="text-sm text-red-500">
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Password@1234"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    onBlur={() =>
                      setTouched((prev) => ({
                        ...prev,
                        password: true,
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Password@1234"
                    value={confirmPassword}
                    aria-invalid={
                      !!(
                        touched.confirmPassword &&
                        confirmPasswordError
                      )
                    }
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    onBlur={() =>
                      setTouched((prev) => ({
                        ...prev,
                        confirmPassword: true,
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />

                  {touched.confirmPassword &&
                    confirmPasswordError && (
                      <p className="text-sm text-red-500">
                        {confirmPasswordError}
                      </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                  <button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className="inline-flex h-10 w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Signing up..." : "Signup"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent"
                  >
                    Go to Login page
                  </button>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="flex gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
                    <AlertCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />

                    <div>
                      <h4 className="font-semibold">
                        Signup failed
                      </h4>

                      <p className="mt-1 text-sm">
                        {error}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div>
            <div className="mt-8 rounded-lg bg-muted p-4">
              <p className="mb-3 font-medium">
                Password must contain:
              </p>

              <div className="space-y-2 text-sm">
                <p>
                  {startedTypingPassword
                    ? checks.length
                      ? "✅"
                      : "❌"
                    : "•"}{" "}
                  At least 8 characters
                </p>

                <p>
                  {startedTypingPassword
                    ? checks.uppercase
                      ? "✅"
                      : "❌"
                    : "•"}{" "}
                  One uppercase letter
                </p>

                <p>
                  {startedTypingPassword
                    ? checks.lowercase
                      ? "✅"
                      : "❌"
                    : "•"}{" "}
                  One lowercase letter
                </p>

                <p>
                  {startedTypingPassword
                    ? checks.number
                      ? "✅"
                      : "❌"
                    : "•"}{" "}
                  One number
                </p>

                <p>
                  {startedTypingPassword
                    ? checks.special
                      ? "✅"
                      : "❌"
                    : "•"}{" "}
                  One special character
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}