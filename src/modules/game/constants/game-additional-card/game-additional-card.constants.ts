import type { RoleName } from "@/modules/role/types/role.types";

const GAME_ADDITIONAL_CARDS_RECIPIENTS = ["thief", "actor"] as const satisfies readonly RoleName[];

export { GAME_ADDITIONAL_CARDS_RECIPIENTS };