import type { UserRole } from "../enums/UserRole.ts";

export interface SignupData{
    fullName:string,
    email:string,
    passwordHashed:string,
    role:UserRole
}

export interface ISignupStore {
    save(email:string,role:UserRole,data:SignupData):Promise<void>;
    get(email:string,role:UserRole):Promise<SignupData|null>;
    delete(email:string,role:UserRole):Promise<void>;
}