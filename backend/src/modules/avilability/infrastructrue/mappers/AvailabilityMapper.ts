import type {
  AvailabilitySlot as PrismaAvailabilitySlot,
  Prisma,
} from "@prisma/client";
import { Availability } from "../../domain/entities/avilability.ts";

export class AvailabilityMapper {
  static fromDb(record: PrismaAvailabilitySlot): Availability {
    return new Availability({
      slotId: record.slotId,
      mentorId: record.mentorId,
      date: record.date.toISOString().slice(0, 10),
      startTime: record.startTime,
      endTime: record.endTime,
    });
  }

  static toDb(
    availability: Availability,
  ): Prisma.AvailabilitySlotUncheckedCreateInput {
    if (!availability.mentorId) {
      throw new Error("Mentor ID is required to create an availability slot.");
    }

    return {
      mentorId: availability.mentorId,
      date: new Date(`${availability.date}T00:00:00.000Z`),
      startTime: availability.startTime,
      endTime: availability.endTime,
    };
  }
}
