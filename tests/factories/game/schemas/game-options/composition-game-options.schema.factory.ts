import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { CompositionGameOptions } from "@/modules/game/schemas/game-options/composition-game-options.schema";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

function createFakeCompositionGameOptions(compositionGameOptions: Partial<CompositionGameOptions> = {}, override: object = {}): CompositionGameOptions {
  return plainToInstance(CompositionGameOptions, {
    isHidden: compositionGameOptions.isHidden ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeCompositionGameOptions };