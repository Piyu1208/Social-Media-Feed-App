import { useState } from "react";

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

      <CardContent className="p-0">
        <div className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide">
          {images.map((image) => (
            <img
              key={image.public_id}
              src={image.url}
              alt={username}
              className="h-[500px] w-full flex-shrink-0 snap-center object-cover"
            />
          ))}
        </div>
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
            <Button variant="ghost" size="icon">
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
