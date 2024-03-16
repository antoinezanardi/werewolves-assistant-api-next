import { Injectable } from "@nestjs/common";
import { isDefined } from "class-validator";

import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups, PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import { createGamePlaySourceInteraction } from "@/modules/game/helpers/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.factory";
import { createGamePlay } from "@/modules/game/helpers/game-play/game-play.factory";
import { getAlivePlayers, getAllowedToVotePlayers, getEligibleCupidTargets, getEligiblePiedPiperTargets, getEligibleWerewolvesTargets, getEligibleWhiteWerewolfTargets, getGroupOfPlayers, getPlayersWithActiveAttributeName, getPlayersWithCurrentRole, getPlayerWithCurrentRole, isGameSourceGroup, isGameSourceRole } from "@/modules/game/helpers/game.helper";
import { doesPlayerHaveActiveAttributeWithName, doesPlayerHaveActiveAttributeWithNameAndSource } from "@/modules/game/helpers/player/player-attribute/player-attribute.helper";
import { createPlayer } from "@/modules/game/helpers/player/player.factory";
import { isPlayerAliveAndPowerful } from "@/modules/game/helpers/player/player.helper";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import type { GamePlaySourceInteraction } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { GamePlaySourceName } from "@/modules/game/types/game-play.type";
import { WEREWOLF_ROLES } from "@/modules/role/constants/role.constant";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createCantFindLastDeadPlayersUnexpectedException, createCantFindLastNominatedPlayersUnexpectedException, createCantFindPlayerWithCurrentRoleUnexpectedException, createMalformedCurrentGamePlayUnexpectedException, createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

@Injectable()
export class GamePlayAugmenterService {
  private readonly getPlaySourceInteractionsMethods: Partial<
  Record<GamePlaySourceName, (game: Game, gamePlay: GamePlay) => GamePlaySourceInteraction[] | Promise<GamePlaySourceInteraction[]>>
  > = {
      [PlayerAttributeNames.SHERIFF]: async(game, gamePlay) => this.getSheriffGamePlaySourceInteractions(game, gamePlay),
      [PlayerGroups.SURVIVORS]: async(game, gamePlay) => this.getSurvivorsGamePlaySourceInteractions(game, gamePlay),
      [PlayerGroups.WEREWOLVES]: game => this.getWerewolvesGamePlaySourceInteractions(game),
      [RoleNames.BIG_BAD_WOLF]: game => this.getBigBadWolfGamePlaySourceInteractions(game),
      [RoleNames.CUPID]: game => this.getCupidGamePlaySourceInteractions(game),
      [RoleNames.FOX]: game => this.getFoxGamePlaySourceInteractions(game),
      [RoleNames.DEFENDER]: async game => this.getDefenderGamePlaySourceInteractions(game),
      [RoleNames.HUNTER]: game => this.getHunterGamePlaySourceInteractions(game),
      [RoleNames.PIED_PIPER]: game => this.getPiedPiperGamePlaySourceInteractions(game),
      [RoleNames.SCANDALMONGER]: game => this.getScandalmongerGamePlaySourceInteractions(game),
      [RoleNames.SCAPEGOAT]: game => this.getScapegoatGamePlaySourceInteractions(game),
      [RoleNames.SEER]: game => this.getSeerGamePlaySourceInteractions(game),
      [RoleNames.WHITE_WEREWOLF]: game => this.getWhiteWerewolfGamePlaySourceInteractions(game),
      [RoleNames.WILD_CHILD]: game => this.getWildChildGamePlaySourceInteractions(game),
      [RoleNames.WITCH]: async game => this.getWitchGamePlaySourceInteractions(game),
      [RoleNames.ACCURSED_WOLF_FATHER]: async game => this.getAccursedWolfFatherGamePlaySourceInteractions(game),
    };

