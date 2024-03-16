import { plainToInstance } from "class-transformer";

import { GameOptions } from "@/modules/game/schemas/game-options/game-options.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { createFakeCompositionGameOptions } from "@tests/factories/game/schemas/game-options/composition-game-options.schema.factory";
import { createFakeRolesGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options/game-roles-options.schema.factory";
import { createFakeVotesGameOptions } from "@tests/factories/game/schemas/game-options/votes-game-options.schema.factory";

function createFakeGameOptions(gameOptions: Partial<GameOptions> = {}, override: object = {}): GameOptions {
  return plainToInstance(GameOptions, {
    composition: createFakeCompositionGameOptions(gameOptions.composition),
    votes: createFakeVotesGameOptions(gameOptions.votes),
    roles: createFakeRolesGameOptions(gameOptions.roles),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeGameOptions };