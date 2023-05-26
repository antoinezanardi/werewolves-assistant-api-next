import type { ROLE_SIDES, ROLE_NAMES } from "../../role/enums/role.enum";
import type { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../enums/player.enum";

type GameSource = PLAYER_ATTRIBUTE_NAMES.SHERIFF | PLAYER_GROUPS | ROLE_NAMES;

type GetNearestPlayerOptions = { direction: "left" | "right"; playerSide?: ROLE_SIDES };

export type {
  GameSource,
  GetNearestPlayerOptions,
};