
import type { ApiPropertyOptions } from "@nestjs/swagger";

import { defaultGameOptions } from "@/modules/game/constants/game-options/game-options.constant";
import type { BigBadWolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/big-bad-wolf-game-options.schema";

const bigBadWolfGameOptionsFieldsSpecs = Object.freeze({ isPowerlessIfWerewolfDies: { default: defaultGameOptions.roles.bigBadWolf.isPowerlessIfWerewolfDies } });

const bigBadWolfGameOptionsApiProperties: Record<keyof BigBadWolfGameOptions, ApiPropertyOptions> = Object.freeze({
  isPowerlessIfWerewolfDies: {
    description: "If set to `true`, `big bad wolf` won't wake up anymore during the night if at least one player from the `werewolves` side died",
    ...bigBadWolfGameOptionsFieldsSpecs.isPowerlessIfWerewolfDies,
  },
});

export { bigBadWolfGameOptionsApiProperties, bigBadWolfGameOptionsFieldsSpecs };