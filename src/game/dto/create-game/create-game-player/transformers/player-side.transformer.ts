import { roles } from "../../../../../role/constants/role.constant";
import type { CreateGamePlayerSideDto } from "../create-game-player-side.dto/create-game-player-side.dto";
import type { CreateGamePlayerDto } from "../create-game-player.dto";

type PlayerRoleTransformerParams = { value: CreateGamePlayerSideDto; obj: CreateGamePlayerDto };

function playerSideTransformer({ value, obj }: PlayerRoleTransformerParams): CreateGamePlayerSideDto {
  const role = roles.find(({ name }) => name === obj.role.name);
  value.current = role?.side;
  value.original = role?.side;
  return value;
}

export { playerSideTransformer };