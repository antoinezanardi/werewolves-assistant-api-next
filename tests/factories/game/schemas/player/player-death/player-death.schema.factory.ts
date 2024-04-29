import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_SOURCES } from "@/modules/game/constants/game.constants";
import { PLAYER_DEATH_CAUSES } from "@/modules/game/constants/player/player-death/player-death.constants";
import { PlayerDeath } from "@/modules/game/schemas/player/player-death/player-death.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createFakePlayerDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return plainToInstance(PlayerDeath, {
    source: playerDeath.source ?? faker.helpers.arrayElement(GAME_SOURCES),
    cause: playerDeath.cause ?? faker.helpers.arrayElement(PLAYER_DEATH_CAUSES),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakePlayerDiseaseByRustySwordKnightDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: "disease",
    source: "rusty-sword-knight",
    ...playerDeath,
  }, override);
}

function createFakePlayerBrokenHeartByCupidDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: "broken-heart",
    source: "cupid",
    ...playerDeath,
  }, override);
}

function createFakePlayerReconsiderPardonBySurvivorsDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: "reconsider-pardon",
    source: "survivors",
    ...playerDeath,
  }, override);
}

function createFakePlayerVoteScapegoatedBySurvivorsDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: "vote-scapegoated",
    source: "survivors",
    ...playerDeath,
  }, override);
}

function createFakePlayerVoteBySheriffDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: "vote",
    source: "sheriff",
    ...playerDeath,
  }, override);
}

function createFakePlayerVoteBySurvivorsDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: "vote",
    source: "survivors",
    ...playerDeath,
  }, override);
}

function createFakePlayerShotByHunterDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: "shot",
    source: "hunter",
    ...playerDeath,
  }, override);
}

function createFakePlayerEatenByWhiteWerewolfDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: "eaten",
    source: "white-werewolf",
    ...playerDeath,
  }, override);
}

function createFakePlayerEatenByBigBadWolfDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: "eaten",
    source: "big-bad-wolf",
    ...playerDeath,
  }, override);
}

function createFakePlayerEatenByWerewolvesDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: "eaten",
    source: "werewolves",
    ...playerDeath,
  }, override);
}

function createFakePlayerDeathPotionByWitchDeath(playerDeath: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return createFakePlayerDeath({
    cause: "death-potion",
    source: "witch",
    ...playerDeath,
  }, override);
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