import { UserRole } from "../enums/UserRole.ts";

export interface TokenPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export interface ITokenService {
  generateAccessToken(payload: TokenPayload): Promise<string>;
  generateRefreshToken(payload: TokenPayload): Promise<string>;
  generateResetToken(email: string, role: string): Promise<string>;
  verifyAccessToken(token: string): Promise<TokenPayload>;
  verifyRefreshToken(token: string): Promise<TokenPayload>;
  verifyResetToken(token: string): Promise<TokenPayload>;
}
