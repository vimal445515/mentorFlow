import type { ITokenService } from "../../domain/interfaces/ITokenService.ts";
import type { ITokenStore } from "../../domain/interfaces/ITokenStore.ts";
import type { IRefreshUseCase, RefreshResponse } from "../../domain/interfaces/userCase/IRefreshUseCase.ts";
import type { RefreshDto } from "../dto/RefreshDto.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { ErrorMessages } from "../../../../shared/constant/ErrorMessage.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
export class RefreshUseCase implements IRefreshUseCase{
    constructor(
    private readonly tokenService: ITokenService,
    private readonly tokenStore: ITokenStore,
  ) { }

  async execute(dto: RefreshDto): Promise<RefreshResponse> {
      const paylaod = await this.tokenService.verifyRefreshToken(dto.refreshToken);

      const storedRefreshToken = await this.tokenStore.getRefreshToken(paylaod.userId);
       if (!storedRefreshToken || storedRefreshToken !== dto.refreshToken) {
      throw new AppError(ErrorMessages.INVALID_REFRESH_TOKEN,HttpStatusCode.UNAUTHORIZED);
        }

        const tokenPayload = {
            userId:paylaod.userId,
            email:paylaod.email,
            role:paylaod.role
        }

        const newAccessToken = await this.tokenService.generateAccessToken(tokenPayload);
        const newRefreshToken = await this.tokenService.generateRefreshToken(tokenPayload);
        await this.tokenStore.saveRefreshToken(paylaod.userId,newRefreshToken);

        return {
            accessToken:newAccessToken,
            refreshToken:newRefreshToken
        }
  }
}