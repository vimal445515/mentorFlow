import type { CreateAuditLogDto } from "../../../application/dto/CreateAuditLogDto.ts";

export interface IWriteAuditLogUseCase {
  execute(input: CreateAuditLogDto): Promise<void>;
}
