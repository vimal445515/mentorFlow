import type { MentorDetailsResponseDto } from "../../../application/dto/UserResponseDto.ts";

export interface IGetMentorDetailsUseCase {
  execute(mentorId: string): Promise<MentorDetailsResponseDto>;
}
