import "./PostCard.css";

export default function PostCard({
  profilePicture,
  username,
  images,
  caption,
  likes,
  comments,
}) {
  return (
    <div className="post-card">
      <div className="post-header">
        <img className="profile-pic" src={profilePicture?.url} alt={username} />

        <p className="username">{username}</p>
      </div>

      <div className="post-images">
        {images.length > 0 &&
          images.map((image) => (
            <img
              className="post-image"
              src={image.url}
              key={image.public_id}
              alt={username}
            />
          ))}
      </div>

      <div className="post-actions">
        <div className="action-group">
          <button className="like-btn">🩵 Like</button>
          <span className="likes">{likes} likes</span>
        </div>

        <div className="action-group">
          <button className="comment-btn">💬 Comment</button>
          <span className="comments">{comments} comments</span>
        </div>
      </div>
    </div>
  );
}
