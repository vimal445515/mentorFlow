import { prisma } from "../../../../config/database.ts";
import type {
  PostComment,
  PostEngagement,
  PostEngagementSummary,
  PostInteractionRole,
} from "../../domain/entities/PostComment.ts";
import type { IPostInteractionRepository } from "../../domain/repositories/IPostInteractionRepository.ts";

function toPostComment(record: {
  commentId: number;
  parentCommentId: number | null;
  commentText: string;
  createdAt: Date;
  user: { fullName: string; profileImageUrl: string | null };
}): PostComment {
  return {
    commentId: record.commentId,
    parentCommentId: record.parentCommentId,
    commentText: record.commentText,
    createdAt: record.createdAt,
    authorName: record.user.fullName,
    authorImageUrl: record.user.profileImageUrl,
  };
}

export class PrismaPostInteractionRepository implements IPostInteractionRepository {
  async canAccessPost(
    postId: string,
    userId: string,
    role: PostInteractionRole,
  ): Promise<boolean> {
    const post = await prisma.channelPost.findFirst({
      where: {
        postId,
        status: "published",
        channel: {
          isDeleted: false,
          ...(role === "STUDENT" ? { status: "ACTIVE" } : { mentorId: userId }),
        },
      },
      select: { postId: true },
    });
    return post !== null;
  }

  async listComments(postId: string): Promise<PostComment[]> {
    const records = await prisma.postComment.findMany({
      where: { postId },
      include: {
        user: { select: { fullName: true, profileImageUrl: true } },
      },
      orderBy: [{ createdAt: "asc" }, { commentId: "asc" }],
    });
    return records.map(toPostComment);
  }

  async createComment(
    postId: string,
    userId: string,
    commentText: string,
  ): Promise<PostComment> {
    const record = await prisma.postComment.create({
      data: { postId, userId, commentText },
      include: {
        user: { select: { fullName: true, profileImageUrl: true } },
      },
    });
    return toPostComment(record);
  }

  async addLike(postId: string, userId: string): Promise<void> {
    await prisma.postLike.upsert({
      where: { postId_userId: { postId, userId } },
      create: { postId, userId },
      update: {},
    });
  }

  async removeLike(postId: string, userId: string): Promise<void> {
    await prisma.postLike.deleteMany({ where: { postId, userId } });
  }

  async getEngagement(postId: string, userId: string): Promise<PostEngagement> {
    const [engagement] = await this.getEngagements([postId], userId);
    return engagement ?? { likesCount: 0, commentsCount: 0, isLiked: false };
  }

  async getEngagements(
    postIds: string[],
    userId: string,
  ): Promise<PostEngagementSummary[]> {
    if (postIds.length === 0) return [];

    const [likeCounts, commentCounts, viewerLikes] = await Promise.all([
      prisma.postLike.groupBy({
        by: ["postId"],
        where: { postId: { in: postIds } },
        _count: { _all: true },
      }),
      prisma.postComment.groupBy({
        by: ["postId"],
        where: { postId: { in: postIds } },
        _count: { _all: true },
      }),
      prisma.postLike.findMany({
        where: { postId: { in: postIds }, userId },
        select: { postId: true },
      }),
    ]);
    const likeCountByPostId = new Map(
      likeCounts.map((result) => [result.postId, result._count._all]),
    );
    const commentCountByPostId = new Map(
      commentCounts.map((result) => [result.postId, result._count._all]),
    );
    const viewerLikedPostIds = new Set(viewerLikes.map((like) => like.postId));

    return postIds.map((id) => ({
      postId: id,
      likesCount: likeCountByPostId.get(id) ?? 0,
      commentsCount: commentCountByPostId.get(id) ?? 0,
      isLiked: viewerLikedPostIds.has(id),
    }));
  }
}
