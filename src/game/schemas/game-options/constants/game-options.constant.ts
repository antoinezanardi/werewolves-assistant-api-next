import type { ApiPropertyOptions } from "@nestjs/swagger";
import { GAME_PHASES } from "../../../enums/game.enum";
import type { GameOptions } from "../schemas/game-options.schema";

const defaultGameOptions: GameOptions = Object.freeze({
  composition: { isHidden: true },
  roles: {
    areRevealedOnDeath: true,
    sheriff: {
      isEnabled: true,
      electedAt: {
        turn: 1,
        phase: GAME_PHASES.NIGHT,
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

const gameOptionsApiProperties: Record<keyof GameOptions, ApiPropertyOptions> = Object.freeze({
  composition: { description: "Game's composition options" },
  roles: { description: "Game's roles options" },
});

export { defaultGameOptions, gameOptionsApiProperties };