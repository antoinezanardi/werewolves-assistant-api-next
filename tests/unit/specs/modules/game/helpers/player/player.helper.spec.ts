import { isPlayerAliveAndPowerful, isPlayerOnVillagersSide, isPlayerOnWerewolvesSide } from "@/modules/game/helpers/player/player.helper";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";

import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakePowerlessByElderPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePiedPiperAlivePlayer, createFakeWhiteWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
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
});