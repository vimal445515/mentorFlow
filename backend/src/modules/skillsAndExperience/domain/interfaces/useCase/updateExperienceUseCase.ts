import type { UpdateExperienceDto } from "../../../application/dto/ExperienceDto.ts";

export interface IUpdateExperienceUseCase {
  execute(
    mentorId: string,
    experienceId: string,
    data: UpdateExperienceDto,
  ): Promise<{ message: string }>;
}
