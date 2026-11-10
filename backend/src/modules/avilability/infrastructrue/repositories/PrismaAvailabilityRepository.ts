import { injectable } from "inversify";
import { prisma } from "../../../../config/database.ts";
import { Availability } from "../../domain/entities/avilability.ts";
import type { IAvailabilityRepository } from "../../domain/repositories/IAvailabilityRepository.ts";
import { AvailabilityMapper } from "../mappers/AvailabilityMapper.ts";

@injectable()
export class PrismaAvailabilityRepository implements IAvailabilityRepository {
  async createForMentor(
    mentorId: string,
    slot: Pick<Availability, "date" | "startTime" | "endTime">,
  ): Promise<Availability> {
    const availability = new Availability({ mentorId, ...slot });
    const record = await prisma.availabilitySlot.create({
      data: AvailabilityMapper.toDb(availability),
    });
    return AvailabilityMapper.fromDb(record);
  }

  async findAllForMentor(mentorId: string): Promise<Availability[]> {
    const records = await prisma.availabilitySlot.findMany({
      where: { mentorId },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });
    return records.map(AvailabilityMapper.fromDb);
  }

  async deleteForMentor(mentorId: string, slotId: string): Promise<boolean> {
    const result = await prisma.availabilitySlot.deleteMany({
      where: { mentorId, slotId },
    });
    return result.count > 0;
  }
}
