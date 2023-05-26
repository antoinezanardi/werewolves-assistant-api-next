import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { gameSourceValues } from "../../../../../../src/modules/game/constants/game.constant";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_DEATH_CAUSES, PLAYER_GROUPS } from "../../../../../../src/modules/game/enums/player.enum";
import { PlayerDeath } from "../../../../../../src/modules/game/schemas/player/player-death.schema";
import { ROLE_NAMES } from "../../../../../../src/modules/role/enums/role.enum";
import { plainToInstanceDefaultOptions } from "../../../../../../src/shared/validation/constants/validation.constant";

function createFakePlayerDiseaseByRustySwordKnightDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PLAYER_DEATH_CAUSES.DISEASE,
    source: ROLE_NAMES.RUSTY_SWORD_KNIGHT,
    ...playerDeath,
  }, override);
}

function createFakePlayerBrokenHeartByCupidDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PLAYER_DEATH_CAUSES.BROKEN_HEART,
    source: ROLE_NAMES.CUPID,
    ...playerDeath,
  }, override);
}

function createFakePlayerReconsiderPardonByAllDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PLAYER_DEATH_CAUSES.RECONSIDER_PARDON,
    source: PLAYER_GROUPS.ALL,
    ...playerDeath,
  }, override);
}

function createFakePlayerVoteScapegoatedByAllDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PLAYER_DEATH_CAUSES.VOTE_SCAPEGOATED,
    source: PLAYER_GROUPS.ALL,
    ...playerDeath,
  }, override);
}

function createFakePlayerVoteBySheriffDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PLAYER_DEATH_CAUSES.VOTE,
    source: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
    ...playerDeath,
  }, override);
}

function createFakePlayerVoteByAllDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PLAYER_DEATH_CAUSES.VOTE,
    source: PLAYER_GROUPS.ALL,
    ...playerDeath,
  }, override);
}

function createFakePlayerShotByHunterDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PLAYER_DEATH_CAUSES.SHOT,
    source: ROLE_NAMES.HUNTER,
    ...playerDeath,
  }, override);
}

function createFakePlayerEatenByWhiteWerewolfDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PLAYER_DEATH_CAUSES.EATEN,
    source: ROLE_NAMES.WHITE_WEREWOLF,
    ...playerDeath,
  }, override);
}

function createFakePlayerEatenByBigBadWolfDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PLAYER_DEATH_CAUSES.EATEN,
    source: ROLE_NAMES.BIG_BAD_WOLF,
    ...playerDeath,
  }, override);
}

function createFakePlayerEatenByWerewolvesDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PLAYER_DEATH_CAUSES.EATEN,
    source: PLAYER_GROUPS.WEREWOLVES,
    ...playerDeath,
  }, override);
}

function createFakePlayerDeathPotionByWitchDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: PLAYER_DEATH_CAUSES.DEATH_POTION,
    source: ROLE_NAMES.WITCH,
    ...playerDeath,
  }, override);
}

function createFakePlayerDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return plainToInstance(PlayerDeath, {
    source: playerDeath.source ?? faker.helpers.arrayElement(Object.values(gameSourceValues)),
    cause: playerDeath.cause ?? faker.helpers.arrayElement(Object.values(PLAYER_DEATH_CAUSES)),
    ...override,
  }, plainToInstanceDefaultOptions);
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