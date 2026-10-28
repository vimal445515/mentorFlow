import type { UserRole } from "../enums/UserRole.ts";

export interface IOtpStore {
    saveOtp(email:string,role:UserRole,otp:string):Promise<void>;
    getOtp(email:string,role:UserRole):Promise<string|null>;
    deleteOtp(email:string,role:UserRole):Promise<void>;
    saveForgotOtp(email: string, otp: string): Promise<void>;
    getForgotOtp(email: string): Promise<string | null>;
    deleteForgotOtp(email: string): Promise<void>;
    saveResetToken(email: string, token: string): Promise<void>;
    getResetToken(email: string): Promise<string | null>;
    deleteResetToken(email: string): Promise<void>;
}