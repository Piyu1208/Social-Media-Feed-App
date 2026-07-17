import multer from "multer";
import path from "path";
import { fileURLToPath } from "node:url";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import AppError from "../utils/appError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilterConfig = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

export const upload = multer({
  storage: storageConfig,
  limits: {
    fileSize: 5 * 1024 * 1024, //5 MB
  },
  fileFilter: fileFilterConfig,
});




export const uploadToCloudinary = async (localFilePath) => {
  const mainFolderName = "main";

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "main",
    });

    //Delete local file after upload
    fs.unlinkSync(localFilePath);

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Cloudinary upload error:");
    console.error(error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    throw error;
  }
};

export const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id, { invalidate: true });
  } catch (error) {
   throw error; 
  }
};
