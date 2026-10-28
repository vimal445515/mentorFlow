export interface UpdateProfileDto {
  fullName?: string;
  profileImageUrl?: string;
  currentGoal?: string;
  bio?: string;
  headline?: string;
  sessionPrice?: number | string;
  teachingSubjects?: string;
  timezone?: string;
}
