import { PLAYER_ATTRIBUTE_NAMES, PLAYER_DEATH_CAUSES, PLAYER_GROUPS } from "../../../../../../../../src/modules/game/enums/player.enum";
import { createPlayerBrokenHeartByCupidDeath, createPlayerDeath, createPlayerDeathPotionByWitchDeath, createPlayerDiseaseByRustySwordKnightDeath, createPlayerEatenByBigBadWolfDeath, createPlayerEatenByWerewolvesDeath, createPlayerEatenByWhiteWerewolfDeath, createPlayerReconsiderPardonByAllDeath, createPlayerShotByHunterDeath, createPlayerVoteByAllDeath, createPlayerVoteBySheriffDeath, createPlayerVoteScapegoatedByAllDeath } from "../../../../../../../../src/modules/game/helpers/player/player-death/player-death.factory";
import type { PlayerDeath } from "../../../../../../../../src/modules/game/schemas/player/player-death.schema";
import { ROLE_NAMES } from "../../../../../../../../src/modules/role/enums/role.enum";
import { createFakePlayerDeath } from "../../../../../../../factories/game/schemas/player/player-death/player-death.schema.factory";

describe("Player Death Factory", () => {
  describe("createPlayerDiseaseByRustySwordKnightDeath", () => {
    it("should create player disease by rusty sword knight when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: PLAYER_DEATH_CAUSES.DISEASE,
        source: ROLE_NAMES.RUSTY_SWORD_KNIGHT,
      });
      expect(createPlayerDiseaseByRustySwordKnightDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerBrokenHeartByCupidDeath", () => {
    it("should create player broken heart by cupid when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: PLAYER_DEATH_CAUSES.BROKEN_HEART,
        source: ROLE_NAMES.CUPID,
      });
      expect(createPlayerBrokenHeartByCupidDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerReconsiderPardonByAllDeath", () => {
    it("should create player reconsider pardon by all death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: PLAYER_DEATH_CAUSES.RECONSIDER_PARDON,
        source: PLAYER_GROUPS.ALL,
      });
      expect(createPlayerReconsiderPardonByAllDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerVoteScapegoatedByAllDeath", () => {
    it("should create player vote scapegoated by all death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: PLAYER_DEATH_CAUSES.VOTE_SCAPEGOATED,
        source: PLAYER_GROUPS.ALL,
      });
      expect(createPlayerVoteScapegoatedByAllDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerVoteBySheriffDeath", () => {
    it("should create player vote by sheriff death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: PLAYER_DEATH_CAUSES.VOTE,
        source: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
      });
      expect(createPlayerVoteBySheriffDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerVoteByAllDeath", () => {
    it("should create player vote by all death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: PLAYER_DEATH_CAUSES.VOTE,
        source: PLAYER_GROUPS.ALL,
      });
      expect(createPlayerVoteByAllDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerShotByHunterDeath", () => {
    it("should create player shot by hunter death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: PLAYER_DEATH_CAUSES.SHOT,
        source: ROLE_NAMES.HUNTER,
      });
      expect(createPlayerShotByHunterDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerEatenByWhiteWerewolfDeath", () => {
    it("should create player eaten by white werewolf death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: PLAYER_DEATH_CAUSES.EATEN,
        source: ROLE_NAMES.WHITE_WEREWOLF,
      });
      expect(createPlayerEatenByWhiteWerewolfDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerEatenByBigBadWolfDeath", () => {
    it("should create player eaten by big bad wolf death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: PLAYER_DEATH_CAUSES.EATEN,
        source: ROLE_NAMES.BIG_BAD_WOLF,
      });
      expect(createPlayerEatenByBigBadWolfDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerEatenByWerewolvesDeath", () => {
    it("should create player eaten by werewolves death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: PLAYER_DEATH_CAUSES.EATEN,
        source: PLAYER_GROUPS.WEREWOLVES,
      });
      expect(createPlayerEatenByWerewolvesDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerDeathPotionByWitchDeath", () => {
    it("should create player death potion by witch death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: PLAYER_DEATH_CAUSES.DEATH_POTION,
        source: ROLE_NAMES.WITCH,
      });
      expect(createPlayerDeathPotionByWitchDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerDeath", () => {
    it("should create player death when called.", () => {
      const playerDeath: PlayerDeath = {
        cause: PLAYER_DEATH_CAUSES.DEATH_POTION,
        source: ROLE_NAMES.WITCH,
      };
      expect(createPlayerDeath(playerDeath)).toStrictEqual<PlayerDeath>(createFakePlayerDeath({
        cause: PLAYER_DEATH_CAUSES.DEATH_POTION,
        source: ROLE_NAMES.WITCH,
      }));
    });
  });
});