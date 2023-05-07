import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { gameSourceValues } from "../../../../../src/modules/game/constants/game.constant";
import { GAME_PLAY_ACTIONS } from "../../../../../src/modules/game/enums/game-play.enum";
import { GAME_PHASES } from "../../../../../src/modules/game/enums/game.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../../../src/modules/game/enums/player.enum";
import { GameHistoryRecordPlaySource } from "../../../../../src/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source.schema";
import { GameHistoryRecordPlay } from "../../../../../src/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import { GameHistoryRecord } from "../../../../../src/modules/game/schemas/game-history-record/game-history-record.schema";
import { ROLE_NAMES } from "../../../../../src/modules/role/enums/role.enum";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";
import { createObjectIdFromString } from "../../../../helpers/mongoose/mongoose.helper";
import { bulkCreate } from "../../../shared/bulk-create.factory";
import { createFakePlayerCharmedByPiedPiperAttribute, createFakePlayerSheriffByAllAttribute } from "../player/player-attribute/player-attribute.schema.factory";
import { createFakeBigBadWolfAlivePlayer, createFakeCupidAlivePlayer, createFakeDogWolfAlivePlayer, createFakeFoxAlivePlayer, createFakeGuardAlivePlayer, createFakeHunterAlivePlayer, createFakePiedPiperAlivePlayer, createFakeRavenAlivePlayer, createFakeScapegoatAlivePlayer, createFakeSeerAlivePlayer, createFakeStutteringJudgeAlivePlayer, createFakeThiefAlivePlayer, createFakeThreeBrothersAlivePlayer, createFakeTwoSistersAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer } from "../player/player-with-role.schema.factory";
import { createFakePlayer } from "../player/player.schema.factory";

function createFakeGameHistoryRecordWerewolvesEatPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.EAT,
    source: {
      name: PLAYER_GROUPS.WEREWOLVES,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeWerewolfAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
    ...override,
  });
}

function createFakeGameHistoryRecordBigBadWolfEatPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.EAT,
    source: {
      name: ROLE_NAMES.BIG_BAD_WOLF,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeBigBadWolfAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
    ...override,
  });
}

