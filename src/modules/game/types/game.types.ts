import type { HydratedDocument } from "mongoose";
import type { TupleToUnion } from "type-fest";

import type { RoleSide } from "@/modules/role/types/role.types";
import type { GAME_PHASES, GAME_SOURCES, GAME_STATUSES } from "@/modules/game/constants/game.constants";
import type { Game } from "@/modules/game/schemas/game.schema";

type GameDocument = HydratedDocument<Game>;

type GamePhase = TupleToUnion<typeof GAME_PHASES>;

type GameStatus = TupleToUnion<typeof GAME_STATUSES>;

type GameSource = TupleToUnion<typeof GAME_SOURCES>;

type GetNearestPlayerOptions = { direction: "left" | "right"; playerSide?: RoleSide };

export type {
  GameDocument,
  GamePhase,
  GameStatus,
  GameSource,
  GetNearestPlayerOptions,
};