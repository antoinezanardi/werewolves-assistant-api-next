import { plainToInstance } from "class-transformer";
import { GameOptions } from "../../../../../src/modules/game/schemas/game-options/game-options.schema";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";
import { createFakeCompositionGameOptions } from "./composition-game-options.schema.factory";
import { createFakeRolesGameOptions } from "./game-roles-options.schema.factory";
import { createFakeVotesGameOptions } from "./votes-game-options.schema.factory";

function createFakeGameOptions(gameOptions: Partial<GameOptions> = {}, override: object = {}): GameOptions {
  return plainToInstance(GameOptions, {
    composition: createFakeCompositionGameOptions(gameOptions.composition),
    votes: createFakeVotesGameOptions(gameOptions.votes),
    roles: createFakeRolesGameOptions(gameOptions.roles),
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeGameOptions };