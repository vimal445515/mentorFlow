import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { UserRole } from "../../../auth/domain/enums/UserRole.ts";
import type { IUserRepository } from "../../../auth/domain/repositories/IUserRepository.ts";
import type { Experience } from "../../domain/entities/Experience.ts";
import type { IGetExperiencesUseCase } from "../../domain/interfaces/useCase/getExperiencesUseCase.ts";
import type { IExperienceRepository } from "../../domain/repositories/IExperienceRepository.ts";

export class GetExperiencesUseCase implements IGetExperiencesUseCase {
  constructor(
    private readonly experienceRepository: IExperienceRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(mentorId: string): Promise<Experience[]> {
    const mentor = await this.userRepository.findById(mentorId);
    if (!mentor) {
      throw new AppError("Mentor not found", HttpStatusCode.NOT_FOUND);
    }
    if (mentor.role !== UserRole.MENTOR) {
      throw new AppError("Only mentors can view mentor experience", HttpStatusCode.FORBIDDEN);
    }

    return this.experienceRepository.findByMentorId(mentorId);
  }
}
