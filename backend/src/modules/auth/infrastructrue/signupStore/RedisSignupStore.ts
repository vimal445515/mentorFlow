import { injectable } from "inversify";
import { redisClient } from "../../../../config/redis.ts";
import type {
  ISignupStore,
  SignupData,
} from "../../domain/interfaces/ISignupStore.ts";
import type { UserRole } from "../../domain/enums/UserRole.ts";
@injectable()
export class RedisSignupStore implements ISignupStore {
  async save(email: string, role: UserRole, data: SignupData): Promise<void> {
    await redisClient.set(`signup:${role}:${email}`, JSON.stringify(data), {
      EX: 3000,
    });
  }

  async get(email: string, role: UserRole): Promise<SignupData | null> {
    const data = await redisClient.get(`signup:${role}:${email}`);
    if (!data) {
      return null;
    }

    return JSON.parse(data) as SignupData;
  }

  async delete(email: string, role: UserRole): Promise<void> {
    await redisClient.del(`signup:${role}:${email}`);
  }
}
