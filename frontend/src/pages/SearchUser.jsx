import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../AuthContext.jsx";
import { Link } from "react-router-dom";

export default function SearchUser() {
  const { user } = useAuth();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e?.preventDefault();

    const query = text.trim();

    if (!query) {
      setResults([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/users/search?q=${query}`);

      setResults(res.data.users || []);
    } catch (err) {
      setResults([]);
      setError(
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUser) => {
    try {
      if (targetUser.isFollowing) {
        await api.delete(
          `/users/${targetUser._id}/follow`
        );

        setResults((prev) =>
          prev.map((item) =>
            item._id === targetUser._id
              ? {
                  ...item,
                  isFollowing: false,
                }
              : item
          )
        );
      } else {
        await api.patch(
          `/users/${targetUser._id}/follow`
        );

        setResults((prev) =>
          prev.map((item) =>
            item._id === targetUser._id
              ? {
                  ...item,
                  isFollowing: true,
                }
              : item
          )
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update follow."
      );
    }
  };

  const clearSearch = () => {
    setText("");
    setResults([]);
    setError(null);
  };

  useEffect(() => {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch();
    }, 400);

    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Search
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Find people and discover new profiles.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch}>
          <div
            className="
              flex items-center gap-3
              rounded-2xl
              border border-gray-200
              bg-white
              px-4 py-3
              shadow-sm
              transition
              focus-within:border-gray-300
              focus-within:ring-4
              focus-within:ring-black/5
            "
          >
            <Search className="h-5 w-5 shrink-0 text-gray-400" />

            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Search people..."
              className="
                min-w-0 flex-1
                bg-transparent
                text-sm
                outline-none
                placeholder:text-gray-400
              "
            />

            {text && (
              <button
                type="button"
                onClick={clearSearch}
                className="
                  rounded-full
                  p-1
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-gray-600
                "
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 border-b border-gray-100 px-4 py-4 last:border-0"
              >
                <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                </div>

                <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Initial state */}
        {!loading && !text && (
          <div className="mt-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Search className="h-6 w-6 text-gray-400" />
            </div>

            <h2 className="mt-4 text-sm font-semibold text-gray-700">
              Find people
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Search by username to discover profiles.
            </p>
          </div>
        )}

        {/* No results */}
        {!loading &&
          text &&
          results.length === 0 &&
          !error && (
            <div className="mt-10 text-center">
              <p className="text-sm font-medium text-gray-700">
                No users found
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Try searching for a different username.
              </p>
            </div>
          )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 px-1">
              <h2 className="text-sm font-semibold text-gray-700">
                People
              </h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {results.map((profile) => {
                const isCurrentUser =
                  profile.username === user.username;

                return (
                  <div
                    key={profile._id}
                    className="
                      flex items-center gap-3
                      border-b border-gray-100
                      px-4 py-4
                      transition
                      last:border-0
                      hover:bg-gray-50
                    "
                  >
                    {/* Avatar */}
                    <Link
                      to={`/visit-profile/${profile.username}`}
                      className="shrink-0"
                    >
                      <img
                        src={profile.profilePicture?.url}
                        alt={profile.username}
                        className="
                          h-12 w-12
                          rounded-full
                          object-cover
                          bg-gray-100
                        "
                      />
                    </Link>

                    {/* User info */}
                    <Link
                      to={`/visit-profile/${profile.username}`}
                      className="min-w-0 flex-1"
                    >
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {profile.username}
                      </p>


                      {profile.bio && (
                        <p className="mt-0.5 truncate text-xs text-gray-400">
                          {profile.bio}
                        </p>
                      )}
                    </Link>

                    {/* Follow */}
                    {!isCurrentUser && (
                      <button
                        onClick={() => handleFollow(profile)}
                        className={`
                          shrink-0
                          rounded-lg
                          px-4 py-2
                          text-xs
                          font-semibold
                          transition  
                          bg-black text-white hover:bg-gray-700
                        `}
                      >
                        {profile.isFollowing ? "Following" : "Follow"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}