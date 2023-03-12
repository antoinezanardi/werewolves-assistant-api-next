import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { FoxGameOptions } from "../../schemas/roles-game-options/fox-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const foxGameOptionsApiProperties: Record<keyof FoxGameOptions, ApiPropertyOptions> = Object.freeze({
  isPowerlessIfMissesWerewolf: {
    description: "If set to `true`, the `fox` will loose his power if he doesn't find a player from the `werewolves` side during his turn if he doesn't skip",
    default: defaultGameOptions.roles.fox.isPowerlessIfMissesWerewolf,
  },
});

export { foxGameOptionsApiProperties };