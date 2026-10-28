import { StudentProfile } from "./StudentProfile.ts";
import { MentorProfile } from "./MentorProfile.ts";

export interface UserProfileProps {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profileImageUrl?: string | null;
  status: string;
  studentProfile?: StudentProfile | null;
  mentorProfile?: MentorProfile | null;
}

export class UserProfile {
  public readonly id: string;
  public fullName: string;
  public email: string;
  public role: string;
  public profileImageUrl: string;
  public status: string;
  public studentProfile?: StudentProfile | null;
  public mentorProfile?: MentorProfile | null;

  constructor(props: UserProfileProps) {
    this.id = props.id;
    this.fullName = props.fullName;
    this.email = props.email;
    this.role = props.role;
    this.profileImageUrl = props.profileImageUrl || "";
    this.status = props.status;
    this.studentProfile = props.studentProfile ?? null;
    this.mentorProfile = props.mentorProfile ?? null;
  }
}
