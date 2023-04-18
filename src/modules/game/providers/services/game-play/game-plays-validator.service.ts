import { Injectable } from "@nestjs/common";
import { BAD_GAME_PLAY_PAYLOAD_REASONS } from "../../../../../shared/error/enums/bad-game-play-payload-error.enum";
import { BadGamePlayPayloadError } from "../../../../../shared/error/types/bad-game-play-payload-error.type";
import { ROLE_NAMES } from "../../../../role/enums/role.enum";
import { requiredTargetsActions, requiredVotesActions, stutteringJudgeRequestOpportunityActions } from "../../../constants/game-play.constant";
import type { MakeGamePlayTargetWithRelationsDto } from "../../../dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import type { MakeGamePlayVoteWithRelationsDto } from "../../../dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import type { MakeGamePlayWithRelationsDto } from "../../../dto/make-game-play/make-game-play-with-relations.dto";
import { GAME_PLAY_ACTIONS, WITCH_POTIONS } from "../../../enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES } from "../../../enums/player.enum";
import { getPlayerWithCurrentRole, getUpcomingGamePlayAction } from "../../../helpers/game.helper";
import { doesPlayerHaveAttribute, isPlayerAliveAndPowerful } from "../../../helpers/player/player.helper";
import type { GameHistoryRecord } from "../../../schemas/game-history-record/game-history-record.schema";
import type { Game } from "../../../schemas/game.schema";
import { GameHistoryRecordService } from "../game-history/game-history-record.service";

@Injectable()
export class GamePlaysValidatorService {
  public constructor(private readonly gameHistoryRecordService: GameHistoryRecordService) {}

