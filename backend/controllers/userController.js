import express from "express";
import User from "../models/userSchema.js";
import Post from "../models/postSchema.js";
import Notification from "../models/notificationSchema.js";
import AppError from "../utils/appError.js";
import mongoose from "mongoose";
import { upload, uploadToCloudinary, deleteFromCloudinary } from "../utils/imageUploadUtils.js";
import { getIO, getSocketId } from "../socket/socket.js";

export const visitProfile = async (req, res, next) => {
  try {
    let username = req.params.username;

    if (!username) {
      throw new AppError("Username cannot be empty", 400);
    }

    username = username.trim();

    const user = await User.findOne({ username });

    if (!user) {
      throw new AppError("User does not exist", 404);
    }

    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      profile: {
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
        postsCount: posts.length,
        followersCount: user.followers.length,
        following: user.following.length,
      },
      posts,
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, bio } = req.body;


    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //Fields to update
    let updateData = {
      username, bio,
    };

    if (req.file) {

      if (user.profilePicture?.public_id) {
        await deleteFromCloudinary(user.profilePicture.public_id);
      }

      const result = await uploadToCloudinary(req.file.path);

      updateData.profilePicture = {
        public_id: result.public_id,
        url: result.url,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    next(error);
  }
};

export const follow = async (req, res, next) => {
  let session;
  try {
    if (req.user._id.toString() === req.params.id) {
      throw new AppError("You cannot follow yourself.", 400);
    }

    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      throw new AppError("User not found.", 404);
    }

    if (userToFollow.followers.includes(req.user._id)) {
      throw new AppError("Already following this user.", 400);
    }

    session = await mongoose.startSession();
    session.startTransaction();
    


    const otherUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          followers: req.user._id,
        },
      },
      { returnDocument: "after", session },
    );


    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          following: req.params.id,
        },
      },
      { returnDocument: "after", session },
    );

    await session.commitTransaction();


    const notification = await Notification.create({
        recipient: userToFollow._id,
        sender: user._id,
        type: "follow",
    });

    const socketId = getSocketId(userToFollow._id.toString());

    const io = getIO();

    if (socketId) {
      io.to(socketId).emit("notification", notification);
    }

    res.status(200).json({
      success: true,
      user,
      otherUser,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

export const unfollow = async (req, res, next) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const userToFollow = await User.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          followers: req.user._id,
        },
      },
      { returnDocument: "after", session },
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          following: req.params.id,
        },
      },
      { returnDocument: "after", session },
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      user,
      userToFollow,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};
