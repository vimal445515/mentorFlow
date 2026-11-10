import type { CreateAvailabilityDto } from "../dto/CreateAvailabilityDto.ts";
import type { AvailabilityResponseDto } from "../dto/AvailabilityResponseDto.ts";
import { AvailabilityMapper } from "../mappers/AvailabilityMapper.ts";
import type { ICreateAvailabilityUseCase } from "../../domain/interfaces/useCase/ICreateAvailabilityUseCase.ts";
import type { IAvailabilityRepository } from "../../domain/repositories/IAvailabilityRepository.ts";

export class CreateAvailabilityUseCase implements ICreateAvailabilityUseCase {
  constructor(private readonly availabilityRepository: IAvailabilityRepository) {}

  async execute(
    mentorId: string,
    dto: CreateAvailabilityDto,
  ): Promise<AvailabilityResponseDto> {
    const availability = await this.availabilityRepository.createForMentor(
      mentorId,
      dto,
    );
    return AvailabilityMapper.toResponseDto(availability);
  }
}
