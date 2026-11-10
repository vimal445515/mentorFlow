import { Container } from "inversify";
import { TYPES } from "../types.ts";
import type { IChannelRepository } from "../../modules/channel/domain/repositories/IChannelRepository.ts";
import { PrismaChannelRepository } from "../../modules/channel/infrastructure/repositories/PrismaChannelRepository.ts";
import { CreateChannelUseCase } from "../../modules/channel/application/useCase/CreateChannelUseCase.ts";
import { ListChannelsUseCase } from "../../modules/channel/application/useCase/ListChannelsUseCase.ts";
import { UpdateChannelUseCase } from "../../modules/channel/application/useCase/UpdateChannelUseCase.ts";
import { DeleteChannelUseCase } from "../../modules/channel/application/useCase/DeleteChannelUseCase.ts";
import { ChannelController } from "../../modules/channel/presentation/controllers/channel.controller.ts";
import { createChannelRoutes } from "../../modules/channel/presentation/routes/channel.routes.ts";

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
    new UpdateChannelUseCase(channelRepository),
    new DeleteChannelUseCase(channelRepository),
  );

  return {
    channelController: controller,
    channelRoutes: createChannelRoutes(controller),
  };
};
