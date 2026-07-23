import { useAuth } from "../AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import CreatePost from "../components/CreatePost.jsx";
import api from "../api/axios.js";
import { useState, useEffect } from "react";
import PostCard from "../components/PostCard.jsx";
import { useNavigate } from "react-router-dom";
import CreatePostModal from "../components/CreatePostModal.jsx";

export default function Home() {
  const { user, setAuth } = useAuth();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const navigate = useNavigate();

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
      <CreatePostModal
        isCreatePostOpen={isCreatePostOpen}
        setIsCreatePostOpen={setIsCreatePostOpen}
        error={error}
        setError={setError}
      />
      <Navbar onCreatePost={() => setIsCreatePostOpen(true)} />

      {error && <p>{error}</p>}

      <div>
        <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-6">
          {posts.length > 0 &&
            posts.map((post) => (
              <PostCard
                key={post._id}
                profilePicture={post.author.profilePicture}
                username={post.author.username}
                caption={post.caption}
                images={post.images}
                likes={post.likes.length}
                comments={post.commentCount}
              />
            ))}
        </div>
      </div>
    </>
  );
}
