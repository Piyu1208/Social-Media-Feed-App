import { useState, useEffect } from "react";
import { NotificationContext } from "./NotificationContext.jsx";
import { socket } from "./socket/socket.js";
import api from "./api/axios.js";
import { useAuth } from "./AuthContext";

export default function NotificationProvider({ children }) {
  const { user, loading } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    console.log("Notification provider user:", user);
    if (loading || !user) return;

    console.log("fetching count...");
    fetchNotificationsCount();

    socket.connect();

    socket.once("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("register", user._id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.log("Connect error:", err.message);
    });

    socket.on("notification", handleNotification);

    return () => {
      
        console.log("Cleaning up socket...");
      socket.off("notification", handleNotification);
      socket.disconnect();
    };
  }, [user, loading]);

  const fetchNotificationsCount = async () => {
    const res = await api.get("/notifications/unread-count");
    setUnreadCount(res.data.count);
  };

  function handleNotification(notification) {
    console.log("Received notification:", notification);
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }

  const markAsRead = async (notificationId) => {
    await api.patch(`/notifications/${notificationId}/read`);

    setNotifications(prev => 
        prev.map(n => 
            n._id === notificationId
            ? { ...n, isRead: true }
            : n
        )
    );

    setUnreadCount(prev => Math.max(prev - 1,  0));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        setNotifications,
        setUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
