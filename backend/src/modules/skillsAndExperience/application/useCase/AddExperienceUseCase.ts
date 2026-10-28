import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { UserRole } from "../../../auth/domain/enums/UserRole.ts";
import type { IUserRepository } from "../../../auth/domain/repositories/IUserRepository.ts";
import { Experience } from "../../domain/entities/Experience.ts";
import type { IAddExperienceUseCase } from "../../domain/interfaces/useCase/addExperienceUseCase.ts";
import type { IExperienceRepository } from "../../domain/repositories/IExperienceRepository.ts";
import type { AddExperienceDto } from "../dto/ExperienceDto.ts";

export class AddExperienceUseCase implements IAddExperienceUseCase {
  constructor(
    private readonly experienceRepository: IExperienceRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    mentorId: string,
    data: AddExperienceDto,
  ): Promise<{ message: string }> {
    const mentor = await this.userRepository.findById(mentorId);
    if (!mentor) {
      throw new AppError("Mentor not found", HttpStatusCode.NOT_FOUND);
    }
    if (mentor.role !== UserRole.MENTOR) {
      throw new AppError("Only mentors can add experience", HttpStatusCode.FORBIDDEN);
    }

    await this.experienceRepository.create(
      new Experience({ ...data, mentorId }),
    );
    return { message: "Experience created successfully" };
  }
}
