import { Injectable } from "@nestjs/common";
import { BAD_GAME_PLAY_PAYLOAD_REASONS } from "../../../../../shared/exception/enums/bad-game-play-payload-error.enum";
import { BadGamePlayPayloadException } from "../../../../../shared/exception/types/bad-game-play-payload-exception.type";
import { ROLE_NAMES } from "../../../../role/enums/role.enum";
import { optionalTargetsActions, requiredTargetsActions, requiredVotesActions, stutteringJudgeRequestOpportunityActions } from "../../../constants/game-play.constant";
import type { MakeGamePlayTargetWithRelationsDto } from "../../../dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import type { MakeGamePlayVoteWithRelationsDto } from "../../../dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import type { MakeGamePlayWithRelationsDto } from "../../../dto/make-game-play/make-game-play-with-relations.dto";
import { GAME_PLAY_ACTIONS, WITCH_POTIONS } from "../../../enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../enums/player.enum";
import { getLastGamePlayFromHistory, getLastGamePlayTieInVotesFromHistory } from "../../../helpers/game-history-record/game-history-record.helper";
import { getLeftToCharmByPiedPiperPlayers, getPlayerWithCurrentRole } from "../../../helpers/game.helper";
import { doesPlayerHaveAttribute, isPlayerAliveAndPowerful, isPlayerOnVillagersSide, isPlayerOnWerewolvesSide } from "../../../helpers/player/player.helper";
import type { GameHistoryRecord } from "../../../schemas/game-history-record/game-history-record.schema";
import type { Game } from "../../../schemas/game.schema";
import { GameHistoryRecordService } from "../game-history/game-history-record.service";

@Injectable()
export class GamePlaysValidatorService {
  public constructor(private readonly gameHistoryRecordService: GameHistoryRecordService) {}

  public async validateGamePlayWithRelationsDtoData(makeGamePlayWithRelationsDto: MakeGamePlayWithRelationsDto, game: Game): Promise<void> {
    const { votes, targets } = makeGamePlayWithRelationsDto;
    const gameHistoryRecords = await this.gameHistoryRecordService.getGameHistoryRecordsByGameId(game._id);
    this.validateGamePlayWithRelationsDtoJudgeRequestData(makeGamePlayWithRelationsDto, game, gameHistoryRecords);
    this.validateGamePlayWithRelationsDtoChosenSideData(makeGamePlayWithRelationsDto, game);
    this.validateGamePlayVotesWithRelationsDtoData(votes, game);
    this.validateGamePlayTargetsWithRelationsDtoData(targets, game, gameHistoryRecords);
    this.validateGamePlayWithRelationsDtoChosenCardData(makeGamePlayWithRelationsDto, game);
  }

