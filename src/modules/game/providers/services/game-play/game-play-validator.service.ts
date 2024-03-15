import { Injectable } from "@nestjs/common";

import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { isPlayerInteractableInCurrentGamePlay, isPlayerInteractableWithInteractionTypeInCurrentGamePlay } from "@/modules/game/helpers/game-play/game-play.helper";
import { TARGET_ACTIONS, VOTE_ACTIONS } from "@/modules/game/constants/game-play/game-play.constant";
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
import { RoleNames } from "@/modules/role/enums/role.enum";

import { BadGamePlayPayloadReasons } from "@/shared/exception/enums/bad-game-play-payload-error.enum";
import { createCantFindPlayerWithCurrentRoleUnexpectedException, createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";
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
    this.validateGamePlayWithRelationsDtoJudgeRequest(play, clonedGameWithCurrentPlay);
    this.validateGamePlayWithRelationsDtoChosenSide(play, clonedGameWithCurrentPlay);
    this.validateGamePlayVotesWithRelationsDto(votes, clonedGameWithCurrentPlay);
    await this.validateGamePlayTargetsWithRelationsDto(targets, clonedGameWithCurrentPlay);
    this.validateGamePlayWithRelationsDtoChosenCard(play, clonedGameWithCurrentPlay);
  }

  private validateGamePlayActorChosenCard(chosenCard: GameAdditionalCard | undefined, game: GameWithCurrentPlay): void {
    if (!game.additionalCards) {
      return;
    }
    if (chosenCard) {
      if (chosenCard.recipient !== RoleNames.ACTOR) {
        throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.CHOSEN_CARD_NOT_FOR_ACTOR);
      }
      if (chosenCard.isUsed) {
        throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.CHOSEN_CARD_ALREADY_USED);
      }
    }
  }

  private validateGamePlayThiefChosenCard(chosenCard: GameAdditionalCard | undefined, game: GameWithCurrentPlay): void {
    if (!game.additionalCards) {
      return;
    }
    if (!chosenCard && game.currentPlay.canBeSkipped === false) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.THIEF_MUST_CHOOSE_CARD);
    }
    if (chosenCard && chosenCard.recipient !== RoleNames.THIEF) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.CHOSEN_CARD_NOT_FOR_THIEF);
    }
  }

  private validateGamePlayWithRelationsDtoChosenCard({ chosenCard }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): void {
    const { action, source } = game.currentPlay;
    if (action !== GamePlayActions.CHOOSE_CARD) {
      if (chosenCard) {
        throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_CHOSEN_CARD);
      }
      return;
    }
    if (source.name === RoleNames.THIEF) {
      this.validateGamePlayThiefChosenCard(chosenCard, game);
    } else if (source.name === RoleNames.ACTOR) {
      this.validateGamePlayActorChosenCard(chosenCard, game);
    }
  }

  private validateGamePlaySurvivorsTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    const { action } = game.currentPlay;
    if (action !== GamePlayActions.BURY_DEAD_BODIES) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(playTargets, PlayerInteractionTypes.STEAL_ROLE, game);
    if (!playTargets.length) {
      return;
    }
    const devotedServantPlayer = getPlayerWithCurrentRole(game, RoleNames.DEVOTED_SERVANT);
    if (!devotedServantPlayer || !isPlayerAliveAndPowerful(devotedServantPlayer, game) ||
      doesPlayerHaveActiveAttributeWithName(devotedServantPlayer, PlayerAttributeNames.IN_LOVE, game)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.DEVOTED_SERVANT_CANT_STEAL_ROLE);
    }
    const targetedPlayer = playTargets[0].player;
    const canRoleTargetedPlayerBeStolen = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, PlayerInteractionTypes.STEAL_ROLE, game);
    if (!canRoleTargetedPlayerBeStolen) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_DEVOTED_SERVANT_TARGET);
    }
  }

  private validateDrankLifePotionTargets(drankLifePotionTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    if (drankLifePotionTargets.length > 1) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_DRANK_LIFE_POTION_TARGETS);
    }
    if (drankLifePotionTargets.length &&
      !isPlayerInteractableWithInteractionTypeInCurrentGamePlay(drankLifePotionTargets[0].player._id, PlayerInteractionTypes.GIVE_LIFE_POTION, game)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_LIFE_POTION_TARGET);
    }
  }

  private validateDrankDeathPotionTargets(drankDeathPotionTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    if (drankDeathPotionTargets.length > 1) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_DRANK_DEATH_POTION_TARGETS);
    }
    if (drankDeathPotionTargets.length &&
      !isPlayerInteractableWithInteractionTypeInCurrentGamePlay(drankDeathPotionTargets[0].player._id, PlayerInteractionTypes.GIVE_DEATH_POTION, game)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_DEATH_POTION_TARGET);
    }
  }

  private async validateGamePlayWitchTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): Promise<void> {
    const witchPlayer = getPlayerWithCurrentRole(game, RoleNames.WITCH);
    if (!witchPlayer) {
      throw createCantFindPlayerWithCurrentRoleUnexpectedException("validateGamePlayWitchTargets", { gameId: game._id, roleName: RoleNames.WITCH });
    }
    const hasWitchUsedLifePotion = (await this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, witchPlayer._id, WitchPotions.LIFE)).length > 0;
    const drankLifePotionTargets = playTargets.filter(({ drankPotion }) => drankPotion === WitchPotions.LIFE);
    const hasWitchUsedDeathPotion = (await this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, witchPlayer._id, WitchPotions.DEATH)).length > 0;
    const drankDeathPotionTargets = playTargets.filter(({ drankPotion }) => drankPotion === WitchPotions.DEATH);
    if (hasWitchUsedLifePotion && drankLifePotionTargets.length || hasWitchUsedDeathPotion && drankDeathPotionTargets.length) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);
    }
    this.validateDrankLifePotionTargets(drankLifePotionTargets, game);
    this.validateDrankDeathPotionTargets(drankDeathPotionTargets, game);
  }

  private validateGamePlayAccursedWolfFatherTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, PlayerInteractionTypes.INFECT, game);
    if (!playTargets.length) {
      return;
    }
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeInfected = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, PlayerInteractionTypes.INFECT, game);
    if (!canTargetedPlayerBeInfected) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_ACCURSED_WOLF_FATHER_TARGET);
    }
  }

  private validateGamePlayWerewolvesTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, PlayerInteractionTypes.EAT, game);
    if (!playTargets.length) {
      return;
    }
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeEaten = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, PlayerInteractionTypes.EAT, game);
    if (game.currentPlay.source.name === PlayerGroups.WEREWOLVES && !canTargetedPlayerBeEaten) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WEREWOLVES_TARGET);
    }
    if (game.currentPlay.source.name === RoleNames.BIG_BAD_WOLF && !canTargetedPlayerBeEaten) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_BIG_BAD_WOLF_TARGET);
    }
    if (game.currentPlay.source.name === RoleNames.WHITE_WEREWOLF && !canTargetedPlayerBeEaten) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WHITE_WEREWOLF_TARGET);
    }
  }

  private validateGamePlayHunterTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, PlayerInteractionTypes.SHOOT, game);
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeShot = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, PlayerInteractionTypes.SHOOT, game);
    if (!canTargetedPlayerBeShot) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_HUNTER_TARGET);
    }
  }

  private validateGamePlayScapegoatTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, PlayerInteractionTypes.BAN_VOTING, game);
    if (playTargets.some(({ player }) => !isPlayerInteractableWithInteractionTypeInCurrentGamePlay(player._id, PlayerInteractionTypes.BAN_VOTING, game))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SCAPEGOAT_TARGETS);
    }
  }

  private validateGamePlayCupidTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, PlayerInteractionTypes.CHARM, game);
    if (playTargets.some(({ player }) => !isPlayerInteractableWithInteractionTypeInCurrentGamePlay(player._id, PlayerInteractionTypes.CHARM, game))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_CUPID_TARGETS);
    }
  }

  private validateGamePlayFoxTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, PlayerInteractionTypes.SNIFF, game);
    if (!playTargets.length) {
      return;
    }
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeSniffed = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, PlayerInteractionTypes.SNIFF, game);
    if (!canTargetedPlayerBeSniffed) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_FOX_TARGET);
    }
  }

  private validateGamePlaySeerTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, PlayerInteractionTypes.LOOK, game);
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeSeen = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, PlayerInteractionTypes.LOOK, game);
    if (!canTargetedPlayerBeSeen) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SEER_TARGET);
    }
  }

  private validateGamePlayScandalmongerTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, PlayerInteractionTypes.MARK, game);
    if (!playTargets.length) {
      return;
    }
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeMarked = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, PlayerInteractionTypes.MARK, game);
    if (!canTargetedPlayerBeMarked) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SCANDALMONGER_TARGET);
    }
  }

  private validateGamePlayWildChildTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, PlayerInteractionTypes.CHOOSE_AS_MODEL, game);
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeChosenAsModel = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, PlayerInteractionTypes.CHOOSE_AS_MODEL, game);
    if (!canTargetedPlayerBeChosenAsModel) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WILD_CHILD_TARGET);
    }
  }

  private validateGamePlayPiedPiperTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, PlayerInteractionTypes.CHARM, game);
    if (playTargets.some(({ player }) => !isPlayerInteractableWithInteractionTypeInCurrentGamePlay(player._id, PlayerInteractionTypes.CHARM, game))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_PIED_PIPER_TARGETS);
    }
  }

  private validateGamePlayDefenderTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, PlayerInteractionTypes.PROTECT, game);
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeProtected = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, PlayerInteractionTypes.PROTECT, game);
    if (!canTargetedPlayerBeProtected) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_DEFENDER_TARGET);
    }
  }

  private validateGamePlaySheriffTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE, game);
    this.validateGamePlayTargetsBoundaries(playTargets, PlayerInteractionTypes.SENTENCE_TO_DEATH, game);
    const targetedPlayer = playTargets[0].player;
    const canTargetBecomeSheriff = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE, game);
    if (game.currentPlay.action === GamePlayActions.DELEGATE && !canTargetBecomeSheriff) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SHERIFF_DELEGATE_TARGET);
    }
    const canTargetBeSentencedToDeath = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, PlayerInteractionTypes.SENTENCE_TO_DEATH, game);
    if (game.currentPlay.action === GamePlayActions.SETTLE_VOTES && !canTargetBeSentencedToDeath) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SHERIFF_SETTLE_VOTES_TARGET);
    }
  }

  private validateGamePlayTargetsBoundaries(playTargets: MakeGamePlayTargetWithRelationsDto[], interactionType: PlayerInteractionTypes, game: GameWithCurrentPlay): void {
    const { interactions } = game.currentPlay.source;
    const interaction = interactions?.find(({ type }) => type === interactionType);
    if (!interaction) {
      return;
    }
    if (playTargets.length < interaction.boundaries.min) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_LESS_TARGETS);
    }
    if (playTargets.length > interaction.boundaries.max) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_TARGETS);
    }
  }

  private async validateGamePlaySourceTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): Promise<void> {
    const gamePlaySourceValidationMethods: Partial<Record<GamePlaySourceName, () => Promise<void> | void>> = {
      [PlayerAttributeNames.SHERIFF]: () => this.validateGamePlaySheriffTargets(playTargets, game),
      [PlayerGroups.SURVIVORS]: () => this.validateGamePlaySurvivorsTargets(playTargets, game),
      [PlayerGroups.WEREWOLVES]: () => this.validateGamePlayWerewolvesTargets(playTargets, game),
      [RoleNames.ACCURSED_WOLF_FATHER]: () => this.validateGamePlayAccursedWolfFatherTargets(playTargets, game),
      [RoleNames.BIG_BAD_WOLF]: () => this.validateGamePlayWerewolvesTargets(playTargets, game),
      [RoleNames.WHITE_WEREWOLF]: () => this.validateGamePlayWerewolvesTargets(playTargets, game),
      [RoleNames.DEFENDER]: () => this.validateGamePlayDefenderTargets(playTargets, game),
      [RoleNames.PIED_PIPER]: () => this.validateGamePlayPiedPiperTargets(playTargets, game),
      [RoleNames.WILD_CHILD]: () => this.validateGamePlayWildChildTargets(playTargets, game),
      [RoleNames.SCANDALMONGER]: () => this.validateGamePlayScandalmongerTargets(playTargets, game),
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

  private validateTargetsPotionUsage(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    const { source: currentPlaySource, action: currentPlayAction } = game.currentPlay;
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
    this.validateTargetsPotionUsage(playTargets, game);
    await this.validateGamePlaySourceTargets(playTargets, game);
  }

  private validateGamePlayVotesTieBreakerWithRelationsDto(playVotes: MakeGamePlayVoteWithRelationsDto[], game: GameWithCurrentPlay): void {
    const { cause } = game.currentPlay;
    const areEveryTargetsInNominatedPlayers = playVotes.every(({ target }) =>
      isPlayerInteractableWithInteractionTypeInCurrentGamePlay(target._id, PlayerInteractionTypes.VOTE, game));
    if (cause === GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES && !areEveryTargetsInNominatedPlayers) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_TARGET_FOR_TIE_BREAKER);
    }
  }

  private validateGamePlayVotesWithRelationsDtoSourceAndTarget(playVotes: MakeGamePlayVoteWithRelationsDto[], game: GameWithCurrentPlay): void {
    const { currentPlay } = game;
    if (playVotes.some(({ source }) => !currentPlay.source.players?.find(({ _id }) => _id.equals(source._id)))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_SOURCE);
    }
    if (playVotes.some(({ target }) => !isPlayerInteractableInCurrentGamePlay(target._id, game))) {
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
    const { isSideRandomlyChosen } = game.options.roles.wolfHound;
    if (chosenSide !== undefined && (game.currentPlay.action !== GamePlayActions.CHOOSE_SIDE || isSideRandomlyChosen)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_CHOSEN_SIDE);
    }
    if (chosenSide === undefined && game.currentPlay.action === GamePlayActions.CHOOSE_SIDE && !isSideRandomlyChosen) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.REQUIRED_CHOSEN_SIDE);
    }
  }

  private validateGamePlayWithRelationsDtoJudgeRequest({ doesJudgeRequestAnotherVote }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): void {
    if (doesJudgeRequestAnotherVote !== undefined && game.currentPlay.action !== GamePlayActions.REQUEST_ANOTHER_VOTE) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_STUTTERING_JUDGE_VOTE_REQUEST);
    }
  }
}