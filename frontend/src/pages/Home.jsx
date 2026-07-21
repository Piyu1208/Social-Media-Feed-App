import { useAuth } from "../AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import CreatePost from "../components/CreatePost.jsx";
import api from "../api/axios.js";
import { useState, useEffect } from "react";
import PostCard from "../components/PostCard.jsx";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, setAuth } = useAuth();
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);


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
  }

  const handleImageChange = (e) => {
    const newImages = Array.from(e.target.files);
    setImages(prev => [...prev, ...newImages]);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
        setError(null);
        
        if (caption.trim() === "") {
            setError("Caption cannot be empty.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("caption", caption);

        images.forEach(image => {
            formData.append("images", image);
        });

        const res = await api.post("/posts", formData);

        console.log(res);

        setCaption("");
        setImages([]);

    } catch (err) {
        setError(err.response?.data?.message || "Failed to create post.");
    } finally {
        setLoading(false);
    }
  }



  return (
    <>
      <Navbar />

      {error && <p>{error}</p>}

      <CreatePost 
       caption={caption} setCaption={setCaption}
       images={images} setImages={setImages}
       handleSubmit={handleCreatePost}
       handleImageChange={handleImageChange}
      />
      <div>
        <h3>Feed</h3>

        <div>
            {posts.length > 0 && (
                posts.map((post) => (
                    <PostCard 
                    key={post._id}
                    profilePicture={post.author.profilePicture}
                    username={post.author.username} 
                    caption={post.caption}
                    images={post.images}
                    likes={post.likes.length}
                    />
                ))
            )}
        </div>
      </div>
    </>
  );
}
