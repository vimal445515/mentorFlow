export const EmploymentType = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACT",
  FREELANCE: "FREELANCE",
} as const;

export type EmploymentType =
  (typeof EmploymentType)[keyof typeof EmploymentType];
