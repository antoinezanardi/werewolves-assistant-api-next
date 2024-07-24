import { Injectable } from "@nestjs/common";
import { sample } from "lodash";

import { doesGamePlayHaveCause } from "@/modules/game/helpers/game-play/game-play.helpers";
import type { MakeGamePlayWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import { createGamePlaySheriffSettlesVotes, createGamePlayStutteringJudgeRequestsAnotherVote, createGamePlaySurvivorsElectSheriff, createGamePlaySurvivorsVote } from "@/modules/game/helpers/game-play/game-play.factory";
import { createGame, createGameWithCurrentGamePlay } from "@/modules/game/helpers/game.factory";
import { getFoxSniffedPlayers, getPlayersWithIds, getPlayerWithActiveAttributeName, getPlayerWithCurrentRole } from "@/modules/game/helpers/game.helpers";
import { addPlayerAttributeInGame, addPlayersAttributeInGame, prependUpcomingPlayInGame, removePlayerAttributeByNameInGame, updateAdditionalCardInGame, updatePlayerInGame } from "@/modules/game/helpers/game.mutators";
import { createActingByActorPlayerAttribute, createCantVoteByScapegoatPlayerAttribute, createCharmedByPiedPiperPlayerAttribute, createDrankDeathPotionByWitchPlayerAttribute, createDrankLifePotionByWitchPlayerAttribute, createEatenByBigBadWolfPlayerAttribute, createEatenByWerewolvesPlayerAttribute, createEatenByWhiteWerewolfPlayerAttribute, createInLoveByCupidPlayerAttribute, createPowerlessByAccursedWolfFatherPlayerAttribute, createPowerlessByActorPlayerAttribute, createPowerlessByFoxPlayerAttribute, createProtectedByDefenderPlayerAttribute, createScandalmongerMarkByScandalmongerPlayerAttribute, createSeenBySeerPlayerAttribute, createSheriffBySheriffPlayerAttribute, createSheriffBySurvivorsPlayerAttribute, createWorshipedByWildChildPlayerAttribute } from "@/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { createPlayerShotByHunterDeath, createPlayerVoteBySheriffDeath, createPlayerVoteBySurvivorsDeath, createPlayerVoteScapegoatedBySurvivorsDeath } from "@/modules/game/helpers/player/player-death/player-death.factory";
import { isPlayerAliveAndPowerful, isPlayerPowerlessOnWerewolvesSide } from "@/modules/game/helpers/player/player.helpers";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { DevotedServantGamePlayMakerService } from "@/modules/game/providers/services/game-play/game-play-maker/devoted-servant-game-play-maker.service";
import { GamePlayVoteService } from "@/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import { PlayerKillerService } from "@/modules/game/providers/services/player/player-killer.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import type { PlayerRole } from "@/modules/game/schemas/player/player-role/player-role.schema";
import type { PlayerSide } from "@/modules/game/schemas/player/player-side/player-side.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { GamePlayAction, GamePlayCause, GamePlaySourceName } from "@/modules/game/types/game-play/game-play.types";
import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play.types";
import { ROLES } from "@/modules/role/constants/role-set.constants";
import { getRoleWithName } from "@/modules/role/helpers/role.helpers";
import { Role } from "@/modules/role/types/role.class";

import { createCantFindLastDeadPlayersUnexpectedException, createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

@Injectable()
export class GamePlayMakerService {
  private readonly gameSourcePlayMethods: Partial<Record<GamePlaySourceName, (play: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay) => Game | Promise<Game>>> = {
    "werewolves": (play, game) => this.werewolvesEat(play, game),
    "survivors": async(play, game) => this.survivorsPlay(play, game),
    "sheriff": async(play, game) => this.sheriffPlays(play, game),
    "big-bad-wolf": (play, game) => this.bigBadWolfEats(play, game),
    "white-werewolf": (play, game) => this.whiteWerewolfEats(play, game),
    "seer": (play, game) => this.seerLooks(play, game),
    "cupid": (play, game) => this.cupidCharms(play, game),
    "pied-piper": (play, game) => this.piedPiperCharms(play, game),
    "witch": (play, game) => this.witchUsesPotions(play, game),
    "hunter": async(play, game) => this.hunterShoots(play, game),
    "defender": (play, game) => this.defenderProtects(play, game),
    "fox": (play, game) => this.foxSniffs(play, game),
    "wild-child": (play, game) => this.wildChildChoosesModel(play, game),
    "wolf-hound": (play, game) => this.wolfHoundChoosesSide(play, game),
    "scapegoat": (play, game) => this.scapegoatBansVoting(play, game),
    "thief": (play, game) => this.thiefChoosesCard(play, game),
    "scandalmonger": (play, game) => this.scandalmongerMarks(play, game),
    "actor": (play, game) => this.actorChoosesCard(play, game),
    "accursed-wolf-father": async(play, game) => this.accursedWolfFatherInfects(play, game),
    "stuttering-judge": (play, game) => this.stutteringJudgeRequestsAnotherVote(play, game),
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
    const actorPlayer = getPlayerWithCurrentRole(clonedGame, "actor");
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
    const sheriffPlayer = getPlayerWithActiveAttributeName(clonedGame, "sheriff");
    if (sheriffPlayer) {
      clonedGame = removePlayerAttributeByNameInGame(sheriffPlayer._id, clonedGame, "sheriff") as GameWithCurrentPlay;
    }
    const sheriffBySheriffPlayerAttribute = createSheriffBySheriffPlayerAttribute();

    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, sheriffBySheriffPlayerAttribute);
  }

  private async sheriffPlays(play: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Promise<Game> {
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    const sheriffPlayMethods: Partial<Record<GamePlayAction, () => Game | Promise<Game>>> = {
      "delegate": () => this.sheriffDelegates(play, clonedGame),
      "settle-votes": async() => this.sheriffSettlesVotes(play, clonedGame),
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

  private async killPlayerAmongNominatedPlayers(game: GameWithCurrentPlay, nominatedPlayers: Player[]): Promise<Game> {
    const clonedGame = createGame(game);
    const nominatedPlayer = sample(nominatedPlayers);
    if (nominatedPlayer) {
      const playerVoteBySurvivorsDeath = createPlayerVoteBySurvivorsDeath();

      return this.playerKillerService.killOrRevealPlayer(nominatedPlayer._id, clonedGame, playerVoteBySurvivorsDeath);
    }
    return clonedGame;
  }

  private async handleTieInVotes(game: GameWithCurrentPlay, nominatedPlayers: Player[]): Promise<Game> {
    const clonedGame = createGameWithCurrentGamePlay(game);
    const { mustSettleTieInVotes: mustSheriffSettleTieInVotes } = clonedGame.options.roles.sheriff;
    const scapegoatPlayer = getPlayerWithCurrentRole(clonedGame, "scapegoat");
    if (scapegoatPlayer && isPlayerAliveAndPowerful(scapegoatPlayer, game)) {
      const playerVoteScapegoatedBySurvivorsDeath = createPlayerVoteScapegoatedBySurvivorsDeath();

      return this.playerKillerService.killOrRevealPlayer(scapegoatPlayer._id, clonedGame, playerVoteScapegoatedBySurvivorsDeath);
    }
    const sheriffPlayer = getPlayerWithActiveAttributeName(clonedGame, "sheriff");
    if (sheriffPlayer?.isAlive === true && mustSheriffSettleTieInVotes) {
      const gamePlaySheriffSettlesVotes = createGamePlaySheriffSettlesVotes();

      return prependUpcomingPlayInGame(gamePlaySheriffSettlesVotes, clonedGame);
    }
    if (!doesGamePlayHaveCause(clonedGame.currentPlay, "previous-votes-were-in-ties")) {
      const newCauses: GamePlayCause[] = ["previous-votes-were-in-ties", ...clonedGame.currentPlay.causes ?? []];
      const gamePlaySurvivorsVote = createGamePlaySurvivorsVote({ causes: newCauses });

      return prependUpcomingPlayInGame(gamePlaySurvivorsVote, clonedGame);
    }
    if (doesGamePlayHaveCause(clonedGame.currentPlay, "angel-presence")) {
      return this.killPlayerAmongNominatedPlayers(clonedGame, nominatedPlayers);
    }
    return clonedGame;
  }

  private async survivorsVote({ votes }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Promise<Game> {
    let clonedGame = createGame(game) as GameWithCurrentPlay;
    const { currentPlay } = clonedGame;
    const nominatedPlayers = this.gamePlayVoteService.getNominatedPlayers(votes, clonedGame);
    if (currentPlay.causes === undefined || doesGamePlayHaveCause(currentPlay, "angel-presence") && !doesGamePlayHaveCause(currentPlay, "previous-votes-were-in-ties")) {
      const gamePlayStutteringJudgeRequestsAnotherVote = createGamePlayStutteringJudgeRequestsAnotherVote();
      clonedGame = prependUpcomingPlayInGame(gamePlayStutteringJudgeRequestsAnotherVote, clonedGame) as GameWithCurrentPlay;
    }
    const scandalmongerMarkedPlayer = getPlayerWithActiveAttributeName(clonedGame, "scandalmonger-marked");
    if (scandalmongerMarkedPlayer) {
      clonedGame = removePlayerAttributeByNameInGame(scandalmongerMarkedPlayer._id, clonedGame, "scandalmonger-marked") as GameWithCurrentPlay;
    }
    if (nominatedPlayers.length > 1) {
      return this.handleTieInVotes(clonedGame, nominatedPlayers);
    }
    if (nominatedPlayers.length === 1) {
      const playerVoteBySurvivorsDeath = createPlayerVoteBySurvivorsDeath();

      return this.playerKillerService.killOrRevealPlayer(nominatedPlayers[0]._id, clonedGame, playerVoteBySurvivorsDeath);
    }
    return clonedGame;
  }

  private handleTieInSheriffElection(nominatedPlayers: Player[], game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game) as GameWithCurrentPlay;
    if (!doesGamePlayHaveCause(clonedGame.currentPlay, "previous-votes-were-in-ties")) {
      const gamePlaySurvivorsElectSheriff = createGamePlaySurvivorsElectSheriff({ causes: ["previous-votes-were-in-ties"] });

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
    const survivorsPlayMethods: Partial<Record<GamePlayAction, () => Game | Promise<Game>>> = {
      "elect-sheriff": () => this.survivorsElectSheriff(play, clonedGame),
      "vote": async() => this.survivorsVote(play, clonedGame),
      "bury-dead-bodies": async() => this.survivorsBuryDeadBodies(play, clonedGame),
    };
    const survivorsPlayMethod = survivorsPlayMethods[clonedGame.currentPlay.action];
    if (survivorsPlayMethod === undefined) {
      return clonedGame;
    }
    return survivorsPlayMethod();
  }

  private thiefChoosesCard({ chosenCard }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    let clonedGame = createGame(game);
    const thiefPlayer = getPlayerWithCurrentRole(clonedGame, "thief");
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
    const wolfHoundPlayer = getPlayerWithCurrentRole(clonedGame, "wolf-hound");
    if (!wolfHoundPlayer) {
      return clonedGame;
    }
    const wolfHoundSide = chosenSide ?? sample(["villagers", "werewolves"]);
    const playerDataToUpdate: Partial<Player> = { side: { ...wolfHoundPlayer.side, current: wolfHoundSide } };
    if (wolfHoundPlayer.role.original === "actor" && wolfHoundSide === "werewolves" && roles.actor.isPowerlessOnWerewolvesSide) {
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
    const foxPlayer = getPlayerWithCurrentRole(clonedGame, "fox");
    const { isPowerlessIfMissesWerewolf: isFoxPowerlessIfMissesWerewolf } = clonedGame.options.roles.fox;
    if (targets?.length !== expectedTargetCount || !foxPlayer) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const foxSniffedPlayers = getFoxSniffedPlayers(targetedPlayer._id, clonedGame);
    const areEveryFoxSniffedPlayersVillagerSided = foxSniffedPlayers.every(player => player.side.current === "villagers");
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
      const drankPotionAttribute = target.drankPotion === "life" ? lifePotionAttribute : deathPotionAttribute;
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

  private async accursedWolfFatherInfects({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Promise<Game> {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    if (targetedPlayer.role.current === "elder" && !await this.playerKillerService.isElderKillable(clonedGame, targetedPlayer, "eaten")) {
      return clonedGame;
    }
    const playerDataToUpdate: Partial<Player> = { side: { ...targetedPlayer.side, current: "werewolves" }, attributes: targetedPlayer.attributes };
    if (isPlayerPowerlessOnWerewolvesSide(targetedPlayer, clonedGame)) {
      playerDataToUpdate.attributes?.push(createPowerlessByAccursedWolfFatherPlayerAttribute());
    }
    playerDataToUpdate.attributes = playerDataToUpdate.attributes?.filter(({ name, source }) => name !== "eaten" || source !== "werewolves");

    return updatePlayerInGame(targetedPlayer._id, playerDataToUpdate, clonedGame);
  }

  private werewolvesEat({ targets }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    const expectedTargetCount = 1;
    if (targets?.length !== expectedTargetCount) {
      return clonedGame;
    }
    const { player: targetedPlayer } = targets[0];
    const eatenByWerewolvesPlayerAttribute = createEatenByWerewolvesPlayerAttribute();

    return addPlayerAttributeInGame(targetedPlayer._id, clonedGame, eatenByWerewolvesPlayerAttribute);
  }

  private stutteringJudgeRequestsAnotherVote({ doesJudgeRequestAnotherVote }: MakeGamePlayWithRelationsDto, game: GameWithCurrentPlay): Game {
    const clonedGame = createGame(game);
    if (doesJudgeRequestAnotherVote !== true) {
      return clonedGame;
    }
    const gamePlaySurvivorsVote = createGamePlaySurvivorsVote({ causes: ["stuttering-judge-request"] });

    return prependUpcomingPlayInGame(gamePlaySurvivorsVote, clonedGame);
  }
}