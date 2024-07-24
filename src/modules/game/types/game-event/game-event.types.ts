import type { GAME_EVENT_TYPES } from "@/modules/game/constants/game-event/game-event.constants";
import type { TupleToUnion } from "type-fest";

type GameEventType = TupleToUnion<typeof GAME_EVENT_TYPES>;

export type { GameEventType };