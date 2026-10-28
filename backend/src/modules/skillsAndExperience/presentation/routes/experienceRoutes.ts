import { Router } from "express";
import { authMiddleware } from "../../../../app/middlewares/authMiddleware.ts";
import { validate } from "../../../../app/middlewares/validate.ts";
import { ExperienceController } from "../controller/ExperienceController.ts";
import { addExperienceSchema } from "../validators/addExperience.validator.ts";
import { updateExperienceSchema } from "../validators/updateExperience.validator.ts";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.ts";

export function createMentorExperienceRoutes(
  experienceController: ExperienceController,
) {
  const router = Router();

  router.post(
    "/",
    authMiddleware,
    validate(addExperienceSchema),
    asyncHandler(experienceController.create.bind(experienceController)),
  );
  router.get(
    "/",
    authMiddleware,
    asyncHandler(experienceController.getAll.bind(experienceController)),
  );
  router.patch(
    "/:experienceId",
    authMiddleware,
    validate(updateExperienceSchema),
    asyncHandler(experienceController.update.bind(experienceController)),
  );
  router.delete(
    "/:experienceId",
    authMiddleware,
    asyncHandler(experienceController.delete.bind(experienceController)),
  );

  return router;
}
