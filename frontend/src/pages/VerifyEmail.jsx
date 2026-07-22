import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import api from "../api/axios.js";

import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [otp, setOTP] = useState("");
  const { user, setAuth } = useAuth();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      setLoading(true);
      setError(null);

      if (!user?._id) {
        navigate("/signup");
        return;
      }

      const res = await api.post("/auth/verify", {
        _id: user._id,
        otp,
      });

      console.log(res);
      navigate("/complete-profile");
    } catch (err) {
      setError(err.response?.data?.message || "Email verification failed.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <p className="text-center text-sm sm:text-base text-muted-foreground">
          Please enter the 6-digit OTP sent to your email.
        </p>

        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Verifying OTP...</p>
          </div>
        ) : (
          <form className="w-full flex justify-center">
            <InputOTP
              id="otp"
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              disabled={loading}
              onComplete={() => handleSubmit()}
              onChange={(value) => setOTP(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </form>
        )}

        {error && (
          <Alert variant="destructive" className="w-full">
            <AlertTitle>Verification failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
