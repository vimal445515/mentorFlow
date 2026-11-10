export interface AvailabilityProps {
  slotId?: string;
  mentorId?: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
}

export class Availability {
  public readonly slotId?: string;
  public readonly mentorId?: string;
  public readonly date: string;
  public readonly startTime: string;
  public readonly endTime: string;
  public readonly isBooked: boolean;

  constructor(props: AvailabilityProps) {
    this.slotId = props.slotId;
    this.mentorId = props.mentorId;
    this.date = props.date;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.isBooked = props.isBooked ?? false;
  }
}
