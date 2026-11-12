import type { PostComment } from "../../domain/entities/PostComment.ts";
import type { PostCommentDto } from "../dto/PostCommentDto.ts";

export class PostCommentMapper {
  static toResponse(comment: PostComment): PostCommentDto {
    return {
      commentId: comment.commentId,
      parentCommentId: comment.parentCommentId,
      commentText: comment.commentText,
      createdAt: comment.createdAt.toISOString(),
      authorName: comment.authorName,
      ...(comment.authorImageUrl ? { authorImageUrl: comment.authorImageUrl } : {}),
    };
  }
}
