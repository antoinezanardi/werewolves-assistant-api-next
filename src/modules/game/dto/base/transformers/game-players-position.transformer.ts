import type { TransformFnParams } from "class-transformer/types/interfaces";
import { has } from "lodash";

function gamePlayersPositionTransformer(params: TransformFnParams): unknown {
  if (!Array.isArray(params.value)) {
    return params.value;
  }
  const value = params.value as unknown[];
  if (value.some(player => typeof player !== "object" ||
    has(player, "position") && (player as { position: number | undefined }).position !== undefined)) {
    return value;
  }
  const players = value as { position: number | undefined }[];
  for (let i = 0; i < value.length; i++) {
    players[i].position = i;
  }
  return value;
}

export { gamePlayersPositionTransformer };