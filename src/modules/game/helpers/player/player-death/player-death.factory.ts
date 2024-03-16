import { plainToInstance } from "class-transformer";

import { PlayerAttributeNames, PlayerDeathCauses, PlayerGroups } from "@/modules/game/enums/player.enum";
import { PlayerDeath } from "@/modules/game/schemas/player/player-death/player-death.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

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

function createPlayerReconsiderPardonBySurvivorsDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PlayerDeathCauses.RECONSIDER_PARDON,
    source: PlayerGroups.SURVIVORS,
    ...playerDeath,
  });
}

function createPlayerVoteScapegoatedBySurvivorsDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PlayerDeathCauses.VOTE_SCAPEGOATED,
    source: PlayerGroups.SURVIVORS,
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

function createPlayerVoteBySurvivorsDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: PlayerDeathCauses.VOTE,
    source: PlayerGroups.SURVIVORS,
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
  return plainToInstance(PlayerDeath, playerDeath, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createPlayerDiseaseByRustySwordKnightDeath,
  createPlayerBrokenHeartByCupidDeath,
  createPlayerReconsiderPardonBySurvivorsDeath,
  createPlayerVoteScapegoatedBySurvivorsDeath,
  createPlayerVoteBySheriffDeath,
  createPlayerVoteBySurvivorsDeath,
  createPlayerShotByHunterDeath,
  createPlayerEatenByWhiteWerewolfDeath,
  createPlayerEatenByBigBadWolfDeath,
  createPlayerEatenByWerewolvesDeath,
  createPlayerDeathPotionByWitchDeath,
  createPlayerDeath,
};