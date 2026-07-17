import express from "express";
import jwt from "jsonwebtoken";

import AppError from "../utils/appError.js";

import User from "../models/userSchema.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
        throw new AppError("User not authenticated", 400);   
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        throw new AppError("User no longer exists", 400);
    }

    req.user = currentUser;

    next();

  } catch (error) {
    next(error);
  }
};


export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("Permission denied", 403));
        }
        next();
    }
};
