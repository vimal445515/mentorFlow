import multer from "multer";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import type { RequestHandler } from "express";
import { AppError } from "../../../../shared/errors/appError.ts";

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const uploadDirectory = path.join(process.cwd(), "tmp/uploads");
mkdirSync(uploadDirectory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_req, _file, callback) => callback(null, randomUUID()),
  }),
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024,
    files: 2,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new AppError("Unsupported channel post file type.", 400));
      return;
    }
    if (
      file.fieldname === "thumbnail" &&
      !file.mimetype.startsWith("image/")
    ) {
      callback(new AppError("Post thumbnails must be image files.", 400));
      return;
    }
    callback(null, true);
  },
}).fields([
  { name: "file", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

export const channelPostUploadMiddleware: RequestHandler = (req, res, next) => {
  upload(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      next(new AppError(error.message, status));
      return;
    }
    if (error) {
      next(error);
      return;
    }
    next();
  });
};
