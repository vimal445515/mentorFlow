import { Router } from "express";
import { authMiddleware } from "../../../../app/middlewares/authMiddleware.ts";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.ts";
import { AvailabilityController } from "../controllers/availability.controller.ts";
import { validate } from "../../../../app/middlewares/validate.ts";
import { createAvailabilitySchema } from "../validators/availability.validator.ts";

export function createAvailabilityRoutes(
  availabilityController: AvailabilityController,
): Router {
  const router = Router();

  router.get(
    "/",
    authMiddleware,
    asyncHandler(availabilityController.getSlots.bind(availabilityController)),
  );
  router.post(
    "/",
    authMiddleware,
    validate(createAvailabilitySchema),
    asyncHandler(availabilityController.createSlot.bind(availabilityController)),
  );
  router.delete(
    "/:slotId",
    authMiddleware,
    asyncHandler(availabilityController.deleteSlot.bind(availabilityController)),
  );

  return router;
}
