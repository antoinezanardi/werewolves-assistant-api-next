import { plainToInstance } from "class-transformer";
import type { Types } from "mongoose";

import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play.types";
import { GAME_PLAYS_PRIORITY_LIST } from "@/modules/game/constants/game.constants";
import { MakeGamePlayTargetWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import { MakeGamePlayVoteWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import { MakeGamePlayWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import type { MakeGamePlayDto } from "@/modules/game/dto/make-game-play/make-game-play.dto";
import type { PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { getAdditionalCardWithId, getGroupOfPlayers, getPlayerWithId } from "@/modules/game/helpers/game.helpers";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";

import { ApiResources } from "@/shared/api/enums/api.enum";
import { ResourceNotFoundReasons } from "@/shared/exception/enums/resource-not-found-error.enum";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.types";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto: MakeGamePlayDto, game: Game): MakeGamePlayVoteWithRelationsDto[] | undefined {
  if (makeGamePlayDto.votes === undefined) {
    return;
  }
  return makeGamePlayDto.votes.reduce<MakeGamePlayVoteWithRelationsDto[]>((acc, vote) => {
    const source = getPlayerWithId(game, vote.sourceId);
    const target = getPlayerWithId(game, vote.targetId);
    if (source === undefined) {
      throw new ResourceNotFoundException(ApiResources.PLAYERS, vote.sourceId.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_VOTE_SOURCE);
    }
    if (target === undefined) {
      throw new ResourceNotFoundException(ApiResources.PLAYERS, vote.targetId.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_VOTE_TARGET);
    }
    const plainToInstanceOptions = { ...DEFAULT_PLAIN_TO_INSTANCE_OPTIONS, excludeExtraneousValues: true };
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
      throw new ResourceNotFoundException(ApiResources.PLAYERS, target.playerId.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_TARGET);
    }
    const plainToInstanceOptions = { ...DEFAULT_PLAIN_TO_INSTANCE_OPTIONS, excludeExtraneousValues: true };
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
    throw new ResourceNotFoundException(ApiResources.GAME_ADDITIONAL_CARDS, makeGamePlayDto.chosenCardId.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_CHOSEN_CARD);
  }
  return chosenCard;
}

function createMakeGamePlayDtoWithRelations(makeGamePlayDto: MakeGamePlayDto, game: Game): MakeGamePlayWithRelationsDto {
  const chosenCard = getChosenCardFromMakeGamePlayDto(makeGamePlayDto, game);
  const targets = getTargetsWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game);
  const votes = getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game);
  const makeGamePlayWithRelationsDto = plainToInstance(MakeGamePlayWithRelationsDto, makeGamePlayDto, { ...DEFAULT_PLAIN_TO_INSTANCE_OPTIONS, excludeExtraneousValues: true });
  makeGamePlayWithRelationsDto.chosenCard = chosenCard;
  makeGamePlayWithRelationsDto.targets = targets;
  makeGamePlayWithRelationsDto.votes = votes;
  return makeGamePlayWithRelationsDto;
}

function findPlayPriorityIndex(play: GamePlay): number {
  return GAME_PLAYS_PRIORITY_LIST.findIndex(playInPriorityList => {
    const { source, action, cause } = playInPriorityList;
    return source.name === play.source.name && action === play.action && cause === play.cause;
  });
}

function areGamePlaysEqual(playA: GamePlay, playB: GamePlay): boolean {
  return playA.action === playB.action && playA.cause === playB.cause && playA.source.name === playB.source.name;
}

function canSurvivorsVote(game: Game): boolean {
  const survivors = getGroupOfPlayers(game, PlayerGroups.SURVIVORS);
  return survivors.some(player => !doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.CANT_VOTE, game));
}

function isPlayerInteractableInCurrentGamePlay(playerId: Types.ObjectId, game: GameWithCurrentPlay): boolean {
  const { interactions } = game.currentPlay.source;
  return !!interactions?.find(({ eligibleTargets }) => eligibleTargets.find(({ _id }) => _id.equals(playerId)));
}

function isPlayerInteractableWithInteractionTypeInCurrentGamePlay(playerId: Types.ObjectId, interactionType: PlayerInteractionTypes, game: GameWithCurrentPlay): boolean {
  const { interactions } = game.currentPlay.source;
  const interaction = interactions?.find(({ type }) => type === interactionType);
  return !!interaction?.eligibleTargets.find(({ _id }) => _id.equals(playerId));
}

export {
  getVotesWithRelationsFromMakeGamePlayDto,
  getTargetsWithRelationsFromMakeGamePlayDto,
  getChosenCardFromMakeGamePlayDto,
  createMakeGamePlayDtoWithRelations,
  findPlayPriorityIndex,
  areGamePlaysEqual,
  canSurvivorsVote,
  isPlayerInteractableInCurrentGamePlay,
  isPlayerInteractableWithInteractionTypeInCurrentGamePlay,
};