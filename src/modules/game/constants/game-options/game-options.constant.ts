import type { ApiPropertyOptions } from "@nestjs/swagger";

import { GamePhases } from "@/modules/game/enums/game.enum";
import type { GameOptions } from "@/modules/game/schemas/game-options/game-options.schema";

const DEFAULT_GAME_OPTIONS: GameOptions = Object.freeze({
  composition: { isHidden: false },
  votes: { canBeSkipped: true },
  roles: {
    areRevealedOnDeath: true,
    doSkipCallIfNoTarget: false,
    sheriff: {
      isEnabled: true,
      electedAt: {
        turn: 1,
        phase: GamePhases.NIGHT,
      },
      hasDoubledVote: true,
    },
    bigBadWolf: { isPowerlessIfWerewolfDies: true },
    whiteWerewolf: { wakingUpInterval: 2 },
    seer: {
      isTalkative: true,
      canSeeRoles: true,
    },
    littleGirl: { isProtectedByGuard: false },
    guard: { canProtectTwice: false },
    ancient: {
      livesCountAgainstWerewolves: 2,
      doesTakeHisRevenge: true,
    },
    idiot: { doesDieOnAncientDeath: true },
    twoSisters: { wakingUpInterval: 2 },
    threeBrothers: { wakingUpInterval: 2 },
    fox: { isPowerlessIfMissesWerewolf: true },
    bearTamer: { doesGrowlIfInfected: true },
    stutteringJudge: { voteRequestsCount: 1 },
    wildChild: { isTransformationRevealed: false },
    dogWolf: { isChosenSideRevealed: false },
    thief: {
      mustChooseBetweenWerewolves: true,
      additionalCardsCount: 2,
    },
    piedPiper: {
      charmedPeopleCountPerNight: 2,
      isPowerlessIfInfected: true,
    },
    raven: { markPenalty: 2 },
  },
});

const GAME_OPTIONS_API_PROPERTIES: Record<keyof GameOptions, ApiPropertyOptions> = Object.freeze({
  composition: { description: "Game's composition options" },
  votes: { description: "Game's votes options" },
  roles: { description: "Game's roles options" },
});

export {
  DEFAULT_GAME_OPTIONS,
  GAME_OPTIONS_API_PROPERTIES,
};