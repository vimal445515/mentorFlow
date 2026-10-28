import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../shared/constant/HttpStatusCode.ts";
import {prisma} from "../../config/database.ts"
export interface AuthenticatedUserPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUserPayload;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
):Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "Authentication required. Please sign in.",
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError(
        "Invalid authorization format.",
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new AppError(
        "Server authentication configuration missing.",
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const decoded = jwt.verify(token, secret) as AuthenticatedUserPayload;
    req.user = decoded;
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
    }

    const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, role: true, status: true },
        });

        if (!user) {
          throw new AppError("Account not found. Please sign in again.", HttpStatusCode.UNAUTHORIZED);
        }

        if (user.status === "SUSPENDED") {
          throw new AppError(
            "Account suspended. Please contact support.",
            HttpStatusCode.FORBIDDEN,
          );
        }


    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    if (error.name === "TokenExpiredError") {
      next(
        new AppError(
          "Token expired. Please refresh your session.",
          HttpStatusCode.UNAUTHORIZED,
        ),
      );
      return;
    }
    next(
      new AppError(
        "Invalid authentication token.",
        HttpStatusCode.UNAUTHORIZED,
      ),
    );
  }
}
