import type { ApiPropertyOptions } from "@nestjs/swagger";

import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { ROLES } from "@/modules/role/constants/role.constant";
import { RoleNames } from "@/modules/role/enums/role.enum";

const GAME_ADDITIONAL_CARDS_THIEF_ROLE_NAMES: Readonly<RoleNames[]> = Object.freeze(ROLES.filter(({ minInGame, name }) => name !== RoleNames.THIEF && minInGame === undefined).map(({ name }) => name));

const GAME_ADDITIONAL_CARDS_FIELDS_SPECS: Readonly<Record<keyof GameAdditionalCard, ApiPropertyOptions>> = Object.freeze({
  _id: { required: true },
  roleName: {
    required: true,
    enum: RoleNames,
  },
  recipient: {
    required: true,
    enum: [RoleNames.THIEF],
  },
  isUsed: {
    required: true,
    default: false,
  },
});

const GAME_ADDITIONAL_CARDS_API_PROPERTIES: Readonly<Record<keyof GameAdditionalCard, ApiPropertyOptions>> = Object.freeze({
  _id: {
    description: "Game additional card Mongo Object Id",
    ...GAME_ADDITIONAL_CARDS_FIELDS_SPECS._id,
  },
  roleName: {
    description: `Game additional card role name. If \`recipient\` is \`${RoleNames.THIEF}\`, possible values are : ${GAME_ADDITIONAL_CARDS_THIEF_ROLE_NAMES.toString()}`,
    ...GAME_ADDITIONAL_CARDS_FIELDS_SPECS.roleName,
  },
  recipient: {
    description: "Game additional card recipient",
    ...GAME_ADDITIONAL_CARDS_FIELDS_SPECS.recipient,
  },
  isUsed: {
    description: "If set to `true`, the card has been used by its recipient",
    ...GAME_ADDITIONAL_CARDS_FIELDS_SPECS.isUsed,
  },
});

export {
  GAME_ADDITIONAL_CARDS_THIEF_ROLE_NAMES,
  GAME_ADDITIONAL_CARDS_FIELDS_SPECS,
  GAME_ADDITIONAL_CARDS_API_PROPERTIES,
};