import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { PLAYER_ATTRIBUTE_SCHEMA } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import { PLAYER_SIDE_SCHEMA } from "@/modules/game/schemas/player/player-side/player-side.schema";
import { PLAYER_DEATH_SCHEMA } from "@/modules/game/schemas/player/player-death/player-death.schema";
import { PLAYER_ROLE_SCHEMA } from "@/modules/game/schemas/player/player-role/player-role.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const PLAYER_FIELDS_SPECS = {
  _id: { required: true },
  name: {
    required: true,
    minLength: 1,
    maxLength: 30,
  },
  role: {
    required: true,
    type: PLAYER_ROLE_SCHEMA,
  },
  side: {
    required: true,
    type: PLAYER_SIDE_SCHEMA,
  },
  attributes: {
    required: true,
    type: [PLAYER_ATTRIBUTE_SCHEMA],
    default: [],
  },
  position: {
    required: true,
    min: 0,
  },
  isAlive: {
    required: true,
    default: true,
  },
  death: {
    required: false,
    type: PLAYER_DEATH_SCHEMA,
  },
} as const satisfies Record<keyof Player, MongoosePropOptions>;

const PLAYER_API_PROPERTIES: ReadonlyDeep<Record<keyof Player, ApiPropertyOptions>> = Object.freeze({
  _id: {
    description: "Player's ID",
    example: "507f1f77bcf86cd799439011",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_FIELDS_SPECS._id),
  },
  name: {
    description: "Player's name. Unique in the array",
    example: "Antoine",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_FIELDS_SPECS.name),
  },
  role: { description: "Player's role" },
  side: { description: "Player's side" },
  attributes: {
    description: "An attribute is an effect or a status on a player",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_FIELDS_SPECS.attributes),
  },
  position: {
    description: "Unique player's position among all game's players. Increment from 0 to `players.length - 1`",
    example: 3,
    ...PLAYER_FIELDS_SPECS.position,
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_FIELDS_SPECS.position),
  },
  isAlive: {
    description: "If the player is currently alive or not",
    ...PLAYER_FIELDS_SPECS.isAlive,
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_FIELDS_SPECS.isAlive),
  },
  death: {
    description: "Set if `isAlive` is `false`",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_FIELDS_SPECS.death),
  },
});

export {
  PLAYER_FIELDS_SPECS,
  PLAYER_API_PROPERTIES,
};