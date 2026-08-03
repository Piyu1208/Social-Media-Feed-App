import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import api from "../api/axios.js";
import { Loader2, AlertCircleIcon } from "lucide-react";

export default function VerifyEmail() {
  const [otp, setOTP] = useState("");
  const { user } = useAuth();
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

  useEffect(() => {
    if (otp.length === 6 && !loading) {
      handleSubmit();
    }
  }, [otp, loading]);

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
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  disabled={loading}
                  value={otp[index] || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    const newOTP = otp.split("");
                    newOTP[index] = value;
                    const updatedOTP = newOTP.join("");
                    setOTP(updatedOTP);

                    //move to next box
                    if (value && e.target.nextElementSibling) {
                      e.target.nextElementSibling.focus();
                    }

                    if (updatedOTP.length === 6 && !updatedOTP.includes("")) {
                      handleSubmit();
                    }
                  }}
                  className="h-10 w-10 rounded-md border border-input bg-background text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              ))}
            </div>
          </form>
        )}

        {error && (
          <div className="flex w-full gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircleIcon className="h-5 w-5 shrink-0" />
            <div>
              <h4 className="font-medium">Verification failed</h4>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
