import { GAME_PHASES, GAME_STATUSES } from "../../../../../../src/modules/game/enums/game.enum";
import { createGame } from "../../../../../../src/modules/game/helpers/game.factory";
import type { Game } from "../../../../../../src/modules/game/schemas/game.schema";
import { createFakeGameOptions } from "../../../../../factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeGamePlayAllElectSheriff, createFakeGamePlayAllVote } from "../../../../../factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "../../../../../factories/game/schemas/game.schema.factory";
import { createFakePlayer } from "../../../../../factories/game/schemas/player/player.schema.factory";
import { createFakeObjectId } from "../../../../../factories/shared/mongoose/mongoose.factory";

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