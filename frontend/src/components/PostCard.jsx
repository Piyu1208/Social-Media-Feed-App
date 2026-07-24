import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Heart, MessageCircle } from "lucide-react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

export default function PostCard({
  id,
  profilePicture,
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
    <div className="w-full max-w-md overflow-hidden border bg-background shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={profilePicture?.url}
            alt={username}
            className="h-10 w-10 rounded-full border object-cover"
          />

          <h3 className="text-base font-semibold">{username}</h3>
        </div>
      </div>

      {/* Images */}
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
                className={`h-2 w-2 rounded-full transition-all ${
                  currentImage === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="space-y-4 p-5">
        <p className="line-clamp-1 text-md leading-6 text-foreground">
          {caption}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Heart
              className={`h-5 w-5 ${
                liked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
            <span className="text-sm font-medium">
              {likeCount} {likeCount === 1 ? "like" : "likes"}
            </span>
          </button>

          <button
            onClick={() => navigate(`/post/${id}`)}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">
              {comments} {comments === 1 ? "comment" : "comments"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
