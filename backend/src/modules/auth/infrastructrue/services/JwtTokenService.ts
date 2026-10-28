import jwt from "jsonwebtoken";
import type {
  TokenPayload,
  ITokenService,
} from "../../domain/interfaces/ITokenService.ts";
import type { StringValue } from "ms";
import { injectable } from "inversify";
import "dotenv/config";
function getExpiry(
  value: string | undefined,
  fallback: StringValue,
): StringValue {
  return (value || fallback) as StringValue;
}

@injectable()
export class JwtTokenService implements ITokenService {
  async generateAccessToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: getExpiry(process.env.ACCESS_TOKEN_EXPIRY, "15m"),
    });
  }

  async generateRefreshToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: getExpiry(process.env.REFRESH_TOKEN_EXPIRY, "7d"),
    });
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
  }

  generateResetToken(email: string, role: string): Promise<string> {
    const secret = process.env.JWT_RESET_SECRET || process.env.JWT_ACCESS_SECRET || "default_reset_secret";
    return Promise.resolve(
      jwt.sign({ email, role }, secret, {
        expiresIn: getExpiry(process.env.RESET_TOKEN_EXPIRY, "10m"),
      }),
    );
  }

  async verifyResetToken(token: string): Promise<TokenPayload> {
    const secret = process.env.JWT_RESET_SECRET || process.env.JWT_ACCESS_SECRET || "default_reset_secret";
    return jwt.verify(token, secret) as TokenPayload;
  }
}
