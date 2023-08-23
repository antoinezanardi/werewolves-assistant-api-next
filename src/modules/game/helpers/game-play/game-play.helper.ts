import { plainToInstance } from "class-transformer";
import { API_RESOURCES } from "../../../../shared/api/enums/api.enum";
import { RESOURCE_NOT_FOUND_REASONS } from "../../../../shared/exception/enums/resource-not-found-error.enum";
import { ResourceNotFoundException } from "../../../../shared/exception/types/resource-not-found-exception.type";
import { plainToInstanceDefaultOptions } from "../../../../shared/validation/constants/validation.constant";
import { gamePlaysPriorityList } from "../../constants/game-play/game-play.constant";
import { MakeGamePlayTargetWithRelationsDto } from "../../dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import { MakeGamePlayVoteWithRelationsDto } from "../../dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import { MakeGamePlayWithRelationsDto } from "../../dto/make-game-play/make-game-play-with-relations.dto";
import type { MakeGamePlayDto } from "../../dto/make-game-play/make-game-play.dto";
import type { GameAdditionalCard } from "../../schemas/game-additional-card/game-additional-card.schema";
import type { GamePlay } from "../../schemas/game-play/game-play.schema";
import type { Game } from "../../schemas/game.schema";
import { getAdditionalCardWithId, getPlayerWithId } from "../game.helper";

function getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto: MakeGamePlayDto, game: Game): MakeGamePlayVoteWithRelationsDto[] | undefined {
  if (makeGamePlayDto.votes === undefined) {
    return;
  }
  return makeGamePlayDto.votes.reduce<MakeGamePlayVoteWithRelationsDto[]>((acc, vote) => {
    const source = getPlayerWithId(game, vote.sourceId);
    const target = getPlayerWithId(game, vote.targetId);
    if (source === undefined) {
      throw new ResourceNotFoundException(API_RESOURCES.PLAYERS, vote.sourceId.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_PLAYER_VOTE_SOURCE);
    }
    if (target === undefined) {
      throw new ResourceNotFoundException(API_RESOURCES.PLAYERS, vote.targetId.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_PLAYER_VOTE_TARGET);
    }
    const plainToInstanceOptions = { ...plainToInstanceDefaultOptions, excludeExtraneousValues: true };
    const voteWithRelations = plainToInstance(MakeGamePlayVoteWithRelationsDto, vote, plainToInstanceOptions);
    voteWithRelations.source = source;
    voteWithRelations.target = target;
    return [...acc, voteWithRelations];
  }, []);
}

function getTargetsWithRelationsFromMakeGamePlayDto(makeGamePlayDto: MakeGamePlayDto, game: Game): MakeGamePlayTargetWithRelationsDto[] | undefined {
  if (makeGamePlayDto.targets === undefined) {
    return;
  }
  return makeGamePlayDto.targets.reduce<MakeGamePlayTargetWithRelationsDto[]>((acc, target) => {
    const player = getPlayerWithId(game, target.playerId);
    if (player === undefined) {
      throw new ResourceNotFoundException(API_RESOURCES.PLAYERS, target.playerId.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_PLAYER_TARGET);
    }
    const plainToInstanceOptions = { ...plainToInstanceDefaultOptions, excludeExtraneousValues: true };
    const targetWithRelations = plainToInstance(MakeGamePlayTargetWithRelationsDto, target, plainToInstanceOptions);
    targetWithRelations.player = player;
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
  const makeGamePlayWithRelationsDto = plainToInstance(MakeGamePlayWithRelationsDto, makeGamePlayDto, { ...plainToInstanceDefaultOptions, excludeExtraneousValues: true });
  makeGamePlayWithRelationsDto.chosenCard = chosenCard;
  makeGamePlayWithRelationsDto.targets = targets;
  makeGamePlayWithRelationsDto.votes = votes;
  return makeGamePlayWithRelationsDto;
}

function findPlayPriorityIndex(play: GamePlay): number {
  return gamePlaysPriorityList.findIndex(playInPriorityList => {
    const { source, action, cause } = playInPriorityList;
    return source.name === play.source.name && action === play.action && cause === play.cause;
  });
}

function areGamePlaysEqual(playA: GamePlay, playB: GamePlay): boolean {
  return playA.action === playB.action && playA.cause === playB.cause && playA.source.name === playB.source.name;
}

export {
  getVotesWithRelationsFromMakeGamePlayDto,
  getTargetsWithRelationsFromMakeGamePlayDto,
  getChosenCardFromMakeGamePlayDto,
  createMakeGamePlayDtoWithRelations,
  findPlayPriorityIndex,
  areGamePlaysEqual,
};