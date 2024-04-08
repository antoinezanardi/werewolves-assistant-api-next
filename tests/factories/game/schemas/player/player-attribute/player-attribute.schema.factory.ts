import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_PHASES, GAME_SOURCES } from "@/modules/game/constants/game.constants";
import { PLAYER_ATTRIBUTE_NAMES } from "@/modules/game/constants/player/player-attribute/player-attribute.constants";
import type { Game } from "@/modules/game/schemas/game.schema";
import { PlayerAttributeActivation } from "@/modules/game/schemas/player/player-attribute/player-attribute-activation/player-attribute-activation.schema";
import { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createFakeActingByActorPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "acting",
    source: "actor",
    ...attribute,
  }, override);
}

function createFakeStolenRoleByDevotedServantPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "stolen-role",
    source: "devoted-servant",
    doesRemainAfterDeath: true,
    ...attribute,
  }, override);
}

function createFakeSheriffBySheriffPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "sheriff",
    source: "sheriff",
    doesRemainAfterDeath: true,
    ...attribute,
  }, override);
}

function createFakeSheriffBySurvivorsPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "sheriff",
    source: "survivors",
    doesRemainAfterDeath: true,
    ...attribute,
  }, override);
}

function createFakeSeenBySeerPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "seen",
    source: "seer",
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeEatenByWerewolvesPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "eaten",
    source: "werewolves",
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeEatenByWhiteWerewolfPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "eaten",
    source: "white-werewolf",
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeEatenByBigBadWolfPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "eaten",
    source: "big-bad-wolf",
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeDrankLifePotionByWitchPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "drank-life-potion",
    source: "witch",
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeDrankDeathPotionByWitchPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "drank-death-potion",
    source: "witch",
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeProtectedByDefenderPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "protected",
    source: "defender",
    remainingPhases: 1,
    ...attribute,
  }, override);
}

function createFakeScandalmongerMarkedByScandalmongerPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "scandalmonger-marked",
    source: "scandalmonger",
    remainingPhases: 2,
    ...attribute,
  }, override);
}

function createFakeInLoveByCupidPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "in-love",
    source: "cupid",
    ...attribute,
  }, override);
}

function createFakeWorshipedByWildChildPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "worshiped",
    source: "wild-child",
    ...attribute,
  }, override);
}

function createFakePowerlessByActorPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "powerless",
    source: "actor",
    doesRemainAfterDeath: true,
    ...attribute,
  }, override);
}

function createFakePowerlessByWerewolvesPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "powerless",
    source: "werewolves",
    doesRemainAfterDeath: true,
    ...attribute,
  }, override);
}

function createFakePowerlessByAccursedWolfFatherPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "powerless",
    source: "accursed-wolf-father",
    doesRemainAfterDeath: true,
    ...attribute,
  }, override);
}

function createFakePowerlessByFoxPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "powerless",
    source: "fox",
    doesRemainAfterDeath: true,
    ...attribute,
  }, override);
}

function createFakePowerlessByElderPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "powerless",
    source: "elder",
    doesRemainAfterDeath: true,
    ...attribute,
  }, override);
}

function createFakeCantVoteBySurvivorsPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "cant-vote",
    source: "survivors",
    ...attribute,
  }, override);
}

function createFakeCantVoteByScapegoatPlayerAttribute(game: Game, attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "cant-vote",
    source: "scapegoat",
    remainingPhases: 1,
    activeAt: {
      turn: game.phase === "day" ? game.turn + 1 : game.turn,
      phase: "day",
    },
    ...attribute,
  }, override);
}

function createFakeCharmedByPiedPiperPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "charmed",
    source: "pied-piper",
    ...attribute,
  }, override);
}

function createFakeContaminatedByRustySwordKnightPlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: "contaminated",
    source: "rusty-sword-knight",
    remainingPhases: 2,
    ...attribute,
  }, override);
}

function createFakePlayerAttributeActivation(attributeActivation: Partial<PlayerAttributeActivation> = {}, override: object = {}): PlayerAttributeActivation {
  return plainToInstance(PlayerAttributeActivation, {
    turn: attributeActivation.turn ?? faker.number.int({ min: 1 }),
    phase: attributeActivation.phase ?? faker.helpers.arrayElement(GAME_PHASES),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakePlayerAttribute(attribute: Partial<PlayerAttribute> = {}, override: object = {}): PlayerAttribute {
  return plainToInstance(PlayerAttribute, {
    name: attribute.name ?? faker.helpers.arrayElement(PLAYER_ATTRIBUTE_NAMES),
    source: attribute.source ?? faker.helpers.arrayElement(GAME_SOURCES),
    remainingPhases: attribute.remainingPhases ?? undefined,
    activeAt: attribute.activeAt ?? undefined,
    doesRemainAfterDeath: attribute.doesRemainAfterDeath ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createFakeActingByActorPlayerAttribute,
  createFakeStolenRoleByDevotedServantPlayerAttribute,
  createFakeSheriffBySheriffPlayerAttribute,
  createFakeSheriffBySurvivorsPlayerAttribute,
  createFakeSeenBySeerPlayerAttribute,
  createFakeEatenByWerewolvesPlayerAttribute,
  createFakeEatenByWhiteWerewolfPlayerAttribute,
  createFakeEatenByBigBadWolfPlayerAttribute,
  createFakeDrankLifePotionByWitchPlayerAttribute,
  createFakeDrankDeathPotionByWitchPlayerAttribute,
  createFakeProtectedByDefenderPlayerAttribute,
  createFakeScandalmongerMarkedByScandalmongerPlayerAttribute,
  createFakeInLoveByCupidPlayerAttribute,
  createFakeWorshipedByWildChildPlayerAttribute,
  createFakePowerlessByActorPlayerAttribute,
  createFakePowerlessByWerewolvesPlayerAttribute,
  createFakePowerlessByAccursedWolfFatherPlayerAttribute,
  createFakePowerlessByFoxPlayerAttribute,
  createFakePowerlessByElderPlayerAttribute,
  createFakeCantVoteBySurvivorsPlayerAttribute,
  createFakeCantVoteByScapegoatPlayerAttribute,
  createFakeCharmedByPiedPiperPlayerAttribute,
  createFakeContaminatedByRustySwordKnightPlayerAttribute,
  createFakePlayerAttributeActivation,
  createFakePlayerAttribute,
};