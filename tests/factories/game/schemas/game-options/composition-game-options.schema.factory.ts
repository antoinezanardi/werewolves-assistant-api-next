import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { CompositionGameOptions } from "@/modules/game/schemas/game-options/composition-game-options/composition-game-options.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createFakeCompositionGameOptions(compositionGameOptions: Partial<CompositionGameOptions> = {}, override: object = {}): CompositionGameOptions {
  return plainToInstance(CompositionGameOptions, {
    isHidden: compositionGameOptions.isHidden ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeCompositionGameOptions };