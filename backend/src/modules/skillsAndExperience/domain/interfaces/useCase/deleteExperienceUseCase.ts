export interface IDeleteExperienceUseCase {
  execute(
    mentorId: string,
    experienceId: string,
  ): Promise<{ message: string }>;
}
