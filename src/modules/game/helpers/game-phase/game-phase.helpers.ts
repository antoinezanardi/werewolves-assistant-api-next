import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import type { Game } from "@/modules/game/schemas/game.schema";

function isGamePhaseOver(game: Game): boolean {
  return !game.currentPlay;
}

function isInNightOrTwilightPhase(game: CreateGameDto | Game): boolean {
  return game.phase.name === "night" || game.phase.name === "twilight";
}

export {
  isGamePhaseOver,
  isInNightOrTwilightPhase,
};