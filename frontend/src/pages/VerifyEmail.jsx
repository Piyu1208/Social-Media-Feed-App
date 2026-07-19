import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthContext.jsx";
import api from "../api/axios.js";

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

    useEffect(() => {
        if (otp.length === 6) {
            handleSubmit();
        }
    }, [otp]);

    return (
        <div>
            <p>Please enter the 6 digit OTP sent to your email</p>
            <form>
                <input 
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={6}
                    value={otp}
                    disabled={loading}
                    onChange={(e) => 
                        setOTP(e.target.value.replace(/\D/g, ""))
                    }
                />
            </form>

            {loading && <p>Verifying OTP...</p>}

            {error && <h3>{error}</h3>}
        </div>
    );
}