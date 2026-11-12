import { Container } from "inversify";
import { TYPES } from "../types.ts";
import type { IChannelRepository } from "../../modules/channel/domain/repositories/IChannelRepository.ts";
import { PrismaChannelRepository } from "../../modules/channel/infrastructure/repositories/PrismaChannelRepository.ts";
import { CreateChannelUseCase } from "../../modules/channel/application/useCase/CreateChannelUseCase.ts";
import { ListChannelsUseCase } from "../../modules/channel/application/useCase/ListChannelsUseCase.ts";
import { ListPublicChannelsUseCase } from "../../modules/channel/application/useCase/ListPublicChannelsUseCase.ts";
import { GetPublicChannelUseCase } from "../../modules/channel/application/useCase/GetPublicChannelUseCase.ts";
import { ListPublicChannelPostsUseCase } from "../../modules/channel/application/useCase/ListPublicChannelPostsUseCase.ts";
import { UpdateChannelUseCase } from "../../modules/channel/application/useCase/UpdateChannelUseCase.ts";
import { DeleteChannelUseCase } from "../../modules/channel/application/useCase/DeleteChannelUseCase.ts";
import { GetChannelUseCase } from "../../modules/channel/application/useCase/GetChannelUseCase.ts";
import { ChannelController } from "../../modules/channel/presentation/controllers/channel.controller.ts";
import { createChannelRoutes } from "../../modules/channel/presentation/routes/channel.routes.ts";
import { PrismaChannelPostRepository } from "../../modules/channel/infrastructure/repositories/PrismaChannelPostRepository.ts";
import { S3StorageService } from "../../modules/learningMaterials/infrastructure/services/S3StorageService.ts";
import { ChannelPostController } from "../../modules/channel/presentation/controllers/channelPost.controller.ts";
import { CreateChannelPostUseCase } from "../../modules/channel/application/useCase/CreateChannelPostUseCase.ts";
import { ListChannelPostsUseCase } from "../../modules/channel/application/useCase/ListChannelPostsUseCase.ts";
import { UpdateChannelPostUseCase } from "../../modules/channel/application/useCase/UpdateChannelPostUseCase.ts";
import { DeleteChannelPostUseCase } from "../../modules/channel/application/useCase/DeleteChannelPostUseCase.ts";

export const bindChannels = (container: Container) => {
  container
    .bind<IChannelRepository>(TYPES.IChannelRepository)
    .to(PrismaChannelRepository)
    .inSingletonScope();

  const channelRepository = container.get<IChannelRepository>(
    TYPES.IChannelRepository,
  );
  const controller = new ChannelController(
    new CreateChannelUseCase(channelRepository),
    new ListChannelsUseCase(channelRepository),
    new ListPublicChannelsUseCase(channelRepository),
    new GetPublicChannelUseCase(channelRepository),
    new UpdateChannelUseCase(channelRepository),
    new DeleteChannelUseCase(channelRepository),
    new GetChannelUseCase(channelRepository),
  );
  const channelPostRepository = new PrismaChannelPostRepository();
  const storageService = new S3StorageService();
  const channelPostController = new ChannelPostController(
    new CreateChannelPostUseCase(channelPostRepository, storageService),
    new ListChannelPostsUseCase(channelPostRepository, storageService),
    new ListPublicChannelPostsUseCase(channelPostRepository, storageService),
    new UpdateChannelPostUseCase(channelPostRepository, storageService),
    new DeleteChannelPostUseCase(channelPostRepository, storageService),
  );

  return {
    channelController: controller,
    channelPostController,
    channelRoutes: createChannelRoutes(controller, channelPostController),
  };
};
