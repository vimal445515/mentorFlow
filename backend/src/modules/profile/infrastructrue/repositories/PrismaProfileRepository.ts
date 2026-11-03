import { injectable } from "inversify";
import { prisma } from "../../../../config/database.ts";
import type { IProfileRepository } from "../../domain/repositories/IProfileRepository.ts";
import { UserProfile } from "../../domain/entities/UserProfile.ts";
import { StudentProfile } from "../../domain/entities/StudentProfile.ts";
import { MentorProfile } from "../../domain/entities/MentorProfile.ts";
import { ProfileMapper } from "../mappers/ProfileMapper.ts";

@injectable()
export class PrismaProfileRepository implements IProfileRepository {
  async findUserProfileById(userId: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        mentorProfile: true,
      },
    });

    return user ? ProfileMapper.toDomain(user) : null;
  }

  async createDefaultStudentProfile(userId: string): Promise<StudentProfile> {
    const record = await prisma.studentProfile.create({
      data: {
        studentId: userId,
        currentGoal: "",
        bio: "",
        timezone: "UTC",
      },
    });

    return new StudentProfile({
      studentId: record.studentId,
      currentGoal: record.currentGoal,
      bio: record.bio,
      timezone: record.timezone,
      followingCount: record.followingCount,
      joinedAt: record.joinedAt,
    });
  }

  async createDefaultMentorProfile(userId: string): Promise<MentorProfile> {
    const record = await prisma.mentorProfile.create({
      data: {
        mentorId: userId,
        headline: "",
        sessionPrice: 0,
        bio: "",
        timezone: "",
        yearsExperience: 0,
      },
    });

    return new MentorProfile({
      mentorId: record.mentorId,
      headline: record.headline,
      sessionPrice: record.sessionPrice.toNumber(),
      bio: record.bio,
      timezone: record.timezone,
      yearsExperience: record.yearsExperience,
      verificationStatus: record.verificationStatus,
      followerCount: record.followerCount,
      teachingSubjects:record.teachingSubjects||undefined,
      averageRating: record.averageRating.toNumber(),
      approvedAt: record.approvedAt,
    });
  }

  async updateUserBasicInfo(
    userId: string,
    data: { fullName?: string; profileImageUrl?: string },
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async upsertStudentProfile(
    studentId: string,
    data: { currentGoal?: string; bio?: string; timezone?: string },
  ): Promise<void> {
    await prisma.studentProfile.upsert({
      where: { studentId },
      create: {
        studentId,
        currentGoal: data.currentGoal,
        bio: data.bio,
        timezone: data.timezone,
      },
      update: {
        ...(data.currentGoal !== undefined && {
          currentGoal: data.currentGoal,
        }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.timezone !== undefined && { timezone: data.timezone }),
      },
    });
  }

  async upsertMentorProfile(
    mentorId: string,
    data: {
      headline?: string;
      bio?: string;
      sessionPrice?: number;
      teachingSubjects?: string;
    },
  ): Promise<void> {
    console.log(data.teachingSubjects)
    await prisma.mentorProfile.upsert({
      where: { mentorId },
      create: {
        headline: data.headline,
        bio: data.bio,
        sessionPrice: Number(data.sessionPrice),
        teachingSubjects: data.teachingSubjects,
        user: {
          connect: { id: mentorId },
        },
      } as any,
      update: {
        ...(data.headline !== undefined && { headline: data.headline }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.sessionPrice !== undefined && {
          sessionPrice: Number(data.sessionPrice),
        }),
        ...(data.teachingSubjects !== undefined && {teachingSubjects:data.teachingSubjects}),
      },
    });
  }

  async requestMentorVerification(mentorId: string): Promise<boolean> {
    const result = await prisma.mentorProfile.updateMany({
      where: {
        mentorId,
        verificationStatus: "ACTIVE",
        user: { role: "MENTOR" },
      },
      data: {
        verificationStatus: "PENDING_APPROVAL",
        approvedAt: null,
      },
    });

    return result.count > 0;
  }
}