  private readonly canBeSkippedPlayMethods: Partial<Record<GamePlaySourceName, (game: Game, gamePlay: GamePlay) => boolean>> = {
    [PlayerGroups.CHARMED]: () => true,
    [PlayerGroups.LOVERS]: () => true,
    [PlayerGroups.SURVIVORS]: (game, gamePlay) => this.canSurvivorsSkipGamePlay(game, gamePlay),
    [RoleNames.BIG_BAD_WOLF]: game => this.canBigBadWolfSkipGamePlay(game),
    [RoleNames.FOX]: () => true,
    [RoleNames.SCANDALMONGER]: () => true,
    [RoleNames.SCAPEGOAT]: () => true,
    [RoleNames.THIEF]: game => this.canThiefSkipGamePlay(game),
    [RoleNames.TWO_SISTERS]: () => true,
    [RoleNames.THREE_BROTHERS]: () => true,
    [RoleNames.WHITE_WEREWOLF]: () => true,
    [RoleNames.WITCH]: () => true,
    [RoleNames.ACTOR]: () => true,
    [RoleNames.CUPID]: (game: Game) => this.canCupidSkipGamePlay(game),
    [RoleNames.ACCURSED_WOLF_FATHER]: () => true,
    [RoleNames.STUTTERING_JUDGE]: () => true,
  };

  public constructor(private readonly gameHistoryRecordService: GameHistoryRecordService) {}

  public setGamePlayCanBeSkipped(gamePlay: GamePlay, game: Game): GamePlay {
    const clonedGamePlay = createGamePlay(gamePlay);
    clonedGamePlay.canBeSkipped = this.canGamePlayBeSkipped(game, gamePlay);
    return clonedGamePlay;
  }

  public async setGamePlaySourceInteractions(gamePlay: GamePlay, game: Game): Promise<GamePlay> {
    const clonedGamePlay = createGamePlay(gamePlay);
    clonedGamePlay.source.interactions = await this.getGamePlaySourceInteractions(gamePlay, game);
    return clonedGamePlay;
  }

  public setGamePlaySourcePlayers(gamePlay: GamePlay, game: Game): GamePlay {
    const clonedGamePlay = createGamePlay(gamePlay);
    clonedGamePlay.source.players = this.getExpectedPlayersToPlay(game);
    return clonedGamePlay;
  }

  private async getSheriffSettlesVotesGamePlaySourceInteractions(game: Game): Promise<GamePlaySourceInteraction[]> {
    const lastTieInVotesRecord = await this.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord(game._id, GamePlayActions.VOTE);
    if (lastTieInVotesRecord?.play.voting?.nominatedPlayers === undefined || lastTieInVotesRecord.play.voting.nominatedPlayers.length === 0) {
      throw createCantFindLastNominatedPlayersUnexpectedException("getSheriffSettlesVotesGamePlaySourceInteractions", { gameId: game._id });
    }
    const eligibleTargets = lastTieInVotesRecord.play.voting.nominatedPlayers;
    const interaction = createGamePlaySourceInteraction({
      source: PlayerAttributeNames.SHERIFF,
      type: PlayerInteractionTypes.SENTENCE_TO_DEATH,
      eligibleTargets,
      boundaries: { min: 1, max: 1 },
    });
    return [interaction];
  }

