import express from "express";
import { deleteComment } from "../controllers/commentController.js";

const router = express.Router();

router.delete("/comments/:id", deleteComment);

export default router;