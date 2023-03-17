import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ROLE_NAMES } from "../../../../../../role/enums/role.enum";
import { PLAYER_GROUPS } from "../../../enums/player-enum";
import { PLAYER_ATTRIBUTE_NAMES } from "../../player-attribute/enums/player-attribute.enum";
import type { PlayerDeath } from "../schemas/player-death.schema";

const playerDeathApiProperties: Record<keyof PlayerDeath, ApiPropertyOptions> = Object.freeze({
  source: {
    description: "Which entity killed the player",
    enum: [...Object.values(PLAYER_GROUPS), ...Object.values(ROLE_NAMES), PLAYER_ATTRIBUTE_NAMES.SHERIFF],
  },
  cause: { description: "Death's cause of the player" },
});

export { playerDeathApiProperties };