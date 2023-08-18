import type { DataTable } from "@cucumber/cucumber";
import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { parseInt } from "lodash";
import type { GAME_PLAY_CAUSES, GAME_PLAY_ACTIONS } from "../../../../../src/modules/game/enums/game-play.enum";
import type { GAME_VICTORY_TYPES } from "../../../../../src/modules/game/enums/game-victory.enum";
import type { GAME_STATUSES, GAME_PHASES } from "../../../../../src/modules/game/enums/game.enum";
import type { PLAYER_DEATH_CAUSES, PLAYER_ATTRIBUTE_NAMES } from "../../../../../src/modules/game/enums/player.enum";
import { getPlayerWithNameOrThrow } from "../../../../../src/modules/game/helpers/game.helper";
import { getPlayerAttributeWithNameAndSource, isPlayerAttributeActive } from "../../../../../src/modules/game/helpers/player/player-attribute/player-attribute.helper";
import type { GameSource } from "../../../../../src/modules/game/types/game.type";
import type { ROLE_SIDES } from "../../../../../src/modules/role/enums/role.enum";
import type { CustomWorld } from "../../../shared/types/world.types";
import { convertDatatableToPlayers } from "../helpers/game-datatable.helper";

Then(/^the game's tick should be (?<tick>\d)$/u, function(this: CustomWorld, tick: string): void {
  expect(this.game.tick).toBe(parseInt(tick));
});

Then(/^the game's turn should be (?<turn>\d)$/u, function(this: CustomWorld, turn: string): void {
  expect(this.game.turn).toBe(parseInt(turn));
});

Then(/^the game's phase should be (?<phase>night|day)$/u, function(this: CustomWorld, phase: GAME_PHASES): void {
  expect(this.game.phase).toBe(phase);
});

Then(/^the game's status should be (?<phase>playing|over|canceled)$/u, function(this: CustomWorld, status: GAME_STATUSES): void {
  expect(this.game.status).toBe(status);
});

Then(
  /^the game's current play should be (?<source>.+?) to (?<action>.+?)(?: because (?<cause>.+?))?$/u,
  function(this: CustomWorld, source: GameSource, action: GAME_PLAY_ACTIONS, cause: GAME_PLAY_CAUSES | null): void {
    expect(this.game.currentPlay?.source.name).toBe(source);
    expect(this.game.currentPlay?.action).toBe(action);
    if (cause !== null) {
      expect(this.game.currentPlay?.cause).toBe(cause);
    }
  },
);

Then(
  /^the game's current play should be played by the following players$/u,
  function(this: CustomWorld, expectedPlayersDatatable: DataTable): void {
    const players = convertDatatableToPlayers(expectedPlayersDatatable.rows(), this.game);
    expect(this.game.currentPlay?.source.players).toStrictEqual(players);
  },
);

Then(
  /^the game's winners should be (?<winners>villagers|werewolves|lovers|angel|white-werewolf|pied-piper|none) with the following players$/u,
  function(this: CustomWorld, victoryType: GAME_VICTORY_TYPES, winnersDatable: DataTable): void {
    const players = convertDatatableToPlayers(winnersDatable.rows(), this.game);
    const expectedWinners = players.length ? players : undefined;

    expect(this.game.victory?.type).toBe(victoryType);
    expect(this.game.victory?.winners).toStrictEqual(expectedWinners);
  },
);

Then(
  /^the player named (?<name>.+?) should(?<shouldMiss> not)? have the (?<isActive>active|inactive) (?<attributeName>\S+) from (?<attributeSource>\S+) attribute$/u,
  function(
    this: CustomWorld,
    playerName: string,
    shouldMiss: string | null,
    isActive: "active" | "inactive",
    attributeName: PLAYER_ATTRIBUTE_NAMES,
    attributeSource: GameSource,
  ): void {
    const player = getPlayerWithNameOrThrow(playerName, this.game, new Error("Player name not found"));
    const attribute = getPlayerAttributeWithNameAndSource(player, attributeName, attributeSource);
    
    expect(!!attribute).toBe(shouldMiss === null);
    if (attribute) {
      expect(isPlayerAttributeActive(attribute, this.game)).toBe(isActive === "active");
    }
  },
);

Then(
  /^(?<playerCount>\d) of the following players should have the (?<isActive>active|inactive) (?<attributeName>\S+) from (?<attributeSource>\S+) attribute$/u,
  function(
    this: CustomWorld,
    playerCount: string,
    isActive: "active" | "inactive",
    attributeName: PLAYER_ATTRIBUTE_NAMES,
    attributeSource: GameSource,
    expectedPlayersDatatable: DataTable,
  ): void {
    const players = convertDatatableToPlayers(expectedPlayersDatatable.rows(), this.game);
    const playersWithAttribute = players.filter(player => {
      const attribute = getPlayerAttributeWithNameAndSource(player, attributeName, attributeSource);
      const isAttributeActive = !!attribute && isPlayerAttributeActive(attribute, this.game);
      return isAttributeActive === (isActive === "active");
    });

    expect(playersWithAttribute.length).toBe(parseInt(playerCount));
  },
);

Then(
  /^nobody should have the (?<isActive>active|inactive) (?<attributeName>\S+) from (?<attributeSource>\S+) attribute$/u,
  function(this: CustomWorld, isActive: "active" | "inactive", attributeName: PLAYER_ATTRIBUTE_NAMES, attributeSource: GameSource): void {
    const doSomePlayerHaveAttribute = this.game.players.some(player => {
      const attribute = getPlayerAttributeWithNameAndSource(player, attributeName, attributeSource);
      const isAttributeActive = !!attribute && isPlayerAttributeActive(attribute, this.game);
      return isAttributeActive === (isActive === "active");
    });

    expect(doSomePlayerHaveAttribute).toBe(false);
  },
);

Then(/^the player named (?<name>.+?) should be alive$/u, function(this: CustomWorld, playerName: string): void {
  const player = getPlayerWithNameOrThrow(playerName, this.game, new Error("Player name not found"));

  expect(player.isAlive).toBe(true);
});

Then(
  /^the player named (?<name>.+?) should be murdered by (?<deathSource>.+?) from (?<deathCause>.+?)$/u,
  function(this: CustomWorld, playerName: string, deathSource: GameSource, deathCause: PLAYER_DEATH_CAUSES): void {
    const player = getPlayerWithNameOrThrow(playerName, this.game, new Error("Player name not found"));

    expect(player.isAlive).toBe(false);
    expect(player.death).toStrictEqual({
      source: deathSource,
      cause: deathCause,
    });
  },
);

Then(
  /^the player named (?<name>.+?) should be on (?<currentSide>villagers|werewolves) current side and originally be on (?<originalSide>villagers|werewolves) side$/u,
  function(this: CustomWorld, playerName: string, currentSide: ROLE_SIDES, originalSide: ROLE_SIDES): void {
    const player = getPlayerWithNameOrThrow(playerName, this.game, new Error("Player name not found"));

    expect(player.side.current).toBe(currentSide);
    expect(player.side.original).toBe(originalSide);
  },
);