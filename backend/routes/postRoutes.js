import express from "express";

import { createPost, getPosts, getPost, updatePost, deletePost, 
    likePost, createComment, getComments, feed } from "../controllers/postController.js";

import { upload } from "../utils/imageUploadUtils.js";

const router = express.Router();

router.get("/posts/feed", feed);

router.post("/posts", upload.array("images", 5), createPost);
router.get("/posts", getPosts);
router.get("/posts/:id", getPost);
router.patch("/posts/:id", upload.array("images", 5), updatePost);
router.delete("/posts/:id", deletePost);

router.patch("/posts/:id/like", likePost);

router.post("/posts/:id/comments", createComment);
router.get("/posts/:id/comments", getComments);



export default router;