import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import type { IDeleteAvailabilityUseCase } from "../../domain/interfaces/useCase/IDeleteAvailabilityUseCase.ts";
import type { IAvailabilityRepository } from "../../domain/repositories/IAvailabilityRepository.ts";

export class DeleteAvailabilityUseCase implements IDeleteAvailabilityUseCase {
  constructor(private readonly availabilityRepository: IAvailabilityRepository) {}

  async execute(mentorId: string, slotId: string): Promise<void> {
    const deleted = await this.availabilityRepository.deleteForMentor(
      mentorId,
      slotId,
    );
    if (!deleted) {
      throw new AppError("Availability slot not found", HttpStatusCode.NOT_FOUND);
    }
  }
}
