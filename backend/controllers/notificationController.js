import express from "express";
import Notification from "../models/notificationSchema.js";
import AppError from "../utils/appError.js";

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .populate("sender", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const readNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      throw new AppError("Notification not found.", 404);
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
        throw new AppError("Access denied.", 403)
    }

    const notificationRead = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      },{
        returnDocument: "after",
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      notification: notificationRead,
    });
  } catch (error) {
    next(error);
  }
};

export const readAllNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.updateMany(
            { recipient: req.user._id, isRead: false }, { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: `${notifications.modifiedCount} notifications marked read.`
        });
    } catch (error) {
       next(error);   
    }
};

export const unreadNotificationsCount = async (req, res, next) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user._id,
            isRead: false,
        });

        res.status(200).json({
            success: true,
            count
        });
    } catch (error) {
        next(error);
    }
};