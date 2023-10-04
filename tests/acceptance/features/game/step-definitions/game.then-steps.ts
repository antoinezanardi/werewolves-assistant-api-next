import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import type { DataTable } from "@cucumber/cucumber";

import type { GamePlayCauses, GamePlayActions } from "@/modules/game/enums/game-play.enum";
import type { GameVictoryTypes } from "@/modules/game/enums/game-victory.enum";
import type { GameStatuses, GamePhases } from "@/modules/game/enums/game.enum";
import type { GameSource } from "@/modules/game/types/game.type";

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