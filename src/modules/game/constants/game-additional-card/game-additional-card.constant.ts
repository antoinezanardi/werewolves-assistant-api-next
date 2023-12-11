import { RoleNames } from "@/modules/role/enums/role.enum";

const GAME_ADDITIONAL_CARDS_RECIPIENTS = [RoleNames.THIEF, RoleNames.ACTOR] as const satisfies Readonly<(RoleNames)[]>;

export { GAME_ADDITIONAL_CARDS_RECIPIENTS };