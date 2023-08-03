import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { VotesGameOptions } from "../../../../../src/modules/game/schemas/game-options/votes-game-options.schema";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";

function createFakeVotesGameOptions(createVotesGameOptions: Partial<VotesGameOptions> = {}, override: object = {}): VotesGameOptions {
  return plainToInstance(VotesGameOptions, {
    canBeSkipped: createVotesGameOptions.canBeSkipped ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeVotesGameOptions };