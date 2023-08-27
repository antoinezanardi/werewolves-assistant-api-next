import type { ApiPropertyOptions } from "@nestjs/swagger";

import type { Player } from "@/modules/game/schemas/player/player.schema";

const playersFieldsSpecs = Object.freeze({
  name: {
    minLength: 1,
    maxLength: 30,
  },
  attributes: { default: [] },
  position: { minimum: 0 },
  isAlive: { default: true },
});

const playerApiProperties: Readonly<Record<keyof Player, ApiPropertyOptions>> = Object.freeze({
  _id: {
    description: "Player's ID",
    example: "507f1f77bcf86cd799439011",
  },
  name: {
    description: "Player's name. Unique in the array",
    example: "Antoine",
    ...playersFieldsSpecs.name,
  },
  role: { description: "Player's role" },
  side: { description: "Player's side" },
  attributes: {
    description: "An attribute is an effect or a status on a player",
    ...playersFieldsSpecs.attributes,
  },
  position: {
    description: "Unique player's position among all game's players. Increment from 0 to `players.length - 1`",
    example: 3,
    ...playersFieldsSpecs.position,
  },
  isAlive: {
    description: "If the player is currently alive or not",
    ...playersFieldsSpecs.isAlive,
  },
  death: { description: "Set if `isAlive` is `false`" },
});

export { playersFieldsSpecs, playerApiProperties };