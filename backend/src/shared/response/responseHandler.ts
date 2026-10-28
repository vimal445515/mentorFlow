import type { Response } from "express";

export class ResponseHandler {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    status = 200,
  ): Response {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  }

  static error<T>(
    res: Response,
    message: string,
    error?: T,
    status = 400,
  ): Response {
    return res.status(status).json({
      success: false,
      message,
      error,
    });
  }
}
