import { Injectable } from "@nestjs/common";

import { isPlayerInteractableWithInteractionType } from "@/modules/game/helpers/game-play/game-play.helper";
import { STUTTERING_JUDGE_REQUEST_OPPORTUNITY_ACTIONS, TARGET_ACTIONS, VOTE_ACTIONS } from "@/modules/game/constants/game-play/game-play.constant";
import type { MakeGamePlayTargetWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import type { MakeGamePlayVoteWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import type { MakeGamePlayWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups, PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import { createGame } from "@/modules/game/helpers/game.factory";
import { getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helper";
import { isPlayerAliveAndPowerful } from "@/modules/game/helpers/player/player.helper";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { GamePlaySourceName } from "@/modules/game/types/game-play.type";
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
    this.validateGamePlayVotesWithRelationsDto(votes, clonedGameWithCurrentPlay);
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

  private validateDrankLifePotionTargets(drankLifePotionTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    if (drankLifePotionTargets.length > 1) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_DRANK_LIFE_POTION_TARGETS);
    }
    if (drankLifePotionTargets.length && !isPlayerInteractableWithInteractionType(drankLifePotionTargets[0].player._id, PlayerInteractionTypes.GIVE_LIFE_POTION, game)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_LIFE_POTION_TARGET);
    }
  }

  private validateDrankDeathPotionTargets(drankDeathPotionTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    if (drankDeathPotionTargets.length > 1) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_DRANK_DEATH_POTION_TARGETS);
    }
    if (drankDeathPotionTargets.length && !isPlayerInteractableWithInteractionType(drankDeathPotionTargets[0].player._id, PlayerInteractionTypes.GIVE_DEATH_POTION, game)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_DEATH_POTION_TARGET);
    }
  }

  private async validateGamePlayWitchTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): Promise<void> {
    const hasWitchUsedLifePotion = (await this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, WitchPotions.LIFE)).length > 0;
    const drankLifePotionTargets = playTargets.filter(({ drankPotion }) => drankPotion === WitchPotions.LIFE);
    const hasWitchUsedDeathPotion = (await this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, WitchPotions.DEATH)).length > 0;
    const drankDeathPotionTargets = playTargets.filter(({ drankPotion }) => drankPotion === WitchPotions.DEATH);
    if (hasWitchUsedLifePotion && drankLifePotionTargets.length || hasWitchUsedDeathPotion && drankDeathPotionTargets.length) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);
    }
    this.validateDrankLifePotionTargets(drankLifePotionTargets, game);
    this.validateDrankDeathPotionTargets(drankDeathPotionTargets, game);
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

  private async validateGamePlayWerewolvesTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): Promise<void> {
    if (!playTargets.length) {
      return;
    }
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeEaten = isPlayerInteractableWithInteractionType(targetedPlayer._id, PlayerInteractionTypes.EAT, game);
    if (game.currentPlay.source.name === PlayerGroups.WEREWOLVES && !canTargetedPlayerBeEaten) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WEREWOLVES_TARGET);
    }
    if (game.currentPlay.source.name === RoleNames.BIG_BAD_WOLF && !canTargetedPlayerBeEaten) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_BIG_BAD_WOLF_TARGET);
    }
    if (game.currentPlay.source.name === RoleNames.WHITE_WEREWOLF && !canTargetedPlayerBeEaten) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WHITE_WEREWOLF_TARGET);
    }
    await this.validateGamePlayInfectedTargets(playTargets, game);
  }

  private validateGamePlayHunterTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeShot = isPlayerInteractableWithInteractionType(targetedPlayer._id, PlayerInteractionTypes.SHOOT, game);
    if (!canTargetedPlayerBeShot) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_HUNTER_TARGET);
    }
  }

  private validateGamePlayScapegoatTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    if (playTargets.some(({ player }) => !isPlayerInteractableWithInteractionType(player._id, PlayerInteractionTypes.BAN_VOTING, game))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SCAPEGOAT_TARGETS);
    }
  }

  private validateGamePlayCupidTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    if (playTargets.some(({ player }) => !isPlayerInteractableWithInteractionType(player._id, PlayerInteractionTypes.CHARM, game))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_CUPID_TARGETS);
    }
  }

  private validateGamePlayFoxTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeSniffed = isPlayerInteractableWithInteractionType(targetedPlayer._id, PlayerInteractionTypes.SNIFF, game);
    if (!canTargetedPlayerBeSniffed) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_FOX_TARGET);
    }
  }

  private validateGamePlaySeerTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeSeen = isPlayerInteractableWithInteractionType(targetedPlayer._id, PlayerInteractionTypes.LOOK, game);
    if (!canTargetedPlayerBeSeen) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SEER_TARGET);
    }
  }

  private validateGamePlayRavenTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    if (!playTargets.length) {
      return;
    }
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeMarked = isPlayerInteractableWithInteractionType(targetedPlayer._id, PlayerInteractionTypes.MARK, game);
    if (!canTargetedPlayerBeMarked) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_RAVEN_TARGET);
    }
  }

  private validateGamePlayWildChildTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeChosenAsModel = isPlayerInteractableWithInteractionType(targetedPlayer._id, PlayerInteractionTypes.CHOOSE_AS_MODEL, game);
    if (!canTargetedPlayerBeChosenAsModel) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WILD_CHILD_TARGET);
    }
  }

  private validateGamePlayPiedPiperTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    if (playTargets.some(({ player }) => !isPlayerInteractableWithInteractionType(player._id, PlayerInteractionTypes.CHARM, game))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_PIED_PIPER_TARGETS);
    }
  }

  private validateGamePlayGuardTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeProtected = isPlayerInteractableWithInteractionType(targetedPlayer._id, PlayerInteractionTypes.PROTECT, game);
    if (!canTargetedPlayerBeProtected) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_GUARD_TARGET);
    }
  }

  private validateGamePlaySheriffTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    const targetedPlayer = playTargets[0].player;
    const canTargetBecomeSheriff = isPlayerInteractableWithInteractionType(targetedPlayer._id, PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE, game);
    if (game.currentPlay.action === GamePlayActions.DELEGATE && !canTargetBecomeSheriff) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SHERIFF_DELEGATE_TARGET);
    }
    const canTargetBeSentencedToDeath = isPlayerInteractableWithInteractionType(targetedPlayer._id, PlayerInteractionTypes.SENTENCE_TO_DEATH, game);
    if (game.currentPlay.action === GamePlayActions.SETTLE_VOTES && !canTargetBeSentencedToDeath) {
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
      [PlayerAttributeNames.SHERIFF]: () => this.validateGamePlaySheriffTargets(playTargets, game),
      [PlayerGroups.WEREWOLVES]: async() => this.validateGamePlayWerewolvesTargets(playTargets, game),
      [RoleNames.BIG_BAD_WOLF]: async() => this.validateGamePlayWerewolvesTargets(playTargets, game),
      [RoleNames.WHITE_WEREWOLF]: async() => this.validateGamePlayWerewolvesTargets(playTargets, game),
      [RoleNames.GUARD]: () => this.validateGamePlayGuardTargets(playTargets, game),
      [RoleNames.PIED_PIPER]: () => this.validateGamePlayPiedPiperTargets(playTargets, game),
      [RoleNames.WILD_CHILD]: () => this.validateGamePlayWildChildTargets(playTargets, game),
      [RoleNames.RAVEN]: () => this.validateGamePlayRavenTargets(playTargets, game),
      [RoleNames.SEER]: () => this.validateGamePlaySeerTargets(playTargets, game),
      [RoleNames.FOX]: () => this.validateGamePlayFoxTargets(playTargets, game),
      [RoleNames.CUPID]: () => this.validateGamePlayCupidTargets(playTargets, game),
      [RoleNames.SCAPEGOAT]: () => this.validateGamePlayScapegoatTargets(playTargets, game),
      [RoleNames.HUNTER]: () => this.validateGamePlayHunterTargets(playTargets, game),
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
    const { currentPlay } = game;
    if (!targetActions.includes(game.currentPlay.action)) {
      if (playTargets) {
        throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_TARGETS);
      }
      return;
    }
    if (playTargets === undefined || playTargets.length === 0) {
      if (currentPlay.canBeSkipped === false) {
        throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.REQUIRED_TARGETS);
      }
      return;
    }
    if (currentPlay.eligibleTargets?.boundaries) {
      this.validateGamePlayTargetsBoundaries(playTargets, currentPlay.eligibleTargets.boundaries);
    }
    this.validateInfectedTargetsAndPotionUsage(playTargets, game);
    await this.validateGamePlaySourceTargets(playTargets, game);
  }

  private validateGamePlayVotesTieBreakerWithRelationsDto(playVotes: MakeGamePlayVoteWithRelationsDto[], game: GameWithCurrentPlay): void {
    const { eligibleTargets, cause } = game.currentPlay;
    const doesSomeTargetNotInLastNominatedPlayers = playVotes.some(({ target }) => !eligibleTargets?.interactablePlayers?.find(({ player }) => player._id.equals(target._id)));
    if (cause === GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES && doesSomeTargetNotInLastNominatedPlayers) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_TARGET_FOR_TIE_BREAKER);
    }
  }

  private validateGamePlayVotesWithRelationsDtoSourceAndTarget(playVotes: MakeGamePlayVoteWithRelationsDto[], game: GameWithCurrentPlay): void {
    const { currentPlay } = game;
    if (playVotes.some(({ source }) => !currentPlay.source.players?.find(({ _id }) => _id.equals(source._id)))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_SOURCE);
    }
    if (playVotes.some(({ target }) => !currentPlay.eligibleTargets?.interactablePlayers?.find(({ player }) => player._id.equals(target._id)))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_TARGET);
    }
    if (playVotes.some(({ source, target }) => source._id.equals(target._id))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.SAME_SOURCE_AND_TARGET_VOTE);
    }
  }

  private validateGamePlayVotesWithRelationsDto(playVotes: MakeGamePlayVoteWithRelationsDto[] | undefined, game: GameWithCurrentPlay): void {
    const { currentPlay } = game;
    const voteActions: GamePlayActions[] = [...VOTE_ACTIONS];
    if (!voteActions.includes(currentPlay.action)) {
      if (playVotes) {
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
    if (game.currentPlay.cause === GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES) {
      this.validateGamePlayVotesTieBreakerWithRelationsDto(playVotes, game);
    }
    this.validateGamePlayVotesWithRelationsDtoSourceAndTarget(playVotes, game);
  }

  private validateGamePlayWithRelationsDtoChosenSide({ chosenSide }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): void {
    const { isSideRandomlyChosen } = game.options.roles.dogWolf;
    if (chosenSide !== undefined && (game.currentPlay.action !== GamePlayActions.CHOOSE_SIDE || isSideRandomlyChosen)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_CHOSEN_SIDE);
    }
    if (chosenSide === undefined && game.currentPlay.action === GamePlayActions.CHOOSE_SIDE && !isSideRandomlyChosen) {
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