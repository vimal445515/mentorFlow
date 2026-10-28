import type { ListAuditLogsDto } from "../../../application/dto/ListAuditLogsDto.ts";
import type { ListAuditLogsResponseDto } from "../../../application/dto/AuditLogResponseDto.ts";

export interface IListAuditLogsUseCase {
  execute(filters: ListAuditLogsDto): Promise<ListAuditLogsResponseDto>;
}
