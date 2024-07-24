import { GameEvent } from "@/modules/game/schemas/game-event/game-event.schema";

import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";
import { plainToInstance } from "class-transformer";

function createGameEvent(gameEvent: GameEvent): GameEvent {
  return plainToInstance(GameEvent, toJSON(gameEvent), { ...DEFAULT_PLAIN_TO_INSTANCE_OPTIONS, excludeExtraneousValues: true });
}

export {
  createGameEvent,
};