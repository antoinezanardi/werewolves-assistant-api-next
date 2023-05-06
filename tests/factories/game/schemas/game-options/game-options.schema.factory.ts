import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { GameOptions } from "../../../../../src/modules/game/schemas/game-options/game-options.schema";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";
import { createFakeRolesGameOptions } from "./game-roles-options.schema.factory";

function createFakeGameOptions(gameOptions: Partial<GameOptions> = {}, override: object = {}): GameOptions {
  return plainToInstance(GameOptions, {
    composition: { isHidden: gameOptions.composition?.isHidden ?? faker.datatype.boolean() },
    roles: createFakeRolesGameOptions(gameOptions.roles),
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeGameOptions };