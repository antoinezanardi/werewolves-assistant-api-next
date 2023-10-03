import type { DataTable } from "@cucumber/cucumber";
import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import type { WitchPotions } from "@/modules/game/enums/game-play.enum";

import { convertDatatableToPlayers } from "@tests/acceptance/features/game/helpers/game-datatable.helper";
import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";

Then(/^the play's targets from the previous history record should be the following players$/u, function(this: CustomWorld, expectedPlayersDatatable: DataTable): void {
  const players = convertDatatableToPlayers(expectedPlayersDatatable.rows(), this.gameOnPreviousGamePlay);

  expect(this.lastGameHistoryRecord.play.targets?.map(({ player }) => player)).toStrictEqual(players);
});

Then(/^the play's targets from the previous history record should be undefined$/u, function(this: CustomWorld): void {
  expect(this.lastGameHistoryRecord.play.targets).toBeUndefined();
});

Then(/^the play's target named (?<name>.+?) from the previous history record should have drunk the (?<potion>life|death) potion$/u, function(this: CustomWorld, playerName: string, potion: WitchPotions): void {
  const lastTarget = this.lastGameHistoryRecord.play.targets?.find(({ player }) => player.name === playerName);

  expect(lastTarget?.drankPotion).toBe(potion);
});