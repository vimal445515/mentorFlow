import type { UpdateProfileDto } from "../../../application/dto/UpdateProfileDto.ts";
import type { ProfileResponseDto } from "../../../application/dto/ProfileResponseDto.ts";

export interface IUpdateProfileUseCase {
  execute(userId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto>;
}
