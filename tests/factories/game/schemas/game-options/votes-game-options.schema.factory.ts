import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { VotesGameOptions } from "@/modules/game/schemas/game-options/votes-game-options.schema";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createFakeVotesGameOptions(createVotesGameOptions: Partial<VotesGameOptions> = {}, override: object = {}): VotesGameOptions {
  return plainToInstance(VotesGameOptions, {
    canBeSkipped: createVotesGameOptions.canBeSkipped ?? faker.datatype.boolean(),
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createFakeVotesGameOptions };