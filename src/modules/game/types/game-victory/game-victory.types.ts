import type { TupleToUnion } from "type-fest";

import type { GAME_VICTORY_TYPES } from "@/modules/game/constants/game-victory/game-victory.constants";

type GameVictoryType = TupleToUnion<typeof GAME_VICTORY_TYPES>;

export type { GameVictoryType };