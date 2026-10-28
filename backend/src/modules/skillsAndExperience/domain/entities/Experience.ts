import type {
  EmploymentTypes,
  WorkPlaceTypes,
} from "../enums/experience.ts";

export interface ExperienceProps {
  experienceId?: string;
  mentorId: string;
  title: string;
  company?: string | null;
  employmentType: EmploymentTypes;
  workPlaceType: WorkPlaceTypes;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
  isCurrent?: boolean;
  description?: string | null;
}

export class Experience {
  public readonly experienceId?: string;
  public readonly mentorId: string;
  public title: string;
  public company: string | null;
  public employmentType: EmploymentTypes;
  public workPlaceType: WorkPlaceTypes;
  public location: string | null;
  public startDate: Date;
  public endDate: Date | null;
  public isCurrent: boolean;
  public description: string | null;

  constructor(props: ExperienceProps) {
    this.experienceId = props.experienceId;
    this.mentorId = props.mentorId;
    this.title = props.title;
    this.company = props.company ?? null;
    this.employmentType = props.employmentType;
    this.workPlaceType = props.workPlaceType;
    this.location = props.location ?? null;
    this.startDate = props.startDate;
    this.endDate = props.endDate ?? null;
    this.isCurrent = props.isCurrent ?? false;
    this.description = props.description ?? null;
  }
}
