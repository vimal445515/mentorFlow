import { prisma } from "../../../../config/database.ts";

export interface CreateAvailabilitySlotInput {
  mentorId: string;
  date: Date;
  startTime: string;
  endTime: string;
}

export class PrismaAvailabilityRepository {
  getForMentor(mentorId: string) {
    return prisma.availabilitySlot.findMany({
      where: { mentorId },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });
  }

  create(input: CreateAvailabilitySlotInput) {
    return prisma.availabilitySlot.create({ data: input });
  }

  async deleteForMentor(mentorId: string, slotId: string): Promise<boolean> {
    const result = await prisma.availabilitySlot.deleteMany({
      where: { mentorId, slotId },
    });
    return result.count > 0;
  }
}
