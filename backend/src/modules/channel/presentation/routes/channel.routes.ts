import { Router } from "express";
import { authMiddleware } from "../../../../app/middlewares/authMiddleware.ts";
import { validate } from "../../../../app/middlewares/validate.ts";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.ts";
import { ChannelController } from "../controllers/channel.controller.ts";
import { ChannelPostController } from "../controllers/channelPost.controller.ts";
import { channelPostUploadMiddleware } from "../middlewares/channelPostUpload.middleware.ts";
import {
  createChannelSchema,
  updateChannelSchema,
} from "../validators/channel.validator.ts";

export function createChannelRoutes(
  controller: ChannelController,
  postController: ChannelPostController,
): Router {
  const router = Router();

  router.get(
    "/public/:channelId/posts",
    authMiddleware,
    asyncHandler(postController.listPublic.bind(postController)),
  );
  router.get(
    "/public/:channelId",
    authMiddleware,
    asyncHandler(controller.getPublic.bind(controller)),
  );
  router.get(
    "/public",
    authMiddleware,
    asyncHandler(controller.listPublic.bind(controller)),
  );
  router.get(
    "/:channelId/posts",
    authMiddleware,
    asyncHandler(postController.list.bind(postController)),
  );
  router.post(
    "/:channelId/posts",
    authMiddleware,
    channelPostUploadMiddleware,
    asyncHandler(postController.create.bind(postController)),
  );
  router.put(
    "/posts/:postId",
    authMiddleware,
    channelPostUploadMiddleware,
    asyncHandler(postController.update.bind(postController)),
  );
  router.delete(
    "/posts/:postId",
    authMiddleware,
    asyncHandler(postController.delete.bind(postController)),
  );

  router.get("/", authMiddleware, asyncHandler(controller.list.bind(controller)));
  router.get(
    "/:channelId",
    authMiddleware,
    asyncHandler(controller.get.bind(controller)),
  );
  router.post(
    "/",
    authMiddleware,
    validate(createChannelSchema),
    asyncHandler(controller.create.bind(controller)),
  );
  router.put(
    "/:channelId",
    authMiddleware,
    validate(updateChannelSchema),
    asyncHandler(controller.update.bind(controller)),
  );
  router.delete(
    "/:channelId",
    authMiddleware,
    asyncHandler(controller.delete.bind(controller)),
  );

  return router;
}
