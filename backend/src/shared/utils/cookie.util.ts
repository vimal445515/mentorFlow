import type { Response } from "express";

import { config } from "dotenv";

export const setRefreshTokenCookie = (
  res: Response,
  refereshToken: string,
): void => {
  res.cookie("refreshToken", refereshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 1000,
  });
};


export const clearRefreshTokenCookie = (res:Response):void =>{
  res.clearCookie("refreshToken");
}
