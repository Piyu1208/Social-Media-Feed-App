import { useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

export default function CompleteProfile() {
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const { user, setAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();


    const handleFileChange = (e) => {
        const file = e.target.files[0];

        setProfilePicture(file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError(null);
            

            if (username.length < 3) {
                setError("username must be atleast 3 chars long.");
                return;
            }
            setLoading(true);

            console.log(user);

            const formData = new FormData();

            formData.append("_id", user._id);
            formData.append("username", username);

            if (profilePicture) {
                formData.append("profilePicture", profilePicture);
            }

            const res = await api.post("/auth/complete-profile", formData);

            console.log(res.data.user);

            setAuth(res.data.user);

            navigate("/");
        } catch (err) {
            console.log(err);
            console.log(err.response?.data)
            setError(err.response?.data?.message || "Failed to complete profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {preview && (
                    <img 
                        src={preview}
                        alt="Preview"
                        width={120}
                    />
                )}


                <input 
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                />

                <input 
                type="text"
                placeholder="username"
                value={username}
                disabled={loading}
                onChange={(e) => setUsername(e.target.value)}
                />

                <button 
                    type="submit"
                    disabled={loading || username.trim() === ""}
                >
                    {loading ? "Creating account..." : "Create profile"}
                </button>

            </form>      

            {error && <h3>{error}</h3>}      
        </div>
    );
};