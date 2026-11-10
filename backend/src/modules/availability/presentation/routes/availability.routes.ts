import { Router } from "express";
import { authMiddleware } from "../../../../app/middlewares/authMiddleware.ts";
import { validate } from "../../../../app/middlewares/validate.ts";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.ts";
import { PrismaAvailabilityRepository } from "../../infrastructure/repositories/PrismaAvailabilityRepository.ts";
import { AvailabilityController } from "../controllers/availability.controller.ts";
import { createAvailabilitySlotSchema } from "../validators/createAvailabilitySlot.validator.ts";

const controller = new AvailabilityController(new PrismaAvailabilityRepository());

export const availabilityRoutes = Router();

availabilityRoutes.get("/", authMiddleware, asyncHandler(controller.getAll.bind(controller)));
availabilityRoutes.post(
  "/",
  authMiddleware,
  validate(createAvailabilitySlotSchema),
  asyncHandler(controller.create.bind(controller)),
);
availabilityRoutes.delete(
  "/:slotId",
  authMiddleware,
  asyncHandler(controller.delete.bind(controller)),
);
