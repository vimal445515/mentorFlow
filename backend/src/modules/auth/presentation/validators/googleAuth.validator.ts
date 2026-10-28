import { z } from "zod";
import { UserRole } from "../../domain/enums/UserRole.ts";

export const googleAuthSchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
  role: z.enum([UserRole.STUDENT, UserRole.MENTOR]),
});
