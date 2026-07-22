import { useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field";

import { Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              className="max-w-xs"
            />
          </div>

          {/* Username */}
          <Field className="w-full">
            <FieldLabel>Username</FieldLabel>
            <Input
              type="text"
              placeholder="user123"
              value={username}
              disabled={loading}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field>

          {/* Submit */}
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Creating profile...</p>
            </div>
          ) : (
            <Button
              type="submit"
              disabled={loading || username.trim() === ""}
              className="w-full"
            >
              Create Profile
            </Button>
          )}

          {error && (
            <Alert variant="destructive" className="w-full">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Profile creation failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}
