import type { UserResponseDto } from "../../../application/dto/UserResponseDto.ts";
import type { UserStatus } from "../../enums/UserStatus.ts";

export interface IUpdateUserStatusUseCase {
  execute(userId: string, status: Extract<UserStatus, "ACTIVE" | "SUSPENDED">, actorId: string): Promise<UserResponseDto>;
}
