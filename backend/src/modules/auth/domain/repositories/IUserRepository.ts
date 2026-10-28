import type {IBaseRepository} from "../../../../shared/base/repositories/IBaseRepository.ts";
import {User} from "../entities/User.ts";

export interface IUserRepository extends IBaseRepository<User> {
    findByEmailAndRole(email: string, role: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByGoogleIdAndRole(googleId: string, role: string): Promise<User | null>;
    updatePassword(id:string,newPassword:string):Promise<void>;
}