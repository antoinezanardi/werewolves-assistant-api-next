import type { ROLE_NAMES } from "../../../../../../role/enums/role.enum";
import type { PLAYER_GROUPS } from "../../../enums/player-enum";
import type { PLAYER_ATTRIBUTE_NAMES } from "../../player-attribute/enums/player-attribute.enum";

type PlayerDeathSource = PLAYER_ATTRIBUTE_NAMES.SHERIFF | PLAYER_GROUPS | ROLE_NAMES;

export type { PlayerDeathSource };