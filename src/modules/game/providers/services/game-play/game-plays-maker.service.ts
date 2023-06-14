import { Injectable } from "@nestjs/common";
import { cloneDeep } from "lodash";
import { roles } from "../../../../role/constants/role.constant";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../role/enums/role.enum";
import type { MakeGamePlayVoteWithRelationsDto } from "../../../dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import type { MakeGamePlayWithRelationsDto } from "../../../dto/make-game-play/make-game-play-with-relations.dto";
import { GAME_HISTORY_RECORD_VOTING_RESULTS } from "../../../enums/game-history-record.enum";
import { GAME_PLAY_ACTIONS, GAME_PLAY_CAUSES, WITCH_POTIONS } from "../../../enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_DEATH_CAUSES, PLAYER_GROUPS } from "../../../enums/player.enum";
import { createGamePlayAllVote, createGamePlaySheriffSettlesVotes } from "../../../helpers/game-play/game-play.factory";
import { getFoxSniffedPlayers, getLeftToCharmByPiedPiperPlayers, getPlayerWithAttribute, getPlayerWithCurrentRole, getUpcomingGamePlayAction, getUpcomingGamePlaySource } from "../../../helpers/game.helper";
import { addPlayerAttributeInGame, addPlayersAttributeInGame, appendUpcomingPlayInGame, prependUpcomingPlayInGame, removePlayerAttributeByNameInGame, updatePlayerInGame } from "../../../helpers/game.mutator";
import { createCantVoteByScapegoatPlayerAttribute, createCharmedByPiedPiperPlayerAttribute, createDrankDeathPotionByWitchPlayerAttribute, createDrankLifePotionByWitchPlayerAttribute, createEatenByBigBadWolfPlayerAttribute, createEatenByWerewolvesPlayerAttribute, createEatenByWhiteWerewolfPlayerAttribute, createInLoveByCupidPlayerAttribute, createPowerlessByFoxPlayerAttribute, createProtectedByGuardPlayerAttribute, createRavenMarkByRavenPlayerAttribute, createSeenBySeerPlayerAttribute, createSheriffByAllPlayerAttribute, createSheriffBySheriffPlayerAttribute, createWorshipedByWildChildPlayerAttribute } from "../../../helpers/player/player-attribute/player-attribute.factory";
import { createPlayerShotByHunterDeath, createPlayerVoteByAllDeath, createPlayerVoteBySheriffDeath, createPlayerVoteScapegoatedByAllDeath } from "../../../helpers/player/player-death/player-death.factory";
import { doesPlayerHaveAttribute, isPlayerAliveAndPowerful } from "../../../helpers/player/player.helper";
import type { GameHistoryRecord } from "../../../schemas/game-history-record/game-history-record.schema";
import type { Game } from "../../../schemas/game.schema";
import type { PlayerRole } from "../../../schemas/player/player-role.schema";
import type { PlayerSide } from "../../../schemas/player/player-side.schema";
import type { Player } from "../../../schemas/player/player.schema";
import type { PlayerVoteCount } from "../../../types/game-play.type";
import type { GameSource } from "../../../types/game.type";
import { PlayerKillerService } from "../player/player-killer.service";

@Injectable()
export class GamePlaysMakerService {
  private readonly gameSourcePlayMethods: Partial<Record<GameSource, (play: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords?: GameHistoryRecord[]) => Game>> = {
    [PLAYER_GROUPS.WEREWOLVES]: this.werewolvesEat,
    [ROLE_NAMES.BIG_BAD_WOLF]: this.bigBadWolfEats,
    [ROLE_NAMES.WHITE_WEREWOLF]: this.whiteWerewolfEats,
    [ROLE_NAMES.SEER]: this.seerLooks,
    [ROLE_NAMES.CUPID]: this.cupidCharms,
    [ROLE_NAMES.PIED_PIPER]: this.piedPiperCharms,
    [ROLE_NAMES.WITCH]: this.witchUsesPotions,
    [ROLE_NAMES.HUNTER]: this.hunterShoots,
    [ROLE_NAMES.GUARD]: this.guardProtects,
    [ROLE_NAMES.FOX]: this.foxSniffs,
    [ROLE_NAMES.WILD_CHILD]: this.wildChildChoosesModel,
    [ROLE_NAMES.DOG_WOLF]: this.dogWolfChoosesSide,
    [ROLE_NAMES.SCAPEGOAT]: this.scapegoatBansVoting,
    [ROLE_NAMES.THIEF]: this.thiefChoosesCard,
    [PLAYER_GROUPS.ALL]: this.allPlay,
    [ROLE_NAMES.RAVEN]: this.ravenMarks,
    [PLAYER_ATTRIBUTE_NAMES.SHERIFF]: this.sheriffPlays,
  };

