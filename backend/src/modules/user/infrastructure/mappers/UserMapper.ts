import type { Prisma } from "@prisma/client";
import { ManagedUser } from "../../domain/entities/ManagedUser.ts";
import { ManagedMentor } from "../../domain/entities/ManagedMentor.ts";
import {
  MentorDetails,
  MentorExperienceDetail,
  MentorSkillDetail,
} from "../../domain/entities/MentorDetails.ts";
import type {
  MentorDetailsResponseDto,
  MentorExperienceResponseDto,
  MentorResponseDto,
  MentorSkillResponseDto,
  UserResponseDto,
} from "../../application/dto/UserResponseDto.ts";
import type { UserRole } from "../../domain/enums/UserRole.ts";
import type { UserStatus } from "../../domain/enums/UserStatus.ts";
import type { EmploymentType } from "../../domain/enums/EmploymentType.ts";
import type { WorkPlaceType } from "../../domain/enums/WorkPlaceType.ts";
import type { ProficiencyLevel } from "../../domain/enums/ProficiencyLevel.ts";

export const userSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  profileImageUrl: true,
} satisfies Prisma.UserSelect;

export const mentorListSelect = {
  ...userSelect,
  mentorProfile: {
    select: {
      headline: true,
      sessionPrice: true,
      yearsExperience: true,
      teachingSubjects: true,
      verificationStatus: true,
    },
  },
} satisfies Prisma.UserSelect;

export const mentorDetailsSelect = {
  ...userSelect,
  mentorProfile: {
    select: {
      headline: true,
      bio: true,
      sessionPrice: true,
      yearsExperience: true,
      verificationStatus: true,
      followerCount: true,
      averageRating: true,
      timezone: true,
      approvedAt: true,
      teachingSubjects: true,
    },
  },
} satisfies Prisma.UserSelect;

export type UserRecord = Prisma.UserGetPayload<{ select: typeof userSelect }>;
export type MentorListRecord = Prisma.UserGetPayload<{ select: typeof mentorListSelect }>;
export type MentorDetailsRecord = Prisma.UserGetPayload<{ select: typeof mentorDetailsSelect }>;
export type MentorSkillRecord = {
  skillId: string;
  skillName: string;
  subtopics: string | null;
  proficiencyLevel: string;
};
export type MentorExperienceRecord = {
  experienceId: string;
  title: string;
  company: string | null;
  employmentType: string;
  workPlaceType: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string | null;
};
export type MentorSummaryExperienceRecord = Pick<MentorExperienceRecord, "title" | "company">;

export class UserMapper {
  static fromDb(record: UserRecord): ManagedUser {
    return new ManagedUser({
      id: record.id,
      fullName: record.fullName,
      email: record.email,
      role: record.role as UserRole,
      status: record.status as UserStatus,
      createdAt: record.createdAt,
      profileImageUrl: record.profileImageUrl,
    });
  }

