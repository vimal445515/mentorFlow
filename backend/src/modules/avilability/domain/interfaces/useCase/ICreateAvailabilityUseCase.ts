import type { CreateAvailabilityDto } from "../../../application/dto/CreateAvailabilityDto.ts";
import type { AvailabilityResponseDto } from "../../../application/dto/AvailabilityResponseDto.ts";

export interface ICreateAvailabilityUseCase {
  execute(
    mentorId: string,
    dto: CreateAvailabilityDto,
  ): Promise<AvailabilityResponseDto>;
}
