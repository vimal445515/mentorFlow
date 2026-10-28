import {Container} from "inversify";
import {TYPES} from "../types.ts";
import type{ IUserRepository } from "../../modules/auth/domain/repositories/IUserRepository.ts";
import {PrismaUserRepository} from "../../modules/auth/infrastructrue/repositories/PrismaUserRepository.ts";

export const bindCore = (container:Container) =>{
    container.bind<IUserRepository>(TYPES.IUserRepository).to(PrismaUserRepository).inSingletonScope();
}