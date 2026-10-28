import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import type { IUserManagementRepository } from "../../domain/repositories/IUserManagementRepository.ts";
import type { IGetMentorDetailsUseCase } from "../../domain/interfaces/useCase/IGetMentorDetailsUseCase.ts";
import type { MentorDetailsResponseDto } from "../dto/UserResponseDto.ts";
import { UserMapper } from "../../infrastructure/mappers/UserMapper.ts";

export class GetMentorDetailsUseCase implements IGetMentorDetailsUseCase {
  constructor(private readonly userRepository: IUserManagementRepository) {}

  async execute(mentorId: string): Promise<MentorDetailsResponseDto> {
    const mentor = await this.userRepository.findMentorById(mentorId);
    if (!mentor) {
      throw new AppError("Mentor not found.", HttpStatusCode.NOT_FOUND);
    }
    return UserMapper.mentorDetailsToResponseDto(mentor);
  }
}
