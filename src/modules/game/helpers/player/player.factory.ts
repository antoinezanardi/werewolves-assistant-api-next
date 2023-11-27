import { plainToInstance } from "class-transformer";

import { Player } from "@/modules/game/schemas/player/player.schema";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createPlayer(player: Player): Player {
  return plainToInstance(Player, toJSON(player), { ...DEFAULT_PLAIN_TO_INSTANCE_OPTIONS, excludeExtraneousValues: true });
}

export { createPlayer };