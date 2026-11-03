import type { ListAuditLogsDto } from "../dto/ListAuditLogsDto.ts";
import type { ListAuditLogsResponseDto } from "../dto/AuditLogResponseDto.ts";
import type { IListAuditLogsUseCase } from "../../domain/interfaces/useCase/IListAuditLogsUseCase.ts";
import type { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository.ts";
import { AuditLogMapper } from "../mappers/AuditLogMapper.ts";

export class ListAuditLogsUseCase implements IListAuditLogsUseCase {
  constructor(private readonly auditLogRepository: IAuditLogRepository) {}

  async execute(filters: ListAuditLogsDto): Promise<ListAuditLogsResponseDto> {
    const result = await this.auditLogRepository.findMany(filters);
    return {
      logs: result.logs.map(AuditLogMapper.toDto),
      page: filters.page,
      limit: filters.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / filters.limit),
    };
  }
}
