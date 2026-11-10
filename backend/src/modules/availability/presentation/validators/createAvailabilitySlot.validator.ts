import { z } from "zod";

const timePattern = /^(0[1-9]|1[0-2]):[0-5]\d (AM|PM)$/;

function toMinutes(time: string): number {
  const [clock, period] = time.split(" ");
  const [hours, minutes] = clock.split(":").map(Number);
  return ((hours % 12) + (period === "PM" ? 12 : 0)) * 60 + minutes;
}

export const createAvailabilitySlotSchema = z
  .object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format")
      .refine((value) => {
        const parsed = new Date(`${value}T00:00:00.000Z`);
        return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
      }, "Date is invalid"),
    startTime: z.string().regex(timePattern, "Start time is invalid"),
    endTime: z.string().regex(timePattern, "End time is invalid"),
  })
  .refine((values) => toMinutes(values.endTime) > toMinutes(values.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });
