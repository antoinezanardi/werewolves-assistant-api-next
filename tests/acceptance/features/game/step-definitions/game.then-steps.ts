import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import type { GAME_PLAY_ACTIONS } from "../../../../../src/modules/game/enums/game-play.enum";
import type { GAME_PHASES } from "../../../../../src/modules/game/enums/game.enum";
import type { PLAYER_ATTRIBUTE_NAMES } from "../../../../../src/modules/game/enums/player.enum";
import { getPlayerWithNameOrThrow } from "../../../../../src/modules/game/helpers/game.helper";
import { doesPlayerHaveAttributeWithNameAndSource } from "../../../../../src/modules/game/helpers/player/player-attribute/player-attribute.helper";
import type { GameSource } from "../../../../../src/modules/game/types/game.type";
import type { CustomWorld } from "../../../shared/types/world.types";

Then(/^the game's tick should be (?<tick>\d)$/u, function(this: CustomWorld, tick: string): void {
  expect(this.game.tick).toBe(parseInt(tick));
});

Then(/^the game's turn should be (?<turn>\d)$/u, function(this: CustomWorld, turn: string): void {
  expect(this.game.turn).toBe(parseInt(turn));
});

Then(/^the game's phase should be (?<phase>night|day)$/u, function(this: CustomWorld, phase: GAME_PHASES): void {
  expect(this.game.phase).toBe(phase);
});

Then(
  /^the player named (?<name>.+?) should have the (?<attributeName>\S+) from (?<attributeSource>\S+) attribute$/u,
  function(this: CustomWorld, playerName: string, attributeName: PLAYER_ATTRIBUTE_NAMES, attributeSource: GameSource): void {
    const player = getPlayerWithNameOrThrow(playerName, this.game, new Error("Player name not found"));

    expect(doesPlayerHaveAttributeWithNameAndSource(player, attributeName, attributeSource)).toBe(true);
  },
);

Then(/^the game's current play should be (?<source>.+?) to (?<action>.+?)$/u, function(this: CustomWorld, source: GameSource, action: GAME_PLAY_ACTIONS): void {
  expect(this.game.currentPlay).toStrictEqual({ source, action });
});