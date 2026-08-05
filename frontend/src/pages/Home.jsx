import { useAuth } from "../AuthContext.jsx";
import api from "../api/axios.js";
import { useState, useEffect } from "react";
import PostCard from "../components/PostCard.jsx";
import { Loader2, AlertCircleIcon } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  if (!user) {
    return (
      <div>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.get("/posts/feed");
      console.log(res.data);
      setPosts(res.data.posts);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="flex w-full gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircleIcon className="h-5 w-5 shrink-0" />
          <div>
            <h4 className="font-medium">Fetch failed</h4>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div>
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Fetching feed...</p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-6">
            {posts.length > 0 &&
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  id={post._id}
                  profilePicture={post.author.profilePicture}
                  username={post.author.username}
                  caption={post.caption}
                  images={post.images}
                  likes={post.likes.length}
                  isLiked={post.likes.includes(user?._id)}
                  comments={post.commentCount}
                  setError={setError}
                />
              ))}
          </div>
        )}
      </div>
    </>
  );
}
