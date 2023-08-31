import { Injectable } from "@nestjs/common";
import { sample } from "lodash";

import type { MakeGamePlayWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerDeathCauses, PlayerGroups } from "@/modules/game/enums/player.enum";
import { createGamePlayAllVote, createGamePlaySheriffSettlesVotes } from "@/modules/game/helpers/game-play/game-play.factory";
import { createGame } from "@/modules/game/helpers/game.factory";
import { getFoxSniffedPlayers, getPlayerWithActiveAttributeName, getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helper";
import { addPlayerAttributeInGame, addPlayersAttributeInGame, appendUpcomingPlayInGame, prependUpcomingPlayInGame, removePlayerAttributeByNameInGame, updatePlayerInGame } from "@/modules/game/helpers/game.mutator";
import { createCantVoteByScapegoatPlayerAttribute, createCharmedByPiedPiperPlayerAttribute, createDrankDeathPotionByWitchPlayerAttribute, createDrankLifePotionByWitchPlayerAttribute, createEatenByBigBadWolfPlayerAttribute, createEatenByWerewolvesPlayerAttribute, createEatenByWhiteWerewolfPlayerAttribute, createInLoveByCupidPlayerAttribute, createPowerlessByFoxPlayerAttribute, createProtectedByGuardPlayerAttribute, createRavenMarkByRavenPlayerAttribute, createSeenBySeerPlayerAttribute, createSheriffByAllPlayerAttribute, createSheriffBySheriffPlayerAttribute, createWorshipedByWildChildPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { createPlayerShotByHunterDeath, createPlayerVoteByAllDeath, createPlayerVoteBySheriffDeath, createPlayerVoteScapegoatedByAllDeath } from "@/modules/game/helpers/player/player-death/player-death.factory";
import { isPlayerAliveAndPowerful } from "@/modules/game/helpers/player/player.helper";
import { GamePlayVoteService } from "@/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import { PlayerKillerService } from "@/modules/game/providers/services/player/player-killer.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { PlayerRole } from "@/modules/game/schemas/player/player-role.schema";
import type { PlayerSide } from "@/modules/game/schemas/player/player-side.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play";
import type { GameSource } from "@/modules/game/types/game.type";
import { ROLES } from "@/modules/role/constants/role.constant";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

import { createFakeGamePlayAllElectSheriff } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";

@Injectable()
export class GamePlayMakerService {
  private readonly gameSourcePlayMethods: Partial<Record<GameSource, (play: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay) => Game | Promise<Game>>> = {
    [PlayerGroups.WEREWOLVES]: async(play, game) => this.werewolvesEat(play, game),
    [RoleNames.BIG_BAD_WOLF]: (play, game) => this.bigBadWolfEats(play, game),
    [RoleNames.WHITE_WEREWOLF]: (play, game) => this.whiteWerewolfEats(play, game),
    [RoleNames.SEER]: (play, game) => this.seerLooks(play, game),
    [RoleNames.CUPID]: (play, game) => this.cupidCharms(play, game),
    [RoleNames.PIED_PIPER]: (play, game) => this.piedPiperCharms(play, game),
    [RoleNames.WITCH]: (play, game) => this.witchUsesPotions(play, game),
    [RoleNames.HUNTER]: async(play, game) => this.hunterShoots(play, game),
    [RoleNames.GUARD]: (play, game) => this.guardProtects(play, game),
    [RoleNames.FOX]: (play, game) => this.foxSniffs(play, game),
    [RoleNames.WILD_CHILD]: (play, game) => this.wildChildChoosesModel(play, game),
    [RoleNames.DOG_WOLF]: (play, game) => this.dogWolfChoosesSide(play, game),
    [RoleNames.SCAPEGOAT]: (play, game) => this.scapegoatBansVoting(play, game),
    [RoleNames.THIEF]: (play, game) => this.thiefChoosesCard(play, game),
    [PlayerGroups.ALL]: async(play, game) => this.allPlay(play, game),
    [RoleNames.RAVEN]: (play, game) => this.ravenMarks(play, game),
    [PlayerAttributeNames.SHERIFF]: async(play, game) => this.sheriffPlays(play, game),
  };

  public constructor(
    private readonly playerKillerService: PlayerKillerService,
    private readonly gamePlayVoteService: GamePlayVoteService,
  ) {}

  public async makeGamePlay(play: MakeGamePlayWithRelationsDto, game: Game): Promise<Game> {
    if (!game.currentPlay) {
      throw createNoCurrentGamePlayUnexpectedException("makeGamePlay", { gameId: game._id });
    }
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    const gameSourcePlayMethod = this.gameSourcePlayMethods[clonedGame.currentPlay.source.name];
    if (gameSourcePlayMethod === undefined) {
      return clonedGame;
    }
    return gameSourcePlayMethod(play, clonedGame);
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

  private async handleTieInVotes(game: GameWithCurrentPlay): Promise<Game> {
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    const scapegoatPlayer = getPlayerWithCurrentRole(clonedGame, RoleNames.SCAPEGOAT);
    if (scapegoatPlayer && isPlayerAliveAndPowerful(scapegoatPlayer, game)) {
      const playerVoteScapegoatedByAllDeath = createPlayerVoteScapegoatedByAllDeath();
      return this.playerKillerService.killOrRevealPlayer(scapegoatPlayer._id, clonedGame, playerVoteScapegoatedByAllDeath);
    }
    const sheriffPlayer = getPlayerWithActiveAttributeName(clonedGame, PlayerAttributeNames.SHERIFF);
    if (sheriffPlayer?.isAlive === true) {
      const gamePlaySheriffSettlesVotes = createGamePlaySheriffSettlesVotes();
      return prependUpcomingPlayInGame(gamePlaySheriffSettlesVotes, clonedGame);
    }
    if (clonedGame.currentPlay.cause !== GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES) {
      const gamePlayAllVote = createGamePlayAllVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });
      return prependUpcomingPlayInGame(gamePlayAllVote, clonedGame);
    }
    return clonedGame;
  }

  private async allVote({ votes, doesJudgeRequestAnotherVote }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Promise<Game> {
    let clonedGame = createGame(game) as GameWithCurrentPlay;
    const nominatedPlayers = this.gamePlayVoteService.getNominatedPlayers(votes, clonedGame);
    if (doesJudgeRequestAnotherVote === true) {
      const gamePlayAllVote = createGamePlayAllVote({ cause: GamePlayCauses.STUTTERING_JUDGE_REQUEST });
      clonedGame = appendUpcomingPlayInGame(gamePlayAllVote, clonedGame) as GameWithCurrentPlay;
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

  private handleTieInSheriffElection(nominatedPlayers: Player[], game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    if (clonedGame.currentPlay.cause !== GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES) {
      const gamePlayAllElectSheriff = createFakeGamePlayAllElectSheriff({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });
      return prependUpcomingPlayInGame(gamePlayAllElectSheriff, clonedGame);
    }
    const randomNominatedPlayer = sample(nominatedPlayers);
    if (randomNominatedPlayer) {
      const sheriffByAllPlayerAttribute = createSheriffByAllPlayerAttribute();
      return addPlayerAttributeInGame(randomNominatedPlayer._id, clonedGame, sheriffByAllPlayerAttribute);
    }
    return clonedGame;
  }

  private allElectSheriff(play: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    const { votes } = play;
    const nominatedPlayers = this.gamePlayVoteService.getNominatedPlayers(votes, clonedGame);
    if (!nominatedPlayers.length) {
      return clonedGame;
    }
    if (nominatedPlayers.length !== 1) {
      return this.handleTieInSheriffElection(nominatedPlayers, clonedGame);
    }
    const sheriffByAllPlayerAttribute = createSheriffByAllPlayerAttribute();
    return addPlayerAttributeInGame(nominatedPlayers[0]._id, clonedGame, sheriffByAllPlayerAttribute);
  }

  private async allPlay(play: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Promise<Game> {
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    const allPlayMethods: Partial<Record<GamePlayActions, () => Game | Promise<Game>>> = {
      [GamePlayActions.ELECT_SHERIFF]: () => this.allElectSheriff(play, clonedGame),
      [GamePlayActions.VOTE]: async() => this.allVote(play, clonedGame),
    };
    const allPlayMethod = allPlayMethods[clonedGame.currentPlay.action];
    if (allPlayMethod === undefined) {
      return clonedGame;
    }
    return allPlayMethod();
  }
  
  private thiefChoosesCard({ chosenCard }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    const thiefPlayer = getPlayerWithCurrentRole(clonedGame, RoleNames.THIEF);
    if (!thiefPlayer || !chosenCard) {
      return clonedGame;
    }
    const chosenRole = ROLES.find(role => role.name === chosenCard.roleName);
    if (!chosenRole) {
      return clonedGame;
    }
    const newThiefSide: PlayerSide = { ...thiefPlayer.side, current: chosenRole.side };
    const newThiefRole: PlayerRole = { ...thiefPlayer.role, current: chosenRole.name };
    const playerDataToUpdate: Partial<Player> = { side: newThiefSide, role: newThiefRole };
    return updatePlayerInGame(thiefPlayer._id, playerDataToUpdate, clonedGame);
  }
  
  private scapegoatBansVoting({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    if (!targets) {
      return clonedGame;
    }
    const cantVoteByScapegoatPlayerAttribute = createCantVoteByScapegoatPlayerAttribute(clonedGame);
    return addPlayersAttributeInGame(targets.map(({ player }) => player._id), clonedGame, cantVoteByScapegoatPlayerAttribute);
  }
  
  private dogWolfChoosesSide({ chosenSide }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    const dogWolfPlayer = getPlayerWithCurrentRole(clonedGame, RoleNames.DOG_WOLF);
    if (chosenSide === undefined || !dogWolfPlayer) {
      return clonedGame;
    }
    const playerDataToUpdate: Partial<Player> = { side: { ...dogWolfPlayer.side, current: chosenSide } };
    return updatePlayerInGame(dogWolfPlayer._id, playerDataToUpdate, clonedGame);
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
  
  private ravenMarks({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const ravenMarkByRavenPlayerAttribute = createRavenMarkByRavenPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, ravenMarkByRavenPlayerAttribute);
  }
  
  private guardProtects({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const protectedByGuardPlayerAttribute = createProtectedByGuardPlayerAttribute();
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, protectedByGuardPlayerAttribute);
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

  private async werewolvesEat({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Promise<Game> {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer, isInfected: isTargetInfected } = targets[0];
    const eatenByWerewolvesPlayerAttribute = createEatenByWerewolvesPlayerAttribute();
    const isAncientKillable = await this.playerKillerService.isAncientKillable(clonedGame, PlayerDeathCauses.EATEN);
    if (isTargetInfected === true && (targetedPlayer.role.current !== RoleNames.ANCIENT || isAncientKillable)) {
      const playerDataToUpdate: Partial<Player> = { side: { ...targetedPlayer.side, current: RoleSides.WEREWOLVES } };
      return updatePlayerInGame(targetedPlayer._id, playerDataToUpdate, clonedGame);
    }
    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, eatenByWerewolvesPlayerAttribute);
  }
}