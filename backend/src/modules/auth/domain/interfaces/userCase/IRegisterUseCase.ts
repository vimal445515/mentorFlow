import type {RegisterDto} from '../../../application/dto/RegisterDto.ts';
import type { User } from '../../entities/User.ts';
export interface IRegisterUseCase {
    execute(registerDto: RegisterDto):Promise<{message:string}>;
}