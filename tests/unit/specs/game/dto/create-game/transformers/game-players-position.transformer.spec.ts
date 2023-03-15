import { gamePlayersPositionTransformer } from "../../../../../../../src/game/dto/create-game/transformers/game-players-position.transformer";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Game Players Position Transformer", () => {
  describe("gamePlayersPositionTransformer", () => {
    it("should return players as is when every position is set.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [{ position: 0 }, { position: 1 }, { position: 2 }, { position: 3 }]);
      expect(gamePlayersPositionTransformer({ value: players })).toStrictEqual(players);
    });

    it("should return players as is when at least one position is not set.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [{ position: 4 }, { position: 8 }, { position: 12 }]);
      expect(gamePlayersPositionTransformer({ value: players })).toStrictEqual(players);
    });

    it("should return players with sequential position when no positions are set.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [{ position: undefined }, { position: undefined }, { position: undefined }]);
      const result = gamePlayersPositionTransformer({ value: players });
      for (let i = 0; i < players.length; i++) {
        expect(result[i].position).toBe(i);
      }
    });
  });
});