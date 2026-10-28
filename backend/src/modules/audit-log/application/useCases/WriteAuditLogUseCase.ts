import type { CreateAuditLogDto } from "../dto/CreateAuditLogDto.ts";
import type { IWriteAuditLogUseCase } from "../../domain/interfaces/useCase/IWriteAuditLogUseCase.ts";
import type { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository.ts";

export class WriteAuditLogUseCase implements IWriteAuditLogUseCase {
  constructor(private readonly auditLogRepository: IAuditLogRepository) {}

  async execute(input: CreateAuditLogDto): Promise<void> {
    await this.auditLogRepository.create(input);
  }
}