  public constructor(private readonly playerKillerService: PlayerKillerService) {}

  public makeGamePlay(play: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords: GameHistoryRecord[]): Game {
    const clonedGame = cloneDeep(game);
    const upcomingGamePlaySource = getUpcomingGamePlaySource(clonedGame.upcomingPlays);
    if (!upcomingGamePlaySource) {
      return clonedGame;
    }
    const gameSourcePlayMethod = this.gameSourcePlayMethods[upcomingGamePlaySource];
    if (gameSourcePlayMethod === undefined) {
      return clonedGame;
    }
    return gameSourcePlayMethod(play, game, gameHistoryRecords);
  }

  private sheriffSettlesVotes({ targets }: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords: GameHistoryRecord[]): Game {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const targetedPlayer = targets[0].player;
    const voteBySheriffDeath = createPlayerVoteBySheriffDeath();
    return this.playerKillerService.killOrRevealPlayer(targetedPlayer._id, clonedGame, voteBySheriffDeath, gameHistoryRecords);
  }

  private sheriffDelegates({ targets }: MakeGamePlayWithRelationsDto, game: Game): Game {
    let clonedGame = cloneDeep(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const targetedPlayer = targets[0].player;
    const sheriffPlayer = getPlayerWithAttribute(clonedGame.players, PLAYER_ATTRIBUTE_NAMES.SHERIFF);
    if (sheriffPlayer) {
      clonedGame = removePlayerAttributeByNameInGame(sheriffPlayer._id, clonedGame, PLAYER_ATTRIBUTE_NAMES.SHERIFF);
    }
    const sheriffBySheriffPlayerAttribute = createSheriffBySheriffPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, sheriffBySheriffPlayerAttribute);
  }

  private sheriffPlays(play: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords: GameHistoryRecord[]): Game {
    const clonedGame = cloneDeep(game);
    const upcomingGamePlayAction = getUpcomingGamePlayAction(clonedGame.upcomingPlays);
    if (!upcomingGamePlayAction) {
      return clonedGame;
    }
    const sheriffPlayMethods: Partial<Record<GAME_PLAY_ACTIONS, (play: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords?: GameHistoryRecord[]) => Game>> = {
      [GAME_PLAY_ACTIONS.DELEGATE]: this.sheriffDelegates,
      [GAME_PLAY_ACTIONS.SETTLE_VOTES]: this.sheriffSettlesVotes,
    };
    const sheriffPlayMethod = sheriffPlayMethods[upcomingGamePlayAction];
    if (sheriffPlayMethod === undefined) {
      return clonedGame;
    }
    return sheriffPlayMethod(play, game, gameHistoryRecords);
  }

  private addRavenMarkVoteToPlayerVoteCounts(playerVoteCounts: PlayerVoteCount[], game: Game): PlayerVoteCount[] {
    const clonedGame = cloneDeep(game);
    const clonedPlayerVoteCounts = cloneDeep(playerVoteCounts);
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    const ravenPlayer = getPlayerWithCurrentRole(clonedGame.players, ROLE_NAMES.RAVEN);
    const ravenMarkedPlayer = getPlayerWithAttribute(clonedGame.players, PLAYER_ATTRIBUTE_NAMES.RAVEN_MARKED);
    if (upcomingGamePlayAction !== GAME_PLAY_ACTIONS.VOTE ||
      ravenPlayer?.isAlive !== true || doesPlayerHaveAttribute(ravenPlayer, PLAYER_ATTRIBUTE_NAMES.POWERLESS) ||
      ravenMarkedPlayer?.isAlive !== true) {
      return clonedPlayerVoteCounts;
    }
    const ravenMarkedPlayerVoteCount = playerVoteCounts.find(playerVoteCount => playerVoteCount[0]._id.toString() === ravenMarkedPlayer._id.toString());
    const { markPenalty } = clonedGame.options.roles.raven;
    if (ravenMarkedPlayerVoteCount) {
      ravenMarkedPlayerVoteCount[1] += markPenalty;
      return playerVoteCounts;
    }
    return [...playerVoteCounts, [ravenMarkedPlayer, markPenalty]];
  }

