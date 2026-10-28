import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import type { ProfileResponseDto } from "../dto/ProfileResponseDto.ts";
import type { IGetProfileUseCase } from "../../domain/interfaces/userCase/IGetProfileUseCase.ts";
import type { IProfileRepository } from "../../domain/repositories/IProfileRepository.ts";
import type { IWriteAuditLogUseCase } from "../../../audit-log/domain/interfaces/useCase/IWriteAuditLogUseCase.ts";
import { AuditAction } from "../../../audit-log/domain/entities/AuditLog.ts";

export class RequestMentorApprovalUseCase {
  constructor(
    private readonly profileRepository: IProfileRepository,
    private readonly getProfileUseCase: IGetProfileUseCase,
    private readonly writeAuditLogUseCase: IWriteAuditLogUseCase,
  ) {}

  async execute(userId: string): Promise<ProfileResponseDto> {
    const user = await this.profileRepository.findUserProfileById(userId);
    if (!user) {
      throw new AppError("User not found.", HttpStatusCode.NOT_FOUND);
    }
    if (user.role !== "MENTOR") {
      throw new AppError(
        "Only mentors can request profile verification.",
        HttpStatusCode.FORBIDDEN,
      );
    }

    const mentorProfile =
      user.mentorProfile ??
      (await this.profileRepository.createDefaultMentorProfile(userId));
    if (mentorProfile.verificationStatus !== "ACTIVE") {
      throw new AppError(
        "Only active mentor profiles can request verification.",
        HttpStatusCode.CONFLICT,
      );
    }

    const updated = await this.profileRepository.requestMentorVerification(userId);
    if (!updated) {
      throw new AppError(
        "The mentor profile status changed before the request could be submitted.",
        HttpStatusCode.CONFLICT,
      );
    }

    await this.writeAuditLogUseCase.execute({
      actorId: userId,
      action: AuditAction.USER_UPDATED,
      description: "Mentor submitted a verification request.",
      resourceType: "MENTOR_PROFILE",
      resourceId: userId,
      metadata: { updatedFields: ["verificationStatus"], verificationStatus: "PENDING_APPROVAL" },
    });

    return this.getProfileUseCase.execute(userId);
  }
}
