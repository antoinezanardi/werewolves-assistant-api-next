import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLES } from "@/modules/role/constants/role.constant";
import { GAME_ADDITIONAL_CARDS_RECIPIENTS } from "@/modules/game/constants/game-additional-card/game-additional-card.constant";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";
import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";

const GAME_ADDITIONAL_CARDS_FIELDS_SPECS = {
  _id: { required: true },
  roleName: {
    required: true,
    enum: Object.values(RoleNames),
  },
  recipient: {
    required: true,
    enum: GAME_ADDITIONAL_CARDS_RECIPIENTS,
  },
  isUsed: {
    required: true,
    default: false,
  },
} as const satisfies Record<keyof GameAdditionalCard, MongoosePropOptions>;

const GAME_ADDITIONAL_CARDS_API_PROPERTIES: ReadonlyDeep<Record<keyof GameAdditionalCard, ApiPropertyOptions>> = {
  _id: {
    description: "Game additional card Mongo Object Id",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_ADDITIONAL_CARDS_FIELDS_SPECS._id),
  },
  roleName: {
    description: `Game additional card role name. If \`recipient\` is \`${RoleNames.THIEF}\`, possible values are : ${ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLES.toString()}`,
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_ADDITIONAL_CARDS_FIELDS_SPECS.roleName),
  },
  recipient: {
    description: "Game additional card recipient",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_ADDITIONAL_CARDS_FIELDS_SPECS.recipient),
  },
  isUsed: {
    description: "If set to `true`, the card has been used by its recipient",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_ADDITIONAL_CARDS_FIELDS_SPECS.isUsed),
  },
};

export {
  GAME_ADDITIONAL_CARDS_FIELDS_SPECS,
  GAME_ADDITIONAL_CARDS_API_PROPERTIES,
};