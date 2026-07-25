import { formatDistanceToNow } from "date-fns";

export default function NotificationItem({
  profilePicture,
  username,
  isRead,
  createdAt,
  type,
  onClick,
}) {
  const action = {
    like: "liked your post",
    comment: "commented on your post",
    follow: "started following you",
  };

  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-4 border px-4 py-3 transition-all duration-200 hover:shadow-sm ${
        isRead ? "bg-card hover:bg-muted/40" : "bg-muted border-primary/20"
      }`}
    >
      {/* Unread indicator */}
      <div className="flex w-3 justify-center">
        {!isRead && <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
      </div>

      {/* Avatar */}
      <img
        src={profilePicture?.url}
        alt={username}
        className="h-11 w-11 rounded-full border object-cover"
      />

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm leading-relaxed">
          <span className="font-semibold">{username}</span>{" "}
          <span className="text-muted-foreground">{action[type]}</span>
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
}
