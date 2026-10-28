import { ListAuditLogsUseCase } from "../../modules/audit-log/application/useCases/ListAuditLogsUseCase.ts";
import { WriteAuditLogUseCase } from "../../modules/audit-log/application/useCases/WriteAuditLogUseCase.ts";
import { PrismaAuditLogRepository } from "../../modules/audit-log/infrastructure/repositories/PrismaAuditLogRepository.ts";
import { AuditLogController } from "../../modules/audit-log/presentation/controllers/auditLog.controller.ts";
import { createAuditLogRoutes } from "../../modules/audit-log/presentation/routes/auditLog.routes.ts";

export function bindAuditLogs() {
  const auditLogRepository = new PrismaAuditLogRepository();
  const writeAuditLogUseCase = new WriteAuditLogUseCase(auditLogRepository);
  const listAuditLogsUseCase = new ListAuditLogsUseCase(auditLogRepository);
  const auditLogController = new AuditLogController(listAuditLogsUseCase);

  return {
    auditLogRoutes: createAuditLogRoutes(auditLogController),
    writeAuditLogUseCase,
  };
}
