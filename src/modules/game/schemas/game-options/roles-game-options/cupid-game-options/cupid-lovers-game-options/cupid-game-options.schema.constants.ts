import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import type { CupidLoversGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/cupid-game-options/cupid-lovers-game-options/cupid-game-options.schema";
import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const CUPID_LOVERS_GAME_OPTIONS_FIELDS_SPECS = {
  doRevealRoleToEachOther: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.cupid.lovers.doRevealRoleToEachOther,
  },
} as const satisfies Record<keyof CupidLoversGameOptions, MongoosePropOptions>;

const CUPID_LOVERS_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof CupidLoversGameOptions, ApiPropertyOptions>> = {
  doRevealRoleToEachOther: {
    description: "If set to `true`, the lovers will know each other's role when they are meeting at the beginning of the game",
    ...convertMongoosePropOptionsToApiPropertyOptions(CUPID_LOVERS_GAME_OPTIONS_FIELDS_SPECS.doRevealRoleToEachOther),
  },
};

export {
  CUPID_LOVERS_GAME_OPTIONS_API_PROPERTIES,
  CUPID_LOVERS_GAME_OPTIONS_FIELDS_SPECS,
};