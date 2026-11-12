import type { Response } from "express";
import type { AuthenticatedRequest } from "../../../../app/middlewares/authMiddleware.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { ResponseHandler } from "../../../../shared/response/responseHandler.ts";
import type { PostInteractionRole } from "../../domain/entities/PostComment.ts";
import type { PostInteractionsUseCase } from "../../application/useCase/PostInteractionsUseCase.ts";
import type { CreatePostCommentInput } from "../validators/postInteraction.validator.ts";

function getActor(req: AuthenticatedRequest): {
  userId: string;
  role: PostInteractionRole;
} {
  const user = req.user;
  if (!user?.userId) {
    throw new AppError("Unauthorized.", HttpStatusCode.UNAUTHORIZED);
  }
  if (user.role !== "STUDENT" && user.role !== "MENTOR") {
    throw new AppError("Only students and mentors can interact with posts.", HttpStatusCode.FORBIDDEN);
  }
  return { userId: user.userId, role: user.role };
}

function getPostId(req: AuthenticatedRequest): string {
  const value = req.params.postId;
  const postId = Array.isArray(value) ? value[0] : value;
  if (!postId) {
    throw new AppError("Post ID is required.", HttpStatusCode.BAD_REQUEST);
  }
  return postId;
}

export class PostInteractionController {
  constructor(private readonly useCase: PostInteractionsUseCase) {}

  async listComments(req: AuthenticatedRequest, res: Response): Promise<void> {
    const actor = getActor(req);
    const comments = await this.useCase.listComments(getPostId(req), actor.userId, actor.role);
    ResponseHandler.success(res, "Post comments fetched successfully.", comments);
  }

  async createComment(req: AuthenticatedRequest, res: Response): Promise<void> {
    const actor = getActor(req);
    const { commentText } = req.body as CreatePostCommentInput;
    const comment = await this.useCase.createComment(
      getPostId(req),
      actor.userId,
      actor.role,
      commentText,
    );
    ResponseHandler.success(
      res,
      "Comment added successfully.",
      comment,
      HttpStatusCode.CREATED,
    );
  }

  async like(req: AuthenticatedRequest, res: Response): Promise<void> {
    const actor = getActor(req);
    const engagement = await this.useCase.like(getPostId(req), actor.userId, actor.role);
    ResponseHandler.success(res, "Post liked successfully.", engagement);
  }

  async unlike(req: AuthenticatedRequest, res: Response): Promise<void> {
    const actor = getActor(req);
    const engagement = await this.useCase.unlike(getPostId(req), actor.userId, actor.role);
    ResponseHandler.success(res, "Post unliked successfully.", engagement);
  }
}
