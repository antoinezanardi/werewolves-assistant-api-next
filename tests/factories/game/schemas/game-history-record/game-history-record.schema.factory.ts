import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_SOURCE_VALUES } from "@/modules/game/constants/game.constant";
import { GameHistoryRecordVotingResults } from "@/modules/game/enums/game-history-record.enum";
import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { GameHistoryRecordPlaySource } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.schema";
import { GameHistoryRecordPlayTarget } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-target/game-history-record-play-target.schema";
import { GameHistoryRecordPlayVote } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-vote/game-history-record-play-vote.schema";
import { GameHistoryRecordPlayVoting } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.schema";
import { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { bulkCreate } from "@tests/factories/shared/bulk-create.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeBigBadWolfAlivePlayer, createFakeCupidAlivePlayer, createFakeDogWolfAlivePlayer, createFakeFoxAlivePlayer, createFakeGuardAlivePlayer, createFakeHunterAlivePlayer, createFakePiedPiperAlivePlayer, createFakeRavenAlivePlayer, createFakeScapegoatAlivePlayer, createFakeSeerAlivePlayer, createFakeStutteringJudgeAlivePlayer, createFakeThiefAlivePlayer, createFakeThreeBrothersAlivePlayer, createFakeTwoSistersAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakeCharmedByPiedPiperPlayerAttribute, createFakeSheriffByAllPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";

function createFakeGameHistoryRecordWerewolvesEatPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.EAT,
    source: {
      name: PlayerGroups.WEREWOLVES,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeWerewolfAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordBigBadWolfEatPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.EAT,
    source: {
      name: RoleNames.BIG_BAD_WOLF,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeBigBadWolfAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordWhiteWerewolfEatPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.EAT,
    source: {
      name: RoleNames.WHITE_WEREWOLF,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeWhiteWerewolfAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordSeerLookPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.LOOK,
    source: {
      name: RoleNames.SEER,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeSeerAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordCupidCharmPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.CHARM,
    source: {
      name: RoleNames.CUPID,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeCupidAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordPiedPiperCharmPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.CHARM,
    source: {
      name: RoleNames.PIED_PIPER,
      players: gameHistoryRecordPlay.source?.players ?? [createFakePiedPiperAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordWitchUsePotionsPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.USE_POTIONS,
    source: {
      name: RoleNames.WITCH,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeWitchAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordHunterShootPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.SHOOT,
    source: {
      name: RoleNames.HUNTER,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeHunterAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordGuardProtectPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.PROTECT,
    source: {
      name: RoleNames.GUARD,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeGuardAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordRavenMarkPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.MARK,
    source: {
      name: RoleNames.RAVEN,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeRavenAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordTwoSistersMeetEachOtherPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.MEET_EACH_OTHER,
    source: {
      name: RoleNames.TWO_SISTERS,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeTwoSistersAlivePlayer(), createFakeTwoSistersAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordThreeBrothersMeetEachOtherPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.MEET_EACH_OTHER,
    source: {
      name: RoleNames.THREE_BROTHERS,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeThreeBrothersAlivePlayer(), createFakeThreeBrothersAlivePlayer(), createFakeThreeBrothersAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordCharmedMeetEachOtherPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  const sourcePlayers = [
    createFakePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
    createFakePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
  ];
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.MEET_EACH_OTHER,
    source: {
      name: PlayerGroups.CHARMED,
      players: gameHistoryRecordPlay.source?.players ?? sourcePlayers,
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordFoxSniffPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.SNIFF,
    source: {
      name: RoleNames.FOX,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeFoxAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordWildChildChooseModelPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.CHOOSE_MODEL,
    source: {
      name: RoleNames.WILD_CHILD,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeWildChildAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordWildDogWolfChooseSidePlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.CHOOSE_SIDE,
    source: {
      name: RoleNames.DOG_WOLF,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeDogWolfAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordScapegoatBanVotingPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.BAN_VOTING,
    source: {
      name: RoleNames.SCAPEGOAT,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeScapegoatAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordStutteringJudgeChooseSignPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.CHOOSE_SIGN,
    source: {
      name: RoleNames.STUTTERING_JUDGE,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeStutteringJudgeAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordThiefChooseCardPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.CHOOSE_CARD,
    source: {
      name: RoleNames.THIEF,
      players: gameHistoryRecordPlay.source?.players ?? [createFakeThiefAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordAllElectSheriffPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.ELECT_SHERIFF,
    source: {
      name: PlayerGroups.ALL,
      players: gameHistoryRecordPlay.source?.players ?? [createFakePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordAllVotePlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.VOTE,
    source: {
      name: PlayerGroups.ALL,
      players: gameHistoryRecordPlay.source?.players ?? [createFakePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordSheriffDelegatePlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.DELEGATE,
    source: {
      name: PlayerAttributeNames.SHERIFF,
      players: gameHistoryRecordPlay.source?.players ?? [createFakePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] })],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordSheriffSettleVotesPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    action: GamePlayActions.SETTLE_VOTES,
    source: {
      name: PlayerAttributeNames.SHERIFF,
      players: gameHistoryRecordPlay.source?.players ?? [createFakePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] })],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordPlaySource(gameHistoryRecordPlaySource: Partial<GameHistoryRecordPlaySource> = {}, override: object = {}): GameHistoryRecordPlaySource {
  return plainToInstance(GameHistoryRecordPlaySource, {
    name: gameHistoryRecordPlaySource.name ?? faker.helpers.arrayElement(GAME_SOURCE_VALUES),
    players: gameHistoryRecordPlaySource.players ?? [createFakePlayer()],
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

function createFakeGameHistoryRecordPlayVote(gameHistoryRecordPlayVote: Partial<GameHistoryRecordPlayVote> = {}, override: object = {}): GameHistoryRecordPlayVote {
  return plainToInstance(GameHistoryRecordPlayVote, {
    source: gameHistoryRecordPlayVote.source ?? createFakePlayer(),
    target: gameHistoryRecordPlayVote.target ?? createFakePlayer(),
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

function createFakeGameHistoryRecordPlayTarget(gameHistoryRecordPlayTarget: Partial<GameHistoryRecordPlayTarget> = {}, override: object = {}): GameHistoryRecordPlayTarget {
  return plainToInstance(GameHistoryRecordPlayTarget, {
    player: gameHistoryRecordPlayTarget.player ?? createFakePlayer(),
    isInfected: gameHistoryRecordPlayTarget.isInfected ?? undefined,
    drankPotion: gameHistoryRecordPlayTarget.drankPotion ?? undefined,
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

function createFakeGameHistoryRecordPlayVoting(gameHistoryRecordPlayVoting: Partial<GameHistoryRecordPlayVoting> = {}, override: object = {}): GameHistoryRecordPlayVoting {
  return plainToInstance(GameHistoryRecordPlayVoting, {
    result: gameHistoryRecordPlayVoting.result ?? faker.helpers.arrayElement(Object.values(GameHistoryRecordVotingResults)),
    nominatedPlayers: gameHistoryRecordPlayVoting.nominatedPlayers ?? undefined,
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

function createFakeGameHistoryRecordPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return plainToInstance(GameHistoryRecordPlay, {
    source: createFakeGameHistoryRecordPlaySource(gameHistoryRecordPlay.source),
    action: gameHistoryRecordPlay.action ?? faker.helpers.arrayElement(Object.values(GamePlayActions)),
    targets: gameHistoryRecordPlay.targets ?? undefined,
    votes: gameHistoryRecordPlay.votes ?? undefined,
    voting: gameHistoryRecordPlay.voting ? createFakeGameHistoryRecordPlayVoting(gameHistoryRecordPlay.voting, override) : undefined,
    didJudgeRequestAnotherVote: gameHistoryRecordPlay.didJudgeRequestAnotherVote ?? undefined,
    chosenSide: gameHistoryRecordPlay.chosenSide ?? undefined,
    chosenCard: gameHistoryRecordPlay.chosenCard ?? undefined,
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

function createFakeGameHistoryRecord(gameHistoryRecord: Partial<GameHistoryRecord> = {}, override: object = {}): GameHistoryRecord {
  return plainToInstance(GameHistoryRecord, {
    _id: gameHistoryRecord._id ?? createFakeObjectId(),
    gameId: gameHistoryRecord.gameId ?? createFakeObjectId(),
    tick: gameHistoryRecord.tick ?? faker.number.int({ min: 1 }),
    turn: gameHistoryRecord.turn ?? faker.number.int({ min: 1 }),
    phase: gameHistoryRecord.phase ?? faker.helpers.arrayElement(Object.values(GamePhases)),
    play: createFakeGameHistoryRecordPlay(gameHistoryRecord.play),
    revealedPlayers: gameHistoryRecord.revealedPlayers ?? undefined,
    deadPlayers: gameHistoryRecord.deadPlayers ?? undefined,
    createdAt: gameHistoryRecord.createdAt ?? faker.date.recent(),
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
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
  createFakeGameHistoryRecordPlayVote,
  createFakeGameHistoryRecordPlayTarget,
  createFakeGameHistoryRecordPlayVoting,
  createFakeGameHistoryRecordPlay,
  createFakeGameHistoryRecord,
  bulkCreateFakeGameHistoryRecords,
};