import type { DataTable } from "@cucumber/cucumber";
import { Then } from "@cucumber/cucumber";
import { convertDatatableToGameEvents, convertDatatableToPlayers } from "@tests/acceptance/features/game/helpers/game-datatable.helpers";
import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";
import { expect } from "expect";

Then(/^the game should have the following events$/u, function(this: CustomWorld, events: DataTable): void {
  const gameEvents = convertDatatableToGameEvents(events.rows());

  expect(this.game.events).toHaveLength(gameEvents.length);
  for (const [index, gameEvent] of gameEvents.entries()) {
    expect(this.game.events?.[index].type).toBe(gameEvent.type);
  }
});

Then(/^the game should not have any events$/u, function(this: CustomWorld): void {
  expect(this.game.events).toBeUndefined();
});

Then(/^the game's event with type "(?<type>.+?)" should have the following players$/u, function(this: CustomWorld, type: string, playersDatatable: DataTable): void {
  const players = convertDatatableToPlayers(playersDatatable.rows(), this.game);
  const gameEvent = this.game.events?.find(event => event.type === type);

  expect(gameEvent).toBeDefined();
  expect(gameEvent?.players).toStrictEqual(players);
});

Then(/^the game's event with type "(?<type>.+?)" should not have any players$/u, function(this: CustomWorld, type: string): void {
  const gameEvent = this.game.events?.find(event => event.type === type);

  expect(gameEvent).toBeDefined();
  expect(gameEvent?.players).toBeUndefined();
});