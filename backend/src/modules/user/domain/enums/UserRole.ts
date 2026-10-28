export const UserRole = {
  STUDENT: "STUDENT",
  MENTOR: "MENTOR",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
