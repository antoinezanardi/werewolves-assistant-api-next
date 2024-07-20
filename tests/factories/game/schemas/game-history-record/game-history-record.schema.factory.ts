import { GAME_SOURCES } from "@/modules/game/constants/game.constants";
import { PLAYER_ATTRIBUTE_NAMES } from "@/modules/game/constants/player/player-attribute/player-attribute.constants";
import { GameHistoryRecordPlayerAttributeAlteration } from "@/modules/game/schemas/game-history-record/game-history-record-player-attribute-alteration/game-history-record-player-attribute-alteration.schema";
import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_STATUSES, GAME_HISTORY_RECORD_VOTING_RESULTS } from "@/modules/game/constants/game-history-record/game-history-record.constants";
import { GAME_PLAY_ACTIONS, GAME_PLAY_SOURCE_NAMES, GAME_PLAY_TYPES } from "@/modules/game/constants/game-play/game-play.constants";
import { GameHistoryRecordPlaySource } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.schema";
import { GameHistoryRecordPlayTarget } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-target/game-history-record-play-target.schema";
import { GameHistoryRecordPlayVote } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-vote/game-history-record-play-vote.schema";
import { GameHistoryRecordPlayVoting } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.schema";
import { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { createFakeGamePhase } from "@tests/factories/game/schemas/game-phase/game-phase.schema.factory";
import { createFakeCharmedByPiedPiperPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeAccursedWolfFatherAlivePlayer, createFakeBigBadWolfAlivePlayer, createFakeCupidAlivePlayer, createFakeDefenderAlivePlayer, createFakeFoxAlivePlayer, createFakeHunterAlivePlayer, createFakePiedPiperAlivePlayer, createFakeScandalmongerAlivePlayer, createFakeScapegoatAlivePlayer, createFakeSeerAlivePlayer, createFakeStutteringJudgeAlivePlayer, createFakeThiefAlivePlayer, createFakeThreeBrothersAlivePlayer, createFakeTwoSistersAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer, createFakeWolfHoundAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

function createFakeGameHistoryRecordPlaySource(gameHistoryRecordPlaySource: Partial<GameHistoryRecordPlaySource> = {}, override: object = {}): GameHistoryRecordPlaySource {
  return plainToInstance(GameHistoryRecordPlaySource, {
    name: gameHistoryRecordPlaySource.name ?? faker.helpers.arrayElement(GAME_PLAY_SOURCE_NAMES),
    players: gameHistoryRecordPlaySource.players ?? [createFakePlayer()],
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeGameHistoryRecordPlayVote(gameHistoryRecordPlayVote: Partial<GameHistoryRecordPlayVote> = {}, override: object = {}): GameHistoryRecordPlayVote {
  return plainToInstance(GameHistoryRecordPlayVote, {
    source: gameHistoryRecordPlayVote.source ?? createFakePlayer(),
    target: gameHistoryRecordPlayVote.target ?? createFakePlayer(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeGameHistoryRecordPlayTarget(gameHistoryRecordPlayTarget: Partial<GameHistoryRecordPlayTarget> = {}, override: object = {}): GameHistoryRecordPlayTarget {
  return plainToInstance(GameHistoryRecordPlayTarget, {
    player: gameHistoryRecordPlayTarget.player ?? createFakePlayer(),
    drankPotion: gameHistoryRecordPlayTarget.drankPotion ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeGameHistoryRecordPlayVoting(gameHistoryRecordPlayVoting: Partial<GameHistoryRecordPlayVoting> = {}, override: object = {}): GameHistoryRecordPlayVoting {
  return plainToInstance(GameHistoryRecordPlayVoting, {
    result: gameHistoryRecordPlayVoting.result ?? faker.helpers.arrayElement(GAME_HISTORY_RECORD_VOTING_RESULTS),
    nominatedPlayers: gameHistoryRecordPlayVoting.nominatedPlayers ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeGameHistoryRecordPlayerAttributeAlteration(
  gameHistoryRecordPlayerAttributeAlteration: Partial<GameHistoryRecordPlayerAttributeAlteration> = {},
  override: object = {},
): GameHistoryRecordPlayerAttributeAlteration {
  return plainToInstance(GameHistoryRecordPlayerAttributeAlteration, {
    name: gameHistoryRecordPlayerAttributeAlteration.name ?? faker.helpers.arrayElement(PLAYER_ATTRIBUTE_NAMES),
    source: gameHistoryRecordPlayerAttributeAlteration.source ?? faker.helpers.arrayElement(GAME_SOURCES),
    playerName: gameHistoryRecordPlayerAttributeAlteration.playerName ?? faker.person.firstName(),
    status: gameHistoryRecordPlayerAttributeAlteration.status ?? faker.helpers.arrayElement(GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_STATUSES),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeGameHistoryRecordPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return plainToInstance(GameHistoryRecordPlay, {
    type: gameHistoryRecordPlay.type ?? faker.helpers.arrayElement(GAME_PLAY_TYPES),
    source: createFakeGameHistoryRecordPlaySource(gameHistoryRecordPlay.source),
    action: gameHistoryRecordPlay.action ?? faker.helpers.arrayElement(GAME_PLAY_ACTIONS),
    causes: gameHistoryRecordPlay.causes ?? undefined,
    targets: gameHistoryRecordPlay.targets ?? undefined,
    votes: gameHistoryRecordPlay.votes ?? undefined,
    voting: gameHistoryRecordPlay.voting ? createFakeGameHistoryRecordPlayVoting(gameHistoryRecordPlay.voting, override) : undefined,
    didJudgeRequestAnotherVote: gameHistoryRecordPlay.didJudgeRequestAnotherVote ?? undefined,
    chosenSide: gameHistoryRecordPlay.chosenSide ?? undefined,
    chosenCard: gameHistoryRecordPlay.chosenCard ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeGameHistoryRecord(gameHistoryRecord: Partial<GameHistoryRecord> = {}, override: object = {}): GameHistoryRecord {
  return plainToInstance(GameHistoryRecord, {
    _id: gameHistoryRecord._id ?? createFakeObjectId(),
    gameId: gameHistoryRecord.gameId ?? createFakeObjectId(),
    tick: gameHistoryRecord.tick ?? faker.number.int({ min: 1 }),
    turn: gameHistoryRecord.turn ?? faker.number.int({ min: 1 }),
    phase: createFakeGamePhase(gameHistoryRecord.phase),
    play: createFakeGameHistoryRecordPlay(gameHistoryRecord.play),
    revealedPlayers: gameHistoryRecord.revealedPlayers,
    switchedSidePlayers: gameHistoryRecord.switchedSidePlayers,
    deadPlayers: gameHistoryRecord.deadPlayers,
    playerAttributeAlterations: gameHistoryRecord.playerAttributeAlterations,
    createdAt: gameHistoryRecord.createdAt ?? faker.date.recent(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeGameHistoryRecordStutteringJudgeRequestsAnotherVotePlay(
  gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {},
  override: object = {},
): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "request-another-vote",
    action: "request-another-vote",
    source: {
      name: "stuttering-judge",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeStutteringJudgeAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordAccursedWolfFatherInfectsPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "infect",
    source: {
      name: "accursed-wolf-father",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeAccursedWolfFatherAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordWerewolvesEatPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "eat",
    source: {
      name: "werewolves",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeWerewolfAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordBigBadWolfEatPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "eat",
    source: {
      name: "big-bad-wolf",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeBigBadWolfAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordWhiteWerewolfEatPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "eat",
    source: {
      name: "white-werewolf",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeWhiteWerewolfAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordSeerLookPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "look",
    source: {
      name: "seer",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeSeerAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordCupidCharmPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "charm",
    source: {
      name: "cupid",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeCupidAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordPiedPiperCharmPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "charm",
    source: {
      name: "pied-piper",
      players: gameHistoryRecordPlay.source?.players ?? [createFakePiedPiperAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordWitchUsePotionsPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "use-potions",
    source: {
      name: "witch",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeWitchAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordHunterShootPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "shoot",
    source: {
      name: "hunter",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeHunterAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordDefenderProtectPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "protect",
    source: {
      name: "defender",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeDefenderAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordScandalmongerMarkPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "mark",
    source: {
      name: "scandalmonger",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeScandalmongerAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordTwoSistersMeetEachOtherPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "no-action",
    action: "meet-each-other",
    source: {
      name: "two-sisters",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeTwoSistersAlivePlayer(), createFakeTwoSistersAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordThreeBrothersMeetEachOtherPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "no-action",
    action: "meet-each-other",
    source: {
      name: "three-brothers",
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
    type: "no-action",
    action: "meet-each-other",
    source: {
      name: "charmed",
      players: gameHistoryRecordPlay.source?.players ?? sourcePlayers,
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordFoxSniffPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "sniff",
    source: {
      name: "fox",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeFoxAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordWildChildChooseModelPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "choose-model",
    source: {
      name: "wild-child",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeWildChildAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordWildWolfHoundChooseSidePlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "choose-side",
    action: "choose-side",
    source: {
      name: "wolf-hound",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeWolfHoundAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordScapegoatBanVotingPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "ban-voting",
    source: {
      name: "scapegoat",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeScapegoatAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordThiefChooseCardPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "choose-card",
    action: "choose-card",
    source: {
      name: "thief",
      players: gameHistoryRecordPlay.source?.players ?? [createFakeThiefAlivePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordSurvivorsElectSheriffPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "vote",
    action: "elect-sheriff",
    source: {
      name: "survivors",
      players: gameHistoryRecordPlay.source?.players ?? [createFakePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordSurvivorsVotePlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "vote",
    action: "vote",
    source: {
      name: "survivors",
      players: gameHistoryRecordPlay.source?.players ?? [createFakePlayer()],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordSheriffDelegatePlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "target",
    action: "delegate",
    source: {
      name: "sheriff",
      players: gameHistoryRecordPlay.source?.players ?? [createFakePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] })],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

function createFakeGameHistoryRecordSheriffSettleVotesPlay(gameHistoryRecordPlay: Partial<GameHistoryRecordPlay> = {}, override: object = {}): GameHistoryRecordPlay {
  return createFakeGameHistoryRecordPlay({
    type: "vote",
    action: "settle-votes",
    source: {
      name: "sheriff",
      players: gameHistoryRecordPlay.source?.players ?? [createFakePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] })],
    },
    ...gameHistoryRecordPlay,
  }, override);
}

export {
  createFakeGameHistoryRecordStutteringJudgeRequestsAnotherVotePlay,
  createFakeGameHistoryRecordAccursedWolfFatherInfectsPlay,
  createFakeGameHistoryRecordWerewolvesEatPlay,
  createFakeGameHistoryRecordBigBadWolfEatPlay,
  createFakeGameHistoryRecordWhiteWerewolfEatPlay,
  createFakeGameHistoryRecordSeerLookPlay,
  createFakeGameHistoryRecordCupidCharmPlay,
  createFakeGameHistoryRecordPiedPiperCharmPlay,
  createFakeGameHistoryRecordWitchUsePotionsPlay,
  createFakeGameHistoryRecordHunterShootPlay,
  createFakeGameHistoryRecordDefenderProtectPlay,
  createFakeGameHistoryRecordScandalmongerMarkPlay,
  createFakeGameHistoryRecordTwoSistersMeetEachOtherPlay,
  createFakeGameHistoryRecordThreeBrothersMeetEachOtherPlay,
  createFakeGameHistoryRecordCharmedMeetEachOtherPlay,
  createFakeGameHistoryRecordFoxSniffPlay,
  createFakeGameHistoryRecordWildChildChooseModelPlay,
  createFakeGameHistoryRecordWildWolfHoundChooseSidePlay,
  createFakeGameHistoryRecordScapegoatBanVotingPlay,
  createFakeGameHistoryRecordThiefChooseCardPlay,
  createFakeGameHistoryRecordSurvivorsElectSheriffPlay,
  createFakeGameHistoryRecordSurvivorsVotePlay,
  createFakeGameHistoryRecordSheriffDelegatePlay,
  createFakeGameHistoryRecordSheriffSettleVotesPlay,
  createFakeGameHistoryRecordPlaySource,
  createFakeGameHistoryRecordPlayVote,
  createFakeGameHistoryRecordPlayTarget,
  createFakeGameHistoryRecordPlayVoting,
  createFakeGameHistoryRecordPlayerAttributeAlteration,
  createFakeGameHistoryRecordPlay,
  createFakeGameHistoryRecord,
};