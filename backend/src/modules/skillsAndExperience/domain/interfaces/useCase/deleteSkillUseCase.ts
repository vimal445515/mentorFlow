export interface IDeleteSkillUseCase {
  execute(mentorId: string, skillId: string): Promise<{ message: string }>;
}
