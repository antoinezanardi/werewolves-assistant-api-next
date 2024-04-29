import { plainToInstance } from "class-transformer";

import type { Game } from "@/modules/game/schemas/game.schema";
import { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";

import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createPlayerAttribute(playerAttribute: PlayerAttribute): PlayerAttribute {
  return plainToInstance(PlayerAttribute, toJSON(playerAttribute), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createActingByActorPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "acting",
    source: "actor",
    ...playerAttribute,
  });
}

function createStolenRoleByDevotedServantPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "stolen-role",
    source: "devoted-servant",
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createContaminatedByRustySwordKnightPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "contaminated",
    source: "rusty-sword-knight",
    remainingPhases: 2,
    ...playerAttribute,
  });
}

function createCharmedByPiedPiperPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "charmed",
    source: "pied-piper",
    ...playerAttribute,
  });
}

function createCantVoteBySurvivorsPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "cant-vote",
    source: "survivors",
    ...playerAttribute,
  });
}

function createCantVoteByScapegoatPlayerAttribute(game: Game, playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "cant-vote",
    source: "scapegoat",
    remainingPhases: 1,
    activeAt: {
      turn: game.phase.name === "day" ? game.turn + 1 : game.turn,
      phaseName: "day",
    },
    ...playerAttribute,
  });
}

function createPowerlessByActorPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "powerless",
    source: "actor",
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createPowerlessByWerewolvesPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "powerless",
    source: "werewolves",
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createPowerlessByAccursedWolfFatherPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "powerless",
    source: "accursed-wolf-father",
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createPowerlessByFoxPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "powerless",
    source: "fox",
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createPowerlessByElderPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "powerless",
    source: "elder",
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createWorshipedByWildChildPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "worshiped",
    source: "wild-child",
    ...playerAttribute,
  });
}

function createInLoveByCupidPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "in-love",
    source: "cupid",
    ...playerAttribute,
  });
}

function createScandalmongerMarkByScandalmongerPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "scandalmonger-marked",
    source: "scandalmonger",
    remainingPhases: 2,
    ...playerAttribute,
  });
}

function createProtectedByDefenderPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "protected",
    source: "defender",
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createDrankDeathPotionByWitchPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "drank-death-potion",
    source: "witch",
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createDrankLifePotionByWitchPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "drank-life-potion",
    source: "witch",
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createEatenByBigBadWolfPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "eaten",
    source: "big-bad-wolf",
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createEatenByWhiteWerewolfPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "eaten",
    source: "white-werewolf",
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createEatenByWerewolvesPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "eaten",
    source: "werewolves",
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createSeenBySeerPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "seen",
    source: "seer",
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createSheriffBySheriffPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "sheriff",
    source: "sheriff",
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createSheriffBySurvivorsPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: "sheriff",
    source: "survivors",
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

export {
  createActingByActorPlayerAttribute,
  createStolenRoleByDevotedServantPlayerAttribute,
  createContaminatedByRustySwordKnightPlayerAttribute,
  createCharmedByPiedPiperPlayerAttribute,
  createCantVoteBySurvivorsPlayerAttribute,
  createCantVoteByScapegoatPlayerAttribute,
  createPowerlessByActorPlayerAttribute,
  createPowerlessByWerewolvesPlayerAttribute,
  createPowerlessByAccursedWolfFatherPlayerAttribute,
  createPowerlessByFoxPlayerAttribute,
  createPowerlessByElderPlayerAttribute,
  createWorshipedByWildChildPlayerAttribute,
  createInLoveByCupidPlayerAttribute,
  createScandalmongerMarkByScandalmongerPlayerAttribute,
  createProtectedByDefenderPlayerAttribute,
  createDrankDeathPotionByWitchPlayerAttribute,
  createDrankLifePotionByWitchPlayerAttribute,
  createEatenByBigBadWolfPlayerAttribute,
  createEatenByWhiteWerewolfPlayerAttribute,
  createEatenByWerewolvesPlayerAttribute,
  createSeenBySeerPlayerAttribute,
  createSheriffBySheriffPlayerAttribute,
  createSheriffBySurvivorsPlayerAttribute,
  createPlayerAttribute,
};