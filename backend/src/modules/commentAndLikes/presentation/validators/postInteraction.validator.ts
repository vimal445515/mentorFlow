import { z } from "zod";

export const createPostCommentSchema = z.object({
  commentText: z.string().trim().min(1, "Comment cannot be empty.").max(2_000),
}).strict();

export type CreatePostCommentInput = z.infer<typeof createPostCommentSchema>;
