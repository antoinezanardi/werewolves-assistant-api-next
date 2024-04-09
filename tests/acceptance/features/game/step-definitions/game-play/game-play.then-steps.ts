import type { DataTable } from "@cucumber/cucumber";
import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import type { GamePlayAction, GamePlayCause, GamePlayOccurrence, GamePlaySourceName, GamePlayType } from "@/modules/game/types/game-play/game-play.types";
import type { PlayerInteractionType } from "@/modules/game/types/player/player-interaction/player-interaction.types";

import { convertDatatableToGamePlaySourceInteractions, convertDatatableToPlayers } from "@tests/acceptance/features/game/helpers/game-datatable.helpers";
import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";

Then(/^the game's current play type should be (?<type>.+?)$/u, function(this: CustomWorld, type: GamePlayType): void {
  expect(this.game.currentPlay?.type).toBe(type);
});

Then(
  /^the game's current play should be (?<source>.+?) to (?<action>.+?)(?: because (?<cause>.+?))?$/u,
  function(this: CustomWorld, source: GamePlaySourceName, action: GamePlayAction, cause: GamePlayCause | null): void {
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

Then(/^the game's current play occurrence should be (?<occurrence>one-night-only|on-nights|on-days|anytime|consequential)$/u, function(this: CustomWorld, occurrence: GamePlayOccurrence): void {
  expect(this.game.currentPlay?.occurrence).toBe(occurrence);
});

Then(/^the game's current play source should not have interactions$/u, function(this: CustomWorld): void {
  expect(this.game.currentPlay?.source.interactions).toBeUndefined();
});

Then(/^the game's current play source should have the following interactions$/u, function(this: CustomWorld, expectedInteractionsDatatable: DataTable): void {
  const expectedInteractions = convertDatatableToGamePlaySourceInteractions(expectedInteractionsDatatable.rows());
  const interactions = this.game.currentPlay?.source.interactions;

  expect(interactions?.length).toBe(expectedInteractions.length);
  expectedInteractions.forEach(expectedInteraction => {
    const existingInteraction = interactions?.find(interaction => interaction.type === expectedInteraction.type);
    expect(existingInteraction).toBeDefined();
    expect(existingInteraction?.source).toBe(expectedInteraction.source);
    expect(existingInteraction?.boundaries).toStrictEqual(expectedInteraction.boundaries);
  });
});

Then(/^the game's current play source interaction with type (?<type>.+?) should have the following eligible targets$/u, function(this: CustomWorld, interactionType: PlayerInteractionType, expectedEligibleTargetsDatatable: DataTable): void {
  const expectedEligibleTargets = convertDatatableToPlayers(expectedEligibleTargetsDatatable.rows(), this.game);
  const interaction = this.game.currentPlay?.source.interactions?.find(({ type }) => type === interactionType);

  expect(interaction?.eligibleTargets).toStrictEqual(expectedEligibleTargets);
});

Then(/^the game's current play can(?<cantBeSkipped> not)? be skipped$/u, function(this: CustomWorld, canBeSkipped: string | null): void {
  expect(this.game.currentPlay?.canBeSkipped).toBe(canBeSkipped === null);
});