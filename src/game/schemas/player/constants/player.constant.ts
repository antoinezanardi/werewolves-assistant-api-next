import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ROLE_NAMES } from "../../../../role/enums/role.enum";
import type { Player } from "../schemas/player.schema";

const playersFieldsSpecs = Object.freeze({
  name: {
    minLength: 1,
    maxLength: 30,
  },
  position: { minimum: 0 },
});

const playerApiProperties: Record<keyof Player, ApiPropertyOptions> = Object.freeze({
  _id: {
    description: "Player's ID",
    example: "507f1f77bcf86cd799439011",
  },
  name: {
    description: "Player's name. Unique in the array",
    example: "Antoine",
    ...playersFieldsSpecs.name,
  },
  role: {
    description: "Player's role",
    example: ROLE_NAMES.WITCH,
  },
  position: {
    description: "Unique player's position among all game's players. Increment from 0 to `players.length - 1`",
    example: 3,
    ...playersFieldsSpecs.position,
  },
});

export { playersFieldsSpecs, playerApiProperties };