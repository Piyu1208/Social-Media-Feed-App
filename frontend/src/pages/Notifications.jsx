import { useState, useEffect } from "react";
import NotificationItem from "../components/NotificationItem.jsx";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../NotificationContext.jsx";

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
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Notifications</h1>

      {loading && (
        <p className="text-muted-foreground">Loading notifications...</p>
      )}

      {error && <p className="text-red-500">{error}</p>}

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
