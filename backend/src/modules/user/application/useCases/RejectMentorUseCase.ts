import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import type { IUserManagementRepository } from "../../domain/repositories/IUserManagementRepository.ts";
import type { IWriteAuditLogUseCase } from "../../../audit-log/domain/interfaces/useCase/IWriteAuditLogUseCase.ts";
import { AuditAction } from "../../../audit-log/domain/entities/AuditLog.ts";
import type { IRejectMentorUseCase } from "../../domain/interfaces/useCase/IRejectMentorUseCase.ts";
import type { MentorResponseDto } from "../dto/UserResponseDto.ts";
import { UserMapper } from "../../infrastructure/mappers/UserMapper.ts";

export class RejectMentorUseCase implements IRejectMentorUseCase {
  constructor(
    private readonly userRepository: IUserManagementRepository,
    private readonly writeAuditLogUseCase: IWriteAuditLogUseCase,
  ) {}

  async execute(mentorId: string, actorId: string): Promise<MentorResponseDto> {
    const mentor = await this.userRepository.findMentorById(mentorId);
    if (!mentor) {
      throw new AppError("Mentor profile not found.", HttpStatusCode.NOT_FOUND);
    }
    if (
      mentor.verificationStatus !== "PENDING_APPROVAL" &&
      mentor.verificationStatus !== "APPROVED"
    ) {
      throw new AppError(
        "Only pending or approved mentor verification can be rejected.",
        HttpStatusCode.CONFLICT,
      );
    }

    const rejectedMentor = await this.userRepository.rejectMentor(mentorId);
    if (!rejectedMentor) {
      throw new AppError(
        "The mentor verification status changed before it could be rejected.",
        HttpStatusCode.CONFLICT,
      );
    }
    await this.writeAuditLogUseCase.execute({
      actorId,
      action: AuditAction.USER_UPDATED,
      description: "Admin rejected or revoked the mentor's verification.",
      resourceType: "MENTOR_PROFILE",
      resourceId: mentorId,
      metadata: { updatedFields: ["verificationStatus"], verificationStatus: "ACTIVE" },
    });
    return UserMapper.mentorToResponseDto(rejectedMentor);
  }
}
