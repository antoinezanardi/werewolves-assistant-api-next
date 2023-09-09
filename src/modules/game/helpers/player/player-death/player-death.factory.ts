import { plainToInstance } from "class-transformer";

import { PlayerAttributeNames, PlayerDeathCauses, PlayerGroups } from "@/modules/game/enums/player.enum";
import { PlayerDeath } from "@/modules/game/schemas/player/player-death/player-death.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createPlayerDiseaseByRustySwordKnightDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PlayerDeathCauses.DISEASE,
    source: RoleNames.RUSTY_SWORD_KNIGHT,
    ...playerDeath,
  });
}

function createPlayerBrokenHeartByCupidDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PlayerDeathCauses.BROKEN_HEART,
    source: RoleNames.CUPID,
    ...playerDeath,
  });
}

function createPlayerReconsiderPardonByAllDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PlayerDeathCauses.RECONSIDER_PARDON,
    source: PlayerGroups.ALL,
    ...playerDeath,
  });
}

function createPlayerVoteScapegoatedByAllDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PlayerDeathCauses.VOTE_SCAPEGOATED,
    source: PlayerGroups.ALL,
    ...playerDeath,
  });
}

function createPlayerVoteBySheriffDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PlayerDeathCauses.VOTE,
    source: PlayerAttributeNames.SHERIFF,
    ...playerDeath,
  });
}

function createPlayerVoteByAllDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PlayerDeathCauses.VOTE,
    source: PlayerGroups.ALL,
    ...playerDeath,
  });
}

function createPlayerShotByHunterDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PlayerDeathCauses.SHOT,
    source: RoleNames.HUNTER,
    ...playerDeath,
  });
}

function createPlayerEatenByWhiteWerewolfDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PlayerDeathCauses.EATEN,
    source: RoleNames.WHITE_WEREWOLF,
    ...playerDeath,
  });
}

function createPlayerEatenByBigBadWolfDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PlayerDeathCauses.EATEN,
    source: RoleNames.BIG_BAD_WOLF,
    ...playerDeath,
  });
}

function createPlayerEatenByWerewolvesDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PlayerDeathCauses.EATEN,
    source: PlayerGroups.WEREWOLVES,
    ...playerDeath,
  });
}

function createPlayerDeathPotionByWitchDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PlayerDeathCauses.DEATH_POTION,
    source: RoleNames.WITCH,
    ...playerDeath,
  });
}

function createPlayerDeath(playerDeath: PlayerDeath): PlayerDeath {
  return plainToInstance(PlayerDeath, playerDeath, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
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