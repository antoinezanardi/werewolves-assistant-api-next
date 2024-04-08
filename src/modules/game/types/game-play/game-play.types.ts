import type { TupleToUnion } from "type-fest";

import type { GAME_PLAY_ACTIONS, GAME_PLAY_CAUSES, GAME_PLAY_OCCURRENCES, GAME_PLAY_SOURCE_NAMES, GAME_PLAY_TYPES, WITCH_POTIONS } from "@/modules/game/constants/game-play/game-play.constants";
import type { Player } from "@/modules/game/schemas/player/player.schema";

type GamePlaySourceName = TupleToUnion<typeof GAME_PLAY_SOURCE_NAMES>;

type GamePlayAction = TupleToUnion<typeof GAME_PLAY_ACTIONS>;

type GamePlayType = TupleToUnion<typeof GAME_PLAY_TYPES>;

type GamePlayCause = TupleToUnion<typeof GAME_PLAY_CAUSES>;

type GamePlayOccurrence = TupleToUnion<typeof GAME_PLAY_OCCURRENCES>;

type WitchPotion = TupleToUnion<typeof WITCH_POTIONS>;

type PlayerVoteCount = [Player, number];

export type {
  GamePlaySourceName,
  GamePlayAction,
  GamePlayType,
  GamePlayCause,
  GamePlayOccurrence,
  WitchPotion,
  PlayerVoteCount,
};