  private validateGamePlayWithRelationsDtoChosenCardData(makeGamePlayWithRelationsDto: MakeGamePlayWithRelationsDto, game: Game): void {
    const { chosenCard } = makeGamePlayWithRelationsDto;
    if (!chosenCard) {
      if (game.currentPlay.action === GAME_PLAY_ACTIONS.CHOOSE_CARD) {
        throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.REQUIRED_CHOSEN_CARD);
      }
      return;
    }
    if (game.currentPlay.action !== GAME_PLAY_ACTIONS.CHOOSE_CARD) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_CHOSEN_CARD);
    }
  }

  private validateDrankLifePotionTargets(drankLifePotionTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    if (drankLifePotionTargets.length > 1) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.TOO_MUCH_DRANK_LIFE_POTION_TARGETS);
    }
    if (drankLifePotionTargets.length && (!doesPlayerHaveAttribute(drankLifePotionTargets[0].player, PLAYER_ATTRIBUTE_NAMES.EATEN) || !drankLifePotionTargets[0].player.isAlive)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_LIFE_POTION_TARGET);
    }
  }

  private validateDrankDeathPotionTargets(drankDeathPotionTargets: MakeGamePlayTargetWithRelationsDto[]): void {
    if (drankDeathPotionTargets.length > 1) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.TOO_MUCH_DRANK_DEATH_POTION_TARGETS);
    }
    if (drankDeathPotionTargets.length && !drankDeathPotionTargets[0].player.isAlive) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_DEATH_POTION_TARGET);
    }
  }

  private validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game, gameHistoryRecords: GameHistoryRecord[]): void {
    const drankPotionTargets = makeGamePlayTargetsWithRelationsDto.filter(({ drankPotion }) => drankPotion !== undefined);
    const hasWitchUsedLifePotion = gameHistoryRecords.some(record => record.play.targets?.some(({ drankPotion }) => drankPotion === WITCH_POTIONS.LIFE));
    const drankLifePotionTargets = drankPotionTargets.filter(({ drankPotion }) => drankPotion === WITCH_POTIONS.LIFE);
    const hasWitchUsedDeathPotion = gameHistoryRecords.some(record => record.play.targets?.some(({ drankPotion }) => drankPotion === WITCH_POTIONS.DEATH));
    const drankDeathPotionTargets = drankPotionTargets.filter(({ drankPotion }) => drankPotion === WITCH_POTIONS.DEATH);
    if ((game.currentPlay.action !== GAME_PLAY_ACTIONS.USE_POTIONS || game.currentPlay.source !== ROLE_NAMES.WITCH) && drankPotionTargets.length ||
        hasWitchUsedLifePotion && drankLifePotionTargets.length || hasWitchUsedDeathPotion && drankDeathPotionTargets.length) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_DRANK_POTION_TARGET);
    }
    this.validateDrankLifePotionTargets(drankLifePotionTargets);
    this.validateDrankDeathPotionTargets(drankDeathPotionTargets);
  }

  private validateGamePlayInfectedTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game, gameHistoryRecords: GameHistoryRecord[]): void {
    const infectedTargets = makeGamePlayTargetsWithRelationsDto.filter(({ isInfected }) => isInfected === true);
    const hasVileFatherOfWolvesInfected = gameHistoryRecords.some(record => record.play.targets?.some(({ isInfected }) => isInfected));
    const vileFatherOfWolvesPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.VILE_FATHER_OF_WOLVES);
    if (infectedTargets.length) {
      if (game.currentPlay.action !== GAME_PLAY_ACTIONS.EAT || game.currentPlay.source !== PLAYER_GROUPS.WEREWOLVES || !vileFatherOfWolvesPlayer ||
        !isPlayerAliveAndPowerful(vileFatherOfWolvesPlayer) || hasVileFatherOfWolvesInfected) {
        throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_INFECTED_TARGET);
      }
      this.validateGamePlayTargetsBoundaries(infectedTargets, { min: 1, max: 1 });
    }
  }

  private validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    if (game.currentPlay.action !== GAME_PLAY_ACTIONS.EAT) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    const targetedPlayer = makeGamePlayTargetsWithRelationsDto[0].player;
    if (game.currentPlay.source === PLAYER_GROUPS.WEREWOLVES && (!targetedPlayer.isAlive || !isPlayerOnVillagersSide(targetedPlayer))) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_WEREWOLVES_TARGET);
    }
    if (game.currentPlay.source === ROLE_NAMES.BIG_BAD_WOLF &&
      (!targetedPlayer.isAlive || !isPlayerOnVillagersSide(targetedPlayer) || doesPlayerHaveAttribute(targetedPlayer, PLAYER_ATTRIBUTE_NAMES.EATEN))) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_BIG_BAD_WOLF_TARGET);
    }
    const whiteWerewolfPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.WHITE_WEREWOLF);
    if (game.currentPlay.source === ROLE_NAMES.WHITE_WEREWOLF && (!targetedPlayer.isAlive || !isPlayerOnWerewolvesSide(targetedPlayer) ||
      whiteWerewolfPlayer?._id === targetedPlayer._id)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_WHITE_WEREWOLF_TARGET);
    }
  }

  private validateGamePlayHunterTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    if (game.currentPlay.action !== GAME_PLAY_ACTIONS.SHOOT || game.currentPlay.source !== ROLE_NAMES.HUNTER) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    const targetedPlayer = makeGamePlayTargetsWithRelationsDto[0].player;
    if (!targetedPlayer.isAlive) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_HUNTER_TARGET);
    }
  }

  private validateGamePlayScapegoatTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    if (game.currentPlay.action !== GAME_PLAY_ACTIONS.BAN_VOTING || game.currentPlay.source !== ROLE_NAMES.SCAPEGOAT) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 0, max: game.players.length });
    if (makeGamePlayTargetsWithRelationsDto.some(({ player }) => !player.isAlive)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_SCAPEGOAT_TARGETS);
    }
  }

  private validateGamePlayCupidTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    if (game.currentPlay.source !== ROLE_NAMES.CUPID || game.currentPlay.action !== GAME_PLAY_ACTIONS.CHARM) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 2, max: 2 });
    if (makeGamePlayTargetsWithRelationsDto.some(({ player }) => !player.isAlive)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_CUPID_TARGETS);
    }
  }

  private validateGamePlayFoxTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    if (game.currentPlay.source !== ROLE_NAMES.FOX || game.currentPlay.action !== GAME_PLAY_ACTIONS.SNIFF) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 0, max: 1 });
    const targetedPlayer = makeGamePlayTargetsWithRelationsDto[0].player;
    if (!targetedPlayer.isAlive) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_FOX_TARGET);
    }
  }

  private validateGamePlaySeerTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    if (game.currentPlay.source !== ROLE_NAMES.SEER || game.currentPlay.action !== GAME_PLAY_ACTIONS.LOOK) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    const seerPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.SEER);
    const targetedPlayer = makeGamePlayTargetsWithRelationsDto[0].player;
    if (!targetedPlayer.isAlive || targetedPlayer._id === seerPlayer?._id) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_SEER_TARGET);
    }
  }

  private validateGamePlayRavenTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    if (game.currentPlay.source !== ROLE_NAMES.RAVEN || game.currentPlay.action !== GAME_PLAY_ACTIONS.MARK) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 0, max: 1 });
    if (makeGamePlayTargetsWithRelationsDto.length && !makeGamePlayTargetsWithRelationsDto[0].player.isAlive) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_RAVEN_TARGET);
    }
  }

  private validateGamePlayWildChildTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    if (game.currentPlay.source !== ROLE_NAMES.WILD_CHILD || game.currentPlay.action !== GAME_PLAY_ACTIONS.CHOOSE_MODEL) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    const wildChildPlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.WILD_CHILD);
    const targetedPlayer = makeGamePlayTargetsWithRelationsDto[0].player;
    if (!targetedPlayer.isAlive || targetedPlayer._id === wildChildPlayer?._id) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_WILD_CHILD_TARGET);
    }
  }

  private validateGamePlayPiedPiperTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game): void {
    if (game.currentPlay.source !== ROLE_NAMES.PIED_PIPER || game.currentPlay.action !== GAME_PLAY_ACTIONS.CHARM) {
      return;
    }
    const { charmedPeopleCountPerNight } = game.options.roles.piedPiper;
    const leftToCharmByPiedPiperPlayers = getLeftToCharmByPiedPiperPlayers(game.players);
    const leftToCharmByPiedPiperPlayersCount = leftToCharmByPiedPiperPlayers.length;
    const countToCharm = Math.min(charmedPeopleCountPerNight, leftToCharmByPiedPiperPlayersCount);
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: countToCharm, max: countToCharm });
    if (makeGamePlayTargetsWithRelationsDto.some(({ player }) => !leftToCharmByPiedPiperPlayers.find(({ _id }) => player._id === _id))) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_PIED_PIPER_TARGETS);
    }
  }

  private validateGamePlayGuardTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game, gameHistoryRecords: GameHistoryRecord[]): void {
    if (game.currentPlay.source !== ROLE_NAMES.GUARD || game.currentPlay.action !== GAME_PLAY_ACTIONS.PROTECT) {
      return;
    }
    const { canProtectTwice } = game.options.roles.guard;
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    const lastGuardHistoryRecord = getLastGamePlayFromHistory(gameHistoryRecords, ROLE_NAMES.GUARD, GAME_PLAY_ACTIONS.PROTECT);
    const lastProtectedPlayer = lastGuardHistoryRecord?.play.targets?.[0].player;
    const targetedPlayer = makeGamePlayTargetsWithRelationsDto[0].player;
    if (!targetedPlayer.isAlive || !canProtectTwice && lastProtectedPlayer?._id === targetedPlayer._id) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_GUARD_TARGET);
    }
  }

  private validateGamePlaySheriffTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game, gameHistoryRecords: GameHistoryRecord[]): void {
    if (game.currentPlay.source !== PLAYER_ATTRIBUTE_NAMES.SHERIFF || ![GAME_PLAY_ACTIONS.DELEGATE, GAME_PLAY_ACTIONS.SETTLE_VOTES].includes(game.currentPlay.action)) {
      return;
    }
    this.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    const targetedPlayer = makeGamePlayTargetsWithRelationsDto[0].player;
    const lastTieInVotesHistoryRecord = getLastGamePlayTieInVotesFromHistory(gameHistoryRecords);
    const lastTieInVotesTargets = lastTieInVotesHistoryRecord?.play.targets ?? [];
    if (game.currentPlay.action === GAME_PLAY_ACTIONS.DELEGATE && !targetedPlayer.isAlive) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_SHERIFF_DELEGATE_TARGET);
    }
    if (game.currentPlay.action === GAME_PLAY_ACTIONS.SETTLE_VOTES && !lastTieInVotesTargets.find(({ player }) => player._id === targetedPlayer._id)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.BAD_SHERIFF_SETTLE_VOTES_TARGET);
    }
  }

  private validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], lengthBoundaries: { min: number; max: number }): void {
    if (makeGamePlayTargetsWithRelationsDto.length < lengthBoundaries.min) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.TOO_LESS_TARGETS);
    }
    if (makeGamePlayTargetsWithRelationsDto.length > lengthBoundaries.max) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.TOO_MUCH_TARGETS);
    }
  }

  private validateGamePlayRoleTargets(makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[], game: Game, gameHistoryRecords: GameHistoryRecord[]): void {
    this.validateGamePlaySheriffTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords);
    this.validateGamePlayGuardTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords);
    this.validateGamePlayPiedPiperTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayWildChildTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayRavenTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlaySeerTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayFoxTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayCupidTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayScapegoatTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayHunterTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto, game);
    this.validateGamePlayInfectedTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords);
    this.validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords);
  }

  private validateGamePlayTargetsWithRelationsDtoData(
    makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] | undefined,
    game: Game,
    gameHistoryRecords: GameHistoryRecord[],
  ): void {
    if (makeGamePlayTargetsWithRelationsDto === undefined || !makeGamePlayTargetsWithRelationsDto.length) {
      if (requiredTargetsActions.includes(game.currentPlay.action)) {
        throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.REQUIRED_TARGETS);
      }
      return;
    }
    if (![...requiredTargetsActions, ...optionalTargetsActions].includes(game.currentPlay.action)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_TARGETS);
    }
    this.validateGamePlayRoleTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords);
  }

  private validateGamePlayVotesWithRelationsDtoData(makeGamePlayVotesWithRelationsDto: MakeGamePlayVoteWithRelationsDto[] | undefined, game: Game): void {
    if (makeGamePlayVotesWithRelationsDto === undefined || !makeGamePlayVotesWithRelationsDto.length) {
      if (requiredVotesActions.includes(game.currentPlay.action)) {
        throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.REQUIRED_VOTES);
      }
      return;
    }
    if (!requiredVotesActions.includes(game.currentPlay.action)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_VOTES);
    }
    if (makeGamePlayVotesWithRelationsDto.some(({ source, target }) => source._id === target._id)) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.SAME_SOURCE_AND_TARGET_VOTE);
    }
  }

  private validateGamePlayWithRelationsDtoChosenSideData(makeGamePlayWithRelationsDto: MakeGamePlayWithRelationsDto, game: Game): void {
    const { chosenSide } = makeGamePlayWithRelationsDto;
    if (chosenSide && game.currentPlay.action !== GAME_PLAY_ACTIONS.CHOOSE_SIDE) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_CHOSEN_SIDE);
    }
    if (!chosenSide && game.currentPlay.action === GAME_PLAY_ACTIONS.CHOOSE_SIDE) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.REQUIRED_CHOSEN_SIDE);
    }
  }

  private validateGamePlayWithRelationsDtoJudgeRequestData(makeGamePlayWithRelationsDto: MakeGamePlayWithRelationsDto, game: Game, gameHistoryRecords: GameHistoryRecord[]): void {
    const { doesJudgeRequestAnotherVote } = makeGamePlayWithRelationsDto;
    if (doesJudgeRequestAnotherVote === undefined) {
      return;
    }
    const { voteRequestsCount } = game.options.roles.stutteringJudge;
    const gameHistoryJudgeRequestRecords = gameHistoryRecords.filter(record => record.play.didJudgeRequestAnotherVote);
    const stutteringJudgePlayer = getPlayerWithCurrentRole(game.players, ROLE_NAMES.STUTTERING_JUDGE);
    if (!stutteringJudgeRequestOpportunityActions.includes(game.currentPlay.action) ||
        !stutteringJudgePlayer || !isPlayerAliveAndPowerful(stutteringJudgePlayer) ||
        gameHistoryJudgeRequestRecords.length >= voteRequestsCount) {
      throw new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.UNEXPECTED_STUTTERING_JUDGE_VOTE_REQUEST);
    }
  }
}