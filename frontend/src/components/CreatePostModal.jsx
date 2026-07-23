import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CreatePost from './CreatePost.jsx';
import api from "../api/axios.js";

export default function CreatePostModal({
  isCreatePostOpen,
  setIsCreatePostOpen,
  error, 
  setError,
}) {

  const [isPosting, setIsPosting] = useState(false);
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const newImages = Array.from(e.target.files);
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
      setError(null);

      if (caption.trim() === "") {
        setError("Caption cannot be empty.");
        return;
      }

      setIsPosting(true);

      const formData = new FormData();
      formData.append("caption", caption);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await api.post("/posts", formData);

      console.log(res);

      setCaption("");
      setImages([]);

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post.");
      return false;
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          <CreatePost
            caption={caption}
            setCaption={setCaption}
            images={images}
            setImages={setImages}
            handleSubmit={async (e) => {
              const success = await handleCreatePost(e);
              if (success) {
                setIsCreatePostOpen(false);
              }
            }}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
            isPosting={isPosting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
