import type { Prisma } from "@prisma/client";
import { prisma } from "../../../../config/database.ts";
import type { CreateAuditLogDto } from "../../application/dto/CreateAuditLogDto.ts";
import type { ListAuditLogsDto } from "../../application/dto/ListAuditLogsDto.ts";
import { AuditLogMapper } from "../mappers/AuditLogMapper.ts";
import type {
  AuditLogSearchResult,
  IAuditLogRepository,
} from "../../domain/repositories/IAuditLogRepository.ts";

export class PrismaAuditLogRepository implements IAuditLogRepository {
  async create(input: CreateAuditLogDto): Promise<void> {
    await prisma.auditLog.create({
      data: AuditLogMapper.toDb(input),
    });
  }

  async findMany(filters: ListAuditLogsDto): Promise<AuditLogSearchResult> {
    const where: Prisma.AuditLogWhereInput = {
      ...(filters.action && { action: filters.action }),
      ...(filters.resourceType && { resourceType: filters.resourceType }),
    };
    const skip = (filters.page - 1) * filters.limit;
    const [records, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip,
        take: filters.limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      logs: records.map(AuditLogMapper.fromDb),
      total,
    };
  }
}
