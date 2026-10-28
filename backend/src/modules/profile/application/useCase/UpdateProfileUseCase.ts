import type { IUpdateProfileUseCase } from "../../domain/interfaces/userCase/IUpdateProfileUseCase.ts";
import type { IProfileRepository } from "../../domain/repositories/IProfileRepository.ts";
import type { IGetProfileUseCase } from "../../domain/interfaces/userCase/IGetProfileUseCase.ts";
import type { UpdateProfileDto } from "../dto/UpdateProfileDto.ts";
import type { ProfileResponseDto } from "../dto/ProfileResponseDto.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import type { IWriteAuditLogUseCase } from "../../../audit-log/domain/interfaces/useCase/IWriteAuditLogUseCase.ts";
import { AuditAction } from "../../../audit-log/domain/entities/AuditLog.ts";

export class UpdateProfileUseCase implements IUpdateProfileUseCase {
  constructor(
    private readonly profileRepository: IProfileRepository,
    private readonly getProfileUseCase: IGetProfileUseCase,
    private readonly writeAuditLogUseCase: IWriteAuditLogUseCase,
  ) {}

  async execute(userId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const user = await this.profileRepository.findUserProfileById(userId);

    if (!user) {
      throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
    }

    // 1. Update basic user details (email is strictly excluded from updates)
    const userUpdate: { fullName?: string; profileImageUrl?: string } = {};
    if (dto.fullName && typeof dto.fullName === "string" && dto.fullName.trim()) {
      userUpdate.fullName = dto.fullName.trim();
    }
    if (dto.profileImageUrl !== undefined) {
      userUpdate.profileImageUrl = dto.profileImageUrl;
    }

    if (Object.keys(userUpdate).length > 0) {
      await this.profileRepository.updateUserBasicInfo(userId, userUpdate);
    }

    // 2. Update role-specific profile details
    if (user.role === "STUDENT") {
      await this.profileRepository.upsertStudentProfile(userId, {
        currentGoal: dto.currentGoal ||user.studentProfile?.currentGoal,
        bio: dto.bio ||user.studentProfile?.bio,
        timezone: dto.timezone||user.studentProfile?.timezone,
      });
    } else if (user.role === "MENTOR") {
      await this.profileRepository.upsertMentorProfile(userId, {
        headline: dto.headline || user.mentorProfile?.headline,
        bio: dto.bio || user.mentorProfile?.bio,
        sessionPrice: dto.sessionPrice !== undefined ? Number(dto.sessionPrice) : user.mentorProfile?.sessionPrice,
        teachingSubjects: dto.teachingSubjects ,
      });
    }

    const profileFields: (keyof UpdateProfileDto)[] = [
      "fullName",
      "profileImageUrl",
      "currentGoal",
      "bio",
      "headline",
      "sessionPrice",
      "teachingSubjects",
      "timezone",
    ];
    const updatedFields = profileFields.filter(
      (field) => dto[field] !== undefined,
    );
    if (updatedFields.length > 0) {
      await this.writeAuditLogUseCase.execute({
        actorId: userId,
        action: AuditAction.USER_UPDATED,
        description: `User updated profile fields: ${updatedFields.join(", ")}.`,
        resourceType: "USER",
        resourceId: userId,
        metadata: { updatedFields },
      });
    }

    // 3. Return the refreshed profile payload
    return this.getProfileUseCase.execute(userId);
  }
}
