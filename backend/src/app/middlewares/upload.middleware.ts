import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const uploadDirectory = path.join(process.cwd(), "tmp/uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (_req, file, callback) => {
    callback(null, `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  },
});

const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
];

export const uploadMiddleware = multer({
  storage,

  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB
    files: 1,
  },

  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(new Error("Unsupported file type"));
    }

    callback(null, true);
  },
}).single("file");
