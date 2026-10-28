import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { UserRole } from "../../../auth/domain/enums/UserRole.ts";
import type { IUserRepository } from "../../../auth/domain/repositories/IUserRepository.ts";
import type { IUpdateExperienceUseCase } from "../../domain/interfaces/useCase/updateExperienceUseCase.ts";
import type { IExperienceRepository } from "../../domain/repositories/IExperienceRepository.ts";
import type { UpdateExperienceDto } from "../dto/ExperienceDto.ts";

export class UpdateExperienceUseCase implements IUpdateExperienceUseCase {
  constructor(
    private readonly experienceRepository: IExperienceRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    mentorId: string,
    experienceId: string,
    data: UpdateExperienceDto,
  ): Promise<{ message: string }> {
    const mentor = await this.userRepository.findById(mentorId);
    if (!mentor) {
      throw new AppError("Mentor not found", HttpStatusCode.NOT_FOUND);
    }
    if (mentor.role !== UserRole.MENTOR) {
      throw new AppError("Only mentors can update experience", HttpStatusCode.FORBIDDEN);
    }

    const experience = await this.experienceRepository.findById(experienceId);
    if (!experience || experience.mentorId !== mentorId) {
      throw new AppError("Experience not found", HttpStatusCode.NOT_FOUND);
    }

    await this.experienceRepository.update(experienceId, data);
    return { message: "Experience updated successfully" };
  }
}
