import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import type { WolfHoundGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/wolf-hound-game-options/wolf-hound-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const WOLF_HOUND_GAME_OPTIONS_FIELDS_SPECS = {
  isChosenSideRevealed: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.wolfHound.isChosenSideRevealed,
  },
  isSideRandomlyChosen: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.wolfHound.isSideRandomlyChosen,
  },
} as const satisfies Record<keyof WolfHoundGameOptions, MongoosePropOptions>;

const WOLF_HOUND_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof WolfHoundGameOptions, ApiPropertyOptions>> = {
  isChosenSideRevealed: {
    description: "If set to `true`, when `wolf-hound` chooses his side at the beginning of the game, the game master will announce the chosen side to other players",
    ...convertMongoosePropOptionsToApiPropertyOptions(WOLF_HOUND_GAME_OPTIONS_FIELDS_SPECS.isChosenSideRevealed),
  },
  isSideRandomlyChosen: {
    description: "If set to `true`, when `wolf-hound` chooses his side at the beginning of the game, the side will be randomly chosen",
    ...convertMongoosePropOptionsToApiPropertyOptions(WOLF_HOUND_GAME_OPTIONS_FIELDS_SPECS.isSideRandomlyChosen),
  },
};

export {
  WOLF_HOUND_GAME_OPTIONS_API_PROPERTIES,
  WOLF_HOUND_GAME_OPTIONS_FIELDS_SPECS,
};