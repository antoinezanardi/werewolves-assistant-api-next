import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { WITCH_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/witch-game-options/witch-game-options.schema";
import { ELDER_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/elder-game-options/elder-game-options.schema";
import { BEAR_TAMER_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/bear-tamer-game-options/bear-tamer-game-options.schema";
import { BIG_BAD_WOLF_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/big-bad-wolf-game-options/big-bad-wolf-game-options.schema";
import { DOG_WOLF_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/dog-wolf-game-options/dog-wolf-game-options.schema";
import { FOX_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/fox-game-options/fox-game-options.schema";
import { DEFENDER_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/defender-game-options/defender-game-options.schema";
import { IDIOT_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/idiot-game-options/idiot-game-options.schema";
import { LITTLE_GIRL_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/little-girl-game-options/little-girl-game-options.schema";
import { PIED_PIPER_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/pied-piper-game-options/pied-piper-game-options.schema";
import { SCANDALMONGER_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/scandalmonger-game-options/scandalmonger-game-options.schema";
import { SEER_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/seer-game-options/seer-game-options.schema";
import { SHERIFF_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema";
import { STUTTERING_JUDGE_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/stuttering-judge-game-options/stuttering-judge-game-options.schema";
import { THIEF_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/thief-game-options/thief-game-options.schema";
import { THREE_BROTHERS_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/three-brothers-game-options/three-brothers-game-options.schema";
import { TWO_SISTERS_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/two-sisters-game-options/two-sisters-game-options.schema";
import { WHITE_WEREWOLF_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/white-werewolf-game-options/white-werewolf-game-options.schema";
import { WILD_CHILD_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/wild-child-game-options/wild-child-game-options.schema";
import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { RolesGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/roles-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const ROLES_GAME_OPTIONS_FIELDS_SPECS = {
  areRevealedOnDeath: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.areRevealedOnDeath,
  },
  doSkipCallIfNoTarget: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.doSkipCallIfNoTarget,
  },
  sheriff: {
    required: true,
    type: SHERIFF_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.sheriff,
  },
  bigBadWolf: {
    required: true,
    type: BIG_BAD_WOLF_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.bigBadWolf,
  },
  whiteWerewolf: {
    required: true,
    type: WHITE_WEREWOLF_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.whiteWerewolf,
  },
  seer: {
    required: true,
    type: SEER_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.seer,
  },
  littleGirl: {
    required: true,
    type: LITTLE_GIRL_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.littleGirl,
  },
  defender: {
    required: true,
    type: DEFENDER_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.defender,
  },
  elder: {
    required: true,
    type: ELDER_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.elder,
  },
  idiot: {
    required: true,
    type: IDIOT_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.idiot,
  },
  twoSisters: {
    required: true,
    type: TWO_SISTERS_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.twoSisters,
  },
  threeBrothers: {
    required: true,
    type: THREE_BROTHERS_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.threeBrothers,
  },
  fox: {
    required: true,
    type: FOX_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.fox,
  },
  bearTamer: {
    required: true,
    type: BEAR_TAMER_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.bearTamer,
  },
  stutteringJudge: {
    required: true,
    type: STUTTERING_JUDGE_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.stutteringJudge,
  },
  wildChild: {
    required: true,
    type: WILD_CHILD_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.wildChild,
  },
  dogWolf: {
    required: true,
    type: DOG_WOLF_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.dogWolf,
  },
  thief: {
    required: true,
    type: THIEF_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.thief,
  },
  piedPiper: {
    required: true,
    type: PIED_PIPER_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.piedPiper,
  },
  scandalmonger: {
    required: true,
    type: SCANDALMONGER_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.scandalmonger,
  },
  witch: {
    required: true,
    type: WITCH_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.witch,
  },
} as const satisfies Record<keyof RolesGameOptions, MongoosePropOptions>;

const ROLES_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof RolesGameOptions, ApiPropertyOptions>> = {
  areRevealedOnDeath: {
    description: "If set to `true`, player's role is revealed when he's dead",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.areRevealedOnDeath),
  },
  doSkipCallIfNoTarget: {
    description: "If set to `true`, player's role won't be called if there is no target available for him",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.doSkipCallIfNoTarget),
  },
  sheriff: {
    description: "Game `sheriff` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.sheriff),
  },
  bigBadWolf: {
    description: "Game `big bad wolf` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.bigBadWolf),
  },
  whiteWerewolf: {
    description: "Game `white werewolf` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.whiteWerewolf),
  },
  seer: {
    description: "Game `seer` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.seer),
  },
  littleGirl: {
    description: "Game `little girl` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.littleGirl),
  },
  defender: {
    description: "Game `defender` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.defender),
  },
  elder: {
    description: "Game `elder` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.elder),
  },
  idiot: {
    description: "Game `idiot` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.idiot),
  },
  twoSisters: {
    description: "Game `two sisters` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.twoSisters),
  },
  threeBrothers: {
    description: "Game `three brothers` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.threeBrothers),
  },
  fox: { description: "Game `fox` role's options." },
  bearTamer: {
    description: "Game `bear tamer` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.bearTamer),
  },
  stutteringJudge: {
    description: "Game `stuttering judge` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.stutteringJudge),
  },
  wildChild: {
    description: "Game `wild child` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.wildChild),
  },
  dogWolf: {
    description: "Game `dog wolf` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.dogWolf),
  },
  thief: {
    description: "Game `thief` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.thief),
  },
  piedPiper: {
    description: "Game `pied piper` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.piedPiper),
  },
  scandalmonger: {
    description: "Game `scandalmonger` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.scandalmonger),
  },
  witch: {
    description: "Game `witch` role's options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ROLES_GAME_OPTIONS_FIELDS_SPECS.witch),
  },
};

export {
  ROLES_GAME_OPTIONS_API_PROPERTIES,
  ROLES_GAME_OPTIONS_FIELDS_SPECS,
};