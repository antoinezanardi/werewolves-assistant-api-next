import { canPiedPiperCharm, isPlayerAliveAndPowerful, isPlayerOnVillagersSide, isPlayerOnWerewolvesSide } from "@/modules/game/helpers/player/player.helper";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { RoleSides } from "@/modules/role/enums/role.enum";

import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakePiedPiperGameOptions, createFakeRolesGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakePowerlessByElderPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePiedPiperAlivePlayer, createFakeWhiteWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer, createFakePlayerSide } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Player Helper", () => {
  describe("canPiedPiperCharm", () => {
    it.each<{
      test: string;
      piedPiperPlayer: Player;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when pied piper is powerless.",
        piedPiperPlayer: createFakePiedPiperAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when pied piper is dead.",
        piedPiperPlayer: createFakePiedPiperAlivePlayer({ attributes: [], isAlive: false }),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when pied piper is infected and thus is powerless.",
        piedPiperPlayer: createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: RoleSides.WEREWOLVES }) }),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: true }) }) }) }),
        expected: false,
      },
      {
        test: "should return true when pied piper is infected but original rule is not respected.",
        piedPiperPlayer: createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: RoleSides.WEREWOLVES }) }),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: false }) }) }) }),
        expected: true,
      },
      {
        test: "should return true when pied piper is not powerless and currently a villager.",
        piedPiperPlayer: createFakePiedPiperAlivePlayer({ side: createFakePlayerSide({ current: RoleSides.VILLAGERS }) }),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessIfInfected: true }) }) }) }),
        expected: true,
      },
    ])("$test", ({ piedPiperPlayer, game, expected }) => {
      expect(canPiedPiperCharm(piedPiperPlayer, game)).toBe(expected);
    });
  });

  describe("isPlayerAliveAndPowerful", () => {
    it.each<{
      test: string;
      player: Player;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when player is dead.",
        player: createFakePlayer({ isAlive: false, attributes: [] }),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when player is powerless.",
        player: createFakePlayer({ isAlive: true, attributes: [createFakePowerlessByElderPlayerAttribute()] }),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return true when player is alive and powerful.",
        player: createFakePlayer({ isAlive: true, attributes: [] }),
        game: createFakeGame(),
        expected: true,
      },
    ])("$test", ({ player, game, expected }) => {
      expect(isPlayerAliveAndPowerful(player, game)).toBe(expected);
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