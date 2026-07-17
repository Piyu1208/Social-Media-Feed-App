import express from "express";

import { signup, verifyEmail, completeProfile, login, logout } from "../controllers/authController.js";
import { upload } from "../utils/imageUploadUtils.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/verify", verifyEmail);
router.post("/complete-profile", upload.single("file"), completeProfile);
router.post("/login", login);
router.post("/logout", logout);


export default router;