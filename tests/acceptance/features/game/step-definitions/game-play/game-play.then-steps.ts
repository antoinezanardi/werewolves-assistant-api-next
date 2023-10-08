import type { DataTable } from "@cucumber/cucumber";
import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import type { GamePlayActions, GamePlayCauses } from "@/modules/game/enums/game-play.enum";
import type { GameSource } from "@/modules/game/types/game.type";

import { convertDatatableToPlayers } from "@tests/acceptance/features/game/helpers/game-datatable.helper";
import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";

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