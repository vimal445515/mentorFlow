import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import type { IChannelRepository } from "../../domain/repositories/IChannelRepository.ts";
import type { IDeleteChannelUseCase } from "../../domain/interfaces/useCase/IDeleteChannelUseCase.ts";

export class DeleteChannelUseCase implements IDeleteChannelUseCase {
  constructor(private readonly channelRepository: IChannelRepository) {}

  async execute(mentorId: string, channelId: string): Promise<void> {
    const deleted = await this.channelRepository.deleteForMentor(
      mentorId,
      channelId,
    );
    if (!deleted) {
      throw new AppError("Channel not found.", HttpStatusCode.NOT_FOUND);
    }
  }
}
