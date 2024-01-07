import { plainToInstance } from "class-transformer";

import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import type { Game } from "@/modules/game/schemas/game.schema";
import { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createActingByActorPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.ACTING,
    source: RoleNames.ACTOR,
    ...playerAttribute,
  });
}

function createStolenRoleByDevotedServantPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.STOLEN_ROLE,
    source: RoleNames.DEVOTED_SERVANT,
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createContaminatedByRustySwordKnightPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.CONTAMINATED,
    source: RoleNames.RUSTY_SWORD_KNIGHT,
    remainingPhases: 2,
    ...playerAttribute,
  });
}

function createCharmedByPiedPiperPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.CHARMED,
    source: RoleNames.PIED_PIPER,
    ...playerAttribute,
  });
}

function createCantVoteBySurvivorsPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.CANT_VOTE,
    source: PlayerGroups.SURVIVORS,
    ...playerAttribute,
  });
}

function createCantVoteByScapegoatPlayerAttribute(game: Game, playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.CANT_VOTE,
    source: RoleNames.SCAPEGOAT,
    remainingPhases: 1,
    activeAt: {
      turn: game.phase === GamePhases.DAY ? game.turn + 1 : game.turn,
      phase: GamePhases.DAY,
    },
    ...playerAttribute,
  });
}

function createPowerlessByActorPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.POWERLESS,
    source: RoleNames.ACTOR,
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createPowerlessByWerewolvesPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.POWERLESS,
    source: PlayerGroups.WEREWOLVES,
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createPowerlessByAccursedWolfFatherPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.POWERLESS,
    source: RoleNames.ACCURSED_WOLF_FATHER,
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createPowerlessByFoxPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.POWERLESS,
    source: RoleNames.FOX,
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createPowerlessByElderPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.POWERLESS,
    source: RoleNames.ELDER,
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createWorshipedByWildChildPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.WORSHIPED,
    source: RoleNames.WILD_CHILD,
    ...playerAttribute,
  });
}

function createInLoveByCupidPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.IN_LOVE,
    source: RoleNames.CUPID,
    ...playerAttribute,
  });
}

function createScandalmongerMarkByScandalmongerPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.SCANDALMONGER_MARKED,
    source: RoleNames.SCANDALMONGER,
    remainingPhases: 2,
    ...playerAttribute,
  });
}

function createProtectedByDefenderPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.PROTECTED,
    source: RoleNames.DEFENDER,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createDrankDeathPotionByWitchPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.DRANK_DEATH_POTION,
    source: RoleNames.WITCH,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createDrankLifePotionByWitchPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.DRANK_LIFE_POTION,
    source: RoleNames.WITCH,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createEatenByBigBadWolfPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.EATEN,
    source: RoleNames.BIG_BAD_WOLF,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createEatenByWhiteWerewolfPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.EATEN,
    source: RoleNames.WHITE_WEREWOLF,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createEatenByWerewolvesPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.EATEN,
    source: PlayerGroups.WEREWOLVES,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createSeenBySeerPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.SEEN,
    source: RoleNames.SEER,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createSheriffBySheriffPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.SHERIFF,
    source: PlayerAttributeNames.SHERIFF,
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createSheriffBySurvivorsPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PlayerAttributeNames.SHERIFF,
    source: PlayerGroups.SURVIVORS,
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createPlayerAttribute(playerAttribute: PlayerAttribute): PlayerAttribute {
  return plainToInstance(PlayerAttribute, toJSON(playerAttribute), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
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