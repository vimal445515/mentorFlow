import type { GoogleAuthDto } from "../../../application/dto/GoogleAuthDto.ts";
import type { LoginResponse } from "./ILoginUseCase.ts";

export interface IGoogleAuthUseCase {
  execute(dto: GoogleAuthDto): Promise<LoginResponse>;
}
