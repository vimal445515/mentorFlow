import type { LoginDto } from "../../../application/dto/LoginDto.ts";
import { UserRole } from "../../enums/UserRole.ts";

export interface LoginResponse {
    user:{
        id:string,
        fullName:string,
        email:string,
        role:UserRole,
        profileImageUrl?:string
    },
    accessToken:string,
    refreshToken:string
}

export interface ILoginUseCase{
    execute(dto:LoginDto):Promise<LoginResponse>
}