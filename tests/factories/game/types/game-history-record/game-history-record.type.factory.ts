import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { gameHistoryRecordFieldsSpecs } from "@/modules/game/constants/game-history-record/game-history-record.constant";
import { GAME_PHASES } from "@/modules/game/enums/game.enum";
import { GameHistoryRecordToInsert } from "@/modules/game/types/game-history-record.type";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { bulkCreate } from "@tests/factories/shared/bulk-create.factory";
import { createFakeGameHistoryRecordPlay } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";

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