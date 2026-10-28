import type { Request, Response } from "express";
import { z } from "zod";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { ResponseHandler } from "../../../../shared/response/responseHandler.ts";
import { AuditAction } from "../../domain/entities/AuditLog.ts";
import type { IListAuditLogsUseCase } from "../../domain/interfaces/useCase/IListAuditLogsUseCase.ts";
import type { ListAuditLogsDto } from "../../application/dto/ListAuditLogsDto.ts";

const querySchema = z.object({
  action: z.enum(AuditAction).optional(),
  resourceType: z.string().trim().min(1).max(80).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export class AuditLogController {
  constructor(private readonly listAuditLogsUseCase: IListAuditLogsUseCase) {}

  async list(req: Request, res: Response): Promise<void> {
    const parsedQuery = querySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      throw new AppError(
        parsedQuery.error.issues[0]?.message ?? "Invalid audit log filters.",
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const filters: ListAuditLogsDto = parsedQuery.data;
    const result = await this.listAuditLogsUseCase.execute(filters);
    ResponseHandler.success(res, "Audit logs fetched successfully", result, HttpStatusCode.OK);
  }
}
