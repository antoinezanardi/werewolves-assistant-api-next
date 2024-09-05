import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import type { ThiefGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/thief-game-options/thief-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const THIEF_GAME_OPTIONS_FIELDS_SPECS = {
  mustChooseBetweenWerewolves: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.thief.mustChooseBetweenWerewolves,
  },
  isChosenCardRevealed: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.thief.isChosenCardRevealed,
  },
} as const satisfies Record<keyof ThiefGameOptions, MongoosePropOptions>;

const THIEF_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof ThiefGameOptions, ApiPropertyOptions>> = {
  mustChooseBetweenWerewolves: {
    description: "If set to `true`, if all `thief` additional cards are from the `werewolves` side, he can't skip and must choose one",
    ...convertMongoosePropOptionsToApiPropertyOptions(THIEF_GAME_OPTIONS_FIELDS_SPECS.mustChooseBetweenWerewolves),
  },
  isChosenCardRevealed: {
    description: "If set to `true`, the `thief` chosen card is revealed to every other players",
    ...convertMongoosePropOptionsToApiPropertyOptions(THIEF_GAME_OPTIONS_FIELDS_SPECS.isChosenCardRevealed),
  },
};

export {
  THIEF_GAME_OPTIONS_API_PROPERTIES,
  THIEF_GAME_OPTIONS_FIELDS_SPECS,
};