import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { unlink } from "node:fs/promises";
import { fileTypeFromFile } from "file-type";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import type {
  IStorageService,
  UploadFileInput,
  UploadFileResult,
} from "../../domain/interfaces/IStorageService.ts";

import {
  s3Client,
  S3_BUCKET_NAME,
} from "../../../../infrastructure/storage/s3/s3.config.ts";

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export class S3StorageService implements IStorageService {
  async upload(input: UploadFileInput): Promise<UploadFileResult> {
    let fileKey: string | undefined;
    try {
      const detectedType = await fileTypeFromFile(input.filePath);

      if (!detectedType || !allowedTypes.includes(detectedType.mime)) {
        throw new Error("Invalid or unsupported file format");
      }

      const extension = detectedType.ext;

      fileKey = `${input.folder}/${randomUUID()}.${extension}`;

      const upload = new Upload({
        client: s3Client,

        params: {
          Bucket: S3_BUCKET_NAME,
          Key: fileKey,
          Body: createReadStream(input.filePath),
          ContentType: detectedType.mime,
        },

        partSize: 5 * 1024 * 1024,
        queueSize: 2,
        leavePartsOnError: false,
      });

      await upload.done();

      return {
        fileKey,
        fileName: input.originalName,
        mimeType: detectedType.mime,
        size: input.size,
      };
    } finally {
      try {
        await unlink(input.filePath);
      } catch (error) {
        if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
          throw error;
        }
      }
    }
  }

  async getUrl(fileKey: string): Promise<string> {
    return getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: S3_BUCKET_NAME, Key: fileKey }),
      { expiresIn: 3600 },
    );
  }

  async delete(fileKey: string): Promise<void> {
    await s3Client.send(
      new DeleteObjectCommand({ Bucket: S3_BUCKET_NAME, Key: fileKey }),
    );
  }
}
