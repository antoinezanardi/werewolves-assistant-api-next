import { plainToInstance } from "class-transformer";

import { PlayerDeath } from "@/modules/game/schemas/player/player-death/player-death.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createPlayerDeath(playerDeath: PlayerDeath): PlayerDeath {
  return plainToInstance(PlayerDeath, playerDeath, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createPlayerDiseaseByRustySwordKnightDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: "disease",
    source: "rusty-sword-knight",
    ...playerDeath,
  });
}

function createPlayerBrokenHeartByCupidDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: "broken-heart",
    source: "cupid",
    ...playerDeath,
  });
}

function createPlayerReconsiderPardonBySurvivorsDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: "reconsider-pardon",
    source: "survivors",
    ...playerDeath,
  });
}

function createPlayerVoteScapegoatedBySurvivorsDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: "vote-scapegoated",
    source: "survivors",
    ...playerDeath,
  });
}

function createPlayerVoteBySheriffDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: "vote",
    source: "sheriff",
    ...playerDeath,
  });
}

function createPlayerVoteBySurvivorsDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: "vote",
    source: "survivors",
    ...playerDeath,
  });
}

function createPlayerShotByHunterDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: "shot",
    source: "hunter",
    ...playerDeath,
  });
}

function createPlayerEatenByWhiteWerewolfDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: "eaten",
    source: "white-werewolf",
    ...playerDeath,
  });
}

function createPlayerEatenByBigBadWolfDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: "eaten",
    source: "big-bad-wolf",
    ...playerDeath,
  });
}

function createPlayerEatenByWerewolvesDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: "eaten",
    source: "werewolves",
    ...playerDeath,
  });
}

function createPlayerDeathPotionByWitchDeath(playerDeath: Partial<PlayerDeath> = {}): PlayerDeath {
  return createPlayerDeath({
    cause: "death-potion",
    source: "witch",
    ...playerDeath,
  });
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