import type { Availability } from "../entities/avilability.ts";

export interface IAvailabilityRepository {
  createForMentor(
    mentorId: string,
    slot: Pick<Availability, "date" | "startTime" | "endTime">,
  ): Promise<Availability>;
  findAllForMentor(mentorId: string): Promise<Availability[]>;
  deleteForMentor(mentorId: string, slotId: string): Promise<boolean>;
}
