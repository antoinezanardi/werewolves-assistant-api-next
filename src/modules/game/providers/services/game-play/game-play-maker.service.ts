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
import { getFoxSniffedPlayers, getPlayerWithAttribute, getPlayerWithCurrentRole } from "../../../helpers/game.helper";
import { addPlayerAttributeInGame, addPlayersAttributeInGame, appendUpcomingPlayInGame, prependUpcomingPlayInGame, removePlayerAttributeByNameInGame, updatePlayerInGame } from "../../../helpers/game.mutator";
import { createCantVoteByScapegoatPlayerAttribute, createCharmedByPiedPiperPlayerAttribute, createDrankDeathPotionByWitchPlayerAttribute, createDrankLifePotionByWitchPlayerAttribute, createEatenByBigBadWolfPlayerAttribute, createEatenByWerewolvesPlayerAttribute, createEatenByWhiteWerewolfPlayerAttribute, createInLoveByCupidPlayerAttribute, createPowerlessByFoxPlayerAttribute, createProtectedByGuardPlayerAttribute, createRavenMarkByRavenPlayerAttribute, createSeenBySeerPlayerAttribute, createSheriffByAllPlayerAttribute, createSheriffBySheriffPlayerAttribute, createWorshipedByWildChildPlayerAttribute } from "../../../helpers/player/player-attribute/player-attribute.factory";
import { createPlayerShotByHunterDeath, createPlayerVoteByAllDeath, createPlayerVoteBySheriffDeath, createPlayerVoteScapegoatedByAllDeath } from "../../../helpers/player/player-death/player-death.factory";
import { doesPlayerHaveAttribute, isPlayerAliveAndPowerful } from "../../../helpers/player/player.helper";
import type { Game } from "../../../schemas/game.schema";
import type { PlayerRole } from "../../../schemas/player/player-role.schema";
import type { PlayerSide } from "../../../schemas/player/player-side.schema";
import type { Player } from "../../../schemas/player/player.schema";
import type { PlayerVoteCount } from "../../../types/game-play.type";
import type { GameSource } from "../../../types/game.type";
import { GameHistoryRecordService } from "../game-history/game-history-record.service";
import { PlayerKillerService } from "../player/player-killer.service";

@Injectable()
export class GamePlayMakerService {
  private readonly gameSourcePlayMethods: Partial<Record<GameSource, (play: MakeGamePlayWithRelationsDto, game: Game) => Game | Promise<Game>>> = {
    [PLAYER_GROUPS.WEREWOLVES]: async(play, game) => this.werewolvesEat(play, game),
    [ROLE_NAMES.BIG_BAD_WOLF]: (play, game) => this.bigBadWolfEats(play, game),
    [ROLE_NAMES.WHITE_WEREWOLF]: (play, game) => this.whiteWerewolfEats(play, game),
    [ROLE_NAMES.SEER]: (play, game) => this.seerLooks(play, game),
    [ROLE_NAMES.CUPID]: (play, game) => this.cupidCharms(play, game),
    [ROLE_NAMES.PIED_PIPER]: (play, game) => this.piedPiperCharms(play, game),
    [ROLE_NAMES.WITCH]: (play, game) => this.witchUsesPotions(play, game),
    [ROLE_NAMES.HUNTER]: async(play, game) => this.hunterShoots(play, game),
    [ROLE_NAMES.GUARD]: (play, game) => this.guardProtects(play, game),
    [ROLE_NAMES.FOX]: (play, game) => this.foxSniffs(play, game),
    [ROLE_NAMES.WILD_CHILD]: (play, game) => this.wildChildChoosesModel(play, game),
    [ROLE_NAMES.DOG_WOLF]: (play, game) => this.dogWolfChoosesSide(play, game),
    [ROLE_NAMES.SCAPEGOAT]: (play, game) => this.scapegoatBansVoting(play, game),
    [ROLE_NAMES.THIEF]: (play, game) => this.thiefChoosesCard(play, game),
    [PLAYER_GROUPS.ALL]: async(play, game) => this.allPlay(play, game),
    [ROLE_NAMES.RAVEN]: (play, game) => this.ravenMarks(play, game),
    [PLAYER_ATTRIBUTE_NAMES.SHERIFF]: async(play, game) => this.sheriffPlays(play, game),
  };

  public constructor(
    private readonly playerKillerService: PlayerKillerService,
    private readonly gameHistoryRecordService: GameHistoryRecordService,
  ) {}

