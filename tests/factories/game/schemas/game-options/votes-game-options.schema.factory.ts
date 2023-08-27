import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { VotesGameOptions } from "@/modules/game/schemas/game-options/votes-game-options.schema";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

function createFakeVotesGameOptions(createVotesGameOptions: Partial<VotesGameOptions> = {}, override: object = {}): VotesGameOptions {
  return plainToInstance(VotesGameOptions, {
    canBeSkipped: createVotesGameOptions.canBeSkipped ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeVotesGameOptions };