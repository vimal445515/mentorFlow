import { Router } from "express";
import { authMiddleware } from "../../../../app/middlewares/authMiddleware.ts";
import { adminMiddleware } from "../../../../app/middlewares/adminMiddleware.ts";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.ts";
import { AuditLogController } from "../controllers/auditLog.controller.ts";

export function createAuditLogRoutes(controller: AuditLogController): Router {
  const router = Router();

  router.get("/", authMiddleware, adminMiddleware, asyncHandler(controller.list.bind(controller)));

  return router;
}
