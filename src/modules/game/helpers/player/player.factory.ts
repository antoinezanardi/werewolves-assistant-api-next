import { plainToInstance } from "class-transformer";

import { Player } from "@/modules/game/schemas/player/player.schema";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { toJSON } from "@tests/helpers/object/object.helper";

function createPlayer(player: Player): Player {
  return plainToInstance(Player, toJSON(player), { ...PLAIN_TO_INSTANCE_DEFAULT_OPTIONS, excludeExtraneousValues: true });
}

export { createPlayer };