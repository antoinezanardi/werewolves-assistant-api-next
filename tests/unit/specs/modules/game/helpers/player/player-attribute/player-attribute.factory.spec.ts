import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../../../../../../src/modules/game/enums/player.enum";
import { createCantVoteByAllPlayerAttribute, createCantVoteByScapegoatPlayerAttribute, createCharmedByPiedPiperPlayerAttribute, createContaminatedByRustySwordKnightPlayerAttribute, createDrankDeathPotionByWitchPlayerAttribute, createDrankLifePotionByWitchPlayerAttribute, createEatenByBigBadWolfPlayerAttribute, createEatenByWerewolvesPlayerAttribute, createEatenByWhiteWerewolfPlayerAttribute, createGrowledByBearTamerPlayerAttribute, createInLoveByCupidPlayerAttribute, createPlayerAttribute, createPowerlessByAncientPlayerAttribute, createPowerlessByFoxPlayerAttribute, createProtectedByGuardPlayerAttribute, createRavenMarkByRavenPlayerAttribute, createSeenBySeerPlayerAttribute, createSheriffByAllPlayerAttribute, createSheriffBySheriffPlayerAttribute, createWorshipedByWildChildPlayerAttribute } from "../../../../../../../../src/modules/game/helpers/player/player-attribute/player-attribute.factory";
import type { PlayerAttribute } from "../../../../../../../../src/modules/game/schemas/player/player-attribute/player-attribute.schema";
import { ROLE_NAMES } from "../../../../../../../../src/modules/role/enums/role.enum";
import { createFakePlayerAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";

describe("Player Attribute Factory", () => {
  describe("createContaminatedByRustySwordKnightPlayerAttribute", () => {
    it("should create contaminated attribute by rusty sword knight when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.CONTAMINATED,
        source: ROLE_NAMES.RUSTY_SWORD_KNIGHT,
        remainingPhases: 2,
      });
      expect(createContaminatedByRustySwordKnightPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createGrowledByBearTamerPlayerAttribute", () => {
    it("should create growled attribute by bear tamer when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.GROWLED,
        source: ROLE_NAMES.BEAR_TAMER,
        remainingPhases: 1,
      });
      expect(createGrowledByBearTamerPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createCharmedByPiedPiperPlayerAttribute", () => {
    it("should create charmed attribute by pied piper when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.CHARMED,
        source: ROLE_NAMES.PIED_PIPER,
      });
      expect(createCharmedByPiedPiperPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createCantVoteByAllPlayerAttribute", () => {
    it("should create can't vote attribute by all when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.CANT_VOTE,
        source: PLAYER_GROUPS.ALL,
      });
      expect(createCantVoteByAllPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createCantVoteByScapegoatPlayerAttribute", () => {
    it("should create can't vote attribute by scapegoat when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.CANT_VOTE,
        source: ROLE_NAMES.SCAPEGOAT,
        remainingPhases: 2,
      });
      expect(createCantVoteByScapegoatPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPowerlessByFoxPlayerAttribute", () => {
    it("should create powerless attribute by fox when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.POWERLESS,
        source: ROLE_NAMES.FOX,
      });
      expect(createPowerlessByFoxPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPowerlessByAncientPlayerAttribute", () => {
    it("should create powerless attribute by ancient when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.POWERLESS,
        source: ROLE_NAMES.ANCIENT,
      });
      expect(createPowerlessByAncientPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createWorshipedByWildChildPlayerAttribute", () => {
    it("should create worshiped attribute by wild child when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.WORSHIPED,
        source: ROLE_NAMES.WILD_CHILD,
      });
      expect(createWorshipedByWildChildPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createInLoveByCupidPlayerAttribute", () => {
    it("should create in love attribute by cupid when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.IN_LOVE,
        source: ROLE_NAMES.CUPID,
      });
      expect(createInLoveByCupidPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createRavenMarkByRavenPlayerAttribute", () => {
    it("should create raven-marked attribute by raven when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.RAVEN_MARKED,
        source: ROLE_NAMES.RAVEN,
        remainingPhases: 2,
      });
      expect(createRavenMarkByRavenPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createProtectedByGuardPlayerAttribute", () => {
    it("should create protected attribute by guard when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.PROTECTED,
        source: ROLE_NAMES.GUARD,
        remainingPhases: 1,
      });
      expect(createProtectedByGuardPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createDrankDeathPotionByWitchPlayerAttribute", () => {
    it("should create drank death potion attribute by witch when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.DRANK_DEATH_POTION,
        source: ROLE_NAMES.WITCH,
        remainingPhases: 1,
      });
      expect(createDrankDeathPotionByWitchPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createDrankLifePotionByWitchPlayerAttribute", () => {
    it("should create drank life potion attribute by witch when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.DRANK_LIFE_POTION,
        source: ROLE_NAMES.WITCH,
        remainingPhases: 1,
      });
      expect(createDrankLifePotionByWitchPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createEatenByBigBadWolfPlayerAttribute", () => {
    it("should create eaten attribute by big bad wolf when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.EATEN,
        source: ROLE_NAMES.BIG_BAD_WOLF,
        remainingPhases: 1,
      });
      expect(createEatenByBigBadWolfPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createEatenByWhiteWerewolfPlayerAttribute", () => {
    it("should create eaten attribute by white werewolves when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.EATEN,
        source: ROLE_NAMES.WHITE_WEREWOLF,
        remainingPhases: 1,
      });
      expect(createEatenByWhiteWerewolfPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createEatenByWerewolvesPlayerAttribute", () => {
    it("should create eaten attribute by werewolves when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.EATEN,
        source: PLAYER_GROUPS.WEREWOLVES,
        remainingPhases: 1,
      });
      expect(createEatenByWerewolvesPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createSeenBySeerPlayerAttribute", () => {
    it("should create seen attribute by seer when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.SEEN,
        source: ROLE_NAMES.SEER,
        remainingPhases: 1,
      });
      expect(createSeenBySeerPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createSheriffBySheriffPlayerAttribute", () => {
    it("should create sheriff attribute by sheriff when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
        source: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
      });
      expect(createSheriffBySheriffPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createSheriffByAllPlayerAttribute", () => {
    it("should create sheriff attribute by all when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
        source: PLAYER_GROUPS.ALL,
      });
      expect(createSheriffByAllPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPlayerAttribute", () => {
    it("should create player attribute when called.", () => {
      const playerAttribute: PlayerAttribute = {
        name: PLAYER_ATTRIBUTE_NAMES.GROWLED,
        source: ROLE_NAMES.BEAR_TAMER,
      };
      expect(createPlayerAttribute(playerAttribute)).toStrictEqual<PlayerAttribute>(createFakePlayerAttribute({
        name: PLAYER_ATTRIBUTE_NAMES.GROWLED,
        source: ROLE_NAMES.BEAR_TAMER,
      }));
    });
  });
});