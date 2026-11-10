import { AUTH_TYPES } from "./types/auth.types.ts";
import { PROFILE_TYPES } from "./types/profile.types.ts";
import { SKILLS_AND_EXPERIENCES_TYPE } from "./types/skillsAndExperiences.types.ts";
import { AVAILABILITY_TYPES } from "./types/availability.types.ts";

export const TYPES = {
  ...AUTH_TYPES,
  ...PROFILE_TYPES,
  ...SKILLS_AND_EXPERIENCES_TYPE,
  ...AVAILABILITY_TYPES,
};