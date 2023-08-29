import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_SOURCE_VALUES } from "@/modules/game/constants/game.constant";
import { PlayerAttributeNames, PlayerDeathCauses, PlayerGroups } from "@/modules/game/enums/player.enum";
import { PlayerDeath } from "@/modules/game/schemas/player/player-death.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createFakePlayerDiseaseByRustySwordKnightDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PlayerDeathCauses.DISEASE,
    source: RoleNames.RUSTY_SWORD_KNIGHT,
    ...playerDeath,
  }, override);
}

function createFakePlayerBrokenHeartByCupidDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PlayerDeathCauses.BROKEN_HEART,
    source: RoleNames.CUPID,
    ...playerDeath,
  }, override);
}

function createFakePlayerReconsiderPardonByAllDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PlayerDeathCauses.RECONSIDER_PARDON,
    source: PlayerGroups.ALL,
    ...playerDeath,
  }, override);
}

function createFakePlayerVoteScapegoatedByAllDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PlayerDeathCauses.VOTE_SCAPEGOATED,
    source: PlayerGroups.ALL,
    ...playerDeath,
  }, override);
}

function createFakePlayerVoteBySheriffDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PlayerDeathCauses.VOTE,
    source: PlayerAttributeNames.SHERIFF,
    ...playerDeath,
  }, override);
}

function createFakePlayerVoteByAllDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PlayerDeathCauses.VOTE,
    source: PlayerGroups.ALL,
    ...playerDeath,
  }, override);
}

function createFakePlayerShotByHunterDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PlayerDeathCauses.SHOT,
    source: RoleNames.HUNTER,
    ...playerDeath,
  }, override);
}

function createFakePlayerEatenByWhiteWerewolfDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PlayerDeathCauses.EATEN,
    source: RoleNames.WHITE_WEREWOLF,
    ...playerDeath,
  }, override);
}

function createFakePlayerEatenByBigBadWolfDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PlayerDeathCauses.EATEN,
    source: RoleNames.BIG_BAD_WOLF,
    ...playerDeath,
  }, override);
}

function createFakePlayerEatenByWerewolvesDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PlayerDeathCauses.EATEN,
    source: PlayerGroups.WEREWOLVES,
    ...playerDeath,
  }, override);
}

function createFakePlayerDeathPotionByWitchDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PlayerDeathCauses.DEATH_POTION,
    source: RoleNames.WITCH,
    ...playerDeath,
  }, override);
}

function createFakePlayerDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return plainToInstance(PlayerDeath, {
    source: playerDeath.source ?? faker.helpers.arrayElement(Object.values(GAME_SOURCE_VALUES)),
    cause: playerDeath.cause ?? faker.helpers.arrayElement(Object.values(PlayerDeathCauses)),
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export {
  createFakePlayerDiseaseByRustySwordKnightDeath,
  createFakePlayerBrokenHeartByCupidDeath,
  createFakePlayerReconsiderPardonByAllDeath,
  createFakePlayerVoteScapegoatedByAllDeath,
  createFakePlayerVoteBySheriffDeath,
  createFakePlayerVoteByAllDeath,
  createFakePlayerShotByHunterDeath,
  createFakePlayerEatenByWhiteWerewolfDeath,
  createFakePlayerEatenByBigBadWolfDeath,
  createFakePlayerEatenByWerewolvesDeath,
  createFakePlayerDeathPotionByWitchDeath,
  createFakePlayerDeath,
};