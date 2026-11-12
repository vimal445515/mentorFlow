import type { ChannelListQueryDto } from "../../../application/dto/ChannelListQueryDto.ts";
import type { PublicChannelListResponseDto } from "../../../application/dto/PublicChannelListResponseDto.ts";

export interface IListPublicChannelsUseCase {
  execute(query: ChannelListQueryDto): Promise<PublicChannelListResponseDto>;
}
