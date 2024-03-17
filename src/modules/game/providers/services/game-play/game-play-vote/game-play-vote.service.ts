import { Injectable } from "@nestjs/common";

import type { MakeGamePlayVoteWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { createGame } from "@/modules/game/helpers/game.factory";
import { getPlayerWithActiveAttributeName, getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helpers";
import { createPlayer } from "@/modules/game/helpers/player/player.factory";
import { isPlayerPowerful } from "@/modules/game/helpers/player/player.helpers";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { PlayerVoteCount } from "@/modules/game/types/game-play.types";
import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play.types";
import { RoleNames } from "@/modules/role/enums/role.enum";

@Injectable()
export class GamePlayVoteService {
  public getNominatedPlayers(votes: MakeGamePlayVoteWithRelationsDto[] | undefined, game: GameWithCurrentPlay): Player[] {
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    let playerVoteCounts = this.getPlayerVoteCounts(votes, clonedGame);
    playerVoteCounts = this.addScandalmongerMarkVoteToPlayerVoteCounts(playerVoteCounts, clonedGame);
    const maxVotes = Math.max(...playerVoteCounts.map(playerVoteCount => playerVoteCount[1]));
    return playerVoteCounts.filter(playerVoteCount => playerVoteCount[1] === maxVotes).map(playerVoteCount => createPlayer(playerVoteCount[0]));
  }

  private getPlayerVoteCounts(votes: MakeGamePlayVoteWithRelationsDto[] | undefined, game: GameWithCurrentPlay): PlayerVoteCount[] {
    if (!votes) {
      return [];
    }
    const { hasDoubledVote: doesSheriffHaveDoubledVote } = game.options.roles.sheriff;
    const sheriffPlayer = getPlayerWithActiveAttributeName(game, PlayerAttributeNames.SHERIFF);
    return votes.reduce<PlayerVoteCount[]>((acc, vote) => {
      const doubledVoteValue = 2;
      const isVoteSourceSheriff = sheriffPlayer?._id.equals(vote.source._id) === true;
      const voteValue = game.currentPlay.action === GamePlayActions.VOTE && isVoteSourceSheriff && doesSheriffHaveDoubledVote ? doubledVoteValue : 1;
      const existingPlayerVoteCount = acc.find(value => value[0]._id.equals(vote.target._id));
      if (existingPlayerVoteCount) {
        existingPlayerVoteCount[1] += voteValue;
        return acc;
      }
      return [...acc, [vote.target, voteValue]];
    }, []);
  }

  private addScandalmongerMarkVoteToPlayerVoteCounts(playerVoteCounts: PlayerVoteCount[], game: GameWithCurrentPlay): PlayerVoteCount[] {
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    const scandalmongerPlayer = getPlayerWithCurrentRole(clonedGame, RoleNames.SCANDALMONGER);
    const scandalmongerMarkedPlayer = getPlayerWithActiveAttributeName(clonedGame, PlayerAttributeNames.SCANDALMONGER_MARKED);
    if (clonedGame.currentPlay.action !== GamePlayActions.VOTE || scandalmongerPlayer?.isAlive !== true ||
      !isPlayerPowerful(scandalmongerPlayer, clonedGame) || scandalmongerMarkedPlayer?.isAlive !== true) {
      return playerVoteCounts;
    }
    const scandalmongerMarkedPlayerVoteCount = playerVoteCounts.find(playerVoteCount => playerVoteCount[0]._id.equals(scandalmongerMarkedPlayer._id));
    const { markPenalty } = clonedGame.options.roles.scandalmonger;
    if (scandalmongerMarkedPlayerVoteCount) {
      scandalmongerMarkedPlayerVoteCount[1] += markPenalty;
      return playerVoteCounts;
    }
    return [...playerVoteCounts, [scandalmongerMarkedPlayer, markPenalty]];
  }
}