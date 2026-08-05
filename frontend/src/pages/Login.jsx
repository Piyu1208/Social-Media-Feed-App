import { useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { Loader2, AlertCircleIcon } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const { setAuth } = useAuth();
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
        password,
      });

      setAuth(res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-background shadow-sm">
        {/*  Card Header */}
        <div class="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Login</h2>
            <p className="text-sm text-muted-foreground">
              Login to continue
            </p>
          </div>

            <button variant="button" onClick={(e) => navigate("/signup")}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
              Signup
            </button>
        </div>
        {/* Card Content */}
        <div className="px-6">
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  name="password"
                  placeholder="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Card Footer */}
        <div className="flex flex-col gap-2 p-6 pt-4">
          <button
            type="button"
            variant="outline"
            onClick={() => setShowPassword((prev) => !prev)}
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent"
          >
            {showPassword ? "Hide" : "Show"}
          </button>

          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Logging in...</p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={loading || (!email ||!password)}
              onClick={handleSubmit}
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white 
              border
              hover:opacity-90 
              hover:bg-accent
              disabled:cursor-not-allowed disabled:opacity-50"
            >
              Login
            </button>
          )}

          {error && (
            <div className="flex w-full gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertCircleIcon className="h-5 w-5 shrink-0" />
              <div>
                <h4 className="font-medium">Login failed</h4>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
