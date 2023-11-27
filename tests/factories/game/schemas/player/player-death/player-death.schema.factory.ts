import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_SOURCES } from "@/modules/game/constants/game.constant";
import { PlayerAttributeNames, PlayerDeathCauses, PlayerGroups } from "@/modules/game/enums/player.enum";
import { PlayerDeath } from "@/modules/game/schemas/player/player-death/player-death.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

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

function createFakePlayerReconsiderPardonBySurvivorsDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PlayerDeathCauses.RECONSIDER_PARDON,
    source: PlayerGroups.SURVIVORS,
    ...playerDeath,
  }, override);
}

function createFakePlayerVoteScapegoatedBySurvivorsDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PlayerDeathCauses.VOTE_SCAPEGOATED,
    source: PlayerGroups.SURVIVORS,
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

function createFakePlayerVoteBySurvivorsDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PlayerDeathCauses.VOTE,
    source: PlayerGroups.SURVIVORS,
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
    source: playerDeath.source ?? faker.helpers.arrayElement(Object.values(GAME_SOURCES)),
    cause: playerDeath.cause ?? faker.helpers.arrayElement(Object.values(PlayerDeathCauses)),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createFakePlayerDiseaseByRustySwordKnightDeath,
  createFakePlayerBrokenHeartByCupidDeath,
  createFakePlayerReconsiderPardonBySurvivorsDeath,
  createFakePlayerVoteScapegoatedBySurvivorsDeath,
  createFakePlayerVoteBySheriffDeath,
  createFakePlayerVoteBySurvivorsDeath,
  createFakePlayerShotByHunterDeath,
  createFakePlayerEatenByWhiteWerewolfDeath,
  createFakePlayerEatenByBigBadWolfDeath,
  createFakePlayerEatenByWerewolvesDeath,
  createFakePlayerDeathPotionByWitchDeath,
  createFakePlayerDeath,
};