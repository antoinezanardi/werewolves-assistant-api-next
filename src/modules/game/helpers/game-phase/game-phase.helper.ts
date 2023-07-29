import type { Game } from "../../schemas/game.schema";

function isGamePhaseOver(game: Game): boolean {
  return !game.currentPlay;
}

export { isGamePhaseOver };