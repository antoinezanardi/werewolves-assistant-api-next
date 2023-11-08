import { Injectable } from "@nestjs/common";

import { createGamePlayEligibleTargetsBoundaries } from "@/modules/game/helpers/game-play/game-play-eligible-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.factory";
import { createInteractablePlayer } from "@/modules/game/helpers/game-play/game-play-eligible-targets/interactable-player/interactable-player.factory";
import { doesPlayerHaveActiveAttributeWithName } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups, PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import { createGamePlayEligibleTargets } from "@/modules/game/helpers/game-play/game-play-eligible-targets/game-play-eligible-targets.factory";
import { createGamePlay } from "@/modules/game/helpers/game-play/game-play.factory";
import { getAlivePlayers, getAliveVillagerSidedPlayers, getAllowedToVotePlayers, getLeftToCharmByPiedPiperPlayers, getLeftToEatByWerewolvesPlayers, getLeftToEatByWhiteWerewolfPlayers } from "@/modules/game/helpers/game.helper";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import type { GamePlayEligibleTargetsBoundaries } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.schema";
import type { GamePlayEligibleTargets } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets.schema";
import type { InteractablePlayer } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/interactable-player.schema";
import type { PlayerInteraction } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/player-interaction/player-interaction.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { GamePlaySourceName } from "@/modules/game/types/game-play.type";
import { WEREWOLF_ROLES } from "@/modules/role/constants/role.constant";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createCantFindLastNominatedPlayersUnexpectedException, createMalformedCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

@Injectable()
export class GamePlayAugmenterService {
  private readonly getEligibleTargetsPlayMethods: Partial<
  Record<GamePlaySourceName, (game: Game, gamePlay: GamePlay) => GamePlayEligibleTargets | Promise<GamePlayEligibleTargets>>
  > = {
      [PlayerAttributeNames.SHERIFF]: async(game, gamePlay) => this.getSheriffGamePlayEligibleTargets(game, gamePlay),
      [PlayerGroups.SURVIVORS]: (game, gamePlay) => this.getSurvivorsGamePlayEligibleTargets(game, gamePlay),
      [PlayerGroups.WEREWOLVES]: game => this.getWerewolvesGamePlayEligibleTargets(game),
      [RoleNames.BIG_BAD_WOLF]: game => this.getBigBadWolfGamePlayEligibleTargets(game),
      [RoleNames.CUPID]: game => this.getCupidGamePlayEligibleTargets(game),
      [RoleNames.FOX]: game => this.getFoxGamePlayEligibleTargets(game),
      [RoleNames.GUARD]: async game => this.getGuardGamePlayEligibleTargets(game),
      [RoleNames.HUNTER]: game => this.getHunterGamePlayEligibleTargets(game),
      [RoleNames.PIED_PIPER]: game => this.getPiedPiperGamePlayEligibleTargets(game),
      [RoleNames.RAVEN]: game => this.getRavenGamePlayEligibleTargets(game),
      [RoleNames.SCAPEGOAT]: game => this.getScapegoatGamePlayEligibleTargets(game),
      [RoleNames.SEER]: game => this.getSeerGamePlayEligibleTargets(game),
      [RoleNames.WHITE_WEREWOLF]: game => this.getWhiteWerewolfGamePlayEligibleTargets(game),
      [RoleNames.WILD_CHILD]: game => this.getWildChildGamePlayEligibleTargets(game),
      [RoleNames.WITCH]: async game => this.getWitchGamePlayEligibleTargets(game),
    };

  private readonly canBeSkippedPlayMethods: Partial<Record<GamePlaySourceName, (game: Game, gamePlay: GamePlay) => boolean>> = {
    [PlayerGroups.CHARMED]: () => true,
    [PlayerGroups.LOVERS]: () => true,
    [PlayerGroups.SURVIVORS]: (game, gamePlay) => this.canSurvivorsSkipGamePlay(game, gamePlay),
    [RoleNames.BIG_BAD_WOLF]: game => this.canBigBadWolfSkipGamePlay(game),
    [RoleNames.FOX]: () => true,
    [RoleNames.RAVEN]: () => true,
    [RoleNames.SCAPEGOAT]: () => true,
    [RoleNames.THIEF]: game => this.canThiefSkipGamePlay(game),
    [RoleNames.TWO_SISTERS]: () => true,
    [RoleNames.THREE_BROTHERS]: () => true,
    [RoleNames.WHITE_WEREWOLF]: () => true,
    [RoleNames.WITCH]: () => true,
  };

  public constructor(private readonly gameHistoryRecordService: GameHistoryRecordService) {}

  public setGamePlayCanBeSkipped(gamePlay: GamePlay, game: Game): GamePlay {
    const clonedGamePlay = createGamePlay(gamePlay);
    clonedGamePlay.canBeSkipped = this.canGamePlayBeSkipped(game, gamePlay);
    return clonedGamePlay;
  }

