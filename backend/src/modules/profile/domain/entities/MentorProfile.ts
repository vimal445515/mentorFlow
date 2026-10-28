export interface MentorProfileProps {
  mentorId: string;
  headline?: string | null;
  bio?: string | null;
  sessionPrice?: number | string | null;
  yearsExperience?: number | null;
  verificationStatus?: string | null;
  followerCount?: number | null;
  averageRating?: number | string | null;
  teachingSubjects?:string|undefined;
  timezone?: string | null;
  approvedAt?: Date | null;
}

export class MentorProfile {
  public readonly mentorId: string;
  public headline: string;
  public bio: string;
  public sessionPrice: number;
  public yearsExperience: number;
  public verificationStatus: string;
  public followerCount: number;
  public averageRating: number;
  public teachingSubjects:string|undefined;
  public timezone: string;
  public approvedAt?: Date | null;

  constructor(props: MentorProfileProps) {
    this.mentorId = props.mentorId;
    this.headline = props.headline || "";
    this.bio = props.bio || "";
    this.sessionPrice = Number(props.sessionPrice) || 0;
    this.yearsExperience = Number(props.yearsExperience) || 0;
    this.verificationStatus = props.verificationStatus || "ACTIVE";
    this.followerCount = Number(props.followerCount) || 0;
    this.averageRating = Number(props.averageRating) || 0;
    this.teachingSubjects = props.teachingSubjects;
    this.timezone = props.timezone || "";
    this.approvedAt = props.approvedAt ?? null;
  }
}
