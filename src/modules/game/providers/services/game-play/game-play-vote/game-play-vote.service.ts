import { Injectable } from "@nestjs/common";
import { ROLE_NAMES } from "../../../../../role/enums/role.enum";
import type { MakeGamePlayVoteWithRelationsDto } from "../../../../dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import { GAME_PLAY_ACTIONS } from "../../../../enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES } from "../../../../enums/player.enum";
import { createGame } from "../../../../helpers/game.factory";
import { getPlayerWithAttribute, getPlayerWithCurrentRole } from "../../../../helpers/game.helper";
import { doesPlayerHaveAttributeWithName } from "../../../../helpers/player/player-attribute/player-attribute.helper";
import { createPlayer } from "../../../../helpers/player/player.factory";
import type { Player } from "../../../../schemas/player/player.schema";
import type { PlayerVoteCount } from "../../../../types/game-play.type";
import type { GameWithCurrentPlay } from "../../../../types/game-with-current-play";

@Injectable()
export class GamePlayVoteService {
  public getNominatedPlayers(votes: MakeGamePlayVoteWithRelationsDto[], game: GameWithCurrentPlay): Player[] {
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    let playerVoteCounts = this.getPlayerVoteCounts(votes, clonedGame);
    playerVoteCounts = this.addRavenMarkVoteToPlayerVoteCounts(playerVoteCounts, clonedGame);
    const maxVotes = Math.max(...playerVoteCounts.map(playerVoteCount => playerVoteCount[1]));
    return playerVoteCounts.filter(playerVoteCount => playerVoteCount[1] === maxVotes).map(playerVoteCount => createPlayer(playerVoteCount[0]));
  }
  
  private getPlayerVoteCounts(votes: MakeGamePlayVoteWithRelationsDto[], game: GameWithCurrentPlay): PlayerVoteCount[] {
    const { hasDoubledVote: doesSheriffHaveDoubledVote } = game.options.roles.sheriff;
    const sheriffPlayer = getPlayerWithAttribute(game.players, PLAYER_ATTRIBUTE_NAMES.SHERIFF);
    return votes.reduce<PlayerVoteCount[]>((acc, vote) => {
      const doubledVoteValue = 2;
      const isVoteSourceSheriff = vote.source._id.toString() === sheriffPlayer?._id.toString();
      const voteValue = game.currentPlay.action === GAME_PLAY_ACTIONS.VOTE && isVoteSourceSheriff && doesSheriffHaveDoubledVote ? doubledVoteValue : 1;
      const existingPlayerVoteCount = acc.find(value => value[0]._id.toString() === vote.target._id.toString());
      if (existingPlayerVoteCount) {
        existingPlayerVoteCount[1] += voteValue;
        return acc;
      }
      return [...acc, [vote.target, voteValue]];
    }, []);
  }
  
  private addRavenMarkVoteToPlayerVoteCounts(playerVoteCounts: PlayerVoteCount[], game: GameWithCurrentPlay): PlayerVoteCount[] {
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    const ravenPlayer = getPlayerWithCurrentRole(clonedGame.players, ROLE_NAMES.RAVEN);
    const ravenMarkedPlayer = getPlayerWithAttribute(clonedGame.players, PLAYER_ATTRIBUTE_NAMES.RAVEN_MARKED);
    if (clonedGame.currentPlay.action !== GAME_PLAY_ACTIONS.VOTE ||
      ravenPlayer?.isAlive !== true || doesPlayerHaveAttributeWithName(ravenPlayer, PLAYER_ATTRIBUTE_NAMES.POWERLESS) ||
      ravenMarkedPlayer?.isAlive !== true) {
      return playerVoteCounts;
    }
    const ravenMarkedPlayerVoteCount = playerVoteCounts.find(playerVoteCount => playerVoteCount[0]._id.toString() === ravenMarkedPlayer._id.toString());
    const { markPenalty } = clonedGame.options.roles.raven;
    if (ravenMarkedPlayerVoteCount) {
      ravenMarkedPlayerVoteCount[1] += markPenalty;
      return playerVoteCounts;
    }
    return [...playerVoteCounts, [ravenMarkedPlayer, markPenalty]];
  }
}