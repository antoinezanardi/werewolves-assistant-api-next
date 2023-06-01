import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { gameHistoryRecordFieldsSpecs } from "../../../../../src/modules/game/constants/game-history-record/game-history-record.constant";
import { GAME_PHASES } from "../../../../../src/modules/game/enums/game.enum";
import { GameHistoryRecordToInsert } from "../../../../../src/modules/game/types/game-history-record.type";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";
import { bulkCreate } from "../../../shared/bulk-create.factory";
import { createFakeObjectId } from "../../../shared/mongoose/mongoose.factory";
import { createFakeGameHistoryRecordPlay } from "../../schemas/game-history-record/game-history-record.schema.factory";

function createFakeGameHistoryRecordToInsert(gameHistoryRecordToInsert: Partial<GameHistoryRecordToInsert> = {}, override: object = {}): GameHistoryRecordToInsert {
  return plainToInstance(GameHistoryRecordToInsert, {
    gameId: gameHistoryRecordToInsert.gameId ?? createFakeObjectId(),
    tick: gameHistoryRecordToInsert.tick ?? faker.number.int({ min: gameHistoryRecordFieldsSpecs.tick.minimum }),
    turn: gameHistoryRecordToInsert.turn ?? faker.number.int({ min: gameHistoryRecordFieldsSpecs.turn.minimum }),
    phase: gameHistoryRecordToInsert.phase ?? faker.helpers.arrayElement(Object.values(GAME_PHASES)),
    play: createFakeGameHistoryRecordPlay(gameHistoryRecordToInsert.play),
    revealedPlayers: gameHistoryRecordToInsert.revealedPlayers ?? undefined,
    deadPlayers: gameHistoryRecordToInsert.deadPlayers ?? undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

function bulkCreateFakeGameHistoryRecordsToInsert(
  length: number,
  gameHistoryRecordToInserts: Partial<GameHistoryRecordToInsert>[] = [],
  overrides: object[] = [],
): GameHistoryRecordToInsert[] {
  return bulkCreate(length, createFakeGameHistoryRecordToInsert, gameHistoryRecordToInserts, overrides);
}

export {
  createFakeGameHistoryRecordToInsert,
  bulkCreateFakeGameHistoryRecordsToInsert,
};