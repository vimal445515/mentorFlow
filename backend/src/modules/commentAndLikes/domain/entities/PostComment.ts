export interface PostComment {
  commentId: number;
  parentCommentId: number | null;
  commentText: string;
  createdAt: Date;
  authorName: string;
  authorImageUrl: string | null;
}

export interface PostEngagement {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export interface PostEngagementSummary extends PostEngagement {
  postId: string;
}

export type PostInteractionRole = "STUDENT" | "MENTOR";
