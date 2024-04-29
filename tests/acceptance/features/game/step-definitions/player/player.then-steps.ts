import type { DataTable } from "@cucumber/cucumber";
import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { parseInt } from "lodash";

import type { RoleName, RoleSide } from "@/modules/role/types/role.types";
import { getPlayerWithNameOrThrow } from "@/modules/game/helpers/game.helpers";
import { getPlayerAttributeWithNameAndSource, isPlayerAttributeActive } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import type { GameSource } from "@/modules/game/types/game.types";
import type { PlayerAttributeName } from "@/modules/game/types/player/player-attribute/player-attribute.types";
import type { PlayerDeathCause } from "@/modules/game/types/player/player-death/player-death.types";

import { convertDatatableToPlayers } from "@tests/acceptance/features/game/helpers/game-datatable.helpers";
import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";

Then(
  /^the player named (?<name>.+?) should(?<shouldMiss> not)? have the (?<isActive>active|inactive) (?<attributeName>\S+) from (?<attributeSource>\S+) attribute$/u,
  function(
    this: CustomWorld,
    playerName: string,
    shouldMiss: string | null,
    isActive: "active" | "inactive",
    attributeName: PlayerAttributeName,
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
  /^the following players should(?<shouldMiss> not)? have the (?<isActive>active|inactive) (?<attributeName>\S+) from (?<attributeSource>\S+) attribute$/u,
  function(
    this: CustomWorld,
    shouldMiss: string | null,
    isActive: "active" | "inactive",
    attributeName: PlayerAttributeName,
    attributeSource: GameSource,
    expectedPlayersDatatable: DataTable,
  ): void {
    const players = convertDatatableToPlayers(expectedPlayersDatatable.rows(), this.game);
    const playersWithAttribute = players.filter(player => {
      const attribute = getPlayerAttributeWithNameAndSource(player, attributeName, attributeSource);
      const isAttributeActive = !!attribute && isPlayerAttributeActive(attribute, this.game);

      return isAttributeActive === (isActive === "active");
    });

    expect(playersWithAttribute.length).toBe(shouldMiss === null ? players.length : 0);
  },
);

Then(
  /^(?<playerCount>\d) of the following players should have the (?<isActive>active|inactive) (?<attributeName>\S+) from (?<attributeSource>\S+) attribute$/u,
  function(
    this: CustomWorld,
    playerCount: string,
    isActive: "active" | "inactive",
    attributeName: PlayerAttributeName,
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
  function(this: CustomWorld, isActive: "active" | "inactive", attributeName: PlayerAttributeName, attributeSource: GameSource): void {
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
  function(this: CustomWorld, playerName: string, deathSource: GameSource, deathCause: PlayerDeathCause): void {
    const player = getPlayerWithNameOrThrow(playerName, this.game, new Error("Player name not found"));

    expect(player.isAlive).toBe(false);
    expect(player.death).toStrictEqual({
      source: deathSource,
      cause: deathCause,
    });
  },
);

Then(/^one of the following players should be murdered by (?<deathSource>.+?) from (?<deathCause>.+?)$/u, function(this: CustomWorld, deathSource: GameSource, deathCause: PlayerDeathCause, expectedPlayersDatatable: DataTable): void {
  const players = convertDatatableToPlayers(expectedPlayersDatatable.rows(), this.game);
  const murderedPlayers = players.filter(player => !player.isAlive);

  expect(murderedPlayers.length).toBe(1);
  expect(murderedPlayers[0]?.death).toStrictEqual({
    source: deathSource,
    cause: deathCause,
  });
});

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
  function(this: CustomWorld, playerName: string, currentRole: RoleName, originalRole: RoleName): void {
    const player = getPlayerWithNameOrThrow(playerName, this.game, new Error("Player name not found"));

    expect(player.role.current).toBe(currentRole);
    expect(player.role.original).toBe(originalRole);
  },
);

Then(
  /^the player named (?<name>.+?) should be on (?<currentSide>villagers|werewolves) current side and originally be on (?<originalSide>villagers|werewolves) side$/u,
  function(this: CustomWorld, playerName: string, currentSide: RoleSide, originalSide: RoleSide): void {
    const player = getPlayerWithNameOrThrow(playerName, this.game, new Error("Player name not found"));

    expect(player.side.current).toBe(currentSide);
    expect(player.side.original).toBe(originalSide);
  },
);