import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { when } from "jest-when";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { GamePhases } from "@/modules/game/enums/game.enum";
import * as GameHelper from "@/modules/game/helpers/game.helper";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlayAugmenterService } from "@/modules/game/providers/services/game-play/game-play-augmenter.service";
import { GamePlayService } from "@/modules/game/providers/services/game-play/game-play.service";
import type { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { SheriffGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { GamePlaySourceName } from "@/modules/game/types/game-play.type";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";

import { createFakeGameOptionsDto } from "@tests/factories/game/dto/create-game/create-game-options/create-game-options.dto.factory";
import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";
import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlaySource } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeRolesGameOptions, createFakeSheriffElectionGameOptions, createFakeSheriffGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options/game-roles-options.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";
import { createFakeGamePlay, createFakeGamePlayActorChoosesCard, createFakeGamePlayBigBadWolfEats, createFakeGamePlayCharmedMeetEachOther, createFakeGamePlayCupidCharms, createFakeGamePlayDefenderProtects, createFakeGamePlayFoxSniffs, createFakeGamePlayHunterShoots, createFakeGamePlayLoversMeetEachOther, createFakeGamePlayPiedPiperCharms, createFakeGamePlayScandalmongerMarks, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySeerLooks, createFakeGamePlaySheriffDelegates, createFakeGamePlayStutteringJudgeChoosesSign, createFakeGamePlaySurvivorsElectSheriff, createFakeGamePlaySurvivorsVote, createFakeGamePlayThiefChoosesCard, createFakeGamePlayThreeBrothersMeetEachOther, createFakeGamePlayTwoSistersMeetEachOther, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWildChildChoosesModel, createFakeGamePlayWitchUsesPotions, createFakeGamePlayWolfHoundChoosesSide } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCantVoteBySurvivorsPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakePowerlessByElderPlayerAttribute, createFakePowerlessByWerewolvesPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeAccursedWolfFatherAlivePlayer, createFakeActorAlivePlayer, createFakeAngelAlivePlayer, createFakeBigBadWolfAlivePlayer, createFakeCupidAlivePlayer, createFakeDefenderAlivePlayer, createFakeFoxAlivePlayer, createFakeHunterAlivePlayer, createFakePiedPiperAlivePlayer, createFakeScandalmongerAlivePlayer, createFakeScapegoatAlivePlayer, createFakeSeerAlivePlayer, createFakeStutteringJudgeAlivePlayer, createFakeThiefAlivePlayer, createFakeThreeBrothersAlivePlayer, createFakeTwoSistersAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer, createFakeWolfHoundAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";

describe("Game Play Service", () => {
  let services: { gamePlay: GamePlayService };
  let mocks: {
    gamePlayService: {
      removeObsoleteUpcomingPlays: jest.SpyInstance;
      getNewUpcomingPlaysForCurrentPhase: jest.SpyInstance;
      sortUpcomingPlaysByPriority: jest.SpyInstance;
      augmentCurrentGamePlay: jest.SpyInstance;
      getUpcomingDayPlays: jest.SpyInstance;
      getUpcomingNightPlays: jest.SpyInstance;
      isUpcomingPlayNewForCurrentPhase: jest.SpyInstance;
      isSurvivorsGamePlaySuitableForCurrentPhase: jest.SpyInstance;
      isLoversGamePlaySuitableForCurrentPhase: jest.SpyInstance;
      isPiedPiperGamePlaySuitableForCurrentPhase: jest.SpyInstance;
      shouldBeCalledOnCurrentTurnInterval: jest.SpyInstance;
      validateUpcomingPlaysPriority: jest.SpyInstance;
      isTwoSistersGamePlaySuitableForCurrentPhase: jest.SpyInstance;
      isThreeBrothersGamePlaySuitableForCurrentPhase: jest.SpyInstance;
      isBigBadWolfGamePlaySuitableForCurrentPhase: jest.SpyInstance;
      isWhiteWerewolfGamePlaySuitableForCurrentPhase: jest.SpyInstance;
      isWitchGamePlaySuitableForCurrentPhase: jest.SpyInstance;
      isActorGamePlaySuitableForCurrentPhase: jest.SpyInstance;
      isSheriffGamePlaySuitableForCurrentPhase: jest.SpyInstance;
      isRoleGamePlaySuitableForCurrentPhase: jest.SpyInstance;
      isGroupGamePlaySuitableForCurrentPhase: jest.SpyInstance;
      isOneNightOnlyGamePlaySuitableForCurrentPhase: jest.SpyInstance;
    };
    gamePlayAugmenterService: {
      setGamePlayCanBeSkipped: jest.SpyInstance;
      setGamePlayEligibleTargets: jest.SpyInstance;
      setGamePlaySourcePlayers: jest.SpyInstance;
    };
    gameHistoryRecordService: {
      getGameHistoryWitchUsesSpecificPotionRecords: jest.SpyInstance;
      getGameHistoryPhaseRecords: jest.SpyInstance;
      hasGamePlayBeenMade: jest.SpyInstance;
    };
    gameHelper: {
      getLeftToEatByWerewolvesPlayers: jest.SpyInstance;
      getLeftToEatByWhiteWerewolfPlayers: jest.SpyInstance;
    };
    unexpectedExceptionFactory: {
      createNoGamePlayPriorityUnexpectedException: jest.SpyInstance;
    };
  };

  beforeEach(async() => {
    mocks = {
      gamePlayService: {
        removeObsoleteUpcomingPlays: jest.fn(),
        getNewUpcomingPlaysForCurrentPhase: jest.fn(),
        sortUpcomingPlaysByPriority: jest.fn(),
        augmentCurrentGamePlay: jest.fn(),
        getUpcomingDayPlays: jest.fn(),
        getUpcomingNightPlays: jest.fn(),
        isUpcomingPlayNewForCurrentPhase: jest.fn(),
        isSurvivorsGamePlaySuitableForCurrentPhase: jest.fn(),
        isLoversGamePlaySuitableForCurrentPhase: jest.fn(),
        isPiedPiperGamePlaySuitableForCurrentPhase: jest.fn(),
        shouldBeCalledOnCurrentTurnInterval: jest.fn(),
        validateUpcomingPlaysPriority: jest.fn(),
        isTwoSistersGamePlaySuitableForCurrentPhase: jest.fn(),
        isThreeBrothersGamePlaySuitableForCurrentPhase: jest.fn(),
        isBigBadWolfGamePlaySuitableForCurrentPhase: jest.fn(),
        isWhiteWerewolfGamePlaySuitableForCurrentPhase: jest.fn(),
        isWitchGamePlaySuitableForCurrentPhase: jest.fn(),
        isActorGamePlaySuitableForCurrentPhase: jest.fn(),
        isSheriffGamePlaySuitableForCurrentPhase: jest.fn(),
        isRoleGamePlaySuitableForCurrentPhase: jest.fn(),
        isGroupGamePlaySuitableForCurrentPhase: jest.fn(),
        isOneNightOnlyGamePlaySuitableForCurrentPhase: jest.fn(),
      },
      gamePlayAugmenterService: {
        setGamePlayCanBeSkipped: jest.fn(),
        setGamePlayEligibleTargets: jest.fn(),
        setGamePlaySourcePlayers: jest.fn(),
      },
      gameHistoryRecordService: {
        getGameHistoryWitchUsesSpecificPotionRecords: jest.fn().mockResolvedValue([]),
        getGameHistoryPhaseRecords: jest.fn().mockResolvedValue([]),
        hasGamePlayBeenMade: jest.fn().mockResolvedValue(false),
      },
      gameHelper: {
        getLeftToEatByWerewolvesPlayers: jest.spyOn(GameHelper, "getLeftToEatByWerewolvesPlayers").mockReturnValue([]),
        getLeftToEatByWhiteWerewolfPlayers: jest.spyOn(GameHelper, "getLeftToEatByWhiteWerewolfPlayers").mockReturnValue([]),
      },
      unexpectedExceptionFactory: { createNoGamePlayPriorityUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoGamePlayPriorityUnexpectedException").mockImplementation() },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GamePlayAugmenterService,
          useValue: mocks.gamePlayAugmenterService,
        },
        {
          provide: GameHistoryRecordService,
          useValue: mocks.gameHistoryRecordService,
        },
        GamePlayService,
      ],
    }).compile();

    services = { gamePlay: module.get<GamePlayService>(GamePlayService) };
  });

  describe("refreshUpcomingPlays", () => {
    beforeEach(() => {
      mocks.gamePlayService.removeObsoleteUpcomingPlays = jest.spyOn(services.gamePlay as unknown as { removeObsoleteUpcomingPlays }, "removeObsoleteUpcomingPlays").mockImplementation();
      mocks.gamePlayService.getNewUpcomingPlaysForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { getNewUpcomingPlaysForCurrentPhase }, "getNewUpcomingPlaysForCurrentPhase").mockImplementation();
      mocks.gamePlayService.sortUpcomingPlaysByPriority = jest.spyOn(services.gamePlay as unknown as { sortUpcomingPlaysByPriority }, "sortUpcomingPlaysByPriority").mockImplementation();
    });

    it("should call removeObsoleteUpcomingPlays when called.", async() => {
      const game = createFakeGame();
      mocks.gamePlayService.removeObsoleteUpcomingPlays.mockResolvedValue(game);
      mocks.gamePlayService.getNewUpcomingPlaysForCurrentPhase.mockReturnValue(game.upcomingPlays);
      mocks.gamePlayService.sortUpcomingPlaysByPriority.mockReturnValue(game.upcomingPlays);
      await services.gamePlay.refreshUpcomingPlays(game);

      expect(mocks.gamePlayService.removeObsoleteUpcomingPlays).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call getNewUpcomingPlaysForCurrentPhase when called.", async() => {
      const game = createFakeGame();
      mocks.gamePlayService.removeObsoleteUpcomingPlays.mockResolvedValue(game);
      mocks.gamePlayService.getNewUpcomingPlaysForCurrentPhase.mockReturnValue(game.upcomingPlays);
      mocks.gamePlayService.sortUpcomingPlaysByPriority.mockReturnValue(game.upcomingPlays);
      await services.gamePlay.refreshUpcomingPlays(game);

      expect(mocks.gamePlayService.getNewUpcomingPlaysForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call sortUpcomingPlaysByPriority when called.", async() => {
      const game = createFakeGame();
      mocks.gamePlayService.removeObsoleteUpcomingPlays.mockResolvedValue(game);
      mocks.gamePlayService.getNewUpcomingPlaysForCurrentPhase.mockReturnValue(game.upcomingPlays);
      mocks.gamePlayService.sortUpcomingPlaysByPriority.mockReturnValue(game.upcomingPlays);
      await services.gamePlay.refreshUpcomingPlays(game);

      expect(mocks.gamePlayService.sortUpcomingPlaysByPriority).toHaveBeenCalledExactlyOnceWith(game.upcomingPlays);
    });
  });

  describe("proceedToNextGamePlay", () => {
    beforeEach(() => {
      mocks.gamePlayService.augmentCurrentGamePlay = jest.spyOn(services.gamePlay, "augmentCurrentGamePlay").mockImplementation();
    });

    it("should return game as is when there is no upcoming plays.", () => {
      const game = createFakeGame();

      expect(services.gamePlay.proceedToNextGamePlay(game)).toStrictEqual<Game>(game);
    });

    it("should make proceed to next game play when called.", () => {
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlaySurvivorsVote()], currentPlay: createFakeGamePlayFoxSniffs() });
      const expectedCurrentPlay = createFakeGamePlay(game.upcomingPlays[0]);
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [],
        currentPlay: expectedCurrentPlay,
      });
      mocks.gamePlayService.augmentCurrentGamePlay.mockReturnValue(expectedGame);

      expect(services.gamePlay.proceedToNextGamePlay(game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("augmentCurrentGamePlay", () => {
    it("should call setGamePlayCanBeSkipped method when called.", async() => {
      const currentPlay = createFakeGamePlay();
      const game = createFakeGameWithCurrentPlay({ currentPlay });
      mocks.gamePlayAugmenterService.setGamePlayCanBeSkipped.mockReturnValue(currentPlay);
      mocks.gamePlayAugmenterService.setGamePlayEligibleTargets.mockResolvedValue(currentPlay);
      mocks.gamePlayAugmenterService.setGamePlaySourcePlayers.mockReturnValue(currentPlay);
      await services.gamePlay.augmentCurrentGamePlay(game);

      expect(mocks.gamePlayAugmenterService.setGamePlayCanBeSkipped).toHaveBeenCalledExactlyOnceWith(game.currentPlay, game);
    });

    it("should call setGamePlayEligibleTargets method when called.", async() => {
      const currentPlay = createFakeGamePlay();
      const game = createFakeGameWithCurrentPlay({ currentPlay });
      mocks.gamePlayAugmenterService.setGamePlayCanBeSkipped.mockReturnValue(currentPlay);
      mocks.gamePlayAugmenterService.setGamePlayEligibleTargets.mockResolvedValue(currentPlay);
      mocks.gamePlayAugmenterService.setGamePlaySourcePlayers.mockReturnValue(currentPlay);
      await services.gamePlay.augmentCurrentGamePlay(game);

      expect(mocks.gamePlayAugmenterService.setGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game.currentPlay, game);
    });

    it("should call getExpectedPlayersToPlay method when called.", async() => {
      const currentPlay = createFakeGamePlay();
      const game = createFakeGameWithCurrentPlay({ currentPlay });
      mocks.gamePlayAugmenterService.setGamePlayCanBeSkipped.mockReturnValue(currentPlay);
      mocks.gamePlayAugmenterService.setGamePlayEligibleTargets.mockResolvedValue(currentPlay);
      mocks.gamePlayAugmenterService.setGamePlaySourcePlayers.mockReturnValue(currentPlay);
      await services.gamePlay.augmentCurrentGamePlay(game);

      expect(mocks.gamePlayAugmenterService.setGamePlaySourcePlayers).toHaveBeenCalledExactlyOnceWith(game.currentPlay, game);
    });

    it("should return game with augmented current play when called.", async() => {
      const currentPlay = createFakeGamePlay();
      const game = createFakeGameWithCurrentPlay({ currentPlay });
      const expectedPlayersToPlay = [createFakeWerewolfAlivePlayer(), createFakeVillagerAlivePlayer()];
      const augmentedCurrentPlay = createFakeGamePlay({
        ...currentPlay,
        source: createFakeGamePlaySource({ players: expectedPlayersToPlay }),
        canBeSkipped: true,
      });
      mocks.gamePlayAugmenterService.setGamePlayCanBeSkipped.mockReturnValue(augmentedCurrentPlay);
      mocks.gamePlayAugmenterService.setGamePlayEligibleTargets.mockResolvedValue(augmentedCurrentPlay);
      mocks.gamePlayAugmenterService.setGamePlayEligibleTargets.mockResolvedValue(augmentedCurrentPlay);
      mocks.gamePlayAugmenterService.setGamePlaySourcePlayers.mockReturnValue(augmentedCurrentPlay);
      const expectedGame = createFakeGameWithCurrentPlay({
        ...game,
        currentPlay: augmentedCurrentPlay,
      });

      await expect(services.gamePlay.augmentCurrentGamePlay(game)).resolves.toStrictEqual<Game>(expectedGame);
    });
  });

  describe("getUpcomingDayPlays", () => {
    it("should get empty array when survivors can't vote.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
        createFakeHunterAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players, turn: 1, phase: GamePhases.DAY });

      expect(services.gamePlay.getUpcomingDayPlays(game)).toStrictEqual<GamePlay[]>([]);
    });

    it("should get survivors vote game play when alive players can vote.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
      ];
      const game = createFakeGame({ players, turn: 1, phase: GamePhases.DAY });

      expect(services.gamePlay.getUpcomingDayPlays(game)).toStrictEqual<GamePlay[]>([createFakeGamePlaySurvivorsVote()]);
    });

    it("should get upcoming day plays with sheriff election and survivors vote when it's sheriff election time.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ isEnabled: true, electedAt: createFakeSheriffElectionGameOptions({ phase: GamePhases.DAY, turn: 3 }) }) }) });
      const game = createFakeGame({ players, turn: 3, phase: GamePhases.DAY, options });
      const expectedUpcomingPlays = [
        createFakeGamePlaySurvivorsElectSheriff(),
        createFakeGamePlaySurvivorsVote(),
      ];

      expect(services.gamePlay.getUpcomingDayPlays(game)).toStrictEqual<GamePlay[]>(expectedUpcomingPlays);
    });
  });

  describe("getUpcomingNightPlays", () => {
    it.each<{
      test: string;
      game: Game;
      output: GamePlay[];
    }>([
      {
        test: "should get upcoming night plays when it's the first night with official rules and some roles.",
        game: createFakeGame({
          turn: 1,
          phase: GamePhases.NIGHT,
          players: [
            createFakeVillagerAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
          ],
          options: DEFAULT_GAME_OPTIONS,
        }),
        output: [
          createFakeGamePlaySurvivorsElectSheriff(),
          createFakeGamePlaySeerLooks(),
          createFakeGamePlayWerewolvesEat(),
        ],
      },
      {
        test: "should get upcoming night plays when it's the first night with official rules and all roles who act during the night.",
        game: createFakeGame({
          turn: 1,
          phase: GamePhases.NIGHT,
          players: [
            createFakeVillagerAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeWhiteWerewolfAlivePlayer(),
            createFakeAngelAlivePlayer(),
            createFakeThiefAlivePlayer(),
            createFakeWolfHoundAlivePlayer(),
            createFakeCupidAlivePlayer(),
            createFakeFoxAlivePlayer(),
            createFakeStutteringJudgeAlivePlayer(),
            createFakeTwoSistersAlivePlayer(),
            createFakeTwoSistersAlivePlayer(),
            createFakeThreeBrothersAlivePlayer(),
            createFakeThreeBrothersAlivePlayer(),
            createFakeThreeBrothersAlivePlayer(),
            createFakeWildChildAlivePlayer(),
            createFakeScandalmongerAlivePlayer(),
            createFakeDefenderAlivePlayer(),
            createFakeBigBadWolfAlivePlayer(),
            createFakeWitchAlivePlayer(),
            createFakePiedPiperAlivePlayer(),
          ],
          options: DEFAULT_GAME_OPTIONS,
        }),
        output: [
          createFakeGamePlaySurvivorsElectSheriff(),
          createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE }),
          createFakeGamePlayThiefChoosesCard(),
          createFakeGamePlayWolfHoundChoosesSide(),
          createFakeGamePlayCupidCharms(),
          createFakeGamePlaySeerLooks(),
          createFakeGamePlayFoxSniffs(),
          createFakeGamePlayStutteringJudgeChoosesSign(),
          createFakeGamePlayTwoSistersMeetEachOther(),
          createFakeGamePlayThreeBrothersMeetEachOther(),
          createFakeGamePlayWildChildChoosesModel(),
          createFakeGamePlayScandalmongerMarks(),
          createFakeGamePlayDefenderProtects(),
          createFakeGamePlayWerewolvesEat(),
          createFakeGamePlayWhiteWerewolfEats(),
          createFakeGamePlayBigBadWolfEats(),
          createFakeGamePlayWitchUsesPotions(),
          createFakeGamePlayPiedPiperCharms(),
          createFakeGamePlayCharmedMeetEachOther(),
        ],
      },
      {
        test: "should get upcoming night plays when it's the second night with official rules and some roles.",
        game: createFakeGame({
          turn: 2,
          phase: GamePhases.NIGHT,
          players: [
            createFakeCupidAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer({ isAlive: false }),
            createFakeWitchAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
            createFakeAngelAlivePlayer(),
          ],
          options: DEFAULT_GAME_OPTIONS,
        }),
        output: [
          createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE }),
          createFakeGamePlayCupidCharms(),
          createFakeGamePlayWerewolvesEat(),
        ],
      },
    ])("$test", async({ game, output }) => {
      await expect(services.gamePlay.getUpcomingNightPlays(game)).resolves.toStrictEqual<GamePlay[]>(output);
    });
  });

  describe("removeObsoleteUpcomingPlays", () => {
    it("should return game as is when no game play needs to be removed.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer(),
      ];
      const upcomingPlays = [
        createFakeGamePlaySeerLooks(),
        createFakeGamePlayHunterShoots(),
        createFakeGamePlayWitchUsesPotions(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const game = createFakeGame({ players, upcomingPlays });

      await expect(services.gamePlay["removeObsoleteUpcomingPlays"](game)).resolves.toStrictEqual<Game>(game);
    });

    it("should remove some game plays when players became powerless or died.", async() => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer({ isAlive: false }),
      ];
      const upcomingPlays = [
        createFakeGamePlaySeerLooks(),
        createFakeGamePlayHunterShoots(),
        createFakeGamePlayWitchUsesPotions(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const game = createFakeGame({ players, upcomingPlays });
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [
          createFakeGamePlayHunterShoots(),
          createFakeGamePlayWerewolvesEat(),
        ],
      });

      await expect(services.gamePlay["removeObsoleteUpcomingPlays"](game)).resolves.toStrictEqual<Game>(expectedGame);
    });
  });

  describe("isUpcomingPlayNewForCurrentPhase", () => {
    it("should return false when gamePlay is in game's upcoming plays.", () => {
      const upcomingPlays = [
        createFakeGamePlaySeerLooks(),
        createFakeGamePlaySurvivorsElectSheriff(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const game = createFakeGame({ upcomingPlays });
      const upcomingPlay = createFakeGamePlaySurvivorsElectSheriff();

      expect(services.gamePlay["isUpcomingPlayNewForCurrentPhase"](upcomingPlay, game, [])).toBe(false);
    });

    it("should return false when upcomingPlay is game's current play.", () => {
      const game = createFakeGame({ currentPlay: createFakeGamePlaySurvivorsElectSheriff() });
      const upcomingPlay = createFakeGamePlaySurvivorsElectSheriff();

      expect(services.gamePlay["isUpcomingPlayNewForCurrentPhase"](upcomingPlay, game, [])).toBe(false);
    });

    it("should return false when upcomingPlay is already played in game history.", () => {
      const game = createFakeGame();
      const upcomingPlay = createFakeGamePlaySurvivorsElectSheriff();
      const allVoteGamePlay = createFakeGamePlaySurvivorsVote();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordPlay({
            action: allVoteGamePlay.action,
            source: createFakeGameHistoryRecordPlaySource({ name: allVoteGamePlay.source.name }),
            cause: allVoteGamePlay.cause,
          }),
        }),
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordPlay({
            action: upcomingPlay.action,
            source: createFakeGameHistoryRecordPlaySource({ name: upcomingPlay.source.name }),
            cause: upcomingPlay.cause,
          }),
        }),
      ];

      expect(services.gamePlay["isUpcomingPlayNewForCurrentPhase"](upcomingPlay, game, gameHistoryRecords)).toBe(false);
    });

    it("should return true when upcoming play is nor the current game play, nor already played nor in game's upcoming plays.", () => {
      const game = createFakeGame();
      const upcomingPlay = createFakeGamePlaySurvivorsElectSheriff();
      const allVoteGamePlay = createFakeGamePlaySurvivorsVote();
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordPlay({
            action: allVoteGamePlay.action,
            source: createFakeGameHistoryRecordPlaySource({ name: allVoteGamePlay.source.name }),
            cause: allVoteGamePlay.cause,
          }),
        }),
      ];

      expect(services.gamePlay["isUpcomingPlayNewForCurrentPhase"](upcomingPlay, game, gameHistoryRecords)).toBe(true);
    });
  });

  describe("getNewUpcomingPlaysForCurrentPhase", () => {
    beforeEach(() => {
      mocks.gamePlayService.getUpcomingDayPlays = jest.spyOn(services.gamePlay as unknown as { getUpcomingDayPlays }, "getUpcomingDayPlays").mockReturnValue([]);
      mocks.gamePlayService.getUpcomingNightPlays = jest.spyOn(services.gamePlay as unknown as { getUpcomingNightPlays }, "getUpcomingNightPlays").mockResolvedValue([]);
      mocks.gamePlayService.isUpcomingPlayNewForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isUpcomingPlayNewForCurrentPhase }, "isUpcomingPlayNewForCurrentPhase");
    });

    it("should call getUpcomingNightPlays method with night phase when game phase is night.", async() => {
      const game = createFakeGame({ phase: GamePhases.NIGHT });
      await services.gamePlay["getNewUpcomingPlaysForCurrentPhase"](game);

      expect(mocks.gamePlayService.getUpcomingNightPlays).toHaveBeenCalledExactlyOnceWith(game);
      expect(mocks.gameHistoryRecordService.getGameHistoryPhaseRecords).toHaveBeenCalledExactlyOnceWith(game._id, game.turn, GamePhases.NIGHT);
    });

    it("should call getUpcomingNightPlays method with day phase when game phase is day.", async() => {
      const game = createFakeGame({ phase: GamePhases.DAY });
      await services.gamePlay["getNewUpcomingPlaysForCurrentPhase"](game);

      expect(mocks.gamePlayService.getUpcomingDayPlays).toHaveBeenCalledExactlyOnceWith(game);
      expect(mocks.gameHistoryRecordService.getGameHistoryPhaseRecords).toHaveBeenCalledExactlyOnceWith(game._id, game.turn, GamePhases.DAY);
    });

    it("should call isUpcomingPlayNewForCurrentPhase method for as much times as there are upcoming phase plays when filtering them.", async() => {
      const game = createFakeGame({ phase: GamePhases.NIGHT });
      const upcomingPlays = [
        createFakeGamePlaySurvivorsElectSheriff(),
        createFakeGamePlaySeerLooks(),
        createFakeGamePlayWerewolvesEat(),
      ];
      mocks.gamePlayService.getUpcomingNightPlays.mockResolvedValue(upcomingPlays);
      await services.gamePlay["getNewUpcomingPlaysForCurrentPhase"](game);

      expect(mocks.gamePlayService.isUpcomingPlayNewForCurrentPhase).toHaveBeenNthCalledWith(1, upcomingPlays[0], game, []);
      expect(mocks.gamePlayService.isUpcomingPlayNewForCurrentPhase).toHaveBeenNthCalledWith(2, upcomingPlays[1], game, []);
      expect(mocks.gamePlayService.isUpcomingPlayNewForCurrentPhase).toHaveBeenNthCalledWith(3, upcomingPlays[2], game, []);
    });
  });

  describe("validateUpcomingPlaysPriority", () => {
    it("should do nothing when all game plays have a priority.", () => {
      const upcomingPlays = [
        createFakeGamePlaySurvivorsElectSheriff(),
        createFakeGamePlayHunterShoots(),
        createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
      ];

      expect(() => services.gamePlay["validateUpcomingPlaysPriority"](upcomingPlays)).not.toThrow();
    });

    it("should throw an error when the first upcoming play doesn't have a priority.", () => {
      const upcomingPlays = [
        createFakeGamePlayWitchUsesPotions({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
        createFakeGamePlayHunterShoots(),
        createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
      ];

      expect(() => services.gamePlay["validateUpcomingPlaysPriority"](upcomingPlays)).toThrow(undefined);
      expect(mocks.unexpectedExceptionFactory.createNoGamePlayPriorityUnexpectedException).toHaveBeenCalledExactlyOnceWith("validateUpcomingPlaysPriority", upcomingPlays[0]);
    });
  });

  describe("sortUpcomingPlaysByPriority", () => {
    it("should return empty array when upcoming plays are empty.", () => {
      expect(services.gamePlay["sortUpcomingPlaysByPriority"]([])).toStrictEqual<GamePlay[]>([]);
    });

    it("should return upcoming plays sorted by priority when called with defined actions in priority list.", () => {
      const upcomingPlaysToSort = [
        createFakeGamePlaySurvivorsVote(),
        createFakeGamePlaySurvivorsElectSheriff(),
        createFakeGamePlayBigBadWolfEats(),
        createFakeGamePlayWerewolvesEat(),
        createFakeGamePlaySeerLooks(),
        createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.STUTTERING_JUDGE_REQUEST }),
        createFakeGamePlayWitchUsesPotions(),
        createFakeGamePlayHunterShoots(),
        createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
      ];
      const expectedUpcomingPlays = [
        createFakeGamePlayHunterShoots(),
        createFakeGamePlaySurvivorsElectSheriff(),
        createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
        createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.STUTTERING_JUDGE_REQUEST }),
        createFakeGamePlaySurvivorsVote(),
        createFakeGamePlaySeerLooks(),
        createFakeGamePlayWerewolvesEat(),
        createFakeGamePlayBigBadWolfEats(),
        createFakeGamePlayWitchUsesPotions(),
      ];

      expect(services.gamePlay["sortUpcomingPlaysByPriority"](upcomingPlaysToSort)).toStrictEqual<GamePlay[]>(expectedUpcomingPlays);
    });
  });

  describe("isSheriffElectionTime", () => {
    it.each<{
      test: string;
      sheriffGameOptions: SheriffGameOptions;
      turn: number;
      phase: GamePhases;
      expected: boolean;
    }>([
      {
        test: "should return false when sheriff is not enabled even if it's the time.",
        sheriffGameOptions: createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GamePhases.NIGHT }, isEnabled: false, hasDoubledVote: false }),
        turn: 1,
        phase: GamePhases.NIGHT,
        expected: false,
      },
      {
        test: "should return false when it's not the right turn.",
        sheriffGameOptions: createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GamePhases.NIGHT }, isEnabled: true, hasDoubledVote: false }),
        turn: 2,
        phase: GamePhases.NIGHT,
        expected: false,
      },
      {
        test: "should return false when it's not the right phase.",
        sheriffGameOptions: createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GamePhases.DAY }, isEnabled: true, hasDoubledVote: false }),
        turn: 1,
        phase: GamePhases.NIGHT,
        expected: false,
      },
      {
        test: "should return true when it's the right phase and turn.",
        sheriffGameOptions: createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GamePhases.NIGHT }, isEnabled: true, hasDoubledVote: false }),
        turn: 1,
        phase: GamePhases.NIGHT,
        expected: true,
      },
    ])("$test", ({ sheriffGameOptions, turn, phase, expected }) => {
      expect(services.gamePlay["isSheriffElectionTime"](sheriffGameOptions, turn, phase)).toBe(expected);
    });
  });

  describe("isLoversGamePlaySuitableForCurrentPhase", () => {
    it.each<{
      test: string;
      game: CreateGameDto | Game;
      hasGamePlayBeenMade: boolean;
      expected: boolean;
    }>([
      {
        test: "should return false when game is dto.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WHITE_WEREWOLF } }),
          ],
        }),
        hasGamePlayBeenMade: false,
        expected: false,
      },
      {
        test: "should return false when there no lovers in the game.",
        game: createFakeGame({
          players: [
            createFakeWhiteWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeCupidAlivePlayer(),
          ],
        }),
        hasGamePlayBeenMade: true,
        expected: false,
      },
      {
        test: "should return false when only one lover is alive.",
        game: createFakeGame({
          players: [
            createFakeWhiteWerewolfAlivePlayer({ isAlive: false, attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
            createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeCupidAlivePlayer(),
          ],
        }),
        hasGamePlayBeenMade: false,
        expected: false,
      },
      {
        test: "should return false when both lovers are alive but game play has been made already.",
        game: createFakeGame({
          players: [
            createFakeWhiteWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
            createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeCupidAlivePlayer(),
          ],
        }),
        hasGamePlayBeenMade: true,
        expected: false,
      },
      {
        test: "should return true when both lovers are alive and game play has not been made already.",
        game: createFakeGame({
          players: [
            createFakeWhiteWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
            createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeCupidAlivePlayer(),
          ],
        }),
        hasGamePlayBeenMade: false,
        expected: true,
      },
    ])("$test", async({ game, hasGamePlayBeenMade, expected }) => {
      const gamePlay = createFakeGamePlayLoversMeetEachOther();
      mocks.gameHistoryRecordService.hasGamePlayBeenMade.mockResolvedValue(hasGamePlayBeenMade);

      await expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](game, gamePlay)).resolves.toBe(expected);
    });
  });

  describe("isSurvivorsGamePlaySuitableForCurrentPhase", () => {
    it.each<{
      test: string;
      game: CreateGameDto | Game;
      gamePlay: GamePlay;
      hasGamePlayBeenMade: boolean;
      expected: boolean;
    }>([
      {
        test: "should return true when game play's action is ELECT_SHERIFF.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WHITE_WEREWOLF } }),
          ],
        }),
        gamePlay: createFakeGamePlaySurvivorsElectSheriff(),
        hasGamePlayBeenMade: false,
        expected: true,
      },
      {
        test: "should return true when game play's action is VOTE but reason is not angel presence.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WHITE_WEREWOLF } }),
          ],
        }),
        gamePlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
        hasGamePlayBeenMade: false,
        expected: true,
      },
      {
        test: "should return false when there is no angel in the game dto.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WHITE_WEREWOLF } }),
          ],
        }),
        gamePlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE }),
        hasGamePlayBeenMade: false,
        expected: false,
      },
      {
        test: "should return true when there is angel in the game dto.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.ANGEL } }),
          ],
        }),
        gamePlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE }),
        hasGamePlayBeenMade: false,
        expected: true,
      },
      {
        test: "should return false when there is no angel in the game.",
        game: createFakeGame({
          players: [
            createFakeWhiteWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeVillagerAlivePlayer(),
          ],
        }),
        gamePlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE }),
        hasGamePlayBeenMade: false,
        expected: false,
      },
      {
        test: "should return false when there is angel in the game but he is dead.",
        game: createFakeGame({
          players: [
            createFakeWhiteWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeAngelAlivePlayer({ isAlive: false }),
          ],
        }),
        gamePlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE }),
        hasGamePlayBeenMade: true,
        expected: false,
      },
      {
        test: "should return false when there is angel in the game but he is powerless.",
        game: createFakeGame({
          players: [
            createFakeWhiteWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeAngelAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
          ],
        }),
        gamePlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE }),
        hasGamePlayBeenMade: true,
        expected: false,
      },
      {
        test: "should return false when there is angel in the game alive and powerful but the game play has been made already.",
        game: createFakeGame({
          players: [
            createFakeWhiteWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
        }),
        gamePlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE }),
        hasGamePlayBeenMade: true,
        expected: false,
      },
      {
        test: "should return true when there is angel in the game alive and powerful.",
        game: createFakeGame({
          players: [
            createFakeWhiteWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
        }),
        gamePlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE }),
        hasGamePlayBeenMade: false,
        expected: true,
      },
    ])("$test", async({ game, gamePlay, hasGamePlayBeenMade, expected }) => {
      mocks.gameHistoryRecordService.hasGamePlayBeenMade.mockResolvedValue(hasGamePlayBeenMade);

      await expect(services.gamePlay["isSurvivorsGamePlaySuitableForCurrentPhase"](game, gamePlay)).resolves.toBe(expected);
    });
  });

  describe("isGroupGamePlaySuitableForCurrentPhase", () => {
    beforeEach(() => {
      mocks.gamePlayService.isSurvivorsGamePlaySuitableForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isSurvivorsGamePlaySuitableForCurrentPhase }, "isSurvivorsGamePlaySuitableForCurrentPhase").mockImplementation();
      mocks.gamePlayService.isLoversGamePlaySuitableForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isLoversGamePlaySuitableForCurrentPhase }, "isLoversGamePlaySuitableForCurrentPhase").mockImplementation();
      mocks.gamePlayService.isPiedPiperGamePlaySuitableForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isPiedPiperGamePlaySuitableForCurrentPhase }, "isPiedPiperGamePlaySuitableForCurrentPhase").mockImplementation();
    });

    it("should call survivors playable methods when game plays source group is survivors.", async() => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlaySurvivorsVote();
      await services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(mocks.gamePlayService.isSurvivorsGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call lovers playable method when game plays source group is lovers.", async() => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlayLoversMeetEachOther();
      await services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(mocks.gamePlayService.isLoversGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call charmed playable method when game plays source group is charmed people.", async() => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlayCharmedMeetEachOther();
      await services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(mocks.gamePlayService.isPiedPiperGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it.each<{
      test: string;
      game: CreateGameDto | Game;
      gamePlay: GamePlay;
      expected: boolean;
    }>([
      {
        test: "should return false when game plays source group is villagers.",
        game: createFakeCreateGameDto(),
        gamePlay: createFakeGamePlay({ source: createFakeGamePlaySource({ name: RoleSides.VILLAGERS as unknown as GamePlaySourceName }) }),
        expected: false,
      },
      {
        test: "should return true when game plays source group is werewolves and game is dto. ",
        game: createFakeCreateGameDto(),
        gamePlay: createFakeGamePlayWerewolvesEat(),
        expected: true,
      },
      {
        test: "should return false when game plays source group is werewolves and all are dead.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ isAlive: false }),
            createFakeBigBadWolfAlivePlayer({ isAlive: false }),
            createFakeWitchAlivePlayer(),
            createFakeWildChildAlivePlayer(),
          ],
        }),
        gamePlay: createFakeGamePlayWerewolvesEat(),
        expected: false,
      },
      {
        test: "should return true when game plays source group is werewolves and at least one is alive and powerful.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer({ isAlive: false }),
            createFakeBigBadWolfAlivePlayer(),
            createFakeWitchAlivePlayer(),
            createFakeWildChildAlivePlayer(),
          ],
        }),
        gamePlay: createFakeGamePlayWerewolvesEat(),
        expected: true,
      },
    ])("$test", async({ game, gamePlay, expected }) => {
      await expect(services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](game, gamePlay)).resolves.toBe(expected);
    });
  });

  describe("isOneNightOnlyGamePlaySuitableForCurrentPhase", () => {
    it.each<{
      test: string;
      game: CreateGameDto | Game;
      gamePlay: GamePlay;
      hasGamePlayBeenMade: boolean;
      expected: boolean;
    }>([
      {
        test: "should return false when game is dto and player is not among game players.",
        game: createFakeCreateGameDto({ players: [createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } })] }),
        gamePlay: createFakeGamePlayCupidCharms(),
        hasGamePlayBeenMade: false,
        expected: false,
      },
      {
        test: "should return true when game is dto and player is among players",
        game: createFakeCreateGameDto({ players: [createFakeCreateGamePlayerDto({ role: { name: RoleNames.CUPID } })] }),
        gamePlay: createFakeGamePlayCupidCharms(),
        hasGamePlayBeenMade: true,
        expected: true,
      },
      {
        test: "should return false when player is not in the game.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
          ],
        }),
        gamePlay: createFakeGamePlayCupidCharms(),
        hasGamePlayBeenMade: false,
        expected: false,
      },
      {
        test: "should return false when player is in the game but dead.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeCupidAlivePlayer({ isAlive: false }),
          ],
        }),
        gamePlay: createFakeGamePlayCupidCharms(),
        hasGamePlayBeenMade: true,
        expected: false,
      },
      {
        test: "should return false when player is in the game but powerless.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeCupidAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
          ],
        }),
        gamePlay: createFakeGamePlayCupidCharms(),
        hasGamePlayBeenMade: false,
        expected: false,
      },
      {
        test: "should return false when game play has been made already.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeCupidAlivePlayer(),
          ],
        }),
        gamePlay: createFakeGamePlayCupidCharms(),
        hasGamePlayBeenMade: true,
        expected: false,
      },
      {
        test: "should return true when game play has not been made already.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeCupidAlivePlayer(),
          ],
        }),
        gamePlay: createFakeGamePlayCupidCharms(),
        hasGamePlayBeenMade: false,
        expected: true,
      },
    ])(`$test`, async({ game, gamePlay, hasGamePlayBeenMade, expected }) => {
      mocks.gameHistoryRecordService.hasGamePlayBeenMade.mockResolvedValue(hasGamePlayBeenMade);

      await expect(services.gamePlay["isOneNightOnlyGamePlaySuitableForCurrentPhase"](game, gamePlay)).resolves.toBe(expected);
    });
  });

  describe("isActorGamePlaySuitableForCurrentPhase", () => {
    it.each<{
      test: string;
      game: CreateGameDto | Game;
      expected: boolean;
    }>([
      {
        test: "should return true when actor is in the game dto.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.ACTOR } }),
          ],
        }),
        expected: true,
      },
      {
        test: "should return false when actor is not in the game dto.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when actor is not in the game.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
          additionalCards: [
            createFakeGameAdditionalCard({ roleName: RoleNames.WITCH, recipient: RoleNames.ACTOR, isUsed: false }),
            createFakeGameAdditionalCard({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR, isUsed: false }),
            createFakeGameAdditionalCard({ roleName: RoleNames.SEER, recipient: RoleNames.ACTOR, isUsed: false }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when actor is in the game but dead.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeActorAlivePlayer({ isAlive: false }),
            createFakeAngelAlivePlayer(),
          ],
          additionalCards: [
            createFakeGameAdditionalCard({ roleName: RoleNames.WITCH, recipient: RoleNames.ACTOR, isUsed: false }),
            createFakeGameAdditionalCard({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR, isUsed: false }),
            createFakeGameAdditionalCard({ roleName: RoleNames.SEER, recipient: RoleNames.ACTOR, isUsed: false }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when actor is in the game but powerless.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeActorAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
            createFakeAngelAlivePlayer(),
          ],
          additionalCards: [
            createFakeGameAdditionalCard({ roleName: RoleNames.WITCH, recipient: RoleNames.ACTOR, isUsed: false }),
            createFakeGameAdditionalCard({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR, isUsed: false }),
            createFakeGameAdditionalCard({ roleName: RoleNames.SEER, recipient: RoleNames.ACTOR, isUsed: false }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when all actor cards are used.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeActorAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
          additionalCards: [
            createFakeGameAdditionalCard({ roleName: RoleNames.WITCH, recipient: RoleNames.ACTOR, isUsed: true }),
            createFakeGameAdditionalCard({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR, isUsed: true }),
            createFakeGameAdditionalCard({ roleName: RoleNames.SEER, recipient: RoleNames.THIEF, isUsed: false }),
            createFakeGameAdditionalCard({ roleName: RoleNames.SEER, recipient: RoleNames.ACTOR, isUsed: true }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when game doesn't have any cards.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeActorAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
        }),
        expected: false,
      },
      {
        test: "should return true when actor can play.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeActorAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
          additionalCards: [
            createFakeGameAdditionalCard({ roleName: RoleNames.WITCH, recipient: RoleNames.ACTOR, isUsed: true }),
            createFakeGameAdditionalCard({ roleName: RoleNames.VILLAGER, recipient: RoleNames.ACTOR, isUsed: false }),
            createFakeGameAdditionalCard({ roleName: RoleNames.SEER, recipient: RoleNames.THIEF, isUsed: false }),
            createFakeGameAdditionalCard({ roleName: RoleNames.SEER, recipient: RoleNames.ACTOR, isUsed: true }),
          ],
        }),
        expected: true,
      },
    ])("$test", ({ game, expected }) => {
      expect(services.gamePlay["isActorGamePlaySuitableForCurrentPhase"](game)).toBe(expected);
    });
  });

  describe("isWitchGamePlaySuitableForCurrentPhase", () => {
    it.each<{
      test: string;
      game: CreateGameDto | Game;
      getGameHistoryWitchUsesSpecificPotionRecordsResolvedValue: GameHistoryRecord[];
      expected: boolean;
    }>([
      {
        test: "should return true when witch is in the game dto.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WHITE_WEREWOLF } }),
          ],
        }),
        getGameHistoryWitchUsesSpecificPotionRecordsResolvedValue: [],
        expected: true,
      },
      {
        test: "should return false when witch is not in the game dto.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
          ],
        }),
        getGameHistoryWitchUsesSpecificPotionRecordsResolvedValue: [],
        expected: false,
      },
      {
        test: "should return false when witch is not in the game.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
        }),
        getGameHistoryWitchUsesSpecificPotionRecordsResolvedValue: [],
        expected: false,
      },
      {
        test: "should return false when witch is in the game but dead.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeWitchAlivePlayer({ isAlive: false }),
            createFakeAngelAlivePlayer(),
          ],
        }),
        getGameHistoryWitchUsesSpecificPotionRecordsResolvedValue: [],
        expected: false,
      },
      {
        test: "should return false when witch is in the game but powerless.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeWitchAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
            createFakeAngelAlivePlayer(),
          ],
        }),
        getGameHistoryWitchUsesSpecificPotionRecordsResolvedValue: [],
        expected: false,
      },
      {
        test: "should return false when witch is in the game but options specify that her turn must be skipped if no more potions.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeWitchAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: true }) }),
        }),
        getGameHistoryWitchUsesSpecificPotionRecordsResolvedValue: [createFakeGameHistoryRecord()],
        expected: false,
      },
      {
        test: "should return true when witch is in the game but options specify that her turn must not be skipped even with no more potions.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeWitchAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false }) }),
        }),
        getGameHistoryWitchUsesSpecificPotionRecordsResolvedValue: [createFakeGameHistoryRecord()],
        expected: true,
      },
    ])("$test", async({ game, getGameHistoryWitchUsesSpecificPotionRecordsResolvedValue, expected }) => {
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValue(getGameHistoryWitchUsesSpecificPotionRecordsResolvedValue);

      await expect(services.gamePlay["isWitchGamePlaySuitableForCurrentPhase"](game)).resolves.toBe(expected);
    });

    it("should return true when witch is in the game but options specify that her turn must be skipped with no more potions but has still death potion.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: true }) });
      const game = createFakeGame({ players, options });
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockResolvedValue([]);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue([createFakeGameHistoryRecord()]);

      await expect(services.gamePlay["isWitchGamePlaySuitableForCurrentPhase"](game)).resolves.toBe(true);
    });

    it("should return true when witch is in the game but options specify that her turn must be skipped with no more potions but has still life potion.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: true }) });
      const game = createFakeGame({ players, options });
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockResolvedValue([createFakeGameHistoryRecord()]);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue([]);

      await expect(services.gamePlay["isWitchGamePlaySuitableForCurrentPhase"](game)).resolves.toBe(true);
    });
  });

  describe("shouldBeCalledOnCurrentTurnInterval", () => {
    it.each<{
      test: string;
      wakingUpInterval: number;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return true when waking up interval is 1 and it's the first turn.",
        game: createFakeGame({ turn: 1 }),
        wakingUpInterval: 1,
        expected: true,
      },
      {
        test: "should return true when waking up interval is 2 and it's the first turn.",
        game: createFakeGame({ turn: 1 }),
        wakingUpInterval: 2,
        expected: true,
      },
      {
        test: "should return true when when waking up interval is 1 and it's the second turn.",
        game: createFakeGame({ turn: 2 }),
        wakingUpInterval: 1,
        expected: true,
      },
      {
        test: "should return false when waking up interval is 2 and it's the second turn.",
        game: createFakeGame({ turn: 2 }),
        wakingUpInterval: 2,
        expected: false,
      },
      {
        test: "should return true when waking up interval is 1 and it's the third turn.",
        game: createFakeGame({ turn: 3 }),
        wakingUpInterval: 1,
        expected: true,
      },
      {
        test: "should return true when waking up interval is 2 and it's the third turn.",
        game: createFakeGame({ turn: 3 }),
        wakingUpInterval: 2,
        expected: true,
      },
    ])("$test", ({ wakingUpInterval, game, expected }) => {
      expect(services.gamePlay["shouldBeCalledOnCurrentTurnInterval"](wakingUpInterval, game)).toBe(expected);
    });
  });

  describe("isWhiteWerewolfGamePlaySuitableForCurrentPhase", () => {
    it("should return false when white werewolf is not in the game dto.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
      ];
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return false when white werewolf is in the game dto but options specify that he's never called.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WHITE_WEREWOLF } }),
      ];
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ whiteWerewolf: { wakingUpInterval: 0 } }) });
      const gameDto = createFakeCreateGameDto({ players, options });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return true when white werewolf is in the game dto and options specify that he's called every other night.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WHITE_WEREWOLF } }),
      ];
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ whiteWerewolf: { wakingUpInterval: 2 } }) });
      const gameDto = createFakeCreateGameDto({ players, options });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(true);
    });

    it("should return false when white werewolf is not in the game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ];
      const game = createFakeGame({ players, turn: 1 });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when white werewolf is in the game but options specify that he's never called.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, whiteWerewolf: { wakingUpInterval: 0 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when white werewolf is in the game but dead.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, whiteWerewolf: { wakingUpInterval: 1 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when white werewolf is in the game but powerless.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, whiteWerewolf: { wakingUpInterval: 1 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when white werewolf is in the game, alive, powerful, has no targets and options say skip if no targets.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: true, whiteWerewolf: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      mocks.gameHelper.getLeftToEatByWhiteWerewolfPlayers.mockReturnValue([]);

      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when white werewolf is in the game, alive and powerful but game's turn is not aligned with his waking up interval.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, whiteWerewolf: { wakingUpInterval: 4 } }) });
      const game = createFakeGame({ players, turn: 3, options });

      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return true when white werewolf is in the game, alive and powerful.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, whiteWerewolf: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });

    it("should return true when white werewolf is in the game, alive, powerful, has targets and options say skip if no targets.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: true, whiteWerewolf: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      mocks.gameHelper.getLeftToEatByWhiteWerewolfPlayers.mockReturnValue([players[3]]);

      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });
  });

  describe("isPiedPiperGamePlaySuitableForCurrentPhase", () => {
    it.each<{
      test: string;
      game: CreateGameDto | Game;
      expected: boolean;
    }>([
      {
        test: "should return false when pied piper is not in the game dto.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return true when pied piper is in the game dto.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.PIED_PIPER } }),
          ],
        }),
        expected: true,
      },
      {
        test: "should return false when pied piper is not in the game.",
        game: createFakeGame({
          players: [
            createFakeWhiteWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when pied piper is in the game but is dead.",
        game: createFakeGame({
          players: [
            createFakeWhiteWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakePiedPiperAlivePlayer({ isAlive: false }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return true when pied piper is in the game and is alive and powerful.",
        game: createFakeGame({
          players: [
            createFakeWhiteWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakePiedPiperAlivePlayer(),
          ],
        }),
        expected: true,
      },
    ])("$test", ({ game, expected }) => {
      expect(services.gamePlay["isPiedPiperGamePlaySuitableForCurrentPhase"](game)).toBe(expected);
    });
  });

  describe("isBigBadWolfGamePlaySuitableForCurrentPhase", () => {
    it("should return false when big bad wolf is not in the game dto.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
      ];
      const gameDto = createFakeCreateGameDto({ players });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[0]]);

      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return true when big bad wolf is in the game dto.", () => {
      const players = [
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
        createFakeCreateGamePlayerDto({ role: { name: RoleNames.BIG_BAD_WOLF } }),
      ];
      const gameDto = createFakeCreateGameDto({ players });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[0]]);

      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(true);
    });

    it("should return false when big bad wolf is not in the game.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[0]]);
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when big bad wolf is in the game but dead.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeBigBadWolfAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[0]]);
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when big bad wolf is in the game but he is powerless.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeBigBadWolfAlivePlayer({ attributes: [createFakePowerlessByWerewolvesPlayerAttribute()] }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, bigBadWolf: { isPowerlessIfWerewolfDies: true } }) });
      const game = createFakeGame({ players, options });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[0]]);
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when big bad wolf is in the game, all werewolves are alive and his turn is skipped if no targets.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: true, bigBadWolf: { isPowerlessIfWerewolfDies: true } }) });
      const game = createFakeGame({ players, options });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([]);

      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return true when big bad wolf is in the game, all werewolves are alive and his turn is skipped if no targets but there are targets.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: true, bigBadWolf: { isPowerlessIfWerewolfDies: true } }) });
      const game = createFakeGame({ players, options });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[1]]);

      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });

    it("should return true when big bad wolf is in the game and he is not powerless or dead.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, bigBadWolf: { isPowerlessIfWerewolfDies: true } }) });
      const game = createFakeGame({ players, options });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[0]]);
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });

    it("should return true when big bad wolf is in the game, alive and powerful and his turn is no skipped if no targets.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false }) });
      const game = createFakeGame({ players, options });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([]);

      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });
  });

  describe("isThreeBrothersGamePlaySuitableForCurrentPhase", () => {
    beforeEach(() => {
      mocks.gamePlayService.shouldBeCalledOnCurrentTurnInterval = jest.spyOn(services.gamePlay as unknown as { shouldBeCalledOnCurrentTurnInterval }, "shouldBeCalledOnCurrentTurnInterval").mockReturnValue(true);
    });

    it("should call shouldBeCalledOnCurrentTurnInterval method with three brothers waking up interval when called.", () => {
      const players = [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ];
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 789 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game);

      expect(mocks.gamePlayService.shouldBeCalledOnCurrentTurnInterval).toHaveBeenCalledExactlyOnceWith(789, game);
    });

    it.each<{
      test: string;
      game: CreateGameDto | Game;
      shouldBeCalledOnCurrentTurnIntervalMockReturnValue: boolean;
      expected: boolean;
    }>([
      {
        test: "should return false when three brothers are not in the game dto.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
          ],
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: false,
        expected: false,
      },
      {
        test: "should return false when three brothers are in the game dto but options specify that they are never called.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.THREE_BROTHERS } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.THREE_BROTHERS } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.THREE_BROTHERS } }),
          ],
          options: createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 0 } }) }),
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: false,
        expected: false,
      },
      {
        test: "should return true when three brothers are in the game dto and options specify that they are called every other night.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.THREE_BROTHERS } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.THREE_BROTHERS } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.THREE_BROTHERS } }),
          ],
          options: createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) }),
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: true,
        expected: true,
      },
      {
        test: "should return false when three brothers are not in the game.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: false,
        expected: false,
      },
      {
        test: "should return false when three brothers is in the game but options specify that they are never called.",
        game: createFakeGame({
          players: [
            createFakeThreeBrothersAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeThreeBrothersAlivePlayer(),
            createFakeThreeBrothersAlivePlayer(),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 0 } }) }),
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: false,
        expected: false,
      },
      {
        test: "should return true when three brothers are alive.",
        game: createFakeGame({
          players: [
            createFakeThreeBrothersAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeThreeBrothersAlivePlayer(),
            createFakeThreeBrothersAlivePlayer(),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) }),
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: true,
        expected: true,
      },
      {
        test: "should return false when three brothers are not in the game.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: false,
        expected: false,
      },
      {
        test: "should return true when two brothers are alive.",
        game: createFakeGame({
          players: [
            createFakeThreeBrothersAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeThreeBrothersAlivePlayer(),
            createFakeThreeBrothersAlivePlayer({ isAlive: false }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) }),
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: true,
        expected: true,
      },
      {
        test: "should return false when only one brothers is alive.",
        game: createFakeGame({
          players: [
            createFakeThreeBrothersAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeThreeBrothersAlivePlayer({ isAlive: false }),
            createFakeThreeBrothersAlivePlayer({ isAlive: false }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) }),
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: true,
        expected: false,
      },
      {
        test: "should return false when all brothers are dead.",
        game: createFakeGame({
          players: [
            createFakeThreeBrothersAlivePlayer({ isAlive: false }),
            createFakeSeerAlivePlayer(),
            createFakeThreeBrothersAlivePlayer({ isAlive: false }),
            createFakeThreeBrothersAlivePlayer({ isAlive: false }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) }),
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: true,
        expected: false,
      },
    ])("$test", ({ game, shouldBeCalledOnCurrentTurnIntervalMockReturnValue, expected }) => {
      mocks.gamePlayService.shouldBeCalledOnCurrentTurnInterval.mockReturnValue(shouldBeCalledOnCurrentTurnIntervalMockReturnValue);

      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game)).toBe(expected);
    });
  });

  describe("isTwoSistersGamePlaySuitableForCurrentPhase", () => {
    beforeEach(() => {
      mocks.gamePlayService.shouldBeCalledOnCurrentTurnInterval = jest.spyOn(services.gamePlay as unknown as { shouldBeCalledOnCurrentTurnInterval }, "shouldBeCalledOnCurrentTurnInterval").mockReturnValue(true);
    });

    it.each<{
      test: string;
      game: CreateGameDto | Game;
      shouldBeCalledOnCurrentTurnIntervalMockReturnValue: boolean;
      expected: boolean;
    }>([
      {
        test: "should return false when two sisters are not in the game dto.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
          ],
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: false,
        expected: false,
      },
      {
        test: "should return false when two sisters are in the game dto but options specify that they are never called.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.TWO_SISTERS } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.TWO_SISTERS } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.ELDER } }),
          ],
          options: createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 0 } }) }),
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: false,
        expected: false,
      },
      {
        test: "should return true when two sisters are in the game dto and options specify that they are called every other night.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.TWO_SISTERS } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.TWO_SISTERS } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.ELDER } }),
          ],
          options: createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 2 } }) }),
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: true,
        expected: true,
      },
      {
        test: "should return false when two sisters are not in the game.",
        game: createFakeGame({
          players: [
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAccursedWolfFatherAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: true,
        expected: false,
      },
      {
        test: "should return false when two sisters is in the game but options specify that they are never called.",
        game: createFakeGame({
          players: [
            createFakeTwoSistersAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeTwoSistersAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 0 } }) }),
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: false,
        expected: false,
      },
      {
        test: "should return true when two sisters are alive.",
        game: createFakeGame({
          players: [
            createFakeTwoSistersAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeTwoSistersAlivePlayer(),
            createFakeAngelAlivePlayer(),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 2 } }) }),
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: true,
        expected: true,
      },
      {
        test: "should return false when one sister is alive.",
        game: createFakeGame({
          players: [
            createFakeTwoSistersAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeAngelAlivePlayer({ isAlive: false }),
            createFakeTwoSistersAlivePlayer({ isAlive: false }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 2 } }) }),
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: true,
        expected: false,
      },
      {
        test: "should return false when all sisters are dead.",
        game: createFakeGame({
          players: [
            createFakeTwoSistersAlivePlayer({ isAlive: false }),
            createFakeSeerAlivePlayer(),
            createFakeAngelAlivePlayer({ isAlive: false }),
            createFakeTwoSistersAlivePlayer({ isAlive: false }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 2 } }) }),
        }),
        shouldBeCalledOnCurrentTurnIntervalMockReturnValue: true,
        expected: false,
      },
    ])("$test", ({ game, shouldBeCalledOnCurrentTurnIntervalMockReturnValue, expected }) => {
      mocks.gamePlayService.shouldBeCalledOnCurrentTurnInterval.mockReturnValue(shouldBeCalledOnCurrentTurnIntervalMockReturnValue);

      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](game)).toBe(expected);
    });
  });

  describe("isRoleGamePlaySuitableForCurrentPhase", () => {
    beforeEach(() => {
      mocks.gamePlayService.isTwoSistersGamePlaySuitableForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isTwoSistersGamePlaySuitableForCurrentPhase }, "isTwoSistersGamePlaySuitableForCurrentPhase").mockImplementation();
      mocks.gamePlayService.isThreeBrothersGamePlaySuitableForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isThreeBrothersGamePlaySuitableForCurrentPhase }, "isThreeBrothersGamePlaySuitableForCurrentPhase").mockImplementation();
      mocks.gamePlayService.isBigBadWolfGamePlaySuitableForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isBigBadWolfGamePlaySuitableForCurrentPhase }, "isBigBadWolfGamePlaySuitableForCurrentPhase").mockImplementation();
      mocks.gamePlayService.isPiedPiperGamePlaySuitableForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isPiedPiperGamePlaySuitableForCurrentPhase }, "isPiedPiperGamePlaySuitableForCurrentPhase").mockImplementation();
      mocks.gamePlayService.isWhiteWerewolfGamePlaySuitableForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isWhiteWerewolfGamePlaySuitableForCurrentPhase }, "isWhiteWerewolfGamePlaySuitableForCurrentPhase").mockImplementation();
      mocks.gamePlayService.isWitchGamePlaySuitableForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isWitchGamePlaySuitableForCurrentPhase }, "isWitchGamePlaySuitableForCurrentPhase").mockImplementation();
      mocks.gamePlayService.isActorGamePlaySuitableForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isActorGamePlaySuitableForCurrentPhase }, "isActorGamePlaySuitableForCurrentPhase").mockImplementation();
      mocks.gamePlayService.isOneNightOnlyGamePlaySuitableForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isOneNightOnlyGamePlaySuitableForCurrentPhase }, "isOneNightOnlyGamePlaySuitableForCurrentPhase").mockImplementation();
    });

    it("should call two sisters method when game play source role is two sisters.", async() => {
      const players = [
        createFakeTwoSistersAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayTwoSistersMeetEachOther();
      await services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(mocks.gamePlayService.isTwoSistersGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call three brothers method when game play source role is three brothers.", async() => {
      const players = [
        createFakeThreeBrothersAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayThreeBrothersMeetEachOther();
      await services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(mocks.gamePlayService.isThreeBrothersGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call big bad wolf method when game plays source role is big bad wolf.", async() => {
      const players = [
        createFakeTwoSistersAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayBigBadWolfEats();
      await services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(mocks.gamePlayService.isBigBadWolfGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call pied piper method when game plays source role is pied piper.", async() => {
      const players = [
        createFakeTwoSistersAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayPiedPiperCharms();
      await services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(mocks.gamePlayService.isPiedPiperGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call white werewolf method when game plays source role is white werewolf.", async() => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayWhiteWerewolfEats();
      await services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(mocks.gamePlayService.isWhiteWerewolfGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call witch method when game plays source role is witch.", async() => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayWitchUsesPotions();
      await services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(mocks.gamePlayService.isWitchGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call actor method when game plays source role is actor.", async() => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeActorAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayActorChoosesCard();
      await services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(mocks.gamePlayService.isActorGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call one night only method when game plays occurrence is one night only.", async() => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeCupidAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayCupidCharms();
      await services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(mocks.gamePlayService.isOneNightOnlyGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it.each<{
      test: string;
      game: CreateGameDto | Game;
      gamePlay: GamePlay;
      expected: boolean;
    }>([
      {
        test: "should return false when player is not in game.",
        game: createFakeGame({
          players: [
            createFakeTwoSistersAlivePlayer(),
            createFakeWitchAlivePlayer(),
            createFakeTwoSistersAlivePlayer(),
            createFakeWildChildAlivePlayer(),
          ],
        }),
        gamePlay: createFakeGamePlaySeerLooks(),
        expected: false,
      },
      {
        test: "should return true when game plays source role is hunter and player is dto.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.HUNTER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WHITE_WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER_VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.LITTLE_GIRL } }),
          ],
        }),
        gamePlay: createFakeGamePlayHunterShoots(),
        expected: true,
      },
      {
        test: "should return true when game plays source role is hunter and player is powerful.",
        game: createFakeGame({
          players: [
            createFakeHunterAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeTwoSistersAlivePlayer(),
            createFakeWildChildAlivePlayer(),
          ],
        }),
        gamePlay: createFakeGamePlayHunterShoots(),
        expected: true,
      },
      {
        test: "should return false when game plays source role is hunter and player is powerless.",
        game: createFakeGame({
          players: [
            createFakeHunterAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
            createFakeSeerAlivePlayer(),
            createFakeTwoSistersAlivePlayer(),
            createFakeWildChildAlivePlayer(),
          ],
        }),
        gamePlay: createFakeGamePlayHunterShoots(),
        expected: false,
      },
      {
        test: "should return true when game plays source role is scapegoat and player is dto.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SCAPEGOAT } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WHITE_WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.VILLAGER_VILLAGER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.LITTLE_GIRL } }),
          ],
        }),
        gamePlay: createFakeGamePlayScapegoatBansVoting(),
        expected: true,
      },
      {
        test: "should return true when game plays source role is scapegoat and player is powerful.",
        game: createFakeGame({
          players: [
            createFakeScapegoatAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeTwoSistersAlivePlayer(),
            createFakeWildChildAlivePlayer(),
          ],
        }),
        gamePlay: createFakeGamePlayScapegoatBansVoting(),
        expected: true,
      },
      {
        test: "should return false when game plays source role is scapegoat and player is powerless.",
        game: createFakeGame({
          players: [
            createFakeScapegoatAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
            createFakeSeerAlivePlayer(),
            createFakeTwoSistersAlivePlayer(),
            createFakeWildChildAlivePlayer(),
          ],
        }),
        gamePlay: createFakeGamePlayScapegoatBansVoting(),
        expected: false,
      },
      {
        test: "should return true when player is dto.",
        game: createFakeCreateGameDto({
          players: [
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.SEER } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } }),
            createFakeCreateGamePlayerDto({ role: { name: RoleNames.WEREWOLF } }),
          ],
        }),
        gamePlay: createFakeGamePlaySeerLooks(),
        expected: true,
      },
      {
        test: "should return false when player is dead.",
        game: createFakeGame({
          players: [
            createFakeTwoSistersAlivePlayer(),
            createFakeSeerAlivePlayer({ isAlive: false }),
            createFakeTwoSistersAlivePlayer(),
            createFakeWildChildAlivePlayer(),
          ],
        }),
        gamePlay: createFakeGamePlaySeerLooks(),
        expected: false,
      },
    ])("$test", async({ game, gamePlay, expected }) => {
      await expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).resolves.toBe(expected);
    });
  });

  describe("isSheriffGamePlaySuitableForCurrentPhase", () => {
    it.each<{
      test: string;
      game: CreateGameDto | Game;
      expected: boolean;
    }>([
      {
        test: "should return false when sheriff is not enabled.",
        game: createFakeCreateGameDto({ options: createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ isEnabled: false }) }) }) }),
        expected: false,
      },
      {
        test: "should return true when game is dto.",
        game: createFakeCreateGameDto({ options: createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ isEnabled: true }) }) }) }),
        expected: true,
      },
      {
        test: "should return false when sheriff is not in the game.",
        game: createFakeGame({
          players: [
            createFakeWhiteWerewolfAlivePlayer(),
            createFakeCupidAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ isEnabled: true }) }) }),
        }),
        expected: false,
      },
      {
        test: "should return true when sheriff is in the game.",
        game: createFakeGame({
          players: [
            createFakeWhiteWerewolfAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
            createFakeCupidAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ isEnabled: true }) }) }),
        }),
        expected: true,
      },
    ])("$test", ({ game, expected }) => {
      expect(services.gamePlay["isSheriffGamePlaySuitableForCurrentPhase"](game)).toBe(expected);
    });
  });

  describe("isGamePlaySuitableForCurrentPhase", () => {
    beforeEach(() => {
      mocks.gamePlayService.isSheriffGamePlaySuitableForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isSheriffGamePlaySuitableForCurrentPhase }, "isSheriffGamePlaySuitableForCurrentPhase").mockImplementation();
      mocks.gamePlayService.isRoleGamePlaySuitableForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isRoleGamePlaySuitableForCurrentPhase }, "isRoleGamePlaySuitableForCurrentPhase").mockImplementation();
      mocks.gamePlayService.isGroupGamePlaySuitableForCurrentPhase = jest.spyOn(services.gamePlay as unknown as { isGroupGamePlaySuitableForCurrentPhase }, "isGroupGamePlaySuitableForCurrentPhase").mockImplementation();
    });

    it("should call isRoleGamePlaySuitableForCurrentPhase when source is a sheriff.", async() => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlaySheriffDelegates();
      await services.gamePlay["isGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(mocks.gamePlayService.isSheriffGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call isRoleGamePlaySuitableForCurrentPhase when source is a role.", async() => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlaySeerLooks();
      await services.gamePlay["isGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(mocks.gamePlayService.isRoleGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call isGroupGamePlaySuitableForCurrentPhase when source is a group.", async() => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlaySurvivorsVote();
      await services.gamePlay["isGamePlaySuitableForCurrentPhase"](game, gamePlay);
      
      expect(mocks.gamePlayService.isGroupGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });
  });
});