  private getPlayerVoteCounts(votes: MakeGamePlayVoteWithRelationsDto[], game: Game): PlayerVoteCount[] {
    const { hasDoubledVote: doesSheriffHaveDoubledVote } = game.options.roles.sheriff;
    const sheriffPlayer = getPlayerWithAttribute(game.players, PLAYER_ATTRIBUTE_NAMES.SHERIFF);
    const upcomingGamePlayAction = getUpcomingGamePlayAction(game.upcomingPlays);
    return votes.reduce<PlayerVoteCount[]>((acc, vote) => {
      const doubledVoteValue = 2;
      const isVoteSourceSheriff = vote.source._id.toString() === sheriffPlayer?._id.toString();
      const voteValue = upcomingGamePlayAction === GAME_PLAY_ACTIONS.VOTE && isVoteSourceSheriff && doesSheriffHaveDoubledVote ? doubledVoteValue : 1;
      const existingPlayerVoteCount = acc.find(value => value[0]._id.toString() === vote.target._id.toString());
      if (existingPlayerVoteCount) {
        existingPlayerVoteCount[1] += voteValue;
        return acc;
      }
      return [...acc, [vote.target, voteValue]];
    }, []);
  }

  private getNominatedPlayers(votes: MakeGamePlayVoteWithRelationsDto[], game: Game): Player[] {
    const clonedGame = cloneDeep(game);
    let playerVoteCounts = this.getPlayerVoteCounts(votes, clonedGame);
    playerVoteCounts = this.addRavenMarkVoteToPlayerVoteCounts(playerVoteCounts, clonedGame);
    const maxVotes = Math.max(...playerVoteCounts.map(playerVoteCount => playerVoteCount[1]));
    return playerVoteCounts.filter(playerVoteCount => playerVoteCount[1] === maxVotes).map(playerVoteCount => playerVoteCount[0]);
  }

  private handleTieInVotes(game: Game, gameHistoryRecords: GameHistoryRecord[]): Game {
    const clonedGame = cloneDeep(game);
    const scapegoatPlayer = getPlayerWithCurrentRole(clonedGame.players, ROLE_NAMES.SCAPEGOAT);
    if (scapegoatPlayer && isPlayerAliveAndPowerful(scapegoatPlayer)) {
      const playerVoteScapegoatedByAllDeath = createPlayerVoteScapegoatedByAllDeath();
      return this.playerKillerService.killOrRevealPlayer(scapegoatPlayer._id, clonedGame, playerVoteScapegoatedByAllDeath, gameHistoryRecords);
    }
    const sheriffPlayer = getPlayerWithAttribute(clonedGame.players, PLAYER_ATTRIBUTE_NAMES.SHERIFF);
    if (sheriffPlayer?.isAlive === true) {
      const gamePlaySheriffSettlesVotes = createGamePlaySheriffSettlesVotes();
      return prependUpcomingPlayInGame(gamePlaySheriffSettlesVotes, clonedGame);
    }
    const previousGamePlay = gameHistoryRecords.length ? gameHistoryRecords[gameHistoryRecords.length - 1] : undefined;
    if (previousGamePlay?.play.votingResult !== GAME_HISTORY_RECORD_VOTING_RESULTS.TIE) {
      const gamePlayAllVote = createGamePlayAllVote();
      return prependUpcomingPlayInGame(gamePlayAllVote, clonedGame);
    }
    return clonedGame;
  }

