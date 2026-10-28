export interface StudentProfileProps {
  studentId: string;
  timezone?: string | null;
  currentGoal?: string | null;
  bio?: string | null;
  followingCount?: number;
  joinedAt?: Date;
}

export class StudentProfile {
  public readonly studentId: string;
  public timezone: string;
  public currentGoal: string;
  public bio: string;
  public followingCount: number;
  public readonly joinedAt: Date;

  constructor(props: StudentProfileProps) {
    this.studentId = props.studentId;
    this.timezone = props.timezone || "UTC";
    this.currentGoal = props.currentGoal || "";
    this.bio = props.bio || "";
    this.followingCount = props.followingCount || 0;
    this.joinedAt = props.joinedAt || new Date();
  }
}
