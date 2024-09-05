import type { RoleName } from "@/modules/role/types/role.types";

const MAX_ADDITIONAL_CARDS_COUNT_FOR_RECIPIENT = 5;

const GAME_ADDITIONAL_CARDS_RECIPIENTS = ["thief", "actor"] as const satisfies readonly RoleName[];

export {
  MAX_ADDITIONAL_CARDS_COUNT_FOR_RECIPIENT,
  GAME_ADDITIONAL_CARDS_RECIPIENTS,
};