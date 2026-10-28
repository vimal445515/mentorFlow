export const UserStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
