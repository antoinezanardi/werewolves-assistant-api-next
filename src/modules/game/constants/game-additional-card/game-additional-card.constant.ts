import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ROLE_NAMES } from "../../../role/enums/role.enum";
import type { GameAdditionalCard } from "../../schemas/game-additional-card/game-additional-card.schema";

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
    description: "Game additional card role name",
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

export { gameAdditionalCardFieldsSpecs, gameAdditionalCardApiProperties };