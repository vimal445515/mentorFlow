import type { IBaseRepository } from "../../../../shared/base/repositories/IBaseRepository.ts";
import type { Experience } from "../entities/Experience.ts";

export interface IExperienceRepository extends IBaseRepository<Experience> {
  findByMentorId(mentorId: string): Promise<Experience[]>;
}
