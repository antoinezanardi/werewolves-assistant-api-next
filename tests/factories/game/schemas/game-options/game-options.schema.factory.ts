import { faker } from "@faker-js/faker";
import { GAME_PHASES } from "../../../../../src/modules/game/enums/game.enum";
import type { GameOptions } from "../../../../../src/modules/game/schemas/game-options/schemas/game-options.schema";
import type { AncientGameOptions } from "../../../../../src/modules/game/schemas/game-options/schemas/roles-game-options/ancient-game-options.schema";
import type { PiedPiperGameOptions } from "../../../../../src/modules/game/schemas/game-options/schemas/roles-game-options/pied-piper-game-options.schema";
import type { RolesGameOptions } from "../../../../../src/modules/game/schemas/game-options/schemas/roles-game-options/roles-game-options.schema";
import type { SeerGameOptions } from "../../../../../src/modules/game/schemas/game-options/schemas/roles-game-options/seer-game-options.schema";
import type { SheriffGameOptions } from "../../../../../src/modules/game/schemas/game-options/schemas/roles-game-options/sheriff-game-options/sheriff-game-options.schema";
import type { ThiefGameOptions } from "../../../../../src/modules/game/schemas/game-options/schemas/roles-game-options/thief-game-options.schema";

function createFakePiedPiperGameOptions(obj: Partial<PiedPiperGameOptions> = {}): PiedPiperGameOptions {
  return {
    charmedPeopleCountPerNight: obj.charmedPeopleCountPerNight ?? faker.datatype.number({ min: 1, max: 5 }),
    isPowerlessIfInfected: obj.isPowerlessIfInfected ?? faker.datatype.boolean(),
  };
}

function createFakeThiefGameOptions(obj: Partial<ThiefGameOptions> = {}): ThiefGameOptions {
  return {
    mustChooseBetweenWerewolves: obj.mustChooseBetweenWerewolves ?? faker.datatype.boolean(),
    additionalCardsCount: obj.additionalCardsCount ?? faker.datatype.number({ min: 1, max: 5 }),
  };
}

function createFakeAncientGameOptions(obj: Partial<AncientGameOptions> = {}): AncientGameOptions {
  return {
    livesCountAgainstWerewolves: obj.livesCountAgainstWerewolves ?? faker.datatype.number({ min: 1, max: 5 }),
    doesTakeHisRevenge: obj.doesTakeHisRevenge ?? faker.datatype.boolean(),
  };
}

function createFakeSeerGameOptions(obj: Partial<SeerGameOptions> = {}): SeerGameOptions {
  return {
    isTalkative: obj.isTalkative ?? faker.datatype.boolean(),
    canSeeRoles: obj.canSeeRoles ?? faker.datatype.boolean(),
  };
}

function createFakeSheriffGameOptions(obj: Partial<SheriffGameOptions> = {}): SheriffGameOptions {
  return {
    isEnabled: obj.isEnabled ?? faker.datatype.boolean(),
    electedAt: {
      turn: obj.electedAt?.turn ?? faker.datatype.number({ min: 1 }),
      phase: obj.electedAt?.phase ?? faker.helpers.arrayElement(Object.values(GAME_PHASES)),
    },
    hasDoubledVote: obj.hasDoubledVote ?? faker.datatype.boolean(),
  };
}

function createFakeRolesGameOptions(obj: Partial<RolesGameOptions> = {}): RolesGameOptions {
  return {
    areRevealedOnDeath: obj.areRevealedOnDeath ?? faker.datatype.boolean(),
    sheriff: createFakeSheriffGameOptions(obj.sheriff),
    bigBadWolf: { isPowerlessIfWerewolfDies: obj.bigBadWolf?.isPowerlessIfWerewolfDies ?? faker.datatype.boolean() },
    whiteWerewolf: { wakingUpInterval: obj.whiteWerewolf?.wakingUpInterval ?? faker.datatype.number({ min: 1, max: 5 }) },
    seer: createFakeSeerGameOptions(obj.seer),
    littleGirl: { isProtectedByGuard: obj.littleGirl?.isProtectedByGuard ?? faker.datatype.boolean() },
    guard: { canProtectTwice: obj.guard?.canProtectTwice ?? faker.datatype.boolean() },
    ancient: createFakeAncientGameOptions(obj.ancient),
    idiot: { doesDieOnAncientDeath: obj.idiot?.doesDieOnAncientDeath ?? faker.datatype.boolean() },
    twoSisters: { wakingUpInterval: obj.twoSisters?.wakingUpInterval ?? faker.datatype.number({ min: 0, max: 5 }) },
    threeBrothers: { wakingUpInterval: obj.threeBrothers?.wakingUpInterval ?? faker.datatype.number({ min: 0, max: 5 }) },
    fox: { isPowerlessIfMissesWerewolf: obj.fox?.isPowerlessIfMissesWerewolf ?? faker.datatype.boolean() },
    bearTamer: { doesGrowlIfInfected: obj.bearTamer?.doesGrowlIfInfected ?? faker.datatype.boolean() },
    stutteringJudge: { voteRequestsCount: obj.stutteringJudge?.voteRequestsCount ?? faker.datatype.number({ min: 1, max: 5 }) },
    wildChild: { isTransformationRevealed: obj.wildChild?.isTransformationRevealed ?? faker.datatype.boolean() },
    dogWolf: { isChosenSideRevealed: obj.dogWolf?.isChosenSideRevealed ?? faker.datatype.boolean() },
    thief: createFakeThiefGameOptions(obj.thief),
    piedPiper: createFakePiedPiperGameOptions(obj.piedPiper),
    raven: { markPenalty: obj.raven?.markPenalty ?? faker.datatype.number({ min: 1, max: 5 }) },
  };
}

function createFakeGameOptions(obj: Partial<GameOptions> = {}): GameOptions {
  return {
    composition: { isHidden: obj.composition?.isHidden ?? faker.datatype.boolean() },
    roles: createFakeRolesGameOptions(obj.roles),
  };
}

export { createFakeGameOptions };