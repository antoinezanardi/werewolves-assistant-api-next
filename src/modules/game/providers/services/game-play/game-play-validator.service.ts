import { Injectable } from "@nestjs/common";

import type { MakeGamePlayTargetWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import type { MakeGamePlayVoteWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import type { MakeGamePlayWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import { isPlayerInteractableInCurrentGamePlay, isPlayerInteractableWithInteractionTypeInCurrentGamePlay } from "@/modules/game/helpers/game-play/game-play.helpers";
import { createGame } from "@/modules/game/helpers/game.factory";
import { getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helpers";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import { isPlayerAliveAndPowerful } from "@/modules/game/helpers/player/player.helpers";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import { GamePlaySourceName, GamePlayType } from "@/modules/game/types/game-play/game-play.types";
import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play.types";
import { PlayerInteractionType } from "@/modules/game/types/player/player-interaction/player-interaction.types";

import { BadGamePlayPayloadReasons } from "@/shared/exception/enums/bad-game-play-payload-error.enum";
import { createCantFindPlayerWithCurrentRoleUnexpectedException, createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";
import { BadGamePlayPayloadException } from "@/shared/exception/types/bad-game-play-payload-exception.types";

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
      if (chosenCard.recipient !== "actor") {
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
    if (chosenCard && chosenCard.recipient !== "thief") {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.CHOSEN_CARD_NOT_FOR_THIEF);
    }
  }

  private validateGamePlayWithRelationsDtoChosenCard({ chosenCard }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): void {
    const { action, source } = game.currentPlay;
    if (action !== "choose-card") {
      if (chosenCard) {
        throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_CHOSEN_CARD);
      }
      return;
    }
    if (source.name === "thief") {
      this.validateGamePlayThiefChosenCard(chosenCard, game);
    } else if (source.name === "actor") {
      this.validateGamePlayActorChosenCard(chosenCard, game);
    }
  }

  private validateGamePlaySurvivorsTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    const { action } = game.currentPlay;
    if (action !== "bury-dead-bodies") {
      return;
    }
    this.validateGamePlayTargetsBoundaries(playTargets, "steal-role", game);
    if (!playTargets.length) {
      return;
    }
    const devotedServantPlayer = getPlayerWithCurrentRole(game, "devoted-servant");
    if (!devotedServantPlayer || !isPlayerAliveAndPowerful(devotedServantPlayer, game) ||
      doesPlayerHaveActiveAttributeWithName(devotedServantPlayer, "in-love", game)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.DEVOTED_SERVANT_CANT_STEAL_ROLE);
    }
    const targetedPlayer = playTargets[0].player;
    const canRoleTargetedPlayerBeStolen = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, "steal-role", game);
    if (!canRoleTargetedPlayerBeStolen) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_DEVOTED_SERVANT_TARGET);
    }
  }

  private validateDrankLifePotionTargets(drankLifePotionTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    if (drankLifePotionTargets.length > 1) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_DRANK_LIFE_POTION_TARGETS);
    }
    if (drankLifePotionTargets.length &&
      !isPlayerInteractableWithInteractionTypeInCurrentGamePlay(drankLifePotionTargets[0].player._id, "give-life-potion", game)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_LIFE_POTION_TARGET);
    }
  }

  private validateDrankDeathPotionTargets(drankDeathPotionTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    if (drankDeathPotionTargets.length > 1) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_DRANK_DEATH_POTION_TARGETS);
    }
    if (drankDeathPotionTargets.length &&
      !isPlayerInteractableWithInteractionTypeInCurrentGamePlay(drankDeathPotionTargets[0].player._id, "give-death-potion", game)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_DEATH_POTION_TARGET);
    }
  }

  private async validateGamePlayWitchTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): Promise<void> {
    const witchPlayer = getPlayerWithCurrentRole(game, "witch");
    if (!witchPlayer) {
      throw createCantFindPlayerWithCurrentRoleUnexpectedException("validateGamePlayWitchTargets", { gameId: game._id, roleName: "witch" });
    }
    const hasWitchUsedLifePotion = (await this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, witchPlayer._id, "life")).length > 0;
    const drankLifePotionTargets = playTargets.filter(({ drankPotion }) => drankPotion === "life");
    const hasWitchUsedDeathPotion = (await this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, witchPlayer._id, "death")).length > 0;
    const drankDeathPotionTargets = playTargets.filter(({ drankPotion }) => drankPotion === "death");
    if (hasWitchUsedLifePotion && drankLifePotionTargets.length || hasWitchUsedDeathPotion && drankDeathPotionTargets.length) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);
    }
    this.validateDrankLifePotionTargets(drankLifePotionTargets, game);
    this.validateDrankDeathPotionTargets(drankDeathPotionTargets, game);
  }

  private validateGamePlayAccursedWolfFatherTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, "infect", game);
    if (!playTargets.length) {
      return;
    }
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeInfected = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, "infect", game);
    if (!canTargetedPlayerBeInfected) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_ACCURSED_WOLF_FATHER_TARGET);
    }
  }

  private validateGamePlayWerewolvesTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, "eat", game);
    if (!playTargets.length) {
      return;
    }
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeEaten = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, "eat", game);
    if (game.currentPlay.source.name === "werewolves" && !canTargetedPlayerBeEaten) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WEREWOLVES_TARGET);
    }
    if (game.currentPlay.source.name === "big-bad-wolf" && !canTargetedPlayerBeEaten) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_BIG_BAD_WOLF_TARGET);
    }
    if (game.currentPlay.source.name === "white-werewolf" && !canTargetedPlayerBeEaten) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WHITE_WEREWOLF_TARGET);
    }
  }

  private validateGamePlayHunterTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, "shoot", game);
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeShot = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, "shoot", game);
    if (!canTargetedPlayerBeShot) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_HUNTER_TARGET);
    }
  }

  private validateGamePlayScapegoatTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, "ban-voting", game);
    if (playTargets.some(({ player }) => !isPlayerInteractableWithInteractionTypeInCurrentGamePlay(player._id, "ban-voting", game))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SCAPEGOAT_TARGETS);
    }
  }

  private validateGamePlayCupidTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, "charm", game);
    if (playTargets.some(({ player }) => !isPlayerInteractableWithInteractionTypeInCurrentGamePlay(player._id, "charm", game))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_CUPID_TARGETS);
    }
  }

  private validateGamePlayFoxTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, "sniff", game);
    if (!playTargets.length) {
      return;
    }
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeSniffed = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, "sniff", game);
    if (!canTargetedPlayerBeSniffed) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_FOX_TARGET);
    }
  }

  private validateGamePlaySeerTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, "look", game);
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeSeen = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, "look", game);
    if (!canTargetedPlayerBeSeen) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SEER_TARGET);
    }
  }

  private validateGamePlayScandalmongerTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, "mark", game);
    if (!playTargets.length) {
      return;
    }
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeMarked = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, "mark", game);
    if (!canTargetedPlayerBeMarked) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SCANDALMONGER_TARGET);
    }
  }

  private validateGamePlayWildChildTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, "choose-as-model", game);
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeChosenAsModel = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, "choose-as-model", game);
    if (!canTargetedPlayerBeChosenAsModel) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WILD_CHILD_TARGET);
    }
  }

  private validateGamePlayPiedPiperTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, "charm", game);
    if (playTargets.some(({ player }) => !isPlayerInteractableWithInteractionTypeInCurrentGamePlay(player._id, "charm", game))) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_PIED_PIPER_TARGETS);
    }
  }

  private validateGamePlayDefenderTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, "protect", game);
    const targetedPlayer = playTargets[0].player;
    const canTargetedPlayerBeProtected = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, "protect", game);
    if (!canTargetedPlayerBeProtected) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_DEFENDER_TARGET);
    }
  }

  private validateGamePlaySheriffTargets(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    this.validateGamePlayTargetsBoundaries(playTargets, "transfer-sheriff-role", game);
    this.validateGamePlayTargetsBoundaries(playTargets, "sentence-to-death", game);
    const targetedPlayer = playTargets[0].player;
    const canTargetBecomeSheriff = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, "transfer-sheriff-role", game);
    if (game.currentPlay.action === "delegate" && !canTargetBecomeSheriff) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SHERIFF_DELEGATE_TARGET);
    }
    const canTargetBeSentencedToDeath = isPlayerInteractableWithInteractionTypeInCurrentGamePlay(targetedPlayer._id, "sentence-to-death", game);
    if (game.currentPlay.action === "settle-votes" && !canTargetBeSentencedToDeath) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SHERIFF_SETTLE_VOTES_TARGET);
    }
  }

  private validateGamePlayTargetsBoundaries(playTargets: MakeGamePlayTargetWithRelationsDto[], interactionType: PlayerInteractionType, game: GameWithCurrentPlay): void {
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
      "sheriff": () => this.validateGamePlaySheriffTargets(playTargets, game),
      "survivors": () => this.validateGamePlaySurvivorsTargets(playTargets, game),
      "werewolves": () => this.validateGamePlayWerewolvesTargets(playTargets, game),
      "accursed-wolf-father": () => this.validateGamePlayAccursedWolfFatherTargets(playTargets, game),
      "big-bad-wolf": () => this.validateGamePlayWerewolvesTargets(playTargets, game),
      "white-werewolf": () => this.validateGamePlayWerewolvesTargets(playTargets, game),
      "defender": () => this.validateGamePlayDefenderTargets(playTargets, game),
      "pied-piper": () => this.validateGamePlayPiedPiperTargets(playTargets, game),
      "wild-child": () => this.validateGamePlayWildChildTargets(playTargets, game),
      "scandalmonger": () => this.validateGamePlayScandalmongerTargets(playTargets, game),
      "seer": () => this.validateGamePlaySeerTargets(playTargets, game),
      "fox": () => this.validateGamePlayFoxTargets(playTargets, game),
      "cupid": () => this.validateGamePlayCupidTargets(playTargets, game),
      "scapegoat": () => this.validateGamePlayScapegoatTargets(playTargets, game),
      "hunter": () => this.validateGamePlayHunterTargets(playTargets, game),
      "witch": async() => this.validateGamePlayWitchTargets(playTargets, game),
    };
    const gamePlaySourceValidationMethod = gamePlaySourceValidationMethods[game.currentPlay.source.name];
    if (gamePlaySourceValidationMethod) {
      await gamePlaySourceValidationMethod();
    }
  }

  private validateTargetsPotionUsage(playTargets: MakeGamePlayTargetWithRelationsDto[], game: GameWithCurrentPlay): void {
    const { source: currentPlaySource, action: currentPlayAction } = game.currentPlay;
    const hasSomePlayerDrankPotion = playTargets.some(({ drankPotion }) => drankPotion);
    if (hasSomePlayerDrankPotion && (currentPlayAction !== "use-potions" || currentPlaySource.name !== "witch")) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);
    }
  }

  private async validateGamePlayTargetsWithRelationsDto(playTargets: MakeGamePlayTargetWithRelationsDto[] | undefined, game: GameWithCurrentPlay): Promise<void> {
    const targetActionsTypes: GamePlayType[] = ["target", "bury-dead-bodies"];
    const { currentPlay } = game;
    if (!targetActionsTypes.includes(game.currentPlay.type)) {
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
    const { action, cause } = game.currentPlay;
    const interactionType = action === "vote" ? "vote" : "choose-as-sheriff";
    const areEveryTargetsInNominatedPlayers = playVotes.every(({ target }) =>
      isPlayerInteractableWithInteractionTypeInCurrentGamePlay(target._id, interactionType, game));
    if (cause === "previous-votes-were-in-ties" && !areEveryTargetsInNominatedPlayers) {
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
    if (currentPlay.type !== "vote") {
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
    if (game.currentPlay.cause === "previous-votes-were-in-ties") {
      this.validateGamePlayVotesTieBreakerWithRelationsDto(playVotes, game);
    }
    this.validateGamePlayVotesWithRelationsDtoSourceAndTarget(playVotes, game);
  }

  private validateGamePlayWithRelationsDtoChosenSide({ chosenSide }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): void {
    const { isSideRandomlyChosen } = game.options.roles.wolfHound;
    if (chosenSide !== undefined && (game.currentPlay.action !== "choose-side" || isSideRandomlyChosen)) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_CHOSEN_SIDE);
    }
    if (chosenSide === undefined && game.currentPlay.action === "choose-side" && !isSideRandomlyChosen) {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.REQUIRED_CHOSEN_SIDE);
    }
  }

  private validateGamePlayWithRelationsDtoJudgeRequest({ doesJudgeRequestAnotherVote }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): void {
    if (doesJudgeRequestAnotherVote !== undefined && game.currentPlay.action !== "request-another-vote") {
      throw new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_STUTTERING_JUDGE_VOTE_REQUEST);
    }
  }
}