import type { LogoutDto } from "../../../application/dto/LogoutDto.ts";

export interface ILogoutUsecase{
    execute(dto:LogoutDto):Promise<void>;
}