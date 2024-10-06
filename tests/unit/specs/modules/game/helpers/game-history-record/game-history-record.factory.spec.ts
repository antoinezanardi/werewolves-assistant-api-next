import { createGameHistoryRecordToInsert } from "@/modules/game/helpers/game-history-record/game-history-record.factory";
import type { GameHistoryRecordToInsert } from "@/modules/game/types/game-history-record/game-history-record.types";

import { createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlayerAttributeAlteration } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGamePhase } from "@tests/factories/game/schemas/game-phase/game-phase.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeGameHistoryRecordToInsert } from "@tests/factories/game/types/game-history-record/game-history-record.type.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

describe("Game History Record To Insert Factory", () => {
  describe("create", () => {
    it("should create a game history record to insert when called.", () => {
      const gameHistoryRecordToInsert: GameHistoryRecordToInsert = {
        gameId: createFakeObjectId(),
        tick: 1,
        turn: 2,
        phase: createFakeGamePhase(),
        play: createFakeGameHistoryRecordPlay(),
        revealedPlayers: [createFakePlayer()],
        playerAttributeAlterations: [
          createFakeGameHistoryRecordPlayerAttributeAlteration(),
          createFakeGameHistoryRecordPlayerAttributeAlteration(),
        ],
      };
      const expectedGameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert(gameHistoryRecordToInsert);

      expect(createGameHistoryRecordToInsert(gameHistoryRecordToInsert)).toStrictEqual<GameHistoryRecordToInsert>(expectedGameHistoryRecordToInsert);
    });
  });
});