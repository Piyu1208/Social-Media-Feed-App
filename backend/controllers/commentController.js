import express from "express";
import Comment from "../models/commentSchema.js";
import Post from "../models/postSchema.js";
import AppError from "../utils/appError.js";
import mongoose from "mongoose";

export const deleteComment = async (req, res, next) => {
  let session;
  try {
    session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const comment = await Comment.findByIdAndDelete(req.params.id, {
        session,
      });

      if (!comment) {
        throw new AppError("Comment not found.", 404);
      }

      await Post.findOneAndUpdate(
        {
          _id: comment.post,
          commentCount: { $gt: 0 },
        },
        {
          $inc: { commentCount: -1 },
        },
        { session },
      );
    });

    res.status(200).json({
      success: true,
      message: "comment deleted.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};
