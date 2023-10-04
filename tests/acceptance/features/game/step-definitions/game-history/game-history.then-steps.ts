import type { DataTable } from "@cucumber/cucumber";
import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import type { GamePhases } from "@/modules/game/enums/game.enum";
import type { GameHistoryRecordVotingResults } from "@/modules/game/enums/game-history-record.enum";
import type { WitchPotions } from "@/modules/game/enums/game-play.enum";

import { convertDatatableToGameHistoryRecordPlayVotes, convertDatatableToPlayers } from "@tests/acceptance/features/game/helpers/game-datatable.helper";
import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";

Then(/^the game's tick from the previous history record should be (?<tick>\d)$/u, function(this: CustomWorld, tick: string): void {
  expect(this.lastGameHistoryRecord.tick).toBe(parseInt(tick));
});

Then(/^the game's turn from the previous history record should be (?<turn>\d)$/u, function(this: CustomWorld, turn: string): void {
  expect(this.lastGameHistoryRecord.turn).toBe(parseInt(turn));
});

Then(/^the game's phase from the previous history record should be (?<phase>night|day)$/u, function(this: CustomWorld, phase: GamePhases): void {
  expect(this.lastGameHistoryRecord.phase).toBe(phase);
});

Then(/^the play's targets from the previous history record should be the following players$/u, function(this: CustomWorld, expectedTargetsDatatable: DataTable): void {
  const players = convertDatatableToPlayers(expectedTargetsDatatable.rows(), this.gameOnPreviousGamePlay);

  expect(this.lastGameHistoryRecord.play.targets?.map(({ player }) => player)).toStrictEqual(players);
});

Then(/^the play's targets from the previous history record should be undefined$/u, function(this: CustomWorld): void {
  expect(this.lastGameHistoryRecord.play.targets).toBeUndefined();
});

Then(/^the play's target named (?<name>.+?) from the previous history record should have drunk the (?<potion>life|death) potion$/u, function(this: CustomWorld, playerName: string, potion: WitchPotions): void {
  const lastTarget = this.lastGameHistoryRecord.play.targets?.find(({ player }) => player.name === playerName);

  expect(lastTarget?.drankPotion).toBe(potion);
});

Then(/^the play's votes from the previous history record should be the following votes$/u, function(this: CustomWorld, expectedVotesDatatable: DataTable): void {
  const votes = convertDatatableToGameHistoryRecordPlayVotes(expectedVotesDatatable.rows(), this.gameOnPreviousGamePlay);

  expect(this.lastGameHistoryRecord.play.votes).toStrictEqual(votes);
});

Then(/^the play's votes from the previous history record should be undefined$/u, function(this: CustomWorld): void {
  expect(this.lastGameHistoryRecord.play.votes).toBeUndefined();
});

Then(/^the play's voting result from the previous history record should be (?<votingResult>sheriff-election|tie|death|inconsequential|skipped)$/u, function(this: CustomWorld, votingResult: GameHistoryRecordVotingResults): void {
  expect(this.lastGameHistoryRecord.play.voting?.result).toBe(votingResult);
});

Then(/^the play's nominated players from votes of the previous history record should be the following players$/u, function(this: CustomWorld, expectedNominatedPlayersDatatable: DataTable): void {
  const nominatedPlayers = convertDatatableToPlayers(expectedNominatedPlayersDatatable.rows(), this.gameOnPreviousGamePlay);

  expect(this.lastGameHistoryRecord.play.voting?.nominatedPlayers).toStrictEqual(nominatedPlayers);
});