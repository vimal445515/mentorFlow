import {
  EmploymentTypes as PrismaEmploymentTypes,
  WorkPlaceTypes as PrismaWorkPlaceTypes,
  type Prisma,
  type mentorExperience as PrismaExperience,
} from "@prisma/client";
import { Experience } from "../../domain/entities/Experience.ts";
import { EmploymentTypes, WorkPlaceTypes } from "../../domain/enums/experience.ts";

export class ExperienceMapper {
  static toDb(
    experience: Experience,
  ): Prisma.mentorExperienceUncheckedCreateInput {
    return {
      mentorId: experience.mentorId,
      title: experience.title,
      company: experience.company ?? null,
      employmentType:
        experience.employmentType as PrismaEmploymentTypes,
      workPlaceType: experience.workPlaceType as PrismaWorkPlaceTypes,
      location: experience.location ?? null,
      startDate: experience.startDate,
      endDate: experience.endDate ?? null,
      isCurrent: experience.isCurrent ?? false,
      description: experience.description ?? null,
    };
  }

  static toUpdateDb(
    experience: Partial<Experience>,
  ): Prisma.mentorExperienceUncheckedUpdateInput {
    return {
      ...(experience.title !== undefined && { title: experience.title }),
      ...(experience.company !== undefined && {
        company: experience.company,
      }),
      ...(experience.employmentType !== undefined && {
        employmentType: experience.employmentType as PrismaEmploymentTypes,
      }),
      ...(experience.workPlaceType !== undefined && {
        workPlaceType: experience.workPlaceType as PrismaWorkPlaceTypes,
      }),
      ...(experience.location !== undefined && {
        location: experience.location,
      }),
      ...(experience.startDate !== undefined && {
        startDate: experience.startDate,
      }),
      ...(experience.endDate !== undefined && {
        endDate: experience.endDate,
      }),
      ...(experience.isCurrent !== undefined && {
        isCurrent: experience.isCurrent,
      }),
      ...(experience.description !== undefined && {
        description: experience.description,
      }),
    };
  }

  static fromDb(prismaExperience: PrismaExperience): Experience {
    return new Experience({
      experienceId: prismaExperience.experienceId,
      mentorId: prismaExperience.mentorId,
      title: prismaExperience.title,
      company: prismaExperience.company,
      employmentType:
        prismaExperience.employmentType as EmploymentTypes,
      workPlaceType: prismaExperience.workPlaceType as WorkPlaceTypes,
      location: prismaExperience.location,
      startDate: prismaExperience.startDate,
      endDate: prismaExperience.endDate,
      isCurrent: prismaExperience.isCurrent,
      description: prismaExperience.description,
    });
  }

}
