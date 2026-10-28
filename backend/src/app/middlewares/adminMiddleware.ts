import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./authMiddleware.ts";
import { AppError } from "../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../shared/constant/HttpStatusCode.ts";

export function adminMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== "ADMIN") {
    next(new AppError("Administrator access required.", HttpStatusCode.FORBIDDEN));
    return;
  }

  next();
}
