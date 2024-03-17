import type { Game } from "@/modules/game/schemas/game.schema";

function isGamePhaseOver(game: Game): boolean {
  return !game.currentPlay;
}

export { isGamePhaseOver };