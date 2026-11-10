export interface IDeleteChannelUseCase {
  execute(mentorId: string, channelId: string): Promise<void>;
}
