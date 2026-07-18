import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import errorHandler from "./middlewares/errorHandler.js";
import { protect, restrictTo } from "./middlewares/authMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

import { createServer } from "http";
import { initSocket } from "./socket/socket.js";

const app = express();
const httpServer = createServer(app);

initSocket(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_BASE_URL,
  credentials: true,
}));

app.use("/uploads", express.static("uploads"));

await mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use("/api/v1/auth", authRoutes);

app.use(protect);
app.use("/api/v1", postRoutes);
app.use("/api/v1", commentRoutes);
app.use("/api/v1", notificationRoutes);
app.use("/api/v1", userRoutes);

app.use(errorHandler);

httpServer.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
