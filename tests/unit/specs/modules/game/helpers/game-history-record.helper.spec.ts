import { GAME_HISTORY_RECORD_VOTING_RESULTS } from "../../../../../../src/modules/game/enums/game-history-record.enum";
import { GAME_PLAY_ACTIONS } from "../../../../../../src/modules/game/enums/game-play.enum";
import { getLastGamePlayFromHistory, getLastGamePlayTieInVotesFromHistory } from "../../../../../../src/modules/game/helpers/game-history-record.helper";
import type { GameHistoryRecord } from "../../../../../../src/modules/game/schemas/game-history-record/game-history-record.schema";
import { ROLE_NAMES } from "../../../../../../src/modules/role/enums/role.enum";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordAllVotePlay, createFakeGameHistoryRecordWerewolvesEatPlay, createFakeGameHistoryRecordWitchUsePotionsPlay } from "../../../../../factories/game/schemas/game-history-record/game-history-record.schema.factory";

describe("Game History Record Helper", () => {
  describe("getLastGamePlayFromHistory", () => {
    it("should return undefined when gameHistoryRecords are empty.", () => {
      expect(getLastGamePlayFromHistory([], ROLE_NAMES.WITCH, GAME_PLAY_ACTIONS.USE_POTIONS)).toBeUndefined();
    });

    it("should return undefined when the duo action / source is not found among history.", () => {
      const gameHistoryRecords: GameHistoryRecord[] = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWerewolvesEatPlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
      ];
      expect(getLastGamePlayFromHistory(gameHistoryRecords, ROLE_NAMES.WITCH, GAME_PLAY_ACTIONS.EAT)).toBeUndefined();
    });

    it("should return second item when found among history.", () => {
      const gameHistoryRecords: GameHistoryRecord[] = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWerewolvesEatPlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
      ];
      expect(getLastGamePlayFromHistory(gameHistoryRecords, ROLE_NAMES.WITCH, GAME_PLAY_ACTIONS.USE_POTIONS)).toStrictEqual(gameHistoryRecords[1]);
    });

    it("should return last item when found multiple times among history.", () => {
      const gameHistoryRecords: GameHistoryRecord[] = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWerewolvesEatPlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay(), tick: 1 }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay(), tick: 2 }),
      ];
      expect(getLastGamePlayFromHistory(gameHistoryRecords, ROLE_NAMES.WITCH, GAME_PLAY_ACTIONS.USE_POTIONS)).toStrictEqual(gameHistoryRecords[2]);
    });
  });

  describe("getLastGamePlayTieInVotesFromHistory", () => {
    it("should return undefined when gameHistoryRecords are empty.", () => {
      expect(getLastGamePlayTieInVotesFromHistory([])).toBeUndefined();
    });

    it("should return undefined when tie in votes is not found.", () => {
      const gameHistoryRecords: GameHistoryRecord[] = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWerewolvesEatPlay({ votingResult: GAME_HISTORY_RECORD_VOTING_RESULTS.TIE }) }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay(), tick: 1 }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay(), tick: 2 }),
      ];
      expect(getLastGamePlayTieInVotesFromHistory(gameHistoryRecords)).toBeUndefined();
    });

    it("should return second item when tie in votes is found among history.", () => {
      const gameHistoryRecords: GameHistoryRecord[] = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWerewolvesEatPlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay({ votingResult: GAME_HISTORY_RECORD_VOTING_RESULTS.TIE }), tick: 1 }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay({ votingResult: GAME_HISTORY_RECORD_VOTING_RESULTS.DEATH }), tick: 2 }),
      ];
      expect(getLastGamePlayTieInVotesFromHistory(gameHistoryRecords)).toStrictEqual(gameHistoryRecords[1]);
    });

    it("should return last item when tie in votes is found multiple times among history.", () => {
      const gameHistoryRecords: GameHistoryRecord[] = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWerewolvesEatPlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay({ votingResult: GAME_HISTORY_RECORD_VOTING_RESULTS.TIE }), tick: 1 }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay({ votingResult: GAME_HISTORY_RECORD_VOTING_RESULTS.TIE }), tick: 2 }),
      ];
      expect(getLastGamePlayTieInVotesFromHistory(gameHistoryRecords)).toStrictEqual(gameHistoryRecords[2]);
    });
  });
});