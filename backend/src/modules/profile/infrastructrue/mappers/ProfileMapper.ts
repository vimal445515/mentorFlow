import { UserProfile } from "../../domain/entities/UserProfile.ts";
import { StudentProfile } from "../../domain/entities/StudentProfile.ts";
import { MentorProfile } from "../../domain/entities/MentorProfile.ts";

export class ProfileMapper {
  static toDomain(rawUser: any): UserProfile {
    const studentProfile = rawUser.studentProfile
      ? new StudentProfile({
          studentId: rawUser.studentProfile.studentId,
          timezone: rawUser.studentProfile.timezone,
          currentGoal: rawUser.studentProfile.currentGoal,
          bio: rawUser.studentProfile.bio,
          followingCount: rawUser.studentProfile.followingCount,
          joinedAt: rawUser.studentProfile.joinedAt,
        })
      : null;

    const mentorProfile = rawUser.mentorProfile
      ? new MentorProfile({
          mentorId: rawUser.mentorProfile.mentorId,
          headline: rawUser.mentorProfile.headline,
          bio: rawUser.mentorProfile.bio,
          sessionPrice: rawUser.mentorProfile.sessionPrice,
          yearsExperience: rawUser.mentorProfile.yearsExperience,
          verificationStatus: rawUser.mentorProfile.verificationStatus,
          followerCount: rawUser.mentorProfile.followerCount,
          averageRating: rawUser.mentorProfile.averageRating,
          teachingSubjects:rawUser.mentorProfile.teachingSubjects,
          timezone: rawUser.mentorProfile.timezone,
          approvedAt: rawUser.mentorProfile.approvedAt,
        })
      : null;

    return new UserProfile({
      id: rawUser.id,
      fullName: rawUser.fullName,
      email: rawUser.email,
      role: rawUser.role,
      profileImageUrl: rawUser.profileImageUrl,
      status: rawUser.status,
      studentProfile,
      mentorProfile,
    });
  }
}
