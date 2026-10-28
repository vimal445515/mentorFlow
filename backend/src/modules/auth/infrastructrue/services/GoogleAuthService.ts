import { OAuth2Client } from "google-auth-library";
import { injectable } from "inversify";
import type { IGoogleAuthService, GoogleUserProfile } from "../../domain/interfaces/IGoogleAuthService.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import "dotenv/config";

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private client: OAuth2Client;
  private clientId: string;

  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID || "";
    this.client = new OAuth2Client(this.clientId);
  }

  async verifyToken(credentialToken: string): Promise<GoogleUserProfile> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: credentialToken,
        audience: this.clientId,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.sub) {
        throw new AppError("Invalid Google token payload", HttpStatusCode.UNAUTHORIZED);
      }

      const email = payload.email;
      const sub = payload.sub;

      return {
        googleId: sub,
        email: email.toLowerCase(),
        fullName: payload.name || email.split("@")[0] || "User",
        profileImageUrl: payload.picture || "",
      };
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        error?.message || "Failed to verify Google token",
        HttpStatusCode.UNAUTHORIZED
      );
    }
  }
}
