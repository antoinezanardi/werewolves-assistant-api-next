import { Injectable } from "@nestjs/common";
import { BAD_GAME_PLAY_PAYLOAD_REASONS } from "../../../../../shared/exception/enums/bad-game-play-payload-error.enum";
import { BadGamePlayPayloadException } from "../../../../../shared/exception/types/bad-game-play-payload-exception.type";
import { ROLE_NAMES } from "../../../../role/enums/role.enum";
import { optionalTargetsActions, requiredTargetsActions, requiredVotesActions, stutteringJudgeRequestOpportunityActions } from "../../../constants/game-play.constant";
import type { MakeGamePlayTargetWithRelationsDto } from "../../../dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import type { MakeGamePlayVoteWithRelationsDto } from "../../../dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import type { MakeGamePlayWithRelationsDto } from "../../../dto/make-game-play/make-game-play-with-relations.dto";
import { GAME_PLAY_ACTIONS, WITCH_POTIONS } from "../../../enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../enums/player.enum";
import { getLeftToCharmByPiedPiperPlayers, getLeftToEatByWerewolvesPlayers, getLeftToEatByWhiteWerewolfPlayers, getPlayerWithCurrentRole } from "../../../helpers/game.helper";
import { doesPlayerHaveAttribute, isPlayerAliveAndPowerful, isPlayerOnVillagersSide, isPlayerOnWerewolvesSide } from "../../../helpers/player/player.helper";
import type { Game } from "../../../schemas/game.schema";
import type { GameSource } from "../../../types/game.type";
import { GameHistoryRecordService } from "../game-history/game-history-record.service";

@Injectable()
export class GamePlayValidatorService {
  public constructor(private readonly gameHistoryRecordService: GameHistoryRecordService) {}

  public async validateGamePlayWithRelationsDto(play: MakeGamePlayWithRelationsDto, game: Game): Promise<void> {
    const { votes, targets } = play;
    await this.validateGamePlayWithRelationsDtoJudgeRequest(play, game);
    this.validateGamePlayWithRelationsDtoChosenSide(play, game);
    this.validateGamePlayVotesWithRelationsDto(votes, game);
    await this.validateGamePlayTargetsWithRelationsDto(targets, game);
    this.validateGamePlayWithRelationsDtoChosenCard(play, game);
  }