  public validateGamePlayWithRelationsDtoChosenCardData(makeGamePlayWithRelationsDto: MakeGamePlayWithRelationsDto, game: Game): void {
    const { chosenCard } = makeGamePlayWithRelationsDto;
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (!chosenCard) {
      if (upcomingGamePlayAction === GAME_PLAY_ACTIONS.CHOOSE_CARD) {
        throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.REQUIRED_CHOSEN_CARD);
      }
      return;
    }
    if (upcomingGamePlayAction !== GAME_PLAY_ACTIONS.CHOOSE_CARD) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_CHOSEN_CARD);
    }
  }

  public validateDrankLifePotionTargets(drankLifePotionTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    if (drankLifePotionTargets.length > 1) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.TOO_MUCH_DRANK_LIFE_POTION_TARGETS);
    }
    if (drankLifePotionTargets.length && (!doesPlayerHaveAttribute(drankLifePotionTargets[0].player, PLAYER_ATTRIBUTE_NAMES.EATEN) || !drankLifePotionTargets[0].player.isAlive)) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_LIFE_POTION_TARGET);
    }
  }

  public validateDrankDeathPotionTargets(drankDeathPotionTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    if (drankDeathPotionTargets.length > 1) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.TOO_MUCH_DRANK_DEATH_POTION_TARGETS);
    }
    if (drankDeathPotionTargets.length && !drankDeathPotionTargets[0].player.isAlive) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_DEATH_POTION_TARGET);
    }
  }

  public validateGamePlayTargetsWithRelationsDtoDrankPotionData(
    makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[],
    game: Game,
    gameHistoryRecords: GameHistoryRecord[],
  ): void {
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    const drankPotionTargets = makeGamePlayTargetsWithRelationsDto.filter(({ drankPotion }) => drankPotion !== undefined);
    const hasWitchUsedLifePotion = gameHistoryRecords.some(record => record.play.targets?.some(({ drankPotion }) => drankPotion === WITCH_POTIONS.LIFE));
    const drankLifePotionTargets = drankPotionTargets.filter(({ drankPotion }) => drankPotion === WITCH_POTIONS.LIFE);
    const hasWitchUsedDeathPotion = gameHistoryRecords.some(record => record.play.targets?.some(({ drankPotion }) => drankPotion === WITCH_POTIONS.DEATH));
    const drankDeathPotionTargets = drankPotionTargets.filter(({ drankPotion }) => drankPotion === WITCH_POTIONS.DEATH);
    if (upcomingGamePlayAction !== GAME_PLAY_ACTIONS.USE_POTIONS && drankPotionTargets.length ||
        hasWitchUsedLifePotion && drankLifePotionTargets.length || hasWitchUsedDeathPotion && drankDeathPotionTargets.length) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_DRANK_POTION_TARGET);
    }
    this.validateDrankLifePotionTargets(drankLifePotionTargets);
    this.validateDrankDeathPotionTargets(drankDeathPotionTargets);
  }

  public validateGamePlayTargetsWithRelationsDtoIsInfectedData(
    makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[],
    game: Game,
    gameHistoryRecords: GameHistoryRecord[],
  ): void {
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    const infectedTargets = makeGamePlayTargetsWithRelationsDto.filter(({ isInfected }) => isInfected === true);
    const hasVileFatherOfWolvesInfected = gameHistoryRecords.some(record => record.play.targets?.some(({ isInfected }) => isInfected));
    if (infectedTargets.length) {
      if (upcomingGamePlayAction !== GAME_PLAY_ACTIONS.EAT || hasVileFatherOfWolvesInfected) {
        throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_INFECTED_TARGET);
      }
      if (infectedTargets.length > 1) {
        throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.TOO_MUCH_INFECTED_TARGETS);
      }
    }
  }

  public validateGamePlayTargetsWithRelationsDtoData(
    makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] | undefined,
    game: Game,
    gameHistoryRecords: GameHistoryRecord[],
  ): void {
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (!upcomingGamePlayAction) {
      return;
    }
    if (makeGamePlayTargetsWithRelationsDto === undefined || !makeGamePlayTargetsWithRelationsDto.length) {
      if (requiredTargetsActions.includes(upcomingGamePlayAction)) {
        throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.REQUIRED_TARGETS);
      }
      return;
    }
    if (!requiredTargetsActions.includes(upcomingGamePlayAction)) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_TARGETS);
    }
    this.validateGamePlayTargetsWithRelationsDtoIsInfectedData(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords);
    this.validateGamePlayTargetsWithRelationsDtoDrankPotionData(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords);
  }

  public validateGamePlayVotesWithRelationsDtoData(makeGamePlayVotesWithRelationsDto: MakeGamePlayVoteWithRelationsDto[] | undefined, game: Game): void {
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (!upcomingGamePlayAction) {
      return;
    }
    if (makeGamePlayVotesWithRelationsDto === undefined || !makeGamePlayVotesWithRelationsDto.length) {
      if (requiredVotesActions.includes(upcomingGamePlayAction)) {
        throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.REQUIRED_VOTES);
      }
      return;
    }
    if (!requiredVotesActions.includes(upcomingGamePlayAction)) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_VOTES);
    }
    if (makeGamePlayVotesWithRelationsDto.some(({ source, target }) => source._id === target._id)) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.SAME_SOURCE_AND_TARGET_VOTE);
    }
  }

  public validateGamePlayWithRelationsDtoChosenSideData(makeGamePlayWithRelationsDto: MakeGamePlayWithRelationsDto, game: Game): void {
    const { chosenSide } = makeGamePlayWithRelationsDto;
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (!upcomingGamePlayAction) {
      return;
    }
    if (chosenSide && upcomingGamePlayAction !== GAME_PLAY_ACTIONS.CHOOSE_SIDE) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_CHOSEN_SIDE);
    }
  }

  public validateGamePlayWithRelationsDtoJudgeRequestData(makeGamePlayWithRelationsDto: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords: GameHistoryRecord[]): void {
    const { doesJudgeRequestAnotherVote } = makeGamePlayWithRelationsDto;
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (!upcomingGamePlayAction) {
      return;
    }
    const { voteRequestsCount } = game.options.roles.stutteringJudge;
    const gameHistoryJudgeRequestRecords = gameHistoryRecords.filter(record => record.play.didJudgeRequestAnotherVote);
    const stutteringJudgePlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.STUTTERING_JUDGE);
    if (doesJudgeRequestAnotherVote !== undefined &&
      (!stutteringJudgeRequestOpportunityActions.includes(upcomingGamePlayAction) ||
        !stutteringJudgePlayer || !isPlayerAliveAndPowerful(stutteringJudgePlayer)) ||
        gameHistoryJudgeRequestRecords.length >= voteRequestsCount) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_STUTTERING_JUDGE_VOTE_REQUEST);
    }
  }

  public async validateGamePlayWithRelationsDtoData(makeGamePlayWithRelationsDto: MakeGamePlayWithRelationsDto, game: Game): Promise<void> {
    const { votes, targets } = makeGamePlayWithRelationsDto;
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (!upcomingGamePlayAction) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.NO_UPCOMING_GAME_PLAY);
    }
    const gameHistoryRecords = await this.gameHistoryRecordService.getGameHistoryRecordsByGameId(game._id);
    this.validateGamePlayWithRelationsDtoJudgeRequestData(makeGamePlayWithRelationsDto, game, gameHistoryRecords);
    this.validateGamePlayWithRelationsDtoChosenSideData(makeGamePlayWithRelationsDto, game);
    this.validateGamePlayVotesWithRelationsDtoData(votes, game);
    this.validateGamePlayTargetsWithRelationsDtoData(targets, game, gameHistoryRecords);
    this.validateGamePlayWithRelationsDtoChosenCardData(makeGamePlayWithRelationsDto, game);
  }
}