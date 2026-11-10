import { z } from "zod";

export const createAvailabilitySchema = z
  .object({
    date: z.iso.date("Date must use YYYY-MM-DD format"),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must use HH:mm format"),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "End time must use HH:mm format"),
  })
  .refine((slot) => slot.startTime < slot.endTime, {
    message: "End time must be later than start time",
    path: ["endTime"],
  });
