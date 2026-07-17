import express from "express";
import { getNotifications, readNotification, readAllNotifications, unreadNotificationsCount } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", readNotification);
router.patch("/notifications/read-all", readAllNotifications);
router.get("/notifications/unread-count", unreadNotificationsCount);



export default router;