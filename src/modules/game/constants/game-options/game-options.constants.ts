import type { ReadonlyDeep } from "type-fest";

import type { GameOptions } from "@/modules/game/schemas/game-options/game-options.schema";

const DEFAULT_GAME_OPTIONS: ReadonlyDeep<GameOptions> = {
  composition: { isHidden: false },
  votes: {
    canBeSkipped: true,
    duration: 180,
  },
  roles: {
    areRevealedOnDeath: true,
    doSkipCallIfNoTarget: false,
    sheriff: {
      isEnabled: true,
      electedAt: {
        turn: 1,
        phaseName: "night",
      },
      hasDoubledVote: true,
      mustSettleTieInVotes: true,
    },
    werewolf: { canEatEachOther: false },
    bigBadWolf: { isPowerlessIfWerewolfDies: true },
    whiteWerewolf: { wakingUpInterval: 2 },
    seer: {
      isTalkative: true,
      canSeeRoles: true,
    },
    cupid: {
      lovers: { doRevealRoleToEachOther: false },
      mustWinWithLovers: false,
    },
    littleGirl: { isProtectedByDefender: false },
    defender: { canProtectTwice: false },
    elder: {
      livesCountAgainstWerewolves: 2,
      doesTakeHisRevenge: true,
    },
    idiot: { doesDieOnElderDeath: true },
    twoSisters: { wakingUpInterval: 2 },
    threeBrothers: { wakingUpInterval: 2 },
    fox: { isPowerlessIfMissesWerewolf: true },
    bearTamer: { doesGrowlOnWerewolvesSide: true },
    stutteringJudge: { voteRequestsCount: 1 },
    wildChild: { isTransformationRevealed: false },
    wolfHound: {
      isChosenSideRevealed: false,
      isSideRandomlyChosen: false,
    },
    thief: {
      mustChooseBetweenWerewolves: true,
      isChosenCardRevealed: false,
    },
    piedPiper: {
      charmedPeopleCountPerNight: 2,
      isPowerlessOnWerewolvesSide: true,
      areCharmedPeopleRevealed: false,
    },
    scandalmonger: { markPenalty: 2 },
    witch: { doesKnowWerewolvesTargets: true },
    prejudicedManipulator: { isPowerlessOnWerewolvesSide: true },
    actor: {
      isPowerlessOnWerewolvesSide: true,
    },
  },
};

export { DEFAULT_GAME_OPTIONS };