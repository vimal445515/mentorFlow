import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller.ts";
import { authMiddleware } from "../../../../app/middlewares/authMiddleware.ts";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.ts";

export function createProfileRoutes(profileController: ProfileController): Router {
  const router = Router();

  router.get("/", authMiddleware, asyncHandler(profileController.getProfile.bind(profileController)));
  router.put("/", authMiddleware, asyncHandler(profileController.updateProfile.bind(profileController)));
  router.patch("/", authMiddleware, asyncHandler(profileController.updateProfile.bind(profileController)));
  router.post(
    "/request-approval",
    authMiddleware,
    asyncHandler(profileController.requestMentorApproval.bind(profileController)),
  );
  return router;
}
