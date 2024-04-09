import { createPlayerBrokenHeartByCupidDeath, createPlayerDeath, createPlayerDeathPotionByWitchDeath, createPlayerDiseaseByRustySwordKnightDeath, createPlayerEatenByBigBadWolfDeath, createPlayerEatenByWerewolvesDeath, createPlayerEatenByWhiteWerewolfDeath, createPlayerReconsiderPardonBySurvivorsDeath, createPlayerShotByHunterDeath, createPlayerVoteBySheriffDeath, createPlayerVoteBySurvivorsDeath, createPlayerVoteScapegoatedBySurvivorsDeath } from "@/modules/game/helpers/player/player-death/player-death.factory";
import type { PlayerDeath } from "@/modules/game/schemas/player/player-death/player-death.schema";

import { createFakePlayerDeath } from "@tests/factories/game/schemas/player/player-death/player-death.schema.factory";

describe("Player Death Factory", () => {
  describe("createPlayerDiseaseByRustySwordKnightDeath", () => {
    it("should create player contaminated by rusty sword knight when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: "disease",
        source: "rusty-sword-knight",
      });

      expect(createPlayerDiseaseByRustySwordKnightDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerBrokenHeartByCupidDeath", () => {
    it("should create player broken heart by cupid when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: "broken-heart",
        source: "cupid",
      });

      expect(createPlayerBrokenHeartByCupidDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerReconsiderPardonBySurvivorsDeath", () => {
    it("should create player reconsider pardon by survivors death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: "reconsider-pardon",
        source: "survivors",
      });

      expect(createPlayerReconsiderPardonBySurvivorsDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerVoteScapegoatedBySurvivorsDeath", () => {
    it("should create player vote scapegoated by survivors death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: "vote-scapegoated",
        source: "survivors",
      });

      expect(createPlayerVoteScapegoatedBySurvivorsDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerVoteBySheriffDeath", () => {
    it("should create player vote by sheriff death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: "vote",
        source: "sheriff",
      });

      expect(createPlayerVoteBySheriffDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerVoteBySurvivorsDeath", () => {
    it("should create player vote by survivors death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: "vote",
        source: "survivors",
      });

      expect(createPlayerVoteBySurvivorsDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerShotByHunterDeath", () => {
    it("should create player shot by hunter death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: "shot",
        source: "hunter",
      });

      expect(createPlayerShotByHunterDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerEatenByWhiteWerewolfDeath", () => {
    it("should create player eaten by white werewolf death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: "eaten",
        source: "white-werewolf",
      });

      expect(createPlayerEatenByWhiteWerewolfDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerEatenByBigBadWolfDeath", () => {
    it("should create player eaten by big bad wolf death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: "eaten",
        source: "big-bad-wolf",
      });

      expect(createPlayerEatenByBigBadWolfDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerEatenByWerewolvesDeath", () => {
    it("should create player eaten by werewolves death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: "eaten",
        source: "werewolves",
      });

      expect(createPlayerEatenByWerewolvesDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerDeathPotionByWitchDeath", () => {
    it("should create player death potion by witch death when called.", () => {
      const expectedDeath = createFakePlayerDeath({
        cause: "death-potion",
        source: "witch",
      });

      expect(createPlayerDeathPotionByWitchDeath()).toStrictEqual<PlayerDeath>(expectedDeath);
    });
  });

  describe("createPlayerDeath", () => {
    it("should create player death when called.", () => {
      const playerDeath: PlayerDeath = {
        cause: "death-potion",
        source: "witch",
      };

      expect(createPlayerDeath(playerDeath)).toStrictEqual<PlayerDeath>(createFakePlayerDeath({
        cause: "death-potion",
        source: "witch",
      }));
    });
  });
});