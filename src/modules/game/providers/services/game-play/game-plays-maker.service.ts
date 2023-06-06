import { Injectable } from "@nestjs/common";
import { cloneDeep } from "lodash";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../role/enums/role.enum";
import type { MakeGamePlayWithRelationsDto } from "../../../dto/make-game-play/make-game-play-with-relations.dto";
import { WITCH_POTIONS } from "../../../enums/game-play.enum";
import { PLAYER_DEATH_CAUSES, PLAYER_GROUPS } from "../../../enums/player.enum";
import { getLeftToCharmByPiedPiperPlayers, getUpcomingGamePlaySource } from "../../../helpers/game.helper";
import { addPlayerAttributeInGame, addPlayersAttributeInGame, updatePlayerInGame } from "../../../helpers/game.mutator";
import { createCharmedByPiedPiperPlayerAttribute, createDrankDeathPotionByWitchPlayerAttribute, createDrankLifePotionByWitchPlayerAttribute, createEatenByBigBadWolfPlayerAttribute, createEatenByWerewolvesPlayerAttribute, createEatenByWhiteWerewolfPlayerAttribute, createInLoveByCupidPlayerAttribute, createProtectedByGuardPlayerAttribute, createRavenMarkByRavenPlayerAttribute, createSeenBySeerPlayerAttribute } from "../../../helpers/player/player-attribute/player-attribute.factory";
import { createPlayerShotByHunterDeath } from "../../../helpers/player/player-death/player-death.factory";
import type { GameHistoryRecord } from "../../../schemas/game-history-record/game-history-record.schema";
import type { Game } from "../../../schemas/game.schema";
import type { Player } from "../../../schemas/player/player.schema";
import type { GameSource } from "../../../types/game.type";
import { PlayerKillerService } from "../player/player-killer.service";

@Injectable()
export class GamePlaysMakerService {
  private readonly sourceGamePlayMethods: Partial<Record<GameSource, (play: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords?: GameHistoryRecord[]) => Game>> = {
    [PLAYER_GROUPS.WEREWOLVES]: this.werewolvesEat,
    [ROLE_NAMES.BIG_BAD_WOLF]: this.bigBadWolfEats,
    [ROLE_NAMES.WHITE_WEREWOLF]: this.whiteWerewolfEats,
    [ROLE_NAMES.SEER]: this.seerLooks,
    [ROLE_NAMES.CUPID]: this.cupidCharms,
    [ROLE_NAMES.PIED_PIPER]: this.piedPiperCharms,
    [ROLE_NAMES.WITCH]: this.witchUsesPotions,
    [ROLE_NAMES.HUNTER]: this.hunterShoots,
    [ROLE_NAMES.GUARD]: this.guardProtects,
    [ROLE_NAMES.RAVEN]: this.ravenMarks,
  };

  public constructor(private readonly playerKillerService: PlayerKillerService) {}

  public makeGamePlay(play: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords: GameHistoryRecord[]): Game {
    const clonedGame = cloneDeep(game);
    const upcomingGamePlaySource = getUpcomingGamePlaySource(clonedGame.upcomingPlays);
    if (!upcomingGamePlaySource) {
      return clonedGame;
    }
    const sourceGamePlayMethod = this.sourceGamePlayMethods[upcomingGamePlaySource];
    if (sourceGamePlayMethod === undefined) {
      return clonedGame;
    }
    return sourceGamePlayMethod(play, game, gameHistoryRecords);
  }
  
  // sheriffSettlesVotes
  
  // sheriffDelegates
  
  // allVote
  
  // allElectSheriff
  
  // thiefChoosesCard
  
  // scapegoatBansVoting
  
  // dogWolfChoosesSide
  
  // wildChildChoosesModel
  
  // foxSniffs
  
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
    if (targets === undefined) {
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