  private getSheriffDelegatesGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const alivePlayersWithoutCurrentSheriff = getAlivePlayers(game).filter(player => !doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.SHERIFF, game));
    const interaction = createGamePlaySourceInteraction({
      source: PlayerAttributeNames.SHERIFF,
      type: PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE,
      eligibleTargets: alivePlayersWithoutCurrentSheriff,
      boundaries: { min: 1, max: 1 },
    });
    return [interaction];
  }

  private async getSheriffGamePlaySourceInteractions(game: Game, gamePlay: GamePlay): Promise<GamePlaySourceInteraction[]> {
    if (gamePlay.action === GamePlayActions.DELEGATE) {
      return this.getSheriffDelegatesGamePlaySourceInteractions(game);
    }
    if (gamePlay.action === GamePlayActions.SETTLE_VOTES) {
      return this.getSheriffSettlesVotesGamePlaySourceInteractions(game);
    }
    throw createMalformedCurrentGamePlayUnexpectedException("getSheriffGamePlaySourceInteractions", gamePlay, game._id);
  }

  private async getSurvivorsVoteGamePlaySourceInteractionEligibleTargets(game: Game, gamePlay: GamePlay): Promise<Player[]> {
    const alivePlayers = getAlivePlayers(game);
    if (gamePlay.cause === GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES) {
      const lastTieInVotesRecord = await this.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord(game._id, gamePlay.action);
      if (lastTieInVotesRecord?.play.voting?.nominatedPlayers === undefined || lastTieInVotesRecord.play.voting.nominatedPlayers.length === 0) {
        throw createCantFindLastNominatedPlayersUnexpectedException("getSurvivorsVoteGamePlaySourceInteractionEligibleTargets", { gameId: game._id });
      }
      return lastTieInVotesRecord.play.voting.nominatedPlayers;
    }
    return alivePlayers;
  }

  private async getSurvivorsVoteGamePlaySourceInteractions(game: Game, gamePlay: GamePlay): Promise<GamePlaySourceInteraction[]> {
    const eligibleTargets = await this.getSurvivorsVoteGamePlaySourceInteractionEligibleTargets(game, gamePlay);
    const minBoundaries = gamePlay.canBeSkipped === true ? 0 : 1;
    const maxBoundaries = getAllowedToVotePlayers(game).length;
    const interaction = createGamePlaySourceInteraction({
      source: PlayerGroups.SURVIVORS,
      type: PlayerInteractionTypes.VOTE,
      eligibleTargets,
      boundaries: { min: minBoundaries, max: maxBoundaries },
    });
    return [interaction];
  }

  private async getSurvivorsElectSheriffGamePlaySourceInteractions(game: Game, gamePlay: GamePlay): Promise<GamePlaySourceInteraction[]> {
    const eligibleTargets = await this.getSurvivorsVoteGamePlaySourceInteractionEligibleTargets(game, gamePlay);
    const maxBoundaries = getAllowedToVotePlayers(game).length;
    const interaction = createGamePlaySourceInteraction({
      source: PlayerGroups.SURVIVORS,
      type: PlayerInteractionTypes.CHOOSE_AS_SHERIFF,
      eligibleTargets,
      boundaries: { min: 1, max: maxBoundaries },
    });
    return [interaction];
  }

  private async getSurvivorsBuryDeadBodiesGamePlaySourceInteractions(game: Game): Promise<GamePlaySourceInteraction[]> {
    const devotedServantPlayer = getPlayerWithCurrentRole(game, RoleNames.DEVOTED_SERVANT);
    if (!devotedServantPlayer || !isPlayerAliveAndPowerful(devotedServantPlayer, game) ||
      doesPlayerHaveActiveAttributeWithName(devotedServantPlayer, PlayerAttributeNames.IN_LOVE, game)) {
      return [];
    }
    const previousGameHistoryRecord = await this.gameHistoryRecordService.getPreviousGameHistoryRecord(game._id);
    if (previousGameHistoryRecord?.deadPlayers === undefined || previousGameHistoryRecord.deadPlayers.length === 0) {
      throw createCantFindLastDeadPlayersUnexpectedException("getSurvivorsBuryDeadBodiesGamePlaySourceInteractions", { gameId: game._id });
    }
    const eligibleTargets = previousGameHistoryRecord.deadPlayers;
    const interaction = createGamePlaySourceInteraction({
      source: RoleNames.DEVOTED_SERVANT,
      type: PlayerInteractionTypes.STEAL_ROLE,
      eligibleTargets,
      boundaries: { min: 0, max: 1 },
    });
    return [interaction];
  }

  private async getSurvivorsGamePlaySourceInteractions(game: Game, gamePlay: GamePlay): Promise<GamePlaySourceInteraction[]> {
    const survivorsGamePlaySourceInteractionMethods: Partial<Record<
    GamePlayActions,
    (game: Game, gamePlay: GamePlay) => GamePlaySourceInteraction[] | Promise<GamePlaySourceInteraction[]>
    >> = {
      [GamePlayActions.BURY_DEAD_BODIES]: async() => this.getSurvivorsBuryDeadBodiesGamePlaySourceInteractions(game),
      [GamePlayActions.VOTE]: async() => this.getSurvivorsVoteGamePlaySourceInteractions(game, gamePlay),
      [GamePlayActions.ELECT_SHERIFF]: async() => this.getSurvivorsElectSheriffGamePlaySourceInteractions(game, gamePlay),
    };
    const sourceInteractionsMethod = survivorsGamePlaySourceInteractionMethods[gamePlay.action];
    if (!sourceInteractionsMethod) {
      throw createMalformedCurrentGamePlayUnexpectedException("getSurvivorsGamePlaySourceInteractions", gamePlay, game._id);
    }
    return sourceInteractionsMethod(game, gamePlay);
  }

  private getWerewolvesGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const aliveVillagerSidedPlayers = getEligibleWerewolvesTargets(game);
    const interaction = createGamePlaySourceInteraction({
      source: PlayerGroups.WEREWOLVES,
      type: PlayerInteractionTypes.EAT,
      eligibleTargets: aliveVillagerSidedPlayers,
      boundaries: { min: 1, max: 1 },
    });
    return [interaction];
  }

  private getBigBadWolfGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const eligibleWerewolvesTargets = getEligibleWerewolvesTargets(game);
    if (eligibleWerewolvesTargets.length === 0) {
      return [];
    }
    const interaction = createGamePlaySourceInteraction({
      source: RoleNames.BIG_BAD_WOLF,
      type: PlayerInteractionTypes.EAT,
      eligibleTargets: eligibleWerewolvesTargets,
      boundaries: { min: 1, max: 1 },
    });
    return [interaction];
  }

  private getCupidGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const expectedPlayersToCharmCount = 2;
    const eligibleCupidTargets = getEligibleCupidTargets(game);
    if (eligibleCupidTargets.length < expectedPlayersToCharmCount) {
      return [];
    }
    const interaction = createGamePlaySourceInteraction({
      source: RoleNames.CUPID,
      type: PlayerInteractionTypes.CHARM,
      eligibleTargets: eligibleCupidTargets,
      boundaries: { min: expectedPlayersToCharmCount, max: expectedPlayersToCharmCount },
    });
    return [interaction];
  }

  private getFoxGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const alivePlayers = getAlivePlayers(game);
    const interaction = createGamePlaySourceInteraction({
      source: RoleNames.FOX,
      type: PlayerInteractionTypes.SNIFF,
      eligibleTargets: alivePlayers,
      boundaries: { min: 0, max: 1 },
    });
    return [interaction];
  }

  private async getDefenderGamePlaySourceInteractions(game: Game): Promise<GamePlaySourceInteraction[]> {
    const { canProtectTwice } = game.options.roles.defender;
    const alivePlayers = getAlivePlayers(game);
    const defenderPlayer = getPlayerWithCurrentRole(game, RoleNames.DEFENDER);
    if (!defenderPlayer) {
      throw createCantFindPlayerWithCurrentRoleUnexpectedException("getDefenderGamePlaySourceInteractions", { gameId: game._id, roleName: RoleNames.DEFENDER });
    }
    const lastDefenderProtectRecord = await this.gameHistoryRecordService.getLastGameHistoryDefenderProtectsRecord(game._id, defenderPlayer._id);
    const lastProtectedPlayer = lastDefenderProtectRecord?.play.targets?.[0].player;
    const eligibleDefenderTargets = canProtectTwice || !lastProtectedPlayer ? alivePlayers : alivePlayers.filter(player => !player._id.equals(lastProtectedPlayer._id));
    const interaction = createGamePlaySourceInteraction({
      source: RoleNames.DEFENDER,
      type: PlayerInteractionTypes.PROTECT,
      eligibleTargets: eligibleDefenderTargets,
      boundaries: { min: 1, max: 1 },
    });
    return [interaction];
  }

  private getHunterGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const alivePlayers = getAlivePlayers(game);
    const interaction = createGamePlaySourceInteraction({
      source: RoleNames.HUNTER,
      type: PlayerInteractionTypes.SHOOT,
      eligibleTargets: alivePlayers,
      boundaries: { min: 1, max: 1 },
    });
    return [interaction];
  }

  private getPiedPiperGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const { charmedPeopleCountPerNight } = game.options.roles.piedPiper;
    const eligiblePiedPiperTargets = getEligiblePiedPiperTargets(game);
    const leftToCharmByPiedPiperPlayersCount = eligiblePiedPiperTargets.length;
    const countToCharm = Math.min(charmedPeopleCountPerNight, leftToCharmByPiedPiperPlayersCount);
    const interaction = createGamePlaySourceInteraction({
      source: RoleNames.PIED_PIPER,
      type: PlayerInteractionTypes.CHARM,
      eligibleTargets: eligiblePiedPiperTargets,
      boundaries: { min: countToCharm, max: countToCharm },
    });
    return [interaction];
  }

  private getScandalmongerGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const alivePlayers = getAlivePlayers(game);
    const interaction = createGamePlaySourceInteraction({
      source: RoleNames.SCANDALMONGER,
      type: PlayerInteractionTypes.MARK,
      eligibleTargets: alivePlayers,
      boundaries: { min: 0, max: 1 },
    });
    return [interaction];
  }

  private getScapegoatGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const alivePlayers = getAlivePlayers(game);
    const interaction = createGamePlaySourceInteraction({
      source: RoleNames.SCAPEGOAT,
      type: PlayerInteractionTypes.BAN_VOTING,
      eligibleTargets: alivePlayers,
      boundaries: { min: 0, max: alivePlayers.length },
    });
    return [interaction];
  }

  private getSeerGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const alivePlayers = getAlivePlayers(game);
    const alivePlayersWithoutSeer = alivePlayers.filter(({ role }) => role.current !== RoleNames.SEER);
    const interaction = createGamePlaySourceInteraction({
      source: RoleNames.SEER,
      type: PlayerInteractionTypes.LOOK,
      eligibleTargets: alivePlayersWithoutSeer,
      boundaries: { min: 1, max: 1 },
    });
    return [interaction];
  }

  private getWhiteWerewolfGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const leftToEatByWhiteWerewolfPlayers = getEligibleWhiteWerewolfTargets(game);
    if (leftToEatByWhiteWerewolfPlayers.length === 0) {
      return [];
    }
    const interactions = createGamePlaySourceInteraction({
      source: RoleNames.WHITE_WEREWOLF,
      type: PlayerInteractionTypes.EAT,
      eligibleTargets: leftToEatByWhiteWerewolfPlayers,
      boundaries: { min: 0, max: 1 },
    });
    return [interactions];
  }

  private getWildChildGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const alivePlayers = getAlivePlayers(game);
    const alivePlayersWithoutWildChild = alivePlayers.filter(({ role }) => role.current !== RoleNames.WILD_CHILD);
    const interaction = createGamePlaySourceInteraction({
      source: RoleNames.WILD_CHILD,
      type: PlayerInteractionTypes.CHOOSE_AS_MODEL,
      eligibleTargets: alivePlayersWithoutWildChild,
      boundaries: { min: 1, max: 1 },
    });
    return [interaction];
  }

  private getWitchGamePlaySourceGiveDeathPotionInteraction(game: Game, hasWitchUsedDeathPotion: boolean): GamePlaySourceInteraction | undefined {
    if (hasWitchUsedDeathPotion) {
      return undefined;
    }
    const alivePlayers = getAlivePlayers(game);
    const eligibleTargets = alivePlayers.filter(player => !doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.EATEN, game));
    return createGamePlaySourceInteraction({
      source: RoleNames.WITCH,
      type: PlayerInteractionTypes.GIVE_DEATH_POTION,
      eligibleTargets,
      boundaries: { min: 0, max: 1 },
    });
  }

  private getWitchGamePlaySourceGiveLifePotionInteraction(game: Game, hasWitchUsedLifePotion: boolean): GamePlaySourceInteraction | undefined {
    if (hasWitchUsedLifePotion) {
      return undefined;
    }
    const alivePlayers = getAlivePlayers(game);
    const eligibleTargets = alivePlayers.filter(player => doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.EATEN, game));
    return createGamePlaySourceInteraction({
      source: RoleNames.WITCH,
      type: PlayerInteractionTypes.GIVE_LIFE_POTION,
      eligibleTargets,
      boundaries: { min: 0, max: 1 },
    });
  }

  private async getWitchGamePlaySourceInteractions(game: Game): Promise<GamePlaySourceInteraction[]> {
    const witchPlayer = getPlayerWithCurrentRole(game, RoleNames.WITCH);
    if (!witchPlayer) {
      throw createCantFindPlayerWithCurrentRoleUnexpectedException("getWitchGamePlaySourceInteractions", { gameId: game._id, roleName: RoleNames.WITCH });
    }
    const [lifeRecords, deathRecords] = await Promise.all([
      this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, witchPlayer._id, WitchPotions.LIFE),
      this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, witchPlayer._id, WitchPotions.DEATH),
    ]);
    const hasWitchUsedLifePotion = lifeRecords.length > 0;
    const hasWitchUsedDeathPotion = deathRecords.length > 0;
    const giveLifePotionInteraction = this.getWitchGamePlaySourceGiveLifePotionInteraction(game, hasWitchUsedLifePotion);
    const giveDeathPotionInteraction = this.getWitchGamePlaySourceGiveDeathPotionInteraction(game, hasWitchUsedDeathPotion);
    return [giveLifePotionInteraction, giveDeathPotionInteraction].filter(isDefined);
  }

  private async getAccursedWolfFatherGamePlaySourceInteractions(game: Game): Promise<GamePlaySourceInteraction[]> {
    const accursedWolfFatherPlayer = getPlayerWithCurrentRole(game, RoleNames.ACCURSED_WOLF_FATHER);
    const exceptionInterpolations = { gameId: game._id, roleName: RoleNames.ACCURSED_WOLF_FATHER };
    if (!accursedWolfFatherPlayer) {
      throw createCantFindPlayerWithCurrentRoleUnexpectedException("getAccursedWolfFatherGamePlaySourceInteractions", exceptionInterpolations);
    }
    const infectedTargetRecords = await this.gameHistoryRecordService.getGameHistoryAccursedWolfFatherInfectsWithTargetRecords(game._id, accursedWolfFatherPlayer._id);
    if (infectedTargetRecords.length) {
      return [];
    }
    const eatenByWerewolvesPlayers = game.players.filter(player =>
      doesPlayerHaveActiveAttributeWithNameAndSource(player, PlayerAttributeNames.EATEN, PlayerGroups.WEREWOLVES, game));
    const interaction = createGamePlaySourceInteraction({
      source: RoleNames.ACCURSED_WOLF_FATHER,
      type: PlayerInteractionTypes.INFECT,
      eligibleTargets: eatenByWerewolvesPlayers,
      boundaries: { min: 0, max: 1 },
    });
    return [interaction];
  }

  private async getGamePlaySourceInteractions(gamePlay: GamePlay, game: Game): Promise<GamePlaySourceInteraction[] | undefined> {
    const playSourceInteractionsMethod = this.getPlaySourceInteractionsMethods[gamePlay.source.name];
    if (!playSourceInteractionsMethod) {
      return undefined;
    }
    const gamePlaySourceInteractions = await playSourceInteractionsMethod(game, gamePlay);
    return gamePlaySourceInteractions.length ? gamePlaySourceInteractions : undefined;
  }

  private canSurvivorsSkipGamePlay(game: Game, gamePlay: GamePlay): boolean {
    const { canBeSkipped } = game.options.votes;
    const isGamePlayVoteCauseAngelPresence = gamePlay.action === GamePlayActions.VOTE && gamePlay.cause === GamePlayCauses.ANGEL_PRESENCE;
    if (gamePlay.action === GamePlayActions.ELECT_SHERIFF || isGamePlayVoteCauseAngelPresence) {
      return false;
    }
    return gamePlay.action === GamePlayActions.BURY_DEAD_BODIES || canBeSkipped;
  }

  private canCupidSkipGamePlay(game: Game): boolean {
    const expectedPlayersToCharmCount = 2;
    const eligibleCupidTargets = getEligibleCupidTargets(game);
    return eligibleCupidTargets.length < expectedPlayersToCharmCount;
  }

  private canBigBadWolfSkipGamePlay(game: Game): boolean {
    const leftToEatByWerewolvesPlayers = getEligibleWerewolvesTargets(game);
    return leftToEatByWerewolvesPlayers.length === 0;
  }

  private canThiefSkipGamePlay(game: Game): boolean {
    const { mustChooseBetweenWerewolves } = game.options.roles.thief;
    if (game.additionalCards === undefined) {
      return true;
    }
    const werewolfRoleNames = WEREWOLF_ROLES.map(role => role.name);
    const areAllAdditionalCardsWerewolves = game.additionalCards.every(({ roleName }) => werewolfRoleNames.includes(roleName));
    return !areAllAdditionalCardsWerewolves || !mustChooseBetweenWerewolves;
  }

  private canGamePlayBeSkipped(game: Game, gamePlay: GamePlay): boolean {
    const canBeSkippedGamePlayMethod = this.canBeSkippedPlayMethods[gamePlay.source.name];
    if (!canBeSkippedGamePlayMethod) {
      return false;
    }
    return canBeSkippedGamePlayMethod(game, gamePlay);
  }

  private getExpectedPlayersToPlay(game: Game): Player[] {
    const { currentPlay } = game;
    const mustIncludeDeadPlayersGamePlayActions = [GamePlayActions.SHOOT, GamePlayActions.BAN_VOTING, GamePlayActions.DELEGATE];
    let expectedPlayersToPlay: Player[] = [];
    if (currentPlay === null) {
      throw createNoCurrentGamePlayUnexpectedException("getExpectedPlayersToPlay", { gameId: game._id });
    }
    if (isGameSourceGroup(currentPlay.source.name)) {
      expectedPlayersToPlay = getGroupOfPlayers(game, currentPlay.source.name);
    } else if (isGameSourceRole(currentPlay.source.name)) {
      expectedPlayersToPlay = getPlayersWithCurrentRole(game, currentPlay.source.name);
    } else {
      expectedPlayersToPlay = getPlayersWithActiveAttributeName(game, PlayerAttributeNames.SHERIFF);
    }
    if (!mustIncludeDeadPlayersGamePlayActions.includes(currentPlay.action)) {
      expectedPlayersToPlay = expectedPlayersToPlay.filter(player => player.isAlive);
    }
    if (currentPlay.type === "vote") {
      expectedPlayersToPlay = expectedPlayersToPlay.filter(player => !doesPlayerHaveActiveAttributeWithName(player, PlayerAttributeNames.CANT_VOTE, game));
    }
    return expectedPlayersToPlay.map(player => createPlayer(player));
  }
}