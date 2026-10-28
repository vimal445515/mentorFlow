import { Container } from "inversify";
import { TYPES } from "../types.ts";
import type { IUserRepository } from "../../modules/auth/domain/repositories/IUserRepository.ts";
import { addSkillUseCase } from "../../modules/skillsAndExperience/application/useCase/addSkillUseCase.ts";
import { getSkillsUseCase } from "../../modules/skillsAndExperience/application/useCase/getSkillsUseCase.ts";
import { updateSkillUseCase } from "../../modules/skillsAndExperience/application/useCase/updateSkillUseCase.ts";
import { DeleteSkillUseCase } from "../../modules/skillsAndExperience/application/useCase/deleteSkillUseCase.ts";
import type { ISkillsRepository } from "../../modules/skillsAndExperience/domain/repositories/ISkillsRepository.ts";
import { PrismaSkillRepository } from "../../modules/skillsAndExperience/infrastructure/repositories/skillsRepository.ts";
import { SkillController } from "../../modules/skillsAndExperience/presentation/controller/skillsController.ts";
import { createMentorSkillRoutes } from "../../modules/skillsAndExperience/presentation/routes/skillRoutes.ts";
import type { IExperienceRepository } from "../../modules/skillsAndExperience/domain/repositories/IExperienceRepository.ts";
import { PrismaExperienceRepository } from "../../modules/skillsAndExperience/infrastructure/repositories/ExperienceRepository.ts";
import { AddExperienceUseCase } from "../../modules/skillsAndExperience/application/useCase/AddExperienceUseCase.ts";
import { GetExperiencesUseCase } from "../../modules/skillsAndExperience/application/useCase/GetExperiencesUseCase.ts";
import { UpdateExperienceUseCase } from "../../modules/skillsAndExperience/application/useCase/UpdateExperienceUseCase.ts";
import { DeleteExperienceUseCase } from "../../modules/skillsAndExperience/application/useCase/DeleteExperienceUseCase.ts";
import { ExperienceController } from "../../modules/skillsAndExperience/presentation/controller/ExperienceController.ts";
import { createMentorExperienceRoutes } from "../../modules/skillsAndExperience/presentation/routes/experienceRoutes.ts";

export const bindSkillsAndExperiences = (container: Container) => {
  container
    .bind<ISkillsRepository>(TYPES.ISkillsRepository)
    .to(PrismaSkillRepository)
    .inSingletonScope();

  const skillsRepository = container.get<ISkillsRepository>(
    TYPES.ISkillsRepository,
  );
  const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);

  const addSkillUseCaseInstance = new addSkillUseCase(
    skillsRepository,
    userRepository,
  );
  const updateSkillUseCaseInstance = new updateSkillUseCase(
    skillsRepository,
    userRepository,
  );
  const getSkillsUseCaseInstance = new getSkillsUseCase(
    skillsRepository,
    userRepository,
  );
  const deleteSkillUseCaseInstance = new DeleteSkillUseCase(
    skillsRepository,
    userRepository,
  );

  const skillController = new SkillController(
    addSkillUseCaseInstance,
    updateSkillUseCaseInstance,
    getSkillsUseCaseInstance,
    deleteSkillUseCaseInstance,
  );
  const skillRoutes = createMentorSkillRoutes(skillController);

  container
    .bind<IExperienceRepository>(TYPES.IExperienceRepository)
    .to(PrismaExperienceRepository)
    .inSingletonScope();

  const experienceRepository = container.get<IExperienceRepository>(
    TYPES.IExperienceRepository,
  );
  const addExperienceUseCase = new AddExperienceUseCase(
    experienceRepository,
    userRepository,
  );
  const getExperiencesUseCase = new GetExperiencesUseCase(
    experienceRepository,
    userRepository,
  );
  const updateExperienceUseCase = new UpdateExperienceUseCase(
    experienceRepository,
    userRepository,
  );
  const deleteExperienceUseCase = new DeleteExperienceUseCase(
    experienceRepository,
    userRepository,
  );

  const experienceController = new ExperienceController(
    addExperienceUseCase,
    getExperiencesUseCase,
    updateExperienceUseCase,
    deleteExperienceUseCase,
  );
  const experienceRoutes = createMentorExperienceRoutes(experienceController);
  skillRoutes.use("/experiences", experienceRoutes);

  return {
    skillController,
    skillRoutes,
    experienceController,
  };
};
