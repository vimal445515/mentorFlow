import type { UserRole } from "../enums/UserRole.ts";

export interface IEmailService {
    sendSignupOtp(email:string,otp:string,role:UserRole):Promise<void>;
    sendForgotPasswordOtp(email:string,otp:string,role:UserRole):Promise<void>;
}