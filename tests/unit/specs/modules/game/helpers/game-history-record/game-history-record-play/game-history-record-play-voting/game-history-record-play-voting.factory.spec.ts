import { createGameHistoryRecordPlayVoting } from "@/modules/game/helpers/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.factory";
import type { GameHistoryRecordPlayVoting } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.schema";

import { createFakeGameHistoryRecordPlayVoting } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game History Record Play Voting Factory", () => {
  describe("create", () => {
    it("should create a game history record play voting when called.", () => {
      const gameHistoryRecordPlayVoting: GameHistoryRecordPlayVoting = {
        result: "tie",
        nominatedPlayers: [
          createFakePlayer(),
          createFakePlayer(),
        ],
      };
      const expectedGameHistoryRecordPlayVoting = createFakeGameHistoryRecordPlayVoting(gameHistoryRecordPlayVoting);

      expect(createGameHistoryRecordPlayVoting(gameHistoryRecordPlayVoting)).toStrictEqual<GameHistoryRecordPlayVoting>(expectedGameHistoryRecordPlayVoting);
    });
  });
});