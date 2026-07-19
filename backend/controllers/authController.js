import express from "express";
import AppError from "../utils/appError.js";
import validator from "validator";
import User from "../models/userSchema.js";
import TempUser from "../models/tempUserSchema.js";
import signToken from "../utils/jwt.js";
import nodemailer from "nodemailer";
import { uploadToCloudinary } from "../utils/imageUploadUtils.js";


export const signup = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Please provide email & password", 400);
    }

    email = email.trim().toLowerCase();

    if (!validator.isEmail(email)) {
      throw new AppError("Please provide a valid email", 400);
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
      })
    ) {
      throw new AppError(
        "Password must contain at least 1 uppercase, lowecase letter, 1 number, 1 special symbol and must be at least 6 chars long.",
        400,
      );
    }

    const existingTempUser = await TempUser.findOne({ email });

    if (existingTempUser) {
      throw new AppError("OTP aleardy sent. Please verify your email", 400);
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      throw new AppError("Email already in use or user already exists", 400);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const tempUser = await TempUser.create({
      email: email,
      password: password,
      otp,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Email Verification OTP",
      html: `
                <h2>Email Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP expires in 30 minutes.</p>
                `,
    });

    console.log(info);

    res.status(201).json({
      success: "true",
      _id: tempUser._id,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { _id, otp } = req.body;

    const tempUser = await TempUser.findById(_id).select("+password +otp");

    if (!tempUser) {
      throw new AppError("OTP expired or user not found.", 404);
    }

    if (!(await tempUser.correctOTP(otp))) {
      throw new AppError("Invalid OTP", 400);
    }

    tempUser.isVerified = true;
    await tempUser.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const completeProfile = async (req, res, next) => {
  try {
    const { _id, username } = req.body;

    const tempUser = await TempUser.findById(_id).select("+password");

    if (!tempUser) {
      throw new AppError("Signup session expired", 404);
    }

    if (!tempUser.isVerified) {
      throw new AppError("Please verify your email first.", 403);
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      throw new AppError("Username already exists.", 400);
    }

    let userData = {
      email: tempUser.email,
      username: username,
      password: tempUser.password,
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);

      userData.profilePicture = {
        public_id: result.public_id,
        url: result.url,
      };
    }

    const user = await User.create(userData);

    await TempUser.deleteOne({ _id: tempUser._id });

    const token = signToken(user._id);

    res.cookie("token", token);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    if (!validator.isEmail(email)) {
      throw new AppError("Invalid Email", 400);
    }

    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isCorrect = await user.correctPassword(password);

    if (!isCorrect) {
      throw new AppError("Incorrect password", 400);
    }

    const token = signToken(user._id);

    res.cookie("token", token);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });



  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

