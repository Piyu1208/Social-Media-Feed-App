import express from "express";
import { visitProfile, updateProfile, follow, unfollow } from "../controllers/userController.js";

import { upload } from "../utils/imageUploadUtils.js";


const router = express.Router();

router.get("/users/:username", visitProfile);
router.patch("/users/profile", upload.single("file"), updateProfile);

router.patch("/users/:id/follow", follow);
router.delete("/users/:id/follow", unfollow)

export default router;