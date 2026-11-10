import {z} from "zod"
import { AuditAction } from "../../domain/entities/AuditLog.ts";
export const querySchema = z.object({
  action: z.enum(AuditAction).optional(),
  resourceType: z.string().trim().min(1).max(80).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});