import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthContext.jsx";
import api from "../api/axios.js";

export default function VerifyEmail() {
    const [otp, setOTP] = useState("");
    const { user, setAuth } = useAuth();
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        try {
            setError(null);

            const res = await api.post("/auth/verify", {
                _id: user._id,
                otp,
            });

            console.log(res);
        } catch (error) {
            setError(err.response?.data?.message || "Email verification failed.");
        }
    };

    useEffect(() => {
        if (otp.length === 6) {
            handleSubmit();
        }
    });

    return (
        <div>
            <p>Please enter the 6 digit OTP sent to your email</p>
            <form>
                <input 
                    type="password"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                />
            </form>
        </div>
    );
}