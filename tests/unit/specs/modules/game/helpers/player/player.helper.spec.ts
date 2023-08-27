import { canPiedPiperCharm, isPlayerAliveAndPowerful, isPlayerOnVillagersSide, isPlayerOnWerewolvesSide } from "@/modules/game/helpers/player/player.helper";
import { ROLE_SIDES } from "@/modules/role/enums/role.enum";

import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakePiedPiperGameOptions, createFakeRolesGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakePowerlessByAncientPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePiedPiperAlivePlayer, createFakeWhiteWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer, createFakePlayerSide } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Player Helper", () => {
  describe("canPiedPiperCharm", () => {
    it("should return false when pied piper is powerless.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: false }) }) });
      const game = createFakeGame({ options });
      const piedPiperPlayer = createFakePiedPiperAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] });
      
      expect(canPiedPiperCharm(piedPiperPlayer, game)).toBe(false);
    });

    it("should return false when pied piper is dead.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: false }) }) });
      const game = createFakeGame({ options });
      const piedPiperPlayer = createFakePiedPiperAlivePlayer({ attributes: [], isAlive: false });
      
      expect(canPiedPiperCharm(piedPiperPlayer, game)).toBe(false);
    });

    it("should return false when pied piper is infected and thus is powerless.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: true }) }) });
      const game = createFakeGame({ options });
      const piedPiperPlayer = createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.WEREWOLVES }) });
      
      expect(canPiedPiperCharm(piedPiperPlayer, game)).toBe(false);
    });

    it("should return true when pied piper is infected but original rule is not respected.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: false }) }) });
      const game = createFakeGame({ options });
      const piedPiperPlayer = createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.WEREWOLVES }) });
      
      expect(canPiedPiperCharm(piedPiperPlayer, game)).toBe(true);
    });

    it("should return true when pied piper is not powerless and currently a villager.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: true }) }) });
      const game = createFakeGame({ options });
      const piedPiperPlayer = createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: ROLE_SIDES.VILLAGERS }) });
      
      expect(canPiedPiperCharm(piedPiperPlayer, game)).toBe(true);
    });
  });

  describe("isPlayerAliveAndPowerful", () => {
    it("should return false when player is dead.", () => {
      const game = createFakeGame();
      const player = createFakePlayer({ isAlive: false, attributes: [] });

      expect(isPlayerAliveAndPowerful(player, game)).toBe(false);
    });

    it("should return false when player is powerless.", () => {
      const game = createFakeGame();
      const player = createFakePlayer({ isAlive: true, attributes: [createFakePowerlessByAncientPlayerAttribute()] });

      expect(isPlayerAliveAndPowerful(player, game)).toBe(false);
    });

    it("should return true when player is alive and powerful.", () => {
      const game = createFakeGame();
      const player = createFakePlayer({ isAlive: true, attributes: [] });
      
      expect(isPlayerAliveAndPowerful(player, game)).toBe(true);
    });
  });

  describe("isPlayerOnWerewolvesSide", () => {
    it("should return false when player is on villagers side.", () => {
      expect(isPlayerOnWerewolvesSide(createFakePiedPiperAlivePlayer())).toBe(false);
    });

    it("should return true when player is on werewolves side.", () => {
      expect(isPlayerOnWerewolvesSide(createFakeWhiteWerewolfAlivePlayer())).toBe(true);
    });
  });

  describe("isPlayerOnVillagersSide", () => {
    it("should return true when player is on villagers side.", () => {
      expect(isPlayerOnVillagersSide(createFakePiedPiperAlivePlayer())).toBe(true);
    });

    it("should return false when player is on werewolves side.", () => {
      expect(isPlayerOnVillagersSide(createFakeWhiteWerewolfAlivePlayer())).toBe(false);
    });
  });
});