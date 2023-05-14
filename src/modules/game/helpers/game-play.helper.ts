import { plainToInstance } from "class-transformer";
import { API_RESOURCES } from "../../../shared/api/enums/api.enum";
import { RESOURCE_NOT_FOUND_REASONS } from "../../../shared/exception/enums/resource-not-found-error.enum";
import { ResourceNotFoundException } from "../../../shared/exception/types/resource-not-found-exception.type";
import { plainToInstanceDefaultOptions } from "../../../shared/validation/constants/validation.constant";
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
      throw new ResourceNotFoundException(API_RESOURCES.PLAYERS, vote.sourceId.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_PLAYER_VOTE_SOURCE);
    }
    if (target === undefined) {
      throw new ResourceNotFoundException(API_RESOURCES.PLAYERS, vote.targetId.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_PLAYER_VOTE_TARGET);
    }
    const plainToInstanceOptions = { ...plainToInstanceDefaultOptions, excludeExtraneousValues: true };
    const voteWithRelations = plainToInstance(MakeGamePlayVoteWithRelationsDto, { ...vote, source, target }, plainToInstanceOptions);
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
      throw new ResourceNotFoundException(API_RESOURCES.PLAYERS, target.playerId.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_PLAYER_TARGET);
    }
    const plainToInstanceOptions = { ...plainToInstanceDefaultOptions, excludeExtraneousValues: true };
    const targetWithRelations = plainToInstance(MakeGamePlayTargetWithRelationsDto, { ...target, player }, plainToInstanceOptions);
    return [...acc, targetWithRelations];
  }, []);
}

function getChosenCardFromMakeGamePlayDto(makeGamePlayDto: MakeGamePlayDto, game: Game): GameAdditionalCard | undefined {
  if (makeGamePlayDto.chosenCardId === undefined) {
    return;
  }
  const chosenCard = getAdditionalCardWithId(game.additionalCards, makeGamePlayDto.chosenCardId);
  if (chosenCard === undefined) {
    throw new ResourceNotFoundException(API_RESOURCES.GAME_ADDITIONAL_CARDS, makeGamePlayDto.chosenCardId.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_CHOSEN_CARD);
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
  }, { ...plainToInstanceDefaultOptions, excludeExtraneousValues: true });
}

export {
  getVotesWithRelationsFromMakeGamePlayDto,
  getTargetsWithRelationsFromMakeGamePlayDto,
  getChosenCardFromMakeGamePlayDto,
  createMakeGamePlayDtoWithRelations,
};