  public async setGamePlayEligibleTargets(gamePlay: GamePlay, game: Game): Promise<GamePlay> {
    const clonedGamePlay = createGamePlay(gamePlay);
    clonedGamePlay.eligibleTargets = await this.getGamePlayEligibleTargets(gamePlay, game);
    return clonedGamePlay;
  }

  private async getSheriffSettlesVotesGamePlayEligibleTargets(game: Game): Promise<GamePlayEligibleTargets> {
    const lastTieInVotesRecord = await this.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord(game._id, GamePlayActions.VOTE);
    if (lastTieInVotesRecord?.play.voting?.nominatedPlayers === undefined || lastTieInVotesRecord.play.voting.nominatedPlayers.length === 0) {
      throw createCantFindLastNominatedPlayersUnexpectedException("getSheriffSettlesVotesGamePlayEligibleTargets", { gameId: game._id });
    }
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.SENTENCE_TO_DEATH, source: PlayerAttributeNames.SHERIFF }];
    const interactablePlayers: InteractablePlayer[] = lastTieInVotesRecord.play.voting.nominatedPlayers.map(player => ({ player, interactions }));
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: 1, max: 1 };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private getSheriffDelegatesGamePlayEligibleTargets(game: Game): GamePlayEligibleTargets {
    const alivePlayers = getAlivePlayers(game);
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE, source: PlayerAttributeNames.SHERIFF }];
    const interactablePlayers: InteractablePlayer[] = alivePlayers.map(player => ({ player, interactions }));
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: 1, max: 1 };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private async getSheriffGamePlayEligibleTargets(game: Game, gamePlay: GamePlay): Promise<GamePlayEligibleTargets> {
    if (gamePlay.action === GamePlayActions.DELEGATE) {
      return this.getSheriffDelegatesGamePlayEligibleTargets(game);
    }
    if (gamePlay.action === GamePlayActions.SETTLE_VOTES) {
      return this.getSheriffSettlesVotesGamePlayEligibleTargets(game);
    }
    throw createMalformedCurrentGamePlayUnexpectedException("getSheriffGamePlayEligibleTargets", gamePlay, game._id);
  }

  private getSurvivorsVoteGamePlayEligibleTargets(game: Game, gamePlay: GamePlay): GamePlayEligibleTargets {
    const canSurvivorsSkipVotes = this.canSurvivorsSkipGamePlay(game, gamePlay);
    const alivePlayers = getAlivePlayers(game);
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.VOTE, source: PlayerGroups.SURVIVORS }];
    const interactablePlayers: InteractablePlayer[] = alivePlayers.map(player => ({ player, interactions }));
    const minBoundaries = canSurvivorsSkipVotes ? 0 : 1;
    const maxBoundaries = getAllowedToVotePlayers(game).length;
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: minBoundaries, max: maxBoundaries };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private getSurvivorsElectSheriffGamePlayEligibleTargets(game: Game): GamePlayEligibleTargets {
    const alivePlayers = getAlivePlayers(game);
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.CHOOSE_AS_SHERIFF, source: PlayerGroups.SURVIVORS }];
    const interactablePlayers: InteractablePlayer[] = alivePlayers.map(player => ({ player, interactions }));
    const maxBoundaries = getAllowedToVotePlayers(game).length;
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: 1, max: maxBoundaries };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private getSurvivorsGamePlayEligibleTargets(game: Game, gamePlay: GamePlay): GamePlayEligibleTargets {
    if (gamePlay.action === GamePlayActions.VOTE) {
      return this.getSurvivorsVoteGamePlayEligibleTargets(game, gamePlay);
    }
    if (gamePlay.action === GamePlayActions.ELECT_SHERIFF) {
      return this.getSurvivorsElectSheriffGamePlayEligibleTargets(game);
    }
    throw createMalformedCurrentGamePlayUnexpectedException("getSurvivorsGamePlayEligibleTargets", gamePlay, game._id);
  }

  private getWerewolvesGamePlayEligibleTargets(game: Game): GamePlayEligibleTargets {
    const aliveVillagerSidedPlayers = getAliveVillagerSidedPlayers(game);
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.EAT, source: PlayerGroups.WEREWOLVES }];
    const interactablePlayers: InteractablePlayer[] = aliveVillagerSidedPlayers.map(player => ({ player, interactions }));
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: 1, max: 1 };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private getBigBadWolfGamePlayEligibleTargets(game: Game): GamePlayEligibleTargets {
    const leftToEatByBigBadWolfPlayers = getLeftToEatByWerewolvesPlayers(game);
    const leftToEatByBigBadWolfPlayersCount = leftToEatByBigBadWolfPlayers.length ? 1 : 0;
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.EAT, source: RoleNames.BIG_BAD_WOLF }];
    const interactablePlayers: InteractablePlayer[] = leftToEatByBigBadWolfPlayers.map(player => ({ player, interactions }));
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: leftToEatByBigBadWolfPlayersCount, max: leftToEatByBigBadWolfPlayersCount };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private getCupidGamePlayEligibleTargets(game: Game): GamePlayEligibleTargets {
    const alivePlayers = getAlivePlayers(game);
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.CHARM, source: RoleNames.CUPID }];
    const interactablePlayers: InteractablePlayer[] = alivePlayers.map(player => ({ player, interactions }));
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: 2, max: 2 };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private getFoxGamePlayEligibleTargets(game: Game): GamePlayEligibleTargets {
    const alivePlayers = getAlivePlayers(game);
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.SNIFF, source: RoleNames.FOX }];
    const interactablePlayers: InteractablePlayer[] = alivePlayers.map(player => ({ player, interactions }));
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: 0, max: 1 };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private async getGuardGamePlayEligibleTargets(game: Game): Promise<GamePlayEligibleTargets> {
    const { canProtectTwice } = game.options.roles.guard;
    const alivePlayers = getAlivePlayers(game);
    const lastGuardProtectRecord = await this.gameHistoryRecordService.getLastGameHistoryGuardProtectsRecord(game._id);
    const lastProtectedPlayer = lastGuardProtectRecord?.play.targets?.[0].player;
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.PROTECT, source: RoleNames.GUARD }];
    const possibleGuardTargets = canProtectTwice || !lastProtectedPlayer ? alivePlayers : alivePlayers.filter(player => !player._id.equals(lastProtectedPlayer._id));
    const interactablePlayers: InteractablePlayer[] = possibleGuardTargets.map(player => ({ player, interactions }));
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: 1, max: 1 };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private getHunterGamePlayEligibleTargets(game: Game): GamePlayEligibleTargets {
    const alivePlayers = getAlivePlayers(game);
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.SHOOT, source: RoleNames.HUNTER }];
    const interactablePlayers: InteractablePlayer[] = alivePlayers.map(player => ({ player, interactions }));
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: 1, max: 1 };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private getPiedPiperGamePlayEligibleTargets(game: Game): GamePlayEligibleTargets {
    const { charmedPeopleCountPerNight } = game.options.roles.piedPiper;
    const leftToCharmByPiedPiperPlayers = getLeftToCharmByPiedPiperPlayers(game);
    const leftToCharmByPiedPiperPlayersCount = leftToCharmByPiedPiperPlayers.length;
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.CHARM, source: RoleNames.PIED_PIPER }];
    const interactablePlayers: InteractablePlayer[] = leftToCharmByPiedPiperPlayers.map(player => ({ player, interactions }));
    const countToCharm = Math.min(charmedPeopleCountPerNight, leftToCharmByPiedPiperPlayersCount);
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: countToCharm, max: countToCharm };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private getRavenGamePlayEligibleTargets(game: Game): GamePlayEligibleTargets {
    const alivePlayers = getAlivePlayers(game);
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.MARK, source: RoleNames.RAVEN }];
    const interactablePlayers: InteractablePlayer[] = alivePlayers.map(player => ({ player, interactions }));
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: 0, max: 1 };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private getScapegoatGamePlayEligibleTargets(game: Game): GamePlayEligibleTargets {
    const alivePlayers = getAlivePlayers(game);
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.BAN_VOTING, source: RoleNames.SCAPEGOAT }];
    const interactablePlayers: InteractablePlayer[] = alivePlayers.map(player => ({ player, interactions }));
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: 0, max: alivePlayers.length };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private getSeerGamePlayEligibleTargets(game: Game): GamePlayEligibleTargets {
    const alivePlayers = getAlivePlayers(game);
    const alivePlayersWithoutSeer = alivePlayers.filter(({ role }) => role.current !== RoleNames.SEER);
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.LOOK, source: RoleNames.SEER }];
    const interactablePlayers: InteractablePlayer[] = alivePlayersWithoutSeer.map(player => ({ player, interactions }));
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: 1, max: 1 };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private getWhiteWerewolfGamePlayEligibleTargets(game: Game): GamePlayEligibleTargets {
    const leftToEatByWhiteWerewolfPlayers = getLeftToEatByWhiteWerewolfPlayers(game);
    const maxTargetsToEatCount = leftToEatByWhiteWerewolfPlayers.length ? 1 : 0;
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.EAT, source: RoleNames.WHITE_WEREWOLF }];
    const interactablePlayers: InteractablePlayer[] = leftToEatByWhiteWerewolfPlayers.map(player => ({ player, interactions }));
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: 0, max: maxTargetsToEatCount };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private getWildChildGamePlayEligibleTargets(game: Game): GamePlayEligibleTargets {
    const alivePlayers = getAlivePlayers(game);
    const alivePlayersWithoutWildChild = alivePlayers.filter(({ role }) => role.current !== RoleNames.WILD_CHILD);
    const interactions: PlayerInteraction[] = [{ type: PlayerInteractionTypes.CHOOSE_AS_MODEL, source: RoleNames.WILD_CHILD }];
    const interactablePlayers: InteractablePlayer[] = alivePlayersWithoutWildChild.map(player => ({ player, interactions }));
    const boundaries: GamePlayEligibleTargetsBoundaries = { min: 1, max: 1 };
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private getWitchGamePlayEligibleTargetsBoundaries(hasWitchUsedLifePotion: boolean, hasWitchUsedDeathPotion: boolean): GamePlayEligibleTargetsBoundaries {
    let max = 2;
    if (hasWitchUsedLifePotion) {
      max--;
    }
    if (hasWitchUsedDeathPotion) {
      max--;
    }
    return createGamePlayEligibleTargetsBoundaries({ min: 0, max });
  }

  private getWitchGamePlayEligibleTargetsInteractablePlayers(game: Game, hasWitchUsedLifePotion: boolean, hasWitchUsedDeathPotion: boolean): InteractablePlayer[] {
    const alivePlayers = getAlivePlayers(game);
    return alivePlayers.map(player => {
      const interactions: PlayerInteraction[] = [];
      if (!hasWitchUsedLifePotion && doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.EATEN, game)) {
        interactions.push({ type: PlayerInteractionTypes.GIVE_LIFE_POTION, source: RoleNames.WITCH });
      }
      if (!hasWitchUsedDeathPotion && !doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.EATEN, game)) {
        interactions.push({ type: PlayerInteractionTypes.GIVE_DEATH_POTION, source: RoleNames.WITCH });
      }
      return createInteractablePlayer({ player, interactions });
    });
  }

  private async getWitchGamePlayEligibleTargets(game: Game): Promise<GamePlayEligibleTargets> {
    const [lifeRecords, deathRecords] = await Promise.all([
      this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, WitchPotions.LIFE),
      this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, WitchPotions.DEATH),
    ]);
    const hasWitchUsedLifePotion = lifeRecords.length > 0;
    const hasWitchUsedDeathPotion = deathRecords.length > 0;
    const interactablePlayers: InteractablePlayer[] = this.getWitchGamePlayEligibleTargetsInteractablePlayers(game, hasWitchUsedLifePotion, hasWitchUsedDeathPotion);
    const boundaries = this.getWitchGamePlayEligibleTargetsBoundaries(hasWitchUsedLifePotion, hasWitchUsedDeathPotion);
    return createGamePlayEligibleTargets({ interactablePlayers, boundaries });
  }

  private async getGamePlayEligibleTargets(gamePlay: GamePlay, game: Game): Promise<GamePlayEligibleTargets | undefined> {
    const eligibleTargetsPlayMethod = this.getEligibleTargetsPlayMethods[gamePlay.source.name];
    if (!eligibleTargetsPlayMethod) {
      return undefined;
    }
    return eligibleTargetsPlayMethod(game, gamePlay);
  }

  private canSurvivorsSkipGamePlay(game: Game, gamePlay: GamePlay): boolean {
    const { canBeSkipped } = game.options.votes;
    const isGamePlayVoteCauseAngelPresence = gamePlay.action === GamePlayActions.VOTE && gamePlay.cause === GamePlayCauses.ANGEL_PRESENCE;
    if (gamePlay.action === GamePlayActions.ELECT_SHERIFF || isGamePlayVoteCauseAngelPresence) {
      return false;
    }
    return canBeSkipped;
  }

  private canBigBadWolfSkipGamePlay(game: Game): boolean {
    const leftToEatByWerewolvesPlayers = getLeftToEatByWerewolvesPlayers(game);
    return leftToEatByWerewolvesPlayers.length === 0;
  }

  private canThiefSkipGamePlay(game: Game): boolean {
    const { mustChooseBetweenWerewolves } = game.options.roles.thief;
    if (game.additionalCards === undefined || game.additionalCards.length === 0) {
      return true;
    }
    const areAllAdditionalCardsWerewolves = game.additionalCards.every(({ roleName }) => WEREWOLF_ROLES.find(role => role.name === roleName));
    return !areAllAdditionalCardsWerewolves || !mustChooseBetweenWerewolves;
  }

  private canGamePlayBeSkipped(game: Game, gamePlay: GamePlay): boolean {
    const canBeSkippedGamePlayMethod = this.canBeSkippedPlayMethods[gamePlay.source.name];
    if (!canBeSkippedGamePlayMethod) {
      return false;
    }
    return canBeSkippedGamePlayMethod(game, gamePlay);
  }
}