import type { AvailabilityResponseDto } from "../../../application/dto/AvailabilityResponseDto.ts";

export interface IGetAvailabilityUseCase {
  execute(mentorId: string): Promise<AvailabilityResponseDto[]>;
}
