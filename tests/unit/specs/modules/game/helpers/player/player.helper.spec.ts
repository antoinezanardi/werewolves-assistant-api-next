import { isPlayerAliveAndPowerful, isPlayerOnVillagersSide, isPlayerOnWerewolvesSide, isPlayerPowerlessOnWerewolvesSide } from "@/modules/game/helpers/player/player.helper";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";

import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeActorGameOptions, createFakePiedPiperGameOptions, createFakePrejudicedManipulatorGameOptions, createFakeRolesGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options/game-roles-options.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakePowerlessByElderPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeActorAlivePlayer, createFakePiedPiperAlivePlayer, createFakePrejudicedManipulatorAlivePlayer, createFakeSeerAlivePlayer, createFakeWhiteWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Player Helper", () => {
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

  describe("isPlayerPowerlessOnWerewolvesSide", () => {
    it.each<{
      test: string;
      player: Player;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when player role is not prejudiced manipulator, pied piper or actor.",
        player: createFakeSeerAlivePlayer(),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return true when player role is prejudiced manipulator and prejudiced manipulator is powerless on werewolves side.",
        player: createFakePrejudicedManipulatorAlivePlayer(),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ prejudicedManipulator: createFakePrejudicedManipulatorGameOptions({ isPowerlessOnWerewolvesSide: true }) }) }) }),
        expected: true,
      },
      {
        test: "should return true when player role is pied piper and pied piper is powerless on werewolves side.",
        player: createFakePiedPiperAlivePlayer(),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessOnWerewolvesSide: true }) }) }) }),
        expected: true,
      },
      {
        test: "should return true when player role is actor and actor is powerless on werewolves side.",
        player: createFakeActorAlivePlayer(),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: true }) }) }) }),
        expected: true,
      },
      {
        test: "should return false when player role is prejudiced manipulator and prejudiced manipulator is not powerless on werewolves side.",
        player: createFakePrejudicedManipulatorAlivePlayer(),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ prejudicedManipulator: createFakePrejudicedManipulatorGameOptions({ isPowerlessOnWerewolvesSide: false }) }) }) }),
        expected: false,
      },
      {
        test: "should return false when player role is pied piper and pied piper is not powerless on werewolves side.",
        player: createFakePiedPiperAlivePlayer(),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ isPowerlessOnWerewolvesSide: false }) }) }) }),
        expected: false,
      },
      {
        test: "should return false when player role is actor and actor is not powerless on werewolves side.",
        player: createFakeActorAlivePlayer(),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: false }) }) }) }),
        expected: false,
      },
    ])("$test", ({ player, game, expected }) => {
      expect(isPlayerPowerlessOnWerewolvesSide(player, game)).toBe(expected);
    });
  });
});