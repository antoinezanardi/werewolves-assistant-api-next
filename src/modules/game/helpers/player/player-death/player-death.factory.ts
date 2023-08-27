import { plainToInstance } from "class-transformer";

import { PLAYER_ATTRIBUTE_NAMES, PLAYER_DEATH_CAUSES, PLAYER_GROUPS } from "@/modules/game/enums/player.enum";
import { PlayerDeath } from "@/modules/game/schemas/player/player-death.schema";
import { ROLE_NAMES } from "@/modules/role/enums/role.enum";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

function createPlayerDiseaseByRustySwordKnightDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PLAYER_DEATH_CAUSES.DISEASE,
    source: ROLE_NAMES.RUSTY_SWORD_KNIGHT,
    ...playerDeath,
  });
}

function createPlayerBrokenHeartByCupidDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PLAYER_DEATH_CAUSES.BROKEN_HEART,
    source: ROLE_NAMES.CUPID,
    ...playerDeath,
  });
}

function createPlayerReconsiderPardonByAllDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PLAYER_DEATH_CAUSES.RECONSIDER_PARDON,
    source: PLAYER_GROUPS.ALL,
    ...playerDeath,
  });
}

function createPlayerVoteScapegoatedByAllDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PLAYER_DEATH_CAUSES.VOTE_SCAPEGOATED,
    source: PLAYER_GROUPS.ALL,
    ...playerDeath,
  });
}

function createPlayerVoteBySheriffDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PLAYER_DEATH_CAUSES.VOTE,
    source: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
    ...playerDeath,
  });
}

function createPlayerVoteByAllDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PLAYER_DEATH_CAUSES.VOTE,
    source: PLAYER_GROUPS.ALL,
    ...playerDeath,
  });
}

function createPlayerShotByHunterDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PLAYER_DEATH_CAUSES.SHOT,
    source: ROLE_NAMES.HUNTER,
    ...playerDeath,
  });
}

function createPlayerEatenByWhiteWerewolfDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PLAYER_DEATH_CAUSES.EATEN,
    source: ROLE_NAMES.WHITE_WEREWOLF,
    ...playerDeath,
  });
}

function createPlayerEatenByBigBadWolfDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PLAYER_DEATH_CAUSES.EATEN,
    source: ROLE_NAMES.BIG_BAD_WOLF,
    ...playerDeath,
  });
}

function createPlayerEatenByWerewolvesDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PLAYER_DEATH_CAUSES.EATEN,
    source: PLAYER_GROUPS.WEREWOLVES,
    ...playerDeath,
  });
}

function createPlayerDeathPotionByWitchDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PLAYER_DEATH_CAUSES.DEATH_POTION,
    source: ROLE_NAMES.WITCH,
    ...playerDeath,
  });
}

function createPlayerDeath(playerDeath: PlayerDeath): PlayerDeath {
  return plainToInstance(PlayerDeath, playerDeath, plainToInstanceDefaultOptions);
}

export {
  createPlayerDiseaseByRustySwordKnightDeath,
  createPlayerBrokenHeartByCupidDeath,
  createPlayerReconsiderPardonByAllDeath,
  createPlayerVoteScapegoatedByAllDeath,
  createPlayerVoteBySheriffDeath,
  createPlayerVoteByAllDeath,
  createPlayerShotByHunterDeath,
  createPlayerEatenByWhiteWerewolfDeath,
  createPlayerEatenByBigBadWolfDeath,
  createPlayerEatenByWerewolvesDeath,
  createPlayerDeathPotionByWitchDeath,
  createPlayerDeath,
};