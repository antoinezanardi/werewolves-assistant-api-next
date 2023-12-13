import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { CreateActorGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-actor-game-options.dto";
import { CreatePrejudicedManipulatorGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-prejudiced-manipulator-game-options.dto";
import { CreateCupidGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-cupid-game-options/create-cupid-game-options.dto";
import { CreateCupidLoversGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-cupid-game-options/create-cupid-lovers-game-options.dto";
import { CreateWitchGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-witch-game-options.dto";
import { CreateElderGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-elder-game-options.dto";
import { CreateBearTamerGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-bear-tamer-game-options.dto";
import { CreateBigBadWolfGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-big-bad-wolf-game-options.dto";
import { CreateWolfHoundGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-wolf-hound-game-options.dto";
import { CreateFoxGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-fox-game-options.dto";
import { CreateDefenderGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-defender-game-options.dto";
import { CreateIdiotGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-idiot-game-options.dto";
import { CreateLittleGirlGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-little-girl-game-options.dto";
import { CreatePiedPiperGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-pied-piper-game-options.dto";
import { CreateScandalmongerGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-scandalmonger-game-options.dto";
import { CreateRolesGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-roles-game-options.dto";
import { CreateSeerGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-seer-game-options.dto";
import { CreateSheriffElectionGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-sheriff-game-options/create-sheriff-election-game-options.dto";
import { CreateSheriffGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-sheriff-game-options/create-sheriff-game-options.dto";
import { CreateStutteringJudgeGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-stuttering-judge-game-options.dto";
import { CreateThiefGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-thief-game-options.dto";
import { CreateThreeBrothersGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-three-brothers-game-options.dto";
import { CreateTwoSistersGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-two-sisters-game-options.dto";
import { CreateWhiteWerewolfGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-white-werewolf-game-options.dto";
import { CreateWildChildGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-wild-child-game-options.dto";
import { GamePhases } from "@/modules/game/enums/game.enum";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createFakeActorGameOptionsDto(actorGameOptions: Partial<CreateActorGameOptionsDto> = {}, override: object = {}): CreateActorGameOptionsDto {
  return plainToInstance(CreateActorGameOptionsDto, {
    isPowerlessOnWerewolvesSide: actorGameOptions.isPowerlessOnWerewolvesSide ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreatePrejudicedManipulatorGameOptionsDto(
  prejudicedManipulatorGameOptions: Partial<CreatePrejudicedManipulatorGameOptionsDto> = {},
  override: object = {},
): CreatePrejudicedManipulatorGameOptionsDto {
  return plainToInstance(CreatePrejudicedManipulatorGameOptionsDto, {
    isPowerlessOnWerewolvesSide: prejudicedManipulatorGameOptions.isPowerlessOnWerewolvesSide ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateWitchGameOptionsDto(witchGameOptions: Partial<CreateWitchGameOptionsDto> = {}, override: object = {}): CreateWitchGameOptionsDto {
  return plainToInstance(CreateWitchGameOptionsDto, {
    doesKnowWerewolvesTargets: witchGameOptions.doesKnowWerewolvesTargets ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateScandalmongerGameOptionsDto(
  scandalmongerGameOptions: Partial<CreateScandalmongerGameOptionsDto> = {},
  override: object = {},
): CreateScandalmongerGameOptionsDto {
  return plainToInstance(CreateScandalmongerGameOptionsDto, {
    markPenalty: scandalmongerGameOptions.markPenalty ?? faker.number.int({ min: 1, max: 5 }),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreatePiedPiperGameOptionsDto(piedPiperGameOptions: Partial<CreatePiedPiperGameOptionsDto> = {}, override: object = {}): CreatePiedPiperGameOptionsDto {
  return plainToInstance(CreatePiedPiperGameOptionsDto, {
    charmedPeopleCountPerNight: piedPiperGameOptions.charmedPeopleCountPerNight ?? faker.number.int({ min: 1, max: 5 }),
    isPowerlessOnWerewolvesSide: piedPiperGameOptions.isPowerlessOnWerewolvesSide ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateThiefGameOptionsDto(thiefGameOptions: Partial<CreateThiefGameOptionsDto> = {}, override: object = {}): CreateThiefGameOptionsDto {
  return plainToInstance(CreateThiefGameOptionsDto, {
    mustChooseBetweenWerewolves: thiefGameOptions.mustChooseBetweenWerewolves ?? faker.datatype.boolean(),
    isChosenCardRevealed: thiefGameOptions.isChosenCardRevealed ?? faker.datatype.boolean(),
    additionalCardsCount: thiefGameOptions.additionalCardsCount ?? faker.number.int({ min: 1, max: 5 }),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateWolfHoundGameOptionsDto(wolfHoundGameOptions: Partial<CreateWolfHoundGameOptionsDto> = {}, override: object = {}): CreateWolfHoundGameOptionsDto {
  return plainToInstance(CreateWolfHoundGameOptionsDto, {
    isChosenSideRevealed: wolfHoundGameOptions.isChosenSideRevealed ?? faker.datatype.boolean(),
    isSideRandomlyChosen: wolfHoundGameOptions.isSideRandomlyChosen ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateWildChildGameOptionsDto(wildChildGameOptions: Partial<CreateWildChildGameOptionsDto> = {}, override: object = {}): CreateWildChildGameOptionsDto {
  return plainToInstance(CreateWildChildGameOptionsDto, {
    isTransformationRevealed: wildChildGameOptions.isTransformationRevealed ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateStutteringJudgeGameOptionsDto(
  stutteringJudgeGameOptions: Partial<CreateStutteringJudgeGameOptionsDto> = {},
  override: object = {},
): CreateStutteringJudgeGameOptionsDto {
  return plainToInstance(CreateStutteringJudgeGameOptionsDto, {
    voteRequestsCount: stutteringJudgeGameOptions.voteRequestsCount ?? faker.number.int({ min: 1, max: 5 }),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateBearTamerGameOptionsDto(bearTamerGameOptions: Partial<CreateBearTamerGameOptionsDto> = {}, override: object = {}): CreateBearTamerGameOptionsDto {
  return plainToInstance(CreateBearTamerGameOptionsDto, {
    doesGrowlOnWerewolvesSide: bearTamerGameOptions.doesGrowlOnWerewolvesSide ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateFoxGameOptionsDto(foxGameOptions: Partial<CreateFoxGameOptionsDto> = {}, override: object = {}): CreateFoxGameOptionsDto {
  return plainToInstance(CreateFoxGameOptionsDto, {
    isPowerlessIfMissesWerewolf: foxGameOptions.isPowerlessIfMissesWerewolf ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateThreeBrothersGameOptionsDto(
  threeBrothersGameOptions: Partial<CreateThreeBrothersGameOptionsDto> = {},
  override: object = {},
): CreateThreeBrothersGameOptionsDto {
  return plainToInstance(CreateThreeBrothersGameOptionsDto, {
    wakingUpInterval: threeBrothersGameOptions.wakingUpInterval ?? faker.number.int({ min: 0, max: 5 }),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateTwoSistersGameOptionsDto(twoSistersGameOptions: Partial<CreateTwoSistersGameOptionsDto> = {}, override: object = {}): CreateTwoSistersGameOptionsDto {
  return plainToInstance(CreateTwoSistersGameOptionsDto, {
    wakingUpInterval: twoSistersGameOptions.wakingUpInterval ?? faker.number.int({ min: 0, max: 5 }),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateIdiotGameOptionsDto(idiotGameOptions: Partial<CreateIdiotGameOptionsDto> = {}, override: object = {}): CreateIdiotGameOptionsDto {
  return plainToInstance(CreateIdiotGameOptionsDto, {
    doesDieOnElderDeath: idiotGameOptions.doesDieOnElderDeath ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateElderGameOptionsDto(elderGameOptions: Partial<CreateElderGameOptionsDto> = {}, override: object = {}): CreateElderGameOptionsDto {
  return plainToInstance(CreateElderGameOptionsDto, {
    livesCountAgainstWerewolves: elderGameOptions.livesCountAgainstWerewolves ?? faker.number.int({ min: 1, max: 5 }),
    doesTakeHisRevenge: elderGameOptions.doesTakeHisRevenge ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateDefenderGameOptionsDto(defenderGameOptions: Partial<CreateDefenderGameOptionsDto> = {}, override: object = {}): CreateDefenderGameOptionsDto {
  return plainToInstance(CreateDefenderGameOptionsDto, {
    canProtectTwice: defenderGameOptions.canProtectTwice ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateLittleGirlGameOptionsDto(littleGirlGameOptions: Partial<CreateLittleGirlGameOptionsDto> = {}, override: object = {}): CreateLittleGirlGameOptionsDto {
  return plainToInstance(CreateLittleGirlGameOptionsDto, {
    isProtectedByDefender: littleGirlGameOptions.isProtectedByDefender ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateSeerGameOptionsDto(seerGameOptions: Partial<CreateSeerGameOptionsDto> = {}, override: object = {}): CreateSeerGameOptionsDto {
  return plainToInstance(CreateSeerGameOptionsDto, {
    isTalkative: seerGameOptions.isTalkative ?? faker.datatype.boolean(),
    canSeeRoles: seerGameOptions.canSeeRoles ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateCupidLoversGameOptionsDto(cupidLoversGameOptions: Partial<CreateCupidLoversGameOptionsDto> = {}, override: object = {}): CreateCupidLoversGameOptionsDto {
  return plainToInstance(CreateCupidLoversGameOptionsDto, {
    doRevealRoleToEachOther: cupidLoversGameOptions.doRevealRoleToEachOther ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateCupidGameOptionsDto(cupidGameOptions: Partial<CreateCupidGameOptionsDto> = {}, override: object = {}): CreateCupidGameOptionsDto {
  return plainToInstance(CreateCupidGameOptionsDto, {
    lovers: createFakeCreateCupidLoversGameOptionsDto(cupidGameOptions.lovers),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateWhiteWerewolfGameOptionsDto(
  whiteWerewolfOptions: Partial<CreateWhiteWerewolfGameOptionsDto> = {},
  override: object = {},
): CreateWhiteWerewolfGameOptionsDto {
  return plainToInstance(CreateWhiteWerewolfGameOptionsDto, {
    wakingUpInterval: whiteWerewolfOptions.wakingUpInterval ?? faker.number.int({ min: 1, max: 5 }),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateBigBadWolfGameOptionsDto(bigBadWolfOptions: Partial<CreateBigBadWolfGameOptionsDto> = {}, override: object = {}): CreateBigBadWolfGameOptionsDto {
  return plainToInstance(CreateBigBadWolfGameOptionsDto, {
    isPowerlessIfWerewolfDies: bigBadWolfOptions.isPowerlessIfWerewolfDies ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateSheriffElectionGameOptionsDto(
  sheriffElectionGameOptions: Partial<CreateSheriffElectionGameOptionsDto> = {},
  override: object = {},
): CreateSheriffElectionGameOptionsDto {
  return plainToInstance(CreateSheriffElectionGameOptionsDto, {
    turn: sheriffElectionGameOptions.turn ?? faker.number.int({ min: 1 }),
    phase: sheriffElectionGameOptions.phase ?? faker.helpers.arrayElement(Object.values(GamePhases)),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeCreateSheriffGameOptionsDto(sheriffGameOptions: Partial<CreateSheriffGameOptionsDto> = {}, override: object = {}): CreateSheriffGameOptionsDto {
  return plainToInstance(CreateSheriffGameOptionsDto, {
    isEnabled: sheriffGameOptions.isEnabled ?? faker.datatype.boolean(),
    electedAt: createFakeCreateSheriffElectionGameOptionsDto(sheriffGameOptions.electedAt),
    hasDoubledVote: sheriffGameOptions.hasDoubledVote ?? faker.datatype.boolean(),
    mustSettleTieInVotes: sheriffGameOptions.mustSettleTieInVotes ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeRolesGameOptionsDto(rolesGameOptions: Partial<CreateRolesGameOptionsDto> = {}, override: object = {}): CreateRolesGameOptionsDto {
  return plainToInstance(CreateRolesGameOptionsDto, {
    doSkipCallIfNoTarget: rolesGameOptions.doSkipCallIfNoTarget ?? faker.datatype.boolean(),
    areRevealedOnDeath: rolesGameOptions.areRevealedOnDeath ?? faker.datatype.boolean(),
    sheriff: createFakeCreateSheriffGameOptionsDto(rolesGameOptions.sheriff),
    bigBadWolf: createFakeCreateBigBadWolfGameOptionsDto(rolesGameOptions.bigBadWolf),
    whiteWerewolf: createFakeCreateWhiteWerewolfGameOptionsDto(rolesGameOptions.whiteWerewolf),
    seer: createFakeCreateSeerGameOptionsDto(rolesGameOptions.seer),
    cupid: createFakeCreateCupidGameOptionsDto(rolesGameOptions.cupid),
    littleGirl: createFakeCreateLittleGirlGameOptionsDto(rolesGameOptions.littleGirl),
    defender: createFakeCreateDefenderGameOptionsDto(rolesGameOptions.defender),
    elder: createFakeCreateElderGameOptionsDto(rolesGameOptions.elder),
    idiot: createFakeCreateIdiotGameOptionsDto(rolesGameOptions.idiot),
    twoSisters: createFakeCreateTwoSistersGameOptionsDto(rolesGameOptions.twoSisters),
    threeBrothers: createFakeCreateThreeBrothersGameOptionsDto(rolesGameOptions.threeBrothers),
    fox: createFakeCreateFoxGameOptionsDto(rolesGameOptions.fox),
    bearTamer: createFakeCreateBearTamerGameOptionsDto(rolesGameOptions.bearTamer),
    stutteringJudge: createFakeCreateStutteringJudgeGameOptionsDto(rolesGameOptions.stutteringJudge),
    wildChild: createFakeCreateWildChildGameOptionsDto(rolesGameOptions.wildChild),
    wolfHound: createFakeCreateWolfHoundGameOptionsDto(rolesGameOptions.wolfHound),
    thief: createFakeCreateThiefGameOptionsDto(rolesGameOptions.thief),
    piedPiper: createFakeCreatePiedPiperGameOptionsDto(rolesGameOptions.piedPiper),
    scandalmonger: createFakeCreateScandalmongerGameOptionsDto(rolesGameOptions.scandalmonger),
    witch: createFakeCreateWitchGameOptionsDto(rolesGameOptions.witch),
    prejudicedManipulator: createFakeCreatePrejudicedManipulatorGameOptionsDto(rolesGameOptions.prejudicedManipulator),
    actor: createFakeActorGameOptionsDto(rolesGameOptions.actor),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createFakeActorGameOptionsDto,
  createFakeCreatePrejudicedManipulatorGameOptionsDto,
  createFakeCreateWitchGameOptionsDto,
  createFakeCreateScandalmongerGameOptionsDto,
  createFakeCreatePiedPiperGameOptionsDto,
  createFakeCreateThiefGameOptionsDto,
  createFakeCreateWolfHoundGameOptionsDto,
  createFakeCreateWildChildGameOptionsDto,
  createFakeCreateStutteringJudgeGameOptionsDto,
  createFakeCreateBearTamerGameOptionsDto,
  createFakeCreateFoxGameOptionsDto,
  createFakeCreateThreeBrothersGameOptionsDto,
  createFakeCreateTwoSistersGameOptionsDto,
  createFakeCreateIdiotGameOptionsDto,
  createFakeCreateElderGameOptionsDto,
  createFakeCreateDefenderGameOptionsDto,
  createFakeCreateLittleGirlGameOptionsDto,
  createFakeCreateSeerGameOptionsDto,
  createFakeCreateCupidLoversGameOptionsDto,
  createFakeCreateCupidGameOptionsDto,
  createFakeCreateWhiteWerewolfGameOptionsDto,
  createFakeCreateBigBadWolfGameOptionsDto,
  createFakeCreateSheriffElectionGameOptionsDto,
  createFakeCreateSheriffGameOptionsDto,
  createFakeRolesGameOptionsDto,
};