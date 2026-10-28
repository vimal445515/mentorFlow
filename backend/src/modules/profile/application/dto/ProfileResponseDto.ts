export interface StudentProfileResponseDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profileImageUrl: string;
  status: string;
  currentGoal: string;
  bio: string;
  timezone: string;
  roadmapProgress: number;
  sessionsCompleted: number;
  milestoneApprovals: number;
  badgesEarned: number;
  notificationsEnabled: boolean;
  subscription?: {
    status: string;
    planName: string;
    renewalDate: string;
    billingCycle: string;
    aiLimits: string;
    aiAssistant: string;
  };
}

export interface MentorProfileResponseDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profileImageUrl: string;
  status: string;
  headline: string;
  sessionPrice: number;
  teachingSubjects: string;
  bio: string;
  yearsExperience: number;
  verificationStatus: string;
  followerCount: number;
  averageRating: number;
}

export interface GenericProfileResponseDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profileImageUrl: string;
  status: string;
}

export type ProfileResponseDto =
  | StudentProfileResponseDto
  | MentorProfileResponseDto
  | GenericProfileResponseDto;
