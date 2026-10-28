import type { RefreshDto } from "../../../application/dto/RefreshDto.ts";

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
export interface IRefreshUseCase {
  execute(dto: RefreshDto): Promise<RefreshResponse>;
}
