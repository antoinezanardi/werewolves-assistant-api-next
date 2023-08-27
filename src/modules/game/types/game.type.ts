import type { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "@/modules/game/enums/player.enum";
import type { ROLE_SIDES, ROLE_NAMES } from "@/modules/role/enums/role.enum";

type GameSource = PLAYER_ATTRIBUTE_NAMES.SHERIFF | PLAYER_GROUPS | ROLE_NAMES;

type GetNearestPlayerOptions = { direction: "left" | "right"; playerSide?: ROLE_SIDES };

export type {
  GameSource,
  GetNearestPlayerOptions,
};