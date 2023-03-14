import { roles } from "../../../../../role/constants/role.constant";
import { ROLE_NAMES } from "../../../../../role/enums/role.enum";
import type { CreateGamePlayerRoleDto } from "../create-game-player-role.dto/create-game-player-role.dto";

type PlayerRoleTransformerParams = { value: CreateGamePlayerRoleDto };

function playerRoleTransformer({ value }: PlayerRoleTransformerParams): CreateGamePlayerRoleDto {
  const role = roles.find(({ name }) => name === value.name);
  value.current = role?.name;
  value.original = role?.name;
  value.isRevealed = role?.name === ROLE_NAMES.VILLAGER_VILLAGER;
  return value;
}

export { playerRoleTransformer };