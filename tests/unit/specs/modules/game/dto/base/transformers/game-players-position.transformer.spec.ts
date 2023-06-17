import type { TransformFnParams } from "class-transformer/types/interfaces";
import { gamePlayersPositionTransformer } from "../../../../../../../../src/modules/game/dto/base/transformers/game-players-position.transformer";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Game Players Position Transformer", () => {
  describe("gamePlayersPositionTransformer", () => {
    it("should return same value when value is not an array.", () => {
      expect(gamePlayersPositionTransformer({ value: null } as TransformFnParams)).toBeNull();
    });

    it("should return same value when one value of the array is not object.", () => {
      const value = [...bulkCreateFakeCreateGamePlayerDto(3), "toto"];

      expect(gamePlayersPositionTransformer({ value } as TransformFnParams)).toStrictEqual(value);
    });

    it("should return players as is when every position is set.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [{ position: 0 }, { position: 1 }, { position: 2 }, { position: 3 }]);

      expect(gamePlayersPositionTransformer({ value: players } as TransformFnParams)).toStrictEqual(players);
    });

    it("should return players as is when at least one position is not set.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [{ position: 4 }, { position: 8 }, { position: 12 }]);

      expect(gamePlayersPositionTransformer({ value: players } as TransformFnParams)).toStrictEqual(players);
    });

    it("should return players with sequential position when no positions are set.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [{ position: undefined }, { position: undefined }, { position: undefined }]);
      const result = gamePlayersPositionTransformer({ value: players } as TransformFnParams);

      for (let i = 0; i < players.length; i++) {
        expect((result as { position: number }[])[i].position).toBe(i);
      }
    });
  });
});