import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { createCantVoteBySurvivorsPlayerAttribute, createCantVoteByScapegoatPlayerAttribute, createCharmedByPiedPiperPlayerAttribute, createContaminatedByRustySwordKnightPlayerAttribute, createDrankDeathPotionByWitchPlayerAttribute, createDrankLifePotionByWitchPlayerAttribute, createEatenByBigBadWolfPlayerAttribute, createEatenByWerewolvesPlayerAttribute, createEatenByWhiteWerewolfPlayerAttribute, createGrowledByBearTamerPlayerAttribute, createInLoveByCupidPlayerAttribute, createPlayerAttribute, createPowerlessByElderPlayerAttribute, createPowerlessByFoxPlayerAttribute, createProtectedByDefenderPlayerAttribute, createScandalmongerMarkByScandalmongerPlayerAttribute, createSeenBySeerPlayerAttribute, createSheriffBySurvivorsPlayerAttribute, createSheriffBySheriffPlayerAttribute, createWorshipedByWildChildPlayerAttribute, createPowerlessByAccursedWolfFatherPlayerAttribute, createPowerlessByWerewolvesPlayerAttribute, createPowerlessByActorPlayerAttribute, createStolenRoleByDevotedServantPlayerAttribute, createActingByActorPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakePlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";

describe("Player Attribute Factory", () => {
  describe("createActingByActorPlayerAttribute", () => {
    it("should create acting attribute by actor when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.ACTING,
        source: RoleNames.ACTOR,
      });

      expect(createActingByActorPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createStolenRoleByDevotedServantPlayerAttribute", () => {
    it("should create stolen role attribute by devoted servant when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.STOLEN_ROLE,
        source: RoleNames.DEVOTED_SERVANT,
        doesRemainAfterDeath: true,
      });

      expect(createStolenRoleByDevotedServantPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createContaminatedByRustySwordKnightPlayerAttribute", () => {
    it("should create contaminated attribute by rusty sword knight when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.CONTAMINATED,
        source: RoleNames.RUSTY_SWORD_KNIGHT,
        remainingPhases: 2,
      });
      
      expect(createContaminatedByRustySwordKnightPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createGrowledByBearTamerPlayerAttribute", () => {
    it("should create growled attribute by bear tamer when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.GROWLED,
        source: RoleNames.BEAR_TAMER,
        remainingPhases: 1,
      });
      
      expect(createGrowledByBearTamerPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createCharmedByPiedPiperPlayerAttribute", () => {
    it("should create charmed attribute by pied piper when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.CHARMED,
        source: RoleNames.PIED_PIPER,
      });
      
      expect(createCharmedByPiedPiperPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createCantVoteBySurvivorsPlayerAttribute", () => {
    it("should create can't vote attribute by survivors when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.CANT_VOTE,
        source: PlayerGroups.SURVIVORS,
      });
      
      expect(createCantVoteBySurvivorsPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createCantVoteByScapegoatPlayerAttribute", () => {
    it("should create can't vote attribute by scapegoat active in next turn when game phase is day.", () => {
      const game = createFakeGame({ turn: 2, phase: GamePhases.DAY });
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.CANT_VOTE,
        source: RoleNames.SCAPEGOAT,
        remainingPhases: 1,
        activeAt: {
          turn: 3,
          phase: GamePhases.DAY,
        },
      });
      
      expect(createCantVoteByScapegoatPlayerAttribute(game)).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });

    it("should create can't vote attribute by scapegoat active in current turn when game phase is night.", () => {
      const game = createFakeGame({ turn: 2, phase: GamePhases.NIGHT });
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.CANT_VOTE,
        source: RoleNames.SCAPEGOAT,
        remainingPhases: 1,
        activeAt: {
          turn: 2,
          phase: GamePhases.DAY,
        },
      });

      expect(createCantVoteByScapegoatPlayerAttribute(game)).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPowerlessByActorPlayerAttribute", () => {
    it("should create powerless attribute by actor when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.POWERLESS,
        source: RoleNames.ACTOR,
        doesRemainAfterDeath: true,
      });

      expect(createPowerlessByActorPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPowerlessByWerewolvesPlayerAttribute", () => {
    it("should create powerless attribute by werewolves when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.POWERLESS,
        source: PlayerGroups.WEREWOLVES,
        doesRemainAfterDeath: true,
      });

      expect(createPowerlessByWerewolvesPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPowerlessByAccursedWolfFatherPlayerAttribute", () => {
    it("should create powerless attribute by accursed wolf father when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.POWERLESS,
        source: RoleNames.ACCURSED_WOLF_FATHER,
        doesRemainAfterDeath: true,
      });

      expect(createPowerlessByAccursedWolfFatherPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPowerlessByFoxPlayerAttribute", () => {
    it("should create powerless attribute by fox when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.POWERLESS,
        source: RoleNames.FOX,
        doesRemainAfterDeath: true,
      });
      
      expect(createPowerlessByFoxPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPowerlessByElderPlayerAttribute", () => {
    it("should create powerless attribute by elder when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.POWERLESS,
        source: RoleNames.ELDER,
        doesRemainAfterDeath: true,
      });
      
      expect(createPowerlessByElderPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createWorshipedByWildChildPlayerAttribute", () => {
    it("should create worshiped attribute by wild child when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.WORSHIPED,
        source: RoleNames.WILD_CHILD,
      });
      
      expect(createWorshipedByWildChildPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createInLoveByCupidPlayerAttribute", () => {
    it("should create in love attribute by cupid when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.IN_LOVE,
        source: RoleNames.CUPID,
      });
      
      expect(createInLoveByCupidPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createScandalmongerMarkByScandalmongerPlayerAttribute", () => {
    it("should create scandalmonger-marked attribute by scandalmonger when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.SCANDALMONGER_MARKED,
        source: RoleNames.SCANDALMONGER,
        remainingPhases: 2,
      });
      
      expect(createScandalmongerMarkByScandalmongerPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createProtectedByDefenderPlayerAttribute", () => {
    it("should create protected attribute by defender when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.PROTECTED,
        source: RoleNames.DEFENDER,
        remainingPhases: 1,
      });
      
      expect(createProtectedByDefenderPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createDrankDeathPotionByWitchPlayerAttribute", () => {
    it("should create drank death potion attribute by witch when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.DRANK_DEATH_POTION,
        source: RoleNames.WITCH,
        remainingPhases: 1,
      });
      
      expect(createDrankDeathPotionByWitchPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createDrankLifePotionByWitchPlayerAttribute", () => {
    it("should create drank life potion attribute by witch when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.DRANK_LIFE_POTION,
        source: RoleNames.WITCH,
        remainingPhases: 1,
      });
      
      expect(createDrankLifePotionByWitchPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createEatenByBigBadWolfPlayerAttribute", () => {
    it("should create eaten attribute by big bad wolf when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.EATEN,
        source: RoleNames.BIG_BAD_WOLF,
        remainingPhases: 1,
      });
      
      expect(createEatenByBigBadWolfPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createEatenByWhiteWerewolfPlayerAttribute", () => {
    it("should create eaten attribute by white werewolves when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.EATEN,
        source: RoleNames.WHITE_WEREWOLF,
        remainingPhases: 1,
      });
      
      expect(createEatenByWhiteWerewolfPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createEatenByWerewolvesPlayerAttribute", () => {
    it("should create eaten attribute by werewolves when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.EATEN,
        source: PlayerGroups.WEREWOLVES,
        remainingPhases: 1,
      });
      
      expect(createEatenByWerewolvesPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createSeenBySeerPlayerAttribute", () => {
    it("should create seen attribute by seer when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.SEEN,
        source: RoleNames.SEER,
        remainingPhases: 1,
      });
      
      expect(createSeenBySeerPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createSheriffBySheriffPlayerAttribute", () => {
    it("should create sheriff attribute by sheriff when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.SHERIFF,
        source: PlayerAttributeNames.SHERIFF,
        doesRemainAfterDeath: true,
      });
      
      expect(createSheriffBySheriffPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createSheriffBySurvivorsPlayerAttribute", () => {
    it("should create sheriff attribute by survivors when called.", () => {
      const expectedAttribute = createFakePlayerAttribute({
        name: PlayerAttributeNames.SHERIFF,
        source: PlayerGroups.SURVIVORS,
        doesRemainAfterDeath: true,
      });
      
      expect(createSheriffBySurvivorsPlayerAttribute()).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("createPlayerAttribute", () => {
    it("should create player attribute when called.", () => {
      const playerAttribute: PlayerAttribute = {
        name: PlayerAttributeNames.GROWLED,
        source: RoleNames.BEAR_TAMER,
      };
      
      expect(createPlayerAttribute(playerAttribute)).toStrictEqual<PlayerAttribute>(createFakePlayerAttribute({
        name: PlayerAttributeNames.GROWLED,
        source: RoleNames.BEAR_TAMER,
      }));
    });
  });
});