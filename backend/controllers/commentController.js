import express from "express";
import Comment from '../models/commentSchema.js';


export const deleteComment = async (req, res, next) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "comment deleted.",
        });
    } catch (error) {
        next(error);
    }
};

