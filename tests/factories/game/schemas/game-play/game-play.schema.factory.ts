import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_PLAY_ACTIONS, GAME_PLAY_OCCURRENCES, GAME_PLAY_TYPES } from "@/modules/game/constants/game-play/game-play.constants";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { GamePlayCause, GamePlayOccurrence } from "@/modules/game/types/game-play/game-play.types";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source/game-play-source.schema.factory";

function createFakeGamePlay(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return plainToInstance(GamePlay, {
    type: gamePlay.type ?? faker.helpers.arrayElement(GAME_PLAY_TYPES),
    action: gamePlay.action ?? faker.helpers.arrayElement(GAME_PLAY_ACTIONS),
    source: createFakeGamePlaySource(gamePlay.source),
    causes: gamePlay.causes ?? undefined,
    occurrence: gamePlay.occurrence ?? faker.helpers.arrayElement(GAME_PLAY_OCCURRENCES),
    canBeSkipped: gamePlay.canBeSkipped ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeGamePlayStutteringJudgeRequestsAnotherVote(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "request-another-vote",
    source: createFakeGamePlaySource({ name: "stuttering-judge" }),
    action: "request-another-vote",
    occurrence: "consequential",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayAccursedWolfFatherInfects(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    action: "infect",
    source: createFakeGamePlaySource({ name: "accursed-wolf-father" }),
    occurrence: "on-nights",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayActorChoosesCard(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "choose-card",
    source: createFakeGamePlaySource({ name: "actor" }),
    action: "choose-card",
    occurrence: "on-nights",
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySurvivorsBuryDeadBodies(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "bury-dead-bodies",
    source: createFakeGamePlaySource({ name: "survivors" }),
    action: "bury-dead-bodies",
    occurrence: "consequential",
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySheriffSettlesVotes(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "sheriff" }),
    action: "settle-votes",
    occurrence: "consequential",
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySheriffDelegates(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "sheriff" }),
    action: "delegate",
    occurrence: "consequential",
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySurvivorsVote(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  let occurrence: GamePlayOccurrence = "on-days";
  const consequentialGamePlayCauses: GamePlayCause[] = ["previous-votes-were-in-ties", "stuttering-judge-request"];
  if (gamePlay.causes?.includes("angel-presence") === true) {
    occurrence = "one-night-only";
  } else if (consequentialGamePlayCauses.some(cause => gamePlay.causes?.includes(cause) === true)) {
    occurrence = "consequential";
  }
  return createFakeGamePlay({
    type: "vote",
    source: createFakeGamePlaySource({ name: "survivors" }),
    action: "vote",
    occurrence,
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySurvivorsElectSheriff(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "vote",
    source: createFakeGamePlaySource({ name: "survivors" }),
    action: "elect-sheriff",
    occurrence: "anytime",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayThiefChoosesCard(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "choose-card",
    source: createFakeGamePlaySource({ name: "thief" }),
    action: "choose-card",
    occurrence: "one-night-only",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayScapegoatBansVoting(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "scapegoat" }),
    action: "ban-voting",
    occurrence: "consequential",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWolfHoundChoosesSide(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "choose-side",
    source: createFakeGamePlaySource({ name: "wolf-hound" }),
    action: "choose-side",
    occurrence: "one-night-only",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWildChildChoosesModel(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "wild-child" }),
    action: "choose-model",
    occurrence: "one-night-only",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayFoxSniffs(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "fox" }),
    action: "sniff",
    occurrence: "on-nights",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayCharmedMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "no-action",
    source: createFakeGamePlaySource({ name: "charmed" }),
    action: "meet-each-other",
    occurrence: "on-nights",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayLoversMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "no-action",
    source: createFakeGamePlaySource({ name: "lovers" }),
    action: "meet-each-other",
    occurrence: "one-night-only",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayThreeBrothersMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "no-action",
    source: createFakeGamePlaySource({ name: "three-brothers" }),
    action: "meet-each-other",
    occurrence: "on-nights",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayTwoSistersMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "no-action",
    source: createFakeGamePlaySource({ name: "two-sisters" }),
    action: "meet-each-other",
    occurrence: "on-nights",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayScandalmongerMarks(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "scandalmonger" }),
    action: "mark",
    occurrence: "on-nights",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayDefenderProtects(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "defender" }),
    action: "protect",
    occurrence: "on-nights",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayHunterShoots(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "hunter" }),
    action: "shoot",
    occurrence: "consequential",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWitchUsesPotions(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "witch" }),
    action: "use-potions",
    occurrence: "on-nights",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayPiedPiperCharms(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "pied-piper" }),
    action: "charm",
    occurrence: "on-nights",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayCupidCharms(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "cupid" }),
    action: "charm",
    occurrence: "one-night-only",
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySeerLooks(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "seer" }),
    action: "look",
    occurrence: "on-nights",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWhiteWerewolfEats(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "white-werewolf" }),
    action: "eat",
    occurrence: "on-nights",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayBigBadWolfEats(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "big-bad-wolf" }),
    action: "eat",
    occurrence: "on-nights",
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWerewolvesEat(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    type: "target",
    source: createFakeGamePlaySource({ name: "werewolves" }),
    action: "eat",
    occurrence: "on-nights",
    ...gamePlay,
  }, override);
}

export {
  createFakeGamePlay,
  createFakeGamePlayStutteringJudgeRequestsAnotherVote,
  createFakeGamePlayAccursedWolfFatherInfects,
  createFakeGamePlayActorChoosesCard,
  createFakeGamePlaySurvivorsBuryDeadBodies,
  createFakeGamePlaySheriffSettlesVotes,
  createFakeGamePlaySheriffDelegates,
  createFakeGamePlaySurvivorsVote,
  createFakeGamePlaySurvivorsElectSheriff,
  createFakeGamePlayThiefChoosesCard,
  createFakeGamePlayScapegoatBansVoting,
  createFakeGamePlayWolfHoundChoosesSide,
  createFakeGamePlayWildChildChoosesModel,
  createFakeGamePlayFoxSniffs,
  createFakeGamePlayCharmedMeetEachOther,
  createFakeGamePlayLoversMeetEachOther,
  createFakeGamePlayThreeBrothersMeetEachOther,
  createFakeGamePlayTwoSistersMeetEachOther,
  createFakeGamePlayScandalmongerMarks,
  createFakeGamePlayDefenderProtects,
  createFakeGamePlayHunterShoots,
  createFakeGamePlayWitchUsesPotions,
  createFakeGamePlayPiedPiperCharms,
  createFakeGamePlayCupidCharms,
  createFakeGamePlaySeerLooks,
  createFakeGamePlayWhiteWerewolfEats,
  createFakeGamePlayBigBadWolfEats,
  createFakeGamePlayWerewolvesEat,
};