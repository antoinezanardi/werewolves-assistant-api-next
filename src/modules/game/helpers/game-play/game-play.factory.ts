import { plainToInstance } from "class-transformer";

import { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { GamePlayCause, GamePlayOccurrence } from "@/modules/game/types/game-play/game-play.types";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createGamePlayStutteringJudgeRequestsAnotherVote(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "request-another-vote",
    source: createGamePlaySource({ name: "stuttering-judge" }),
    action: "request-another-vote",
    occurrence: "consequential",
    ...gamePlay,
  });
}

function createGamePlaySurvivorsBuryDeadBodies(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "bury-dead-bodies",
    source: createGamePlaySource({ name: "survivors" }),
    action: "bury-dead-bodies",
    occurrence: "consequential",
    ...gamePlay,
  });
}

function createGamePlaySheriffSettlesVotes(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "sheriff" }),
    action: "settle-votes",
    occurrence: "consequential",
    ...gamePlay,
  });
}

function createGamePlaySheriffDelegates(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "sheriff" }),
    action: "delegate",
    occurrence: "consequential",
    ...gamePlay,
  });
}

function createGamePlaySurvivorsVote(gamePlay: Partial<GamePlay> = {}): GamePlay {
  let occurrence: GamePlayOccurrence = "on-days";
  const consequentialCauses: GamePlayCause[] = ["previous-votes-were-in-ties", "stuttering-judge-request"];
  if (gamePlay.causes?.includes("angel-presence") === true) {
    occurrence = "one-night-only";
  } else if (consequentialCauses.some(cause => gamePlay.causes?.includes(cause) === true)) {
    occurrence = "consequential";
  }
  return createGamePlay({
    type: "vote",
    source: createGamePlaySource({ name: "survivors" }),
    action: "vote",
    occurrence,
    ...gamePlay,
  });
}

function createGamePlaySurvivorsElectSheriff(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "vote",
    source: createGamePlaySource({ name: "survivors" }),
    action: "elect-sheriff",
    occurrence: "anytime",
    ...gamePlay,
  });
}

function createGamePlayThiefChoosesCard(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "choose-card",
    source: createGamePlaySource({ name: "thief" }),
    action: "choose-card",
    occurrence: "one-night-only",
    ...gamePlay,
  });
}

function createGamePlayScapegoatBansVoting(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "scapegoat" }),
    action: "ban-voting",
    occurrence: "consequential",
    ...gamePlay,
  });
}

function createGamePlayWolfHoundChoosesSide(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "choose-side",
    source: createGamePlaySource({ name: "wolf-hound" }),
    action: "choose-side",
    occurrence: "one-night-only",
    ...gamePlay,
  });
}

function createGamePlayWildChildChoosesModel(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "wild-child" }),
    action: "choose-model",
    occurrence: "one-night-only",
    ...gamePlay,
  });
}

function createGamePlayFoxSniffs(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "fox" }),
    action: "sniff",
    occurrence: "on-nights",
    ...gamePlay,
  });
}

function createGamePlayCharmedMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "no-action",
    source: createGamePlaySource({ name: "charmed" }),
    action: "meet-each-other",
    occurrence: "on-nights",
    ...gamePlay,
  });
}

function createGamePlayLoversMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "no-action",
    source: createGamePlaySource({ name: "lovers" }),
    action: "meet-each-other",
    occurrence: "one-night-only",
    ...gamePlay,
  });
}

function createGamePlayThreeBrothersMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "no-action",
    source: createGamePlaySource({ name: "three-brothers" }),
    action: "meet-each-other",
    occurrence: "on-nights",
    ...gamePlay,
  });
}

function createGamePlayTwoSistersMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "no-action",
    source: createGamePlaySource({ name: "two-sisters" }),
    action: "meet-each-other",
    occurrence: "on-nights",
    ...gamePlay,
  });
}

function createGamePlayScandalmongerMarks(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "scandalmonger" }),
    action: "mark",
    occurrence: "on-nights",
    ...gamePlay,
  });
}

function createGamePlayDefenderProtects(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "defender" }),
    action: "protect",
    occurrence: "on-nights",
    ...gamePlay,
  });
}

function createGamePlayHunterShoots(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "hunter" }),
    action: "shoot",
    occurrence: "consequential",
    ...gamePlay,
  });
}

function createGamePlayWitchUsesPotions(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "witch" }),
    action: "use-potions",
    occurrence: "on-nights",
    ...gamePlay,
  });
}

function createGamePlayPiedPiperCharms(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "pied-piper" }),
    action: "charm",
    occurrence: "on-nights",
    ...gamePlay,
  });
}

function createGamePlayCupidCharms(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "cupid" }),
    action: "charm",
    occurrence: "one-night-only",
    ...gamePlay,
  });
}

function createGamePlaySeerLooks(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "seer" }),
    action: "look",
    occurrence: "on-nights",
    ...gamePlay,
  });
}

function createGamePlayWhiteWerewolfEats(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "white-werewolf" }),
    action: "eat",
    occurrence: "on-nights",
    ...gamePlay,
  });
}

function createGamePlayBigBadWolfEats(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "big-bad-wolf" }),
    action: "eat",
    occurrence: "on-nights",
    ...gamePlay,
  });
}

function createGamePlayWerewolvesEat(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    type: "target",
    source: createGamePlaySource({ name: "werewolves" }),
    action: "eat",
    occurrence: "on-nights",
    ...gamePlay,
  });
}

function createGamePlaySource(gamePlaySource: GamePlaySource): GamePlaySource {
  return plainToInstance(GamePlaySource, gamePlaySource, { ...DEFAULT_PLAIN_TO_INSTANCE_OPTIONS, excludeExtraneousValues: true });
}

function createGamePlay(gamePlay: GamePlay): GamePlay {
  return plainToInstance(GamePlay, gamePlay, { ...DEFAULT_PLAIN_TO_INSTANCE_OPTIONS, excludeExtraneousValues: true });
}

export {
  createGamePlayStutteringJudgeRequestsAnotherVote,
  createGamePlaySurvivorsBuryDeadBodies,
  createGamePlaySheriffSettlesVotes,
  createGamePlaySheriffDelegates,
  createGamePlaySurvivorsVote,
  createGamePlaySurvivorsElectSheriff,
  createGamePlayThiefChoosesCard,
  createGamePlayScapegoatBansVoting,
  createGamePlayWolfHoundChoosesSide,
  createGamePlayWildChildChoosesModel,
  createGamePlayFoxSniffs,
  createGamePlayCharmedMeetEachOther,
  createGamePlayLoversMeetEachOther,
  createGamePlayThreeBrothersMeetEachOther,
  createGamePlayTwoSistersMeetEachOther,
  createGamePlayScandalmongerMarks,
  createGamePlayDefenderProtects,
  createGamePlayHunterShoots,
  createGamePlayWitchUsesPotions,
  createGamePlayPiedPiperCharms,
  createGamePlayCupidCharms,
  createGamePlaySeerLooks,
  createGamePlayWhiteWerewolfEats,
  createGamePlayBigBadWolfEats,
  createGamePlayWerewolvesEat,
  createGamePlaySource,
  createGamePlay,
};