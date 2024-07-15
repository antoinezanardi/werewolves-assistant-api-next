import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import type { WerewolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/werewolf-game-options/werewolf-game-options.schema";
import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

const WEREWOLF_GAME_OPTIONS_FIELDS_SPECS = {
  canEatEachOther: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.werewolf.canEatEachOther,
  },
} as const satisfies Record<keyof WerewolfGameOptions, MongoosePropOptions>;

const WEREWOLF_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof WerewolfGameOptions, ApiPropertyOptions>> = {
  canEatEachOther: {
    description: "Whether the `werewolves` can eat each other or not. It's not possible for an alone `werewolf` to eat himself if set to true.",
    ...convertMongoosePropOptionsToApiPropertyOptions(WEREWOLF_GAME_OPTIONS_FIELDS_SPECS.canEatEachOther),
  },
};

export {
  WEREWOLF_GAME_OPTIONS_API_PROPERTIES,
  WEREWOLF_GAME_OPTIONS_FIELDS_SPECS,
};