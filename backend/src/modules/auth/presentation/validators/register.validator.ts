import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  role: z.enum(["STUDENT", "MENTOR"], {
    message: "Role must be either 'student' or 'mentor'",
  }),
});

export type RegisterDto = z.infer<typeof registerSchema>;
