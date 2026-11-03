import type { UserProfile } from "../../domain/entities/UserProfile.ts";
import type { StudentProfile } from "../../domain/entities/StudentProfile.ts";
import type { MentorProfile } from "../../domain/entities/MentorProfile.ts";
import type {
  GenericProfileResponseDto,
  MentorProfileResponseDto,
  StudentProfileResponseDto,
} from "../dto/ProfileResponseDto.ts";

export class ProfileMapper {
  static toStudentDto(
    user: UserProfile,
    profile: StudentProfile,
  ): StudentProfileResponseDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl || "",
      status: user.status,
      currentGoal: profile.currentGoal || "",
      bio: profile.bio || "",
      timezone: profile.timezone || "UTC",
      roadmapProgress: 0,
      sessionsCompleted: 0,
      milestoneApprovals: 0,
      badgesEarned: 0,
      notificationsEnabled: true,
      subscription: {
        status: "ACTIVE",
        planName: "Premium Plan (₹199 / month)",
        renewalDate: "Oct 24, 2026",
        billingCycle: "Monthly Auto-Debit (UPI)",
        aiLimits: "Expanded AI Usage",
        aiAssistant: "Enabled (RAG Grounded)",
      },
    };
  }

  static toMentorDto(
    user: UserProfile,
    profile: MentorProfile,
  ): MentorProfileResponseDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl || "",
      status: user.status,
      headline: profile.headline || "",
      sessionPrice: Number(profile.sessionPrice) || 0,
      teachingSubjects: profile.teachingSubjects || "",
      bio: profile.bio || "",
      yearsExperience: profile.yearsExperience || 0,
      verificationStatus: profile.verificationStatus || "",
      followerCount: profile.followerCount || 0,
      averageRating: Number(profile.averageRating) || 0,
    };
  }

  static toGenericDto(user: UserProfile): GenericProfileResponseDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl || "",
      status: user.status,
    };
  }
}
