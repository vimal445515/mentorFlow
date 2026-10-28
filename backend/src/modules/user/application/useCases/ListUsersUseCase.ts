import type { IUserManagementRepository } from "../../domain/repositories/IUserManagementRepository.ts";
import type { UserListFiltersDto } from "../dto/UserListFiltersDto.ts";
import type { IListUsersUseCase } from "../../domain/interfaces/useCase/IListUsersUseCase.ts";
import type { PaginatedUsersResponseDto } from "../dto/UserResponseDto.ts";
import { UserMapper } from "../../infrastructure/mappers/UserMapper.ts";

export class ListUsersUseCase implements IListUsersUseCase {
  constructor(private readonly userRepository: IUserManagementRepository) {}

  async execute(filters: UserListFiltersDto): Promise<PaginatedUsersResponseDto> {
    const result = await this.userRepository.findUsers(filters);
    return {
      users: result.items.map(UserMapper.toResponseDto),
      page: filters.page,
      limit: filters.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / filters.limit),
    };
  }
}
