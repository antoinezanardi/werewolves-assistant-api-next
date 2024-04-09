import type { TupleToUnion } from "type-fest";

import type { PLAYER_GROUPS } from "@/modules/game/constants/player/player.constants";

type PlayerGroup = TupleToUnion<typeof PLAYER_GROUPS>;

export type { PlayerGroup };