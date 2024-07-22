import { GAME_EVENT_TYPES } from "@/modules/game/constants/game-event/game-event.constants";
import { GameEvent } from "@/modules/game/schemas/game-event/game-event.schema";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";
import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

function createFakeGameEvent(gameEvent: Partial<GameEvent> = {}): GameEvent {
  return plainToInstance(GameEvent, {
    type: gameEvent.type ?? faker.helpers.arrayElement(GAME_EVENT_TYPES),
    players: gameEvent.players,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeGameEvent };