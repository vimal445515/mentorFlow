import type { Response } from "express";
import { unlink } from "node:fs/promises";
import type { AuthenticatedRequest } from "../../../../app/middlewares/authMiddleware.ts";
import type { ChannelPostKind } from "../../domain/entities/ChannelPost.ts";
import type { TemporaryPostFile } from "../../domain/repositories/IChannelPostRepository.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { ResponseHandler } from "../../../../shared/response/responseHandler.ts";
import type { CreateChannelPostUseCase } from "../../application/useCase/CreateChannelPostUseCase.ts";
import type { ListChannelPostsUseCase } from "../../application/useCase/ListChannelPostsUseCase.ts";
import type { ListPublicChannelPostsUseCase } from "../../application/useCase/ListPublicChannelPostsUseCase.ts";
import type { UpdateChannelPostUseCase } from "../../application/useCase/UpdateChannelPostUseCase.ts";
import type { DeleteChannelPostUseCase } from "../../application/useCase/DeleteChannelPostUseCase.ts";
import { parseChannelPostInput } from "../validators/channelPost.validator.ts";

interface ChannelPostFiles {
  file?: Express.Multer.File;
  thumbnail?: Express.Multer.File;
}

function getFiles(req: AuthenticatedRequest): ChannelPostFiles {
  const files = req.files;
  if (!files || Array.isArray(files)) return {};
  return {
    file: files.file?.[0],
    thumbnail: files.thumbnail?.[0],
  };
}

function toTemporaryFile(file?: Express.Multer.File): TemporaryPostFile | undefined {
  if (!file) return undefined;
  return {
    filePath: file.path,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
}

async function removeTemporaryFiles(files: ChannelPostFiles): Promise<void> {
  await Promise.all(
    [files.file, files.thumbnail].filter(
      (file): file is Express.Multer.File => file !== undefined,
    ).map(async (file) => {
      try {
        await unlink(file.path);
      } catch (error) {
        if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
          throw error;
        }
      }
    }),
  );
}

function validateFiles(
  type: ChannelPostKind,
  files: ChannelPostFiles,
  requireMainFile: boolean,
): void {
  const { file, thumbnail } = files;
  if (type === "TEXT" && file) {
    throw new AppError("Text posts cannot include a main file.", HttpStatusCode.BAD_REQUEST);
  }
  if (type === "VIDEO" && requireMainFile && !file) {
    throw new AppError("A video file is required.", HttpStatusCode.BAD_REQUEST);
  }
  if (type === "DOCUMENT" && requireMainFile && !file) {
    throw new AppError("A PDF file is required.", HttpStatusCode.BAD_REQUEST);
  }
  if (type === "VIDEO" && file && !file.mimetype.startsWith("video/")) {
    throw new AppError("Video posts require a video file.", HttpStatusCode.BAD_REQUEST);
  }
  if (type === "DOCUMENT" && file && file.mimetype !== "application/pdf") {
    throw new AppError("Document posts require a PDF file.", HttpStatusCode.BAD_REQUEST);
  }
  if (type === "DOCUMENT" && file && file.size > 50 * 1024 * 1024) {
    throw new AppError("PDF files must be 50 MB or smaller.", 413);
  }
  if (thumbnail && !thumbnail.mimetype.startsWith("image/")) {
    throw new AppError("Post thumbnails must be image files.", HttpStatusCode.BAD_REQUEST);
  }
  if (thumbnail && thumbnail.size > 20 * 1024 * 1024) {
    throw new AppError("Thumbnail files must be 20 MB or smaller.", 413);
  }
}

function getParam(req: AuthenticatedRequest, name: string): string {
  const value = req.params[name];
  const param = Array.isArray(value) ? value[0] : value;
  if (!param) {
    throw new AppError(`${name} is required.`, HttpStatusCode.BAD_REQUEST);
  }
  return param;
}

function getMentorId(req: AuthenticatedRequest): string {
  if (!req.user?.userId) {
    throw new AppError("Unauthorized.", HttpStatusCode.UNAUTHORIZED);
  }
  if (req.user.role !== "MENTOR") {
    throw new AppError("Only mentors can manage channel posts.", HttpStatusCode.FORBIDDEN);
  }
  return req.user.userId;
}

export class ChannelPostController {
  constructor(
    private readonly createPostUseCase: CreateChannelPostUseCase,
    private readonly listPostsUseCase: ListChannelPostsUseCase,
    private readonly listPublicPostsUseCase: ListPublicChannelPostsUseCase,
    private readonly updatePostUseCase: UpdateChannelPostUseCase,
    private readonly deletePostUseCase: DeleteChannelPostUseCase,
  ) {}

  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    const posts = await this.listPostsUseCase.execute(
      getParam(req, "channelId"),
      getMentorId(req),
    );
    ResponseHandler.success(res, "Channel posts fetched successfully.", posts);
  }

  async listPublic(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user?.userId) {
      throw new AppError("Unauthorized.", HttpStatusCode.UNAUTHORIZED);
    }
    if (req.user.role !== "STUDENT") {
      throw new AppError(
        "Only students can view public channel posts.",
        HttpStatusCode.FORBIDDEN,
      );
    }
    const posts = await this.listPublicPostsUseCase.execute(
      getParam(req, "channelId"),
    );
    ResponseHandler.success(res, "Public channel posts fetched successfully.", posts);
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const files = getFiles(req);
    try {
      const input = parseChannelPostInput(req.body);
      validateFiles(input.type, files, true);
      const post = await this.createPostUseCase.execute(
        getParam(req, "channelId"),
        getMentorId(req),
        input,
        toTemporaryFile(files.file),
        toTemporaryFile(files.thumbnail),
      );
      ResponseHandler.success(res, "Channel post created successfully.", post, HttpStatusCode.CREATED);
    } finally {
      await removeTemporaryFiles(files);
    }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const files = getFiles(req);
    try {
      const input = parseChannelPostInput(req.body);
      validateFiles(input.type, files, false);
      const post = await this.updatePostUseCase.execute(
        getParam(req, "postId"),
        getMentorId(req),
        input,
        toTemporaryFile(files.file),
        toTemporaryFile(files.thumbnail),
      );
      ResponseHandler.success(res, "Channel post updated successfully.", post);
    } finally {
      await removeTemporaryFiles(files);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    await this.deletePostUseCase.execute(
      getParam(req, "postId"),
      getMentorId(req),
    );
    ResponseHandler.success(res, "Channel post deleted successfully.", null);
  }
}
