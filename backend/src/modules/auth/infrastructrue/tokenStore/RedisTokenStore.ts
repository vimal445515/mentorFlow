import { injectable } from "inversify";
import { redisClient } from "../../../../config/redis.ts";
import type { ITokenStore } from "../../domain/interfaces/ITokenStore.ts";
@injectable()
export class RedisTokenStore implements ITokenStore {
  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await redisClient.set(`refresh:${userId}`, refreshToken, {
      EX: 7 * 24 * 60 * 1000,
    });
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return await redisClient.get(`refresh:${userId}`);
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await redisClient.del(`refresh:${userId}`);
  }
}
