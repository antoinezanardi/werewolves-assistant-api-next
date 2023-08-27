import { GAME_PHASES, GAME_STATUSES } from "@/modules/game/enums/game.enum";
import { createGame } from "@/modules/game/helpers/game.factory";
import type { Game } from "@/modules/game/schemas/game.schema";

import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeGamePlayAllElectSheriff, createFakeGamePlayAllVote } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

describe("Game Factory", () => {
  describe("createGame", () => {
    it("should create a game when called.", () => {
      const game: Game = {
        _id: createFakeObjectId(),
        currentPlay: createFakeGamePlayAllVote(),
        tick: 1,
        turn: 2,
        phase: GAME_PHASES.DAY,
        players: [createFakePlayer()],
        options: createFakeGameOptions(),
        upcomingPlays: [createFakeGamePlayAllElectSheriff()],
        status: GAME_STATUSES.PLAYING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      expect(createGame(game)).toStrictEqual<Game>(createFakeGame(game));
    });
  });
});