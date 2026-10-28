import { Router } from "express";
import { authMiddleware } from "../../../../app/middlewares/authMiddleware.ts";
import { adminMiddleware } from "../../../../app/middlewares/adminMiddleware.ts";
import { UserController } from "../controllers/user.controller.ts";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.ts";

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  router.use(authMiddleware, adminMiddleware);
  router.get("/mentors/:mentorId", asyncHandler(userController.getMentorDetails.bind(userController)));
  router.get("/mentors", asyncHandler(userController.listMentors.bind(userController)));
  router.patch("/mentors/:mentorId/approve", asyncHandler(userController.approveMentor.bind(userController)));
  router.patch("/mentors/:mentorId/reject", asyncHandler(userController.rejectMentor.bind(userController)));
  router.get("/", asyncHandler(userController.list.bind(userController)));
  router.patch("/:userId/status", asyncHandler(userController.updateStatus.bind(userController)));

  return router;
}
