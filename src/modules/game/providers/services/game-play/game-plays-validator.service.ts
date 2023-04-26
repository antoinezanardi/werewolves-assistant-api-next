import { Injectable } from "@nestjs/common";
import { BAD_GAME_PLAY_PAYLOAD_REASONS } from "../../../../../shared/error/enums/bad-game-play-payload-error.enum";
import { BadGamePlayPayloadError } from "../../../../../shared/error/types/bad-game-play-payload-error.type";
import { ROLE_NAMES } from "../../../../role/enums/role.enum";
import { optionalTargetsActions, requiredTargetsActions, requiredVotesActions, stutteringJudgeRequestOpportunityActions } from "../../../constants/game-play.constant";
import type { MakeGamePlayTargetWithRelationsDto } from "../../../dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import type { MakeGamePlayVoteWithRelationsDto } from "../../../dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import type { MakeGamePlayWithRelationsDto } from "../../../dto/make-game-play/make-game-play-with-relations.dto";
import { GAME_PLAY_ACTIONS, WITCH_POTIONS } from "../../../enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../enums/player.enum";
import { getLastGamePlayFromHistory, getLastGamePlayTieInVotesFromHistory } from "../../../helpers/game-history-record.helper";
import { getLeftToCharmByPiedPiperPlayers, getPlayerWithCurrentRole, getUpcomingGamePlay, getUpcomingGamePlayAction, getUpcomingGamePlaySource } from "../../../helpers/game.helper";
import { doesPlayerHaveAttribute, isPlayerAliveAndPowerful, isPlayerOnVillagersSide, isPlayerOnWerewolvesSide } from "../../../helpers/player/player.helper";
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

  public validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game, gameHistoryRecords: GameHistoryRecord[]): void {
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    const upcomingGamePlaySource = getUpcomingGamePlaySource(game.upcomingPlays);
    const drankPotionTargets = makeGamePlayTargetsWithRelationsDto.filter(({ drankPotion }) => drankPotion !== undefined);
    const hasWitchUsedLifePotion = gameHistoryRecords.some(record => record.play.targets?.some(({ drankPotion }) => drankPotion === WITCH_POTIONS.LIFE));
    const drankLifePotionTargets = drankPotionTargets.filter(({ drankPotion }) => drankPotion === WITCH_POTIONS.LIFE);
    const hasWitchUsedDeathPotion = gameHistoryRecords.some(record => record.play.targets?.some(({ drankPotion }) => drankPotion === WITCH_POTIONS.DEATH));
    const drankDeathPotionTargets = drankPotionTargets.filter(({ drankPotion }) => drankPotion === WITCH_POTIONS.DEATH);
    if ((upcomingGamePlayAction !== GAME_PLAY_ACTIONS.USE_POTIONS || upcomingGamePlaySource !== ROLE_NAMES.WITCH) && drankPotionTargets.length ||
        hasWitchUsedLifePotion && drankLifePotionTargets.length || hasWitchUsedDeathPotion && drankDeathPotionTargets.length) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_DRANK_POTION_TARGET);
    }
    this.validateDrankLifePotionTargets(drankLifePotionTargets);
    this.validateDrankDeathPotionTargets(drankDeathPotionTargets);
  }

  public validateGamePlayInfectedTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game, gameHistoryRecords: GameHistoryRecord[]): void {
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    const upcomingGamePlaySource = getUpcomingGamePlaySource(game.upcomingPlays);
    const infectedTargets = makeGamePlayTargetsWithRelationsDto.filter(({ isInfected }) => isInfected === true);
    const hasVileFatherOfWolvesInfected = gameHistoryRecords.some(record => record.play.targets?.some(({ isInfected }) => isInfected));
    const vileFatherOfWolvesPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.VILE_FATHER_OF_WOLVES);
    if (infectedTargets.length) {
      if (upcomingGamePlayAction !== GAME_PLAY_ACTIONS.EAT || upcomingGamePlaySource !== PLAYER_GROUPS.WEREWOLVES || !vileFatherOfWolvesPlayer ||
        !isPlayerAliveAndPowerful(vileFatherOfWolvesPlayer) || hasVileFatherOfWolvesInfected) {
        throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_INFECTED_TARGET);
      }
      this.validateGamePlayTargetsBoundaries(infectedTargets, { min: 1, max: 1 });
    }
  }

  public validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    const upcomingGamePlaySource = getUpcomingGamePlaySource(game.upcomingPlays);
    if (upcomingGamePlayAction !== GAME_PLAY_ACTIONS.EAT) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    const targetedPlayer = makeGamePlayTargetsWithRelationsDto[0].player;
    if (upcomingGamePlaySource === PLAYER_GROUPS.WEREWOLVES && (!targetedPlayer.isAlive || !isPlayerOnVillagersSide(targetedPlayer))) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_WEREWOLVES_TARGET);
    }
    if (upcomingGamePlaySource === ROLE_NAMES.BIG_BAD_WOLF &&
      (!targetedPlayer.isAlive || !isPlayerOnVillagersSide(targetedPlayer) || doesPlayerHaveAttribute(targetedPlayer, PLAYER_ATTRIBUTE_NAMES.EATEN))) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_BIG_BAD_WOLF_TARGET);
    }
    const whiteWerewolfPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.WHITE_WEREWOLF);
    if (upcomingGamePlaySource === ROLE_NAMES.WHITE_WEREWOLF && (!targetedPlayer.isAlive || !isPlayerOnWerewolvesSide(targetedPlayer) ||
      whiteWerewolfPlayer?._id === targetedPlayer._id)) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_WHITE_WEREWOLF_TARGET);
    }
  }

  public validateGamePlayHunterTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    const upcomingGamePlaySource = getUpcomingGamePlaySource(game.upcomingPlays);
    if (upcomingGamePlayAction !== GAME_PLAY_ACTIONS.SHOOT || upcomingGamePlaySource !== ROLE_NAMES.HUNTER) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    const targetedPlayer = makeGamePlayTargetsWithRelationsDto[0].player;
    if (!targetedPlayer.isAlive) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_HUNTER_TARGET);
    }
  }

  public validateGamePlayScapegoatTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    const upcomingGamePlaySource = getUpcomingGamePlaySource(game.upcomingPlays);
    if (upcomingGamePlayAction !== GAME_PLAY_ACTIONS.BAN_VOTING || upcomingGamePlaySource !== ROLE_NAMES.SCAPEGOAT) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 0, max: game.players.length });
    if (makeGamePlayTargetsWithRelationsDto.some(({ player }) => !player.isAlive)) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_SCAPEGOAT_TARGETS);
    }
  }

  public validateGamePlayCupidTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    const upcomingGamePlaySource = getUpcomingGamePlaySource(game.upcomingPlays);
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (upcomingGamePlaySource !== ROLE_NAMES.CUPID || upcomingGamePlayAction !== GAME_PLAY_ACTIONS.CHARM) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 2, max: 2 });
    if (makeGamePlayTargetsWithRelationsDto.some(({ player }) => !player.isAlive)) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_CUPID_TARGETS);
    }
  }

  public validateGamePlayFoxTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    const upcomingGamePlaySource = getUpcomingGamePlaySource(game.upcomingPlays);
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (upcomingGamePlaySource !== ROLE_NAMES.FOX || upcomingGamePlayAction !== GAME_PLAY_ACTIONS.SNIFF) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 0, max: 1 });
    const targetedPlayer = makeGamePlayTargetsWithRelationsDto[0].player;
    if (!targetedPlayer.isAlive) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_FOX_TARGET);
    }
  }

  public validateGamePlaySeerTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    const upcomingGamePlaySource = getUpcomingGamePlaySource(game.upcomingPlays);
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (upcomingGamePlaySource !== ROLE_NAMES.SEER || upcomingGamePlayAction !== GAME_PLAY_ACTIONS.LOOK) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    const seerPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.SEER);
    const targetedPlayer = makeGamePlayTargetsWithRelationsDto[0].player;
    if (!targetedPlayer.isAlive || targetedPlayer._id === seerPlayer?._id) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_SEER_TARGET);
    }
  }

  public validateGamePlayRavenTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    const upcomingGamePlaySource = getUpcomingGamePlaySource(game.upcomingPlays);
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (upcomingGamePlaySource !== ROLE_NAMES.RAVEN || upcomingGamePlayAction !== GAME_PLAY_ACTIONS.MARK) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 0, max: 1 });
    if (makeGamePlayTargetsWithRelationsDto.length && !makeGamePlayTargetsWithRelationsDto[0].player.isAlive) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_RAVEN_TARGET);
    }
  }

  public validateGamePlayWildChildTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    const upcomingGamePlaySource = getUpcomingGamePlaySource(game.upcomingPlays);
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (upcomingGamePlaySource !== ROLE_NAMES.WILD_CHILD || upcomingGamePlayAction !== GAME_PLAY_ACTIONS.CHOOSE_MODEL) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    const wildChildPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.WILD_CHILD);
    const targetedPlayer = makeGamePlayTargetsWithRelationsDto[0].player;
    if (!targetedPlayer.isAlive || targetedPlayer._id === wildChildPlayer?._id) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_WILD_CHILD_TARGET);
    }
  }

  public validateGamePlayPiedPiperTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    const upcomingGamePlaySource = getUpcomingGamePlaySource(game.upcomingPlays);
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (upcomingGamePlaySource !== ROLE_NAMES.PIED_PIPER || upcomingGamePlayAction !== GAME_PLAY_ACTIONS.CHARM) {
      return;
    }
    const { charmedPeopleCountPerNight } = game.options.roles.piedPiper;
    const leftToCharmByPiedPiperPlayers = getLeftToCharmByPiedPiperPlayers(game.players);
    const leftToCharmByPiedPiperPlayersCount = leftToCharmByPiedPiperPlayers.length;
    const countToCharm = Math.min(charmedPeopleCountPerNight, leftToCharmByPiedPiperPlayersCount);
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: countToCharm, max: countToCharm });
    if (makeGamePlayTargetsWithRelationsDto.some(({ player }) => !leftToCharmByPiedPiperPlayers.find(({ _id }) => player._id === _id))) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_PIED_PIPER_TARGETS);
    }
  }

  public validateGamePlayGuardTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game, gameHistoryRecords: GameHistoryRecord[]): void {
    const upcomingGamePlaySource = getUpcomingGamePlaySource(game.upcomingPlays);
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (upcomingGamePlaySource !== ROLE_NAMES.GUARD || upcomingGamePlayAction !== GAME_PLAY_ACTIONS.PROTECT) {
      return;
    }
    const { canProtectTwice } = game.options.roles.guard;
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    const lastGuardHistoryRecord = getLastGamePlayFromHistory(gameHistoryRecords, ROLE_NAMES.GUARD, GAME_PLAY_ACTIONS.PROTECT);
    const lastProtectedPlayer = lastGuardHistoryRecord?.play.targets?.[0].player;
    const targetedPlayer = makeGamePlayTargetsWithRelationsDto[0].player;
    if (!targetedPlayer.isAlive || !canProtectTwice && lastProtectedPlayer?._id === targetedPlayer._id) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_GUARD_TARGET);
    }
  }

  public validateGamePlaySheriffTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game, gameHistoryRecords: GameHistoryRecord[]): void {
    const upcomingGamePlaySource = getUpcomingGamePlaySource(game.upcomingPlays);
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (upcomingGamePlaySource !== PLAYER_ATTRIBUTE_NAMES.SHERIFF || !upcomingGamePlayAction ||
      ![GAME_PLAY_ACTIONS.DELEGATE, GAME_PLAY_ACTIONS.SETTLE_VOTES].includes(upcomingGamePlayAction)) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    const targetedPlayer = makeGamePlayTargetsWithRelationsDto[0].player;
    const lastTieInVotesHistoryRecord = getLastGamePlayTieInVotesFromHistory(gameHistoryRecords);
    const lastTieInVotesTargets = lastTieInVotesHistoryRecord?.play.targets ?? [];
    if (upcomingGamePlayAction === GAME_PLAY_ACTIONS.DELEGATE && !targetedPlayer.isAlive) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_SHERIFF_DELEGATE_TARGET);
    }
    if (upcomingGamePlayAction === GAME_PLAY_ACTIONS.SETTLE_VOTES && !lastTieInVotesTargets.find(({ player }) => player._id === targetedPlayer._id)) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_SHERIFF_SETTLE_VOTES_TARGET);
    }
  }

  public validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], lengthBoundaries: { min: number; max: number }): void {
    if (makeGamePlayTargetsWithRelationsDto.length < lengthBoundaries.min) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.TOO_LESS_TARGETS);
    }
    if (makeGamePlayTargetsWithRelationsDto.length > lengthBoundaries.max) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.TOO_MUCH_TARGETS);
    }
  }

  public validateGamePlayRoleTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game, gameHistoryRecords: GameHistoryRecord[]): void {
    this.validateGamePlaySheriffTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords);
    this.validateGamePlayGuardTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords);
    this.validateGamePlayPiedPiperTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayWildChildTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayRavenTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlaySeerTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayFoxTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayCupidTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayScapegoatTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayHunterTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayInfectedTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords);
    this.validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords);
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
    if (![...requiredTargetsActions, ...optionalTargetsActions].includes(upcomingGamePlayAction)) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_TARGETS);
    }
    this.validateGamePlayRoleTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords);
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
    if (chosenSide && upcomingGamePlayAction !== GAME_PLAY_ACTIONS.CHOOSE_SIDE) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_CHOSEN_SIDE);
    }
    if (!chosenSide && upcomingGamePlayAction === GAME_PLAY_ACTIONS.CHOOSE_SIDE) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.REQUIRED_CHOSEN_SIDE);
    }
  }

  public validateGamePlayWithRelationsDtoJudgeRequestData(makeGamePlayWithRelationsDto: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords: GameHistoryRecord[]): void {
    const { doesJudgeRequestAnotherVote } = makeGamePlayWithRelationsDto;
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    if (!upcomingGamePlayAction || doesJudgeRequestAnotherVote === undefined) {
      return;
    }
    const { voteRequestsCount } = game.options.roles.stutteringJudge;
    const gameHistoryJudgeRequestRecords = gameHistoryRecords.filter(record => record.play.didJudgeRequestAnotherVote);
    const stutteringJudgePlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.STUTTERING_JUDGE);
    if (!stutteringJudgeRequestOpportunityActions.includes(upcomingGamePlayAction) ||
        !stutteringJudgePlayer || !isPlayerAliveAndPowerful(stutteringJudgePlayer) ||
        gameHistoryJudgeRequestRecords.length >= voteRequestsCount) {
      throw new BadGamePlayPayloadError(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_STUTTERING_JUDGE_VOTE_REQUEST);
    }
  }

  public async validateGamePlayWithRelationsDtoData(makeGamePlayWithRelationsDto: MakeGamePlayWithRelationsDto, game: Game): Promise<void> {
    const { votes, targets } = makeGamePlayWithRelationsDto;
    const upcomingGamePlay = getUpcomingGamePlay(game.upcomingPlays);
    if (!upcomingGamePlay) {
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