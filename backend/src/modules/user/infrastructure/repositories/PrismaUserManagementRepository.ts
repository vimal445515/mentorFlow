import { injectable } from "inversify";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../../../config/database.ts";
import type { UserListFiltersDto } from "../../application/dto/UserListFiltersDto.ts";
import type { MentorListFiltersDto } from "../../application/dto/MentorListFiltersDto.ts";
import type { UserStatus } from "../../domain/enums/UserStatus.ts";
import type { ManagedMentor } from "../../domain/entities/ManagedMentor.ts";
import type { ManagedUser } from "../../domain/entities/ManagedUser.ts";
import type {
  IUserManagementRepository,
  PaginatedResult,
} from "../../domain/repositories/IUserManagementRepository.ts";
import { UserMapper, userSelect, mentorListSelect, mentorDetailsSelect } from "../mappers/UserMapper.ts";
import type { MentorDetails } from "../../domain/entities/MentorDetails.ts";

@injectable()
export class PrismaUserManagementRepository implements IUserManagementRepository {
  async findUsers(filters: UserListFiltersDto): Promise<PaginatedResult<ManagedUser>> {
    const where: Prisma.UserWhereInput = {
      role: { in: ["STUDENT", "MENTOR"] },
      ...(filters.role && { role: filters.role }),
      ...(filters.status && { status: filters.status }),
      ...(filters.search && {
        OR: [
          { fullName: { contains: filters.search, mode: "insensitive" } },
          { email: { contains: filters.search, mode: "insensitive" } },
          { id: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
      ...(filters.year && {
        createdAt: {
          gte: new Date(Date.UTC(filters.year, 0, 1)),
          lt: new Date(Date.UTC(filters.year + 1, 0, 1)),
        },
      }),
    };
    const skip = (filters.page - 1) * filters.limit;
    const [records, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: userSelect,
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        skip,
        take: filters.limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { items: records.map(UserMapper.fromDb), total };
  }

  async findMentors(filters: MentorListFiltersDto): Promise<PaginatedResult<ManagedMentor>> {
    const where: Prisma.UserWhereInput = {
      role: "MENTOR",
      mentorProfile: { isNot: null },
      ...(filters.status && { status: filters.status }),
      ...(filters.verificationStatus && {
        mentorProfile: { is: { verificationStatus: filters.verificationStatus } },
      }),
      ...(filters.search && {
        OR: [
          { fullName: { contains: filters.search, mode: "insensitive" } },
          { email: { contains: filters.search, mode: "insensitive" } },
          { id: { contains: filters.search, mode: "insensitive" } },
          { mentorProfile: { is: { headline: { contains: filters.search, mode: "insensitive" } } } },
          { mentorProfile: { is: { teachingSubjects: { contains: filters.search, mode: "insensitive" } } } },
        ],
      }),
    };
    const skip = (filters.page - 1) * filters.limit;
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: mentorListSelect,
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        skip,
        take: filters.limit,
      }),
      prisma.user.count({ where }),
    ]);

    if (users.length === 0) {
      return { items: [], total };
    }

    const mentorIds = users.map((user) => user.id);
    const [skills, experiences] = await Promise.all([
      prisma.mentorSkill.findMany({
        where: { mentorId: { in: mentorIds } },
        select: { mentorId: true, skillName: true },
        orderBy: { skillName: "asc" },
      }),
      prisma.mentorExperience.findMany({
        where: { mentorId: { in: mentorIds } },
        select: { mentorId: true, title: true, company: true },
        orderBy: { startDate: "desc" },
      }),
    ]);
    const skillsByMentor = UserMapper.groupSkills(skills);
    const latestExperienceByMentor = UserMapper.latestExperienceByMentor(experiences);

    return {
      items: users.map((user) =>
        UserMapper.mentorFromDb(
          user,
          skillsByMentor.get(user.id) ?? [],
          latestExperienceByMentor.get(user.id) ?? null,
        ),
      ),
      total,
    };
  }

  async findMentorById(mentorId: string) {
    const user = await prisma.user.findFirst({
      where: { id: mentorId, role: "MENTOR" },
      select: mentorDetailsSelect,
    });
    if (!user?.mentorProfile) {
      return null;
    }

    const [skills, experiences] = await Promise.all([
      prisma.mentorSkill.findMany({
        where: { mentorId },
        select: {
          skillId: true,
          skillName: true,
          subtopics: true,
          proficiencyLevel: true,
        },
        orderBy: { skillName: "asc" },
      }),
      prisma.mentorExperience.findMany({
        where: { mentorId },
        select: {
          experienceId: true,
          title: true,
          company: true,
          employmentType: true,
          workPlaceType: true,
          location: true,
          startDate: true,
          endDate: true,
          isCurrent: true,
          description: true,
        },
        orderBy: [{ startDate: "desc" }, { experienceId: "asc" }],
      }),
    ]);

    return UserMapper.mentorDetailsFromDb(user, skills, experiences);
  }

  async approveMentor(mentorId: string) {
    const result = await prisma.mentorProfile.updateMany({
      where: { mentorId, verificationStatus: "PENDING_APPROVAL", user: { role: "MENTOR" } },
      data: { verificationStatus: "APPROVED", approvedAt: new Date() },
    });
    return result.count > 0 ? this.getMentorSummary(mentorId) : null;
  }

  async rejectMentor(mentorId: string) {
    const result = await prisma.mentorProfile.updateMany({
      where: {
        mentorId,
        verificationStatus: { in: ["PENDING_APPROVAL", "APPROVED"] },
        user: { role: "MENTOR" },
      },
      data: { verificationStatus: "ACTIVE", approvedAt: null },
    });
    return result.count > 0 ? this.getMentorSummary(mentorId) : null;
  }

  async updateStatus(userId: string, status: Extract<UserStatus, "ACTIVE" | "SUSPENDED">) {
    const result = await prisma.user.updateMany({
      where: { id: userId, role: { in: ["STUDENT", "MENTOR"] } },
      data: { status },
    });
    if (result.count === 0) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });
    return user ? UserMapper.fromDb(user) : null;
  }

  private async getMentorSummary(mentorId: string) {
    const mentor = await this.findMentorById(mentorId);
    return mentor ? UserMapper.mentorDetailsToListDomain(mentor) : null;
  }

  
}
