export interface PostCommentDto {
  commentId: number;
  parentCommentId: number | null;
  commentText: string;
  createdAt: string;
  authorName: string;
  authorImageUrl?: string;
}
