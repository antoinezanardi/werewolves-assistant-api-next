import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import type { WhiteWerewolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/white-werewolf-game-options/white-werewolf-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS = {
  wakingUpInterval: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.whiteWerewolf.wakingUpInterval,
    min: 1,
    max: 5,
  },
} as const satisfies Record<keyof WhiteWerewolfGameOptions, MongoosePropOptions>;

const WHITE_WEREWOLF_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof WhiteWerewolfGameOptions, ApiPropertyOptions>> = {
  wakingUpInterval: {
    description: "Since the first `night`, interval of `nights` when the `white werewolf` is waking up. In other words, he wakes up every other night if value is `1`",
    ...convertMongoosePropOptionsToApiPropertyOptions(WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval),
  },
};

export {
  WHITE_WEREWOLF_GAME_OPTIONS_API_PROPERTIES,
  WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS,
};