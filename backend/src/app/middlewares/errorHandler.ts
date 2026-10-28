import type {NextFunction, Request, Response} from "express";
import {AppError} from "../../shared/errors/appError.ts";
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    const statusCode = (err instanceof AppError) ? err.statusCode : (err as any)?.statusCode;
    if (statusCode && typeof statusCode === "number") {
        res.status(statusCode).json({
            status: "error",
            message: err.message,
        });
    } else {
        console.error(err);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }   

}