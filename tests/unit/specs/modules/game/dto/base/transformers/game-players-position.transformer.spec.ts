import type { TransformFnParams } from "class-transformer/types/interfaces";

import { gamePlayersPositionTransformer } from "@/modules/game/dto/base/transformers/game-players-position.transformer";

import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Game Players Position Transformer", () => {
  describe("gamePlayersPositionTransformer", () => {
    it("should return same value when value is not an array.", () => {
      expect(gamePlayersPositionTransformer({ value: null } as TransformFnParams)).toBeNull();
    });

    it("should return same value when one value of the array is not object.", () => {
      const value = [
        createFakeCreateGamePlayerDto(),
        createFakeCreateGamePlayerDto(),
        createFakeCreateGamePlayerDto(),
        "toto",
      ];

      expect(gamePlayersPositionTransformer({ value } as TransformFnParams)).toStrictEqual(value);
    });

    it("should return players as is when every position is set.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ position: 0 }),
        createFakeCreateGamePlayerDto({ position: 1 }),
        createFakeCreateGamePlayerDto({ position: 2 }),
        createFakeCreateGamePlayerDto({ position: 3 }),
      ];

      expect(gamePlayersPositionTransformer({ value: players } as TransformFnParams)).toStrictEqual(players);
    });

    it("should return players as is when at least one position is not set.", () => {
      const players = [
        createFakeCreateGamePlayerDto(),
        createFakeCreateGamePlayerDto({ position: 4 }),
        createFakeCreateGamePlayerDto({ position: 6 }),
        createFakeCreateGamePlayerDto({ position: 12 }),
      ];

      expect(gamePlayersPositionTransformer({ value: players } as TransformFnParams)).toStrictEqual(players);
    });

    it("should return players with sequential position when no positions are set.", () => {
      const players = [
        createFakeCreateGamePlayerDto(),
        createFakeCreateGamePlayerDto(),
        createFakeCreateGamePlayerDto(),
        createFakeCreateGamePlayerDto(),
      ];
      const result = gamePlayersPositionTransformer({ value: players } as TransformFnParams);

      for (let i = 0; i < players.length; i++) {
        expect((result as { position: number }[])[i].position).toBe(i);
      }
    });
  });
});