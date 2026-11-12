import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import type { PostCommentDto } from "../dto/PostCommentDto.ts";
import { PostCommentMapper } from "../mappers/PostCommentMapper.ts";
import type { PostEngagement, PostInteractionRole } from "../../domain/entities/PostComment.ts";
import type { IPostInteractionRepository } from "../../domain/repositories/IPostInteractionRepository.ts";

export class PostInteractionsUseCase {
  constructor(private readonly repository: IPostInteractionRepository) {}

  async listComments(
    postId: string,
    userId: string,
    role: PostInteractionRole,
  ): Promise<PostCommentDto[]> {
    await this.requireAccess(postId, userId, role);
    const comments = await this.repository.listComments(postId);
    return comments.map(PostCommentMapper.toResponse);
  }

  async createComment(
    postId: string,
    userId: string,
    role: PostInteractionRole,
    commentText: string,
  ): Promise<PostCommentDto> {
    await this.requireAccess(postId, userId, role);
    const comment = await this.repository.createComment(postId, userId, commentText);
    return PostCommentMapper.toResponse(comment);
  }

  async like(
    postId: string,
    userId: string,
    role: PostInteractionRole,
  ): Promise<PostEngagement> {
    await this.requireAccess(postId, userId, role);
    await this.repository.addLike(postId, userId);
    return this.repository.getEngagement(postId, userId);
  }

  async unlike(
    postId: string,
    userId: string,
    role: PostInteractionRole,
  ): Promise<PostEngagement> {
    await this.requireAccess(postId, userId, role);
    await this.repository.removeLike(postId, userId);
    return this.repository.getEngagement(postId, userId);
  }

  private async requireAccess(
    postId: string,
    userId: string,
    role: PostInteractionRole,
  ): Promise<void> {
    if (!(await this.repository.canAccessPost(postId, userId, role))) {
      throw new AppError("Channel post not found.", HttpStatusCode.NOT_FOUND);
    }
  }
}
