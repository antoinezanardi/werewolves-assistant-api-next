import type { TupleToUnion } from "type-fest";

import type { PLAYER_DEATH_CAUSES } from "@/modules/game/constants/player/player-death/player-death.constants";

type PlayerDeathCause = TupleToUnion<typeof PLAYER_DEATH_CAUSES>;

export type { PlayerDeathCause };