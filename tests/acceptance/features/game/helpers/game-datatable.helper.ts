import { plainToInstance } from "class-transformer";

import type { GameHistoryRecordPlayVote } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-vote/game-history-record-play-vote.schema";
import { CreateGamePlayerDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import type { MakeGamePlayVoteDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote.dto";
import { getPlayerWithNameOrThrow } from "@/modules/game/helpers/game.helper";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function convertDatatableToMakeGameplayVotes(datatable: string[][], game: Game): MakeGamePlayVoteDto[] {
  return datatable.map(([voterName, targetName]) => {
    const voter = getPlayerWithNameOrThrow(voterName, game, new Error(`Player with name ${voterName} not found`));
    const target = getPlayerWithNameOrThrow(targetName, game, new Error(`Player with name ${targetName} not found`));
    return { sourceId: voter._id, targetId: target._id } as MakeGamePlayVoteDto;
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

function convertDatatableToCreateGamePlayersDto(datatable: string[][]): CreateGamePlayerDto[] {
  return datatable.map(([playerName, playerRole]) => plainToInstance(CreateGamePlayerDto, {
    name: playerName,
    role: { name: playerRole },
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS));
}

export {
  convertDatatableToMakeGameplayVotes,
  convertDatatableToGameHistoryRecordPlayVotes,
  convertDatatableToPlayers,
  convertDatatableToCreateGamePlayersDto,
};