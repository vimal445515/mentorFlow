import type { MentorResponseDto } from "../../../application/dto/UserResponseDto.ts";

export interface IApproveMentorUseCase {
  execute(mentorId: string, actorId: string): Promise<MentorResponseDto>;
}
