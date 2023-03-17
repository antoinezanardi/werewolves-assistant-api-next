import type { CreateGamePlayerDto } from "../create-game-player/create-game-player.dto";

type GamePlayersPositionTransformerParams = { value: CreateGamePlayerDto[] };

function gamePlayersPositionTransformer({ value }: GamePlayersPositionTransformerParams): CreateGamePlayerDto[] {
  if (value.some(player => player.position !== undefined)) {
    return value;
  }
  for (let i = 0; i < value.length; i++) {
    value[i].position = i;
  }
  return value;
}

export { gamePlayersPositionTransformer };