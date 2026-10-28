import type { Experience } from "../../entities/Experience.ts";

export interface IGetExperiencesUseCase {
  execute(mentorId: string): Promise<Experience[]>;
}
