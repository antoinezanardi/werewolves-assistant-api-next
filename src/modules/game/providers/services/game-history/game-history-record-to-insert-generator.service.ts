import type { MakeGamePlayWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import { createGameHistoryRecordPlaySource } from "@/modules/game/helpers/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.factory";
import { createGameHistoryRecordPlayVoting } from "@/modules/game/helpers/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.factory";
import { createGameHistoryRecordPlay } from "@/modules/game/helpers/game-history-record/game-history-record-play/game-history-record-play.factory";
import { createGameHistoryRecordPlayerAttributeAlteration } from "@/modules/game/helpers/game-history-record/game-history-record-player-attribute-alteration/game-history-record-player-attribute-alteration.factory";
import { createGameHistoryRecordToInsert } from "@/modules/game/helpers/game-history-record/game-history-record.factory";
import { doesGamePlayHaveCause } from "@/modules/game/helpers/game-play/game-play.helpers";
import { getPlayerWithActiveAttributeName, getPlayerWithId } from "@/modules/game/helpers/game.helpers";
import { doesPlayerHaveAttributeWithNameAndSource, isPlayerAttributeActive } from "@/modules/game/helpers/player/player-attribute/player-attribute.helpers";
import { GamePlayVoteService } from "@/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import { GameHistoryRecordPlaySource } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.schema";
import { GameHistoryRecordPlayVoting } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.schema";
import { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import { GameHistoryRecordPlayerAttributeAlteration } from "@/modules/game/schemas/game-history-record/game-history-record-player-attribute-alteration/game-history-record-player-attribute-alteration.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { GameHistoryRecordToInsert, GameHistoryRecordVotingResult } from "@/modules/game/types/game-history-record/game-history-record.types";
import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play.types";
import { createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GameHistoryRecordToInsertGeneratorService {
  public constructor(private readonly gamePlayVoteService: GamePlayVoteService) {}

  public generateCurrentGameHistoryRecordToInsert(baseGame: Game, newGame: Game, play: MakeGamePlayWithRelationsDto): GameHistoryRecordToInsert {
    if (baseGame.currentPlay === null) {
      throw createNoCurrentGamePlayUnexpectedException("generateCurrentGameHistoryRecordToInsert", { gameId: baseGame._id });
    }
    const gameHistoryRecordToInsert: GameHistoryRecordToInsert = {
      gameId: baseGame._id,
      turn: baseGame.turn,
      phase: baseGame.phase,
      tick: baseGame.tick,
      events: baseGame.events,
      play: this.generateCurrentGameHistoryRecordPlayToInsert(baseGame as GameWithCurrentPlay, play),
      revealedPlayers: this.generateCurrentGameHistoryRecordRevealedPlayersToInsert(baseGame, newGame),
      switchedSidePlayers: this.generateCurrentGameHistoryRecordSwitchedSidePlayersToInsert(baseGame, newGame),
      deadPlayers: this.generateCurrentGameHistoryRecordDeadPlayersToInsert(baseGame, newGame),
      playerAttributeAlterations: this.generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert(baseGame, newGame),
    };
    if (gameHistoryRecordToInsert.play.type === "vote") {
      gameHistoryRecordToInsert.play.voting = this.generateCurrentGameHistoryRecordPlayVotingToInsert(baseGame as GameWithCurrentPlay, newGame, gameHistoryRecordToInsert);
    }
    return createGameHistoryRecordToInsert(gameHistoryRecordToInsert);
  }

  private generateCurrentGameHistoryRecordDeadPlayersToInsert(baseGame: Game, newGame: Game): DeadPlayer[] | undefined {
    const { players: newPlayers } = newGame;
    const currentDeadPlayers = newPlayers.filter(player => {
      const matchingBasePlayer = getPlayerWithId(baseGame, player._id);

      return matchingBasePlayer?.isAlive === true && !player.isAlive;
    }) as DeadPlayer[];

    return currentDeadPlayers.length ? currentDeadPlayers : undefined;
  }

  private generateCurrentGameHistoryRecordSwitchedSidePlayersToInsert(baseGame: Game, newGame: Game): Player[] | undefined {
    const { players: newPlayers } = newGame;
    const currentSwitchedSidePlayers = newPlayers.filter(player => {
      const matchingBasePlayer = getPlayerWithId(baseGame, player._id);

      return matchingBasePlayer?.side.current !== player.side.current;
    });

    return currentSwitchedSidePlayers.length ? currentSwitchedSidePlayers : undefined;
  }

  private generateCurrentGameHistoryRecordRevealedPlayersToInsert(baseGame: Game, newGame: Game): Player[] | undefined {
    const { players: newPlayers } = newGame;
    const currentRevealedPlayers = newPlayers.filter(player => {
      const matchingBasePlayer = getPlayerWithId(baseGame, player._id);

      return matchingBasePlayer?.role.isRevealed === false && player.role.isRevealed && player.isAlive;
    });

    return currentRevealedPlayers.length ? currentRevealedPlayers : undefined;
  }

  private generateCurrentGameHistoryRecordAttachedPlayerAttributesToInsertForPlayer(basePlayer: Player, newPlayer: Player): GameHistoryRecordPlayerAttributeAlteration[] {
    return newPlayer.attributes.reduce<GameHistoryRecordPlayerAttributeAlteration[]>((alterations, playerAttribute) => {
      if (!doesPlayerHaveAttributeWithNameAndSource(basePlayer, playerAttribute.name, playerAttribute.source)) {
        alterations.push(createGameHistoryRecordPlayerAttributeAlteration({
          playerName: newPlayer.name,
          name: playerAttribute.name,
          source: playerAttribute.source,
          status: "attached",
        }));
      }
      return alterations;
    }, []);
  }

  private generateCurrentGameHistoryRecordDetachedPlayerAttributesToInsertForPlayer(basePlayer: Player, newPlayer: Player): GameHistoryRecordPlayerAttributeAlteration[] {
    return basePlayer.attributes.reduce<GameHistoryRecordPlayerAttributeAlteration[]>((alterations, playerAttribute) => {
      if (!doesPlayerHaveAttributeWithNameAndSource(newPlayer, playerAttribute.name, playerAttribute.source)) {
        alterations.push(createGameHistoryRecordPlayerAttributeAlteration({
          playerName: newPlayer.name,
          name: playerAttribute.name,
          source: playerAttribute.source,
          status: "detached",
        }));
      }
      return alterations;
    }, []);
  }

  private generateCurrentGameHistoryRecordActivatedPlayerAttributesToInsertForPlayer(baseGame: Game, newGame: Game, basePlayer: Player, newPlayer: Player):
  GameHistoryRecordPlayerAttributeAlteration[] {
    return newPlayer.attributes.reduce<GameHistoryRecordPlayerAttributeAlteration[]>((alterations, playerAttribute) => {
      const doesBasePlayerHaveAttribute = doesPlayerHaveAttributeWithNameAndSource(basePlayer, playerAttribute.name, playerAttribute.source);
      const doesPlayerAttributeBecomesActive = !isPlayerAttributeActive(playerAttribute, baseGame) && isPlayerAttributeActive(playerAttribute, newGame);
      if (doesBasePlayerHaveAttribute && doesPlayerAttributeBecomesActive) {
        alterations.push(createGameHistoryRecordPlayerAttributeAlteration({
          playerName: newPlayer.name,
          name: playerAttribute.name,
          source: playerAttribute.source,
          status: "activated",
        }));
      }
      return alterations;
    }, []);
  }

  private generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert(baseGame: Game, newGame: Game): GameHistoryRecordPlayerAttributeAlteration[] | undefined {
    const { players: newPlayers } = newGame;
    const playerAttributeAlterations = newPlayers.reduce<GameHistoryRecordPlayerAttributeAlteration[]>((alterations, player) => {
      const matchingBasePlayer = getPlayerWithId(baseGame, player._id);
      if (!matchingBasePlayer) {
        return alterations;
      }
      const attachedPlayerAttributes = this.generateCurrentGameHistoryRecordAttachedPlayerAttributesToInsertForPlayer(matchingBasePlayer, player);
      const detachedPlayerAttributes = this.generateCurrentGameHistoryRecordDetachedPlayerAttributesToInsertForPlayer(matchingBasePlayer, player);
      const activatedPlayerAttributes = this.generateCurrentGameHistoryRecordActivatedPlayerAttributesToInsertForPlayer(baseGame, newGame, matchingBasePlayer, player);

      return alterations.concat(attachedPlayerAttributes, detachedPlayerAttributes, activatedPlayerAttributes);
    }, []);

    return playerAttributeAlterations.length ? playerAttributeAlterations : undefined;
  }

  private generateCurrentGameHistoryRecordPlayToInsert(baseGame: GameWithCurrentPlay, play: MakeGamePlayWithRelationsDto): GameHistoryRecordPlay {
    const gameHistoryRecordPlayToInsert: GameHistoryRecordPlay = {
      type: baseGame.currentPlay.type,
      source: this.generateCurrentGameHistoryRecordPlaySourceToInsert(baseGame),
      action: baseGame.currentPlay.action,
      causes: baseGame.currentPlay.causes,
      didJudgeRequestAnotherVote: play.doesJudgeRequestAnotherVote,
      targets: play.targets,
      votes: play.votes,
      chosenCard: play.chosenCard,
      chosenSide: play.chosenSide,
    };

    return createGameHistoryRecordPlay(gameHistoryRecordPlayToInsert);
  }

  private generateCurrentGameHistoryRecordPlayVotingResultToInsert(
    baseGame: GameWithCurrentPlay,
    newGame: Game,
    nominatedPlayers: Player[],
    gameHistoryRecordToInsert: GameHistoryRecordToInsert,
  ): GameHistoryRecordVotingResult {
    const sheriffPlayer = getPlayerWithActiveAttributeName(newGame, "sheriff");
    const areSomePlayersDeadFromCurrentVotes = gameHistoryRecordToInsert.deadPlayers?.some(({ death }) => {
      const deathFromVoteCauses = ["vote", "vote-scapegoated"];

      return deathFromVoteCauses.includes(death.cause);
    }) === true;
    if (baseGame.currentPlay.action === "elect-sheriff") {
      return sheriffPlayer ? "sheriff-election" : "tie";
    }
    if (!gameHistoryRecordToInsert.play.votes || gameHistoryRecordToInsert.play.votes.length === 0) {
      return "skipped";
    }
    if (areSomePlayersDeadFromCurrentVotes) {
      return "death";
    }
    if (doesGamePlayHaveCause(baseGame.currentPlay, "previous-votes-were-in-ties") || nominatedPlayers.length === 1) {
      return "inconsequential";
    }
    return "tie";
  }

  private generateCurrentGameHistoryRecordPlayVotingToInsert(
    baseGame: GameWithCurrentPlay,
    newGame: Game,
    gameHistoryRecordToInsert: GameHistoryRecordToInsert,
  ): GameHistoryRecordPlayVoting {
    const nominatedPlayers = this.gamePlayVoteService.getNominatedPlayers(gameHistoryRecordToInsert.play.votes, baseGame);
    const gameHistoryRecordPlayVoting: GameHistoryRecordPlayVoting = {
      result: this.generateCurrentGameHistoryRecordPlayVotingResultToInsert(baseGame, newGame, nominatedPlayers, gameHistoryRecordToInsert),
      nominatedPlayers: nominatedPlayers.length ? nominatedPlayers : undefined,
    };

    return createGameHistoryRecordPlayVoting(gameHistoryRecordPlayVoting);
  }

  private generateCurrentGameHistoryRecordPlaySourceToInsert(baseGame: GameWithCurrentPlay): GameHistoryRecordPlaySource {
    return createGameHistoryRecordPlaySource(baseGame.currentPlay.source);
  }
}