import { Container } from "inversify";
import { TYPES } from "../types.ts";
import type { IProfileRepository } from "../../modules/profile/domain/repositories/IProfileRepository.ts";
import { PrismaProfileRepository } from "../../modules/profile/infrastructrue/repositories/PrismaProfileRepository.ts";
import { GetProfileUseCase } from "../../modules/profile/application/useCase/GetProfileUseCase.ts";
import { UpdateProfileUseCase } from "../../modules/profile/application/useCase/UpdateProfileUseCase.ts";
import { RequestMentorApprovalUseCase } from "../../modules/profile/application/useCase/RequestMentorApprovalUseCase.ts";
import { ProfileController } from "../../modules/profile/presentation/controllers/profile.controller.ts";
import { createProfileRoutes } from "../../modules/profile/presentation/routes/profile.routes.ts";
import type { IWriteAuditLogUseCase } from "../../modules/audit-log/domain/interfaces/useCase/IWriteAuditLogUseCase.ts";

export const bindProfile = (container: Container, writeAuditLogUseCase: IWriteAuditLogUseCase) => {
  container
    .bind<IProfileRepository>(TYPES.IProfileRepository)
    .to(PrismaProfileRepository)
    .inSingletonScope();

  const profileRepository = container.get<IProfileRepository>(TYPES.IProfileRepository);

  const getProfileUseCase = new GetProfileUseCase(profileRepository);
  const updateProfileUseCase = new UpdateProfileUseCase(
    profileRepository,
    getProfileUseCase,
    writeAuditLogUseCase,
  );
  const requestMentorApprovalUseCase = new RequestMentorApprovalUseCase(
    profileRepository,
    getProfileUseCase,
    writeAuditLogUseCase,
  );
  const profileController = new ProfileController(
    getProfileUseCase,
    updateProfileUseCase,
    requestMentorApprovalUseCase,
  );

  const profileRoutes = createProfileRoutes(profileController);

  return {
    profileController,
    profileRoutes,
  };
};
