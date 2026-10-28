import type { MentorListFiltersDto } from "../dto/MentorListFiltersDto.ts";
import type { IUserManagementRepository } from "../../domain/repositories/IUserManagementRepository.ts";
import type { IListMentorsUseCase } from "../../domain/interfaces/useCase/IListMentorsUseCase.ts";
import type { PaginatedMentorsResponseDto } from "../dto/UserResponseDto.ts";
import { UserMapper } from "../../infrastructure/mappers/UserMapper.ts";

export class ListMentorsUseCase implements IListMentorsUseCase {
  constructor(private readonly userRepository: IUserManagementRepository) {}

  async execute(filters: MentorListFiltersDto): Promise<PaginatedMentorsResponseDto> {
    const result = await this.userRepository.findMentors(filters);
    return {
      mentors: result.items.map(UserMapper.mentorToResponseDto),
      page: filters.page,
      limit: filters.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / filters.limit),
    };
  }
}
