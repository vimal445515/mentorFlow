import { UserProfile } from "../entities/UserProfile.ts";
import { StudentProfile } from "../entities/StudentProfile.ts";
import { MentorProfile } from "../entities/MentorProfile.ts";

export interface IProfileRepository {
  findUserProfileById(userId: string): Promise<UserProfile | null>;
  createDefaultStudentProfile(userId: string): Promise<StudentProfile>;
  createDefaultMentorProfile(userId: string): Promise<MentorProfile>;
  updateUserBasicInfo(userId: string, data: { fullName?: string; profileImageUrl?: string }): Promise<void>;
  upsertStudentProfile(studentId: string, data: { currentGoal?: string; bio?: string; timezone?: string }): Promise<void>;
  upsertMentorProfile(mentorId: string, data: {
    headline?: string;
    bio?: string;
    sessionPrice?: number;
    teachingSubjects?: string;
  }): Promise<void>;
  requestMentorVerification(mentorId: string): Promise<boolean>;
}
