export interface StudentInfo {
  name: string;
  topic: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  status: "available" | "booked";
  student?: StudentInfo;
}

export type ScheduleMap = Record<string, TimeSlot[]>;

export interface AvailabilitySlotData {
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked:boolean;
}

export interface AvailabilityApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
