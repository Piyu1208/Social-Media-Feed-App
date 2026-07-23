import { useState, useEffect } from "react";
import api from "../api/axios.js";
import PostCard from "../components/PostCard.jsx";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setError(null);
      setLoading(true);

      const res = await api.get("/users/me");

      console.log(res.data);
      setProfile(res.data.user);
      setPosts(res.data.posts);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <div>
        <img
          src={profile?.profilePicture.url}
          alt={profile?.profilePicture.url}
        />

        <div>
          <h3>{profile?.username}</h3>
          <p>{profile?.bio}</p>
          <p>{profile?.followers.length} followers</p>
          <p>{profile?.following.length} following</p>
        </div>

        <div>
          <h3>Your posts</h3>
          <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-6">
            {posts?.length > 0 &&
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
      </div>
    </div>
  );
}
