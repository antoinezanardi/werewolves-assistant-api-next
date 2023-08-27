import { plainToInstance } from "class-transformer";

import { Player } from "@/modules/game/schemas/player/player.schema";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

import { toJSON } from "@tests/helpers/object/object.helper";

function createPlayer(player: Player): Player {
  return plainToInstance(Player, toJSON(player), { ...plainToInstanceDefaultOptions, excludeExtraneousValues: true });
}

export { createPlayer };