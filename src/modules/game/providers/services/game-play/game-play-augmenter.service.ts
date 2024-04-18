import { Injectable } from "@nestjs/common";
import { isDefined } from "class-validator";

import { doesGamePlayHaveCause } from "@/modules/game/helpers/game-play/game-play.helpers";
import { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import { createGamePlaySourceInteraction } from "@/modules/game/helpers/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.factory";
import { createGamePlay } from "@/modules/game/helpers/game-play/game-play.factory";
import { getAlivePlayers, getAllowedToVotePlayers, getEligibleCupidTargets, getEligiblePiedPiperTargets, getEligibleWerewolvesTargets, getEligibleWhiteWerewolfTargets, getGroupOfPlayers, getPlayersWithActiveAttributeName, getPlayersWithCurrentRole, getPlayerWithCurrentRole, isGameSourceGroup, isGameSourceRole } from "@/modules/game/helpers/game.helpers";
import { doesPlayerHaveActiveAttributeWithName, doesPlayerHaveActiveAttributeWithNameAndSource } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import { createPlayer } from "@/modules/game/helpers/player/player.factory";
import { isPlayerAliveAndPowerful } from "@/modules/game/helpers/player/player.helpers";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import type { GamePlaySourceInteraction } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { GamePlayAction, GamePlaySourceName } from "@/modules/game/types/game-play/game-play.types";
import { WEREWOLF_ROLES } from "@/modules/role/constants/role-set.constants";
import { RoleName } from "@/modules/role/types/role.types";

import { createCantFindLastDeadPlayersUnexpectedException, createCantFindLastNominatedPlayersUnexpectedException, createCantFindPlayerWithCurrentRoleUnexpectedException, createMalformedCurrentGamePlayUnexpectedException, createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

@Injectable()
export class GamePlayAugmenterService {
  private readonly getPlaySourceInteractionsMethods: Partial<
  Record<GamePlaySourceName, (game: Game, gamePlay: GamePlay) => GamePlaySourceInteraction[] | Promise<GamePlaySourceInteraction[]>>
  > = {
      "sheriff": async(game, gamePlay) => this.getSheriffGamePlaySourceInteractions(game, gamePlay),
      "survivors": async(game, gamePlay) => this.getSurvivorsGamePlaySourceInteractions(game, gamePlay),
      "werewolves": game => this.getWerewolvesGamePlaySourceInteractions(game),
      "big-bad-wolf": game => this.getBigBadWolfGamePlaySourceInteractions(game),
      "cupid": game => this.getCupidGamePlaySourceInteractions(game),
      "fox": game => this.getFoxGamePlaySourceInteractions(game),
      "defender": async game => this.getDefenderGamePlaySourceInteractions(game),
      "hunter": game => this.getHunterGamePlaySourceInteractions(game),
      "pied-piper": game => this.getPiedPiperGamePlaySourceInteractions(game),
      "scandalmonger": game => this.getScandalmongerGamePlaySourceInteractions(game),
      "scapegoat": game => this.getScapegoatGamePlaySourceInteractions(game),
      "seer": game => this.getSeerGamePlaySourceInteractions(game),
      "white-werewolf": game => this.getWhiteWerewolfGamePlaySourceInteractions(game),
      "wild-child": game => this.getWildChildGamePlaySourceInteractions(game),
      "witch": async game => this.getWitchGamePlaySourceInteractions(game),
      "accursed-wolf-father": async game => this.getAccursedWolfFatherGamePlaySourceInteractions(game),
    };

  private readonly canBeSkippedPlayMethods: Partial<Record<GamePlaySourceName, (game: Game, gamePlay: GamePlay) => boolean>> = {
    "charmed": () => true,
    "lovers": () => true,
    "survivors": (game, gamePlay) => this.canSurvivorsSkipGamePlay(game, gamePlay),
    "big-bad-wolf": game => this.canBigBadWolfSkipGamePlay(game),
    "fox": () => true,
    "scandalmonger": () => true,
    "scapegoat": () => true,
    "thief": game => this.canThiefSkipGamePlay(game),
    "two-sisters": () => true,
    "three-brothers": () => true,
    "white-werewolf": () => true,
    "witch": () => true,
    "actor": () => true,
    "cupid": (game: Game) => this.canCupidSkipGamePlay(game),
    "accursed-wolf-father": () => true,
    "stuttering-judge": () => true,
    "bear-tamer": () => true,
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
    const lastTieInVotesRecord = await this.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord(game._id, "vote");
    if (lastTieInVotesRecord?.play.voting?.nominatedPlayers === undefined || lastTieInVotesRecord.play.voting.nominatedPlayers.length === 0) {
      throw createCantFindLastNominatedPlayersUnexpectedException("getSheriffSettlesVotesGamePlaySourceInteractions", { gameId: game._id });
    }
    const eligibleTargets = lastTieInVotesRecord.play.voting.nominatedPlayers;
    const interaction = createGamePlaySourceInteraction({
      source: "sheriff",
      type: "sentence-to-death",
      eligibleTargets,
      boundaries: { min: 1, max: 1 },
    });
    return [interaction];
  }

  private getSheriffDelegatesGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const alivePlayersWithoutCurrentSheriff = getAlivePlayers(game).filter(player => !doesPlayerHaveActiveAttributeWithName(player, "sheriff", game));
    const interaction = createGamePlaySourceInteraction({
      source: "sheriff",
      type: "transfer-sheriff-role",
      eligibleTargets: alivePlayersWithoutCurrentSheriff,
      boundaries: { min: 1, max: 1 },
    });
    return [interaction];
  }

  private async getSheriffGamePlaySourceInteractions(game: Game, gamePlay: GamePlay): Promise<GamePlaySourceInteraction[]> {
    if (gamePlay.action === "delegate") {
      return this.getSheriffDelegatesGamePlaySourceInteractions(game);
    }
    if (gamePlay.action === "settle-votes") {
      return this.getSheriffSettlesVotesGamePlaySourceInteractions(game);
    }
    throw createMalformedCurrentGamePlayUnexpectedException("getSheriffGamePlaySourceInteractions", gamePlay, game._id);
  }

  private async getSurvivorsVoteGamePlaySourceInteractionEligibleTargets(game: Game, gamePlay: GamePlay): Promise<Player[]> {
    const alivePlayers = getAlivePlayers(game);
    if (doesGamePlayHaveCause(gamePlay, "previous-votes-were-in-ties")) {
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
      source: "survivors",
      type: "vote",
      eligibleTargets,
      boundaries: { min: minBoundaries, max: maxBoundaries },
    });
    return [interaction];
  }

  private async getSurvivorsElectSheriffGamePlaySourceInteractions(game: Game, gamePlay: GamePlay): Promise<GamePlaySourceInteraction[]> {
    const eligibleTargets = await this.getSurvivorsVoteGamePlaySourceInteractionEligibleTargets(game, gamePlay);
    const maxBoundaries = getAllowedToVotePlayers(game).length;
    const interaction = createGamePlaySourceInteraction({
      source: "survivors",
      type: "choose-as-sheriff",
      eligibleTargets,
      boundaries: { min: 1, max: maxBoundaries },
    });
    return [interaction];
  }

  private getSurvivorsBuryDeadBodiesGamePlaySourceDevotedServantInteraction(game: Game, previousDeadPlayers: DeadPlayer[]): GamePlaySourceInteraction | undefined {
    const devotedServantPlayer = getPlayerWithCurrentRole(game, "devoted-servant");
    if (!devotedServantPlayer || !isPlayerAliveAndPowerful(devotedServantPlayer, game) ||
      doesPlayerHaveActiveAttributeWithName(devotedServantPlayer, "in-love", game)) {
      return undefined;
    }
    return createGamePlaySourceInteraction({
      source: "devoted-servant",
      type: "steal-role",
      eligibleTargets: previousDeadPlayers,
      boundaries: { min: 0, max: 1 },
    });
  }

  private async getSurvivorsBuryDeadBodiesGamePlaySourceInteractions(game: Game): Promise<GamePlaySourceInteraction[]> {
    const previousGameHistoryRecord = await this.gameHistoryRecordService.getPreviousGameHistoryRecord(game._id);
    if (previousGameHistoryRecord?.deadPlayers === undefined || previousGameHistoryRecord.deadPlayers.length === 0) {
      throw createCantFindLastDeadPlayersUnexpectedException("getSurvivorsBuryDeadBodiesGamePlaySourceInteractions", { gameId: game._id });
    }
    const interactions = [
      createGamePlaySourceInteraction({
        source: "survivors",
        type: "bury",
        eligibleTargets: previousGameHistoryRecord.deadPlayers,
        boundaries: { min: 0, max: previousGameHistoryRecord.deadPlayers.length },
        isInconsequential: true,
      }),
    ];
    const devotedServantInteraction = this.getSurvivorsBuryDeadBodiesGamePlaySourceDevotedServantInteraction(game, previousGameHistoryRecord.deadPlayers);
    if (devotedServantInteraction) {
      interactions.push(devotedServantInteraction);
    }
    return interactions;
  }

  private async getSurvivorsGamePlaySourceInteractions(game: Game, gamePlay: GamePlay): Promise<GamePlaySourceInteraction[]> {
    const survivorsGamePlaySourceInteractionMethods: Partial<Record<
    GamePlayAction, (game: Game, gamePlay: GamePlay) => GamePlaySourceInteraction[] | Promise<GamePlaySourceInteraction[]>
    >> = {
      "bury-dead-bodies": async() => this.getSurvivorsBuryDeadBodiesGamePlaySourceInteractions(game),
      "vote": async() => this.getSurvivorsVoteGamePlaySourceInteractions(game, gamePlay),
      "elect-sheriff": async() => this.getSurvivorsElectSheriffGamePlaySourceInteractions(game, gamePlay),
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
      source: "werewolves",
      type: "eat",
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
      source: "big-bad-wolf",
      type: "eat",
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
      source: "cupid",
      type: "charm",
      eligibleTargets: eligibleCupidTargets,
      boundaries: { min: expectedPlayersToCharmCount, max: expectedPlayersToCharmCount },
    });
    return [interaction];
  }

  private getFoxGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const alivePlayers = getAlivePlayers(game);
    const interaction = createGamePlaySourceInteraction({
      source: "fox",
      type: "sniff",
      eligibleTargets: alivePlayers,
      boundaries: { min: 0, max: 1 },
    });
    return [interaction];
  }

  private async getDefenderGamePlaySourceInteractions(game: Game): Promise<GamePlaySourceInteraction[]> {
    const { canProtectTwice } = game.options.roles.defender;
    const alivePlayers = getAlivePlayers(game);
    const defenderPlayer = getPlayerWithCurrentRole(game, "defender");
    if (!defenderPlayer) {
      throw createCantFindPlayerWithCurrentRoleUnexpectedException("getDefenderGamePlaySourceInteractions", { gameId: game._id, roleName: "defender" });
    }
    const lastDefenderProtectRecord = await this.gameHistoryRecordService.getLastGameHistoryDefenderProtectsRecord(game._id, defenderPlayer._id);
    const lastProtectedPlayer = lastDefenderProtectRecord?.play.targets?.[0].player;
    const eligibleDefenderTargets = canProtectTwice || !lastProtectedPlayer ? alivePlayers : alivePlayers.filter(player => !player._id.equals(lastProtectedPlayer._id));
    const interaction = createGamePlaySourceInteraction({
      source: "defender",
      type: "protect",
      eligibleTargets: eligibleDefenderTargets,
      boundaries: { min: 1, max: 1 },
    });
    return [interaction];
  }

  private getHunterGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const alivePlayers = getAlivePlayers(game);
    const interaction = createGamePlaySourceInteraction({
      source: "hunter",
      type: "shoot",
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
      source: "pied-piper",
      type: "charm",
      eligibleTargets: eligiblePiedPiperTargets,
      boundaries: { min: countToCharm, max: countToCharm },
    });
    return [interaction];
  }

  private getScandalmongerGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const alivePlayers = getAlivePlayers(game);
    const interaction = createGamePlaySourceInteraction({
      source: "scandalmonger",
      type: "mark",
      eligibleTargets: alivePlayers,
      boundaries: { min: 0, max: 1 },
    });
    return [interaction];
  }

  private getScapegoatGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const alivePlayers = getAlivePlayers(game);
    const interaction = createGamePlaySourceInteraction({
      source: "scapegoat",
      type: "ban-voting",
      eligibleTargets: alivePlayers,
      boundaries: { min: 0, max: alivePlayers.length },
    });
    return [interaction];
  }

  private getSeerGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const alivePlayers = getAlivePlayers(game);
    const alivePlayersWithoutSeer = alivePlayers.filter(({ role }) => role.current !== "seer");
    const interaction = createGamePlaySourceInteraction({
      source: "seer",
      type: "look",
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
      source: "white-werewolf",
      type: "eat",
      eligibleTargets: leftToEatByWhiteWerewolfPlayers,
      boundaries: { min: 0, max: 1 },
    });
    return [interactions];
  }

  private getWildChildGamePlaySourceInteractions(game: Game): GamePlaySourceInteraction[] {
    const alivePlayers = getAlivePlayers(game);
    const alivePlayersWithoutWildChild = alivePlayers.filter(({ role }) => role.current !== "wild-child");
    const interaction = createGamePlaySourceInteraction({
      source: "wild-child",
      type: "choose-as-model",
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
    const eligibleTargets = alivePlayers.filter(player => !doesPlayerHaveActiveAttributeWithName(player, "eaten", game));
    return createGamePlaySourceInteraction({
      source: "witch",
      type: "give-death-potion",
      eligibleTargets,
      boundaries: { min: 0, max: 1 },
    });
  }

  private getWitchGamePlaySourceGiveLifePotionInteraction(game: Game, hasWitchUsedLifePotion: boolean): GamePlaySourceInteraction | undefined {
    if (hasWitchUsedLifePotion) {
      return undefined;
    }
    const alivePlayers = getAlivePlayers(game);
    const eligibleTargets = alivePlayers.filter(player => doesPlayerHaveActiveAttributeWithName(player, "eaten", game));
    return createGamePlaySourceInteraction({
      source: "witch",
      type: "give-life-potion",
      eligibleTargets,
      boundaries: { min: 0, max: 1 },
    });
  }

  private async getWitchGamePlaySourceInteractions(game: Game): Promise<GamePlaySourceInteraction[]> {
    const witchPlayer = getPlayerWithCurrentRole(game, "witch");
    if (!witchPlayer) {
      throw createCantFindPlayerWithCurrentRoleUnexpectedException("getWitchGamePlaySourceInteractions", { gameId: game._id, roleName: "witch" });
    }
    const [lifeRecords, deathRecords] = await Promise.all([
      this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, witchPlayer._id, "life"),
      this.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords(game._id, witchPlayer._id, "death"),
    ]);
    const hasWitchUsedLifePotion = lifeRecords.length > 0;
    const hasWitchUsedDeathPotion = deathRecords.length > 0;
    const giveLifePotionInteraction = this.getWitchGamePlaySourceGiveLifePotionInteraction(game, hasWitchUsedLifePotion);
    const giveDeathPotionInteraction = this.getWitchGamePlaySourceGiveDeathPotionInteraction(game, hasWitchUsedDeathPotion);
    return [giveLifePotionInteraction, giveDeathPotionInteraction].filter(isDefined);
  }

  private async getAccursedWolfFatherGamePlaySourceInteractions(game: Game): Promise<GamePlaySourceInteraction[]> {
    const accursedWolfFatherPlayer = getPlayerWithCurrentRole(game, "accursed-wolf-father");
    const exceptionInterpolations = { gameId: game._id, roleName: "accursed-wolf-father" as RoleName };
    if (!accursedWolfFatherPlayer) {
      throw createCantFindPlayerWithCurrentRoleUnexpectedException("getAccursedWolfFatherGamePlaySourceInteractions", exceptionInterpolations);
    }
    const infectedTargetRecords = await this.gameHistoryRecordService.getGameHistoryAccursedWolfFatherInfectsWithTargetRecords(game._id, accursedWolfFatherPlayer._id);
    if (infectedTargetRecords.length) {
      return [];
    }
    const eatenByWerewolvesPlayers = game.players.filter(player =>
      doesPlayerHaveActiveAttributeWithNameAndSource(player, "eaten", "werewolves", game));
    const interaction = createGamePlaySourceInteraction({
      source: "accursed-wolf-father",
      type: "infect",
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
    const isGamePlayVoteCauseAngelPresence = gamePlay.action === "vote" && doesGamePlayHaveCause(gamePlay, "angel-presence");
    if (gamePlay.action === "elect-sheriff" || isGamePlayVoteCauseAngelPresence) {
      return false;
    }
    return gamePlay.action === "bury-dead-bodies" || canBeSkipped;
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
    const mustIncludeDeadPlayersGamePlayActions: GamePlayAction[] = ["shoot", "ban-voting", "delegate"];
    let expectedPlayersToPlay: Player[] = [];
    if (currentPlay === null) {
      throw createNoCurrentGamePlayUnexpectedException("getExpectedPlayersToPlay", { gameId: game._id });
    }
    if (isGameSourceGroup(currentPlay.source.name)) {
      expectedPlayersToPlay = getGroupOfPlayers(game, currentPlay.source.name);
    } else if (isGameSourceRole(currentPlay.source.name)) {
      expectedPlayersToPlay = getPlayersWithCurrentRole(game, currentPlay.source.name);
    } else {
      expectedPlayersToPlay = getPlayersWithActiveAttributeName(game, "sheriff");
    }
    if (!mustIncludeDeadPlayersGamePlayActions.includes(currentPlay.action)) {
      expectedPlayersToPlay = expectedPlayersToPlay.filter(player => player.isAlive);
    }
    if (currentPlay.type === "vote") {
      expectedPlayersToPlay = expectedPlayersToPlay.filter(player => !doesPlayerHaveActiveAttributeWithName(player, "cant-vote", game));
    }
    return expectedPlayersToPlay.map(player => createPlayer(player));
  }
}