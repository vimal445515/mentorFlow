import type { Request, Response } from "express";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { ResponseHandler } from "../../../../shared/response/responseHandler.ts";
import { querySchema } from "../validators/auditLog.validator.ts";
import type { IListAuditLogsUseCase } from "../../domain/interfaces/useCase/IListAuditLogsUseCase.ts";
import type { ListAuditLogsDto } from "../../application/dto/ListAuditLogsDto.ts";
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
