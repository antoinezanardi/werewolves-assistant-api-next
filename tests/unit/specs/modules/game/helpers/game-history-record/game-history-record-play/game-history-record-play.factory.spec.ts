import { createGameHistoryRecordPlay } from "@/modules/game/helpers/game-history-record/game-history-record-play/game-history-record-play.factory";
import type { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import { createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlaySource, createFakeGameHistoryRecordPlayTarget } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";

describe("Game History Record Play Factory", () => {
  describe("create", () => {
    it("should create a game history record play when called.", () => {
      const gameHistoryRecordPlay: GameHistoryRecordPlay = {
        type: "target",
        action: "eat",
        source: createFakeGameHistoryRecordPlaySource(),
        targets: [createFakeGameHistoryRecordPlayTarget()],
      };
      const expectedGameHistoryRecordPlay = createFakeGameHistoryRecordPlay(gameHistoryRecordPlay);

      expect(createGameHistoryRecordPlay(gameHistoryRecordPlay)).toStrictEqual<GameHistoryRecordPlay>(expectedGameHistoryRecordPlay);
    });
  });
});