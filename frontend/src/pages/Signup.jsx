import { useState } from "react";
import validator from "validator";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { AlertCircleIcon } from "lucide-react"

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

  const passwordValid = password && !validator.isStrongPassword(password);

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

      setAuth({ _id: res.data?._id });
      navigate("/verify-email");
    } catch (err) {
      setError(err.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-3xl rounded-xl border bg-card p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="">
            <div className="mb-6 text-center">
              <h2 className="font-bold">Create Account</h2>
              <p>Sign up to continue</p>
            </div>

            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field data-invalid={!!(touched.email && emailError)}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    aria-invalid={!!(touched.email && emailError)}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, email: true }))
                    }
                  />

                  {touched.email && emailError && (
                    <FieldDescription>{emailError}</FieldDescription>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Password@1234"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, password: true }))
                    }
                  />
                </Field>

                <Field
                  data-invalid={
                    !!(touched.confirmPassword && confirmPasswordError)
                  }
                >
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Password@1234"
                    value={confirmPassword}
                    aria-invalid={
                      !!(touched.confirmPassword && confirmPasswordError)
                    }
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, confirmPassword: true }))
                    }
                  />

                  {touched.confirmPassword && confirmPasswordError && (
                    <FieldDescription>{confirmPasswordError}</FieldDescription>
                  )}
                </Field>

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>

                  <Button disabled={!isFromValid || loading} type="submit">
                    {loading ? "Signing up..." : "Signup"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => navigate("/login")}
                  >
                    Go to Login page
                  </Button>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>Signup failed</AlertTitle>
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </FieldGroup>
            </form>
          </div>

          <div className="">
            <div className="mt-8 rounded-lg bg-muted p-4">
              <p className="mb-3 font-medium">Password must contain:</p>

              <div className="space-y-2 text-sm">
                <p>
                  {startedTypingPassword ? (checks.length ? "✅" : "❌") : "•"}{" "}
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
                  {startedTypingPassword ? (checks.number ? "✅" : "❌") : "•"}{" "}
                  One number
                </p>
                <p>
                  {startedTypingPassword ? (checks.special ? "✅" : "❌") : "•"}{" "}
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
