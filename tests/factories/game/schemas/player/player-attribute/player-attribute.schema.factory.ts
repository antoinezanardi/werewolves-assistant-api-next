import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { gameSourceValues } from "../../../../../../src/modules/game/constants/game.constant";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../../../../src/modules/game/enums/player.enum";
import { PlayerAttribute } from "../../../../../../src/modules/game/schemas/player/player-attribute/player-attribute.schema";
import { ROLE_NAMES } from "../../../../../../src/modules/role/enums/role.enum";

function createFakePlayerSheriffAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
    source: PLAYER_GROUPS.ALL,
    ...obj,
  });
}

function createFakePlayerSeenAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.SEEN,
    source: ROLE_NAMES.SEER,
    ...obj,
  });
}

function createFakePlayerEatenAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.EATEN,
    source: PLAYER_GROUPS.WEREWOLVES,
    ...obj,
  });
}

function createFakePlayerDrankLifePotionAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.DRANK_LIFE_POTION,
    source: ROLE_NAMES.WITCH,
    ...obj,
  });
}

function createFakePlayerDrankDeathPotionAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.DRANK_DEATH_POTION,
    source: ROLE_NAMES.WITCH,
    ...obj,
  });
}

function createFakePlayerProtectedAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.PROTECTED,
    source: ROLE_NAMES.GUARD,
    ...obj,
  });
}

function createFakePlayerRavenMarkedAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.RAVEN_MARKED,
    source: ROLE_NAMES.RAVEN,
    ...obj,
  });
}

function createFakePlayerInLoveAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.IN_LOVE,
    source: ROLE_NAMES.CUPID,
    ...obj,
  });
}

function createFakePlayerWorshipedAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.WORSHIPED,
    source: ROLE_NAMES.WILD_CHILD,
    ...obj,
  });
}

function createFakePlayerPowerlessAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.POWERLESS,
    source: ROLE_NAMES.ANCIENT,
    ...obj,
  });
}

function createFakePlayerCantVoteAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.CANT_VOTE,
    source: ROLE_NAMES.SCAPEGOAT,
    ...obj,
  });
}

function createFakePlayerCharmedAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.CHARMED,
    source: ROLE_NAMES.PIED_PIPER,
    ...obj,
  });
}

function createFakePlayerGrowledAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.GROWLED,
    source: ROLE_NAMES.BEAR_TAMER,
    ...obj,
  });
}

function createFakePlayerContaminatedAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return createFakePlayerAttribute({
    name: PLAYER_ATTRIBUTE_NAMES.CONTAMINATED,
    source: ROLE_NAMES.RUSTY_SWORD_KNIGHT,
    ...obj,
  });
}

function createFakePlayerAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return plainToInstance(PlayerAttribute, {
    name: obj.name ?? faker.helpers.arrayElement(Object.values(PLAYER_ATTRIBUTE_NAMES)),
    source: obj.source ?? faker.helpers.arrayElement(gameSourceValues),
  });
}

function bulkCreateFakePlayerAttributes(length: number, attributes: Partial<PlayerAttribute>[] = []): PlayerAttribute[] {
  return plainToInstance(PlayerAttribute, Array.from(Array(length)).map((item, index) => {
    const override = index < attributes.length ? attributes[index] : {};
    return createFakePlayerAttribute(override);
  }));
}

export {
  createFakePlayerSheriffAttribute,
  createFakePlayerSeenAttribute,
  createFakePlayerEatenAttribute,
  createFakePlayerDrankLifePotionAttribute,
  createFakePlayerDrankDeathPotionAttribute,
  createFakePlayerProtectedAttribute,
  createFakePlayerRavenMarkedAttribute,
  createFakePlayerInLoveAttribute,
  createFakePlayerWorshipedAttribute,
  createFakePlayerPowerlessAttribute,
  createFakePlayerCantVoteAttribute,
  createFakePlayerCharmedAttribute,
  createFakePlayerGrowledAttribute,
  createFakePlayerContaminatedAttribute,
  createFakePlayerAttribute,
  bulkCreateFakePlayerAttributes,
};