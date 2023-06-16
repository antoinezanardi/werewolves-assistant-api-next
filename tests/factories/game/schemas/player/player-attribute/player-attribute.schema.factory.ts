import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { gameSourceValues } from "../../../../../../src/modules/game/constants/game.constant";
import { GAME_PHASES } from "../../../../../../src/modules/game/enums/game.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../../../../src/modules/game/enums/player.enum";
import type { Game } from "../../../../../../src/modules/game/schemas/game.schema";
import { PlayerAttributeActivation } from "../../../../../../src/modules/game/schemas/player/player-attribute/player-attribute-activation.schema";
import { PlayerAttribute } from "../../../../../../src/modules/game/schemas/player/player-attribute/player-attribute.schema";
import { ROLE_NAMES } from "../../../../../../src/modules/role/enums/role.enum";
import { plainToInstanceDefaultOptions } from "../../../../../../src/shared/validation/constants/validation.constant";
import { bulkCreate } from "../../../../shared/bulk-create.factory";

function createFakeSheriffBySheriffPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
    source: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
    ...attribute,
  }, override);
}

function createFakeSheriffByAllPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
    source: PLAYER_GROUPS.ALL,
    ...attribute,
  }, override);
}

function createFakeSeenBySeerPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.SEEN,
    source: ROLE_NAMES.SEER,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeEatenByWerewolvesPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.EATEN,
    source: PLAYER_GROUPS.WEREWOLVES,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeEatenByWhiteWerewolfPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.EATEN,
    source: ROLE_NAMES.WHITE_WEREWOLF,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeEatenByBigBadWolfPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.EATEN,
    source: ROLE_NAMES.BIG_BAD_WOLF,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeDrankLifePotionByWitchPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.DRANK_LIFE_POTION,
    source: ROLE_NAMES.WITCH,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeDrankDeathPotionByWitchPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.DRANK_DEATH_POTION,
    source: ROLE_NAMES.WITCH,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeProtectedByGuardPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.PROTECTED,
    source: ROLE_NAMES.GUARD,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeRavenMarkedByRavenPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.RAVEN_MARKED,
    source: ROLE_NAMES.RAVEN,
    remainingPhases: 2,
    ...attribute,
  }, override);
}

function createFakeInLoveByCupidPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.IN_LOVE,
    source: ROLE_NAMES.CUPID,
    ...attribute,
  }, override);
}

function createFakeWorshipedByWildChildPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.WORSHIPED,
    source: ROLE_NAMES.WILD_CHILD,
    ...attribute,
  }, override);
}

function createFakePowerlessByFoxPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.POWERLESS,
    source: ROLE_NAMES.FOX,
    ...attribute,
  }, override);
}

function createFakePowerlessByAncientPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.POWERLESS,
    source: ROLE_NAMES.ANCIENT,
    ...attribute,
  }, override);
}

function createFakeCantVoteByAllPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.CANT_VOTE,
    source: PLAYER_GROUPS.ALL,
    ...attribute,
  }, override);
}

function createFakeCantVoteByScapegoatPlayerAttribute(game: Game, attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.CANT_VOTE,
    source: ROLE_NAMES.SCAPEGOAT,
    remainingPhases: 2,
    activeAt: {
      turn: game.turn + 1,
      phase: GAME_PHASES.DAY,
    },
    ...attribute,
  }, override);
}

function createFakeCharmedByPiedPiperPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.CHARMED,
    source: ROLE_NAMES.PIED_PIPER,
    ...attribute,
  }, override);
}

function createFakeGrowledByBearTamerPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.GROWLED,
    source: ROLE_NAMES.BEAR_TAMER,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeContaminatedByRustySwordKnightPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.CONTAMINATED,
    source: ROLE_NAMES.RUSTY_SWORD_KNIGHT,
    remainingPhases: 2,
    ...attribute,
  }, override);
}

function createFakePlayerAttributeActivation(attributeActivation: Partial<PlayerAttributeActivation> = {}, override: object = {}): PlayerAttributeActivation {
  return plainToInstance(PlayerAttributeActivation, {
    turn: attributeActivation.turn ?? faker.number.int({ min: 1 }),
    phase: attributeActivation.phase ?? faker.helpers.arrayElement(Object.values(GAME_PHASES)),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakePlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return plainToInstance(PlayerAttribute, {
    name: attribute.name ?? faker.helpers.arrayElement(Object.values(PLAYER_ATTRIBUTE_NAMES)),
    source: attribute.source ?? faker.helpers.arrayElement(gameSourceValues),
    remainingPhases: attribute.remainingPhases ?? undefined,
    activeAt: attribute.activeAt ?? undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

function bulkCreateFakePlayerAttributes(length: number, attributes: Partial<PlayerAttribute>[] = [], overrides: object[] = []): PlayerAttribute[] {
  return bulkCreate(length, createFakePlayerAttribute, attributes, overrides);
}

export {
  createFakeSheriffBySheriffPlayerAttribute,
  createFakeSheriffByAllPlayerAttribute,
  createFakeSeenBySeerPlayerAttribute,
  createFakeEatenByWerewolvesPlayerAttribute,
  createFakeEatenByWhiteWerewolfPlayerAttribute,
  createFakeEatenByBigBadWolfPlayerAttribute,
  createFakeDrankLifePotionByWitchPlayerAttribute,
  createFakeDrankDeathPotionByWitchPlayerAttribute,
  createFakeProtectedByGuardPlayerAttribute,
  createFakeRavenMarkedByRavenPlayerAttribute,
  createFakeInLoveByCupidPlayerAttribute,
  createFakeWorshipedByWildChildPlayerAttribute,
  createFakePowerlessByFoxPlayerAttribute,
  createFakePowerlessByAncientPlayerAttribute,
  createFakeCantVoteByAllPlayerAttribute,
  createFakeCantVoteByScapegoatPlayerAttribute,
  createFakeCharmedByPiedPiperPlayerAttribute,
  createFakeGrowledByBearTamerPlayerAttribute,
  createFakeContaminatedByRustySwordKnightPlayerAttribute,
  createFakePlayerAttributeActivation,
  createFakePlayerAttribute,
  bulkCreateFakePlayerAttributes,
};