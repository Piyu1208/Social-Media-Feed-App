import { useAuth } from "../AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import CreatePost from "../components/CreatePost.jsx";
import api from "../api/axios.js";
import { useState } from "react";

export default function Home() {
  const { user, setAuth } = useAuth();
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const newImages = Array.from (e.target.files);
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

      <CreatePost 
       caption={caption} setCaption={setCaption}
       images={images} setImages={setImages}
       handleSubmit={handleCreatePost}
       handleImageChange={handleImageChange}
      />
      <h1>Home</h1>
    </>
  );
}
