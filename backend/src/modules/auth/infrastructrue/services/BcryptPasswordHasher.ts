import bcrypt from "bcrypt";
import type { IPasswordHasher } from "../../domain/interfaces/IPasswordHasher.ts"; 
import { injectable } from "inversify";
@injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds: number = 10;
  async hash(password:string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(password:string, hashedPassword:string):Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}