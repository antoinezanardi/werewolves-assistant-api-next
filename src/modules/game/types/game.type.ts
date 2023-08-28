import type { HydratedDocument } from "mongoose";

import type { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { RoleSides, RoleNames } from "@/modules/role/enums/role.enum";

type GameDocument = HydratedDocument<Game>;

type GameSource = PlayerAttributeNames.SHERIFF | PlayerGroups | RoleNames;

type GetNearestPlayerOptions = { direction: "left" | "right"; playerSide?: RoleSides };

export type {
  GameDocument,
  GameSource,
  GetNearestPlayerOptions,
};