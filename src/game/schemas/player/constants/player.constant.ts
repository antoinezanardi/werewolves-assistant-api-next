import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ROLE_NAMES } from "../../../../role/enums/role.enum";
import type { Player } from "../schemas/player.schema";

const playerNameSpecs = Object.freeze({
  minLength: 1,
  maxLength: 30,
});

const playerApiProperties: Record<keyof Player, ApiPropertyOptions> = Object.freeze({
  _id: {
    description: "Player's ID",
    example: "507f1f77bcf86cd799439011",
  },
  name: {
    description: "Player's name. Unique in the array",
    example: "Antoine",
    minLength: playerNameSpecs.minLength,
    maxLength: playerNameSpecs.maxLength,
  },
  role: {
    description: "Player's role",
    example: ROLE_NAMES.WITCH,
  },
  position: {
    description: "Unique player's position among all game's players. Increment from 0 to `players.length - 1`",
    example: 3,
  },
});

export { playerNameSpecs, playerApiProperties };