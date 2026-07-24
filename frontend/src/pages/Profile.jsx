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
      <div className="rounded-2xl border bg-background p-8 shadow-sm">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          {/* Avatar */}
          <img
            src={profile?.profilePicture?.url}
            alt={profile?.username}
            className="h-32 w-32 shrink-0 rounded-full object-cover border"
          />

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{profile?.username}</h1>

            {profile?.bio && (
              <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
                {profile.bio}
              </p>
            )}

            {/* Stats */}
            <div className="mt-8 flex gap-12">
              <div>
                <p className="text-2xl font-bold">{posts.length}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>

              <div>
                <p className="text-2xl font-bold">
                  {profile?.followers.length}
                </p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>

              <div>
                <p className="text-2xl font-bold">
                  {profile?.following.length}
                </p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {/* Posts */}
      <div className="mt-8">
        <h2 className="mb-6 text-xl font-semibold">Your Posts</h2>

        {posts?.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <UserPost
                key={post._id}
                id={post._id}
                username={post.author.username}
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
              Your posts will appear here once you share something.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
