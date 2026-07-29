import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext.jsx";
import api from "../api/axios.js";
import UserPost from "../components/UserPost.jsx";
import { Users, UserPlus, FileText } from "lucide-react";

export default function Profile() {
  const { user, setAuth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return <div>Loading...</div>;
  }

  const fetchProfile = async () => {
    try {
      setError(null);
      setLoading(true);

      const res = await api.get("/users/me");

      setProfile(res.data.user);
      setPosts(res.data.posts);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    setError(null);
    setLoading(true);
    try {
      await api.delete(`/posts/${postId}`);

      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl p-6">
        <p className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Profile Header */}
      <div className="border bg-gradient-to-br from-background to-muted/30 p-8 shadow-sm">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
            {/* Avatar */}
            <img
              src={profile?.profilePicture?.url}
              alt={profile?.username}
              className="h-32 w-32 shrink-0 rounded-full border-4 border-background object-cover shadow-lg"
            />

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {profile?.username}
                  </h1>

                  {profile?.bio && (
                    <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 lg:pl-20 flex flex-wrap gap-8 text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{posts.length}</span>
                <span className="text-muted-foreground">Posts</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {profile?.followers.length}
                </span>
                <span className="text-muted-foreground">
                  {profile?.followers.length === 1 ? "Follower" : "Followers"}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {profile?.following.length}
                </span>
                <span className="text-muted-foreground">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-8">
        <h2 className="mb-6 text-xl font-semibold">Your Posts</h2>

        {posts?.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <UserPost
                key={post._id}
                id={post._id}
                username={profile.username}
                caption={post.caption}
                images={post.images}
                likes={post.likes.length}
                isLiked={post.likes.includes(user?._id)}
                comments={post.commentCount}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed py-12 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="font-semibold">No posts yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your posts will appear here once you share something.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