  private allVote({ votes, doesJudgeRequestAnotherVote }: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords: GameHistoryRecord[]): Game {
    let clonedGame = cloneDeep(game);
    if (!votes) {
      return clonedGame;
    }
    const nominatedPlayers = this.getNominatedPlayers(votes, clonedGame);
    if (doesJudgeRequestAnotherVote === true) {
      const gamePlayAllVote = createGamePlayAllVote({ cause: GAME_PLAY_CAUSES.STUTTERING_JUDGE_REQUEST });
      clonedGame = appendUpcomingPlayInGame(gamePlayAllVote, clonedGame);
    }
    if (nominatedPlayers.length > 1) {
      return this.handleTieInVotes(clonedGame, gameHistoryRecords);
    }
    if (nominatedPlayers.length === 1) {
      const playerVoteByAllDeath = createPlayerVoteByAllDeath();
      return this.playerKillerService.killOrRevealPlayer(nominatedPlayers[0]._id, clonedGame, playerVoteByAllDeath, gameHistoryRecords);
    }
    return clonedGame;
  }
  
  private allElectSheriff({ votes }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    if (!votes) {
      return clonedGame;
    }
    const nominatedPlayers = this.getNominatedPlayers(votes, clonedGame);
    if (!nominatedPlayers.length) {
      return clonedGame;
    }
    const sheriffByAllPlayerAttribute = createSheriffByAllPlayerAttribute();
    return addPlayerAttributeInGame(nominatedPlayers[0]._id, clonedGame, sheriffByAllPlayerAttribute);
  }

  private allPlay(play: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords: GameHistoryRecord[]): Game {
    const clonedGame = cloneDeep(game);
    const upcomingGamePlayAction = getUpcomingGamePlayAction(clonedGame.upcomingPlays);
    if (!upcomingGamePlayAction) {
      return clonedGame;
    }
    const allPlayMethods: Partial<Record<GAME_PLAY_ACTIONS, (play: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords?: GameHistoryRecord[]) => Game>> = {
      [GAME_PLAY_ACTIONS.ELECT_SHERIFF]: this.allElectSheriff,
      [GAME_PLAY_ACTIONS.VOTE]: this.allVote,
    };
    const allPlayMethod = allPlayMethods[upcomingGamePlayAction];
    if (allPlayMethod === undefined) {
      return clonedGame;
    }
    return allPlayMethod(play, game, gameHistoryRecords);
  }
  
  private thiefChoosesCard({ chosenCard }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const thiefPlayer = getPlayerWithCurrentRole(clonedGame.players, ROLE_NAMES.THIEF);
    if (!thiefPlayer || !chosenCard) {
      return clonedGame;
    }
    const chosenRole = roles.find(role => role.name === chosenCard.roleName);
    if (!chosenRole) {
      return clonedGame;
    }
    const newThiefSide: PlayerSide = { ...thiefPlayer.side, current: chosenRole.side };
    const newThiefRole: PlayerRole = { ...thiefPlayer.role, current: chosenRole.name };
    const playerDataToUpdate: Partial<Player> = { side: newThiefSide, role: newThiefRole };
    return updatePlayerInGame(thiefPlayer._id, playerDataToUpdate, clonedGame);
  }
  
  private scapegoatBansVoting({ targets }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    if (!targets) {
      return clonedGame;
    }
    const cantVoteByScapegoatPlayerAttribute = createCantVoteByScapegoatPlayerAttribute(clonedGame);
    return addPlayersAttributeInGame(targets.map(({ player }) => player._id), clonedGame, cantVoteByScapegoatPlayerAttribute);
  }
  
  private dogWolfChoosesSide({ chosenSide }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const dogWolfPlayer = getPlayerWithCurrentRole(clonedGame.players, ROLE_NAMES.DOG_WOLF);
    if (!chosenSide || !dogWolfPlayer) {
      return clonedGame;
    }
    const playerDataToUpdate: Partial<Player> = { side: { ...dogWolfPlayer.side, current: chosenSide } };
    return updatePlayerInGame(dogWolfPlayer._id, playerDataToUpdate, clonedGame);
  }
  
