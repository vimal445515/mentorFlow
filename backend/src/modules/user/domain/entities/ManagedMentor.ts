import type { UserStatus } from "../enums/UserStatus.ts";

export interface ManagedMentorProps {
  id: string;
  fullName: string;
  email: string;
  profileImageUrl: string | null;
  status: UserStatus;
  createdAt: Date;
  headline: string | null;
  sessionPrice: number;
  yearsExperience: number;
  teachingSubjects: string | null;
  verificationStatus: UserStatus;
  skills: string[];
  latestExperience: string | null;
}

export class ManagedMentor {
  public readonly id: string;
  public readonly fullName: string;
  public readonly email: string;
  public readonly profileImageUrl: string | null;
  public readonly status: UserStatus;
  public readonly createdAt: Date;
  public readonly headline: string | null;
  public readonly sessionPrice: number;
  public readonly yearsExperience: number;
  public readonly teachingSubjects: string | null;
  public readonly verificationStatus: UserStatus;
  public readonly skills: string[];
  public readonly latestExperience: string | null;

  constructor(props: ManagedMentorProps) {
    this.id = props.id;
    this.fullName = props.fullName;
    this.email = props.email;
    this.profileImageUrl = props.profileImageUrl;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.headline = props.headline;
    this.sessionPrice = props.sessionPrice;
    this.yearsExperience = props.yearsExperience;
    this.teachingSubjects = props.teachingSubjects;
    this.verificationStatus = props.verificationStatus;
    this.skills = props.skills;
    this.latestExperience = props.latestExperience;
  }
}
