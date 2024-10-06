import { When } from "@cucumber/cucumber";
import { createGameFeedback } from "@tests/acceptance/features/game/helpers/game-request.helpers";
import { setGameInContext } from "@tests/acceptance/shared/helpers/context.helpers";
import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";
import { createFakeCreateGameFeedbackDto } from "@tests/factories/game/dto/create-game-feedback/create-game-feedback.dto.factory";

When(/^a feedback with score of (?<score>\d+), (?<withBug>with|without) bug and review "(?<review>[^"]*)" is posted$/u, async function(this: CustomWorld, score: string, bug: string, review: string): Promise<void> {
  const createGameFeedbackDto = createFakeCreateGameFeedbackDto({
    score: parseInt(score),
    hasEncounteredError: bug === "with",
    review,
  });
  this.response = await createGameFeedback(createGameFeedbackDto, this.game, this.app);
  setGameInContext(this.response, this);
});