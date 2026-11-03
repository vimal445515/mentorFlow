import {injectable} from "inversify";
import {prisma} from "../persistence/prisma.ts";
import {User} from "../../domain/entities/User.ts";
import type {IUserRepository} from "../../domain/repositories/IUserRepository.ts";
import {UserMapper} from "../mappers/UserMapper.ts";
import { Role } from "@prisma/client";

@injectable()
export class PrismaUserRepository implements IUserRepository {
    async create(user:User): Promise<User> {
        console.log("data",user)
        const createdUser = await prisma.user.create({
            data: UserMapper.toDb(user),
        })
        return UserMapper.fromDb(createdUser);
    }

    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user ? UserMapper.fromDb(user) : null;
    }

    async findAll(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users.map(UserMapper.fromDb);
    }

    async findByEmailAndRole(email: string, role: Role): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: { email, role:role},
        });
        return user ? UserMapper.fromDb(user) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive",
                },
            },
        });
        return user ? UserMapper.fromDb(user) : null;
    }

    async findByGoogleIdAndRole(googleId: string, role: Role): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: { googleId, role: role as Role },
        });
        return user ? UserMapper.fromDb(user) : null;
    }

    async updatePassword(id: string, newPassword: string): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: { passwordHash: newPassword },
        });
    }
    async update(id: string, data: Partial<User>): Promise<User> {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: UserMapper.toUpdateDb(data as User),
        });
        return UserMapper.fromDb(updatedUser);
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }
}