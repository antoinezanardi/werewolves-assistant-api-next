import { plainToInstance } from "class-transformer";
import { toJSON } from "../../../../../../tests/helpers/object/object.helper";
import { plainToInstanceDefaultOptions } from "../../../../../shared/validation/constants/validation.constant";
import { ROLE_NAMES } from "../../../../role/enums/role.enum";
import { GAME_PHASES } from "../../../enums/game.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../enums/player.enum";
import type { Game } from "../../../schemas/game.schema";
import { PlayerAttribute } from "../../../schemas/player/player-attribute/player-attribute.schema";

function createContaminatedByRustySwordKnightPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.CONTAMINATED,
    source: ROLE_NAMES.RUSTY_SWORD_KNIGHT,
    remainingPhases: 2,
    ...playerAttribute,
  });
}

function createGrowledByBearTamerPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.GROWLED,
    source: ROLE_NAMES.BEAR_TAMER,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createCharmedByPiedPiperPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.CHARMED,
    source: ROLE_NAMES.PIED_PIPER,
    ...playerAttribute,
  });
}

function createCantVoteByAllPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.CANT_VOTE,
    source: PLAYER_GROUPS.ALL,
    ...playerAttribute,
  });
}

function createCantVoteByScapegoatPlayerAttribute(game: Game, playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.CANT_VOTE,
    source: ROLE_NAMES.SCAPEGOAT,
    remainingPhases: 1,
    activeAt: {
      turn: game.phase === GAME_PHASES.DAY ? game.turn + 1 : game.turn,
      phase: GAME_PHASES.DAY,
    },
    ...playerAttribute,
  });
}

function createPowerlessByFoxPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.POWERLESS,
    source: ROLE_NAMES.FOX,
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createPowerlessByAncientPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.POWERLESS,
    source: ROLE_NAMES.ANCIENT,
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createWorshipedByWildChildPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.WORSHIPED,
    source: ROLE_NAMES.WILD_CHILD,
    ...playerAttribute,
  });
}

function createInLoveByCupidPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.IN_LOVE,
    source: ROLE_NAMES.CUPID,
    ...playerAttribute,
  });
}

function createRavenMarkByRavenPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.RAVEN_MARKED,
    source: ROLE_NAMES.RAVEN,
    remainingPhases: 2,
    ...playerAttribute,
  });
}

function createProtectedByGuardPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.PROTECTED,
    source: ROLE_NAMES.GUARD,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createDrankDeathPotionByWitchPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.DRANK_DEATH_POTION,
    source: ROLE_NAMES.WITCH,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createDrankLifePotionByWitchPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.DRANK_LIFE_POTION,
    source: ROLE_NAMES.WITCH,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createEatenByBigBadWolfPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.EATEN,
    source: ROLE_NAMES.BIG_BAD_WOLF,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createEatenByWhiteWerewolfPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.EATEN,
    source: ROLE_NAMES.WHITE_WEREWOLF,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createEatenByWerewolvesPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.EATEN,
    source: PLAYER_GROUPS.WEREWOLVES,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createSeenBySeerPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.SEEN,
    source: ROLE_NAMES.SEER,
    remainingPhases: 1,
    ...playerAttribute,
  });
}

function createSheriffBySheriffPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
    source: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createSheriffByAllPlayerAttribute(playerAttribute: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createPlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
    source: PLAYER_GROUPS.ALL,
    doesRemainAfterDeath: true,
    ...playerAttribute,
  });
}

function createPlayerAttribute(playerAttribute: PlayerAttribute): PlayerAttribute {
  return plainToInstance(PlayerAttribute, toJSON(playerAttribute), plainToInstanceDefaultOptions);
}

export {
  createContaminatedByRustySwordKnightPlayerAttribute,
  createGrowledByBearTamerPlayerAttribute,
  createCharmedByPiedPiperPlayerAttribute,
  createCantVoteByAllPlayerAttribute,
  createCantVoteByScapegoatPlayerAttribute,
  createPowerlessByFoxPlayerAttribute,
  createPowerlessByAncientPlayerAttribute,
  createWorshipedByWildChildPlayerAttribute,
  createInLoveByCupidPlayerAttribute,
  createRavenMarkByRavenPlayerAttribute,
  createProtectedByGuardPlayerAttribute,
  createDrankDeathPotionByWitchPlayerAttribute,
  createDrankLifePotionByWitchPlayerAttribute,
  createEatenByBigBadWolfPlayerAttribute,
  createEatenByWhiteWerewolfPlayerAttribute,
  createEatenByWerewolvesPlayerAttribute,
  createSeenBySeerPlayerAttribute,
  createSheriffBySheriffPlayerAttribute,
  createSheriffByAllPlayerAttribute,
  createPlayerAttribute,
};