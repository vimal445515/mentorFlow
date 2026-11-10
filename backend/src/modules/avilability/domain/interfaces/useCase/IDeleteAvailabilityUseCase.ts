export interface IDeleteAvailabilityUseCase {
  execute(mentorId: string, slotId: string): Promise<void>;
}
