import type { IGetProfileUseCase } from "../../domain/interfaces/userCase/IGetProfileUseCase.ts";
import type { IProfileRepository } from "../../domain/repositories/IProfileRepository.ts";
import type { ProfileResponseDto } from "../dto/ProfileResponseDto.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";

export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(userId: string): Promise<ProfileResponseDto> {
    let user = await this.profileRepository.findUserProfileById(userId);

    if (!user) {
      throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
    }

    if (user.role === "STUDENT") {
      let studentProfile = user.studentProfile;
      if (!studentProfile) {
        studentProfile =
          await this.profileRepository.createDefaultStudentProfile(user.id);
      }

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl || "",
        status: user.status,
        currentGoal: studentProfile.currentGoal || "",
        bio: studentProfile.bio || "",
        timezone: studentProfile.timezone || "UTC",
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

    if (user.role === "MENTOR") {
      let mentorProfile = user.mentorProfile;
      if (!mentorProfile) {
        mentorProfile = await this.profileRepository.createDefaultMentorProfile(
          user.id,
        );
      }

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl || "",
        status: user.status,
        headline: mentorProfile.headline || "",
        sessionPrice: Number(mentorProfile.sessionPrice) || 0,
        teachingSubjects: mentorProfile.teachingSubjects || "",
        bio: mentorProfile.bio || "",
        yearsExperience: mentorProfile.yearsExperience || 0,
        verificationStatus: mentorProfile.verificationStatus || "",
        followerCount: mentorProfile.followerCount || 0,
        averageRating: Number(mentorProfile.averageRating) || 0,
      };
    }

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
