import type { DataTable } from "@cucumber/cucumber";
import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import type { GamePlayOccurrences, GamePlayActions, GamePlayCauses } from "@/modules/game/enums/game-play.enum";
import type { GamePlaySourceName } from "@/modules/game/types/game-play.type";

import { convertDatatableToPlayerInteractions, convertDatatableToPlayers } from "@tests/acceptance/features/game/helpers/game-datatable.helper";
import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";

Then(
  /^the game's current play should be (?<source>.+?) to (?<action>.+?)(?: because (?<cause>.+?))?$/u,
  function(this: CustomWorld, source: GamePlaySourceName, action: GamePlayActions, cause: GamePlayCauses | null): void {
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

Then(/^the game's current play occurrence should be (?<occurrence>first-night-only|on-nights|on-days|anytime|consequential)$/u, function(this: CustomWorld, occurrence: GamePlayOccurrences): void {
  expect(this.game.currentPlay?.occurrence).toBe(occurrence);
});

Then(/^the game's current play should have eligible targets interactable players$/u, function(this: CustomWorld, expectedPlayersDatatable: DataTable): void {
  const expectedInteractablePlayers = convertDatatableToPlayers(expectedPlayersDatatable.rows(), this.game);
  const interactablePlayers = this.game.currentPlay?.eligibleTargets?.interactablePlayers?.map(interactablePlayer => interactablePlayer.player);

  expect(interactablePlayers).toStrictEqual(expectedInteractablePlayers);
});

Then(/^the game's current play should not have eligible targets interactable players$/u, function(this: CustomWorld): void {
  expect(this.game.currentPlay?.eligibleTargets?.interactablePlayers).toBeUndefined();
});

Then(/^the game's current play eligible targets interactable player named (?<playerName>.+?) should have the following interactions$/u, function(this: CustomWorld, playerName: string, expectedInteractionsDatatable: DataTable): void {
  const interactablePlayer = this.game.currentPlay?.eligibleTargets?.interactablePlayers?.find(({ player }) => player.name === playerName);
  if (interactablePlayer === undefined) {
    throw new Error(`Interactable player named ${playerName} not found`);
  }
  const expectedInteractions = convertDatatableToPlayerInteractions(expectedInteractionsDatatable.rows());

  expect(interactablePlayer.interactions).toStrictEqual(expectedInteractions);
});

Then(/^the game's current play should have eligible targets boundaries from (?<min>[0-9]+) to (?<max>[0-9]+)$/u, function(this: CustomWorld, min: string, max: string): void {
  const expectedMin = parseInt(min);
  const expectedMax = parseInt(max);

  expect(this.game.currentPlay?.eligibleTargets?.boundaries?.min).toBe(expectedMin);
  expect(this.game.currentPlay?.eligibleTargets?.boundaries?.max).toBe(expectedMax);
});

Then(/^the game's current play should not have eligible targets boundaries$/u, function(this: CustomWorld): void {
  expect(this.game.currentPlay?.eligibleTargets?.boundaries).toBeUndefined();
});

Then(/^the game's current play can(?<cantBeSkipped> not)? be skipped$/u, function(this: CustomWorld, canBeSkipped: string | null): void {
  expect(this.game.currentPlay?.canBeSkipped).toBe(canBeSkipped === null);
});