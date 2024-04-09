import { createActingByActorPlayerAttribute, createCantVoteByScapegoatPlayerAttribute, createCantVoteBySurvivorsPlayerAttribute, createCharmedByPiedPiperPlayerAttribute, createContaminatedByRustySwordKnightPlayerAttribute, createDrankDeathPotionByWitchPlayerAttribute, createDrankLifePotionByWitchPlayerAttribute, createEatenByBigBadWolfPlayerAttribute, createEatenByWerewolvesPlayerAttribute, createEatenByWhiteWerewolfPlayerAttribute, createInLoveByCupidPlayerAttribute, createPlayerAttribute, createPowerlessByAccursedWolfFatherPlayerAttribute, createPowerlessByActorPlayerAttribute, createPowerlessByElderPlayerAttribute, createPowerlessByFoxPlayerAttribute, createPowerlessByWerewolvesPlayerAttribute, createProtectedByDefenderPlayerAttribute, createScandalmongerMarkByScandalmongerPlayerAttribute, createSeenBySeerPlayerAttribute, createSheriffBySheriffPlayerAttribute, createSheriffBySurvivorsPlayerAttribute, createStolenRoleByDevotedServantPlayerAttribute, createWorshipedByWildChildPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";

import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakePlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";

describe("Player Attribute Factory", () => {
  describe("createActingByActorPlayerAttribute", () => {
    it("should create acting attribute by actor when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "acting",
        source: "actor",
      });

      expect(createActingByActorPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createStolenRoleByDevotedServantPlayerAttribute", () => {
    it("should create stolen role attribute by devoted servant when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "stolen-role",
        source: "devoted-servant",
        doesRemainAfterDeath: true,
      });

      expect(createStolenRoleByDevotedServantPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createContaminatedByRustySwordKnightPlayerAttribute", () => {
    it("should create contaminated attribute by rusty sword knight when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "contaminated",
        source: "rusty-sword-knight",
        remainingPhases: 2,
      });

      expect(createContaminatedByRustySwordKnightPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createCharmedByPiedPiperPlayerAttribute", () => {
    it("should create charmed attribute by pied piper when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "charmed",
        source: "pied-piper",
      });

      expect(createCharmedByPiedPiperPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createCantVoteBySurvivorsPlayerAttribute", () => {
    it("should create can't vote attribute by survivors when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "cant-vote",
        source: "survivors",
      });

      expect(createCantVoteBySurvivorsPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createCantVoteByScapegoatPlayerAttribute", () => {
    it("should create can't vote attribute by scapegoat active in next turn when game phase is day.", () => {
      const game = createFakeGame({ turn: 2, phase: "day" });
      const expectedAttribute = createFakePlayerAttribute({
        name: "cant-vote",
        source: "scapegoat",
        remainingPhases: 1,
        activeAt: {
          turn: 3,
          phase: "day",
        },
      });

      expect(createCantVoteByScapegoatPlayerAttribute(game)).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });

    it("should create can't vote attribute by scapegoat active in current turn when game phase is night.", () => {
      const game = createFakeGame({ turn: 2, phase: "night" });
      const expectedAttribute = createFakePlayerAttribute({
        name: "cant-vote",
        source: "scapegoat",
        remainingPhases: 1,
        activeAt: {
          turn: 2,
          phase: "day",
        },
      });

      expect(createCantVoteByScapegoatPlayerAttribute(game)).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPowerlessByActorPlayerAttribute", () => {
    it("should create powerless attribute by actor when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "powerless",
        source: "actor",
        doesRemainAfterDeath: true,
      });

      expect(createPowerlessByActorPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPowerlessByWerewolvesPlayerAttribute", () => {
    it("should create powerless attribute by werewolves when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "powerless",
        source: "werewolves",
        doesRemainAfterDeath: true,
      });

      expect(createPowerlessByWerewolvesPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPowerlessByAccursedWolfFatherPlayerAttribute", () => {
    it("should create powerless attribute by accursed wolf father when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "powerless",
        source: "accursed-wolf-father",
        doesRemainAfterDeath: true,
      });

      expect(createPowerlessByAccursedWolfFatherPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPowerlessByFoxPlayerAttribute", () => {
    it("should create powerless attribute by fox when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "powerless",
        source: "fox",
        doesRemainAfterDeath: true,
      });

      expect(createPowerlessByFoxPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPowerlessByElderPlayerAttribute", () => {
    it("should create powerless attribute by elder when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "powerless",
        source: "elder",
        doesRemainAfterDeath: true,
      });

      expect(createPowerlessByElderPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createWorshipedByWildChildPlayerAttribute", () => {
    it("should create worshiped attribute by wild child when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "worshiped",
        source: "wild-child",
      });

      expect(createWorshipedByWildChildPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createInLoveByCupidPlayerAttribute", () => {
    it("should create in love attribute by cupid when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "in-love",
        source: "cupid",
      });

      expect(createInLoveByCupidPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createScandalmongerMarkByScandalmongerPlayerAttribute", () => {
    it("should create scandalmonger-marked attribute by scandalmonger when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "scandalmonger-marked",
        source: "scandalmonger",
        remainingPhases: 2,
      });

      expect(createScandalmongerMarkByScandalmongerPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createProtectedByDefenderPlayerAttribute", () => {
    it("should create protected attribute by defender when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "protected",
        source: "defender",
        remainingPhases: 1,
      });

      expect(createProtectedByDefenderPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createDrankDeathPotionByWitchPlayerAttribute", () => {
    it("should create drank death potion attribute by witch when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "drank-death-potion",
        source: "witch",
        remainingPhases: 1,
      });

      expect(createDrankDeathPotionByWitchPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createDrankLifePotionByWitchPlayerAttribute", () => {
    it("should create drank life potion attribute by witch when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "drank-life-potion",
        source: "witch",
        remainingPhases: 1,
      });

      expect(createDrankLifePotionByWitchPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createEatenByBigBadWolfPlayerAttribute", () => {
    it("should create eaten attribute by big bad wolf when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "eaten",
        source: "big-bad-wolf",
        remainingPhases: 1,
      });

      expect(createEatenByBigBadWolfPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createEatenByWhiteWerewolfPlayerAttribute", () => {
    it("should create eaten attribute by white werewolves when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "eaten",
        source: "white-werewolf",
        remainingPhases: 1,
      });

      expect(createEatenByWhiteWerewolfPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createEatenByWerewolvesPlayerAttribute", () => {
    it("should create eaten attribute by werewolves when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "eaten",
        source: "werewolves",
        remainingPhases: 1,
      });

      expect(createEatenByWerewolvesPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createSeenBySeerPlayerAttribute", () => {
    it("should create seen attribute by seer when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "seen",
        source: "seer",
        remainingPhases: 1,
      });

      expect(createSeenBySeerPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createSheriffBySheriffPlayerAttribute", () => {
    it("should create sheriff attribute by sheriff when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "sheriff",
        source: "sheriff",
        doesRemainAfterDeath: true,
      });

      expect(createSheriffBySheriffPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createSheriffBySurvivorsPlayerAttribute", () => {
    it("should create sheriff attribute by survivors when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: "sheriff",
        source: "survivors",
        doesRemainAfterDeath: true,
      });

      expect(createSheriffBySurvivorsPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPlayerAttribute", () => {
    it("should create player attribute when called.", () => {
      const playerAttribute: PlayerAttribute = {
        name: "eaten",
        source: "werewolves",
      };

      expect(createPlayerAttribute(playerAttribute)).toStrictEqual<PlayerAttribute>(createFakePlayerAttribute({
        name: "eaten",
        source: "werewolves",
      }));
    });
  });
});