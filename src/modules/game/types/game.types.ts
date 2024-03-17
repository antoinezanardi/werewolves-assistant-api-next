import type { HydratedDocument } from "mongoose";
import type { TupleToUnion } from "type-fest";

import type { GAME_SOURCES } from "@/modules/game/constants/game.constants";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { RoleSides } from "@/modules/role/enums/role.enum";

type GameDocument = HydratedDocument<Game>;

type GameSource = TupleToUnion<typeof GAME_SOURCES>;

type GetNearestPlayerOptions = { direction: "left" | "right"; playerSide?: RoleSides };

export type {
  GameDocument,
  GameSource,
  GetNearestPlayerOptions,
};