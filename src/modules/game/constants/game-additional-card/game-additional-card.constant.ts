import type { ApiPropertyOptions } from "@nestjs/swagger";

import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { roles } from "@/modules/role/constants/role.constant";
import { ROLE_NAMES } from "@/modules/role/enums/role.enum";

const gameAdditionalCardsThiefRoleNames: Readonly<ROLE_NAMES[]> = Object.freeze(roles.filter(({ minInGame, name }) => name !== ROLE_NAMES.THIEF && minInGame === undefined).map(({ name }) => name));

const gameAdditionalCardFieldsSpecs: Readonly<Record<keyof GameAdditionalCard, ApiPropertyOptions>> = Object.freeze({
  _id: { required: true },
  roleName: {
    required: true,
    enum: ROLE_NAMES,
  },
  recipient: {
    required: true,
    enum: [ROLE_NAMES.THIEF],
  },
  isUsed: {
    required: true,
    default: false,
  },
});

const gameAdditionalCardApiProperties: Readonly<Record<keyof GameAdditionalCard, ApiPropertyOptions>> = Object.freeze({
  _id: {
    description: "Game additional card Mongo Object Id",
    ...gameAdditionalCardFieldsSpecs._id,
  },
  roleName: {
    description: `Game additional card role name. If \`recipient\` is \`${ROLE_NAMES.THIEF}\`, possible values are : ${gameAdditionalCardsThiefRoleNames.toString()}`,
    ...gameAdditionalCardFieldsSpecs.roleName,
  },
  recipient: {
    description: "Game additional card recipient",
    ...gameAdditionalCardFieldsSpecs.recipient,
  },
  isUsed: {
    description: "If set to `true`, the card has been used by its recipient",
    ...gameAdditionalCardFieldsSpecs.isUsed,
  },
});

export {
  gameAdditionalCardFieldsSpecs,
  gameAdditionalCardApiProperties,
  gameAdditionalCardsThiefRoleNames,
};