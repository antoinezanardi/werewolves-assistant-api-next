import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import type { Game } from "@/modules/game/schemas/game.schema";
import { GamePlayActions, GamePlayCauses } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups, PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import * as GameHelper from "@/modules/game/helpers/game.helper";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlayAugmenterService } from "@/modules/game/providers/services/game-play/game-play-augmenter.service";
import type { GamePlayEligibleTargetsBoundaries } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.schema";
import type { GamePlayEligibleTargets } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets.schema";
import type { InteractablePlayer } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/interactable-player.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enum";
import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";
import { UnexpectedException } from "@/shared/exception/types/unexpected-exception.type";

import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlayVoting } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeCupidGameOptions, createFakeDefenderGameOptions, createFakePiedPiperGameOptions, createFakeRolesGameOptions, createFakeThiefGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options/game-roles-options.schema.factory";
import { createFakeVotesGameOptions } from "@tests/factories/game/schemas/game-options/votes-game-options.schema.factory";
import { createFakeGamePlayEligibleTargetsBoundaries } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.schema.factory";
import { createFakeGamePlayEligibleTargets } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/game-play-eligible-targets.schema.factory";
import { createFakeInteractablePlayer } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/interactable-player/interactable-player.schema.factory";
import { createFakePlayerInteraction } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/interactable-player/player-interaction/player-interaction.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";
import { createFakeGamePlay, createFakeGamePlayBigBadWolfEats, createFakeGamePlayCharmedMeetEachOther, createFakeGamePlayCupidCharms, createFakeGamePlayFoxSniffs, createFakeGamePlayDefenderProtects, createFakeGamePlayHunterShoots, createFakeGamePlayLoversMeetEachOther, createFakeGamePlayPiedPiperCharms, createFakeGamePlayScandalmongerMarks, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySeerLooks, createFakeGamePlaySheriffDelegates, createFakeGamePlaySheriffSettlesVotes, createFakeGamePlaySurvivorsBuryDeadBodies, createFakeGamePlaySurvivorsElectSheriff, createFakeGamePlaySurvivorsVote, createFakeGamePlayThiefChoosesCard, createFakeGamePlayThreeBrothersMeetEachOther, createFakeGamePlayTwoSistersMeetEachOther, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWildChildChoosesModel, createFakeGamePlayWitchUsesPotions, createFakeGamePlayActorChoosesCard, createFakeGamePlayAccursedWolfFatherInfects } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCantVoteBySurvivorsPlayerAttribute, createFakeEatenByBigBadWolfPlayerAttribute, createFakeEatenByWerewolvesPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakePowerlessByElderPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayerDeath } from "@tests/factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeAccursedWolfFatherAlivePlayer, createFakeAngelAlivePlayer, createFakeCupidAlivePlayer, createFakeDefenderAlivePlayer, createFakeDevotedServantAlivePlayer, createFakeHunterAlivePlayer, createFakeScapegoatAlivePlayer, createFakeSeerAlivePlayer, createFakeTwoSistersAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakeDeadPlayer, createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Play Augmenter Service", () => {
  let services: { gamePlayAugmenter: GamePlayAugmenterService };
  let mocks: {
    gamePlayAugmenterService: {
      canGamePlayBeSkipped: jest.SpyInstance;
      getGamePlayEligibleTargets: jest.SpyInstance;
      getExpectedPlayersToPlay: jest.SpyInstance;
      getSheriffSettlesVotesGamePlayEligibleTargets: jest.SpyInstance;
      getSheriffDelegatesGamePlayEligibleTargets: jest.SpyInstance;
      getSheriffGamePlayEligibleTargets: jest.SpyInstance;
      getSurvivorsVoteGamePlayInteractablePlayers: jest.SpyInstance;
      getSurvivorsVoteGamePlayEligibleTargets: jest.SpyInstance;
      getSurvivorsElectSheriffGamePlayEligibleTargets: jest.SpyInstance;
      getSurvivorsGamePlayEligibleTargets: jest.SpyInstance;
      getWerewolvesEatGamePlayEligibleTargets: jest.SpyInstance;
      getWerewolvesGamePlayEligibleTargets: jest.SpyInstance;
      getWhiteWerewolfEatGamePlayEligibleTargets: jest.SpyInstance;
      getWhiteWerewolfGamePlayEligibleTargets: jest.SpyInstance;
      getWitchUsesPotionsGamePlayEligibleTargets: jest.SpyInstance;
      getWitchGamePlayEligibleTargets: jest.SpyInstance;
      getBigBadWolfEatGamePlayEligibleTargets: jest.SpyInstance;
      getBigBadWolfGamePlayEligibleTargets: jest.SpyInstance;
      getFoxSniffsGamePlayEligibleTargets: jest.SpyInstance;
      getFoxGamePlayEligibleTargets: jest.SpyInstance;
      getDefenderProtectsGamePlayEligibleTargets: jest.SpyInstance;
      getDefenderGamePlayEligibleTargets: jest.SpyInstance;
      getHunterShootsGamePlayEligibleTargets: jest.SpyInstance;
      getHunterGamePlayEligibleTargets: jest.SpyInstance;
      getLoversMeetEachOtherGamePlayEligibleTargets: jest.SpyInstance;
      getLoversGamePlayEligibleTargets: jest.SpyInstance;
      getPiedPiperCharmsGamePlayEligibleTargets: jest.SpyInstance;
      getPiedPiperGamePlayEligibleTargets: jest.SpyInstance;
      getScandalmongerMarksGamePlayEligibleTargets: jest.SpyInstance;
      getScandalmongerGamePlayEligibleTargets: jest.SpyInstance;
      getScapegoatBansVotingGamePlayEligibleTargets: jest.SpyInstance;
      getScapegoatGamePlayEligibleTargets: jest.SpyInstance;
      getSeerLooksGamePlayEligibleTargets: jest.SpyInstance;
      getSeerGamePlayEligibleTargets: jest.SpyInstance;
      getThiefChoosesCardGamePlayEligibleTargets: jest.SpyInstance;
      getThiefGamePlayEligibleTargets: jest.SpyInstance;
      getThreeBrothersMeetEachOtherGamePlayEligibleTargets: jest.SpyInstance;
      getThreeBrothersGamePlayEligibleTargets: jest.SpyInstance;
      getTwoSistersMeetEachOtherGamePlayEligibleTargets: jest.SpyInstance;
      getTwoSistersGamePlayEligibleTargets: jest.SpyInstance;
      getWildChildChoosesModelGamePlayEligibleTargets: jest.SpyInstance;
      getWildChildGamePlayEligibleTargets: jest.SpyInstance;
      getCharmedMeetEachOtherGamePlayEligibleTargets: jest.SpyInstance;
      getCharmedGamePlayEligibleTargets: jest.SpyInstance;
      canSurvivorsSkipGamePlay: jest.SpyInstance;
      getSurvivorsBuryDeadBodiesGamePlayEligibleTargets: jest.SpyInstance;
      getWitchGamePlayEligibleTargetsBoundaries: jest.SpyInstance;
      getWitchGamePlayEligibleTargetsInteractablePlayers: jest.SpyInstance;
      getCupidGamePlayEligibleTargets: jest.SpyInstance;
      getAccursedWolfFatherGamePlayEligibleTargets: jest.SpyInstance;
      canBigBadWolfSkipGamePlay: jest.SpyInstance;
      canThiefSkipGamePlay: jest.SpyInstance;
      canCupidSkipGamePlay: jest.SpyInstance;
    };
    gameHelper: {
      getEligibleWerewolvesTargets: jest.SpyInstance;
      getEligibleWhiteWerewolfTargets: jest.SpyInstance;
      getEligiblePiedPiperTargets: jest.SpyInstance;
      getEligibleCupidTargets: jest.SpyInstance;
      getAllowedToVotePlayers: jest.SpyInstance;
    };
    gameHistoryRecordService: {
      getLastGameHistoryTieInVotesRecord: jest.SpyInstance;
      getLastGameHistoryDefenderProtectsRecord: jest.SpyInstance;
      getGameHistoryWitchUsesSpecificPotionRecords: jest.SpyInstance;
      getPreviousGameHistoryRecord: jest.SpyInstance;
    };
    unexpectedExceptionFactory: {
      createCantFindPlayerWithCurrentRoleUnexpectedException: jest.SpyInstance;
      createCantFindLastNominatedPlayersUnexpectedException: jest.SpyInstance;
      createMalformedCurrentGamePlayUnexpectedException: jest.SpyInstance;
      createNoCurrentGamePlayUnexpectedException: jest.SpyInstance;
      createCantFindLastDeadPlayersUnexpectedException: jest.SpyInstance;
    };
  };

  beforeEach(async() => {
    mocks = {
      gamePlayAugmenterService: {
        canGamePlayBeSkipped: jest.fn(),
        getGamePlayEligibleTargets: jest.fn(),
        getExpectedPlayersToPlay: jest.fn(),
        getSheriffSettlesVotesGamePlayEligibleTargets: jest.fn(),
        getSheriffDelegatesGamePlayEligibleTargets: jest.fn(),
        getSheriffGamePlayEligibleTargets: jest.fn(),
        getSurvivorsVoteGamePlayInteractablePlayers: jest.fn(),
        getSurvivorsVoteGamePlayEligibleTargets: jest.fn(),
        getSurvivorsElectSheriffGamePlayEligibleTargets: jest.fn(),
        getSurvivorsGamePlayEligibleTargets: jest.fn(),
        getWerewolvesEatGamePlayEligibleTargets: jest.fn(),
        getWerewolvesGamePlayEligibleTargets: jest.fn(),
        getWhiteWerewolfEatGamePlayEligibleTargets: jest.fn(),
        getWhiteWerewolfGamePlayEligibleTargets: jest.fn(),
        getWitchUsesPotionsGamePlayEligibleTargets: jest.fn(),
        getWitchGamePlayEligibleTargets: jest.fn(),
        getBigBadWolfEatGamePlayEligibleTargets: jest.fn(),
        getBigBadWolfGamePlayEligibleTargets: jest.fn(),
        getFoxSniffsGamePlayEligibleTargets: jest.fn(),
        getFoxGamePlayEligibleTargets: jest.fn(),
        getDefenderProtectsGamePlayEligibleTargets: jest.fn(),
        getDefenderGamePlayEligibleTargets: jest.fn(),
        getHunterShootsGamePlayEligibleTargets: jest.fn(),
        getHunterGamePlayEligibleTargets: jest.fn(),
        getLoversMeetEachOtherGamePlayEligibleTargets: jest.fn(),
        getLoversGamePlayEligibleTargets: jest.fn(),
        getPiedPiperCharmsGamePlayEligibleTargets: jest.fn(),
        getPiedPiperGamePlayEligibleTargets: jest.fn(),
        getScandalmongerMarksGamePlayEligibleTargets: jest.fn(),
        getScandalmongerGamePlayEligibleTargets: jest.fn(),
        getScapegoatBansVotingGamePlayEligibleTargets: jest.fn(),
        getScapegoatGamePlayEligibleTargets: jest.fn(),
        getSeerLooksGamePlayEligibleTargets: jest.fn(),
        getSeerGamePlayEligibleTargets: jest.fn(),
        getThiefChoosesCardGamePlayEligibleTargets: jest.fn(),
        getThiefGamePlayEligibleTargets: jest.fn(),
        getThreeBrothersMeetEachOtherGamePlayEligibleTargets: jest.fn(),
        getThreeBrothersGamePlayEligibleTargets: jest.fn(),
        getTwoSistersMeetEachOtherGamePlayEligibleTargets: jest.fn(),
        getTwoSistersGamePlayEligibleTargets: jest.fn(),
        getWildChildChoosesModelGamePlayEligibleTargets: jest.fn(),
        getWildChildGamePlayEligibleTargets: jest.fn(),
        getCharmedMeetEachOtherGamePlayEligibleTargets: jest.fn(),
        getCharmedGamePlayEligibleTargets: jest.fn(),
        getSurvivorsBuryDeadBodiesGamePlayEligibleTargets: jest.fn(),
        canSurvivorsSkipGamePlay: jest.fn(),
        getWitchGamePlayEligibleTargetsBoundaries: jest.fn(),
        getWitchGamePlayEligibleTargetsInteractablePlayers: jest.fn(),
        getAccursedWolfFatherGamePlayEligibleTargets: jest.fn(),
        getCupidGamePlayEligibleTargets: jest.fn(),
        canBigBadWolfSkipGamePlay: jest.fn(),
        canThiefSkipGamePlay: jest.fn(),
        canCupidSkipGamePlay: jest.fn(),
      },
      gameHelper: {
        getEligibleWerewolvesTargets: jest.spyOn(GameHelper, "getEligibleWerewolvesTargets"),
        getEligibleWhiteWerewolfTargets: jest.spyOn(GameHelper, "getEligibleWhiteWerewolfTargets"),
        getEligiblePiedPiperTargets: jest.spyOn(GameHelper, "getEligiblePiedPiperTargets"),
        getEligibleCupidTargets: jest.spyOn(GameHelper, "getEligibleCupidTargets"),
        getAllowedToVotePlayers: jest.spyOn(GameHelper, "getAllowedToVotePlayers"),
      },
      gameHistoryRecordService: {
        getLastGameHistoryTieInVotesRecord: jest.fn(),
        getLastGameHistoryDefenderProtectsRecord: jest.fn(),
        getGameHistoryWitchUsesSpecificPotionRecords: jest.fn(),
        getPreviousGameHistoryRecord: jest.fn(),
      },
      unexpectedExceptionFactory: {
        createCantFindPlayerWithCurrentRoleUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createCantFindPlayerWithCurrentRoleUnexpectedException"),
        createCantFindLastNominatedPlayersUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createCantFindLastNominatedPlayersUnexpectedException"),
        createMalformedCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createMalformedCurrentGamePlayUnexpectedException"),
        createNoCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoCurrentGamePlayUnexpectedException"),
        createCantFindLastDeadPlayersUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createCantFindLastDeadPlayersUnexpectedException"),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GameHistoryRecordService,
          useValue: mocks.gameHistoryRecordService,
        },
        GamePlayAugmenterService,
      ],
    }).compile();

    services = { gamePlayAugmenter: module.get<GamePlayAugmenterService>(GamePlayAugmenterService) };
  });

  describe("setGamePlayCanBeSkipped", () => {
    beforeEach(() => {
      mocks.gamePlayAugmenterService.canGamePlayBeSkipped = jest.spyOn(services.gamePlayAugmenter as unknown as { canGamePlayBeSkipped }, "canGamePlayBeSkipped");
    });

    it("should return game play with canBeSkipped when called.", () => {
      const gamePlay = createFakeGamePlay();
      const game = createFakeGame();
      mocks.gamePlayAugmenterService.canGamePlayBeSkipped.mockReturnValueOnce(true);
      const expectedGamePlay = createFakeGamePlay({
        ...gamePlay,
        canBeSkipped: true,
      });

      expect(services.gamePlayAugmenter.setGamePlayCanBeSkipped(gamePlay, game)).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("setGamePlayEligibleTargets", () => {
    beforeEach(() => {
      mocks.gamePlayAugmenterService.getGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as { getGamePlayEligibleTargets }, "getGamePlayEligibleTargets");
    });

    it("should return game play with eligibleTargets when called.", async() => {
      const gamePlay = createFakeGamePlay();
      const game = createFakeGame();
      const expectedGamePlay = createFakeGamePlay({
        ...gamePlay,
        eligibleTargets: createFakeGamePlayEligibleTargets(),
      });
      mocks.gamePlayAugmenterService.getGamePlayEligibleTargets.mockResolvedValueOnce(expectedGamePlay.eligibleTargets);

      await expect(services.gamePlayAugmenter.setGamePlayEligibleTargets(gamePlay, game)).resolves.toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("setGamePlaySourcePlayers", () => {
    beforeEach(() => {
      mocks.gamePlayAugmenterService.getExpectedPlayersToPlay = jest.spyOn(services.gamePlayAugmenter as unknown as { getExpectedPlayersToPlay }, "getExpectedPlayersToPlay");
    });

    it("should return game play with source players when called.", () => {
      const gamePlay = createFakeGamePlay();
      const game = createFakeGame();
      const expectedGamePlaySourcePlayers = [createFakePlayer()];
      const expectedGamePlay = createFakeGamePlay({
        ...gamePlay,
        source: createFakeGamePlaySource({
          ...gamePlay.source,
          players: expectedGamePlaySourcePlayers,
        }),
      });
      mocks.gamePlayAugmenterService.getExpectedPlayersToPlay.mockReturnValue(expectedGamePlaySourcePlayers);

      expect(services.gamePlayAugmenter.setGamePlaySourcePlayers(gamePlay, game)).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("getSheriffSettlesVotesGamePlayEligibleTargets", () => {
    beforeEach(() => {
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValue([]);
    });

    it("should throw error when there is no last tie in votes record.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.CANT_FIND_LAST_NOMINATED_PLAYERS, { gameId: game._id.toString() });
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValueOnce(null);
      mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayAugmenter["getSheriffSettlesVotesGamePlayEligibleTargets"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSheriffSettlesVotesGamePlayEligibleTargets", { gameId: game._id });
    });

    it("should throw error when there are not nominated players in last tie in votes record.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gameHistoryRecordPlayVoting = createFakeGameHistoryRecordPlayVoting({ nominatedPlayers: [] });
      const gameHistoryRecord = createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ voting: gameHistoryRecordPlayVoting }) });
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.CANT_FIND_LAST_NOMINATED_PLAYERS, { gameId: game._id.toString() });
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValueOnce(gameHistoryRecord);
      mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayAugmenter["getSheriffSettlesVotesGamePlayEligibleTargets"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSheriffSettlesVotesGamePlayEligibleTargets", { gameId: game._id });
    });

    it("should return all nominated players with 1 to 1 boundaries when there are nominated players in last tie in votes record.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          voting: createFakeGameHistoryRecordPlayVoting({
            nominatedPlayers: [
              players[0],
              players[1],
            ],
          }),
        }),
      });
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValueOnce(gameHistoryRecord);
      const expectedInteraction = createFakePlayerInteraction({
        source: PlayerAttributeNames.SHERIFF,
        type: PlayerInteractionTypes.SENTENCE_TO_DEATH,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[1],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 1,
          max: 1,
        },
      });

      await expect(services.gamePlayAugmenter["getSheriffSettlesVotesGamePlayEligibleTargets"](game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getSheriffDelegatesGamePlayEligibleTargets", () => {
    it("should return all alive and not sheriff players as interactable players with 1 to 1 targets boundaries when called.", () => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedInteraction = createFakePlayerInteraction({
        source: PlayerAttributeNames.SHERIFF,
        type: PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 1,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getSheriffDelegatesGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getSheriffGamePlayEligibleTargets", () => {
    beforeEach(() => {
      mocks.gamePlayAugmenterService.getSheriffSettlesVotesGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as { getSheriffSettlesVotesGamePlayEligibleTargets }, "getSheriffSettlesVotesGamePlayEligibleTargets").mockImplementation();
      mocks.gamePlayAugmenterService.getSheriffDelegatesGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as { getSheriffDelegatesGamePlayEligibleTargets }, "getSheriffDelegatesGamePlayEligibleTargets").mockImplementation();
    });

    it("should call get sheriff delegate game play eligible targets when game play action is delegate.", async() => {
      const gamePlay = createFakeGamePlaySheriffDelegates();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getSheriffGamePlayEligibleTargets"](game, gamePlay);

      expect(mocks.gamePlayAugmenterService.getSheriffDelegatesGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
      expect(mocks.gamePlayAugmenterService.getSheriffSettlesVotesGamePlayEligibleTargets).not.toHaveBeenCalled();
    });

    it("should call get sheriff settles votes game play eligible targets when game play action is settles votes.", async() => {
      const gamePlay = createFakeGamePlaySheriffSettlesVotes();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getSheriffGamePlayEligibleTargets"](game, gamePlay);

      expect(mocks.gamePlayAugmenterService.getSheriffSettlesVotesGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
      expect(mocks.gamePlayAugmenterService.getSheriffDelegatesGamePlayEligibleTargets).not.toHaveBeenCalled();
    });

    it("should throw error when game play action is not delegate nor settles votes.", async() => {
      const gamePlay = createFakeGamePlayScandalmongerMarks();
      const game = createFakeGame();
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.MALFORMED_CURRENT_GAME_PLAY, { gamePlayAction: gamePlay.action });
      mocks.unexpectedExceptionFactory.createMalformedCurrentGamePlayUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayAugmenter["getSheriffGamePlayEligibleTargets"](game, gamePlay)).rejects.toThrow(mockedError);
      expect(mocks.unexpectedExceptionFactory.createMalformedCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSheriffGamePlayEligibleTargets", gamePlay, game._id);
    });
  });

  describe("getSurvivorsVoteGamePlayInteractablePlayers", () => {
    it("should return all alive players when votes are not cause of previous tie in votes.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE });
      const expectedInteraction = createFakePlayerInteraction({
        source: PlayerGroups.SURVIVORS,
        type: PlayerInteractionTypes.VOTE,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[1],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];
      
      await expect(services.gamePlayAugmenter["getSurvivorsVoteGamePlayInteractablePlayers"](game, gamePlay)).resolves.toStrictEqual<InteractablePlayer[]>(expectedInteractablePlayers);
    });

    it("should return nominated players when votes are cause of previous tie in votes.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });
      const gameHistoryRecordPlayVoting = createFakeGameHistoryRecordPlayVoting({ nominatedPlayers: [players[0], players[1]] });
      const gameHistoryRecord = createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ voting: gameHistoryRecordPlayVoting }) });
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValueOnce(gameHistoryRecord);
      const expectedInteraction = createFakePlayerInteraction({
        source: PlayerGroups.SURVIVORS,
        type: PlayerInteractionTypes.VOTE,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[1],
          interactions: [expectedInteraction],
        }),
      ];

      await expect(services.gamePlayAugmenter["getSurvivorsVoteGamePlayInteractablePlayers"](game, gamePlay)).resolves.toStrictEqual<InteractablePlayer[]>(expectedInteractablePlayers);
    });

    it("should throw error when there is no last tie in votes record.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.CANT_FIND_LAST_NOMINATED_PLAYERS, { gameId: game._id.toString() });
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValueOnce(null);
      mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException.mockReturnValue(mockedError);

      await expect(async() => services.gamePlayAugmenter["getSurvivorsVoteGamePlayInteractablePlayers"](game, gamePlay)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSurvivorsVoteGamePlayInteractablePlayers", { gameId: game._id });
    });

    it("should throw error when there is no nominated players in last tie in votes record.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });
      const gameRecordPlayVoting = createFakeGameHistoryRecordPlayVoting({ nominatedPlayers: [] });
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.CANT_FIND_LAST_NOMINATED_PLAYERS, { gameId: game._id.toString() });
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValueOnce(createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ voting: gameRecordPlayVoting }) }));
      mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException.mockReturnValue(mockedError);

      await expect(async() => services.gamePlayAugmenter["getSurvivorsVoteGamePlayInteractablePlayers"](game, gamePlay)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSurvivorsVoteGamePlayInteractablePlayers", { gameId: game._id });
    });
  });

  describe("getSurvivorsVoteGamePlayEligibleTargets", () => {
    beforeEach(() => {
      mocks.gameHelper.getAllowedToVotePlayers.mockReturnValue([]);
      mocks.gamePlayAugmenterService.canSurvivorsSkipGamePlay = jest.spyOn(services.gamePlayAugmenter as unknown as { canSurvivorsSkipGamePlay }, "canSurvivorsSkipGamePlay").mockImplementation();
      mocks.gamePlayAugmenterService.getSurvivorsVoteGamePlayInteractablePlayers = jest.spyOn(services.gamePlayAugmenter as unknown as { getSurvivorsVoteGamePlayInteractablePlayers }, "getSurvivorsVoteGamePlayInteractablePlayers").mockImplementation();
    });

    it("should return all alive villagers as interactable players with 1 to alive players length when votes can't be skipped.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer(),
      ];
      const gamePlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame({ players });
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: [],
        boundaries: {
          min: 1,
          max: 3,
        },
      });
      mocks.gameHelper.getAllowedToVotePlayers.mockReturnValueOnce([players[0], players[1], players[3]]);
      mocks.gamePlayAugmenterService.canSurvivorsSkipGamePlay.mockReturnValueOnce(false);
      mocks.gamePlayAugmenterService.getSurvivorsVoteGamePlayInteractablePlayers.mockResolvedValueOnce([]);

      await expect(services.gamePlayAugmenter["getSurvivorsVoteGamePlayEligibleTargets"](game, gamePlay)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should return alive players as interactable targets with boundaries from 0 to alive players length when votes can be skipped.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer(),
      ];
      const gamePlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame({ players });
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: [],
        boundaries: {
          min: 0,
          max: 3,
        },
      });
      mocks.gameHelper.getAllowedToVotePlayers.mockReturnValueOnce([players[0], players[1], players[3]]);
      mocks.gamePlayAugmenterService.canSurvivorsSkipGamePlay.mockReturnValueOnce(true);
      mocks.gamePlayAugmenterService.getSurvivorsVoteGamePlayInteractablePlayers.mockResolvedValueOnce([]);

      await expect(services.gamePlayAugmenter["getSurvivorsVoteGamePlayEligibleTargets"](game, gamePlay)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getSurvivorsElectSheriffGamePlayEligibleTargets", () => {
    it("should return alive players as interactable targets with boundaries from 1 to 1 when called.", () => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedInteraction = createFakePlayerInteraction({
        source: PlayerGroups.SURVIVORS,
        type: PlayerInteractionTypes.CHOOSE_AS_SHERIFF,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[1],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 1,
          max: 3,
        },
      });

      expect(services.gamePlayAugmenter["getSurvivorsElectSheriffGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getSurvivorsBuryDeadBodiesGamePlayEligibleTargets", () => {
    it("should return undefined when there is no devoted servant in the game.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      await expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlayEligibleTargets"](game)).resolves.toBeUndefined();
    });

    it("should return undefined when devoted servant is dead.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      await expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlayEligibleTargets"](game)).resolves.toBeUndefined();
    });

    it("should return undefined when devoted servant is powerless.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });

      await expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlayEligibleTargets"](game)).resolves.toBeUndefined();
    });

    it("should return undefined when devoted servant is in love.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });

      await expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlayEligibleTargets"](game)).resolves.toBeUndefined();
    });

    it("should throw error when there is no previous game history record.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.CANT_FIND_LAST_DEAD_PLAYERS, { gameId: game._id.toString() });
      mocks.gameHistoryRecordService.getPreviousGameHistoryRecord.mockResolvedValueOnce(null);
      mocks.unexpectedExceptionFactory.createCantFindLastDeadPlayersUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlayEligibleTargets"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastDeadPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSurvivorsBuryDeadBodiesGamePlayEligibleTargets", { gameId: game._id });
    });

    it("should throw error when dead players are undefined in previous game history record.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gameHistoryRecord = createFakeGameHistoryRecord({ deadPlayers: undefined });
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.CANT_FIND_LAST_DEAD_PLAYERS, { gameId: game._id.toString() });
      mocks.gameHistoryRecordService.getPreviousGameHistoryRecord.mockResolvedValueOnce(gameHistoryRecord);
      mocks.unexpectedExceptionFactory.createCantFindLastDeadPlayersUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlayEligibleTargets"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastDeadPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSurvivorsBuryDeadBodiesGamePlayEligibleTargets", { gameId: game._id });
    });

    it("should throw error when dead players are empty in previous game history record.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gameHistoryRecord = createFakeGameHistoryRecord({ deadPlayers: [] });
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.CANT_FIND_LAST_DEAD_PLAYERS, { gameId: game._id.toString() });
      mocks.gameHistoryRecordService.getPreviousGameHistoryRecord.mockResolvedValueOnce(gameHistoryRecord);
      mocks.unexpectedExceptionFactory.createCantFindLastDeadPlayersUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlayEligibleTargets"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastDeadPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSurvivorsBuryDeadBodiesGamePlayEligibleTargets", { gameId: game._id });
    });

    it("should return dead players as interactable players with boundaries from 0 to 1 when called.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const deadPlayers = [
        createFakeDeadPlayer({ ...players[0], isAlive: false, death: createFakePlayerDeath() }),
        createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerDeath() }),
      ];
      const gameHistoryRecord = createFakeGameHistoryRecord({ deadPlayers });
      mocks.gameHistoryRecordService.getPreviousGameHistoryRecord.mockResolvedValueOnce(gameHistoryRecord);
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.DEVOTED_SERVANT,
        type: PlayerInteractionTypes.STEAL_ROLE,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: deadPlayers[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: deadPlayers[1],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 0,
          max: 1,
        },
      });

      await expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlayEligibleTargets"](game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getSurvivorsGamePlayEligibleTargets", () => {
    beforeEach(() => {
      mocks.gamePlayAugmenterService.getSurvivorsElectSheriffGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as { getSurvivorsElectSheriffGamePlayEligibleTargets }, "getSurvivorsElectSheriffGamePlayEligibleTargets").mockImplementation();
      mocks.gamePlayAugmenterService.getSurvivorsVoteGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as { getSurvivorsVoteGamePlayEligibleTargets }, "getSurvivorsVoteGamePlayEligibleTargets").mockImplementation();
      mocks.gamePlayAugmenterService.getSurvivorsBuryDeadBodiesGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as { getSurvivorsBuryDeadBodiesGamePlayEligibleTargets }, "getSurvivorsBuryDeadBodiesGamePlayEligibleTargets").mockImplementation();
    });

    it("should call get survivors bury dead bodies game play eligible targets when game play action is bury dead bodies.", async() => {
      const gamePlay = createFakeGamePlaySurvivorsBuryDeadBodies();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getSurvivorsGamePlayEligibleTargets"](game, gamePlay);

      expect(mocks.gamePlayAugmenterService.getSurvivorsBuryDeadBodiesGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get survivors elect sheriff game play eligible targets when game play action is elect sheriff.", async() => {
      const gamePlay = createFakeGamePlaySurvivorsElectSheriff();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getSurvivorsGamePlayEligibleTargets"](game, gamePlay);

      expect(mocks.gamePlayAugmenterService.getSurvivorsElectSheriffGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
      expect(mocks.gamePlayAugmenterService.getSurvivorsVoteGamePlayEligibleTargets).not.toHaveBeenCalled();
    });

    it("should call get survivors vote game play eligible targets when game play action is vote.", async() => {
      const gamePlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getSurvivorsGamePlayEligibleTargets"](game, gamePlay);

      expect(mocks.gamePlayAugmenterService.getSurvivorsVoteGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
      expect(mocks.gamePlayAugmenterService.getSurvivorsElectSheriffGamePlayEligibleTargets).not.toHaveBeenCalled();
    });

    it("should throw error when game play action is not elect sheriff nor vote.", async() => {
      const gamePlay = createFakeGamePlayWildChildChoosesModel();
      const game = createFakeGame();
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.MALFORMED_CURRENT_GAME_PLAY, { gamePlayAction: gamePlay.action });
      mocks.unexpectedExceptionFactory.createMalformedCurrentGamePlayUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayAugmenter["getSurvivorsGamePlayEligibleTargets"](game, gamePlay)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createMalformedCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSurvivorsGamePlayEligibleTargets", gamePlay, game._id);
    });
  });

  describe("getWerewolvesGamePlayEligibleTargets", () => {
    it("should return alive villagers sided players as interactable targets with boundaries from 1 to 1 when called.", () => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedInteraction = createFakePlayerInteraction({
        source: PlayerGroups.WEREWOLVES,
        type: PlayerInteractionTypes.EAT,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 1,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getWerewolvesGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getBigBadWolfGamePlayEligibleTargets", () => {
    it("should return alive villagers as interactable targets with boundaries from 1 to 1 when there are still left to eat targets.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHelper.getEligibleWerewolvesTargets.mockReturnValueOnce([
        players[0],
        players[1],
      ]);
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.BIG_BAD_WOLF,
        type: PlayerInteractionTypes.EAT,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[1],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 1,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getBigBadWolfGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should return no interactable players with target boundaries from 0 to 0 when there are no left to eat targets.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHelper.getEligibleWerewolvesTargets.mockReturnValueOnce([]);

      const expectedInteractablePlayers = [];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 0,
          max: 0,
        },
      });
      expect(services.gamePlayAugmenter["getBigBadWolfGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(createFakeGamePlayEligibleTargets(expectedGamePlayEligibleTargets));
    });
  });

  describe("getCupidGamePlayEligibleTargets", () => {
    it("should return all alive interactable players with 2 to 2 targets boundaries when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeCupidAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ cupid: createFakeCupidGameOptions({ mustWinWithLovers: false }) }) });
      const game = createFakeGame({ players, options });
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.CUPID,
        type: PlayerInteractionTypes.CHARM,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 2,
          max: 2,
        },
      });

      expect(services.gamePlayAugmenter["getCupidGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should return all alive and not cupid interactable players with 2 to 2 targets boundaries when game options says that cupid must win with lovers.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeCupidAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ cupid: createFakeCupidGameOptions({ mustWinWithLovers: true }) }) });
      const game = createFakeGame({ players, options });
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.CUPID,
        type: PlayerInteractionTypes.CHARM,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[1],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 2,
          max: 2,
        },
      });

      expect(services.gamePlayAugmenter["getCupidGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should return undefined when there is not enough targets for cupid.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeCupidAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ cupid: createFakeCupidGameOptions({ mustWinWithLovers: true }) }) });
      const game = createFakeGame({ players, options });

      expect(services.gamePlayAugmenter["getCupidGamePlayEligibleTargets"](game)).toBeUndefined();
    });
  });

  describe("getFoxGamePlayEligibleTargets", () => {
    it("should return all alive interactable players with 0 to 1 boundaries when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.FOX,
        type: PlayerInteractionTypes.SNIFF,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 0,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getFoxGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getDefenderGamePlayEligibleTargets", () => {
    it("should throw error when there is no defender in the game.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_CURRENT_ROLE_IN_GAME, { gameId: game._id.toString(), roleName: RoleNames.DEFENDER });
      mocks.unexpectedExceptionFactory.createCantFindPlayerWithCurrentRoleUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayAugmenter["getDefenderGamePlayEligibleTargets"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindPlayerWithCurrentRoleUnexpectedException).toHaveBeenCalledExactlyOnceWith("getDefenderGamePlayEligibleTargets", { gameId: game._id, roleName: RoleNames.DEFENDER });
    });

    it("should return all alive players as interactable targets with boundaries from 1 to 1 when there is no last protected players.", async() => {
      const players = [
        createFakeDefenderAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHistoryRecordService.getLastGameHistoryDefenderProtectsRecord.mockResolvedValueOnce(null);
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.DEFENDER,
        type: PlayerInteractionTypes.PROTECT,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[1],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[2],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: { min: 1, max: 1 },
      });

      await expect(services.gamePlayAugmenter["getDefenderGamePlayEligibleTargets"](game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should return all alive players as interactable targets with boundaries from 1 to 1 when there is last protected players but defender can protect twice in a row.", async() => {
      const players = [
        createFakeDefenderAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ defender: createFakeDefenderGameOptions({ canProtectTwice: true }) }) });
      const game = createFakeGame({ players, options });
      const gameHistoryRecord = createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ targets: [{ player: players[2] }] }) });
      mocks.gameHistoryRecordService.getLastGameHistoryDefenderProtectsRecord.mockResolvedValueOnce(gameHistoryRecord);
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.DEFENDER,
        type: PlayerInteractionTypes.PROTECT,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[2],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: { min: 1, max: 1 },
      });

      await expect(services.gamePlayAugmenter["getDefenderGamePlayEligibleTargets"](game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should return all alive players but last protected player as interactable targets with boundaries from 1 to 1 when there is last protected players but defender can't protect twice in a row.", async() => {
      const players = [
        createFakeDefenderAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ defender: createFakeDefenderGameOptions({ canProtectTwice: false }) }) });
      const game = createFakeGame({ players, options });
      const gameHistoryRecord = createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ targets: [{ player: players[2] }] }) });
      mocks.gameHistoryRecordService.getLastGameHistoryDefenderProtectsRecord.mockResolvedValueOnce(gameHistoryRecord);
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.DEFENDER,
        type: PlayerInteractionTypes.PROTECT,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: { min: 1, max: 1 },
      });

      await expect(services.gamePlayAugmenter["getDefenderGamePlayEligibleTargets"](game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getHunterGamePlayEligibleTargets", () => {
    it("should return all alive players as interactable targets with boundaries from 1 to 1 when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.HUNTER,
        type: PlayerInteractionTypes.SHOOT,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[1],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: { min: 1, max: 1 },
      });

      expect(services.gamePlayAugmenter["getHunterGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getPiedPiperGamePlayEligibleTargets", () => {
    it("should return 2 interactable players with 2 to 2 targets boundaries when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ charmedPeopleCountPerNight: 4 }) }) });
      const game = createFakeGame({
        players,
        options,
      });
      mocks.gameHelper.getEligiblePiedPiperTargets.mockReturnValueOnce([
        players[0],
        players[1],
      ]);
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.PIED_PIPER,
        type: PlayerInteractionTypes.CHARM,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[1],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 2,
          max: 2,
        },
      });

      expect(services.gamePlayAugmenter["getPiedPiperGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should return 2 interactable players with 1 to 1 targets boundaries when game options charm count is lower than left to charm players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ charmedPeopleCountPerNight: 1 }) }) });
      const game = createFakeGame({
        players,
        options,
      });
      mocks.gameHelper.getEligiblePiedPiperTargets.mockReturnValueOnce([
        players[0],
        players[1],
      ]);
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.PIED_PIPER,
        type: PlayerInteractionTypes.CHARM,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[1],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 1,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getPiedPiperGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getScandalmongerGamePlayEligibleTargets", () => {
    it("should return all alive interactable players with 0 to 1 targets boundaries when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.SCANDALMONGER,
        type: PlayerInteractionTypes.MARK,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 0,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getScandalmongerGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getScapegoatGamePlayEligibleTargets", () => {
    it("should return all alive interactable players with 0 to alive length target boundaries when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.SCAPEGOAT,
        type: PlayerInteractionTypes.BAN_VOTING,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 0,
          max: 2,
        },
      });

      expect(services.gamePlayAugmenter["getScapegoatGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getSeerGamePlayEligibleTargets", () => {
    it("should return alive players but seer as interactable targets with boundaries from 1 to 1 when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.SEER,
        type: PlayerInteractionTypes.LOOK,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];

      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: { min: 1, max: 1 },
      });

      expect(services.gamePlayAugmenter["getSeerGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getWhiteWerewolfGamePlayEligibleTargets", () => {
    it("should return two interactable players with 0 to 1 boundaries when there are still wolves to eat.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHelper.getEligibleWhiteWerewolfTargets.mockReturnValueOnce([
        players[0],
        players[1],
      ]);
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.WHITE_WEREWOLF,
        type: PlayerInteractionTypes.EAT,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[1],
          interactions: [expectedInteraction],
        }),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 0,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getWhiteWerewolfGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should return no interactable player with 0 to 0 boundaries when there are no wolves to eat.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHelper.getEligibleWhiteWerewolfTargets.mockReturnValueOnce([]);
      const expectedInteractablePlayers = [];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: {
          min: 0,
          max: 0,
        },
      });

      expect(services.gamePlayAugmenter["getWhiteWerewolfGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getWildChildGamePlayEligibleTargets", () => {
    it("should return alive players without wild child as interactable targets with 1 to 1 boundaries when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWildChildAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.WILD_CHILD,
        type: PlayerInteractionTypes.CHOOSE_AS_MODEL,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];

      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: { min: 1, max: 1 },
      });

      expect(services.gamePlayAugmenter["getWildChildGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getWitchGamePlayEligibleTargetsBoundaries", () => {
    it.each<{
      test: string;
      hasWitchUsedLifePotion: boolean;
      hasWitchUsedDeathPotion: boolean;
      expected: GamePlayEligibleTargetsBoundaries;
    }>([
      {
        test: "should return boundaries from 0 to 2 when the witch didn't use any potion.",
        hasWitchUsedLifePotion: false,
        hasWitchUsedDeathPotion: false,
        expected: createFakeGamePlayEligibleTargetsBoundaries({
          min: 0,
          max: 2,
        }),
      },
      {
        test: "should return boundaries from 0 to 1 when the witch used life potion.",
        hasWitchUsedLifePotion: true,
        hasWitchUsedDeathPotion: false,
        expected: createFakeGamePlayEligibleTargetsBoundaries({
          min: 0,
          max: 1,
        }),
      },
      {
        test: "should return boundaries from 0 to 1 when the witch used death potion.",
        hasWitchUsedLifePotion: false,
        hasWitchUsedDeathPotion: true,
        expected: createFakeGamePlayEligibleTargetsBoundaries({
          min: 0,
          max: 1,
        }),
      },
      {
        test: "should return boundaries from 0 to 0 when the witch used life potion and death potion.",
        hasWitchUsedLifePotion: true,
        hasWitchUsedDeathPotion: true,
        expected: createFakeGamePlayEligibleTargetsBoundaries({
          min: 0,
          max: 0,
        }),
      },
    ])("$test", ({ hasWitchUsedLifePotion, hasWitchUsedDeathPotion, expected }) => {
      expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargetsBoundaries"](hasWitchUsedLifePotion, hasWitchUsedDeathPotion)).toStrictEqual<GamePlayEligibleTargetsBoundaries>(expected);
    });
  });

  describe("getWitchGamePlayEligibleTargetsInteractablePlayers", () => {
    it("should get interactable alive players for life and death potion when witch didn't use any potion.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeEatenByBigBadWolfPlayerAttribute()] }),
        createFakeWitchAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });
      const expectedLifePotionInteraction = createFakePlayerInteraction({
        source: RoleNames.WITCH,
        type: PlayerInteractionTypes.GIVE_LIFE_POTION,
      });
      const expectedDeathPotionInteraction = createFakePlayerInteraction({
        source: RoleNames.WITCH,
        type: PlayerInteractionTypes.GIVE_DEATH_POTION,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[0],
          interactions: [expectedDeathPotionInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[1],
          interactions: [expectedLifePotionInteraction],
        }),
        createFakeInteractablePlayer({
          player: players[2],
          interactions: [expectedDeathPotionInteraction],
        }),
      ];

      expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargetsInteractablePlayers"](game, false, false)).toStrictEqual<InteractablePlayer[]>(expectedInteractablePlayers);
    });

    it("should not get interactable players when witch used both potions.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeEatenByBigBadWolfPlayerAttribute()] }),
        createFakeWitchAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargetsInteractablePlayers"](game, true, true)).toStrictEqual<InteractablePlayer[]>([]);
    });
  });

  describe("getWitchGamePlayEligibleTargets", () => {
    beforeEach(() => {
      mocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsBoundaries = jest.spyOn(services.gamePlayAugmenter as unknown as { getWitchGamePlayEligibleTargetsBoundaries }, "getWitchGamePlayEligibleTargetsBoundaries").mockImplementation();
      mocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsInteractablePlayers = jest.spyOn(services.gamePlayAugmenter as unknown as { getWitchGamePlayEligibleTargetsInteractablePlayers }, "getWitchGamePlayEligibleTargetsInteractablePlayers").mockImplementation();
    });

    it("should throw error when witch is not in the game.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const mockedError = new UnexpectedException("getWitchGamePlayEligibleTargets", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_CURRENT_ROLE_IN_GAME, { gameId: game._id.toString(), roleName: RoleNames.WITCH });
      mocks.unexpectedExceptionFactory.createCantFindPlayerWithCurrentRoleUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindPlayerWithCurrentRoleUnexpectedException).toHaveBeenCalledExactlyOnceWith("getWitchGamePlayEligibleTargets", { gameId: game._id, roleName: RoleNames.WITCH });
    });

    it("should get interactable players from game when called and there is no history for life potion and death potion.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      await services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game);

      expect(mocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsInteractablePlayers).toHaveBeenCalledExactlyOnceWith(game, false, false);
    });

    it("should get interactable players from game with life potion used when called and there is history for life potion.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([createFakeGameHistoryRecord()]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      await services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game);

      expect(mocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsInteractablePlayers).toHaveBeenCalledExactlyOnceWith(game, true, false);
    });

    it("should get interactable players from game with death potion used when called and there is history for death potion.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([createFakeGameHistoryRecord()]);
      await services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game);

      expect(mocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsInteractablePlayers).toHaveBeenCalledExactlyOnceWith(game, false, true);
    });

    it("should get targets boundaries for witch when called and no potions are used.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      await services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game);

      expect(mocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(false, false);
    });

    it("should get targets boundaries for witch when called and life potion is used.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([createFakeGameHistoryRecord()]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      await services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game);

      expect(mocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(true, false);
    });

    it("should get targets boundaries for witch when called and death potion is used.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([createFakeGameHistoryRecord()]);
      await services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game);

      expect(mocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(false, true);
    });

    it("should return eligible targets with interactable players and boundaries when called.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedBoundaries = createFakeGamePlayEligibleTargetsBoundaries();
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer(),
        createFakeInteractablePlayer(),
        createFakeInteractablePlayer(),
      ];
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValue([]);
      mocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsBoundaries.mockReturnValueOnce(expectedBoundaries);
      mocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsInteractablePlayers.mockReturnValueOnce(expectedInteractablePlayers);
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: expectedBoundaries,
      });

      await expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getAccursedWolfFatherGamePlayEligibleTargets", () => {
    it("should return all eaten by werewolves players as interactable targets with boundaries from 0 to 1 when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeVillagerAlivePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.ACCURSED_WOLF_FATHER,
        type: PlayerInteractionTypes.INFECT,
      });
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer({
          player: players[3],
          interactions: [expectedInteraction],
        }),
      ];

      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: { min: 0, max: 1 },
      });

      expect(services.gamePlayAugmenter["getAccursedWolfFatherGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getGamePlayEligibleTargets", () => {
    beforeEach(() => {
      mocks.gamePlayAugmenterService.getSheriffGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getSheriffGamePlayEligibleTargets;
      }, "getSheriffGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getSurvivorsGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getSurvivorsGamePlayEligibleTargets;
      }, "getSurvivorsGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getWerewolvesGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getWerewolvesGamePlayEligibleTargets;
      }, "getWerewolvesGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getBigBadWolfGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getBigBadWolfGamePlayEligibleTargets;
      }, "getBigBadWolfGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getCupidGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getCupidGamePlayEligibleTargets;
      }, "getCupidGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getFoxGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getFoxGamePlayEligibleTargets;
      }, "getFoxGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getDefenderGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getDefenderGamePlayEligibleTargets;
      }, "getDefenderGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getHunterGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getHunterGamePlayEligibleTargets;
      }, "getHunterGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getPiedPiperGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getPiedPiperGamePlayEligibleTargets;
      }, "getPiedPiperGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getScandalmongerGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getScandalmongerGamePlayEligibleTargets;
      }, "getScandalmongerGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getScapegoatGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getScapegoatGamePlayEligibleTargets;
      }, "getScapegoatGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getSeerGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getSeerGamePlayEligibleTargets;
      }, "getSeerGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getWhiteWerewolfGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getWhiteWerewolfGamePlayEligibleTargets;
      }, "getWhiteWerewolfGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getWildChildGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getWildChildGamePlayEligibleTargets;
      }, "getWildChildGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getWitchGamePlayEligibleTargets;
      }, "getWitchGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
      mocks.gamePlayAugmenterService.getAccursedWolfFatherGamePlayEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getAccursedWolfFatherGamePlayEligibleTargets;
      }, "getAccursedWolfFatherGamePlayEligibleTargets").mockImplementation().mockReturnValue({});
    });

    it("should return undefined when game play source name is not in getGamePlayEligibleTargetsMethods.", async() => {
      const gamePlay = createFakeGamePlayThreeBrothersMeetEachOther();
      const game = createFakeGame();

      await expect(services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game)).resolves.toBeUndefined();
    });

    it("should return undefined when interactable players are undefined.", async() => {
      const gamePlay = createFakeGamePlaySheriffDelegates();
      const game = createFakeGame();
      mocks.gamePlayAugmenterService.getSheriffGamePlayEligibleTargets.mockReturnValueOnce(createFakeGamePlayEligibleTargets({}, { interactablePlayers: undefined }));

      await expect(services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game)).resolves.toBeUndefined();
    });

    it("should return undefined when game play method returns empty array of interactable players.", async() => {
      const gamePlay = createFakeGamePlaySheriffDelegates();
      const game = createFakeGame();
      mocks.gamePlayAugmenterService.getSheriffGamePlayEligibleTargets.mockReturnValueOnce(createFakeGamePlayEligibleTargets({ interactablePlayers: [] }));

      await expect(services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game)).resolves.toBeUndefined();
    });

    it("should return game play eligible targets when game play method returns interactable players.", async() => {
      const gamePlay = createFakeGamePlaySheriffDelegates();
      const game = createFakeGame();
      const interactablePlayers = [
        createFakeInteractablePlayer(),
        createFakeInteractablePlayer(),
      ];
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({ interactablePlayers });
      mocks.gamePlayAugmenterService.getSheriffGamePlayEligibleTargets.mockReturnValueOnce(expectedGamePlayEligibleTargets);

      await expect(services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should call get game play eligible targets for sheriff when game play source name is sheriff.", async() => {
      const gamePlay = createFakeGamePlaySheriffDelegates();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getSheriffGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call get game play eligible targets for survivors when game play source name is survivors.", async() => {
      const gamePlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getSurvivorsGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call get game play eligible targets for werewolves when game play source name is werewolves.", async() => {
      const gamePlay = createFakeGamePlayWerewolvesEat();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getWerewolvesGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for big bad wolf when game play source name is big bad wolf.", async() => {
      const gamePlay = createFakeGamePlayBigBadWolfEats();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getBigBadWolfGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for cupid when game play source name is cupid.", async() => {
      const gamePlay = createFakeGamePlayCupidCharms();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getCupidGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for fox when game play source name is fox.", async() => {
      const gamePlay = createFakeGamePlayFoxSniffs();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getFoxGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for defender when game play source name is defender.", async() => {
      const gamePlay = createFakeGamePlayDefenderProtects();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getDefenderGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for hunter when game play source name is hunter.", async() => {
      const gamePlay = createFakeGamePlayHunterShoots();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getHunterGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for pied piper when game play source name is pied piper.", async() => {
      const gamePlay = createFakeGamePlayPiedPiperCharms();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getPiedPiperGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for scandalmonger when game play source name is scandalmonger.", async() => {
      const gamePlay = createFakeGamePlayScandalmongerMarks();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getScandalmongerGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for scapegoat when game play source name is scapegoat.", async() => {
      const gamePlay = createFakeGamePlayScapegoatBansVoting();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getScapegoatGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for see when game play source name is see.", async() => {
      const gamePlay = createFakeGamePlaySeerLooks();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getSeerGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for white werewolf when game play source name is white werewolf.", async() => {
      const gamePlay = createFakeGamePlayWhiteWerewolfEats();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getWhiteWerewolfGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for wild child when game play source name is wild child.", async() => {
      const gamePlay = createFakeGamePlayWildChildChoosesModel();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getWildChildGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for witch when game play source name is witch.", async() => {
      const gamePlay = createFakeGamePlayWitchUsesPotions();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for accursed wolf-father when game play source name is accursed wolf-father.", async() => {
      const gamePlay = createFakeGamePlayAccursedWolfFatherInfects();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getAccursedWolfFatherGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });
  });

  describe("canSurvivorsSkipGamePlay", () => {
    it.each<{
      test: string;
      gamePlay: GamePlay;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when game play action is elect sheriff.",
        gamePlay: createFakeGamePlay({ action: GamePlayActions.ELECT_SHERIFF }),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when game play action is vote and game play cause is angel presence.",
        gamePlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE }),
        game: createFakeGame({ options: createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) }) }),
        expected: false,
      },
      {
        test: "should return true when game play action is bury dead bodies.",
        gamePlay: createFakeGamePlay({ action: GamePlayActions.BURY_DEAD_BODIES }),
        game: createFakeGame({ options: createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: false }) }) }),
        expected: true,
      },
      {
        test: "should return true when game play action is not elect sheriff and game options say that votes can be skipped.",
        gamePlay: createFakeGamePlay({ action: GamePlayActions.VOTE }),
        game: createFakeGame({ options: createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) }) }),
        expected: true,
      },
      {
        test: "should return true when game play action is not vote but because angel presence.",
        gamePlay: createFakeGamePlayScandalmongerMarks({ cause: GamePlayCauses.ANGEL_PRESENCE }),
        game: createFakeGame({ options: createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) }) }),
        expected: true,
      },
      {
        test: "should return false when game play action is not elect sheriff and game options say that votes can't be skipped.",
        gamePlay: createFakeGamePlay({ action: GamePlayActions.VOTE }),
        game: createFakeGame({
          options: createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: false }) }),
          players: [
            createFakeWhiteWerewolfAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
            createFakeAngelAlivePlayer(),
            createFakeWitchAlivePlayer({ isAlive: false }),
          ],
        }),
        expected: false,
      },
    ])("$test", ({ gamePlay, game, expected }) => {
      expect(services.gamePlayAugmenter["canSurvivorsSkipGamePlay"](game, gamePlay)).toBe(expected);
    });
  });

  describe("canCupidSkipGamePlay", () => {
    it.each<{
      test: string;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when expected there are at least 2 targets for cupid.",
        game: createFakeGame({
          players: [
            createFakeVillagerAlivePlayer(),
            createFakeVillagerAlivePlayer(),
          ],
        }),
        expected: false,
      },
      {
        test: "should return true when expected there are less than 2 targets for cupid.",
        game: createFakeGame({ players: [createFakeVillagerAlivePlayer()] }),
        expected: true,
      },
    ])("$test", ({ game, expected }) => {
      expect(services.gamePlayAugmenter["canCupidSkipGamePlay"](game)).toBe(expected);
    });
  });

  describe("canBigBadWolfSkipGamePlay", () => {
    it.each<{
      test: string;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return true when there are no players left to eat by werewolves.",
        game: createFakeGame({ players: [createFakeWerewolfAlivePlayer()] }),
        expected: true,
      },
      {
        test: "should return false when there are players left to eat by werewolves.",
        game: createFakeGame({ players: [createFakeVillagerAlivePlayer()] }),
        expected: false,
      },
    ])("$test", ({ game, expected }) => {
      expect(services.gamePlayAugmenter["canBigBadWolfSkipGamePlay"](game)).toBe(expected);
    });
  });

  describe("canThiefSkipGamePlay", () => {
    it.each<{
      test: string;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return true when game has undefined additional cards.",
        game: createFakeGame(),
        expected: true,
      },
      {
        test: "should return true when game has no additional cards.",
        game: createFakeGame({ additionalCards: [], options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: false }) }) }) }),
        expected: true,
      },
      {
        test: "should return true when thief doesn't have to choose between werewolves cards.",
        game: createFakeGame({
          additionalCards: [
            createFakeGameAdditionalCard({ roleName: RoleNames.SEER }),
            createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: true }) }) }),
        }),
        expected: true,
      },
      {
        test: "should return true when thief has to choose between werewolves cards but game options allow to skip.",
        game: createFakeGame({
          additionalCards: [
            createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
            createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: false }) }) }),
        }),
        expected: true,
      },
      {
        test: "should return false when thief has to choose between werewolves cards and game options don't allow to skip.",
        game: createFakeGame({
          additionalCards: [
            createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
            createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: true }) }) }),
        }),
        expected: false,
      },
    ])("$test", ({ game, expected }) => {
      expect(services.gamePlayAugmenter["canThiefSkipGamePlay"](game)).toBe(expected);
    });
  });

  describe("canGamePlayBeSkipped", () => {
    beforeEach(() => {
      mocks.gamePlayAugmenterService.canSurvivorsSkipGamePlay = jest.spyOn(services.gamePlayAugmenter as unknown as { canSurvivorsSkipGamePlay }, "canSurvivorsSkipGamePlay").mockImplementation();
      mocks.gamePlayAugmenterService.canBigBadWolfSkipGamePlay = jest.spyOn(services.gamePlayAugmenter as unknown as { canBigBadWolfSkipGamePlay }, "canBigBadWolfSkipGamePlay").mockImplementation();
      mocks.gamePlayAugmenterService.canThiefSkipGamePlay = jest.spyOn(services.gamePlayAugmenter as unknown as { canThiefSkipGamePlay }, "canThiefSkipGamePlay").mockImplementation();
      mocks.gamePlayAugmenterService.canCupidSkipGamePlay = jest.spyOn(services.gamePlayAugmenter as unknown as { canCupidSkipGamePlay }, "canCupidSkipGamePlay").mockImplementation();
    });

    it("should return false when game play source name is not in canBeSkippedPlayMethods.", () => {
      const gamePlay = createFakeGamePlayWildChildChoosesModel();
      const game = createFakeGame();

      expect(services.gamePlayAugmenter["canGamePlayBeSkipped"](game, gamePlay)).toBe(false);
    });

    it.each<{
      test: string;
      gamePlay: GamePlay;
    }>([
      {
        gamePlay: createFakeGamePlayLoversMeetEachOther(),
        test: "should return true when game play source name are lovers.",
      },
      {
        gamePlay: createFakeGamePlayCharmedMeetEachOther(),
        test: "should return true when game play source name are charmed.",
      },
      {
        gamePlay: createFakeGamePlayFoxSniffs(),
        test: "should return true when game play source name is fox.",
      },
      {
        gamePlay: createFakeGamePlayScandalmongerMarks(),
        test: "should return true when game play source name is scandalmonger.",
      },
      {
        gamePlay: createFakeGamePlayScapegoatBansVoting(),
        test: "should return true when game play source name is scapegoat.",
      },
      {
        gamePlay: createFakeGamePlayTwoSistersMeetEachOther(),
        test: "should return true when game play source name are two sisters.",
      },
      {
        gamePlay: createFakeGamePlayThreeBrothersMeetEachOther(),
        test: "should return true when game play source name are three brothers.",
      },
      {
        gamePlay: createFakeGamePlayWhiteWerewolfEats(),
        test: "should return true when game play source name is white werewolf.",
      },
      {
        gamePlay: createFakeGamePlayWitchUsesPotions(),
        test: "should return true when game play source name is witch.",
      },
      {
        gamePlay: createFakeGamePlayActorChoosesCard(),
        test: "should return true when game play source name is actor.",
      },
      {
        gamePlay: createFakeGamePlayAccursedWolfFatherInfects(),
        test: "should return true when game play source name is accursed wolf-father.",
      },
    ])("$test", ({ gamePlay }) => {
      const game = createFakeGame();

      expect(services.gamePlayAugmenter["canGamePlayBeSkipped"](game, gamePlay)).toBe(true);
    });

    it("should call canSurvivorsSkipGamePlay method when game play source name is survivors.", () => {
      const gamePlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame();
      services.gamePlayAugmenter["canGamePlayBeSkipped"](game, gamePlay);

      expect(mocks.gamePlayAugmenterService.canSurvivorsSkipGamePlay).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call canBigBadWolfSkipGamePlay method when game play source name is big bad wolf.", () => {
      const gamePlay = createFakeGamePlayBigBadWolfEats();
      const game = createFakeGame();
      services.gamePlayAugmenter["canGamePlayBeSkipped"](game, gamePlay);

      expect(mocks.gamePlayAugmenterService.canBigBadWolfSkipGamePlay).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call canThiefSkipGamePlay method when game play source name is thief.", () => {
      const gamePlay = createFakeGamePlayThiefChoosesCard();
      const game = createFakeGame();
      services.gamePlayAugmenter["canGamePlayBeSkipped"](game, gamePlay);

      expect(mocks.gamePlayAugmenterService.canThiefSkipGamePlay).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call canCupidSkipGamePlay method when game play source name is cupid.", () => {
      const gamePlay = createFakeGamePlayCupidCharms();
      const game = createFakeGame();
      services.gamePlayAugmenter["canGamePlayBeSkipped"](game, gamePlay);

      expect(mocks.gamePlayAugmenterService.canCupidSkipGamePlay).toHaveBeenCalledExactlyOnceWith(game);
    });
  });

  describe("getExpectedPlayersToPlay", () => {
    it("should throw error when there is no current play.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });
      const interpolations = { gameId: game._id };
      const mockedError = new UnexpectedException("getExpectedPlayersToPlay", UnexpectedExceptionReasons.NO_CURRENT_GAME_PLAY, { gameId: game._id.toString() });
      mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException.mockReturnValueOnce(mockedError);

      expect(() => services.gamePlayAugmenter["getExpectedPlayersToPlay"](game)).toThrow(mockedError);
      expect(mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("getExpectedPlayersToPlay", interpolations);
    });

    it("should return alive werewolves when source is group of werewolves.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players, currentPlay: createFakeGamePlayWerewolvesEat() });

      expect(services.gamePlayAugmenter["getExpectedPlayersToPlay"](game)).toStrictEqual<Player[]>([
        players[0],
        players[2],
      ]);
    });

    it("should return alive two sisters when source is specific role.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players, currentPlay: createFakeGamePlayTwoSistersMeetEachOther() });

      expect(services.gamePlayAugmenter["getExpectedPlayersToPlay"](game)).toStrictEqual<Player[]>([players[3]]);
    });

    it("should not return sheriff when source is sheriff but action is not DELEGATE and sheriff is dead.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()], isAlive: false }),
      ];
      const game = createFakeGame({ players, currentPlay: createFakeGamePlaySheriffSettlesVotes() });

      expect(services.gamePlayAugmenter["getExpectedPlayersToPlay"](game)).toStrictEqual<Player[]>([]);
    });

    it("should return sheriff when source is sheriff and action is DELEGATE even if he is dying.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()], isAlive: false }),
      ];
      const game = createFakeGame({ players, currentPlay: createFakeGamePlaySheriffDelegates() });

      expect(services.gamePlayAugmenter["getExpectedPlayersToPlay"](game)).toStrictEqual<Player[]>([players[5]]);
    });

    it("should return hunter when source is hunter and action is SHOOT even if he is dying.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeHunterAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()], isAlive: false }),
      ];
      const game = createFakeGame({ players, currentPlay: createFakeGamePlayHunterShoots() });

      expect(services.gamePlayAugmenter["getExpectedPlayersToPlay"](game)).toStrictEqual<Player[]>([players[5]]);
    });

    it("should return scapegoat when source is scapegoat and action is BAN_VOTING even if he is dying.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer({}),
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeScapegoatAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute(), createFakeCantVoteBySurvivorsPlayerAttribute()], isAlive: false }),
      ];
      const game = createFakeGame({ players, currentPlay: createFakeGamePlayScapegoatBansVoting() });

      expect(services.gamePlayAugmenter["getExpectedPlayersToPlay"](game)).toStrictEqual<Player[]>([players[5]]);
    });

    it("should return alive players capable of vote when action is vote.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()], isAlive: false }),
      ];
      const game = createFakeGame({ players, currentPlay: createFakeGamePlaySurvivorsVote() });

      expect(services.gamePlayAugmenter["getExpectedPlayersToPlay"](game)).toStrictEqual<Player[]>([players[0], players[2]]);
    });
  });
});