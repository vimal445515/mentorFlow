import type {
  MentorDetailsResponseDto,
  MentorResponseDto,
  UserResponseDto,
} from "../dto/UserResponseDto.ts";
import type { ManagedMentor } from "../../domain/entities/ManagedMentor.ts";
import type { ManagedUser } from "../../domain/entities/ManagedUser.ts";
import type { MentorDetails } from "../../domain/entities/MentorDetails.ts";

export class UserMapper {
  static toUserDto(user: ManagedUser): UserResponseDto {
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

  static toMentorDto(mentor: ManagedMentor): MentorResponseDto {
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

  static toMentorDetailsDto(details: MentorDetails): MentorDetailsResponseDto {
    return {
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
      latestExperience: details.latestExperience,
      bio: details.bio,
      followerCount: details.followerCount,
      averageRating: details.averageRating,
      timezone: details.timezone,
      approvedAt: details.approvedAt,
      skills: details.skills.map((skill) => ({
        skillId: skill.skillId,
        skillName: skill.skillName,
        subtopics: skill.subtopics,
        proficiencyLevel: skill.proficiencyLevel,
      })),
      experiences: details.experiences.map((experience) => ({
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
}
