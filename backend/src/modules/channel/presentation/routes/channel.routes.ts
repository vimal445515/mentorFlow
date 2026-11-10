import { Router } from "express";
import { authMiddleware } from "../../../../app/middlewares/authMiddleware.ts";
import { validate } from "../../../../app/middlewares/validate.ts";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.ts";
import { ChannelController } from "../controllers/channel.controller.ts";
import {
  createChannelSchema,
  updateChannelSchema,
} from "../validators/channel.validator.ts";

export function createChannelRoutes(controller: ChannelController): Router {
  const router = Router();

  router.get("/", authMiddleware, asyncHandler(controller.list.bind(controller)));
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