  public async makeGamePlay(play: MakeGamePlayWithRelationsDto, game: Game): Promise<Game> {
    const clonedGame = cloneDeep(game);
    const gameSourcePlayMethod = this.gameSourcePlayMethods[clonedGame.currentPlay.source];
    if (gameSourcePlayMethod === undefined) {
      return clonedGame;
    }
    return gameSourcePlayMethod(play, clonedGame);
  }

  private async sheriffSettlesVotes({ targets }: MakeGamePlayWithRelationsDto, game: Game): Promise<Game> {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const targetedPlayer = targets[0].player;
    const voteBySheriffDeath = createPlayerVoteBySheriffDeath();
    return this.playerKillerService.killOrRevealPlayer(targetedPlayer._id, clonedGame, voteBySheriffDeath);
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

  private async sheriffPlays(play: MakeGamePlayWithRelationsDto, game: Game): Promise<Game> {
    const clonedGame = cloneDeep(game);
    const sheriffPlayMethods: Partial<Record<GAME_PLAY_ACTIONS, () => Game | Promise<Game>>> = {
      [GAME_PLAY_ACTIONS.DELEGATE]: () => this.sheriffDelegates(play, clonedGame),
      [GAME_PLAY_ACTIONS.SETTLE_VOTES]: async() => this.sheriffSettlesVotes(play, clonedGame),
    };
    const sheriffPlayMethod = sheriffPlayMethods[clonedGame.currentPlay.action];
    if (sheriffPlayMethod === undefined) {
      return clonedGame;
    }
    return sheriffPlayMethod();
  }

  private addRavenMarkVoteToPlayerVoteCounts(playerVoteCounts: PlayerVoteCount[], game: Game): PlayerVoteCount[] {
    const clonedGame = cloneDeep(game);
    const clonedPlayerVoteCounts = cloneDeep(playerVoteCounts);
    const ravenPlayer = getPlayerWithCurrentRole(clonedGame.players, ROLE_NAMES.RAVEN);
    const ravenMarkedPlayer = getPlayerWithAttribute(clonedGame.players, PLAYER_ATTRIBUTE_NAMES.RAVEN_MARKED);
    if (clonedGame.currentPlay.action !== GAME_PLAY_ACTIONS.VOTE ||
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

  private getNominatedPlayers(votes: MakeGamePlayVoteWithRelationsDto[], game: Game): Player[] {
    const clonedGame = cloneDeep(game);
    let playerVoteCounts = this.getPlayerVoteCounts(votes, clonedGame);
    playerVoteCounts = this.addRavenMarkVoteToPlayerVoteCounts(playerVoteCounts, clonedGame);
    const maxVotes = Math.max(...playerVoteCounts.map(playerVoteCount => playerVoteCount[1]));
    return playerVoteCounts.filter(playerVoteCount => playerVoteCount[1] === maxVotes).map(playerVoteCount => playerVoteCount[0]);
  }

  private async handleTieInVotes(game: Game): Promise<Game> {
    const clonedGame = cloneDeep(game);
    const scapegoatPlayer = getPlayerWithCurrentRole(clonedGame.players, ROLE_NAMES.SCAPEGOAT);
    if (scapegoatPlayer && isPlayerAliveAndPowerful(scapegoatPlayer)) {
      const playerVoteScapegoatedByAllDeath = createPlayerVoteScapegoatedByAllDeath();
      return this.playerKillerService.killOrRevealPlayer(scapegoatPlayer._id, clonedGame, playerVoteScapegoatedByAllDeath);
    }
    const sheriffPlayer = getPlayerWithAttribute(clonedGame.players, PLAYER_ATTRIBUTE_NAMES.SHERIFF);
    if (sheriffPlayer?.isAlive === true) {
      const gamePlaySheriffSettlesVotes = createGamePlaySheriffSettlesVotes();
      return prependUpcomingPlayInGame(gamePlaySheriffSettlesVotes, clonedGame);
    }
    const previousGameHistoryRecord = await this.gameHistoryRecordService.getPreviousGameHistoryRecord(clonedGame._id);
    if (previousGameHistoryRecord?.play.votingResult !== GAME_HISTORY_RECORD_VOTING_RESULTS.TIE) {
      const gamePlayAllVote = createGamePlayAllVote({ cause: GAME_PLAY_CAUSES.PREVIOUS_VOTES_WERE_IN_TIES });
      return prependUpcomingPlayInGame(gamePlayAllVote, clonedGame);
    }
    return clonedGame;
  }

  private async allVote({ votes, doesJudgeRequestAnotherVote }: MakeGamePlayWithRelationsDto, game: Game): Promise<Game> {
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
      return this.handleTieInVotes(clonedGame);
    }
    if (nominatedPlayers.length === 1) {
      const playerVoteByAllDeath = createPlayerVoteByAllDeath();
      return this.playerKillerService.killOrRevealPlayer(nominatedPlayers[0]._id, clonedGame, playerVoteByAllDeath);
    }
    return clonedGame;
  }
  
  private allElectSheriff({ votes }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    if (!votes) {
      return clonedGame;
    }
    const nominatedPlayers = this.getNominatedPlayers(votes, clonedGame);
    if (nominatedPlayers.length !== 1) {
      return clonedGame;
    }
    const sheriffByAllPlayerAttribute = createSheriffByAllPlayerAttribute();
    return addPlayerAttributeInGame(nominatedPlayers[0]._id, clonedGame, sheriffByAllPlayerAttribute);
  }

  private async allPlay(play: MakeGamePlayWithRelationsDto, game: Game): Promise<Game> {
    const clonedGame = cloneDeep(game);
    const allPlayMethods: Partial<Record<GAME_PLAY_ACTIONS, () => Game | Promise<Game>>> = {
      [GAME_PLAY_ACTIONS.ELECT_SHERIFF]: () => this.allElectSheriff(play, clonedGame),
      [GAME_PLAY_ACTIONS.VOTE]: async() => this.allVote(play, clonedGame),
    };
    const allPlayMethod = allPlayMethods[clonedGame.currentPlay.action];
    if (allPlayMethod === undefined) {
      return clonedGame;
    }
    return allPlayMethod();
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
    const foxPlayer = getPlayerWithCurrentRole(clonedGame.players, ROLE_NAMES.FOX);
    const { isPowerlessIfMissesWerewolf: isFoxPowerlessIfMissesWerewolf } = clonedGame.options.roles.fox;
    if (targets?.length !== expectedTargetCount || !foxPlayer) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const foxSniffedPlayers = getFoxSniffedPlayers(targetedPlayer._id, clonedGame);
    const areEveryFoxSniffedPlayersVillagerSided = foxSniffedPlayers.every(player => player.side.current === ROLE_SIDES.VILLAGERS);
    if (isFoxPowerlessIfMissesWerewolf && areEveryFoxSniffedPlayersVillagerSided) {
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

  private async hunterShoots({ targets }: MakeGamePlayWithRelationsDto, game: Game): Promise<Game> {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const shotByHunterDeath = createPlayerShotByHunterDeath();
    return this.playerKillerService.killOrRevealPlayer(targetedPlayer._id, clonedGame, shotByHunterDeath);
  }

  private witchUsesPotions({ targets }: MakeGamePlayWithRelationsDto, game: Game): Game {
    let clonedGame = cloneDeep(game);
    if (!targets) {
      return clonedGame;
    }
    const lifePotionAttribute = createDrankLifePotionByWitchPlayerAttribute();
    const deathPotionAttribute = createDrankDeathPotionByWitchPlayerAttribute();
    for (const target of targets) {
      const { player: targetedPlayer } = target;
      const drankPotionAttribute = target.drankPotion === WITCH_POTIONS.LIFE ? lifePotionAttribute : deathPotionAttribute;
      clonedGame = addPlayerAttributeInGame(targetedPlayer._id, clonedGame, drankPotionAttribute);
    }
    return clonedGame;
  }

  private piedPiperCharms({ targets }: MakeGamePlayWithRelationsDto, game: Game): Game {
    const clonedGame = cloneDeep(game);
    if (targets === undefined || !targets.length) {
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

  private async werewolvesEat({ targets }: MakeGamePlayWithRelationsDto, game: Game): Promise<Game> {
    const clonedGame = cloneDeep(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer, isInfected: isTargetInfected } = targets[0];
    const eatenByWerewolvesPlayerAttribute = createEatenByWerewolvesPlayerAttribute();
    const isAncientKillable = await this.playerKillerService.isAncientKillable(clonedGame, PLAYER_DEATH_CAUSES.EATEN);
    if (isTargetInfected === true && (targetedPlayer.role.current !== ROLE_NAMES.ANCIENT || isAncientKillable)) {
      const playerDataToUpdate: Partial<Player> = { side: { ...targetedPlayer.side, current: ROLE_SIDES.WEREWOLVES } };
      return updatePlayerInGame(targetedPlayer._id, playerDataToUpdate, clonedGame);
    }
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, eatenByWerewolvesPlayerAttribute);
  }
}