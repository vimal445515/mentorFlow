import type { Availability } from "../../domain/entities/avilability.ts";
import type { AvailabilityResponseDto } from "../dto/AvailabilityResponseDto.ts";

export class AvailabilityMapper {
  static toResponseDto(availability: Availability): AvailabilityResponseDto {
    if (!availability.slotId) {
      throw new Error("Availability slot ID is required for a response.");
    }

    return {
      slotId: availability.slotId,
      date: availability.date,
      startTime: availability.startTime,
      endTime: availability.endTime,
      isBooked: availability.isBooked,
    };
  }
}
