import { plainToInstance } from "class-transformer";

import { Player } from "@/modules/game/schemas/player/player.schema";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createPlayer(player: Player): Player {
  return plainToInstance(Player, toJSON(player), { ...PLAIN_TO_INSTANCE_DEFAULT_OPTIONS, excludeExtraneousValues: true });
}

export { createPlayer };