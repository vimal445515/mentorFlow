import { injectable } from "inversify";
import type { Prisma, User as PrismaUser } from "@prisma/client";
import { prisma } from "../persistence/prisma.ts";
import { User } from "../../domain/entities/User.ts";
import type { IUserRepository } from "../../domain/repositories/IUserRepository.ts";
import { UserMapper } from "../mappers/UserMapper.ts";
import { Role } from "@prisma/client";
import { BaseRepository } from "../../../../shared/base/repositories/baseRepository.ts";

@injectable()
export class PrismaUserRepository
  extends BaseRepository<
    User,
    PrismaUser,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput
  >
  implements IUserRepository
{
  constructor() {
    super(prisma.user, UserMapper);
  }

  async findByEmailAndRole(email: string, role: Role): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { email, role: role },
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

  async findByGoogleIdAndRole(
    googleId: string,
    role: Role,
  ): Promise<User | null> {
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
}
