export const ProficiencyLevel = {
  ADVANCED: "ADVANCED",
  INTERMEDIATE: "INTERMEDIATE",
  EXPERT: "EXPERT",
} as const;

export type ProficiencyLevel =
  (typeof ProficiencyLevel)[keyof typeof ProficiencyLevel];