  private validateGamePlayWithRelationsDtoChosenCard({ chosenCard }: MakeGamePlayWithRelationsDto, game: Game): void {
    if (!chosenCard) {
      if (game.currentPlay.action === GAME_PLAY_ACTIONS.CHOOSE_CARD) {
        throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.REQUIRED_CHOSEN_CARD);
      }
      return;
    }
    if (game.currentPlay.action !== GAME_PLAY_ACTIONS.CHOOSE_CARD) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_CHOSEN_CARD);
    }
  }

  private validateDrankLifePotionTargets(drankLifePotionTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    if (drankLifePotionTargets.length > 1) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.TOO_MUCH_DRANK_LIFE_POTION_TARGETS);
    }
    if (drankLifePotionTargets.length && (!doesPlayerHaveAttribute(drankLifePotionTargets[0].player, PLAYER_ATTRIBUTE_NAMES.EATEN) || !drankLifePotionTargets[0].player.isAlive)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_LIFE_POTION_TARGET);
    }
  }

  private validateDrankDeathPotionTargets(drankDeathPotionTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    if (drankDeathPotionTargets.length > 1) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.TOO_MUCH_DRANK_DEATH_POTION_TARGETS);
    }
    if (drankDeathPotionTargets.length && !drankDeathPotionTargets[0].player.isAlive) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_DEATH_POTION_TARGET);
    }
  }

  private async validateGamePlayWitchTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): Promise<void> {
    const hasWitchUsedLifePotion = (await this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, WITCH_POTIONS.LIFE)).length > 0;
    const drankLifePotionTargets = playTargets.filter(({ drankPotion }) => drankPotion === WITCH_POTIONS.LIFE);
    const hasWitchUsedDeathPotion = (await this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, WITCH_POTIONS.DEATH)).length > 0;
    const drankDeathPotionTargets = playTargets.filter(({ drankPotion }) => drankPotion === WITCH_POTIONS.DEATH);
    if (hasWitchUsedLifePotion && drankLifePotionTargets.length || hasWitchUsedDeathPotion && drankDeathPotionTargets.length) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_DRANK_POTION_TARGET);
    }
    this.validateDrankLifePotionTargets(drankLifePotionTargets);
    this.validateDrankDeathPotionTargets(drankDeathPotionTargets);
  }

  private async validateGamePlayInfectedTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): Promise<void> {
    const infectedTargets = playTargets.filter(({ isInfected }) => isInfected === true);
    if (!infectedTargets.length) {
      return;
    }
    const hasVileFatherOfWolvesInfected = (await this.gameHistoryRecordService.getGameHistoryVileFatherOfWolvesInfectedRecords(game._id)).length > 0;
    const vileFatherOfWolvesPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.VILE_FATHER_OF_WOLVES);
    if (!vileFatherOfWolvesPlayer || !isPlayerAliveAndPowerful(vileFatherOfWolvesPlayer) || hasVileFatherOfWolvesInfected) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_INFECTED_TARGET);
    }
    this.validateGamePlayTargetsBoundaries(infectedTargets, { min: 1, max: 1 });
  }
  
  private validateWerewolvesTargetsBoundaries(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    const leftToEatByWerewolvesPlayers = getLeftToEatByWerewolvesPlayers(game.players);
    const leftToEatByWhiteWerewolfPlayers = getLeftToEatByWhiteWerewolfPlayers(game.players);
    const bigBadWolfExpectedTargetsCount = leftToEatByWerewolvesPlayers.length ? 1 : 0;
    const whiteWerewolfMaxTargetsCount = leftToEatByWhiteWerewolfPlayers.length ? 1 : 0;
    const werewolvesSourceTargetsBoundaries: Partial<Record<GameSource, { min: number; max: number }>> = {
      [PLAYER_GROUPS.WEREWOLVES]: { min: 1, max: 1 },
      [ROLE_NAMES.BIG_BAD_WOLF]: { min: bigBadWolfExpectedTargetsCount, max: bigBadWolfExpectedTargetsCount },
      [ROLE_NAMES.WHITE_WEREWOLF]: { min: 0, max: whiteWerewolfMaxTargetsCount },
    };
    const targetsBoundaries = werewolvesSourceTargetsBoundaries[game.currentPlay.source];
    if (!targetsBoundaries) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(playTargets, targetsBoundaries);
  }

  private async validateGamePlayWerewolvesTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): Promise<void> {
    this.validateWerewolvesTargetsBoundaries(playTargets, game);
    if (!playTargets.length) {
      return;
    }
    const targetedPlayer = playTargets[0].player;
    if (game.currentPlay.source === PLAYER_GROUPS.WEREWOLVES && (!targetedPlayer.isAlive || !isPlayerOnVillagersSide(targetedPlayer))) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_WEREWOLVES_TARGET);
    }
    if (game.currentPlay.source === ROLE_NAMES.BIG_BAD_WOLF &&
      (!targetedPlayer.isAlive || !isPlayerOnVillagersSide(targetedPlayer) || doesPlayerHaveAttribute(targetedPlayer, PLAYER_ATTRIBUTE_NAMES.EATEN))) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_BIG_BAD_WOLF_TARGET);
    }
    const whiteWerewolfPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.WHITE_WEREWOLF);
    if (game.currentPlay.source === ROLE_NAMES.WHITE_WEREWOLF && (!targetedPlayer.isAlive || !isPlayerOnWerewolvesSide(targetedPlayer) ||
      whiteWerewolfPlayer?._id === targetedPlayer._id)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_WHITE_WEREWOLF_TARGET);
    }
    await this.validateGamePlayInfectedTargets(playTargets, game);
  }

  private validateGamePlayHunterTargets(playTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 1, max: 1 });
    const targetedPlayer = playTargets[0].player;
    if (!targetedPlayer.isAlive) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_HUNTER_TARGET);
    }
  }

  private validateGamePlayScapegoatTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 0, max: game.players.length });
    if (playTargets.some(({ player }) => !player.isAlive)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_SCAPEGOAT_TARGETS);
    }
  }

  private validateGamePlayCupidTargets(playTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 2, max: 2 });
    if (playTargets.some(({ player }) => !player.isAlive)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_CUPID_TARGETS);
    }
  }

  private validateGamePlayFoxTargets(playTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 0, max: 1 });
    const targetedPlayer = playTargets[0].player;
    if (!targetedPlayer.isAlive) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_FOX_TARGET);
    }
  }

  private validateGamePlaySeerTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 1, max: 1 });
    const seerPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.SEER);
    const targetedPlayer = playTargets[0].player;
    if (!targetedPlayer.isAlive || targetedPlayer._id === seerPlayer?._id) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_SEER_TARGET);
    }
  }

  private validateGamePlayRavenTargets(playTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 0, max: 1 });
    if (playTargets.length && !playTargets[0].player.isAlive) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_RAVEN_TARGET);
    }
  }

  private validateGamePlayWildChildTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 1, max: 1 });
    const wildChildPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.WILD_CHILD);
    const targetedPlayer = playTargets[0].player;
    if (!targetedPlayer.isAlive || targetedPlayer._id === wildChildPlayer?._id) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_WILD_CHILD_TARGET);
    }
  }

  private validateGamePlayPiedPiperTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    const { charmedPeopleCountPerNight } = game.options.roles.piedPiper;
    const leftToCharmByPiedPiperPlayers = getLeftToCharmByPiedPiperPlayers(game.players);
    const leftToCharmByPiedPiperPlayersCount = leftToCharmByPiedPiperPlayers.length;
    const countToCharm = Math.min(charmedPeopleCountPerNight, leftToCharmByPiedPiperPlayersCount);
    this.validateGamePlayTargetsBoundaries(playTargets, { min: countToCharm, max: countToCharm });
    if (playTargets.some(({ player }) => !leftToCharmByPiedPiperPlayers.find(({ _id }) => player._id === _id))) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_PIED_PIPER_TARGETS);
    }
  }

  private async validateGamePlayGuardTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): Promise<void> {
    const { canProtectTwice } = game.options.roles.guard;
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 1, max: 1 });
    const lastGuardHistoryRecord = await this.gameHistoryRecordService.getLastGameHistoryGuardProtectsRecord(game._id);
    const lastProtectedPlayer = lastGuardHistoryRecord?.play.targets?.[0].player;
    const targetedPlayer = playTargets[0].player;
    if (!targetedPlayer.isAlive || !canProtectTwice && lastProtectedPlayer?._id === targetedPlayer._id) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_GUARD_TARGET);
    }
  }

  private async validateGamePlaySheriffTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): Promise<void> {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 1, max: 1 });
    const targetedPlayer = playTargets[0].player;
    if (game.currentPlay.action === GAME_PLAY_ACTIONS.DELEGATE && !targetedPlayer.isAlive) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_SHERIFF_DELEGATE_TARGET);
    }
    const lastTieInVotesRecord = await this.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord(game._id);
    const lastTieInVotesRecordTargets = lastTieInVotesRecord?.play.targets ?? [];
    if (game.currentPlay.action === GAME_PLAY_ACTIONS.SETTLE_VOTES && !lastTieInVotesRecordTargets.find(({ player }) => player._id === targetedPlayer._id)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_SHERIFF_SETTLE_VOTES_TARGET);
    }
  }

  private validateGamePlayTargetsBoundaries(playTargets: MakeGamePlayTargetWithRelationsDto[], lengthBoundaries: { min: number; max: number }): void {
    if (playTargets.length < lengthBoundaries.min) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.TOO_LESS_TARGETS);
    }
    if (playTargets.length > lengthBoundaries.max) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.TOO_MUCH_TARGETS);
    }
  }

  private async validateGamePlaySourceTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): Promise<void> {
    const gamePlaySourceValidationMethods: Partial<Record<GameSource, () => Promise<void> | void>> = {
      [PLAYER_ATTRIBUTE_NAMES.SHERIFF]: async() => this.validateGamePlaySheriffTargets(playTargets, game),
      [PLAYER_GROUPS.WEREWOLVES]: async() => this.validateGamePlayWerewolvesTargets(playTargets, game),
      [ROLE_NAMES.BIG_BAD_WOLF]: async() => this.validateGamePlayWerewolvesTargets(playTargets, game),
      [ROLE_NAMES.WHITE_WEREWOLF]: async() => this.validateGamePlayWerewolvesTargets(playTargets, game),
      [ROLE_NAMES.GUARD]: async() => this.validateGamePlayGuardTargets(playTargets, game),
      [ROLE_NAMES.PIED_PIPER]: () => this.validateGamePlayPiedPiperTargets(playTargets, game),
      [ROLE_NAMES.WILD_CHILD]: () => this.validateGamePlayWildChildTargets(playTargets, game),
      [ROLE_NAMES.RAVEN]: () => this.validateGamePlayRavenTargets(playTargets),
      [ROLE_NAMES.SEER]: () => this.validateGamePlaySeerTargets(playTargets, game),
      [ROLE_NAMES.FOX]: () => this.validateGamePlayFoxTargets(playTargets),
      [ROLE_NAMES.CUPID]: () => this.validateGamePlayCupidTargets(playTargets),
      [ROLE_NAMES.SCAPEGOAT]: () => this.validateGamePlayScapegoatTargets(playTargets, game),
      [ROLE_NAMES.HUNTER]: () => this.validateGamePlayHunterTargets(playTargets),
      [ROLE_NAMES.WITCH]: async() => this.validateGamePlayWitchTargets(playTargets, game),
    };
    const gamePlaySourceValidationMethod = gamePlaySourceValidationMethods[game.currentPlay.source];
    if (gamePlaySourceValidationMethod) {
      await gamePlaySourceValidationMethod();
    }
  }

  private validateInfectedTargetsAndPotionUsage(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    const { source: currentPlaySource, action: currentPlayAction } = game.currentPlay;
    const isSomeTargetInfected = playTargets.some(({ isInfected }) => isInfected);
    if (isSomeTargetInfected && (currentPlayAction !== GAME_PLAY_ACTIONS.EAT || currentPlaySource !== PLAYER_GROUPS.WEREWOLVES)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_INFECTED_TARGET);
    }
    const hasSomePlayerDrankPotion = playTargets.some(({ drankPotion }) => drankPotion);
    if (hasSomePlayerDrankPotion && (currentPlayAction !== GAME_PLAY_ACTIONS.USE_POTIONS || currentPlaySource !== ROLE_NAMES.WITCH)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_DRANK_POTION_TARGET);
    }
  }

  private async validateGamePlayTargetsWithRelationsDto(playTargets: MakeGamePlayTargetWithRelationsDto[] | undefined, game: Game): Promise<void> {
    if (playTargets === undefined || !playTargets.length) {
      if (requiredTargetsActions.includes(game.currentPlay.action)) {
        throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.REQUIRED_TARGETS);
      }
      return;
    }
    if (![...requiredTargetsActions, ...optionalTargetsActions].includes(game.currentPlay.action)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_TARGETS);
    }
    this.validateInfectedTargetsAndPotionUsage(playTargets, game);
    await this.validateGamePlaySourceTargets(playTargets, game);
  }

  private validateGamePlayVotesWithRelationsDto(playVotes: MakeGamePlayVoteWithRelationsDto[] | undefined, game: Game): void {
    if (playVotes === undefined || !playVotes.length) {
      if (requiredVotesActions.includes(game.currentPlay.action)) {
        throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.REQUIRED_VOTES);
      }
      return;
    }
    if (!requiredVotesActions.includes(game.currentPlay.action)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_VOTES);
    }
    if (playVotes.some(({ source, target }) => source._id === target._id)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.SAME_SOURCE_AND_TARGET_VOTE);
    }
  }

  private validateGamePlayWithRelationsDtoChosenSide({ chosenSide }: MakeGamePlayWithRelationsDto, game: Game): void {
    if (chosenSide && game.currentPlay.action !== GAME_PLAY_ACTIONS.CHOOSE_SIDE) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_CHOSEN_SIDE);
    }
    if (!chosenSide && game.currentPlay.action === GAME_PLAY_ACTIONS.CHOOSE_SIDE) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.REQUIRED_CHOSEN_SIDE);
    }
  }

  private async validateGamePlayWithRelationsDtoJudgeRequest({ doesJudgeRequestAnotherVote }: MakeGamePlayWithRelationsDto, game: Game): Promise<void> {
    if (doesJudgeRequestAnotherVote === undefined) {
      return;
    }
    const { voteRequestsCount } = game.options.roles.stutteringJudge;
    const gameHistoryJudgeRequestRecords = await this.gameHistoryRecordService.getGameHistoryJudgeRequestRecords(game._id);
    const stutteringJudgePlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.STUTTERING_JUDGE);
    if (!stutteringJudgeRequestOpportunityActions.includes(game.currentPlay.action) ||
        !stutteringJudgePlayer || !isPlayerAliveAndPowerful(stutteringJudgePlayer) ||
        gameHistoryJudgeRequestRecords.length >= voteRequestsCount) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_STUTTERING_JUDGE_VOTE_REQUEST);
    }
  }
}