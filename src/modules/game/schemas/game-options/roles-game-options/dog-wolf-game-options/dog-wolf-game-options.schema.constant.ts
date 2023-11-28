import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { DogWolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/dog-wolf-game-options/dog-wolf-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const DOG_WOLF_GAME_OPTIONS_FIELDS_SPECS = {
  isChosenSideRevealed: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.dogWolf.isChosenSideRevealed,
  },
  isSideRandomlyChosen: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.dogWolf.isSideRandomlyChosen,
  },
} as const satisfies Record<keyof DogWolfGameOptions, MongoosePropOptions>;

const DOG_WOLF_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof DogWolfGameOptions, ApiPropertyOptions>> = {
  isChosenSideRevealed: {
    description: "If set to `true`, when `dog-wolf` chooses his side at the beginning of the game, the game master will announce the chosen side to other players",
    ...convertMongoosePropOptionsToApiPropertyOptions(DOG_WOLF_GAME_OPTIONS_FIELDS_SPECS.isChosenSideRevealed),
  },
  isSideRandomlyChosen: {
    description: "If set to `true`, when `dog-wolf` chooses his side at the beginning of the game, the side will be randomly chosen",
    ...convertMongoosePropOptionsToApiPropertyOptions(DOG_WOLF_GAME_OPTIONS_FIELDS_SPECS.isSideRandomlyChosen),
  },
};

export {
  DOG_WOLF_GAME_OPTIONS_API_PROPERTIES,
  DOG_WOLF_GAME_OPTIONS_FIELDS_SPECS,
};