import { plainToInstance } from "class-transformer";
import { toJSON } from "../../../../../tests/helpers/object/object.helper";
import { plainToInstanceDefaultOptions } from "../../../../shared/validation/constants/validation.constant";
import { Player } from "../../schemas/player/player.schema";

function createPlayer(player: Player): Player {
  return plainToInstance(Player, toJSON(player), { ...plainToInstanceDefaultOptions, excludeExtraneousValues: true });
}

export { createPlayer };