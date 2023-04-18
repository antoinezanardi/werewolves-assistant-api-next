import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { gameSourceValues } from "../../../../../src/modules/game/constants/game.constant";
import { GAME_HISTORY_RECORD_VOTING_RESULTS } from "../../../../../src/modules/game/enums/game-history-record.enum";
import { GAME_PLAY_ACTIONS } from "../../../../../src/modules/game/enums/game-play.enum";
import { GAME_PHASES } from "../../../../../src/modules/game/enums/game.enum";
import { PLAYER_GROUPS } from "../../../../../src/modules/game/enums/player.enum";
import { GameHistoryRecordPlay } from "../../../../../src/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import type { GameHistoryRecord } from "../../../../../src/modules/game/schemas/game-history-record/game-history-record.schema";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../src/modules/role/enums/role.enum";
import { createFakePlayer } from "../player/player.schema.factory";

function createFakeGameHistoryRecordUseEatPlay(obj: Partial<GameHistoryRecordPlay> = {}): GameHistoryRecordPlay {
  const play: Partial<GameHistoryRecordPlay> = {
    action: GAME_PLAY_ACTIONS.EAT,
    source: {
      name: PLAYER_GROUPS.WEREWOLVES,
      players: obj.source?.players ?? [createFakePlayer({})],
    },
  };
  return createFakeGameHistoryRecordPlay({
    ...play,
    ...obj,
  });
}

function createFakeGameHistoryRecordUsePotionsPlay(obj: Partial<GameHistoryRecordPlay> = {}): GameHistoryRecordPlay {
  const play: Partial<GameHistoryRecordPlay> = {
    action: GAME_PLAY_ACTIONS.USE_POTIONS,
    source: {
      name: ROLE_NAMES.WITCH,
      players: obj.source?.players ?? [createFakePlayer({})],
    },
  };
  return createFakeGameHistoryRecordPlay({
    ...play,
    ...obj,
  });
}

function createFakeGameHistoryRecordPlay(obj: Partial<GameHistoryRecordPlay> = {}): GameHistoryRecordPlay {
  return plainToInstance(GameHistoryRecordPlay, {
    source: {
      name: obj.source?.name ?? faker.helpers.arrayElement(gameSourceValues),
      players: obj.source?.players ?? [createFakePlayer({})],
    },
    action: obj.action ?? faker.helpers.arrayElement(Object.values(GAME_PLAY_ACTIONS)),
    targets: obj.targets ?? [],
    votes: obj.votes ?? [],
    votingResult: obj.votingResult ?? faker.helpers.arrayElement(Object.values(GAME_HISTORY_RECORD_VOTING_RESULTS)),
    didJudgeRequestAnotherVote: obj.didJudgeRequestAnotherVote ?? faker.datatype.boolean(),
    chosenSide: obj.chosenSide ?? faker.helpers.arrayElement(Object.values(ROLE_SIDES)),
    chosenCard: obj.chosenCard ?? undefined,
  }, { enableCircularCheck: true });
}

function createFakeGameHistoryRecord(obj: Partial<GameHistoryRecord> = {}): GameHistoryRecord {
  return {
    _id: obj._id ?? faker.database.mongodbObjectId(),
    gameId: obj.gameId ?? faker.database.mongodbObjectId(),
    tick: obj.tick ?? faker.datatype.number({ min: 1 }),
    turn: obj.turn ?? faker.datatype.number({ min: 1 }),
    phase: obj.phase ?? faker.helpers.arrayElement(Object.values(GAME_PHASES)),
    play: createFakeGameHistoryRecordPlay(obj.play),
    revealedPlayers: obj.revealedPlayers ?? [],
    deadPlayers: obj.deadPlayers ?? [],
    createdAt: obj.createdAt ?? faker.date.recent(),
    updatedAt: obj.updatedAt ?? faker.date.recent(),
  };
}

function bulkCreateFakeGameHistoryRecords(length: number, gameHistoryRecords: Partial<GameHistoryRecord>[] = []): GameHistoryRecord[] {
  return Array.from(Array(length)).map((item, index) => {
    const override = index < gameHistoryRecords.length ? gameHistoryRecords[index] : {};
    return createFakeGameHistoryRecord(override);
  });
}

export {
  createFakeGameHistoryRecordUseEatPlay,
  createFakeGameHistoryRecordUsePotionsPlay,
  createFakeGameHistoryRecordPlay,
  createFakeGameHistoryRecord,
  bulkCreateFakeGameHistoryRecords,
};