import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_PHASES } from "@/modules/game/enums/game.enum";
import { AncientGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/ancient-game-options.schema";
import { BearTamerGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/bear-tamer-game-options.schema";
import { BigBadWolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/big-bad-wolf-game-options.schema";
import { DogWolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/dog-wolf-game-options.schema";
import { FoxGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/fox-game-options.schema";
import { GuardGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/guard-game-options.schema";
import { IdiotGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/idiot-game-options.schema";
import { LittleGirlGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/little-girl-game-options.schema";
import { PiedPiperGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/pied-piper-game-options.schema";
import { RavenGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/raven-game-options.schema";
import { RolesGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/roles-game-options.schema";
import { SeerGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/seer-game-options.schema";
import { SheriffElectionGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options.schema";
import { SheriffGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema";
import { StutteringJudgeGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/stuttering-judge-game-options.schema";
import { ThiefGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/thief-game-options.schema";
import { ThreeBrothersGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/three-brothers-game-options.schema";
import { TwoSistersGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/two-sisters-game-options.schema";
import { WhiteWerewolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/white-werewolf-game-options.schema";
import { WildChildGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/wild-child-game-options.schema";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

function createFakeRavenGameOptions(ravenGameOptions: Partial<RavenGameOptions> = {}, override: object = {}): RavenGameOptions {
  return plainToInstance(RavenGameOptions, {
    markPenalty: ravenGameOptions.markPenalty ?? faker.number.int({ min: 1, max: 5 }),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakePiedPiperGameOptions(piedPiperGameOptions: Partial<PiedPiperGameOptions> = {}, override: object = {}): PiedPiperGameOptions {
  return plainToInstance(PiedPiperGameOptions, {
    charmedPeopleCountPerNight: piedPiperGameOptions.charmedPeopleCountPerNight ?? faker.number.int({ min: 1, max: 5 }),
    isPowerlessIfInfected: piedPiperGameOptions.isPowerlessIfInfected ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeThiefGameOptions(thiefGameOptions: Partial<ThiefGameOptions> = {}, override: object = {}): ThiefGameOptions {
  return plainToInstance(ThiefGameOptions, {
    mustChooseBetweenWerewolves: thiefGameOptions.mustChooseBetweenWerewolves ?? faker.datatype.boolean(),
    additionalCardsCount: thiefGameOptions.additionalCardsCount ?? faker.number.int({ min: 1, max: 5 }),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeDogWolfGameOptions(dogWolfGameOptions: Partial<DogWolfGameOptions> = {}, override: object = {}): DogWolfGameOptions {
  return plainToInstance(DogWolfGameOptions, {
    isChosenSideRevealed: dogWolfGameOptions.isChosenSideRevealed ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeWildChildGameOptions(wildChildGameOptions: Partial<WildChildGameOptions> = {}, override: object = {}): WildChildGameOptions {
  return plainToInstance(WildChildGameOptions, {
    isTransformationRevealed: wildChildGameOptions.isTransformationRevealed ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeStutteringJudgeGameOptions(stutteringJudgeGameOptions: Partial<StutteringJudgeGameOptions> = {}, override: object = {}): StutteringJudgeGameOptions {
  return plainToInstance(StutteringJudgeGameOptions, {
    voteRequestsCount: stutteringJudgeGameOptions.voteRequestsCount ?? faker.number.int({ min: 1, max: 5 }),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeBearTamerGameOptions(bearTamerGameOptions: Partial<BearTamerGameOptions> = {}, override: object = {}): BearTamerGameOptions {
  return plainToInstance(BearTamerGameOptions, {
    doesGrowlIfInfected: bearTamerGameOptions.doesGrowlIfInfected ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeFoxGameOptions(foxGameOptions: Partial<FoxGameOptions> = {}, override: object = {}): FoxGameOptions {
  return plainToInstance(FoxGameOptions, {
    isPowerlessIfMissesWerewolf: foxGameOptions.isPowerlessIfMissesWerewolf ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeThreeBrothersGameOptions(threeBrothersGameOptions: Partial<ThreeBrothersGameOptions> = {}, override: object = {}): ThreeBrothersGameOptions {
  return plainToInstance(ThreeBrothersGameOptions, {
    wakingUpInterval: threeBrothersGameOptions.wakingUpInterval ?? faker.number.int({ min: 0, max: 5 }),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeTwoSistersGameOptions(twoSistersGameOptions: Partial<TwoSistersGameOptions> = {}, override: object = {}): TwoSistersGameOptions {
  return plainToInstance(TwoSistersGameOptions, {
    wakingUpInterval: twoSistersGameOptions.wakingUpInterval ?? faker.number.int({ min: 0, max: 5 }),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeIdiotGameOptions(idiotGameOptions: Partial<IdiotGameOptions> = {}, override: object = {}): IdiotGameOptions {
  return plainToInstance(IdiotGameOptions, {
    doesDieOnAncientDeath: idiotGameOptions.doesDieOnAncientDeath ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeAncientGameOptions(ancientGameOptions: Partial<AncientGameOptions> = {}, override: object = {}): AncientGameOptions {
  return plainToInstance(AncientGameOptions, {
    livesCountAgainstWerewolves: ancientGameOptions.livesCountAgainstWerewolves ?? faker.number.int({ min: 1, max: 5 }),
    doesTakeHisRevenge: ancientGameOptions.doesTakeHisRevenge ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeGuardGameOptions(guardGameOptions: Partial<GuardGameOptions> = {}, override: object = {}): GuardGameOptions {
  return plainToInstance(GuardGameOptions, {
    canProtectTwice: guardGameOptions.canProtectTwice ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeLittleGirlGameOptions(littleGirlGameOptions: Partial<LittleGirlGameOptions> = {}, override: object = {}): LittleGirlGameOptions {
  return plainToInstance(LittleGirlGameOptions, {
    isProtectedByGuard: littleGirlGameOptions.isProtectedByGuard ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeSeerGameOptions(seerGameOptions: Partial<SeerGameOptions> = {}, override: object = {}): SeerGameOptions {
  return plainToInstance(SeerGameOptions, {
    isTalkative: seerGameOptions.isTalkative ?? faker.datatype.boolean(),
    canSeeRoles: seerGameOptions.canSeeRoles ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeWhiteWerewolfGameOptions(whiteWerewolfOptions: Partial<WhiteWerewolfGameOptions> = {}, override: object = {}): WhiteWerewolfGameOptions {
  return plainToInstance(WhiteWerewolfGameOptions, {
    wakingUpInterval: whiteWerewolfOptions.wakingUpInterval ?? faker.number.int({ min: 1, max: 5 }),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeBigBadWolfGameOptions(bigBadWolfOptions: Partial<BigBadWolfGameOptions> = {}, override: object = {}): BigBadWolfGameOptions {
  return plainToInstance(BigBadWolfGameOptions, {
    isPowerlessIfWerewolfDies: bigBadWolfOptions.isPowerlessIfWerewolfDies ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeSheriffElectionGameOptions(sheriffElectionGameOptions: Partial<SheriffElectionGameOptions> = {}, override: object = {}): SheriffElectionGameOptions {
  return plainToInstance(SheriffElectionGameOptions, {
    turn: sheriffElectionGameOptions.turn ?? faker.number.int({ min: 1 }),
    phase: sheriffElectionGameOptions.phase ?? faker.helpers.arrayElement(Object.values(GAME_PHASES)),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeSheriffGameOptions(sheriffGameOptions: Partial<SheriffGameOptions> = {}, override: object = {}): SheriffGameOptions {
  return plainToInstance(SheriffGameOptions, {
    isEnabled: sheriffGameOptions.isEnabled ?? faker.datatype.boolean(),
    electedAt: createFakeSheriffElectionGameOptions(sheriffGameOptions.electedAt),
    hasDoubledVote: sheriffGameOptions.hasDoubledVote ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakeRolesGameOptions(rolesGameOptions: Partial<RolesGameOptions> = {}, override: object = {}): RolesGameOptions {
  return plainToInstance(RolesGameOptions, {
    doSkipCallIfNoTarget: rolesGameOptions.doSkipCallIfNoTarget ?? faker.datatype.boolean(),
    areRevealedOnDeath: rolesGameOptions.areRevealedOnDeath ?? faker.datatype.boolean(),
    sheriff: createFakeSheriffGameOptions(rolesGameOptions.sheriff),
    bigBadWolf: createFakeBigBadWolfGameOptions(rolesGameOptions.bigBadWolf),
    whiteWerewolf: createFakeWhiteWerewolfGameOptions(rolesGameOptions.whiteWerewolf),
    seer: createFakeSeerGameOptions(rolesGameOptions.seer),
    littleGirl: createFakeLittleGirlGameOptions(rolesGameOptions.littleGirl),
    guard: createFakeGuardGameOptions(rolesGameOptions.guard),
    ancient: createFakeAncientGameOptions(rolesGameOptions.ancient),
    idiot: createFakeIdiotGameOptions(rolesGameOptions.idiot),
    twoSisters: createFakeTwoSistersGameOptions(rolesGameOptions.twoSisters),
    threeBrothers: createFakeThreeBrothersGameOptions(rolesGameOptions.threeBrothers),
    fox: createFakeFoxGameOptions(rolesGameOptions.fox),
    bearTamer: createFakeBearTamerGameOptions(rolesGameOptions.bearTamer),
    stutteringJudge: createFakeStutteringJudgeGameOptions(rolesGameOptions.stutteringJudge),
    wildChild: createFakeWildChildGameOptions(rolesGameOptions.wildChild),
    dogWolf: createFakeDogWolfGameOptions(rolesGameOptions.dogWolf),
    thief: createFakeThiefGameOptions(rolesGameOptions.thief),
    piedPiper: createFakePiedPiperGameOptions(rolesGameOptions.piedPiper),
    raven: createFakeRavenGameOptions(rolesGameOptions.raven),
    ...override,
  }, plainToInstanceDefaultOptions);
}

export {
  createFakeRavenGameOptions,
  createFakePiedPiperGameOptions,
  createFakeThiefGameOptions,
  createFakeDogWolfGameOptions,
  createFakeWildChildGameOptions,
  createFakeStutteringJudgeGameOptions,
  createFakeBearTamerGameOptions,
  createFakeFoxGameOptions,
  createFakeThreeBrothersGameOptions,
  createFakeTwoSistersGameOptions,
  createFakeIdiotGameOptions,
  createFakeAncientGameOptions,
  createFakeGuardGameOptions,
  createFakeLittleGirlGameOptions,
  createFakeSeerGameOptions,
  createFakeWhiteWerewolfGameOptions,
  createFakeBigBadWolfGameOptions,
  createFakeSheriffElectionGameOptions,
  createFakeSheriffGameOptions,
  createFakeRolesGameOptions,
};