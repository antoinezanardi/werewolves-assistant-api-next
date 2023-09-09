import { ROLES } from "@/modules/role/constants/role.constant";
import { RoleNames } from "@/modules/role/enums/role.enum";

const GAME_ADDITIONAL_CARDS_THIEF_ROLE_NAMES: Readonly<RoleNames[]> = Object.freeze(ROLES.filter(({ minInGame, name }) => name !== RoleNames.THIEF && minInGame === undefined).map(({ name }) => name));

export { GAME_ADDITIONAL_CARDS_THIEF_ROLE_NAMES };