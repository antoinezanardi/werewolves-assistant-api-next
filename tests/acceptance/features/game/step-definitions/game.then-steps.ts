import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { parseInt } from "lodash";
import type { DataTable } from "@cucumber/cucumber";

import type { GamePlayCauses, GamePlayActions } from "@/modules/game/enums/game-play.enum";
import type { GameVictoryTypes } from "@/modules/game/enums/game-victory.enum";
import type { GameStatuses, GamePhases } from "@/modules/game/enums/game.enum";
import type { PlayerDeathCauses, PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { getPlayerWithNameOrThrow } from "@/modules/game/helpers/game.helper";
import { getPlayerAttributeWithNameAndSource, isPlayerAttributeActive } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import type { GameSource } from "@/modules/game/types/game.type";
import type { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";
import { convertDatatableToPlayers } from "@tests/acceptance/features/game/helpers/game-datatable.helper";

Then(/^the game's tick should be (?<tick>\d)$/u, function(this: CustomWorld, tick: string): void {
  expect(this.game.tick).toBe(parseInt(tick));
});

Then(/^the game's turn should be (?<turn>\d)$/u, function(this: CustomWorld, turn: string): void {
  expect(this.game.turn).toBe(parseInt(turn));
});

Then(/^the game's phase should be (?<phase>night|day)$/u, function(this: CustomWorld, phase: GamePhases): void {
  expect(this.game.phase).toBe(phase);
});

Then(/^the game's status should be (?<phase>playing|over|canceled)$/u, function(this: CustomWorld, status: GameStatuses): void {
  expect(this.game.status).toBe(status);
});

Then(
  /^the game's current play should be (?<source>.+?) to (?<action>.+?)(?: because (?<cause>.+?))?$/u,
  function(this: CustomWorld, source: GameSource, action: GamePlayActions, cause: GamePlayCauses | null): void {
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
  function(this: CustomWorld, victoryType: GameVictoryTypes, winnersDatable: DataTable): void {
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
    attributeName: PlayerAttributeNames,
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
    attributeName: PlayerAttributeNames,
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
  function(this: CustomWorld, isActive: "active" | "inactive", attributeName: PlayerAttributeNames, attributeSource: GameSource): void {
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
  function(this: CustomWorld, playerName: string, deathSource: GameSource, deathCause: PlayerDeathCauses): void {
    const player = getPlayerWithNameOrThrow(playerName, this.game, new Error("Player name not found"));

    expect(player.isAlive).toBe(false);
    expect(player.death).toStrictEqual({
      source: deathSource,
      cause: deathCause,
    });
  },
);

Then(
  /^the player named (?<name>.+?) should (?<isHidden>not )?have his role revealed$/u,
  function(this: CustomWorld, playerName: string, isHidden: string | null): void {
    const player = getPlayerWithNameOrThrow(playerName, this.game, new Error("Player name not found"));
    const isRoleRevealed = isHidden === null;

    expect(player.role.isRevealed).toBe(isRoleRevealed);
  },
);

Then(
  /^the player named (?<name>.+?) should be currently a (?<currentRole>.+) and originally a (?<originalRole>.+)$/u,
  function(this: CustomWorld, playerName: string, currentRole: RoleNames, originalRole: RoleNames): void {
    const player = getPlayerWithNameOrThrow(playerName, this.game, new Error("Player name not found"));

    expect(player.role.current).toBe(currentRole);
    expect(player.role.original).toBe(originalRole);
  },
);

Then(
  /^the player named (?<name>.+?) should be on (?<currentSide>villagers|werewolves) current side and originally be on (?<originalSide>villagers|werewolves) side$/u,
  function(this: CustomWorld, playerName: string, currentSide: RoleSides, originalSide: RoleSides): void {
    const player = getPlayerWithNameOrThrow(playerName, this.game, new Error("Player name not found"));

    expect(player.side.current).toBe(currentSide);
    expect(player.side.original).toBe(originalSide);
  },
);