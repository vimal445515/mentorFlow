import { injectable } from "inversify";
import { redisClient } from "../../../../config/redis.ts";
import type { IOtpStore } from "../../domain/interfaces/IOtpStore.ts";
import type { UserRole } from "../../domain/enums/UserRole.ts";

@injectable()
export class RedisOtpStore implements IOtpStore {
  async saveOtp(email: string, role: UserRole, otp: string): Promise<void> {
    await redisClient.set(`otp:${role}:${email}`, otp, { EX: 300 });
  }

  async getOtp(email: string, role: UserRole): Promise<string | null> {
    return await redisClient.get(`otp:${role}:${email}`);
  }

  async deleteOtp(email: string, role: UserRole): Promise<void> {
    await redisClient.del(`otp:${role}:${email}`);
  }

  async saveForgotOtp(email: string, otp: string): Promise<void> {
    await redisClient.set(`otp:forgot:${email}`, otp, { EX: 300 });
  }

  async getForgotOtp(email: string): Promise<string | null> {
    return await redisClient.get(`otp:forgot:${email}`);
  }

  async deleteForgotOtp(email: string): Promise<void> {
    await redisClient.del(`otp:forgot:${email}`);
  }

  async saveResetToken(email: string, token: string): Promise<void> {
    await redisClient.set(`token:reset:${email}`, token, { EX: 600 });
  }

  async getResetToken(email: string): Promise<string | null> {
    return await redisClient.get(`token:reset:${email}`);
  }

  async deleteResetToken(email: string): Promise<void> {
    await redisClient.del(`token:reset:${email}`);
  }
}
