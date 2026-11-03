import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import type { IUserManagementRepository } from "../../domain/repositories/IUserManagementRepository.ts";
import type { IWriteAuditLogUseCase } from "../../../audit-log/domain/interfaces/useCase/IWriteAuditLogUseCase.ts";
import { AuditAction } from "../../../audit-log/domain/entities/AuditLog.ts";
import type { IApproveMentorUseCase } from "../../domain/interfaces/useCase/IApproveMentorUseCase.ts";
import type { MentorResponseDto } from "../dto/UserResponseDto.ts";
import { UserMapper } from "../mappers/UserMapper.ts";

export class ApproveMentorUseCase implements IApproveMentorUseCase {
  constructor(
    private readonly userRepository: IUserManagementRepository,
    private readonly writeAuditLogUseCase: IWriteAuditLogUseCase,
  ) {}

  async execute(mentorId: string, actorId: string): Promise<MentorResponseDto> {
    const mentorDetails = await this.userRepository.findMentorById(mentorId);
    if (!mentorDetails) {
      throw new AppError("Mentor profile not found.", HttpStatusCode.NOT_FOUND);
    }
    if (mentorDetails.verificationStatus !== "PENDING_APPROVAL") {
      throw new AppError(
        "Only mentors with a pending profile request can be approved.",
        HttpStatusCode.CONFLICT,
      );
    }

    const mentor = await this.userRepository.approveMentor(mentorId);
    if (!mentor) {
      throw new AppError(
        "The mentor profile is no longer awaiting approval.",
        HttpStatusCode.CONFLICT,
      );
    }
    await this.writeAuditLogUseCase.execute({
      actorId,
      action: AuditAction.USER_UPDATED,
      description: "Admin approved the mentor's verification request.",
      resourceType: "MENTOR_PROFILE",
      resourceId: mentorId,
      metadata: { updatedFields: ["verificationStatus"], verificationStatus: "APPROVED" },
    });
    return UserMapper.toMentorDto(mentor);
  }
}
