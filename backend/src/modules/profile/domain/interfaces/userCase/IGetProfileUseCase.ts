import type { ProfileResponseDto } from "../../../application/dto/ProfileResponseDto.ts";

export interface IGetProfileUseCase {
  execute(userId: string): Promise<ProfileResponseDto>;
}