  static toResponseDto(user: ManagedUser): UserResponseDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      profileImageUrl: user.profileImageUrl,
    };
  }

  static mentorFromDb(
    record: MentorListRecord,
    skills: string[],
    latestExperience: MentorSummaryExperienceRecord | null,
  ): ManagedMentor {
    return new ManagedMentor({
      id: record.id,
      fullName: record.fullName,
      email: record.email,
      profileImageUrl: record.profileImageUrl,
      status: record.status as UserStatus,
      createdAt: record.createdAt,
      headline: record.mentorProfile?.headline ?? null,
      sessionPrice: record.mentorProfile?.sessionPrice.toNumber() ?? 0,
      yearsExperience: record.mentorProfile?.yearsExperience ?? 0,
      teachingSubjects: record.mentorProfile?.teachingSubjects ?? null,
      verificationStatus: record.mentorProfile?.verificationStatus as UserStatus
        ?? "PENDING_APPROVAL",
      skills,
      latestExperience: this.formatExperience(latestExperience),
    });
  }

  static mentorToResponseDto(mentor: ManagedMentor): MentorResponseDto {
    return {
      id: mentor.id,
      fullName: mentor.fullName,
      email: mentor.email,
      profileImageUrl: mentor.profileImageUrl,
      status: mentor.status,
      createdAt: mentor.createdAt,
      headline: mentor.headline,
      sessionPrice: mentor.sessionPrice,
      yearsExperience: mentor.yearsExperience,
      teachingSubjects: mentor.teachingSubjects,
      verificationStatus: mentor.verificationStatus,
      skills: mentor.skills,
      latestExperience: mentor.latestExperience,
    };
  }

  static mentorDetailsFromDb(
    record: MentorDetailsRecord,
    skills: MentorSkillRecord[],
    experiences: MentorExperienceRecord[],
  ): MentorDetails {
    const mentorProfile = record.mentorProfile;
    return new MentorDetails({
      id: record.id,
      fullName: record.fullName,
      email: record.email,
      profileImageUrl: record.profileImageUrl,
      status: record.status as UserStatus,
      createdAt: record.createdAt,
      headline: mentorProfile?.headline ?? null,
      bio: mentorProfile?.bio ?? null,
      sessionPrice: mentorProfile?.sessionPrice.toNumber() ?? 0,
      yearsExperience: mentorProfile?.yearsExperience ?? 0,
      verificationStatus: (mentorProfile?.verificationStatus as UserStatus | undefined)
        ?? "PENDING_APPROVAL",
      followerCount: mentorProfile?.followerCount ?? 0,
      averageRating: mentorProfile?.averageRating.toNumber() ?? 0,
      timezone: mentorProfile?.timezone ?? null,
      approvedAt: mentorProfile?.approvedAt ?? null,
      teachingSubjects: mentorProfile?.teachingSubjects ?? null,
      skills: skills.map((skill) => new MentorSkillDetail({
        skillId: skill.skillId,
        skillName: skill.skillName,
        subtopics: skill.subtopics,
        proficiencyLevel: skill.proficiencyLevel as ProficiencyLevel,
      })),
      experiences: experiences.map((experience) => new MentorExperienceDetail({
        experienceId: experience.experienceId,
        title: experience.title,
        company: experience.company,
        employmentType: experience.employmentType as EmploymentType,
        workPlaceType: experience.workPlaceType as WorkPlaceType,
        location: experience.location,
        startDate: experience.startDate,
        endDate: experience.endDate,
        isCurrent: experience.isCurrent,
        description: experience.description,
      })),
      latestExperience: this.formatExperience(experiences[0] ?? null),
    });
  }

  static mentorDetailsToListDomain(details: MentorDetails): ManagedMentor {
    return new ManagedMentor({
      id: details.id,
      fullName: details.fullName,
      email: details.email,
      profileImageUrl: details.profileImageUrl,
      status: details.status,
      createdAt: details.createdAt,
      headline: details.headline,
      sessionPrice: details.sessionPrice,
      yearsExperience: details.yearsExperience,
      teachingSubjects: details.teachingSubjects,
      verificationStatus: details.verificationStatus,
      skills: details.skills.map((skill) => skill.skillName),
      latestExperience: details.latestExperience,
    });
  }

  static mentorDetailsToResponseDto(details: MentorDetails): MentorDetailsResponseDto {
    return {
      ...this.mentorDetailsToListDomain(details),
      bio: details.bio,
      followerCount: details.followerCount,
      averageRating: details.averageRating,
      timezone: details.timezone,
      approvedAt: details.approvedAt,
      skills: details.skills.map((skill): MentorSkillResponseDto => ({
        skillId: skill.skillId,
        skillName: skill.skillName,
        subtopics: skill.subtopics,
        proficiencyLevel: skill.proficiencyLevel,
      })),
      experiences: details.experiences.map((experience): MentorExperienceResponseDto => ({
        experienceId: experience.experienceId,
        title: experience.title,
        company: experience.company,
        employmentType: experience.employmentType,
        workPlaceType: experience.workPlaceType,
        location: experience.location,
        startDate: experience.startDate,
        endDate: experience.endDate,
        isCurrent: experience.isCurrent,
        description: experience.description,
      })),
    };
  }

  static groupSkills(records: Array<{ mentorId: string; skillName: string }>): Map<string, string[]> {
    const grouped = new Map<string, string[]>();
    for (const record of records) {
      const skills = grouped.get(record.mentorId) ?? [];
      skills.push(record.skillName);
      grouped.set(record.mentorId, skills);
    }
    return grouped;
  }

  static latestExperienceByMentor(
    records: Array<{ mentorId: string; title: string; company: string | null }>,
  ): Map<string, MentorSummaryExperienceRecord> {
    const grouped = new Map<string, MentorSummaryExperienceRecord>();
    for (const record of records) {
      if (!grouped.has(record.mentorId)) {
        grouped.set(record.mentorId, { title: record.title, company: record.company });
      }
    }
    return grouped;
  }

  private static formatExperience(
    experience: MentorSummaryExperienceRecord | null,
  ): string | null {
    if (!experience) {
      return null;
    }
    return [experience.title, experience.company].filter(Boolean).join(" at ");
  }
}
