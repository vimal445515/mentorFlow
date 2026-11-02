import type { Prisma, User as PrismaUser } from "@prisma/client";
import {User} from "../../domain/entities/User.ts";
import {UserRole} from "../../domain/enums/UserRole.ts";
import {Role as PrismaUserRole} from "@prisma/client";
import {Status as PrismaUserStatus} from "@prisma/client";


export class UserMapper {
    static fromDb(prismaUser: PrismaUser): User {
        return new User({
            id: prismaUser.id,
            fullName: prismaUser.fullName,
            email: prismaUser.email,
            passwordHash: prismaUser.passwordHash,
            role: prismaUser.role as UserRole,
            profileImageUrl: prismaUser.profileImageUrl || "",
            status: prismaUser.status,
            googleId: prismaUser.googleId,
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt
        });
    }

    static toDb(user: User): Prisma.UserCreateInput {
        return {
            fullName: user.fullName,
            email: user.email,
            passwordHash: user.passwordHash ?? null,
            role: user.role as PrismaUserRole,
            profileImageUrl: user.profileImageUrl || "",
            status: user.status as PrismaUserStatus,
            googleId: user.googleId ?? null,
        };
    }
    static toUpdateDb(user: Partial<User>): Prisma.UserUpdateInput {
        return {
            ...(user.fullName !== undefined && { fullName: user.fullName }),
            ...(user.email !== undefined && { email: user.email }),
            ...(user.passwordHash !== undefined && { passwordHash: user.passwordHash }),  
            ...(user.profileImageUrl !== undefined && { profileImageUrl: user.profileImageUrl }),
            ...(user.status !== undefined && { status: user.status as PrismaUserStatus }),
            ...(user.role !== undefined && { role: user.role === UserRole.ADMIN ? PrismaUserRole.ADMIN : user.role === UserRole.MENTOR ? PrismaUserRole.MENTOR : PrismaUserRole.STUDENT }),
            ...(user.googleId !== undefined && { googleId: user.googleId }),
            ...(user.updatedAt !== undefined && { updatedAt: user.updatedAt }),
            ...(user.createdAt !== undefined && { createdAt: user.createdAt }),
        };
    } 
}