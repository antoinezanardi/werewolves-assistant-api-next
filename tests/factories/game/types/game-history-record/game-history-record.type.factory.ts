import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { gameHistoryRecordFieldsSpecs } from "../../../../../src/modules/game/constants/game-history-record/game-history-record.constant";
import { GAME_PHASES } from "../../../../../src/modules/game/enums/game.enum";
import { GameHistoryRecordToInsert } from "../../../../../src/modules/game/types/game-history-record.type";
import { createFakeGameHistoryRecordPlay } from "../../schemas/game-history-record/game-history-record.schema.factory";

function createFakeGameHistoryRecordToInsert(obj: Partial<GameHistoryRecordToInsert> = {}): GameHistoryRecordToInsert {
  return plainToInstance(GameHistoryRecordToInsert, {
    gameId: obj.gameId ?? faker.database.mongodbObjectId(),
    tick: obj.tick ?? faker.datatype.number({ min: gameHistoryRecordFieldsSpecs.tick.minimum }),
    turn: obj.turn ?? faker.datatype.number({ min: gameHistoryRecordFieldsSpecs.turn.minimum }),
    phase: obj.phase ?? faker.helpers.arrayElement(Object.values(GAME_PHASES)),
    play: createFakeGameHistoryRecordPlay(obj.play),
    revealedPlayers: obj.revealedPlayers ?? [],
    deadPlayers: obj.deadPlayers ?? [],
  });
}

function bulkCreateFakeGameHistoryRecordsToInsert(length: number): GameHistoryRecordToInsert[] {
  return Array.from(Array(length)).map(() => createFakeGameHistoryRecordToInsert());
}

export { createFakeGameHistoryRecordToInsert, bulkCreateFakeGameHistoryRecordsToInsert };