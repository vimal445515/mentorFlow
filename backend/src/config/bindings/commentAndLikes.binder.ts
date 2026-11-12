import { PrismaPostInteractionRepository } from "../../modules/commentAndLikes/infrastructure/repositories/PrismaPostInteractionRepository.ts";
import { PostInteractionsUseCase } from "../../modules/commentAndLikes/application/useCase/PostInteractionsUseCase.ts";
import { PostInteractionController } from "../../modules/commentAndLikes/presentation/controllers/postInteraction.controller.ts";
import { createCommentAndLikesRoutes } from "../../modules/commentAndLikes/presentation/routes/commentAndLikes.routes.ts";

export function bindCommentAndLikes() {
  const repository = new PrismaPostInteractionRepository();
  const controller = new PostInteractionController(new PostInteractionsUseCase(repository));

  return {
    repository,
    routes: createCommentAndLikesRoutes(controller),
  };
}
