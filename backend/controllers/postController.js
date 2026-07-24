import express from "express";
import AppError from "../utils/appError.js";
import Post from "../models/postSchema.js";
import Comment from "../models/commentSchema.js";
import Notification from "../models/notificationSchema.js";
import {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/imageUploadUtils.js";
import { getIO, getSocketId } from "../socket/socket.js";
import mongoose from "mongoose";

export const createPost = async (req, res, next) => {
  try {
    let { caption } = req.body;

    caption = caption.trim();

    if (!caption) {
      throw new AppError("Caption cannot be empty", 400);
    }

    let postData = {
      author: req.user._id,
      caption: caption,
    };

    let imageList = [];

    if (req.files?.length) {
      for (let i = 0; i < req.files.length; i++) {
        console.log("uploading:", req.files[i].originalName);
        let result = await uploadToCloudinary(req.files[i].path);

        imageList.push(result);
      }

      postData.images = imageList;
    }

    const post = await Post.create(postData);

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const [post, comments] = await Promise.all([
      Post.findById(req.params.id).populate(
        "author",
        "username profilePicture",
      ),
      Comment.find({ post: req.params.id })
        .populate("author", "username profilePicture")
        .sort({ createdAt: 1 }),
    ]);

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    res.status(200).json({
      success: true,
      post,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new AppError("Post not found.", 404);
    }

    if ("caption" in req.body) {
      req.body.caption = req.body.caption.trim();

      if (!req.body.caption) {
        throw new AppError("Caption cannot be empty.", 400);
      }
    }

    let updateData = { ...req.body };

    if (req.files?.length) {
      const imageList = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.path)),
      );
      //Upload in parallel

      await Promise.all(
        post.images.map((image) => deleteFromCloudinary(image.public_id)),
      );
      //Delete in parallel

      updateData.images = imageList;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    for (const image of post.images) {
      await deleteFromCloudinary(image.public_id);
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted.",
    });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    const hasLiked = post.likes.some(
      (id) => id.toString() === req.user._id.toString(),
    );

    if (hasLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.addToSet(req.user._id);
    }

    //only create notification and emit it if it's not the user's post itself.
    if (post.author.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: "like",
        post: post._id,
      });

      const socketId = getSocketId(post.author.toString());

      const io = getIO();

      if (socketId) {
        io.to(socketId).emit("notification", notification);
      }
    }

    await post.save();

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  let session;
  let comment;
  let post;

  try {
    let { text } = req.body;

    text = text.trim();

    if (!text) {
      throw new AppError("Comment cannot be empty", 400);
    }

    session = await mongoose.startSession();

    await session.withTransaction(async () => {
      post = await Post.findById(req.params.id).session(session);

      if (!post) {
        throw new AppError("Post not found.", 404);
      }

      [comment] = await Comment.create(
        [
          {
            post: post._id,
            author: req.user._id,
            text,
          },
        ],
        { session },
      );

      post.commentCount += 1;
      await post.save({ session });
    });

    if (comment.author.equals(post.author)) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: comment.author,
        type: "comment",
        post: post._id,
      });

      const socketId = getSocketId(post.author.toString());
      console.log(socketId);
      const io = getIO();

      if (socketId) {
        io.to(socketId).emit("notification", notification);
      }
    }

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    next(error);
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.id });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

export const feed = async (req, res, next) => {
  try {
    const posts = await Post.find({
      author: {
        $in: req.user.following,
      },
    })
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    next(error);
  }
};
