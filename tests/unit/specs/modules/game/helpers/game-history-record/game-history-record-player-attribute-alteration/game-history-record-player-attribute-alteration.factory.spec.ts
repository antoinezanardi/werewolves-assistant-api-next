import { createGameHistoryRecordPlayerAttributeAlteration } from "@/modules/game/helpers/game-history-record/game-history-record-player-attribute-alteration/game-history-record-player-attribute-alteration.factory";
import type { GameHistoryRecordPlayerAttributeAlteration } from "@/modules/game/schemas/game-history-record/game-history-record-player-attribute-alteration/game-history-record-player-attribute-alteration.schema";

import { createFakeGameHistoryRecordPlayerAttributeAlteration } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";

describe("Game History Record Player Attribute Alteration Factory", () => {
  describe("create", () => {
    it("should create a game history record player attribute alteration when called.", () => {
      const gameHistoryRecordPlayerAttributeAlteration: GameHistoryRecordPlayerAttributeAlteration = {
        playerName: "playerName",
        name: "sheriff",
        source: "survivors",
        status: "attached",
      };
      const expectedGameHistoryRecordPlayerAttributeAlteration = createFakeGameHistoryRecordPlayerAttributeAlteration(gameHistoryRecordPlayerAttributeAlteration);

      expect(createGameHistoryRecordPlayerAttributeAlteration(gameHistoryRecordPlayerAttributeAlteration)).toStrictEqual<GameHistoryRecordPlayerAttributeAlteration>(expectedGameHistoryRecordPlayerAttributeAlteration);
    });
  });
});