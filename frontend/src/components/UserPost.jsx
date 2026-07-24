import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import api from "../api/axios.js";
import { Button } from "@/components/ui/button";

export default function UserPost({
  id,
  username,
  images,
  caption,
  likes,
  isLiked,
  comments,
  setError,
}) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [currentImage, setCurrentImage] = useState(0);
  const scrollRef = useRef(null);

  const navigate = useNavigate();

  const handleScroll = (e) => {
    const { scrollLeft, clientWidth } = e.target;
    setCurrentImage(Math.round(scrollLeft / clientWidth));
  };

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((count) => count + (newLiked ? 1 : -1));

    try {
      await api.patch(`/posts/${id}/like`);
    } catch (err) {
      setLiked(!newLiked);
      setLikeCount((count) => count + (newLiked ? -1 : 1));
      setError(err.response?.data?.message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden border bg-background shadow-sm">
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth
               [-ms-overflow-style:none]
               [scrollbar-width:none]
               [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image) => (
            <img
              key={image.public_id}
              src={image.url}
              alt={username}
              className="aspect-square w-full flex-shrink-0 snap-center object-cover"
            />
          ))}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  currentImage === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="space-y-4 p-5">
        <p className="truncate text-md text-foreground">{caption}</p>
        <div className="flex px-1">
          <button
            onClick={handleLike}
            className="flex flex-1 items-center gap-2"
          >
            <Heart
              className={`h-5 w-5 ${
                liked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => navigate(`/post/${id}`)}
            className="flex flex-1 items-center justify-end gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{comments}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
