import { plainToInstance } from "class-transformer";

import { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import { Player } from "@/modules/game/schemas/player/player.schema";

import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createPlayer(player: Player): Player {
  return plainToInstance(Player, toJSON(player), { ...DEFAULT_PLAIN_TO_INSTANCE_OPTIONS, excludeExtraneousValues: true });
}

function createDeadPlayer(deadPlayer: DeadPlayer): DeadPlayer {
  return plainToInstance(DeadPlayer, toJSON(deadPlayer), { ...DEFAULT_PLAIN_TO_INSTANCE_OPTIONS, excludeExtraneousValues: true });
}

export {
  createPlayer,
  createDeadPlayer,
};