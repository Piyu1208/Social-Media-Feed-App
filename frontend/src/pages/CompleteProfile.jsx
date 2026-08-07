import { useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AlertCircleIcon } from "lucide-react";

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
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Failed to complete profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6 rounded-xl border bg-background p-6 shadow-sm"
        >
          {/* Profile Image Preview */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-border bg-muted">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              className="max-w-xs flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:ring-1 focus:ring-offset-1"
            />
          </div>

          {/* Username */}
          <div className="w-full">
            <label htmlFor="username"
            className="text-sm font-medium"
            >Username</label>
            <input
              id="username"
              type="text"
              placeholder="user123"
              value={username}
              disabled={loading}
              onChange={(e) => {setUsername(e.target.value);
                if (error) setError(null);
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:ring-1 focus:ring-offset-1"
            />
          </div>

          {/* Submit */}
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Creating profile...
              </p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={loading || username.trim() === ""}
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white 
              border
              hover:opacity-90 
              hover:bg-accent
              disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Profile
            </button>
          )}

          {error && (
            <div className="flex w-full gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertCircleIcon className="h-5 w-5 shrink-0" />
              <div>
                <h4 className="font-medium">Profile creation failed</h4>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
