import { plainToInstance } from "class-transformer";

import type { GamePlaySourceInteraction } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.schema";
import type { MakeGamePlayTargetDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target.dto";
import type { GameHistoryRecordPlayVote } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-vote/game-history-record-play-vote.schema";
import { CreateGamePlayerDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import type { MakeGamePlayVoteDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote.dto";
import { getPlayerWithNameOrThrow } from "@/modules/game/helpers/game.helpers";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

const INTENTIONAL_UNKNOWN_PLAYER_NAME = "<UNKNOWN_PLAYER>";

function convertDatatableToMakeGameplayVotes(datatable: string[][], game: Game): MakeGamePlayVoteDto[] {
  return datatable.map(([voterName, targetName]) => {
    let sourceId = createFakeObjectId("acdd77c0ee96dbd2ca63acdb");
    let targetId = createFakeObjectId("fa5ec24d00ab4a5d1a7b3f71");
    if (voterName !== INTENTIONAL_UNKNOWN_PLAYER_NAME) {
      const voter = getPlayerWithNameOrThrow(voterName, game, new Error(`Player with name ${voterName} not found`));
      sourceId = voter._id;
    }
    if (targetName !== INTENTIONAL_UNKNOWN_PLAYER_NAME) {
      const target = getPlayerWithNameOrThrow(targetName, game, new Error(`Player with name ${targetName} not found`));
      targetId = target._id;
    }
    return { sourceId, targetId } as MakeGamePlayVoteDto;
  });
}

function convertDatatableToMakeGamePlayTargets(datatable: string[][], game: Game): MakeGamePlayTargetDto[] {
  return datatable.map(([targetName]) => {
    let playerId = createFakeObjectId("fa5ec24d00ab4a5d1a7b3f71");
    if (targetName !== INTENTIONAL_UNKNOWN_PLAYER_NAME) {
      const target = getPlayerWithNameOrThrow(targetName, game, new Error(`Player with name ${targetName} not found`));
      playerId = target._id;
    }
    return { playerId } as MakeGamePlayTargetDto;
  });
}

function convertDatatableToGameHistoryRecordPlayVotes(datatable: string[][], game: Game): GameHistoryRecordPlayVote[] {
  return datatable.map(([voterName, targetName]) => {
    const source = getPlayerWithNameOrThrow(voterName, game, new Error(`Player with name ${voterName} not found`));
    const target = getPlayerWithNameOrThrow(targetName, game, new Error(`Player with name ${targetName} not found`));

    return { source, target } as GameHistoryRecordPlayVote;
  });
}

function convertDatatableToPlayers(datatable: string[][], game: Game): Player[] {
  return datatable.map(([playerName]) => getPlayerWithNameOrThrow(playerName, game, new Error(`Player with name ${playerName} not found`)));
}

function convertDatatableToGamePlaySourceInteractions(datatable: string[][]): GamePlaySourceInteraction[] {
  return datatable.map(([type, source, minBoundary, maxBoundary]) => ({
    type,
    source,
    eligibleTargets: [],
    boundaries: { min: parseInt(minBoundary), max: parseInt(maxBoundary) },
  } as GamePlaySourceInteraction));
}

function convertDatatableToCreateGamePlayersDto(datatable: string[][]): CreateGamePlayerDto[] {
  return datatable.map(([playerName, playerRole, playerGroup]) => plainToInstance(CreateGamePlayerDto, {
    name: playerName,
    role: { name: playerRole },
    group: playerGroup,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS));
}

export {
  convertDatatableToMakeGameplayVotes,
  convertDatatableToMakeGamePlayTargets,
  convertDatatableToGameHistoryRecordPlayVotes,
  convertDatatableToPlayers,
  convertDatatableToGamePlaySourceInteractions,
  convertDatatableToCreateGamePlayersDto,
};