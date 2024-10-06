import { createGameHistoryRecordPlaySource } from "@/modules/game/helpers/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.factory";
import type { GameHistoryRecordPlaySource } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.schema";

import { createFakeGameHistoryRecordPlaySource } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game History Record Play Source Factory", () => {
  describe("create", () => {
    it("should create a game history record play source when called.", () => {
      const gameHistoryRecordPlaySource: GameHistoryRecordPlaySource = {
        name: "sheriff",
        players: [createFakePlayer()],
      };
      const expectedGameHistoryRecordPlaySource = createFakeGameHistoryRecordPlaySource(gameHistoryRecordPlaySource);

      expect(createGameHistoryRecordPlaySource(gameHistoryRecordPlaySource)).toStrictEqual<GameHistoryRecordPlaySource>(expectedGameHistoryRecordPlaySource);
    });
  });
});