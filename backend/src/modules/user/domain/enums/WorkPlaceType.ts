export const WorkPlaceType = {
  REMOTE: "REMOTE",
  ONSITE: "ONSITE",
  HYBRID: "HYBRID",
} as const;

export type WorkPlaceType = (typeof WorkPlaceType)[keyof typeof WorkPlaceType];
