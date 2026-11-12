import { Router } from "express";
import { authMiddleware } from "../../../../app/middlewares/authMiddleware.ts";
import { validate } from "../../../../app/middlewares/validate.ts";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.ts";
import { PostInteractionController } from "../controllers/postInteraction.controller.ts";
import { createPostCommentSchema } from "../validators/postInteraction.validator.ts";

export function createCommentAndLikesRoutes(controller: PostInteractionController): Router {
  const router = Router();

  router.get(
    "/posts/:postId/comments",
    authMiddleware,
    asyncHandler(controller.listComments.bind(controller)),
  );
  router.post(
    "/posts/:postId/comments",
    authMiddleware,
    validate(createPostCommentSchema),
    asyncHandler(controller.createComment.bind(controller)),
  );
  router.post(
    "/posts/:postId/like",
    authMiddleware,
    asyncHandler(controller.like.bind(controller)),
  );
  router.delete(
    "/posts/:postId/like",
    authMiddleware,
    asyncHandler(controller.unlike.bind(controller)),
  );

  return router;
}
