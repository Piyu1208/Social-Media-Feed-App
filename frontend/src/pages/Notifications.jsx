import { useState, useEffect } from "react";
import NotificationItem from "../components/NotificationItem.jsx";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../NotificationContext.jsx";
import { Loader2 } from "lucide-react";

export default function Notifications() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { notifications, setNotifications, markAsRead } = useNotifications();

  const fetchNotifications = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.get("/notifications");
      console.log(res.data);
      setNotifications(res.data.notifications);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    setError(null);
    setLoading(true);
    try {
      if (!notification.isRead) {
        await markAsRead(notification._id);
      }

      if (notification.type === "follow") {
        navigate(`/visit-profile/${notification.sender.username}`);
      } else {
        navigate(`/post/${notification.post}`);
      }
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Notifications</h1>

      {loading && (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Fetching notifications...
          </p>
        </div>
      )}

      {error && (
        <div className="flex w-full gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircleIcon className="h-5 w-5 shrink-0" />
          <div>
            <h4 className="font-medium">Login failed</h4>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="rounded-xl border py-10 text-center text-muted-foreground">
          No notifications yet
        </div>
      )}

      <div className="space-y-2">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            profilePicture={notification.sender.profilePicture}
            username={notification.sender.username}
            isRead={notification.isRead}
            createdAt={notification.createdAt}
            type={notification.type}
            onClick={() => handleNotificationClick(notification)}
          />
        ))}
      </div>
    </div>
  );
}
