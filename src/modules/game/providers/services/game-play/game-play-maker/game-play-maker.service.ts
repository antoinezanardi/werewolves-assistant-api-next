import { Injectable } from "@nestjs/common";
import { sample } from "lodash";

import type { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import { DevotedServantGamePlayMakerService } from "@/modules/game/providers/services/game-play/game-play-maker/devoted-servant-game-play-maker.service";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import type { MakeGamePlayWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { createGamePlaySheriffSettlesVotes, createGamePlaySurvivorsElectSheriff, createGamePlaySurvivorsVote } from "@/modules/game/helpers/game-play/game-play.factory";
import { createGame, createGameWithCurrentGamePlay } from "@/modules/game/helpers/game.factory";
import { getFoxSniffedPlayers, getPlayersWithIds, getPlayerWithActiveAttributeName, getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helper";
import { addPlayerAttributeInGame, addPlayersAttributeInGame, appendUpcomingPlayInGame, prependUpcomingPlayInGame, removePlayerAttributeByNameInGame, updateAdditionalCardInGame, updatePlayerInGame } from "@/modules/game/helpers/game.mutator";
import { createActingByActorPlayerAttribute, createCantVoteByScapegoatPlayerAttribute, createCharmedByPiedPiperPlayerAttribute, createDrankDeathPotionByWitchPlayerAttribute, createDrankLifePotionByWitchPlayerAttribute, createEatenByBigBadWolfPlayerAttribute, createEatenByWerewolvesPlayerAttribute, createEatenByWhiteWerewolfPlayerAttribute, createInLoveByCupidPlayerAttribute, createPowerlessByAccursedWolfFatherPlayerAttribute, createPowerlessByActorPlayerAttribute, createPowerlessByFoxPlayerAttribute, createProtectedByDefenderPlayerAttribute, createScandalmongerMarkByScandalmongerPlayerAttribute, createSeenBySeerPlayerAttribute, createSheriffBySheriffPlayerAttribute, createSheriffBySurvivorsPlayerAttribute, createWorshipedByWildChildPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { createPlayerShotByHunterDeath, createPlayerVoteBySheriffDeath, createPlayerVoteBySurvivorsDeath, createPlayerVoteScapegoatedBySurvivorsDeath } from "@/modules/game/helpers/player/player-death/player-death.factory";
import { isPlayerAliveAndPowerful } from "@/modules/game/helpers/player/player.helper";
import { GamePlayVoteService } from "@/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import { PlayerKillerService } from "@/modules/game/providers/services/player/player-killer.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { PlayerRole } from "@/modules/game/schemas/player/player-role/player-role.schema";
import type { PlayerSide } from "@/modules/game/schemas/player/player-side/player-side.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { GamePlaySourceName } from "@/modules/game/types/game-play.type";
import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play";
import { ROLES } from "@/modules/role/constants/role.constant";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";
import { getRoleWithName } from "@/modules/role/helpers/role.helper";
import type { Role } from "@/modules/role/types/role.type";

import { createCantFindLastDeadPlayersUnexpectedException, createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

@Injectable()
export class GamePlayMakerService {
  private readonly gameSourcePlayMethods: Partial<Record<GamePlaySourceName, (play: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay) => Game | Promise<Game>>> = {
    [PlayerGroups.WEREWOLVES]: async(play, game) => this.werewolvesEat(play, game),
    [PlayerGroups.SURVIVORS]: async(play, game) => this.survivorsPlay(play, game),
    [PlayerAttributeNames.SHERIFF]: async(play, game) => this.sheriffPlays(play, game),
    [RoleNames.BIG_BAD_WOLF]: (play, game) => this.bigBadWolfEats(play, game),
    [RoleNames.WHITE_WEREWOLF]: (play, game) => this.whiteWerewolfEats(play, game),
    [RoleNames.SEER]: (play, game) => this.seerLooks(play, game),
    [RoleNames.CUPID]: (play, game) => this.cupidCharms(play, game),
    [RoleNames.PIED_PIPER]: (play, game) => this.piedPiperCharms(play, game),
    [RoleNames.WITCH]: (play, game) => this.witchUsesPotions(play, game),
    [RoleNames.HUNTER]: async(play, game) => this.hunterShoots(play, game),
    [RoleNames.DEFENDER]: (play, game) => this.defenderProtects(play, game),
    [RoleNames.FOX]: (play, game) => this.foxSniffs(play, game),
    [RoleNames.WILD_CHILD]: (play, game) => this.wildChildChoosesModel(play, game),
    [RoleNames.WOLF_HOUND]: (play, game) => this.wolfHoundChoosesSide(play, game),
    [RoleNames.SCAPEGOAT]: (play, game) => this.scapegoatBansVoting(play, game),
    [RoleNames.THIEF]: (play, game) => this.thiefChoosesCard(play, game),
    [RoleNames.SCANDALMONGER]: (play, game) => this.scandalmongerMarks(play, game),
    [RoleNames.ACTOR]: (play, game) => this.actorChoosesCard(play, game),
  };

  public constructor(
    private readonly playerKillerService: PlayerKillerService,
    private readonly gamePlayVoteService: GamePlayVoteService,
    private readonly gameHistoryRecordService: GameHistoryRecordService,
    private readonly devotedServantGamePlayMakerService: DevotedServantGamePlayMakerService,
  ) {}

  public async makeGamePlay(play: MakeGamePlayWithRelationsDto, game: Game): Promise<Game> {
    if (!game.currentPlay) {
      throw createNoCurrentGamePlayUnexpectedException("makeGamePlay", { gameId: game._id });
    }
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    const gameSourcePlayMethod = this.gameSourcePlayMethods[clonedGame.currentPlay.source.name];
    return gameSourcePlayMethod ? gameSourcePlayMethod(play, clonedGame) : clonedGame;
  }

  private actorChoosesCard({ chosenCard }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    let clonedGame = createGame(game);
    const actorPlayer = getPlayerWithCurrentRole(clonedGame, RoleNames.ACTOR);
    if (!actorPlayer || !chosenCard) {
      return clonedGame;
    }
    const chosenRole = getRoleWithName(ROLES as Role[], chosenCard.roleName);
    if (!chosenRole) {
      return clonedGame;
    }
    const actorDataToUpdate: Partial<Player> = {
      role: { ...actorPlayer.role, current: chosenRole.name },
      attributes: [...actorPlayer.attributes, createActingByActorPlayerAttribute()],
    };
    clonedGame = updatePlayerInGame(actorPlayer._id, actorDataToUpdate, clonedGame);
    return updateAdditionalCardInGame(chosenCard._id, { isUsed: true }, clonedGame);
  }

  private async sheriffSettlesVotes({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Promise<Game> {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const targetedPlayer = targets[0].player;
    const voteBySheriffDeath = createPlayerVoteBySheriffDeath();
    return this.playerKillerService.killOrRevealPlayer(targetedPlayer._id, clonedGame, voteBySheriffDeath);
  }

  private sheriffDelegates({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    let clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const targetedPlayer = targets[0].player;
    const sheriffPlayer = getPlayerWithActiveAttributeName(clonedGame, PlayerAttributeNames.SHERIFF);
    if (sheriffPlayer) {
      clonedGame = removePlayerAttributeByNameInGame(sheriffPlayer._id, clonedGame, PlayerAttributeNames.SHERIFF) as GameWithCurrentPlay;
    }
    const sheriffBySheriffPlayerAttribute = createSheriffBySheriffPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, sheriffBySheriffPlayerAttribute);
  }

  private async sheriffPlays(play: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Promise<Game> {
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    const sheriffPlayMethods: Partial<Record<GamePlayActions, () => Game | Promise<Game>>> = {
      [GamePlayActions.DELEGATE]: () => this.sheriffDelegates(play, clonedGame),
      [GamePlayActions.SETTLE_VOTES]: async() => this.sheriffSettlesVotes(play, clonedGame),
    };
    const sheriffPlayMethod = sheriffPlayMethods[clonedGame.currentPlay.action];
    if (sheriffPlayMethod === undefined) {
      return clonedGame;
    }
    return sheriffPlayMethod();
  }

  private async survivorsBuryDeadBodies({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Promise<Game> {
    let clonedGame = createGame(game);
    const { areRevealedOnDeath: areRolesRevealedOnDeath } = clonedGame.options.roles;
    const previousGameHistoryRecord = await this.gameHistoryRecordService.getPreviousGameHistoryRecord(clonedGame._id);
    if (previousGameHistoryRecord?.deadPlayers === undefined || previousGameHistoryRecord.deadPlayers.length === 0) {
      throw createCantFindLastDeadPlayersUnexpectedException("survivorsBuryDeadBodies", { gameId: clonedGame._id });
    }
    const expectedTargetCountForDevotedServant = 1;
    if (targets?.length === expectedTargetCountForDevotedServant) {
      clonedGame = this.devotedServantGamePlayMakerService.devotedServantStealsRole(targets[0].player as DeadPlayer, clonedGame);
    }
    const previousDeadPlayersIds = previousGameHistoryRecord.deadPlayers.map(({ _id }) => _id);
    const previousDeadPlayersInGame = getPlayersWithIds(previousDeadPlayersIds, clonedGame) as DeadPlayer[];
    for (const deadPlayer of previousDeadPlayersInGame) {
      if (areRolesRevealedOnDeath) {
        clonedGame = this.playerKillerService.revealPlayerRole(deadPlayer, clonedGame);
      }
      clonedGame = this.playerKillerService.applyPlayerDeathOutcomes(deadPlayer, clonedGame);
    }
    return clonedGame;
  }

  private async handleTieInVotes(game: GameWithCurrentPlay): Promise<Game> {
    const clonedGame = createGameWithCurrentGamePlay(game);
    const { mustSettleTieInVotes: mustSheriffSettleTieInVotes } = clonedGame.options.roles.sheriff;
    const scapegoatPlayer = getPlayerWithCurrentRole(clonedGame, RoleNames.SCAPEGOAT);
    if (scapegoatPlayer && isPlayerAliveAndPowerful(scapegoatPlayer, game)) {
      const playerVoteScapegoatedBySurvivorsDeath = createPlayerVoteScapegoatedBySurvivorsDeath();
      return this.playerKillerService.killOrRevealPlayer(scapegoatPlayer._id, clonedGame, playerVoteScapegoatedBySurvivorsDeath);
    }
    const sheriffPlayer = getPlayerWithActiveAttributeName(clonedGame, PlayerAttributeNames.SHERIFF);
    if (sheriffPlayer?.isAlive === true && mustSheriffSettleTieInVotes) {
      const gamePlaySheriffSettlesVotes = createGamePlaySheriffSettlesVotes();
      return prependUpcomingPlayInGame(gamePlaySheriffSettlesVotes, clonedGame);
    }
    if (clonedGame.currentPlay.cause !== GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES) {
      const gamePlaySurvivorsVote = createGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });
      return prependUpcomingPlayInGame(gamePlaySurvivorsVote, clonedGame);
    }
    return clonedGame;
  }

  private async survivorsVote({ votes, doesJudgeRequestAnotherVote }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Promise<Game> {
    let clonedGame = createGame(game) as GameWithCurrentPlay;
    const nominatedPlayers = this.gamePlayVoteService.getNominatedPlayers(votes, clonedGame);
    if (doesJudgeRequestAnotherVote === true) {
      const gamePlaySurvivorsVote = createGamePlaySurvivorsVote({ cause: GamePlayCauses.STUTTERING_JUDGE_REQUEST });
      clonedGame = appendUpcomingPlayInGame(gamePlaySurvivorsVote, clonedGame) as GameWithCurrentPlay;
    }
    if (nominatedPlayers.length > 1) {
      return this.handleTieInVotes(clonedGame);
    }
    if (nominatedPlayers.length === 1) {
      const playerVoteBySurvivorsDeath = createPlayerVoteBySurvivorsDeath();
      return this.playerKillerService.killOrRevealPlayer(nominatedPlayers[0]._id, clonedGame, playerVoteBySurvivorsDeath);
    }
    return clonedGame;
  }

  private handleTieInSheriffElection(nominatedPlayers: Player[], game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    if (clonedGame.currentPlay.cause !== GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES) {
      const gamePlaySurvivorsElectSheriff = createGamePlaySurvivorsElectSheriff({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });
      return prependUpcomingPlayInGame(gamePlaySurvivorsElectSheriff, clonedGame);
    }
    const randomNominatedPlayer = sample(nominatedPlayers);
    if (randomNominatedPlayer) {
      const sheriffBySurvivorsPlayerAttribute = createSheriffBySurvivorsPlayerAttribute();
      return addPlayerAttributeInGame(randomNominatedPlayer._id, clonedGame, sheriffBySurvivorsPlayerAttribute);
    }
    return clonedGame;
  }

  private survivorsElectSheriff(play: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    const { votes } = play;
    const nominatedPlayers = this.gamePlayVoteService.getNominatedPlayers(votes, clonedGame);
    if (!nominatedPlayers.length) {
      return clonedGame;
    }
    if (nominatedPlayers.length !== 1) {
      return this.handleTieInSheriffElection(nominatedPlayers, clonedGame);
    }
    const sheriffBySurvivorsPlayerAttribute = createSheriffBySurvivorsPlayerAttribute();
    return addPlayerAttributeInGame(nominatedPlayers[0]._id, clonedGame, sheriffBySurvivorsPlayerAttribute);
  }

  private async survivorsPlay(play: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Promise<Game> {
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    const survivorsPlayMethods: Partial<Record<GamePlayActions, () => Game | Promise<Game>>> = {
      [GamePlayActions.ELECT_SHERIFF]: () => this.survivorsElectSheriff(play, clonedGame),
      [GamePlayActions.VOTE]: async() => this.survivorsVote(play, clonedGame),
      [GamePlayActions.BURY_DEAD_BODIES]: async() => this.survivorsBuryDeadBodies(play, clonedGame),
    };
    const survivorsPlayMethod = survivorsPlayMethods[clonedGame.currentPlay.action];
    if (survivorsPlayMethod === undefined) {
      return clonedGame;
    }
    return survivorsPlayMethod();
  }
  
  private thiefChoosesCard({ chosenCard }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    let clonedGame = createGame(game);
    const thiefPlayer = getPlayerWithCurrentRole(clonedGame, RoleNames.THIEF);
    if (!thiefPlayer || !chosenCard) {
      return clonedGame;
    }
    const chosenRole = getRoleWithName(ROLES as Role[], chosenCard.roleName);
    if (!chosenRole) {
      return clonedGame;
    }
    const newThiefSide: PlayerSide = { ...thiefPlayer.side, current: chosenRole.side };
    const newThiefRole: PlayerRole = { ...thiefPlayer.role, current: chosenRole.name };
    const playerDataToUpdate: Partial<Player> = { side: newThiefSide, role: newThiefRole };
    clonedGame = updatePlayerInGame(thiefPlayer._id, playerDataToUpdate, clonedGame);
    return updateAdditionalCardInGame(chosenCard._id, { isUsed: true }, clonedGame);
  }
  
  private scapegoatBansVoting({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    if (!targets) {
      return clonedGame;
    }
    const cantVoteByScapegoatPlayerAttribute = createCantVoteByScapegoatPlayerAttribute(clonedGame);
    return addPlayersAttributeInGame(targets.map(({ player }) => player._id), clonedGame, cantVoteByScapegoatPlayerAttribute);
  }
  
  private wolfHoundChoosesSide({ chosenSide }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    const { roles } = clonedGame.options;
    const wolfHoundPlayer = getPlayerWithCurrentRole(clonedGame, RoleNames.WOLF_HOUND);
    if (!wolfHoundPlayer) {
      return clonedGame;
    }
    const wolfHoundSide = chosenSide ?? sample([RoleSides.VILLAGERS, RoleSides.WEREWOLVES]);
    const playerDataToUpdate: Partial<Player> = { side: { ...wolfHoundPlayer.side, current: wolfHoundSide } };
    if (wolfHoundPlayer.role.original === RoleNames.ACTOR && wolfHoundSide === RoleSides.WEREWOLVES && roles.actor.isPowerlessOnWerewolvesSide) {
      playerDataToUpdate.attributes = [...wolfHoundPlayer.attributes, createPowerlessByActorPlayerAttribute()];
    }
    return updatePlayerInGame(wolfHoundPlayer._id, playerDataToUpdate, clonedGame);
  }
  
  private wildChildChoosesModel({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const worshipedByWildChildPlayerAttribute = createWorshipedByWildChildPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, worshipedByWildChildPlayerAttribute);
  }

  private foxSniffs({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    const foxPlayer = getPlayerWithCurrentRole(clonedGame, RoleNames.FOX);
    const { isPowerlessIfMissesWerewolf: isFoxPowerlessIfMissesWerewolf } = clonedGame.options.roles.fox;
    if (targets?.length !== expectedTargetCount || !foxPlayer) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const foxSniffedPlayers = getFoxSniffedPlayers(targetedPlayer._id, clonedGame);
    const areEveryFoxSniffedPlayersVillagerSided = foxSniffedPlayers.every(player => player.side.current === RoleSides.VILLAGERS);
    if (isFoxPowerlessIfMissesWerewolf && areEveryFoxSniffedPlayersVillagerSided) {
      const powerlessByFoxPlayerAttribute = createPowerlessByFoxPlayerAttribute();
      return addPlayerAttributeInGame(foxPlayer._id, clonedGame, powerlessByFoxPlayerAttribute);
    }
    return clonedGame;
  }
  
  private scandalmongerMarks({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const scandalmongerMarkByScandalmongerPlayerAttribute = createScandalmongerMarkByScandalmongerPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, scandalmongerMarkByScandalmongerPlayerAttribute);
  }
  
  private defenderProtects({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const protectedByDefenderPlayerAttribute = createProtectedByDefenderPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, protectedByDefenderPlayerAttribute);
  }

  private async hunterShoots({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Promise<Game> {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const shotByHunterDeath = createPlayerShotByHunterDeath();
    return this.playerKillerService.killOrRevealPlayer(targetedPlayer._id, clonedGame, shotByHunterDeath);
  }

  private witchUsesPotions({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    let clonedGame = createGame(game);
    if (!targets) {
      return clonedGame;
    }
    const lifePotionAttribute = createDrankLifePotionByWitchPlayerAttribute();
    const deathPotionAttribute = createDrankDeathPotionByWitchPlayerAttribute();
    for (const target of targets) {
      const { player: targetedPlayer } = target;
      const drankPotionAttribute = target.drankPotion === WitchPotions.LIFE ? lifePotionAttribute : deathPotionAttribute;
      clonedGame = addPlayerAttributeInGame(targetedPlayer._id, clonedGame, drankPotionAttribute) as GameWithCurrentPlay;
    }
    return clonedGame;
  }

  private piedPiperCharms({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    if (targets === undefined) {
      return clonedGame;
    }
    const charmedByPiedPiperPlayerAttribute = createCharmedByPiedPiperPlayerAttribute();
    return addPlayersAttributeInGame(targets.map(({ player }) => player._id), clonedGame, charmedByPiedPiperPlayerAttribute);
  }

  private cupidCharms({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    const expectedTargetCount = 2;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const inLoveByCupidPlayerAttribute = createInLoveByCupidPlayerAttribute();
    return addPlayersAttributeInGame(targets.map(({ player }) => player._id), clonedGame, inLoveByCupidPlayerAttribute);
  }

  private seerLooks({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const seenBySeerPlayerAttribute = createSeenBySeerPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, seenBySeerPlayerAttribute);
  }

  private whiteWerewolfEats({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const eatenByWhiteWerewolfPlayerAttribute = createEatenByWhiteWerewolfPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, eatenByWhiteWerewolfPlayerAttribute);
  }

  private bigBadWolfEats({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const eatenByBigBadWolfPlayerAttribute = createEatenByBigBadWolfPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, eatenByBigBadWolfPlayerAttribute);
  }

  private accursedWolfFatherInfects(targetedPlayer: Player, game: GameWithCurrentPlay): Game {
    let clonedGame = createGame(game);
    const { roles } = game.options;
    const playerDataToUpdate: Partial<Player> = { side: { ...targetedPlayer.side, current: RoleSides.WEREWOLVES } };
    if (targetedPlayer.role.current === RoleNames.PREJUDICED_MANIPULATOR && roles.prejudicedManipulator.isPowerlessOnWerewolvesSide ||
      targetedPlayer.role.current === RoleNames.PIED_PIPER && roles.piedPiper.isPowerlessOnWerewolvesSide ||
      targetedPlayer.role.current === RoleNames.ACTOR && roles.actor.isPowerlessOnWerewolvesSide) {
      clonedGame = addPlayerAttributeInGame(targetedPlayer._id, clonedGame, createPowerlessByAccursedWolfFatherPlayerAttribute());
    }
    return updatePlayerInGame(targetedPlayer._id, playerDataToUpdate, clonedGame);
  }

  private async werewolvesEat({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Promise<Game> {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer, isInfected: isTargetInfected } = targets[0];
    const eatenByWerewolvesPlayerAttribute = createEatenByWerewolvesPlayerAttribute();
    const elderLivesCount = await this.playerKillerService.getElderLivesCountAgainstWerewolves(clonedGame, targetedPlayer);
    if (isTargetInfected === true && (targetedPlayer.role.current !== RoleNames.ELDER || elderLivesCount <= 1)) {
      return this.accursedWolfFatherInfects(targetedPlayer, clonedGame as GameWithCurrentPlay);
    }
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, eatenByWerewolvesPlayerAttribute);
  }
}