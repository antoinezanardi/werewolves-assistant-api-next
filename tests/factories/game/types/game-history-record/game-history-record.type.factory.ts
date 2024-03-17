import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_HISTORY_RECORD_FIELDS_SPECS } from "@/modules/game/schemas/game-history-record/game-history-record.schema.constants";
import { GamePhases } from "@/modules/game/enums/game.enum";
import { GameHistoryRecordToInsert } from "@/modules/game/types/game-history-record.types";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { createFakeGameHistoryRecordPlay } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";

function createFakeGameHistoryRecordToInsert(gameHistoryRecordToInsert: Partial<GameHistoryRecordToInsert> = {}, override: object = {}): GameHistoryRecordToInsert {
  return plainToInstance(GameHistoryRecordToInsert, {
    gameId: gameHistoryRecordToInsert.gameId ?? createFakeObjectId(),
    tick: gameHistoryRecordToInsert.tick ?? faker.number.int({ min: GAME_HISTORY_RECORD_FIELDS_SPECS.tick.min }),
    turn: gameHistoryRecordToInsert.turn ?? faker.number.int({ min: GAME_HISTORY_RECORD_FIELDS_SPECS.turn.min }),
    phase: gameHistoryRecordToInsert.phase ?? faker.helpers.arrayElement(Object.values(GamePhases)),
    play: createFakeGameHistoryRecordPlay(gameHistoryRecordToInsert.play),
    revealedPlayers: gameHistoryRecordToInsert.revealedPlayers ?? undefined,
    deadPlayers: gameHistoryRecordToInsert.deadPlayers ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeGameHistoryRecordToInsert };