import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VisitUserPost from "../components/VisitUserPost.jsx";
import { useAuth } from "../AuthContext.jsx";
import api from "../api/axios.js";
import { FileText } from "lucide-react";

export default function VisitProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const { user } = useAuth();
  const { username } = useParams();

  const fetchProfileData = async () => {
    setError(null);

    try {
      setLoading(true);
      const res = await api.get(`/users/${username}`);
      setProfile(res.data.profile);
      setPosts(res.data.posts);
      setFollowers(res.data.followers);
      setFollowing(res.data.following);
    } catch (err) {
      setProfile(null);
      setError(err.response?.data?.message || "User not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [username]);

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

  if (loading) {
    return <div>Fetching profile...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>User not found.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-8 shadow-sm text-black">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
          <img
            src={profile?.profilePicture?.url}
            alt={profile?.username}
            className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-100 sm:h-28 sm:w-28"
          />

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-2xl font-semibold">
              {profile?.username}
            </h2>

            <p className="mt-2 break-words text-gray-600">
              {profile?.bio || "No bio available."}
            </p>
          </div>

          <div>
            {profile?.username !== user.username && (
              <button
                disabled={loading}
                className="w-full sm:w-auto rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
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

            <p className="mt-1 text-xs sm:text-sm text-gray-500">Followers</p>
          </div>

          <div className="text-center">
            <p className="text-xl sm:text-2xl font-semibold">
              {following.length ?? 0}
            </p>

            <p className="mt-1 text-xs sm:text-sm text-gray-500">Following</p>
          </div>

          <div className="text-center">
            <p className="text-xl sm:text-2xl font-semibold">
              {<posts className="length"></posts> ?? 0}
            </p>

            <p className="mt-1 text-xs sm:text-sm text-gray-500">Posts</p>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-8">
        <h2 className="mb-6 text-xl font-semibold">{profile.username}'s posts</h2>

        {posts?.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <VisitUserPost
                key={post._id}
                id={post._id}
                profilePicture={profile.profilePicture}
                username={profile.username}
                caption={post.caption}
                images={post.images}
                likes={post.likes.length}
                isLiked={post.likes.includes(user?._id)}
                comments={post.commentCount}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed py-12 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="font-semibold">No posts yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              User's posts will appear here once they share something.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
