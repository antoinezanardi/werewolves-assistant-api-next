import { Injectable } from "@nestjs/common";

import type { GamePlaySourceName } from "@/modules/game/types/game-play.type";
import { VOTE_ACTIONS, STUTTERING_JUDGE_REQUEST_OPPORTUNITY_ACTIONS, TARGET_ACTIONS } from "@/modules/game/constants/game-play/game-play.constant";
import type { MakeGamePlayTargetWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import type { MakeGamePlayVoteWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import type { MakeGamePlayWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { createGame } from "@/modules/game/helpers/game.factory";
import { getLeftToCharmByPiedPiperPlayers, getLeftToEatByWerewolvesPlayers, getLeftToEatByWhiteWerewolfPlayers, getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helper";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { isPlayerAliveAndPowerful } from "@/modules/game/helpers/player/player.helper";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play";
import { WEREWOLF_ROLES } from "@/modules/role/constants/role.constant";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { BadGamePlayPayloadReasons } from "@/shared/exception/enums/bad-game-play-payload-error.enum";
import { createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";
import { BadGamePlayPayloadException } from "@/shared/exception/types/bad-game-play-payload-exception.type";

@Injectable()
export class GamePlayValidatorService {
  public constructor(private readonly gameHistoryRecordService: GameHistoryRecordService) {}

  public async validateGamePlayWithRelationsDto(play: MakeGamePlayWithRelationsDto, game: Game): Promise<void> {
    if (!game.currentPlay) {
      throw createNoCurrentGamePlayUnexpectedException("validateGamePlayWithRelationsDto", { gameId: game._id });
    }
    const clonedGameWithCurrentPlay = createGame(game) as GameWithCurrentPlay;
    const { votes, targets } = play;
    await this.validateGamePlayWithRelationsDtoJudgeRequest(play, clonedGameWithCurrentPlay);
    this.validateGamePlayWithRelationsDtoChosenSide(play, clonedGameWithCurrentPlay);
    await this.validateGamePlayVotesWithRelationsDto(votes, clonedGameWithCurrentPlay);
    await this.validateGamePlayTargetsWithRelationsDto(targets, clonedGameWithCurrentPlay);
    this.validateGamePlayWithRelationsDtoChosenCard(play, clonedGameWithCurrentPlay);
  }

  private validateGamePlayThiefChosenCard(chosenCard: GameAdditionalCard | undefined, game: GameWithCurrentPlay): void {
    const { mustChooseBetweenWerewolves } = game.options.roles.thief;
    if (!game.additionalCards || !mustChooseBetweenWerewolves) {
      return;
    }
    const areAllAdditionalCardsWerewolves = game.additionalCards.every(({ roleName }) => WEREWOLF_ROLES.find(role => role.name === roleName));
    if (areAllAdditionalCardsWerewolves && !chosenCard) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.THIEF_MUST_CHOOSE_CARD);
    }
  }

  private validateGamePlayWithRelationsDtoChosenCard({ chosenCard }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): void {
    if (game.currentPlay.action !== GamePlayActions.CHOOSE_CARD) {
      if (chosenCard) {
        throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_CHOSEN_CARD);
      }
      return;
    }
    this.validateGamePlayThiefChosenCard(chosenCard, game);
  }

  private validateDrankLifePotionTargets(drankLifePotionTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    if (drankLifePotionTargets.length > 1) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_DRANK_LIFE_POTION_TARGETS);
    }
    if (drankLifePotionTargets.length &&
      (!doesPlayerHaveActiveAttributeWithName(drankLifePotionTargets[0].player, PlayerAttributeNames.EATEN, game) || !drankLifePotionTargets[0].player.isAlive)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_LIFE_POTION_TARGET);
    }
  }

  private validateDrankDeathPotionTargets(drankDeathPotionTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    if (drankDeathPotionTargets.length > 1) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_DRANK_DEATH_POTION_TARGETS);
    }
    if (drankDeathPotionTargets.length && !drankDeathPotionTargets[0].player.isAlive) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_DEATH_POTION_TARGET);
    }
  }

  private async validateGamePlayWitchTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): Promise<void> {
    const hasWitchUsedLifePotion = (await this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, WitchPotions.LIFE)).length > 0;
    const drankLifePotionTargets = playTargets.filter(({ drankPotion }) => drankPotion === WitchPotions.LIFE);
    const hasWitchUsedDeathPotion = (await this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, WitchPotions.DEATH)).length > 0;
    const drankDeathPotionTargets = playTargets.filter(({ drankPotion }) => drankPotion === WitchPotions.DEATH);
    if (hasWitchUsedLifePotion && drankLifePotionTargets.length || hasWitchUsedDeathPotion && drankDeathPotionTargets.length) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);
    }
    this.validateDrankLifePotionTargets(drankLifePotionTargets, game);
    this.validateDrankDeathPotionTargets(drankDeathPotionTargets);
  }

  private async validateGamePlayInfectedTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): Promise<void> {
    const infectedTargets = playTargets.filter(({ isInfected }) => isInfected === true);
    if (!infectedTargets.length) {
      return;
    }
    const hasVileFatherOfWolvesInfected = (await this.gameHistoryRecordService.getGameHistoryVileFatherOfWolvesInfectedRecords(game._id)).length > 0;
    const vileFatherOfWolvesPlayer = getPlayerWithCurrentRole(game, RoleNames.VILE_FATHER_OF_WOLVES);
    if (!vileFatherOfWolvesPlayer || !isPlayerAliveAndPowerful(vileFatherOfWolvesPlayer, game) || hasVileFatherOfWolvesInfected) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_INFECTED_TARGET);
    }
    this.validateGamePlayTargetsBoundaries(infectedTargets, { min: 1, max: 1 });
  }
  
  private validateWerewolvesTargetsBoundaries(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    const leftToEatByWerewolvesPlayers = getLeftToEatByWerewolvesPlayers(game);
    const leftToEatByWhiteWerewolfPlayers = getLeftToEatByWhiteWerewolfPlayers(game);
    const bigBadWolfExpectedTargetsCount = leftToEatByWerewolvesPlayers.length ? 1 : 0;
    const whiteWerewolfMaxTargetsCount = leftToEatByWhiteWerewolfPlayers.length ? 1 : 0;
    const werewolvesSourceTargetsBoundaries: Partial<Record<GamePlaySourceName, { min: number; max: number }>> = {
      [PlayerGroups.WEREWOLVES]: { min: 1, max: 1 },
      [RoleNames.BIG_BAD_WOLF]: { min: bigBadWolfExpectedTargetsCount, max: bigBadWolfExpectedTargetsCount },
      [RoleNames.WHITE_WEREWOLF]: { min: 0, max: whiteWerewolfMaxTargetsCount },
    };
    const targetsBoundaries = werewolvesSourceTargetsBoundaries[game.currentPlay.source.name];
    if (!targetsBoundaries) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(playTargets, targetsBoundaries);
  }

  private async validateGamePlayWerewolvesTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): Promise<void> {
    this.validateWerewolvesTargetsBoundaries(playTargets, game);
    if (!playTargets.length) {
      return;
    }
    const targetedPlayer = playTargets[0].player;
    const pureWolvesAvailableTargets = getLeftToEatByWerewolvesPlayers(game);
    const isTargetedPlayerInPureWolvesTargets = !!pureWolvesAvailableTargets.find(({ _id }) => _id.equals(targetedPlayer._id));
    if (game.currentPlay.source.name === PlayerGroups.WEREWOLVES && !isTargetedPlayerInPureWolvesTargets) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WEREWOLVES_TARGET);
    }
    if (game.currentPlay.source.name === RoleNames.BIG_BAD_WOLF && !isTargetedPlayerInPureWolvesTargets) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_BIG_BAD_WOLF_TARGET);
    }
    const whiteWerewolfAvailableTargets = getLeftToEatByWhiteWerewolfPlayers(game);
    const isTargetedPlayerInWhiteWerewolfTargets = !!whiteWerewolfAvailableTargets.find(({ _id }) => _id.equals(targetedPlayer._id));
    if (game.currentPlay.source.name === RoleNames.WHITE_WEREWOLF && !isTargetedPlayerInWhiteWerewolfTargets) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WHITE_WEREWOLF_TARGET);
    }
    await this.validateGamePlayInfectedTargets(playTargets, game);
  }

  private validateGamePlayHunterTargets(playTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 1, max: 1 });
    const targetedPlayer = playTargets[0].player;
    if (!targetedPlayer.isAlive) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_HUNTER_TARGET);
    }
  }

  private validateGamePlayScapegoatTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 0, max: game.players.length });
    if (playTargets.some(({ player }) => !player.isAlive)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SCAPEGOAT_TARGETS);
    }
  }

  private validateGamePlayCupidTargets(playTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 2, max: 2 });
    if (playTargets.some(({ player }) => !player.isAlive)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_CUPID_TARGETS);
    }
  }

  private validateGamePlayFoxTargets(playTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 0, max: 1 });
    const targetedPlayer = playTargets[0].player;
    if (!targetedPlayer.isAlive) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_FOX_TARGET);
    }
  }

  private validateGamePlaySeerTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 1, max: 1 });
    const seerPlayer = getPlayerWithCurrentRole(game, RoleNames.SEER);
    const targetedPlayer = playTargets[0].player;
    if (!targetedPlayer.isAlive || seerPlayer?._id.equals(targetedPlayer._id) === true) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SEER_TARGET);
    }
  }

  private validateGamePlayRavenTargets(playTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 0, max: 1 });
    if (playTargets.length && !playTargets[0].player.isAlive) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_RAVEN_TARGET);
    }
  }

  private validateGamePlayWildChildTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 1, max: 1 });
    const wildChildPlayer = getPlayerWithCurrentRole(game, RoleNames.WILD_CHILD);
    const targetedPlayer = playTargets[0].player;
    if (!targetedPlayer.isAlive || wildChildPlayer?._id.equals(targetedPlayer._id) === true) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WILD_CHILD_TARGET);
    }
  }

  private validateGamePlayPiedPiperTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    const { charmedPeopleCountPerNight } = game.options.roles.piedPiper;
    const leftToCharmByPiedPiperPlayers = getLeftToCharmByPiedPiperPlayers(game);
    const leftToCharmByPiedPiperPlayersCount = leftToCharmByPiedPiperPlayers.length;
    const countToCharm = Math.min(charmedPeopleCountPerNight, leftToCharmByPiedPiperPlayersCount);
    this.validateGamePlayTargetsBoundaries(playTargets, { min: countToCharm, max: countToCharm });
    if (playTargets.some(({ player }) => !leftToCharmByPiedPiperPlayers.find(({ _id }) => player._id.equals(_id)))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_PIED_PIPER_TARGETS);
    }
  }

  private async validateGamePlayGuardTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: Game): Promise<void> {
    const { canProtectTwice } = game.options.roles.guard;
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 1, max: 1 });
    const lastGuardHistoryRecord = await this.gameHistoryRecordService.getLastGameHistoryGuardProtectsRecord(game._id);
    const lastProtectedPlayer = lastGuardHistoryRecord?.play.targets?.[0].player;
    const targetedPlayer = playTargets[0].player;
    if (!targetedPlayer.isAlive || !canProtectTwice && lastProtectedPlayer?._id.equals(targetedPlayer._id) === true) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_GUARD_TARGET);
    }
  }

  private async validateGamePlaySheriffTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): Promise<void> {
    this.validateGamePlayTargetsBoundaries(playTargets, { min: 1, max: 1 });
    const targetedPlayer = playTargets[0].player;
    if (game.currentPlay.action === GamePlayActions.DELEGATE && !targetedPlayer.isAlive) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SHERIFF_DELEGATE_TARGET);
    }
    const lastTieInVotesRecord = await this.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord(game._id, GamePlayActions.VOTE);
    const lastTieInVotesRecordNominatedPlayers = lastTieInVotesRecord?.play.voting?.nominatedPlayers ?? [];
    const isSheriffTargetInLastNominatedPlayers = lastTieInVotesRecordNominatedPlayers.find(({ _id }) => _id.equals(targetedPlayer._id));
    if (game.currentPlay.action === GamePlayActions.SETTLE_VOTES && !isSheriffTargetInLastNominatedPlayers) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SHERIFF_SETTLE_VOTES_TARGET);
    }
  }

  private validateGamePlayTargetsBoundaries(playTargets: MakeGamePlayTargetWithRelationsDto[], lengthBoundaries: { min: number; max: number }): void {
    if (playTargets.length < lengthBoundaries.min) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_LESS_TARGETS);
    }
    if (playTargets.length > lengthBoundaries.max) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_TARGETS);
    }
  }

  private async validateGamePlaySourceTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): Promise<void> {
    const gamePlaySourceValidationMethods: Partial<Record<GamePlaySourceName, () => Promise<void> | void>> = {
      [PlayerAttributeNames.SHERIFF]: async() => this.validateGamePlaySheriffTargets(playTargets, game),
      [PlayerGroups.WEREWOLVES]: async() => this.validateGamePlayWerewolvesTargets(playTargets, game),
      [RoleNames.BIG_BAD_WOLF]: async() => this.validateGamePlayWerewolvesTargets(playTargets, game),
      [RoleNames.WHITE_WEREWOLF]: async() => this.validateGamePlayWerewolvesTargets(playTargets, game),
      [RoleNames.GUARD]: async() => this.validateGamePlayGuardTargets(playTargets, game),
      [RoleNames.PIED_PIPER]: () => this.validateGamePlayPiedPiperTargets(playTargets, game),
      [RoleNames.WILD_CHILD]: () => this.validateGamePlayWildChildTargets(playTargets, game),
      [RoleNames.RAVEN]: () => this.validateGamePlayRavenTargets(playTargets),
      [RoleNames.SEER]: () => this.validateGamePlaySeerTargets(playTargets, game),
      [RoleNames.FOX]: () => this.validateGamePlayFoxTargets(playTargets),
      [RoleNames.CUPID]: () => this.validateGamePlayCupidTargets(playTargets),
      [RoleNames.SCAPEGOAT]: () => this.validateGamePlayScapegoatTargets(playTargets, game),
      [RoleNames.HUNTER]: () => this.validateGamePlayHunterTargets(playTargets),
      [RoleNames.WITCH]: async() => this.validateGamePlayWitchTargets(playTargets, game),
    };
    const gamePlaySourceValidationMethod = gamePlaySourceValidationMethods[game.currentPlay.source.name];
    if (gamePlaySourceValidationMethod) {
      await gamePlaySourceValidationMethod();
    }
  }

  private validateInfectedTargetsAndPotionUsage(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    const { source: currentPlaySource, action: currentPlayAction } = game.currentPlay;
    const isSomeTargetInfected = playTargets.some(({ isInfected }) => isInfected);
    if (isSomeTargetInfected && (currentPlayAction !== GamePlayActions.EAT || currentPlaySource.name !== PlayerGroups.WEREWOLVES)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_INFECTED_TARGET);
    }
    const hasSomePlayerDrankPotion = playTargets.some(({ drankPotion }) => drankPotion);
    if (hasSomePlayerDrankPotion && (currentPlayAction !== GamePlayActions.USE_POTIONS || currentPlaySource.name !== RoleNames.WITCH)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);
    }
  }

  private async validateGamePlayTargetsWithRelationsDto(playTargets: MakeGamePlayTargetWithRelationsDto[] | undefined, game: GameWithCurrentPlay): Promise<void> {
    const targetActions: GamePlayActions[] = [...TARGET_ACTIONS];
    if (!targetActions.includes(game.currentPlay.action)) {
      if (playTargets !== undefined && playTargets.length > 0) {
        throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_TARGETS);
      }
      return;
    }
    if (playTargets === undefined || playTargets.length === 0) {
      if (game.currentPlay.canBeSkipped === false) {
        throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.REQUIRED_TARGETS);
      }
      return;
    }
    this.validateInfectedTargetsAndPotionUsage(playTargets, game);
    await this.validateGamePlaySourceTargets(playTargets, game);
  }

  private async validateGamePlayVotesTieBreakerWithRelationsDto(playVotes: MakeGamePlayVoteWithRelationsDto[], game: GameWithCurrentPlay): Promise<void> {
    const lastTieInVotesRecord = await this.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord(game._id, game.currentPlay.action);
    const lastTieInVotesRecordNominatedPlayers = lastTieInVotesRecord?.play.voting?.nominatedPlayers ?? [];
    if (playVotes.some(vote => !lastTieInVotesRecordNominatedPlayers.find(player => vote.target._id.equals(player._id)))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_TARGET_FOR_TIE_BREAKER);
    }
  }
  
  private validateGamePlayVotesWithRelationsDtoSourceAndTarget(playVotes: MakeGamePlayVoteWithRelationsDto[], game: Game): void {
    if (playVotes.some(({ source }) => !source.isAlive || doesPlayerHaveActiveAttributeWithName(source, PlayerAttributeNames.CANT_VOTE, game))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_SOURCE);
    }
    if (playVotes.some(({ target }) => !target.isAlive)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_TARGET);
    }
    if (playVotes.some(({ source, target }) => source._id.equals(target._id))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.SAME_SOURCE_AND_TARGET_VOTE);
    }
  }
  
  private async validateGamePlayVotesWithRelationsDto(playVotes: MakeGamePlayVoteWithRelationsDto[] | undefined, game: GameWithCurrentPlay): Promise<void> {
    const { currentPlay } = game;
    const voteActions: GamePlayActions[] = [...VOTE_ACTIONS];
    if (!voteActions.includes(currentPlay.action)) {
      if (playVotes !== undefined && playVotes.length > 0) {
        throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_VOTES);
      }
      return;
    }
    if (playVotes === undefined || playVotes.length === 0) {
      if (game.currentPlay.canBeSkipped === false) {
        throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.REQUIRED_VOTES);
      }
      return;
    }
    this.validateGamePlayVotesWithRelationsDtoSourceAndTarget(playVotes, game);
    if (game.currentPlay.cause === GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES) {
      await this.validateGamePlayVotesTieBreakerWithRelationsDto(playVotes, game);
    }
  }

  private validateGamePlayWithRelationsDtoChosenSide({ chosenSide }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): void {
    if (chosenSide !== undefined && game.currentPlay.action !== GamePlayActions.CHOOSE_SIDE) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_CHOSEN_SIDE);
    }
    if (chosenSide === undefined && game.currentPlay.action === GamePlayActions.CHOOSE_SIDE) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.REQUIRED_CHOSEN_SIDE);
    }
  }

  private async validateGamePlayWithRelationsDtoJudgeRequest({ doesJudgeRequestAnotherVote }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Promise<void> {
    if (doesJudgeRequestAnotherVote === undefined) {
      return;
    }
    const { voteRequestsCount } = game.options.roles.stutteringJudge;
    const didJudgeMakeHisSign = await this.gameHistoryRecordService.didJudgeMakeHisSign(game._id);
    const gameHistoryJudgeRequestRecords = await this.gameHistoryRecordService.getGameHistoryJudgeRequestRecords(game._id);
    const stutteringJudgePlayer = getPlayerWithCurrentRole(game, RoleNames.STUTTERING_JUDGE);
    const stutteringJudgeRequestOpportunityActions: GamePlayActions[] = [...STUTTERING_JUDGE_REQUEST_OPPORTUNITY_ACTIONS];
    if (!stutteringJudgeRequestOpportunityActions.includes(game.currentPlay.action) || !didJudgeMakeHisSign ||
        !stutteringJudgePlayer || !isPlayerAliveAndPowerful(stutteringJudgePlayer, game) ||
        gameHistoryJudgeRequestRecords.length >= voteRequestsCount) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_STUTTERING_JUDGE_VOTE_REQUEST);
    }
  }
}