import type { MentorResponseDto } from "../../../application/dto/UserResponseDto.ts";

export interface IRejectMentorUseCase {
  execute(mentorId: string, actorId: string): Promise<MentorResponseDto>;
}
