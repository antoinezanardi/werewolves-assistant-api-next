import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { BigBadWolfGameOptions } from "../../schemas/roles-game-options/big-bad-wolf-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const bigBadWolfGameOptionsFieldsSpecs = Object.freeze({ isPowerlessIfWerewolfDies: { default: defaultGameOptions.roles.bigBadWolf.isPowerlessIfWerewolfDies } });

const bigBadWolfGameOptionsApiProperties: Record<keyof BigBadWolfGameOptions, ApiPropertyOptions> = Object.freeze({
  isPowerlessIfWerewolfDies: {
    description: "If set to `true`, `big bad wolf` won't wake up anymore during the night if at least one player from the `werewolves` side died",
    ...bigBadWolfGameOptionsFieldsSpecs.isPowerlessIfWerewolfDies,
  },
});

export { bigBadWolfGameOptionsApiProperties, bigBadWolfGameOptionsFieldsSpecs };