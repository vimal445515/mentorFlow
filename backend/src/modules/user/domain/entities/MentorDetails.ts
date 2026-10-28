import type { EmploymentType } from "../enums/EmploymentType.ts";
import type { ProficiencyLevel } from "../enums/ProficiencyLevel.ts";
import type { UserStatus } from "../enums/UserStatus.ts";
import type { WorkPlaceType } from "../enums/WorkPlaceType.ts";

export interface MentorSkillDetailProps {
  skillId: string;
  skillName: string;
  subtopics: string | null;
  proficiencyLevel: ProficiencyLevel;
}

export class MentorSkillDetail {
  public readonly skillId: string;
  public readonly skillName: string;
  public readonly subtopics: string | null;
  public readonly proficiencyLevel: ProficiencyLevel;

  constructor(props: MentorSkillDetailProps) {
    this.skillId = props.skillId;
    this.skillName = props.skillName;
    this.subtopics = props.subtopics;
    this.proficiencyLevel = props.proficiencyLevel;
  }
}

export interface MentorExperienceDetailProps {
  experienceId: string;
  title: string;
  company: string | null;
  employmentType: EmploymentType;
  workPlaceType: WorkPlaceType;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string | null;
}

export class MentorExperienceDetail {
  public readonly experienceId: string;
  public readonly title: string;
  public readonly company: string | null;
  public readonly employmentType: EmploymentType;
  public readonly workPlaceType: WorkPlaceType;
  public readonly location: string | null;
  public readonly startDate: Date;
  public readonly endDate: Date | null;
  public readonly isCurrent: boolean;
  public readonly description: string | null;

  constructor(props: MentorExperienceDetailProps) {
    this.experienceId = props.experienceId;
    this.title = props.title;
    this.company = props.company;
    this.employmentType = props.employmentType;
    this.workPlaceType = props.workPlaceType;
    this.location = props.location;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.isCurrent = props.isCurrent;
    this.description = props.description;
  }
}

export interface MentorDetailsProps {
  id: string;
  fullName: string;
  email: string;
  profileImageUrl: string | null;
  status: UserStatus;
  createdAt: Date;
  headline: string | null;
  bio: string | null;
  sessionPrice: number;
  yearsExperience: number;
  verificationStatus: UserStatus;
  followerCount: number;
  averageRating: number;
  timezone: string | null;
  approvedAt: Date | null;
  teachingSubjects: string | null;
  skills: MentorSkillDetail[];
  experiences: MentorExperienceDetail[];
  latestExperience: string | null;
}

export class MentorDetails {
  public readonly id: string;
  public readonly fullName: string;
  public readonly email: string;
  public readonly profileImageUrl: string | null;
  public readonly status: UserStatus;
  public readonly createdAt: Date;
  public readonly headline: string | null;
  public readonly bio: string | null;
  public readonly sessionPrice: number;
  public readonly yearsExperience: number;
  public readonly verificationStatus: UserStatus;
  public readonly followerCount: number;
  public readonly averageRating: number;
  public readonly timezone: string | null;
  public readonly approvedAt: Date | null;
  public readonly teachingSubjects: string | null;
  public readonly skills: MentorSkillDetail[];
  public readonly experiences: MentorExperienceDetail[];
  public readonly latestExperience: string | null;

  constructor(props: MentorDetailsProps) {
    this.id = props.id;
    this.fullName = props.fullName;
    this.email = props.email;
    this.profileImageUrl = props.profileImageUrl;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.headline = props.headline;
    this.bio = props.bio;
    this.sessionPrice = props.sessionPrice;
    this.yearsExperience = props.yearsExperience;
    this.verificationStatus = props.verificationStatus;
    this.followerCount = props.followerCount;
    this.averageRating = props.averageRating;
    this.timezone = props.timezone;
    this.approvedAt = props.approvedAt;
    this.teachingSubjects = props.teachingSubjects;
    this.skills = props.skills;
    this.experiences = props.experiences;
    this.latestExperience = props.latestExperience;
  }
}
