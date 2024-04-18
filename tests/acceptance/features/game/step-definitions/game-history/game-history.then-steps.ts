import type { DataTable } from "@cucumber/cucumber";
import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import type { GamePhaseName } from "@/modules/game/types/game-phase/game-phase.types";
import type { PlayerInteractionType } from "@/modules/game/types/player/player-interaction/player-interaction.types";
import type { RoleName } from "@/modules/role/types/role.types";
import type { PlayerSide } from "@/modules/game/schemas/player/player-side/player-side.schema";
import type { GameHistoryRecordVotingResult } from "@/modules/game/types/game-history-record/game-history-record.types";
import type { GamePlayAction, GamePlaySourceName, GamePlayType, WitchPotion } from "@/modules/game/types/game-play/game-play.types";

import { convertDatatableToGameHistoryRecordPlayVotes, convertDatatableToGamePlaySourceInteractions, convertDatatableToPlayers } from "@tests/acceptance/features/game/helpers/game-datatable.helpers";
import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";

Then(/^the game's tick from the previous history record should be (?<tick>\d)$/u, function(this: CustomWorld, tick: string): void {
  expect(this.lastGameHistoryRecord.tick).toBe(parseInt(tick));
});

Then(/^the game's turn from the previous history record should be (?<turn>\d)$/u, function(this: CustomWorld, turn: string): void {
  expect(this.lastGameHistoryRecord.turn).toBe(parseInt(turn));
});

Then(/^the game's phase name from the previous history record should be (?<phase>night|day)$/u, function(this: CustomWorld, phaseName: GamePhaseName): void {
  expect(this.lastGameHistoryRecord.phase.name).toBe(phaseName);
});

Then(/^the game's phase tick from the previous history record should be (?<tick>\d)$/u, function(this: CustomWorld, tick: string): void {
  expect(this.lastGameHistoryRecord.phase.tick).toBe(parseInt(tick));
});

Then(/^the play's type from the previous history record should be (?<type>.+)$/u, function(this: CustomWorld, type: GamePlayType): void {
  expect(this.lastGameHistoryRecord.play.type).toBe(type);
});

Then(/^the play's action from the previous history record should be (?<action>.+)$/u, function(this: CustomWorld, action: GamePlayAction): void {
  expect(this.lastGameHistoryRecord.play.action).toBe(action);
});

Then(/^the play's source name from the previous history record should be (?<sourceName>.+)$/u, function(this: CustomWorld, sourceName: GamePlaySourceName): void {
  expect(this.lastGameHistoryRecord.play.source.name).toBe(sourceName);
});

Then(/^the play's source players from the previous history record should be the following players$/u, function(this: CustomWorld, expectedSourcePlayersDatatable: DataTable): void {
  const players = convertDatatableToPlayers(expectedSourcePlayersDatatable.rows(), this.gameOnPreviousGamePlay);

  expect(this.lastGameHistoryRecord.play.source.players).toStrictEqual(players);
});

Then(/^the play's source players from the previous history record should not have interactions$/u, function(this: CustomWorld): void {
  expect(this.lastGameHistoryRecord.play.source.interactions).toBeUndefined();
});

Then(/^the play's source players from the previous history record should have the following interactions$/u, function(this: CustomWorld, expectedInteractionsDatatable: DataTable): void {
  const expectedInteractions = convertDatatableToGamePlaySourceInteractions(expectedInteractionsDatatable.rows());
  const interactions = this.lastGameHistoryRecord.play.source.interactions;

  expect(interactions?.length).toBe(expectedInteractions.length);
  expectedInteractions.forEach(expectedInteraction => {
    const existingInteraction = interactions?.find(interaction => interaction.type === expectedInteraction.type);
    expect(existingInteraction).toBeDefined();
    expect(existingInteraction?.source).toBe(expectedInteraction.source);
    expect(existingInteraction?.boundaries).toStrictEqual(expectedInteraction.boundaries);
  });
});

Then(/^the play's source interaction from the previous history with type (?<type>.+?) should have the following eligible targets$/u, function(this: CustomWorld, interactionType: PlayerInteractionType, expectedEligibleTargetsDatatable: DataTable): void {
  const expectedEligibleTargets = convertDatatableToPlayers(expectedEligibleTargetsDatatable.rows(), this.gameOnPreviousGamePlay);
  const interaction = this.lastGameHistoryRecord.play.source.interactions?.find(({ type }) => type === interactionType);

  expect(interaction?.eligibleTargets).toStrictEqual(expectedEligibleTargets);
});

