import { plainToInstance } from "class-transformer";
import { plainToInstanceDefaultOptions } from "../../../../shared/validation/constants/validation.constant";
import { Player } from "../../schemas/player/player.schema";

function createPlayer(player: Player): Player {
  return plainToInstance(Player, player, plainToInstanceDefaultOptions);
}

export { createPlayer };