  private wildChildChoosesModel({ targets }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const worshipedByWildChildPlayerAttribute = createWorshipedByWildChildPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, worshipedByWildChildPlayerAttribute);
  }

  private foxSniffs({ targets }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const foxPlayer = getPlayerWithCurrentRole(clonedGame.players, ROLE_NAMES.FOX);
    const { isPowerlessIfMissesWerewolf: isFoxPowerlessIfMissesWerewolf } = clonedGame.options.roles.fox;
    const { player: targetedPlayer } = targets[0];
    const foxSniffedPlayers = getFoxSniffedPlayers(targetedPlayer._id, clonedGame);
    if (foxPlayer && isFoxPowerlessIfMissesWerewolf && foxSniffedPlayers.some(player => player.side.current === ROLE_SIDES.WEREWOLVES)) {
      const powerlessByFoxPlayerAttribute = createPowerlessByFoxPlayerAttribute();
      return addPlayerAttributeInGame(foxPlayer._id, clonedGame, powerlessByFoxPlayerAttribute);
    }
    return clonedGame;
  }
  
  private ravenMarks({ targets }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const ravenMarkByRavenPlayerAttribute = createRavenMarkByRavenPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, ravenMarkByRavenPlayerAttribute);
  }
  
  private guardProtects({ targets }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const protectedByGuardPlayerAttribute = createProtectedByGuardPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, protectedByGuardPlayerAttribute);
  }

  private hunterShoots({ targets }: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords: GameHistoryRecord[]): Game {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const shotByHunterDeath = createPlayerShotByHunterDeath();
    return this.playerKillerService.killOrRevealPlayer(targetedPlayer._id, clonedGame, shotByHunterDeath, gameHistoryRecords);
  }

  private witchUsesPotions({ targets }: MakeGamePlayWithRelationsDto, game: Game): Game {
    let clonedGame = cloneDeep(game);
    if (!targets) {
      return clonedGame;
    }
    for (const target of targets) {
      const { player: targetedPlayer } = target;
      if (target.drankPotion === WITCH_POTIONS.LIFE) {
        const drankLifePotionByWitchPlayerAttribute = createDrankLifePotionByWitchPlayerAttribute();
        clonedGame = addPlayerAttributeInGame(targetedPlayer._id, clonedGame, drankLifePotionByWitchPlayerAttribute);
      } else if (target.drankPotion === WITCH_POTIONS.DEATH) {
        const drankDeathPotionByWitchPlayerAttribute = createDrankDeathPotionByWitchPlayerAttribute();
        clonedGame = addPlayerAttributeInGame(targetedPlayer._id, clonedGame, drankDeathPotionByWitchPlayerAttribute);
      }
    }
    return clonedGame;
  }

  private piedPiperCharms({ targets }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = getLeftToCharmByPiedPiperPlayers(game.players).length;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const charmedByPiedPiperPlayerAttribute = createCharmedByPiedPiperPlayerAttribute();
    return addPlayersAttributeInGame(targets.map(({ player }) => player._id), clonedGame, charmedByPiedPiperPlayerAttribute);
  }

  private cupidCharms({ targets }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = 2;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const inLoveByCupidPlayerAttribute = createInLoveByCupidPlayerAttribute();
    return addPlayersAttributeInGame(targets.map(({ player }) => player._id), clonedGame, inLoveByCupidPlayerAttribute);
  }

  private seerLooks({ targets }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const seenBySeerPlayerAttribute = createSeenBySeerPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, seenBySeerPlayerAttribute);
  }

  private whiteWerewolfEats({ targets }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const eatenByWhiteWerewolfPlayerAttribute = createEatenByWhiteWerewolfPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, eatenByWhiteWerewolfPlayerAttribute);
  }

  private bigBadWolfEats({ targets }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const eatenByBigBadWolfPlayerAttribute = createEatenByBigBadWolfPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, eatenByBigBadWolfPlayerAttribute);
  }

  private werewolvesEat({ targets }: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords: GameHistoryRecord[]): Game {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer, isInfected: isTargetInfected } = targets[0];
    const eatenByWerewolvesPlayerAttribute = createEatenByWerewolvesPlayerAttribute();
    const isAncientKillable = this.playerKillerService.isAncientKillable(clonedGame, PLAYER_DEATH_CAUSES.EATEN, gameHistoryRecords);
    if (isTargetInfected === true && (targetedPlayer.role.current !== ROLE_NAMES.ANCIENT || isAncientKillable)) {
      const playerDataToUpdate: Partial<Player> = { side: { ...targetedPlayer.side, current: ROLE_SIDES.WEREWOLVES } };
      return updatePlayerInGame(targetedPlayer._id, playerDataToUpdate, clonedGame);
    }
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, eatenByWerewolvesPlayerAttribute);
  }
}