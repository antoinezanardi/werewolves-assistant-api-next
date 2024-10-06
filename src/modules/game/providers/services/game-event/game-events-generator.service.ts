import { Injectable } from "@nestjs/common";

import { GAME_EVENT_PRIORITY_LIST_ON_DAYS, GAME_EVENT_PRIORITY_LIST_ON_NIGHTS } from "@/modules/game/constants/game-event/game-event.constants";
import { createGameEvent } from "@/modules/game/helpers/game-event/game-event.factory";
import { doesHavePlayerAttributeAlterationWithNameAndStatus, doesHavePlayerAttributeAlterationWithNameSourceAndStatus } from "@/modules/game/helpers/game-history-record/game-history-record.helpers";
import { getNearestAliveNeighbor, getPlayersWithActiveAttributeName, getPlayersWithCurrentRole, getPlayersWithIds, getPlayerWithActiveAttributeName, getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helpers";
import { isPlayerAliveAndPowerful } from "@/modules/game/helpers/player/player.helpers";
import { GameEvent } from "@/modules/game/schemas/game-event/game-event.schema";
import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import { Game } from "@/modules/game/schemas/game.schema";
import { Player } from "@/modules/game/schemas/player/player.schema";
import { GamePlaySourceName } from "@/modules/game/types/game-play/game-play.types";

@Injectable()
export class GameEventsGeneratorService {
  public generateGameEventsFromGameAndLastRecord(game: Game, lastGameHistoryRecord?: GameHistoryRecord): GameEvent[] {
    const gameEvents: GameEvent[] = [];
    const lastGamePlaySourceGameEvent = this.generateLastGamePlaySourceGameEvent(game, lastGameHistoryRecord);
    gameEvents.push(...this.generateFirstTickGameEvents(game));
    gameEvents.push(...this.generateRevealedPlayersGameEvents(lastGameHistoryRecord));
    if (lastGamePlaySourceGameEvent) {
      gameEvents.push(lastGamePlaySourceGameEvent);
    }
    gameEvents.push(...this.generateDeadPlayersGameEvents(lastGameHistoryRecord));
    gameEvents.push(...this.generateSwitchedSidePlayersGameEvents(lastGameHistoryRecord));
    gameEvents.push(...this.generatePlayerAttributeAlterationsEvents(game, lastGameHistoryRecord));
    gameEvents.push(...this.generateGamePhaseStartsGameEvents(game));
    gameEvents.push(...this.generateTurnStartsGameEvents(game));

    return this.sortGameEventsByGamePhase(gameEvents, game);
  }

  private sortGameEventsByGamePhase(gameEvents: GameEvent[], game: Game): GameEvent[] {
    const priorityList = game.phase.name === "day" ? GAME_EVENT_PRIORITY_LIST_ON_DAYS : GAME_EVENT_PRIORITY_LIST_ON_NIGHTS;
    const priorityMap = new Map(priorityList.map((event, index) => [event, index]));

    return gameEvents.toSorted((gameEventA, gameEventB) => {
      const priorityA = priorityMap.get(gameEventA.type);
      const priorityB = priorityMap.get(gameEventB.type);
      if (priorityA === undefined || priorityB === undefined) {
        return 0;
      }
      return priorityA - priorityB;
    });
  }

  private generateSeerHasSeenGameEvent(targetedPlayers?: Player[]): GameEvent {
    return createGameEvent({
      type: "seer-has-seen",
      players: targetedPlayers,
    });
  }

  private generateScandalmongerHayHaveMarkedGameEvent(targetedPlayers?: Player[]): GameEvent {
    return createGameEvent({
      type: "scandalmonger-may-have-marked",
      players: targetedPlayers,
    });
  }

  private generateAccursedWolfFatherMayHaveInfectedGameEvent(targetedPlayers?: Player[]): GameEvent {
    return createGameEvent({
      type: "accursed-wolf-father-may-have-infected",
      players: targetedPlayers,
    });
  }

  private generateWolfHoundHasChosenSideGameEvent(game: Game): GameEvent {
    return createGameEvent({
      type: "wolf-hound-has-chosen-side",
      players: getPlayersWithCurrentRole(game, "wolf-hound"),
    });
  }

  private generatePiedPiperHasCharmedGameEvent(targetedPlayers?: Player[]): GameEvent {
    return createGameEvent({
      type: "pied-piper-has-charmed",
      players: targetedPlayers,
    });
  }

  private generateCupidHasCharmedGameEvent(targetedPlayers?: Player[]): GameEvent {
    return createGameEvent({
      type: "cupid-has-charmed",
      players: targetedPlayers,
    });
  }

  private generateFoxMayHaveSniffedGameEvent(targetedPlayers?: Player[]): GameEvent {
    return createGameEvent({
      type: "fox-may-have-sniffed",
      players: targetedPlayers,
    });
  }

  private generateThiefMayHaveChosenCardGameEvent(sourcePlayers?: Player[]): GameEvent {
    return createGameEvent({
      type: "thief-may-have-chosen-card",
      players: sourcePlayers,
    });
  }

  private generateActorMayHaveChosenCardGameEvent(sourcePlayers?: Player[]): GameEvent {
    return createGameEvent({
      type: "actor-may-have-chosen-card",
      players: sourcePlayers,
    });
  }

  private generateLastGamePlaySourceGameEvent(game: Game, gameHistoryRecord?: GameHistoryRecord): GameEvent | undefined {
    if (!gameHistoryRecord) {
      return undefined;
    }
    const lastHistorySourcePlayersIds = gameHistoryRecord.play.source.players?.map(player => player._id);
    const lastHistoryTargetedPlayerIds = gameHistoryRecord.play.targets?.map(target => target.player._id);
    const lastHistorySourcePlayersInGame = lastHistorySourcePlayersIds ? getPlayersWithIds(lastHistorySourcePlayersIds, game) : undefined;
    const lastHistoryTargetedPlayersInGame = lastHistoryTargetedPlayerIds ? getPlayersWithIds(lastHistoryTargetedPlayerIds, game) : undefined;
    const gamePlaySourcesGameEvent: Partial<Record<GamePlaySourceName, () => GameEvent>> = {
      "seer": () => this.generateSeerHasSeenGameEvent(lastHistoryTargetedPlayersInGame),
      "scandalmonger": () => this.generateScandalmongerHayHaveMarkedGameEvent(lastHistoryTargetedPlayersInGame),
      "accursed-wolf-father": () => this.generateAccursedWolfFatherMayHaveInfectedGameEvent(lastHistoryTargetedPlayersInGame),
      "wolf-hound": () => this.generateWolfHoundHasChosenSideGameEvent(game),
      "pied-piper": () => this.generatePiedPiperHasCharmedGameEvent(lastHistoryTargetedPlayersInGame),
      "cupid": () => this.generateCupidHasCharmedGameEvent(lastHistoryTargetedPlayersInGame),
      "fox": () => this.generateFoxMayHaveSniffedGameEvent(lastHistoryTargetedPlayersInGame),
      "thief": () => this.generateThiefMayHaveChosenCardGameEvent(lastHistorySourcePlayersInGame),
      "actor": () => this.generateActorMayHaveChosenCardGameEvent(lastHistorySourcePlayersInGame),
    };

    return gamePlaySourcesGameEvent[gameHistoryRecord.play.source.name]?.();
  }

  private generateFirstTickGameEvents(game: Game): GameEvent[] {
    const gameEvents: GameEvent[] = [];
    if (game.tick !== 1) {
      return gameEvents;
    }
    gameEvents.push(createGameEvent({
      type: "game-starts",
      players: game.players,
    }));
    const villagerVillagerPlayer = getPlayerWithCurrentRole(game, "villager-villager");
    if (villagerVillagerPlayer) {
      gameEvents.push(createGameEvent({
        type: "villager-villager-introduction",
        players: [villagerVillagerPlayer],
      }));
    }
    return gameEvents;
  }

  private generateRevealedPlayersGameEvents(gameHistoryRecord?: GameHistoryRecord): GameEvent[] {
    const gameEvents: GameEvent[] = [];
    if (!gameHistoryRecord?.revealedPlayers) {
      return gameEvents;
    }
    const revealedIdiotPlayer = gameHistoryRecord.revealedPlayers.find(player => player.role.current === "idiot");
    if (revealedIdiotPlayer) {
      gameEvents.push(createGameEvent({
        type: "idiot-is-spared",
        players: [revealedIdiotPlayer],
      }));
    }
    return gameEvents;
  }

  private generateSwitchedSidePlayersGameEvents(gameHistoryRecord?: GameHistoryRecord): GameEvent[] {
    const gameEvents: GameEvent[] = [];
    if (!gameHistoryRecord?.switchedSidePlayers) {
      return gameEvents;
    }
    const switchedWildChildPlayer = gameHistoryRecord.switchedSidePlayers.find(player => player.role.current === "wild-child");
    if (switchedWildChildPlayer && gameHistoryRecord.play.action === "bury-dead-bodies") {
      gameEvents.push(createGameEvent({
        type: "wild-child-has-transformed",
        players: [switchedWildChildPlayer],
      }));
    }
    return gameEvents;
  }

  private generateDeadPlayersGameEvents(gameHistoryRecord?: GameHistoryRecord): GameEvent[] {
    const gameEvents: GameEvent[] = [];
    if (!gameHistoryRecord?.deadPlayers) {
      return gameEvents;
    }
    gameEvents.push(createGameEvent({
      type: "death",
      players: gameHistoryRecord.deadPlayers,
    }));

    return gameEvents;
  }

  private generateBearGrowlsOrSleepsGameEvent(game: Game, bearTamerPlayer: Player): GameEvent {
    const leftAliveNeighbor = getNearestAliveNeighbor(bearTamerPlayer._id, game, { direction: "left" });
    const rightAliveNeighbor = getNearestAliveNeighbor(bearTamerPlayer._id, game, { direction: "right" });
    const doesBearTamerHaveWerewolfSidedNeighbor = leftAliveNeighbor?.side.current === "werewolves" || rightAliveNeighbor?.side.current === "werewolves";
    const { doesGrowlOnWerewolvesSide } = game.options.roles.bearTamer;
    const isBearTamerInfected = bearTamerPlayer.side.current === "werewolves";
    const doesBearGrowl = doesGrowlOnWerewolvesSide && isBearTamerInfected || doesBearTamerHaveWerewolfSidedNeighbor;

    return createGameEvent({
      type: doesBearGrowl ? "bear-growls" : "bear-sleeps",
      players: [bearTamerPlayer],
    });
  }

  private generateGamePhaseStartsGameEvents(game: Game): GameEvent[] {
    const gameEvents: GameEvent[] = [];
    if (game.phase.tick !== 1 || game.phase.name === "twilight") {
      return gameEvents;
    }
    gameEvents.push(createGameEvent({ type: "game-phase-starts" }));
    const bearTamerPlayer = getPlayerWithCurrentRole(game, "bear-tamer");
    if (game.phase.name === "day" && bearTamerPlayer && isPlayerAliveAndPowerful(bearTamerPlayer, game)) {
      gameEvents.push(this.generateBearGrowlsOrSleepsGameEvent(game, bearTamerPlayer));
    }
    return gameEvents;
  }

  private generatePlayerAttributeAlterationsEvents(game: Game, gameHistoryRecord?: GameHistoryRecord): GameEvent[] {
    const gameEvents: GameEvent[] = [];
    if (!gameHistoryRecord?.playerAttributeAlterations) {
      return gameEvents;
    }
    if (doesHavePlayerAttributeAlterationWithNameSourceAndStatus(gameHistoryRecord, "powerless", "elder", "attached")) {
      gameEvents.push(createGameEvent({
        type: "elder-has-taken-revenge",
        players: getPlayersWithCurrentRole(game, "elder"),
      }));
    }
    if (doesHavePlayerAttributeAlterationWithNameAndStatus(gameHistoryRecord, "sheriff", "attached")) {
      gameEvents.push(createGameEvent({
        type: "sheriff-promotion",
        players: getPlayersWithActiveAttributeName(game, "sheriff"),
      }));
    }
    return gameEvents;
  }

  private generateTurnStartsGameEvents(game: Game): GameEvent[] {
    const gameEvents: GameEvent[] = [];
    const scandalmongerMarkedPlayer = getPlayerWithActiveAttributeName(game, "scandalmonger-marked");
    if (game.currentPlay?.action === "vote" && scandalmongerMarkedPlayer) {
      gameEvents.push(createGameEvent({
        type: "scandalmonger-mark-is-active",
        players: [scandalmongerMarkedPlayer],
      }));
    }
    return [
      ...gameEvents,
      createGameEvent({
        type: "game-turn-starts",
        players: game.currentPlay?.source.players,
      }),
    ];
  }
}