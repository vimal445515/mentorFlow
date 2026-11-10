import type { ChannelListQueryDto } from "../../../application/dto/ChannelListQueryDto.ts";
import type { ChannelListResponseDto } from "../../../application/dto/ChannelListResponseDto.ts";

export interface IListChannelsUseCase {
  execute(
    mentorId: string,
    query: ChannelListQueryDto,
  ): Promise<ChannelListResponseDto>;
}
