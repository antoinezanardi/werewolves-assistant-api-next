import { WerewolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/werewolf-game-options/werewolf-game-options.schema";
import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_PHASE_NAMES } from "@/modules/game/constants/game-phase/game-phase.constants";
import { ActorGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/actor-game-options/actor-game-options.schema";
import { PrejudicedManipulatorGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/prejudiced-manipulator-game-options/prejudiced-manipulator-game-options.schema";
import { CupidGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/cupid-game-options/cupid-game-options.schema";
import { CupidLoversGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/cupid-game-options/cupid-lovers-game-options/cupid-game-options.schema";
import { WitchGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/witch-game-options/witch-game-options.schema";
import { ElderGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/elder-game-options/elder-game-options.schema";
import { BearTamerGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/bear-tamer-game-options/bear-tamer-game-options.schema";
import { BigBadWolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/big-bad-wolf-game-options/big-bad-wolf-game-options.schema";
import { WolfHoundGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/wolf-hound-game-options/wolf-hound-game-options.schema";
import { FoxGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/fox-game-options/fox-game-options.schema";
import { DefenderGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/defender-game-options/defender-game-options.schema";
import { IdiotGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/idiot-game-options/idiot-game-options.schema";
import { LittleGirlGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/little-girl-game-options/little-girl-game-options.schema";
import { PiedPiperGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/pied-piper-game-options/pied-piper-game-options.schema";
import { ScandalmongerGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/scandalmonger-game-options/scandalmonger-game-options.schema";
import { RolesGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/roles-game-options.schema";
import { SeerGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/seer-game-options/seer-game-options.schema";
import { SheriffElectionGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options/sheriff-election-game-options.schema";
import { SheriffGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema";
import { StutteringJudgeGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/stuttering-judge-game-options/stuttering-judge-game-options.schema";
import { ThiefGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/thief-game-options/thief-game-options.schema";
import { ThreeBrothersGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/three-brothers-game-options/three-brothers-game-options.schema";
import { TwoSistersGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/two-sisters-game-options/two-sisters-game-options.schema";
import { WhiteWerewolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/white-werewolf-game-options/white-werewolf-game-options.schema";
import { WildChildGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/wild-child-game-options/wild-child-game-options.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createFakeActorGameOptions(actorGameOptions: Partial<ActorGameOptions> = {}, override: object = {}): ActorGameOptions {
  return plainToInstance(ActorGameOptions, {
    isPowerlessOnWerewolvesSide: actorGameOptions.isPowerlessOnWerewolvesSide ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakePrejudicedManipulatorGameOptions(
  prejudicedManipulatorGameOptions: Partial<PrejudicedManipulatorGameOptions> = {},
  override: object = {},
): PrejudicedManipulatorGameOptions {
  return plainToInstance(PrejudicedManipulatorGameOptions, {
    isPowerlessOnWerewolvesSide: prejudicedManipulatorGameOptions.isPowerlessOnWerewolvesSide ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeWitchGameOptions(witchGameOptions: Partial<WitchGameOptions> = {}, override: object = {}): WitchGameOptions {
  return plainToInstance(WitchGameOptions, {
    doesKnowWerewolvesTargets: witchGameOptions.doesKnowWerewolvesTargets ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeScandalmongerGameOptions(scandalmongerGameOptions: Partial<ScandalmongerGameOptions> = {}, override: object = {}): ScandalmongerGameOptions {
  return plainToInstance(ScandalmongerGameOptions, {
    markPenalty: scandalmongerGameOptions.markPenalty ?? faker.number.int({ min: 1, max: 5 }),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakePiedPiperGameOptions(piedPiperGameOptions: Partial<PiedPiperGameOptions> = {}, override: object = {}): PiedPiperGameOptions {
  return plainToInstance(PiedPiperGameOptions, {
    charmedPeopleCountPerNight: piedPiperGameOptions.charmedPeopleCountPerNight ?? faker.number.int({ min: 1, max: 5 }),
    isPowerlessOnWerewolvesSide: piedPiperGameOptions.isPowerlessOnWerewolvesSide ?? faker.datatype.boolean(),
    areCharmedPeopleRevealed: piedPiperGameOptions.areCharmedPeopleRevealed ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeThiefGameOptions(thiefGameOptions: Partial<ThiefGameOptions> = {}, override: object = {}): ThiefGameOptions {
  return plainToInstance(ThiefGameOptions, {
    mustChooseBetweenWerewolves: thiefGameOptions.mustChooseBetweenWerewolves ?? faker.datatype.boolean(),
    isChosenCardRevealed: thiefGameOptions.isChosenCardRevealed ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeWolfHoundGameOptions(wolfHoundGameOptions: Partial<WolfHoundGameOptions> = {}, override: object = {}): WolfHoundGameOptions {
  return plainToInstance(WolfHoundGameOptions, {
    isChosenSideRevealed: wolfHoundGameOptions.isChosenSideRevealed ?? faker.datatype.boolean(),
    isSideRandomlyChosen: wolfHoundGameOptions.isSideRandomlyChosen ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeWildChildGameOptions(wildChildGameOptions: Partial<WildChildGameOptions> = {}, override: object = {}): WildChildGameOptions {
  return plainToInstance(WildChildGameOptions, {
    isTransformationRevealed: wildChildGameOptions.isTransformationRevealed ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeStutteringJudgeGameOptions(stutteringJudgeGameOptions: Partial<StutteringJudgeGameOptions> = {}, override: object = {}): StutteringJudgeGameOptions {
  return plainToInstance(StutteringJudgeGameOptions, {
    voteRequestsCount: stutteringJudgeGameOptions.voteRequestsCount ?? faker.number.int({ min: 1, max: 5 }),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeBearTamerGameOptions(bearTamerGameOptions: Partial<BearTamerGameOptions> = {}, override: object = {}): BearTamerGameOptions {
  return plainToInstance(BearTamerGameOptions, {
    doesGrowlOnWerewolvesSide: bearTamerGameOptions.doesGrowlOnWerewolvesSide ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeFoxGameOptions(foxGameOptions: Partial<FoxGameOptions> = {}, override: object = {}): FoxGameOptions {
  return plainToInstance(FoxGameOptions, {
    isPowerlessIfMissesWerewolf: foxGameOptions.isPowerlessIfMissesWerewolf ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeThreeBrothersGameOptions(threeBrothersGameOptions: Partial<ThreeBrothersGameOptions> = {}, override: object = {}): ThreeBrothersGameOptions {
  return plainToInstance(ThreeBrothersGameOptions, {
    wakingUpInterval: threeBrothersGameOptions.wakingUpInterval ?? faker.number.int({ min: 0, max: 5 }),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeTwoSistersGameOptions(twoSistersGameOptions: Partial<TwoSistersGameOptions> = {}, override: object = {}): TwoSistersGameOptions {
  return plainToInstance(TwoSistersGameOptions, {
    wakingUpInterval: twoSistersGameOptions.wakingUpInterval ?? faker.number.int({ min: 0, max: 5 }),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeIdiotGameOptions(idiotGameOptions: Partial<IdiotGameOptions> = {}, override: object = {}): IdiotGameOptions {
  return plainToInstance(IdiotGameOptions, {
    doesDieOnElderDeath: idiotGameOptions.doesDieOnElderDeath ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeElderGameOptions(elderGameOptions: Partial<ElderGameOptions> = {}, override: object = {}): ElderGameOptions {
  return plainToInstance(ElderGameOptions, {
    livesCountAgainstWerewolves: elderGameOptions.livesCountAgainstWerewolves ?? faker.number.int({ min: 1, max: 5 }),
    doesTakeHisRevenge: elderGameOptions.doesTakeHisRevenge ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeDefenderGameOptions(defenderGameOptions: Partial<DefenderGameOptions> = {}, override: object = {}): DefenderGameOptions {
  return plainToInstance(DefenderGameOptions, {
    canProtectTwice: defenderGameOptions.canProtectTwice ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeLittleGirlGameOptions(littleGirlGameOptions: Partial<LittleGirlGameOptions> = {}, override: object = {}): LittleGirlGameOptions {
  return plainToInstance(LittleGirlGameOptions, {
    isProtectedByDefender: littleGirlGameOptions.isProtectedByDefender ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeSeerGameOptions(seerGameOptions: Partial<SeerGameOptions> = {}, override: object = {}): SeerGameOptions {
  return plainToInstance(SeerGameOptions, {
    isTalkative: seerGameOptions.isTalkative ?? faker.datatype.boolean(),
    canSeeRoles: seerGameOptions.canSeeRoles ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCupidLoversGameOptions(cupidLoversGameOptions: Partial<CupidLoversGameOptions> = {}, override: object = {}): CupidLoversGameOptions {
  return plainToInstance(CupidLoversGameOptions, {
    doRevealRoleToEachOther: cupidLoversGameOptions.doRevealRoleToEachOther ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCupidGameOptions(cupidGameOptions: Partial<CupidGameOptions> = {}, override: object = {}): CupidGameOptions {
  return plainToInstance(CupidGameOptions, {
    lovers: createFakeCupidLoversGameOptions(cupidGameOptions.lovers),
    mustWinWithLovers: cupidGameOptions.mustWinWithLovers ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeWhiteWerewolfGameOptions(whiteWerewolfOptions: Partial<WhiteWerewolfGameOptions> = {}, override: object = {}): WhiteWerewolfGameOptions {
  return plainToInstance(WhiteWerewolfGameOptions, {
    wakingUpInterval: whiteWerewolfOptions.wakingUpInterval ?? faker.number.int({ min: 1, max: 5 }),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeBigBadWolfGameOptions(bigBadWolfOptions: Partial<BigBadWolfGameOptions> = {}, override: object = {}): BigBadWolfGameOptions {
  return plainToInstance(BigBadWolfGameOptions, {
    isPowerlessIfWerewolfDies: bigBadWolfOptions.isPowerlessIfWerewolfDies ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeWerewolfGameOptions(werewolfGameOptions: Partial<WerewolfGameOptions> = {}, override: object = {}): WerewolfGameOptions {
  return plainToInstance(WerewolfGameOptions, {
    canEatEachOther: werewolfGameOptions.canEatEachOther ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeSheriffElectionGameOptions(sheriffElectionGameOptions: Partial<SheriffElectionGameOptions> = {}, override: object = {}): SheriffElectionGameOptions {
  return plainToInstance(SheriffElectionGameOptions, {
    turn: sheriffElectionGameOptions.turn ?? faker.number.int({ min: 1 }),
    phaseName: sheriffElectionGameOptions.phaseName ?? faker.helpers.arrayElement(GAME_PHASE_NAMES),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeSheriffGameOptions(sheriffGameOptions: Partial<SheriffGameOptions> = {}, override: object = {}): SheriffGameOptions {
  return plainToInstance(SheriffGameOptions, {
    isEnabled: sheriffGameOptions.isEnabled ?? faker.datatype.boolean(),
    electedAt: createFakeSheriffElectionGameOptions(sheriffGameOptions.electedAt),
    hasDoubledVote: sheriffGameOptions.hasDoubledVote ?? faker.datatype.boolean(),
    mustSettleTieInVotes: sheriffGameOptions.mustSettleTieInVotes ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeRolesGameOptions(rolesGameOptions: Partial<RolesGameOptions> = {}, override: object = {}): RolesGameOptions {
  return plainToInstance(RolesGameOptions, {
    doSkipCallIfNoTarget: rolesGameOptions.doSkipCallIfNoTarget ?? faker.datatype.boolean(),
    areRevealedOnDeath: rolesGameOptions.areRevealedOnDeath ?? faker.datatype.boolean(),
    sheriff: createFakeSheriffGameOptions(rolesGameOptions.sheriff),
    werewolf: createFakeWerewolfGameOptions(rolesGameOptions.werewolf),
    bigBadWolf: createFakeBigBadWolfGameOptions(rolesGameOptions.bigBadWolf),
    whiteWerewolf: createFakeWhiteWerewolfGameOptions(rolesGameOptions.whiteWerewolf),
    seer: createFakeSeerGameOptions(rolesGameOptions.seer),
    cupid: createFakeCupidGameOptions(rolesGameOptions.cupid),
    littleGirl: createFakeLittleGirlGameOptions(rolesGameOptions.littleGirl),
    defender: createFakeDefenderGameOptions(rolesGameOptions.defender),
    elder: createFakeElderGameOptions(rolesGameOptions.elder),
    idiot: createFakeIdiotGameOptions(rolesGameOptions.idiot),
    twoSisters: createFakeTwoSistersGameOptions(rolesGameOptions.twoSisters),
    threeBrothers: createFakeThreeBrothersGameOptions(rolesGameOptions.threeBrothers),
    fox: createFakeFoxGameOptions(rolesGameOptions.fox),
    bearTamer: createFakeBearTamerGameOptions(rolesGameOptions.bearTamer),
    stutteringJudge: createFakeStutteringJudgeGameOptions(rolesGameOptions.stutteringJudge),
    wildChild: createFakeWildChildGameOptions(rolesGameOptions.wildChild),
    wolfHound: createFakeWolfHoundGameOptions(rolesGameOptions.wolfHound),
    thief: createFakeThiefGameOptions(rolesGameOptions.thief),
    piedPiper: createFakePiedPiperGameOptions(rolesGameOptions.piedPiper),
    scandalmonger: createFakeScandalmongerGameOptions(rolesGameOptions.scandalmonger),
    witch: createFakeWitchGameOptions(rolesGameOptions.witch),
    prejudicedManipulator: createFakePrejudicedManipulatorGameOptions(rolesGameOptions.prejudicedManipulator),
    actor: createFakeActorGameOptions(rolesGameOptions.actor),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createFakeActorGameOptions,
  createFakePrejudicedManipulatorGameOptions,
  createFakeWitchGameOptions,
  createFakeScandalmongerGameOptions,
  createFakePiedPiperGameOptions,
  createFakeThiefGameOptions,
  createFakeWolfHoundGameOptions,
  createFakeWildChildGameOptions,
  createFakeStutteringJudgeGameOptions,
  createFakeBearTamerGameOptions,
  createFakeFoxGameOptions,
  createFakeThreeBrothersGameOptions,
  createFakeTwoSistersGameOptions,
  createFakeIdiotGameOptions,
  createFakeElderGameOptions,
  createFakeDefenderGameOptions,
  createFakeLittleGirlGameOptions,
  createFakeSeerGameOptions,
  createFakeCupidGameOptions,
  createFakeCupidLoversGameOptions,
  createFakeWhiteWerewolfGameOptions,
  createFakeBigBadWolfGameOptions,
  createFakeWerewolfGameOptions,
  createFakeSheriffElectionGameOptions,
  createFakeSheriffGameOptions,
  createFakeRolesGameOptions,
};