import type { MentorListFiltersDto } from "../../../application/dto/MentorListFiltersDto.ts";
import type { PaginatedMentorsResponseDto } from "../../../application/dto/UserResponseDto.ts";

export interface IListMentorsUseCase {
  execute(filters: MentorListFiltersDto): Promise<PaginatedMentorsResponseDto>;
}
