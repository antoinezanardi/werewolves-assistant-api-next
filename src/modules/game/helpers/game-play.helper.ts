import { plainToInstance } from "class-transformer";
import { API_RESOURCES } from "../../../shared/api/enums/api.enum";
import { RESOURCE_NOT_FOUND_REASONS } from "../../../shared/error/enums/resource-not-found-error.enum";
import { ResourceNotFoundError } from "../../../shared/error/types/resource-not-found-error.type";
import { MakeGamePlayTargetWithRelationsDto } from "../dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import { MakeGamePlayVoteWithRelationsDto } from "../dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import { MakeGamePlayWithRelationsDto } from "../dto/make-game-play/make-game-play-with-relations.dto";
import type { MakeGamePlayDto } from "../dto/make-game-play/make-game-play.dto";
import type { GameAdditionalCard } from "../schemas/game-additional-card/game-additional-card.schema";
import type { Game } from "../schemas/game.schema";
import { getAdditionalCardWithId, getPlayerWithId } from "./game.helper";

function getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto: MakeGamePlayDto, game: Game): MakeGamePlayVoteWithRelationsDto[] | undefined {
  if (makeGamePlayDto.votes === undefined) {
    return;
  }
  return makeGamePlayDto.votes.reduce<MakeGamePlayVoteWithRelationsDto[]>((acc, vote) => {
    const source = getPlayerWithId(game.players, vote.sourceId);
    const target = getPlayerWithId(game.players, vote.targetId);
    if (source === undefined) {
      throw new ResourceNotFoundError(API_RESOURCES.PLAYERS, vote.sourceId.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_PLAYER_VOTE_SOURCE);
    }
    if (target === undefined) {
      throw new ResourceNotFoundError(API_RESOURCES.PLAYERS, vote.targetId.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_PLAYER_VOTE_TARGET);
    }
    const voteWithRelations = plainToInstance(MakeGamePlayVoteWithRelationsDto, { ...vote, source, target }, { enableCircularCheck: true });
    return [...acc, voteWithRelations];
  }, []);
}

function getTargetsWithRelationsFromMakeGamePlayDto(makeGamePlayDto: MakeGamePlayDto, game: Game): MakeGamePlayTargetWithRelationsDto[] | undefined {
  if (makeGamePlayDto.targets === undefined) {
    return;
  }
  return makeGamePlayDto.targets.reduce<MakeGamePlayTargetWithRelationsDto[]>((acc, target) => {
    const player = getPlayerWithId(game.players, target.playerId);
    if (player === undefined) {
      throw new ResourceNotFoundError(API_RESOURCES.PLAYERS, target.playerId.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_PLAYER_TARGET);
    }
    const targetWithRelations = plainToInstance(MakeGamePlayTargetWithRelationsDto, { ...target, player }, { enableCircularCheck: true });
    return [...acc, targetWithRelations];
  }, []);
}

function getChosenCardFromMakeGamePlayDto(makeGamePlayDto: MakeGamePlayDto, game: Game): GameAdditionalCard | undefined {
  if (makeGamePlayDto.chosenCardId === undefined) {
    return;
  }
  const chosenCard = getAdditionalCardWithId(game.additionalCards, makeGamePlayDto.chosenCardId);
  if (chosenCard === undefined) {
    throw new ResourceNotFoundError(API_RESOURCES.GAME_ADDITIONAL_CARDS, makeGamePlayDto.chosenCardId.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_CHOSEN_CARD);
  }
  return chosenCard;
}

function createMakeGamePlayDtoWithRelations(makeGamePlayDto: MakeGamePlayDto, game: Game): MakeGamePlayWithRelationsDto {
  const chosenCard = getChosenCardFromMakeGamePlayDto(makeGamePlayDto, game);
  const targets = getTargetsWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game);
  const votes = getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game);
  return plainToInstance(MakeGamePlayWithRelationsDto, {
    ...makeGamePlayDto,
    chosenCard,
    targets,
    votes,
  });
}

export {
  getVotesWithRelationsFromMakeGamePlayDto,
  getTargetsWithRelationsFromMakeGamePlayDto,
  getChosenCardFromMakeGamePlayDto,
  createMakeGamePlayDtoWithRelations,
};