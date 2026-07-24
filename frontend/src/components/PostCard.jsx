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
    <Card className="w-full max-w-md overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={profilePicture?.url}
            alt={username}
            className="h-10 w-10 rounded-full object-cover border"
          />

          <div>
            <CardTitle className="text-base font-semibold">
              {username}
            </CardTitle>
          </div>
        </div>

        <CardAction>
          <Button size="sm" variant="outline">
            Follow
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="relative p-0">
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
              className="h-[500px] w-full flex-shrink-0 snap-center object-cover"
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
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-4 p-4">
        <div>{caption}</div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleLike}>
              <Heart
                className={`h-5 w-5 transition-colors ${
                  liked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                }`}
              />
            </Button>

            <span className="text-sm text-muted-foreground">
              {likeCount} {likeCount === 1 ? "like" : "likes"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"
            onClick={(e) => navigate(`/post/${id}`)}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>

            <span className="text-sm text-muted-foreground">
              {comments} {comments === 1 ? "comment" : "comments"}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
