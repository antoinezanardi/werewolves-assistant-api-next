import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { gameSourceValues } from "../../../../../../src/modules/game/constants/game.constant";
import { GAME_PHASES } from "../../../../../../src/modules/game/enums/game.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../../../../src/modules/game/enums/player.enum";
import { PlayerAttributeActivation } from "../../../../../../src/modules/game/schemas/player/player-attribute/player-attribute-activation.schema";
import { PlayerAttribute } from "../../../../../../src/modules/game/schemas/player/player-attribute/player-attribute.schema";
import { ROLE_NAMES } from "../../../../../../src/modules/role/enums/role.enum";
import { plainToInstanceDefaultOptions } from "../../../../../../src/shared/validation/constants/validation.constant";
import { bulkCreate } from "../../../../shared/bulk-create.factory";

function createFakePlayerSheriffByAllAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
    source: PLAYER_GROUPS.ALL,
    ...attribute,
  }, override);
}

function createFakePlayerSeenBySeerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.SEEN,
    source: ROLE_NAMES.SEER,
    ...attribute,
  }, override);
}

function createFakePlayerEatenByWerewolvesAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.EATEN,
    source: PLAYER_GROUPS.WEREWOLVES,
    ...attribute,
  }, override);
}

function createFakePlayerEatenByBigBadWolfAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.EATEN,
    source: ROLE_NAMES.BIG_BAD_WOLF,
    ...attribute,
  }, override);
}

function createFakePlayerDrankLifePotionByWitchAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.DRANK_LIFE_POTION,
    source: ROLE_NAMES.WITCH,
    ...attribute,
  }, override);
}

function createFakePlayerDrankDeathPotionByWitchAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.DRANK_DEATH_POTION,
    source: ROLE_NAMES.WITCH,
    ...attribute,
  }, override);
}

function createFakePlayerProtectedByGuardAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.PROTECTED,
    source: ROLE_NAMES.GUARD,
    ...attribute,
  }, override);
}

function createFakePlayerRavenMarkedByRavenAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.RAVEN_MARKED,
    source: ROLE_NAMES.RAVEN,
    ...attribute,
  }, override);
}

function createFakePlayerInLoveByCupidAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.IN_LOVE,
    source: ROLE_NAMES.CUPID,
    ...attribute,
  }, override);
}

function createFakePlayerWorshipedByWildChildAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.WORSHIPED,
    source: ROLE_NAMES.WILD_CHILD,
    ...attribute,
  }, override);
}

function createFakePlayerPowerlessByAncientAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.POWERLESS,
    source: ROLE_NAMES.ANCIENT,
    ...attribute,
  }, override);
}

function createFakePlayerCantVoteByScapegoatAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.CANT_VOTE,
    source: ROLE_NAMES.SCAPEGOAT,
    ...attribute,
  }, override);
}

function createFakePlayerCharmedByPiedPiperAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.CHARMED,
    source: ROLE_NAMES.PIED_PIPER,
    ...attribute,
  }, override);
}

function createFakePlayerGrowledByBearTamerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.GROWLED,
    source: ROLE_NAMES.BEAR_TAMER,
    ...attribute,
  }, override);
}

function createFakePlayerContaminatedByRustySwordKnightAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.CONTAMINATED,
    source: ROLE_NAMES.RUSTY_SWORD_KNIGHT,
    ...attribute,
  }, override);
}

function createFakePlayerAttributeActivation(attributeActivation: Partial<PlayerAttributeActivation> = {}, override: object = {}): PlayerAttributeActivation {
  return plainToInstance(PlayerAttributeActivation, {
    turn: attributeActivation.turn ?? faker.datatype.number({ min: 1 }),
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
  createFakePlayerSheriffByAllAttribute,
  createFakePlayerSeenBySeerAttribute,
  createFakePlayerEatenByWerewolvesAttribute,
  createFakePlayerEatenByBigBadWolfAttribute,
  createFakePlayerDrankLifePotionByWitchAttribute,
  createFakePlayerDrankDeathPotionByWitchAttribute,
  createFakePlayerProtectedByGuardAttribute,
  createFakePlayerRavenMarkedByRavenAttribute,
  createFakePlayerInLoveByCupidAttribute,
  createFakePlayerWorshipedByWildChildAttribute,
  createFakePlayerPowerlessByAncientAttribute,
  createFakePlayerCantVoteByScapegoatAttribute,
  createFakePlayerCharmedByPiedPiperAttribute,
  createFakePlayerGrowledByBearTamerAttribute,
  createFakePlayerContaminatedByRustySwordKnightAttribute,
  createFakePlayerAttributeActivation,
  createFakePlayerAttribute,
  bulkCreateFakePlayerAttributes,
};