function createFakeGameHistoryRecordWhiteWerewolfEatPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.EAT,
    source: {
      name: ROLE_NAMES.WHITE_WEREWOLF,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeWhiteWerewolfAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordSeerLookPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.LOOK,
    source: {
      name: ROLE_NAMES.SEER,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeSeerAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordCupidCharmPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.CHARM,
    source: {
      name: ROLE_NAMES.CUPID,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeCupidAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordPiedPiperCharmPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.CHARM,
    source: {
      name: ROLE_NAMES.PIED_PIPER,
      players: gameHistoryRecordPlay.source?.players ?? [createFakePiedPiperAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordWitchUsePotionsPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.USE_POTIONS,
    source: {
      name: ROLE_NAMES.WITCH,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeWitchAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordHunterShootPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.SHOOT,
    source: {
      name: ROLE_NAMES.HUNTER,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeHunterAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordGuardProtectPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.PROTECT,
    source: {
      name: ROLE_NAMES.GUARD,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeGuardAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordRavenMarkPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.MARK,
    source: {
      name: ROLE_NAMES.RAVEN,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeRavenAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordTwoSistersMeetEachOtherPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
    source: {
      name: ROLE_NAMES.TWO_SISTERS,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeTwoSistersAlivePlayer(), createFakeTwoSistersAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordThreeBrothersMeetEachOtherPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
    source: {
      name: ROLE_NAMES.THREE_BROTHERS,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeThreeBrothersAlivePlayer(), createFakeThreeBrothersAlivePlayer(), createFakeThreeBrothersAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordCharmedMeetEachOtherPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  const sourcePlayers = [
    createFakePlayer({ attributes: [createFakePlayerCharmedByPiedPiperAttribute()] }),
    createFakePlayer({ attributes: [createFakePlayerCharmedByPiedPiperAttribute()] }),
  ];
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
    source: {
      name: PLAYER_GROUPS.CHARMED,
      players: gameHistoryRecordPlay.source?.players ?? sourcePlayers,
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordFoxSniffPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.SNIFF,
    source: {
      name: ROLE_NAMES.FOX,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeFoxAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordWildChildChooseModelPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.CHOOSE_MODEL,
    source: {
      name: ROLE_NAMES.WILD_CHILD,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeWildChildAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordWildDogWolfChooseSidePlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.CHOOSE_SIDE,
    source: {
      name: ROLE_NAMES.DOG_WOLF,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeDogWolfAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordScapegoatBanVotingPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.BAN_VOTING,
    source: {
      name: ROLE_NAMES.SCAPEGOAT,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeScapegoatAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordStutteringJudgeChooseSignPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.CHOOSE_SIGN,
    source: {
      name: ROLE_NAMES.STUTTERING_JUDGE,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeStutteringJudgeAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordThiefChooseCardPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.CHOOSE_CARD,
    source: {
      name: ROLE_NAMES.THIEF,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeThiefAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordAllElectSheriffPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.ELECT_SHERIFF,
    source: {
      name: PLAYER_GROUPS.ALL,
      players: gameHistoryRecordPlay.source?.players ?? [createFakePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordAllVotePlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.VOTE,
    source: {
      name: PLAYER_GROUPS.ALL,
      players: gameHistoryRecordPlay.source?.players ?? [createFakePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordSheriffDelegatePlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.DELEGATE,
    source: {
      name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
      players: gameHistoryRecordPlay.source?.players ?? [createFakePlayer({ attributes: [createFakePlayerSheriffByAllAttribute()] })],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordSheriffSettleVotesPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GAME_PLAY_ACTIONS.SETTLE_VOTES,
    source: {
      name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
      players: gameHistoryRecordPlay.source?.players ?? [createFakePlayer({ attributes: [createFakePlayerSheriffByAllAttribute()] })],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordPlaySource(gameHistoryRecordPlaySource: Partial<GameHistoryRecordPlaySource> = {}, override: object = {}): GameHistoryRecordPlaySource {
  return plainToInstance(GameHistoryRecordPlaySource, {
    name: gameHistoryRecordPlaySource.name ?? faker.helpers.arrayElement(gameSourceValues),
    players: gameHistoryRecordPlaySource.players ?? [],
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeGameHistoryRecordPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return plainToInstance(GameHistoryRecordPlay, {
    source: createFakeGameHistoryRecordPlaySource(gameHistoryRecordPlay.source),
    action: gameHistoryRecordPlay.action ?? faker.helpers.arrayElement(Object.values(GAME_PLAY_ACTIONS)),
    targets: gameHistoryRecordPlay.targets ?? undefined,
    votes: gameHistoryRecordPlay.votes ?? undefined,
    votingResult: gameHistoryRecordPlay.votingResult ?? undefined,
    didJudgeRequestAnotherVote: gameHistoryRecordPlay.didJudgeRequestAnotherVote ?? undefined,
    chosenSide: gameHistoryRecordPlay.chosenSide ?? undefined,
    chosenCard: gameHistoryRecordPlay.chosenCard ?? undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeGameHistoryRecord(gameHistoryRecord: Partial<GameHistoryRecord> = {}, override: object = {}): GameHistoryRecord {
  return plainToInstance(GameHistoryRecord, {
    _id: gameHistoryRecord._id ?? createObjectIdFromString(faker.database.mongodbObjectId()),
    gameId: gameHistoryRecord.gameId ?? createObjectIdFromString(faker.database.mongodbObjectId()),
    tick: gameHistoryRecord.tick ?? faker.datatype.number({ min: 1 }),
    turn: gameHistoryRecord.turn ?? faker.datatype.number({ min: 1 }),
    phase: gameHistoryRecord.phase ?? faker.helpers.arrayElement(Object.values(GAME_PHASES)),
    play: createFakeGameHistoryRecordPlay(gameHistoryRecord.play),
    revealedPlayers: gameHistoryRecord.revealedPlayers ?? undefined,
    deadPlayers: gameHistoryRecord.deadPlayers ?? undefined,
    createdAt: gameHistoryRecord.createdAt ?? faker.date.recent(),
    updatedAt: gameHistoryRecord.updatedAt ?? faker.date.recent(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function bulkCreateFakeGameHistoryRecords(length: number, gameHistoryRecords: Partial<GameHistoryRecord>[] = [], overrides: object[] = []): GameHistoryRecord[] {
  return bulkCreate(length, createFakeGameHistoryRecord, gameHistoryRecords, overrides);
}

export {
  createFakeGameHistoryRecordWerewolvesEatPlay,
  createFakeGameHistoryRecordBigBadWolfEatPlay,
  createFakeGameHistoryRecordWhiteWerewolfEatPlay,
  createFakeGameHistoryRecordSeerLookPlay,
  createFakeGameHistoryRecordCupidCharmPlay,
  createFakeGameHistoryRecordPiedPiperCharmPlay,
  createFakeGameHistoryRecordWitchUsePotionsPlay,
  createFakeGameHistoryRecordHunterShootPlay,
  createFakeGameHistoryRecordGuardProtectPlay,
  createFakeGameHistoryRecordRavenMarkPlay,
  createFakeGameHistoryRecordTwoSistersMeetEachOtherPlay,
  createFakeGameHistoryRecordThreeBrothersMeetEachOtherPlay,
  createFakeGameHistoryRecordCharmedMeetEachOtherPlay,
  createFakeGameHistoryRecordFoxSniffPlay,
  createFakeGameHistoryRecordWildChildChooseModelPlay,
  createFakeGameHistoryRecordWildDogWolfChooseSidePlay,
  createFakeGameHistoryRecordScapegoatBanVotingPlay,
  createFakeGameHistoryRecordStutteringJudgeChooseSignPlay,
  createFakeGameHistoryRecordThiefChooseCardPlay,
  createFakeGameHistoryRecordAllElectSheriffPlay,
  createFakeGameHistoryRecordAllVotePlay,
  createFakeGameHistoryRecordSheriffDelegatePlay,
  createFakeGameHistoryRecordSheriffSettleVotesPlay,
  createFakeGameHistoryRecordPlaySource,
  createFakeGameHistoryRecordPlay,
  createFakeGameHistoryRecord,
  bulkCreateFakeGameHistoryRecords,
};