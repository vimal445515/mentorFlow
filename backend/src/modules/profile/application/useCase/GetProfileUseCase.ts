import type { IGetProfileUseCase } from "../../domain/interfaces/userCase/IGetProfileUseCase.ts";
import type { IProfileRepository } from "../../domain/repositories/IProfileRepository.ts";
import type { ProfileResponseDto } from "../dto/ProfileResponseDto.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { ProfileMapper } from "../mappers/ProfileMapper.ts";

export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(userId: string): Promise<ProfileResponseDto> {
    const user = await this.profileRepository.findUserProfileById(userId);

    if (!user) {
      throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
    }

    if (user.role === "STUDENT") {
      let studentProfile = user.studentProfile;
      if (!studentProfile) {
        studentProfile =
          await this.profileRepository.createDefaultStudentProfile(user.id);
      }

      return ProfileMapper.toStudentDto(user, studentProfile);
    }

    if (user.role === "MENTOR") {
      let mentorProfile = user.mentorProfile;
      if (!mentorProfile) {
        mentorProfile = await this.profileRepository.createDefaultMentorProfile(
          user.id,
        );
      }

      return ProfileMapper.toMentorDto(user, mentorProfile);
    }

    return ProfileMapper.toGenericDto(user);
  }
}
