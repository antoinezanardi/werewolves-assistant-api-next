import type { ROLE_NAMES } from "../../role/enums/role.enum";
import type { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../enums/player.enum";

type GameSource = PLAYER_ATTRIBUTE_NAMES.SHERIFF | PLAYER_GROUPS | ROLE_NAMES;

export type { GameSource };