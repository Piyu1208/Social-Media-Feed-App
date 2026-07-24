import { useRef, useState, useEffect } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import api from "../api/axios.js";
import { useParams } from "react-router-dom";

export default function Post() {
  const [currentImage, setCurrentImage] = useState(0);
  const scrollRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [post, setPost] = useState(null);
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

      setPost(res.data?.post);
      setComments(res.data?.comments);
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

      setComments((prev) => [...prev, res.data.comment]);
      setComment("");
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
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
    <div className="mx-auto mt-6 flex h-[90vh] w-[900px] max-w-[95vw] overflow-hidden rounded-xl border bg-background shadow-xl">
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
          <div className="flex items-center gap-3 border-t p-4">
            <input
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
