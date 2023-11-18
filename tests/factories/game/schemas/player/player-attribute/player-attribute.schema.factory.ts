import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_SOURCES } from "@/modules/game/constants/game.constant";
import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import type { Game } from "@/modules/game/schemas/game.schema";
import { PlayerAttributeActivation } from "@/modules/game/schemas/player/player-attribute/player-attribute-activation/player-attribute-activation.schema";
import { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { bulkCreate } from "@tests/factories/shared/bulk-create.factory";

function createFakeSheriffBySheriffPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.SHERIFF,
    source: PlayerAttributeNames.SHERIFF,
    doesRemainAfterDeath: true,
    ...attribute,
  }, override);
}

function createFakeSheriffBySurvivorsPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.SHERIFF,
    source: PlayerGroups.SURVIVORS,
    doesRemainAfterDeath: true,
    ...attribute,
  }, override);
}

function createFakeSeenBySeerPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.SEEN,
    source: RoleNames.SEER,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeEatenByWerewolvesPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.EATEN,
    source: PlayerGroups.WEREWOLVES,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeEatenByWhiteWerewolfPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.EATEN,
    source: RoleNames.WHITE_WEREWOLF,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeEatenByBigBadWolfPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.EATEN,
    source: RoleNames.BIG_BAD_WOLF,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeDrankLifePotionByWitchPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.DRANK_LIFE_POTION,
    source: RoleNames.WITCH,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeDrankDeathPotionByWitchPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.DRANK_DEATH_POTION,
    source: RoleNames.WITCH,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeProtectedByGuardPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.PROTECTED,
    source: RoleNames.GUARD,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeRavenMarkedByRavenPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.RAVEN_MARKED,
    source: RoleNames.RAVEN,
    remainingPhases: 2,
    ...attribute,
  }, override);
}

function createFakeInLoveByCupidPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.IN_LOVE,
    source: RoleNames.CUPID,
    ...attribute,
  }, override);
}

function createFakeWorshipedByWildChildPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.WORSHIPED,
    source: RoleNames.WILD_CHILD,
    ...attribute,
  }, override);
}

function createFakePowerlessByFoxPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.POWERLESS,
    source: RoleNames.FOX,
    doesRemainAfterDeath: true,
    ...attribute,
  }, override);
}

function createFakePowerlessByAncientPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.POWERLESS,
    source: RoleNames.ANCIENT,
    doesRemainAfterDeath: true,
    ...attribute,
  }, override);
}

function createFakeCantVoteBySurvivorsPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.CANT_VOTE,
    source: PlayerGroups.SURVIVORS,
    ...attribute,
  }, override);
}

function createFakeCantVoteByScapegoatPlayerAttribute(game: Game, attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.CANT_VOTE,
    source: RoleNames.SCAPEGOAT,
    remainingPhases: 1,
    activeAt: {
      turn: game.phase === GamePhases.DAY ? game.turn + 1 : game.turn,
      phase: GamePhases.DAY,
    },
    ...attribute,
  }, override);
}

function createFakeCharmedByPiedPiperPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.CHARMED,
    source: RoleNames.PIED_PIPER,
    ...attribute,
  }, override);
}

function createFakeGrowledByBearTamerPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.GROWLED,
    source: RoleNames.BEAR_TAMER,
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeContaminatedByRustySwordKnightPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PlayerAttributeNames.CONTAMINATED,
    source: RoleNames.RUSTY_SWORD_KNIGHT,
    remainingPhases: 2,
    ...attribute,
  }, override);
}

function createFakePlayerAttributeActivation(attributeActivation: Partial<PlayerAttributeActivation> = {}, override: object = {}): PlayerAttributeActivation {
  return plainToInstance(PlayerAttributeActivation, {
    turn: attributeActivation.turn ?? faker.number.int({ min: 1 }),
    phase: attributeActivation.phase ?? faker.helpers.arrayElement(Object.values(GamePhases)),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakePlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return plainToInstance(PlayerAttribute, {
    name: attribute.name ?? faker.helpers.arrayElement(Object.values(PlayerAttributeNames)),
    source: attribute.source ?? faker.helpers.arrayElement(GAME_SOURCES),
    remainingPhases: attribute.remainingPhases ?? undefined,
    activeAt: attribute.activeAt ?? undefined,
    doesRemainAfterDeath: attribute.doesRemainAfterDeath ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function bulkCreateFakePlayerAttributes(length: number, attributes: Partial<PlayerAttribute>[] = [], overrides: object[] = []): PlayerAttribute[] {
  return bulkCreate(length, createFakePlayerAttribute, attributes, overrides);
}

export {
  createFakeSheriffBySheriffPlayerAttribute,
  createFakeSheriffBySurvivorsPlayerAttribute,
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
  createFakeCantVoteBySurvivorsPlayerAttribute,
  createFakeCantVoteByScapegoatPlayerAttribute,
  createFakeCharmedByPiedPiperPlayerAttribute,
  createFakeGrowledByBearTamerPlayerAttribute,
  createFakeContaminatedByRustySwordKnightPlayerAttribute,
  createFakePlayerAttributeActivation,
  createFakePlayerAttribute,
  bulkCreateFakePlayerAttributes,
};