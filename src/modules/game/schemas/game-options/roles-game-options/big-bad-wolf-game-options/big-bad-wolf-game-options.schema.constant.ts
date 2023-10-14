import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { BigBadWolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/big-bad-wolf-game-options/big-bad-wolf-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const BIG_BAD_WOLF_GAME_OPTIONS_FIELDS_SPECS = {
  isPowerlessIfWerewolfDies: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.bigBadWolf.isPowerlessIfWerewolfDies,
  },
} as const satisfies Record<keyof BigBadWolfGameOptions, MongoosePropOptions>;

const BIG_BAD_WOLF_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof BigBadWolfGameOptions, ApiPropertyOptions>> = {
  isPowerlessIfWerewolfDies: {
    description: "If set to `true`, `big bad wolf` won't wake up anymore during the night if at least one player from the `werewolves` side died",
    ...convertMongoosePropOptionsToApiPropertyOptions(BIG_BAD_WOLF_GAME_OPTIONS_FIELDS_SPECS.isPowerlessIfWerewolfDies),
  },
};

export {
  BIG_BAD_WOLF_GAME_OPTIONS_API_PROPERTIES,
  BIG_BAD_WOLF_GAME_OPTIONS_FIELDS_SPECS,
};