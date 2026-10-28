import type { UserListFiltersDto } from "../../../application/dto/UserListFiltersDto.ts";
import type { PaginatedUsersResponseDto } from "../../../application/dto/UserResponseDto.ts";

export interface IListUsersUseCase {
  execute(filters: UserListFiltersDto): Promise<PaginatedUsersResponseDto>;
}
