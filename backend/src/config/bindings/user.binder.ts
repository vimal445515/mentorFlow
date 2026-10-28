import { PrismaUserManagementRepository } from "../../modules/user/infrastructure/repositories/PrismaUserManagementRepository.ts";
import { ListUsersUseCase } from "../../modules/user/application/useCases/ListUsersUseCase.ts";
import { UpdateUserStatusUseCase } from "../../modules/user/application/useCases/UpdateUserStatusUseCase.ts";
import { ListMentorsUseCase } from "../../modules/user/application/useCases/ListMentorsUseCase.ts";
import { ApproveMentorUseCase } from "../../modules/user/application/useCases/ApproveMentorUseCase.ts";
import { RejectMentorUseCase } from "../../modules/user/application/useCases/RejectMentorUseCase.ts";
import { GetMentorDetailsUseCase } from "../../modules/user/application/useCases/GetMentorDetailsUseCase.ts";
import { UserController } from "../../modules/user/presentation/controllers/user.controller.ts";
import { createUserRoutes } from "../../modules/user/presentation/routes/user.routes.ts";
import type { IWriteAuditLogUseCase } from "../../modules/audit-log/domain/interfaces/useCase/IWriteAuditLogUseCase.ts";

export const bindUsers = (writeAuditLogUseCase: IWriteAuditLogUseCase) => {
  const userRepository = new PrismaUserManagementRepository();
  const listUsersUseCase = new ListUsersUseCase(userRepository);
  const updateUserStatusUseCase = new UpdateUserStatusUseCase(
    userRepository,
    writeAuditLogUseCase,
  );
  const listMentorsUseCase = new ListMentorsUseCase(userRepository);
  const approveMentorUseCase = new ApproveMentorUseCase(
    userRepository,
    writeAuditLogUseCase,
  );
  const rejectMentorUseCase = new RejectMentorUseCase(
    userRepository,
    writeAuditLogUseCase,
  );
  const getMentorDetailsUseCase = new GetMentorDetailsUseCase(userRepository);
  const userController = new UserController(
    listUsersUseCase,
    updateUserStatusUseCase,
    listMentorsUseCase,
    approveMentorUseCase,
    rejectMentorUseCase,
    getMentorDetailsUseCase,
  );

  return {
    userRoutes: createUserRoutes(userController),
  };
};
