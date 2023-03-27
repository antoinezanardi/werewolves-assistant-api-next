import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { SeerGameOptions } from "../../../schemas/game-options/roles-game-options/seer-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const seerGameOptionsFieldsSpecs = Object.freeze({
  isTalkative: { default: defaultGameOptions.roles.seer.isTalkative },
  canSeeRoles: { default: defaultGameOptions.roles.seer.canSeeRoles },
});

const seerGameOptionsApiProperties: Record<keyof SeerGameOptions, ApiPropertyOptions> = Object.freeze({
  isTalkative: {
    description: "If set to `true`, the game master must say out loud what the `seer` saw during her night, otherwise, he must mime the seen role to the `seer`",
    ...seerGameOptionsFieldsSpecs.isTalkative,
  },
  canSeeRoles: {
    description: "If set to `true`, the seer can see the exact `role` of the target, otherwise, she only sees the `side`",
    ...seerGameOptionsFieldsSpecs.canSeeRoles,
  },
});

export { seerGameOptionsApiProperties, seerGameOptionsFieldsSpecs };