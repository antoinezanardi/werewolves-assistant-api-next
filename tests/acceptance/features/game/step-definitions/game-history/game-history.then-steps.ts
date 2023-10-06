import type { DataTable } from "@cucumber/cucumber";
import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import type { GameSource } from "@/modules/game/types/game.type";
import type { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import type { RoleNames } from "@/modules/role/enums/role.enum";
import type { PlayerSide } from "@/modules/game/schemas/player/player-side/player-side.schema";
import type { GamePhases } from "@/modules/game/enums/game.enum";
import type { GameHistoryRecordVotingResults } from "@/modules/game/enums/game-history-record.enum";

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

Then(/^the play's action from the previous history record should be (?<action>.+)$/u, function(this: CustomWorld, action: GamePlayActions): void {
  expect(this.lastGameHistoryRecord.play.action).toBe(action);
});

Then(/^the play's source name from the previous history record should be (?<sourceName>.+)$/u, function(this: CustomWorld, sourceName: GameSource): void {
  expect(this.lastGameHistoryRecord.play.source.name).toBe(sourceName);
});

Then(/^the play's source players from the previous history record should be the following players$/u, function(this: CustomWorld, expectedSourcePlayersDatatable: DataTable): void {
  const players = convertDatatableToPlayers(expectedSourcePlayersDatatable.rows(), this.gameOnPreviousGamePlay);

  expect(this.lastGameHistoryRecord.play.source.players).toStrictEqual(players);
});

Then(/^the play's cause from the previous history record should be (?<cause>(?!undefined).+)$/u, function(this: CustomWorld, cause: GamePlayCauses): void {
  expect(this.lastGameHistoryRecord.play.cause).toBe(cause);
});

Then(/^the play's cause from the previous history record should be undefined$/u, function(this: CustomWorld): void {
  expect(this.lastGameHistoryRecord.play.cause).toBeUndefined();
});

Then(/^the play's targets from the previous history record should be the following players$/u, function(this: CustomWorld, expectedTargetsDatatable: DataTable): void {
  const players = convertDatatableToPlayers(expectedTargetsDatatable.rows(), this.gameOnPreviousGamePlay);

  expect(this.lastGameHistoryRecord.play.targets?.map(({ player }) => player)).toStrictEqual(players);
});

Then(/^the play's targets from the previous history record should be undefined$/u, function(this: CustomWorld): void {
  expect(this.lastGameHistoryRecord.play.targets).toBeUndefined();
});

Then(/^the play's target named (?<name>.+?) from the previous history record should have drunk the (?<potion>life|death) potion$/u, function(this: CustomWorld, playerName: string, potion: WitchPotions): void {
  const target = this.lastGameHistoryRecord.play.targets?.find(({ player }) => player.name === playerName);

  expect(target?.drankPotion).toBe(potion);
});

Then(/^the play's target named (?<name>.+?) from the previous history record should be infected$/u, function(this: CustomWorld, playerName: string): void {
  const target = this.lastGameHistoryRecord.play.targets?.find(({ player }) => player.name === playerName);

  expect(target?.isInfected).toBe(true);
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

Then(/^the play's from the previous history record should (?<isNotRequested>not )?have the stuttering judge request$/u, function(this: CustomWorld, notRequested: string | null): void {
  expect(this.lastGameHistoryRecord.play.didJudgeRequestAnotherVote).toBe(notRequested === null ? true : undefined);
});

Then(/^the play's nominated players from votes of the previous history record should be the following players$/u, function(this: CustomWorld, expectedNominatedPlayersDatatable: DataTable): void {
  const nominatedPlayers = convertDatatableToPlayers(expectedNominatedPlayersDatatable.rows(), this.gameOnPreviousGamePlay);

  expect(this.lastGameHistoryRecord.play.voting?.nominatedPlayers).toStrictEqual(nominatedPlayers);
});

Then(/^the play's chosen card from the previous history record should be the card with role (?<cardRole>.+)$/u, function(this: CustomWorld, cardRole: RoleNames): void {
  const chosenCard = this.game.additionalCards?.find(({ roleName }) => roleName === cardRole);

  expect(this.lastGameHistoryRecord.play.chosenCard).toStrictEqual(chosenCard);
});

Then(/^the play's chosen card from the previous history record should be undefined$/u, function(this: CustomWorld): void {
  expect(this.lastGameHistoryRecord.play.chosenCard).toBeUndefined();
});

Then(/^the play's chosen side from the previous history record should be the (?<chosenSide>villagers|werewolves) side$/u, function(this: CustomWorld, chosenSide: PlayerSide): void {
  expect(this.lastGameHistoryRecord.play.chosenSide).toStrictEqual(chosenSide);
});

Then(/^the revealed players from the previous history record should be the following players$/u, function(this: CustomWorld, expectedRevealedPlayersDatatable: DataTable): void {
  const revealedPlayers = convertDatatableToPlayers(expectedRevealedPlayersDatatable.rows(), this.game);

  expect(this.lastGameHistoryRecord.revealedPlayers).toStrictEqual(revealedPlayers);
});

Then(/^the revealed players from the previous history record should be undefined$/u, function(this: CustomWorld): void {
  expect(this.lastGameHistoryRecord.revealedPlayers).toBeUndefined();
});

Then(/^the dead players from the previous history record should be the following players$/u, function(this: CustomWorld, expectedDeadPlayersDatatable: DataTable): void {
  const revealedPlayers = convertDatatableToPlayers(expectedDeadPlayersDatatable.rows(), this.game);

  expect(this.lastGameHistoryRecord.deadPlayers).toStrictEqual(revealedPlayers);
});

Then(/^the dead players from the previous history record should be undefined$/u, function(this: CustomWorld): void {
  expect(this.lastGameHistoryRecord.deadPlayers).toBeUndefined();
});