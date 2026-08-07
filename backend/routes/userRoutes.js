import express from "express";
import { me, getMe, visitProfile, searchUsers, updateProfile, follow, unfollow } from "../controllers/userController.js";

import { upload } from "../utils/imageUploadUtils.js";


const router = express.Router();

router.get("/users/auth/me", me);

router.get("/users/me", getMe);

router.get("/users/search", searchUsers);

router.get("/users/:username", visitProfile);
router.patch("/users/profile", upload.single("profilePicture"), updateProfile);

router.patch("/users/:id/follow", follow);
router.delete("/users/:id/follow", unfollow)

export default router;