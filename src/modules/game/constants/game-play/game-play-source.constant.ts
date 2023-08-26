import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { GamePlaySource } from "../../schemas/game-play/game-play-source/game-play-source.schema";
import { gameSourceValues } from "../game.constant";

const gamePlaySourceFieldsSpecs = Object.freeze<Record<keyof GamePlaySource, ApiPropertyOptions>>({
  name: {
    required: true,
    enum: gameSourceValues,
  },
  players: {
    required: false,
    default: undefined,
  },
});

const gamePlaySourceApiProperties = Object.freeze<Record<keyof GamePlaySource, ApiPropertyOptions>>({
  name: {
    description: "Source's name of the play",
    ...gamePlaySourceFieldsSpecs.name,
  },
  players: {
    description: "Expected players who will make the play. Only set for the current play, not the upcoming one",
    ...gamePlaySourceFieldsSpecs.players,
  },
});

export { gamePlaySourceFieldsSpecs, gamePlaySourceApiProperties };