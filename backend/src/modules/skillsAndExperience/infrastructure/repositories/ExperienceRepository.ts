import { injectable } from "inversify";
import type { Prisma, mentorExperience } from "@prisma/client";
import { Experience } from "../../domain/entities/Experience.ts";
import type { IExperienceRepository } from "../../domain/repositories/IExperienceRepository.ts";
import { calculateYearsExperience } from "../../domain/utils/calculateYearsExperience.ts";
import { ExperienceMapper } from "../mappers/ExperienceMapper.ts";
import { prisma } from "../persistence/prisma.ts";
import { BaseRepository } from "../../../../shared/base/repositories/baseRepository.ts";

@injectable()
export class PrismaExperienceRepository
  extends BaseRepository<
    Experience,
    mentorExperience,
    Prisma.mentorExperienceUncheckedCreateInput,
    Prisma.mentorExperienceUncheckedUpdateInput
  >
  implements IExperienceRepository {
  constructor() {
    super(prisma.mentorExperience, ExperienceMapper, "experienceId");
  }

  override async create(data: Experience): Promise<Experience> {
    const createdExperience = await prisma.$transaction(async (transaction) => {
      const created = await transaction.mentorExperience.create({
        data: ExperienceMapper.toDb(data),
      });
      await this.updateMentorYearsExperience(transaction, data.mentorId);
      return created;
    });
    return ExperienceMapper.fromDb(createdExperience);
  }

  override async update(id: string, data: Partial<Experience>): Promise<Experience> {
    const updatedExperience = await prisma.$transaction(async (transaction) => {
      const updated = await transaction.mentorExperience.update({
        where: { experienceId: id },
        data: ExperienceMapper.toUpdateDb(data),
      });
      await this.updateMentorYearsExperience(transaction, updated.mentorId);
      return updated;
    });
    return ExperienceMapper.fromDb(updatedExperience);
  }

  override async delete(id: string): Promise<void> {
    await prisma.$transaction(async (transaction) => {
      const deleted = await transaction.mentorExperience.delete({
        where: { experienceId: id },
        select: { mentorId: true },
      });
      await this.updateMentorYearsExperience(transaction, deleted.mentorId);
    });
  }

  async findByMentorId(mentorId: string): Promise<Experience[]> {
    const experiences: mentorExperience[] =
      await prisma.mentorExperience.findMany({
        where: { mentorId },
        orderBy: { startDate: "desc" },
      });
    return experiences.map(ExperienceMapper.fromDb);
  }

  private async updateMentorYearsExperience(
    transaction: Prisma.TransactionClient,
    mentorId: string,
  ): Promise<void> {
    // Lock the profile row before reading ranges so concurrent edits cannot overwrite totals.
    await transaction.mentorProfile.upsert({
      where: { mentorId },
      create: { mentorId, yearsExperience: 0 },
      update: { yearsExperience: { increment: 0 } },
    });

    const experiences = await transaction.mentorExperience.findMany({
      where: { mentorId },
      select: { startDate: true, endDate: true, isCurrent: true },
    });
    const yearsExperience = calculateYearsExperience(experiences);

    await transaction.mentorProfile.update({
      where: { mentorId },
      data: { yearsExperience },
    });
  }
}
