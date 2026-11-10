import { Container } from "inversify";
import { TYPES } from "../types.ts";
import type { IAvailabilityRepository } from "../../modules/avilability/domain/repositories/IAvailabilityRepository.ts";
import { PrismaAvailabilityRepository } from "../../modules/avilability/infrastructrue/repositories/PrismaAvailabilityRepository.ts";
import { CreateAvailabilityUseCase } from "../../modules/avilability/application/useCase/CreateAvailabilityUseCase.ts";
import { GetAvailabilityUseCase } from "../../modules/avilability/application/useCase/GetAvailabilityUseCase.ts";
import { DeleteAvailabilityUseCase } from "../../modules/avilability/application/useCase/DeleteAvailabilityUseCase.ts";
import { AvailabilityController } from "../../modules/avilability/presentation/controllers/availability.controller.ts";
import { createAvailabilityRoutes } from "../../modules/avilability/presentation/routes/availability.routes.ts";

export const bindAvailability = (container: Container) => {
  container
    .bind<IAvailabilityRepository>(TYPES.IAvailabilityRepository)
    .to(PrismaAvailabilityRepository)
    .inSingletonScope();

  const availabilityRepository = container.get<IAvailabilityRepository>(
    TYPES.IAvailabilityRepository,
  );
  const createAvailabilityUseCase = new CreateAvailabilityUseCase(
    availabilityRepository,
  );
  const getAvailabilityUseCase = new GetAvailabilityUseCase(
    availabilityRepository,
  );
  const deleteAvailabilityUseCase = new DeleteAvailabilityUseCase(
    availabilityRepository,
  );
  const availabilityController = new AvailabilityController(
    createAvailabilityUseCase,
    getAvailabilityUseCase,
    deleteAvailabilityUseCase,
  );

  return {
    availabilityController,
    availabilityRoutes: createAvailabilityRoutes(availabilityController),
  };
};
