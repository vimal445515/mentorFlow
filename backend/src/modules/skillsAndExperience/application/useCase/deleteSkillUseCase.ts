import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { UserRole } from "../../../auth/domain/enums/UserRole.ts";
import type { IUserRepository } from "../../../auth/domain/repositories/IUserRepository.ts";
import type { IDeleteSkillUseCase } from "../../domain/interfaces/useCase/deleteSkillUseCase.ts";
import type { ISkillsRepository } from "../../domain/repositories/ISkillsRepository.ts";

export class DeleteSkillUseCase implements IDeleteSkillUseCase {
  constructor(
    private readonly skillsRepository: ISkillsRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    mentorId: string,
    skillId: string,
  ): Promise<{ message: string }> {
    const mentor = await this.userRepository.findById(mentorId);
    if (!mentor) {
      throw new AppError("Mentor not found", HttpStatusCode.NOT_FOUND);
    }
    if (mentor.role !== UserRole.MENTOR) {
      throw new AppError("Only mentors can delete skills", HttpStatusCode.FORBIDDEN);
    }

    const skill = await this.skillsRepository.findById(skillId);
    if (!skill || skill.mentorId !== mentorId) {
      throw new AppError("Skill not found", HttpStatusCode.NOT_FOUND);
    }

    await this.skillsRepository.delete(skillId);
    return { message: "Skill deleted successfully" };
  }
}
