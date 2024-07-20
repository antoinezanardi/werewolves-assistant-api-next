import { doesHavePlayerAttributeAlterationWithNameAndStatus, doesHavePlayerAttributeAlterationWithNameSourceAndStatus } from "@/modules/game/helpers/game-history-record/game-history-record.helpers";
import type { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { GameHistoryRecordPlayerAttributeAlterationStatus } from "@/modules/game/types/game-history-record/game-history-record.types";
import type { GameSource } from "@/modules/game/types/game.types";
import type { PlayerAttributeName } from "@/modules/game/types/player/player-attribute/player-attribute.types";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordPlayerAttributeAlteration } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";

describe("Game History Record Helpers", () => {
  describe("doesHavePlayerAttributeAlterationWithNameSourceAndStatus", () => {
    it.each<{
      test: string;
      gameHistoryRecord: GameHistoryRecord;
      attributeName: PlayerAttributeName;
      source: GameSource;
      status: GameHistoryRecordPlayerAttributeAlterationStatus;
      expectedResult: boolean;
    }>([
      {
        test: "should return true if the game history record has a player attribute alteration with the given name, source, and status",
        gameHistoryRecord: createFakeGameHistoryRecord({
          playerAttributeAlterations: [
            createFakeGameHistoryRecordPlayerAttributeAlteration({
              name: "worshiped",
              source: "witch",
              status: "attached",
            }),
            createFakeGameHistoryRecordPlayerAttributeAlteration({
              name: "sheriff",
              source: "survivors",
              status: "attached",
            }),
          ],
        }),
        attributeName: "sheriff",
        source: "survivors",
        status: "attached",
        expectedResult: true,
      },
      {
        test: "should return false if the game history record does not have a player attribute alteration with the given name",
        gameHistoryRecord: createFakeGameHistoryRecord({
          playerAttributeAlterations: [
            createFakeGameHistoryRecordPlayerAttributeAlteration({
              name: "worshiped",
              source: "witch",
              status: "attached",
            }),
            createFakeGameHistoryRecordPlayerAttributeAlteration({
              name: "sheriff",
              source: "survivors",
              status: "attached",
            }),
          ],
        }),
        attributeName: "seen",
        source: "survivors",
        status: "attached",
        expectedResult: false,
      },
      {
        test: "should return false if the game history record does not have a player attribute alteration with the given source",
        gameHistoryRecord: createFakeGameHistoryRecord({
          playerAttributeAlterations: [
            createFakeGameHistoryRecordPlayerAttributeAlteration({
              name: "worshiped",
              source: "witch",
              status: "attached",
            }),
            createFakeGameHistoryRecordPlayerAttributeAlteration({
              name: "sheriff",
              source: "survivors",
              status: "attached",
            }),
          ],
        }),
        attributeName: "sheriff",
        source: "thief",
        status: "attached",
        expectedResult: false,
      },
      {
        test: "should return false if the game history record does not have a player attribute alteration with the given status",
        gameHistoryRecord: createFakeGameHistoryRecord({
          playerAttributeAlterations: [
            createFakeGameHistoryRecordPlayerAttributeAlteration({
              name: "worshiped",
              source: "witch",
              status: "attached",
            }),
            createFakeGameHistoryRecordPlayerAttributeAlteration({
              name: "sheriff",
              source: "survivors",
              status: "attached",
            }),
          ],
        }),
        attributeName: "sheriff",
        source: "survivors",
        status: "detached",
        expectedResult: false,
      },
      {
        test: "should return false if the game history record does not have any player attribute alterations",
        gameHistoryRecord: createFakeGameHistoryRecord(),
        attributeName: "sheriff",
        source: "survivors",
        status: "attached",
        expectedResult: false,
      },
    ])("$test", ({ gameHistoryRecord, attributeName, source, status, expectedResult }) => {
      const result = doesHavePlayerAttributeAlterationWithNameSourceAndStatus(gameHistoryRecord, attributeName, source, status);

      expect(result).toBe(expectedResult);
    });
  });

  describe("doesHavePlayerAttributeAlterationWithNameAndStatus", () => {
    it.each<{
      test: string;
      gameHistoryRecord: GameHistoryRecord;
      attributeName: PlayerAttributeName;
      status: GameHistoryRecordPlayerAttributeAlterationStatus;
      expectedResult: boolean;
    }>([
      {
        test: "should return true if the game history record has a player attribute alteration with the given name and status",
        gameHistoryRecord: createFakeGameHistoryRecord({
          playerAttributeAlterations: [
            createFakeGameHistoryRecordPlayerAttributeAlteration({
              name: "worshiped",
              source: "witch",
              status: "attached",
            }),
            createFakeGameHistoryRecordPlayerAttributeAlteration({
              name: "sheriff",
              source: "survivors",
              status: "attached",
            }),
          ],
        }),
        attributeName: "sheriff",
        status: "attached",
        expectedResult: true,
      },
      {
        test: "should return false if the game history record does not have a player attribute alteration with the given name",
        gameHistoryRecord: createFakeGameHistoryRecord({
          playerAttributeAlterations: [
            createFakeGameHistoryRecordPlayerAttributeAlteration({
              name: "worshiped",
              source: "witch",
              status: "attached",
            }),
            createFakeGameHistoryRecordPlayerAttributeAlteration({
              name: "sheriff",
              source: "survivors",
              status: "attached",
            }),
          ],
        }),
        attributeName: "seen",
        status: "attached",
        expectedResult: false,
      },
      {
        test: "should return false if the game history record does not have a player attribute alteration with the given status",
        gameHistoryRecord: createFakeGameHistoryRecord({
          playerAttributeAlterations: [
            createFakeGameHistoryRecordPlayerAttributeAlteration({
              name: "worshiped",
              source: "witch",
              status: "attached",
            }),
            createFakeGameHistoryRecordPlayerAttributeAlteration({
              name: "sheriff",
              source: "survivors",
              status: "attached",
            }),
          ],
        }),
        attributeName: "sheriff",
        status: "detached",
        expectedResult: false,
      },
      {
        test: "should return false if the game history record does not have any player attribute alterations",
        gameHistoryRecord: createFakeGameHistoryRecord(),
        attributeName: "sheriff",
        status: "attached",
        expectedResult: false,
      },
    ])("$test", ({ gameHistoryRecord, attributeName, status, expectedResult }) => {
      const result = doesHavePlayerAttributeAlterationWithNameAndStatus(gameHistoryRecord, attributeName, status);

      expect(result).toBe(expectedResult);
    });
  });
});