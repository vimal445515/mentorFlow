export interface StudentProfileData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profileImageUrl?: string;
  status?: string;
  currentGoal?: string;
  bio?: string;
  timezone?: string;
  roadmapProgress?: number;
  sessionsCompleted?: number;
  milestoneApprovals?: number;
  badgesEarned?: number;
  notificationsEnabled?: boolean;
}

export interface MentorProfileData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profileImageUrl?: string;
  status?: string;
  headline?: string;
  sessionPrice?: number;
  teachingSubjects?: string;
  bio?: string;
  yearsExperience?: number;
  verificationStatus?: string;
  followerCount?: number;
  averageRating?: number;
}

export interface UpdateProfileDto {
  fullName?: string;
  profileImageUrl?: string;
  currentGoal?: string;
  bio?: string;
  headline?: string;
  sessionPrice?: number;
  teachingSubjects?: string;
  timezone?: string;
  notificationsEnabled?: boolean;
}
