import type { AddExperienceDto } from "../../../application/dto/ExperienceDto.ts";

export interface IAddExperienceUseCase {
  execute(
    mentorId: string,
    data: AddExperienceDto,
  ): Promise<{ message: string }>;
}