Then(/^the play's source interaction from the previous history with type (?<type>.+?) should be inconsequential$/u, function(this: CustomWorld, interactionType: PlayerInteractionType): void {
  const interaction = this.lastGameHistoryRecord.play.source.interactions?.find(({ type }) => type === interactionType);

  expect(interaction?.isInconsequential).toBe(true);
});

Then(/^the play's source interaction from the previous history with type (?<type>.+?) should have consequences$/u, function(this: CustomWorld, interactionType: PlayerInteractionType): void {
  const interaction = this.lastGameHistoryRecord.play.source.interactions?.find(({ type }) => type === interactionType);

  expect(interaction?.isInconsequential).toBeUndefined();
});

Then(/^the play's causes from the previous history record should be the following causes$/u, function(this: CustomWorld, expectedCausesDatatable: DataTable): void {
  const expectedCauses = expectedCausesDatatable.rows().flatMap(row => row);

  expect(this.lastGameHistoryRecord.play.causes).toStrictEqual(expectedCauses);
});

Then(/^the play's causes from the previous history record should not have causes$/u, function(this: CustomWorld): void {
  expect(this.lastGameHistoryRecord.play.causes).toBeUndefined();
});

Then(/^the play's targets from the previous history record should be the following players$/u, function(this: CustomWorld, expectedTargetsDatatable: DataTable): void {
  const players = convertDatatableToPlayers(expectedTargetsDatatable.rows(), this.gameOnPreviousGamePlay);

  expect(this.lastGameHistoryRecord.play.targets?.map(({ player }) => player)).toStrictEqual(players);
});

Then(/^the play's targets from the previous history record should be undefined$/u, function(this: CustomWorld): void {
  expect(this.lastGameHistoryRecord.play.targets).toBeUndefined();
});

Then(/^the play's target named (?<name>.+?) from the previous history record should have drunk the (?<potion>life|death) potion$/u, function(this: CustomWorld, playerName: string, potion: WitchPotion): void {
  const target = this.lastGameHistoryRecord.play.targets?.find(({ player }) => player.name === playerName);

  expect(target?.drankPotion).toBe(potion);
});

Then(/^the play's votes from the previous history record should be the following votes$/u, function(this: CustomWorld, expectedVotesDatatable: DataTable): void {
  const votes = convertDatatableToGameHistoryRecordPlayVotes(expectedVotesDatatable.rows(), this.gameOnPreviousGamePlay);

  expect(this.lastGameHistoryRecord.play.votes).toStrictEqual(votes);
});

Then(/^the play's votes from the previous history record should be undefined$/u, function(this: CustomWorld): void {
  expect(this.lastGameHistoryRecord.play.votes).toBeUndefined();
});

Then(/^the play's voting result from the previous history record should be (?<votingResult>sheriff-election|tie|death|inconsequential|skipped)$/u, function(this: CustomWorld, votingResult: GameHistoryRecordVotingResult): void {
  expect(this.lastGameHistoryRecord.play.voting?.result).toBe(votingResult);
});

Then(/^the play's voting result from the previous history record should be undefined$/u, function(this: CustomWorld): void {
  expect(this.lastGameHistoryRecord.play.voting?.result).toBeUndefined();
});

Then(/^the play's from the previous history record should (?<isNotRequested>not )?have the stuttering judge request$/u, function(this: CustomWorld, notRequested: string | null): void {
  expect(this.lastGameHistoryRecord.play.didJudgeRequestAnotherVote).toBe(notRequested === null ? true : undefined);
});

Then(/^the play's nominated players from votes of the previous history record should be the following players$/u, function(this: CustomWorld, expectedNominatedPlayersDatatable: DataTable): void {
  const nominatedPlayers = convertDatatableToPlayers(expectedNominatedPlayersDatatable.rows(), this.gameOnPreviousGamePlay);

  expect(this.lastGameHistoryRecord.play.voting?.nominatedPlayers).toStrictEqual(nominatedPlayers);
});

Then(/^the play's chosen card from the previous history record should be the card with role (?<cardRole>.+)$/u, function(this: CustomWorld, cardRole: RoleName): void {
  const chosenCard = this.gameOnPreviousGamePlay.additionalCards?.find(({ roleName }) => roleName === cardRole);

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