import type { CreateChannelDto } from "../../../application/dto/CreateChannelDto.ts";
import type { ChannelResponseDto } from "../../../application/dto/ChannelResponseDto.ts";

export interface ICreateChannelUseCase {
  execute(mentorId: string, dto: CreateChannelDto): Promise<ChannelResponseDto>;
}
