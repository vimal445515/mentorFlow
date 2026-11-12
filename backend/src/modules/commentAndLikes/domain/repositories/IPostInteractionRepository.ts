import type {
  PostComment,
  PostEngagement,
  PostEngagementSummary,
  PostInteractionRole,
} from "../entities/PostComment.ts";

export interface IPostInteractionRepository {
  canAccessPost(
    postId: string,
    userId: string,
    role: PostInteractionRole,
  ): Promise<boolean>;
  listComments(postId: string): Promise<PostComment[]>;
  createComment(postId: string, userId: string, commentText: string): Promise<PostComment>;
  addLike(postId: string, userId: string): Promise<void>;
  removeLike(postId: string, userId: string): Promise<void>;
  getEngagement(postId: string, userId: string): Promise<PostEngagement>;
  getEngagements(postIds: string[], userId: string): Promise<PostEngagementSummary[]>;
}
