import type { AvailabilityResponseDto } from "../dto/AvailabilityResponseDto.ts";
import { AvailabilityMapper } from "../mappers/AvailabilityMapper.ts";
import type { IGetAvailabilityUseCase } from "../../domain/interfaces/useCase/IGetAvailabilityUseCase.ts";
import type { IAvailabilityRepository } from "../../domain/repositories/IAvailabilityRepository.ts";

export class GetAvailabilityUseCase implements IGetAvailabilityUseCase {
  constructor(private readonly availabilityRepository: IAvailabilityRepository) {}

  async execute(mentorId: string): Promise<AvailabilityResponseDto[]> {
    const slots = await this.availabilityRepository.findAllForMentor(mentorId);
    return slots.map(AvailabilityMapper.toResponseDto);
  }
}
