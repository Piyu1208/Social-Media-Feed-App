import { useRef, useState, useEffect } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import api from "../api/axios.js";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Post() {
  const { user } = useAuth();
  const [currentImage, setCurrentImage] = useState(0);
  const scrollRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState();
  const [likeCount, setLikeCount] = useState();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const handleScroll = (e) => {
    const { scrollLeft, clientWidth } = e.target;
    setCurrentImage(Math.round(scrollLeft / clientWidth));
  };

  const handleGetPost = async () => {
    try {
      setError(null);
      setLoading(true);

      const res = await api.get(`/posts/${id}`);

      const fetchedPost = res.data?.post;

      setPost(fetchedPost);
      setComments(res.data?.comments);
      setLiked(fetchedPost.likes.includes(user?._id));
      setLikeCount(fetchedPost.likes.length);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      setError(null);
      setLoading(true);

      const res = await api.post(`/posts/${id}/comments`, {
        text: comment.trim(),
      });

      const newComment = {
        ...res.data.comment,
        author: {
          username: user.username,
          profilePicture: user.profilePicture,
        },
      };

      setComments((prev) => [...prev, newComment]);
      setComment("");
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    handleGetPost();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex h-screen items-center justify-center">
        Post not found.
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 flex h-[90vh] w-[900px] max-w-[95vw] overflow-hidden border bg-background shadow-xl">
      {/* LEFT */}
      {/* LEFT - Hidden on mobile */}
      <div className="relative hidden h-full w-1/2 items-center justify-center bg-black md:flex">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden"
        >
          {post.images.map((image) => (
            <img
              key={image.public_id}
              src={image.url}
              alt=""
              className="h-full w-full flex-shrink-0 snap-center object-contain"
            />
          ))}
        </div>

        {post.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {post.images.map((_, index) => (
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

      {/* RIGHT */}
      <div className="flex h-full w-full flex-col md:w-1/2 border-l">
        {/* Header */}
        <div className="flex items-center gap-3 border-b p-4">
          <img
            src={post.author.profilePicture?.url}
            alt={post.author.username}
            className="h-10 w-10 rounded-full object-cover"
          />

          <span className="font-semibold">{post.author.username}</span>
        </div>

        {/* Comments */}
        <div className="flex-1 overflow-y-auto space-y-6 p-4">
          {/* Caption */}
          <div className="flex gap-3">
            <img
              src={post.author.profilePicture?.url}
              alt={post.author.username}
              className="h-8 w-8 rounded-full object-cover"
            />

            <p className="text-sm">
              <span className="mr-2 font-semibold">{post.author.username}</span>
              {post.caption}
            </p>
          </div>

          {/* Comments */}
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <img
                src={comment.author.profilePicture?.url}
                alt={comment.author.username}
                className="h-8 w-8 rounded-full object-cover"
              />

              <p className="text-sm">
                <span className="mr-2 font-semibold">
                  {comment.author.username}
                </span>
                {comment.text}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t bg-background">
          <div className="flex items-center justify-between py-4 px-3">
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
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">
                {comments.length} {comments.length === 1 ? "comment" : "comments"}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3 border-t p-4">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-sm outline-none"
            />

            <button
              className="text-sm font-semibold text-blue-500 hover:text-blue-400"
              onClick={handleComment}
              disabled={loading || !comment.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
