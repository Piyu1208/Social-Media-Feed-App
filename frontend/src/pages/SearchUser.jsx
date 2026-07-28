import { useState } from "react";
import { Search } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../AuthContext.jsx";

export default function SearchUser() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState(null);
  const [followers, setFollowers] = useState(null);
  const { user } = useAuth();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);

    if (!text.trim()) {
      setError("Enter a username to search.");
      setProfile(null);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/users/${text.trim()}`);
      setProfile(res.data.profile);
      setFollowers(res.data.followers);
    } catch (err) {
      setProfile(null);
      setError(err.response?.data?.message || "User not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    setError(null);
    try {
        setLoading(true);
        
        if (followers.includes(user._id)) {
            const res = await api.delete(`/users/${profile.id}/follow`);
            setFollowers(res.data.otherUser.followers);
            setFollowing(res.data.following);
        } else {
            const res = await api.patch(`/users/${profile.id}/follow`);
            setFollowers(res.data.otherUser.followers);
        }
    } catch (err) {
        setError(err.response?.data?.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:min-h-[638px] bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-2xl lg:text-2xl font-semibold tracking-tight text-black">
            Search Users
          </h1>

          <p className="mt-3 text-sm sm:text-base text-gray-500">
            Find profiles by username
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition focus-within:ring-2 focus-within:ring-black/5">
            <div className="flex flex-1 items-center gap-3 px-2">
              <Search className="h-5 w-5 text-gray-400" />

              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter username"
                className="bg-transparent text-black outline-none placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !profile && (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 py-14 sm:py-20 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
              <Search className="h-6 w-6 text-gray-400" />
            </div>

            <p className="font-medium text-gray-700">Search for a user</p>

            <p className="mt-1 text-sm text-gray-400">
              Results will appear here
            </p>
          </div>
        )}

        {/* Result */}
        {profile && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-8 shadow-sm text-black">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
              <img
                src={profile.profilePicture?.url}
                alt={profile.username}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-100 sm:h-28 sm:w-28"
              />

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-2xl font-semibold">
                  {profile.username}
                </h2>

                <p className="mt-2 break-words text-gray-600">
                  {profile.bio || "No bio available."}
                </p>
              </div>

              <div>
                {profile.username !== user.username && (
                  <button className="w-full sm:w-auto rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                  onClick={handleFollow}
                  >
                    {followers.includes(user._id) ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-gray-100 pt-6 sm:gap-6">
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-semibold">
                  {followers.length ?? 0}
                </p>

                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Followers
                </p>
              </div>

              <div className="text-center">
                <p className="text-xl sm:text-2xl font-semibold">
                  {profile.following ?? 0}
                </p>

                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Following
                </p>
              </div>

              <div className="text-center">
                <p className="text-xl sm:text-2xl font-semibold">
                  {profile.postsCount ?? 0}
                </p>

                <p className="mt-1 text-xs sm:text-sm text-gray-500">Posts</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
