import type { TupleToUnion } from "type-fest";

import type { GAME_PLAY_SOURCE_NAMES, GAME_PLAY_TYPES } from "@/modules/game/constants/game-play/game-play.constant";
import type { Player } from "@/modules/game/schemas/player/player.schema";

type GamePlaySourceName = TupleToUnion<typeof GAME_PLAY_SOURCE_NAMES>;

type GamePlayType = TupleToUnion<typeof GAME_PLAY_TYPES>;

type PlayerVoteCount = [Player, number];

export type {
  GamePlaySourceName,
  GamePlayType,
  PlayerVoteCount,
};