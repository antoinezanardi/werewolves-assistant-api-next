import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { when } from "jest-when";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import { GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerGroups } from "@/modules/game/enums/player.enum";
import * as GameHelper from "@/modules/game/helpers/game.helper";
import * as PlayerHelper from "@/modules/game/helpers/player/player.helper";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlayService } from "@/modules/game/providers/services/game-play/game-play.service";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";

import { createFakeGameOptionsDto } from "@tests/factories/game/dto/create-game/create-game-options/create-game-options.dto.factory";
import { bulkCreateFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlaySource } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeRolesGameOptions, createFakeSheriffElectionGameOptions, createFakeSheriffGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";
import { createFakeGamePlay, createFakeGamePlayAllElectSheriff, createFakeGamePlayAllVote, createFakeGamePlayBigBadWolfEats, createFakeGamePlayCharmedMeetEachOther, createFakeGamePlayCupidCharms, createFakeGamePlayDogWolfChoosesSide, createFakeGamePlayFoxSniffs, createFakeGamePlayGuardProtects, createFakeGamePlayHunterShoots, createFakeGamePlayLoversMeetEachOther, createFakeGamePlayPiedPiperCharms, createFakeGamePlayRavenMarks, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySeerLooks, createFakeGamePlaySheriffDelegates, createFakeGamePlayStutteringJudgeChoosesSign, createFakeGamePlayThiefChoosesCard, createFakeGamePlayThreeBrothersMeetEachOther, createFakeGamePlayTwoSistersMeetEachOther, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWildChildChoosesModel, createFakeGamePlayWitchUsesPotions } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeInLoveByCupidPlayerAttribute, createFakePowerlessByAncientPlayerAttribute, createFakeSheriffByAllPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeAngelAlivePlayer, createFakeBigBadWolfAlivePlayer, createFakeCupidAlivePlayer, createFakeDogWolfAlivePlayer, createFakeFoxAlivePlayer, createFakeGuardAlivePlayer, createFakeHunterAlivePlayer, createFakePiedPiperAlivePlayer, createFakeRavenAlivePlayer, createFakeScapegoatAlivePlayer, createFakeSeerAlivePlayer, createFakeStutteringJudgeAlivePlayer, createFakeThiefAlivePlayer, createFakeThreeBrothersAlivePlayer, createFakeTwoSistersAlivePlayer, createFakeVileFatherOfWolvesAlivePlayer, createFakeVillagerAlivePlayer, createFakeVillagerVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Play Service", () => {
  let services: { gamePlay: GamePlayService };
  let mocks: {
    gameHistoryRecordService: {
      getGameHistoryWitchUsesSpecificPotionRecords: jest.SpyInstance;
      getGameHistoryPhaseRecords: jest.SpyInstance;
    };
    gameHelper: {
      getLeftToEatByWerewolvesPlayers: jest.SpyInstance;
      getLeftToEatByWhiteWerewolfPlayers: jest.SpyInstance;
      getExpectedPlayersToPlay: jest.SpyInstance;
    };
    unexpectedExceptionFactory: {
      createNoGamePlayPriorityUnexpectedException: jest.SpyInstance;
    };
  };

  beforeEach(async() => {
    mocks = {
      gameHistoryRecordService: {
        getGameHistoryWitchUsesSpecificPotionRecords: jest.fn().mockResolvedValue([]),
        getGameHistoryPhaseRecords: jest.fn().mockResolvedValue([]),
      },
      gameHelper: {
        getLeftToEatByWerewolvesPlayers: jest.spyOn(GameHelper, "getLeftToEatByWerewolvesPlayers").mockReturnValue([]),
        getLeftToEatByWhiteWerewolfPlayers: jest.spyOn(GameHelper, "getLeftToEatByWhiteWerewolfPlayers").mockReturnValue([]),
        getExpectedPlayersToPlay: jest.spyOn(GameHelper, "getExpectedPlayersToPlay").mockReturnValue([]),
      },
      unexpectedExceptionFactory: { createNoGamePlayPriorityUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoGamePlayPriorityUnexpectedException").mockImplementation() },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
    let localMocks: {
      gamePlayService: {
        removeObsoleteUpcomingPlays: jest.SpyInstance;
        getNewUpcomingPlaysForCurrentPhase: jest.SpyInstance;
        sortUpcomingPlaysByPriority: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayService: {
          removeObsoleteUpcomingPlays: jest.spyOn(services.gamePlay as unknown as { removeObsoleteUpcomingPlays }, "removeObsoleteUpcomingPlays").mockImplementation(),
          getNewUpcomingPlaysForCurrentPhase: jest.spyOn(services.gamePlay as unknown as { getNewUpcomingPlaysForCurrentPhase }, "getNewUpcomingPlaysForCurrentPhase").mockImplementation(),
          sortUpcomingPlaysByPriority: jest.spyOn(services.gamePlay as unknown as { sortUpcomingPlaysByPriority }, "sortUpcomingPlaysByPriority").mockImplementation(),
        },
      };
    });

    it("should call removeObsoleteUpcomingPlays when called.", async() => {
      const game = createFakeGame();
      localMocks.gamePlayService.removeObsoleteUpcomingPlays.mockResolvedValue(game);
      localMocks.gamePlayService.getNewUpcomingPlaysForCurrentPhase.mockReturnValue(game.upcomingPlays);
      localMocks.gamePlayService.sortUpcomingPlaysByPriority.mockReturnValue(game.upcomingPlays);
      await services.gamePlay.refreshUpcomingPlays(game);

      expect(localMocks.gamePlayService.removeObsoleteUpcomingPlays).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call getNewUpcomingPlaysForCurrentPhase when called.", async() => {
      const game = createFakeGame();
      localMocks.gamePlayService.removeObsoleteUpcomingPlays.mockResolvedValue(game);
      localMocks.gamePlayService.getNewUpcomingPlaysForCurrentPhase.mockReturnValue(game.upcomingPlays);
      localMocks.gamePlayService.sortUpcomingPlaysByPriority.mockReturnValue(game.upcomingPlays);
      await services.gamePlay.refreshUpcomingPlays(game);

      expect(localMocks.gamePlayService.getNewUpcomingPlaysForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call sortUpcomingPlaysByPriority when called.", async() => {
      const game = createFakeGame();
      localMocks.gamePlayService.removeObsoleteUpcomingPlays.mockResolvedValue(game);
      localMocks.gamePlayService.getNewUpcomingPlaysForCurrentPhase.mockReturnValue(game.upcomingPlays);
      localMocks.gamePlayService.sortUpcomingPlaysByPriority.mockReturnValue(game.upcomingPlays);
      await services.gamePlay.refreshUpcomingPlays(game);

      expect(localMocks.gamePlayService.sortUpcomingPlaysByPriority).toHaveBeenCalledExactlyOnceWith(game.upcomingPlays);
    });
  });

  describe("proceedToNextGamePlay", () => {
    it("should return game as is when there is no upcoming plays.", () => {
      const game = createFakeGame();

      expect(services.gamePlay.proceedToNextGamePlay(game)).toStrictEqual<Game>(game);
    });

    it("should make proceed to next game play when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeThiefAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const expectedPlayersToPlay = [players[1], players[3]];
      mocks.gameHelper.getExpectedPlayersToPlay.mockReturnValue(expectedPlayersToPlay);
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayAllVote()], currentPlay: createFakeGamePlayFoxSniffs() });
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [],
        currentPlay: createFakeGamePlay({
          ...game.upcomingPlays[0],
          source: createFakeGamePlaySource({ ...game.upcomingPlays[0].source, players: expectedPlayersToPlay }),
        }),
      });

      expect(services.gamePlay.proceedToNextGamePlay(game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("getUpcomingDayPlays", () => {
    it("should get regular upcoming day plays when called.", () => {
      const game = createFakeGame({ turn: 1, phase: GamePhases.DAY });

      expect(services.gamePlay.getUpcomingDayPlays(game)).toStrictEqual<GamePlay[]>([createFakeGamePlayAllVote()]);
    });

    it("should get upcoming day plays with sheriff election when it's sheriff election time.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ isEnabled: true, electedAt: createFakeSheriffElectionGameOptions({ phase: GamePhases.DAY, turn: 3 }) }) }) });
      const game = createFakeGame({ turn: 3, phase: GamePhases.DAY, options });
      const expectedUpcomingPlays = [
        createFakeGamePlayAllElectSheriff(),
        createFakeGamePlayAllVote(),
      ];

      expect(services.gamePlay.getUpcomingDayPlays(game)).toStrictEqual<GamePlay[]>(expectedUpcomingPlays);
    });
  });

  describe("getUpcomingNightPlays", () => {
    it.each<{ game: Game; output: GamePlay[]; test: string }>([
      {
        test: "it's the first night with official rules and some roles",
        game: createFakeGame({
          turn: 1,
          phase: GamePhases.NIGHT,
          players: bulkCreateFakePlayers(4, [
            createFakeVillagerAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
          ]),
          options: DEFAULT_GAME_OPTIONS,
        }),
        output: [
          createFakeGamePlayAllElectSheriff(),
          createFakeGamePlaySeerLooks(),
          createFakeGamePlayWerewolvesEat(),
        ],
      },
      {
        test: "it's the first night with official rules and all roles who act during the night",
        game: createFakeGame({
          turn: 1,
          phase: GamePhases.NIGHT,
          players: bulkCreateFakePlayers(22, [
            createFakeVillagerAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeWhiteWerewolfAlivePlayer(),
            createFakeAngelAlivePlayer(),
            createFakeThiefAlivePlayer(),
            createFakeDogWolfAlivePlayer(),
            createFakeCupidAlivePlayer(),
            createFakeFoxAlivePlayer(),
            createFakeStutteringJudgeAlivePlayer(),
            createFakeTwoSistersAlivePlayer(),
            createFakeTwoSistersAlivePlayer(),
            createFakeThreeBrothersAlivePlayer(),
            createFakeThreeBrothersAlivePlayer(),
            createFakeThreeBrothersAlivePlayer(),
            createFakeWildChildAlivePlayer(),
            createFakeRavenAlivePlayer(),
            createFakeGuardAlivePlayer(),
            createFakeBigBadWolfAlivePlayer(),
            createFakeWitchAlivePlayer(),
            createFakePiedPiperAlivePlayer(),
          ]),
          options: DEFAULT_GAME_OPTIONS,
        }),
        output: [
          createFakeGamePlayAllElectSheriff(),
          createFakeGamePlayAllVote({ cause: GamePlayCauses.ANGEL_PRESENCE }),
          createFakeGamePlayThiefChoosesCard(),
          createFakeGamePlayDogWolfChoosesSide(),
          createFakeGamePlayCupidCharms(),
          createFakeGamePlaySeerLooks(),
          createFakeGamePlayFoxSniffs(),
          createFakeGamePlayLoversMeetEachOther(),
          createFakeGamePlayStutteringJudgeChoosesSign(),
          createFakeGamePlayTwoSistersMeetEachOther(),
          createFakeGamePlayThreeBrothersMeetEachOther(),
          createFakeGamePlayWildChildChoosesModel(),
          createFakeGamePlayRavenMarks(),
          createFakeGamePlayGuardProtects(),
          createFakeGamePlayWerewolvesEat(),
          createFakeGamePlayWhiteWerewolfEats(),
          createFakeGamePlayBigBadWolfEats(),
          createFakeGamePlayWitchUsesPotions(),
          createFakeGamePlayPiedPiperCharms(),
          createFakeGamePlayCharmedMeetEachOther(),
        ],
      },
      {
        test: "it's the second night with official rules and some roles",
        game: createFakeGame({
          turn: 2,
          phase: GamePhases.NIGHT,
          players: bulkCreateFakePlayers(4, [
            createFakeCupidAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer({ isAlive: false }),
            createFakeWitchAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
            createFakeAngelAlivePlayer(),
          ]),
          options: DEFAULT_GAME_OPTIONS,
        }),
        output: [createFakeGamePlayWerewolvesEat()],
      },
    ])("should get upcoming night plays when $test [#$#].", async({ game, output }) => {
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
        createFakeSeerAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
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
        createFakeGamePlayAllElectSheriff(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const game = createFakeGame({ upcomingPlays });
      const upcomingPlay = createFakeGamePlayAllElectSheriff();

      expect(services.gamePlay["isUpcomingPlayNewForCurrentPhase"](upcomingPlay, game, [])).toBe(false);
    });

    it("should return false when upcomingPlay is game's current play.", () => {
      const game = createFakeGame({ currentPlay: createFakeGamePlayAllElectSheriff() });
      const upcomingPlay = createFakeGamePlayAllElectSheriff();

      expect(services.gamePlay["isUpcomingPlayNewForCurrentPhase"](upcomingPlay, game, [])).toBe(false);
    });

    it("should return false when upcomingPlay is already played in game history.", () => {
      const game = createFakeGame();
      const upcomingPlay = createFakeGamePlayAllElectSheriff();
      const allVoteGamePlay = createFakeGamePlayAllVote();
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
      const upcomingPlay = createFakeGamePlayAllElectSheriff();
      const allVoteGamePlay = createFakeGamePlayAllVote();
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
    let localMocks: {
      gamePlayService: {
        getUpcomingDayPlays: jest.SpyInstance;
        getUpcomingNightPlays: jest.SpyInstance;
        isUpcomingPlayNewForCurrentPhase: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayService: {
          getUpcomingDayPlays: jest.spyOn(services.gamePlay as unknown as { getUpcomingDayPlays }, "getUpcomingDayPlays").mockReturnValue([]),
          getUpcomingNightPlays: jest.spyOn(services.gamePlay as unknown as { getUpcomingNightPlays }, "getUpcomingNightPlays").mockResolvedValue([]),
          isUpcomingPlayNewForCurrentPhase: jest.spyOn(services.gamePlay as unknown as { isUpcomingPlayNewForCurrentPhase }, "isUpcomingPlayNewForCurrentPhase"),
        },
      };
    });
    
    it("should call getUpcomingNightPlays method with night phase when game phase is night.", async() => {
      const game = createFakeGame({ phase: GamePhases.NIGHT });
      await services.gamePlay["getNewUpcomingPlaysForCurrentPhase"](game);

      expect(localMocks.gamePlayService.getUpcomingNightPlays).toHaveBeenCalledExactlyOnceWith(game);
      expect(mocks.gameHistoryRecordService.getGameHistoryPhaseRecords).toHaveBeenCalledExactlyOnceWith(game._id, game.turn, GamePhases.NIGHT);
    });

    it("should call getUpcomingNightPlays method with day phase when game phase is day.", async() => {
      const game = createFakeGame({ phase: GamePhases.DAY });
      await services.gamePlay["getNewUpcomingPlaysForCurrentPhase"](game);

      expect(localMocks.gamePlayService.getUpcomingDayPlays).toHaveBeenCalledExactlyOnceWith(game);
      expect(mocks.gameHistoryRecordService.getGameHistoryPhaseRecords).toHaveBeenCalledExactlyOnceWith(game._id, game.turn, GamePhases.DAY);
    });

    it("should call isUpcomingPlayNewForCurrentPhase method for as much times as there are upcoming phase plays when filtering them.", async() => {
      const game = createFakeGame({ phase: GamePhases.NIGHT });
      const upcomingPlays = [
        createFakeGamePlayAllElectSheriff(),
        createFakeGamePlaySeerLooks(),
        createFakeGamePlayWerewolvesEat(),
      ];
      localMocks.gamePlayService.getUpcomingNightPlays.mockResolvedValue(upcomingPlays);
      await services.gamePlay["getNewUpcomingPlaysForCurrentPhase"](game);

      expect(localMocks.gamePlayService.isUpcomingPlayNewForCurrentPhase).toHaveBeenNthCalledWith(1, upcomingPlays[0], game, []);
      expect(localMocks.gamePlayService.isUpcomingPlayNewForCurrentPhase).toHaveBeenNthCalledWith(2, upcomingPlays[1], game, []);
      expect(localMocks.gamePlayService.isUpcomingPlayNewForCurrentPhase).toHaveBeenNthCalledWith(3, upcomingPlays[2], game, []);
    });
  });

  describe("validateUpcomingPlaysPriority", () => {
    it("should do nothing when all game plays have a priority.", () => {
      const upcomingPlays = [
        createFakeGamePlayAllElectSheriff(),
        createFakeGamePlayHunterShoots(),
        createFakeGamePlayAllVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
      ];

      expect(() => services.gamePlay["validateUpcomingPlaysPriority"](upcomingPlays)).not.toThrow();
    });

    it("should throw an error when the first upcoming play doesn't have a priority.", () => {
      const upcomingPlays = [
        createFakeGamePlayWitchUsesPotions({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
        createFakeGamePlayHunterShoots(),
        createFakeGamePlayAllVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
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
        createFakeGamePlayAllVote(),
        createFakeGamePlayAllElectSheriff(),
        createFakeGamePlayBigBadWolfEats(),
        createFakeGamePlayWerewolvesEat(),
        createFakeGamePlaySeerLooks(),
        createFakeGamePlayAllVote({ cause: GamePlayCauses.STUTTERING_JUDGE_REQUEST }),
        createFakeGamePlayWitchUsesPotions(),
        createFakeGamePlayHunterShoots(),
        createFakeGamePlayAllVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
      ];
      const expectedUpcomingPlays = [
        createFakeGamePlayHunterShoots(),
        createFakeGamePlayAllElectSheriff(),
        createFakeGamePlayAllVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
        createFakeGamePlayAllVote({ cause: GamePlayCauses.STUTTERING_JUDGE_REQUEST }),
        createFakeGamePlayAllVote(),
        createFakeGamePlaySeerLooks(),
        createFakeGamePlayWerewolvesEat(),
        createFakeGamePlayBigBadWolfEats(),
        createFakeGamePlayWitchUsesPotions(),
      ];

      expect(services.gamePlay["sortUpcomingPlaysByPriority"](upcomingPlaysToSort)).toStrictEqual<GamePlay[]>(expectedUpcomingPlays);
    });
  });

  describe("isSheriffElectionTime", () => {
    it("should return false when sheriff is not enabled even if it's the time.", () => {
      const sheriffGameOptions = createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GamePhases.NIGHT }, isEnabled: false, hasDoubledVote: false });
      
      expect(services.gamePlay["isSheriffElectionTime"](sheriffGameOptions, 1, GamePhases.NIGHT)).toBe(false);
    });

    it("should return false when it's not the right turn.", () => {
      const sheriffGameOptions = createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GamePhases.NIGHT }, isEnabled: true, hasDoubledVote: false });
      
      expect(services.gamePlay["isSheriffElectionTime"](sheriffGameOptions, 2, GamePhases.NIGHT)).toBe(false);
    });

    it("should return false when it's not the right phase.", () => {
      const sheriffGameOptions = createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GamePhases.DAY }, isEnabled: true, hasDoubledVote: false });
      
      expect(services.gamePlay["isSheriffElectionTime"](sheriffGameOptions, 1, GamePhases.NIGHT)).toBe(false);
    });

    it("should return true when it's the right phase and turn.", () => {
      const sheriffGameOptions = createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GamePhases.NIGHT }, isEnabled: true, hasDoubledVote: false });
      
      expect(services.gamePlay["isSheriffElectionTime"](sheriffGameOptions, 1, GamePhases.NIGHT)).toBe(true);
    });
  });

  describe("isLoversGamePlaySuitableForCurrentPhase", () => {
    it("should return false when there is no cupid in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.WHITE_WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return true when there is cupid in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.CUPID } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](gameDto)).toBe(true);
    });

    it("should return false when there is no cupid in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when there is cupid in the game but he is dead and there is no lovers.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeCupidAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when there is cupid in the game but he is powerless and there is no lovers.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeCupidAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return true when there is cupid alive and powerful and there is no lovers.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeCupidAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });

    it("should return false when cupid is dead but one of the lovers is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeVileFatherOfWolvesAlivePlayer({ isAlive: false, attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeCupidAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });

      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return true when cupid is dead and lovers are alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeVileFatherOfWolvesAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeCupidAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });

      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });
  });

  describe("isAllGamePlaySuitableForCurrentPhase", () => {
    it("should return true when game play's action is ELECT_SHERIFF.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeVillagerVillagerAlivePlayer(),
      ]);
      const game = createFakeGame({ players, turn: 1, phase: GamePhases.DAY });
      const gamePlay = createFakeGamePlayAllElectSheriff();

      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(true);
    });
    
    it("should return true when game play's action is VOTE but reason is not angel presence.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeVillagerVillagerAlivePlayer(),
      ]);
      const game = createFakeGame({ players, turn: 1, phase: GamePhases.DAY });
      const gamePlay = createFakeGamePlayAllVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });

      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(true);
    });

    it("should return false when there is no angel in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.WHITE_WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      const gamePlay = createFakeGamePlayAllVote({ cause: GamePlayCauses.ANGEL_PRESENCE });

      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](gameDto, gamePlay)).toBe(false);
    });

    it("should return true when there is angel in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.ANGEL } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      const gamePlay = createFakeGamePlayAllVote({ cause: GamePlayCauses.ANGEL_PRESENCE });

      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](gameDto, gamePlay)).toBe(true);
    });

    it("should return false when there is no angel in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeVillagerVillagerAlivePlayer(),
      ]);
      const game = createFakeGame({ players, turn: 1, phase: GamePhases.NIGHT });
      const gamePlay = createFakeGamePlayAllVote({ cause: GamePlayCauses.ANGEL_PRESENCE });

      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(false);
    });

    it("should return false when there is angel in the game but he is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players, turn: 1, phase: GamePhases.NIGHT });
      const gamePlay = createFakeGamePlayAllVote({ cause: GamePlayCauses.ANGEL_PRESENCE });
      
      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(false);
    });

    it("should return false when there is angel in the game but he is powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
      ]);
      const game = createFakeGame({ players, turn: 1, phase: GamePhases.NIGHT });
      const gamePlay = createFakeGamePlayAllVote({ cause: GamePlayCauses.ANGEL_PRESENCE });
      
      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(false);
    });

    it("should return true when there is angel in the game alive and powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const game = createFakeGame({ players, turn: 1, phase: GamePhases.NIGHT });
      const gamePlay = createFakeGamePlayAllVote({ cause: GamePlayCauses.ANGEL_PRESENCE });
      
      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(true);
    });
  });

  describe("isGroupGamePlaySuitableForCurrentPhase", () => {
    let localMocks: {
      gamePlayService: {
        isAllGamePlaySuitableForCurrentPhase: jest.SpyInstance;
        isLoversGamePlaySuitableForCurrentPhase: jest.SpyInstance;
        isPiedPiperGamePlaySuitableForCurrentPhase: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayService: {
          isAllGamePlaySuitableForCurrentPhase: jest.spyOn(services.gamePlay as unknown as { isAllGamePlaySuitableForCurrentPhase }, "isAllGamePlaySuitableForCurrentPhase").mockImplementation(),
          isLoversGamePlaySuitableForCurrentPhase: jest.spyOn(services.gamePlay as unknown as { isLoversGamePlaySuitableForCurrentPhase }, "isLoversGamePlaySuitableForCurrentPhase").mockImplementation(),
          isPiedPiperGamePlaySuitableForCurrentPhase: jest.spyOn(services.gamePlay as unknown as { isPiedPiperGamePlaySuitableForCurrentPhase }, "isPiedPiperGamePlaySuitableForCurrentPhase").mockImplementation(),
        },
      };
    });

    it("should call all playable method when game plays source group is all.", () => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlayAllVote();
      services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(localMocks.gamePlayService.isAllGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call lovers playable method when game plays source group is lovers.", () => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlayLoversMeetEachOther();
      services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(localMocks.gamePlayService.isLoversGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call charmed playable method when game plays source group is charmed people.", () => {
      const game = createFakeGame();
      const gamePlay = createFakeGamePlayCharmedMeetEachOther();
      services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(localMocks.gamePlayService.isPiedPiperGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should return true when game plays source group is werewolves and game is dto.", () => {
      const gameDto = createFakeCreateGameDto();
      const gamePlay = createFakeGamePlayWerewolvesEat();

      expect(services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](gameDto, gamePlay)).toBe(true);
    });

    it("should return false when game plays source group is villagers and game is dto.", () => {
      const gameDto = createFakeCreateGameDto();
      const gamePlay = createFakeGamePlayWerewolvesEat({ source: createFakeGamePlaySource({ name: PlayerGroups.VILLAGERS }) });

      expect(services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](gameDto, gamePlay)).toBe(false);
    });

    it("should return false when game plays source group is werewolves and all are powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeBigBadWolfAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeWitchAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayWerewolvesEat();

      expect(services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(false);
    });

    it("should return true when game plays source group is werewolves and at least one is alive and powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeBigBadWolfAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayWerewolvesEat();

      expect(services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(true);
    });
  });

  describe("isWitchGamePlaySuitableForCurrentPhase", () => {
    it("should return false when witch is not in the game dto.", async() => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });

      await expect(services.gamePlay["isWitchGamePlaySuitableForCurrentPhase"](gameDto)).resolves.toBe(false);
    });

    it("should return false when witch is not in the game.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const game = createFakeGame({ players });

      await expect(services.gamePlay["isWitchGamePlaySuitableForCurrentPhase"](game)).resolves.toBe(false);
    });

    it("should return false when witch is in the game but dead.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWitchAlivePlayer({ isAlive: false }),
        createFakeAngelAlivePlayer(),
      ]);
      const game = createFakeGame({ players });

      await expect(services.gamePlay["isWitchGamePlaySuitableForCurrentPhase"](game)).resolves.toBe(false);
    });

    it("should return false when witch is in the game but powerless.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWitchAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeAngelAlivePlayer(),
      ]);
      const game = createFakeGame({ players });

      await expect(services.gamePlay["isWitchGamePlaySuitableForCurrentPhase"](game)).resolves.toBe(false);
    });

    it("should return false when witch is in the game but options specify that her turn must be skipped if no more potions.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: true }) });
      const game = createFakeGame({ players, options });
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValue([createFakeGameHistoryRecord()]);

      await expect(services.gamePlay["isWitchGamePlaySuitableForCurrentPhase"](game)).resolves.toBe(false);
    });

    it("should return true when witch is in the game but options specify that her turn must not be skipped even with no more potions.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false }) });
      const game = createFakeGame({ players, options });
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValue([createFakeGameHistoryRecord()]);

      await expect(services.gamePlay["isWitchGamePlaySuitableForCurrentPhase"](game)).resolves.toBe(true);
    });

    it("should return true when witch is in the game but options specify that her turn must be skipped with no more potions but has still death potion.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: true }) });
      const game = createFakeGame({ players, options });
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockResolvedValue([]);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue([createFakeGameHistoryRecord()]);

      await expect(services.gamePlay["isWitchGamePlaySuitableForCurrentPhase"](game)).resolves.toBe(true);
    });

    it("should return true when witch is in the game but options specify that her turn must be skipped with no more potions but has still life potion.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: true }) });
      const game = createFakeGame({ players, options });
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockResolvedValue([createFakeGameHistoryRecord()]);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue([]);

      await expect(services.gamePlay["isWitchGamePlaySuitableForCurrentPhase"](game)).resolves.toBe(true);
    });
  });

  describe("shouldBeCalledOnCurrentTurnInterval", () => {
    it.each<{ wakingUpInterval: number; game: Game; shouldBeCalled: boolean; test: string }>([
      {
        game: createFakeGame({ turn: 1 }),
        wakingUpInterval: 1,
        shouldBeCalled: true,
        test: "waking up interval is 1 and it's the first turn.",
      },
      {
        game: createFakeGame({ turn: 1 }),
        wakingUpInterval: 2,
        shouldBeCalled: true,
        test: "waking up interval is 2 and it's the first turn.",
      },
      {
        game: createFakeGame({ turn: 2 }),
        wakingUpInterval: 1,
        shouldBeCalled: true,
        test: "waking up interval is 1 and it's the second turn.",
      },
      {
        game: createFakeGame({ turn: 2 }),
        wakingUpInterval: 2,
        shouldBeCalled: false,
        test: "waking up interval is 2 and it's the second turn.",
      },
      {
        game: createFakeGame({ turn: 3 }),
        wakingUpInterval: 1,
        shouldBeCalled: true,
        test: "waking up interval is 1 and it's the third turn.",
      },
      {
        game: createFakeGame({ turn: 3 }),
        wakingUpInterval: 2,
        shouldBeCalled: true,
        test: "waking up interval is 2 and it's the third turn.",
      },
    ])("should return $shouldBeCalled when $test [#$#].", ({ wakingUpInterval, game, shouldBeCalled }) => {
      expect(services.gamePlay["shouldBeCalledOnCurrentTurnInterval"](wakingUpInterval, game)).toBe(shouldBeCalled);
    });
  });

  describe("isWhiteWerewolfGamePlaySuitableForCurrentPhase", () => {
    it("should return false when white werewolf is not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return false when white werewolf is in the game dto but options specify that he's never called.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.WHITE_WEREWOLF } },
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ whiteWerewolf: { wakingUpInterval: 0 } }) });
      const gameDto = createFakeCreateGameDto({ players, options });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return true when white werewolf is in the game dto and options specify that he's called every other night.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.WHITE_WEREWOLF } },
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ whiteWerewolf: { wakingUpInterval: 2 } }) });
      const gameDto = createFakeCreateGameDto({ players, options });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(true);
    });

    it("should return false when white werewolf is not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const game = createFakeGame({ players, turn: 1 });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when white werewolf is in the game but options specify that he's never called.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, whiteWerewolf: { wakingUpInterval: 0 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when white werewolf is in the game but dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, whiteWerewolf: { wakingUpInterval: 1 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when white werewolf is in the game but powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, whiteWerewolf: { wakingUpInterval: 1 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when white werewolf is in the game, alive, powerful, has no targets and options say skip if no targets.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: true, whiteWerewolf: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      mocks.gameHelper.getLeftToEatByWhiteWerewolfPlayers.mockReturnValue([]);

      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when white werewolf is in the game, alive and powerful but game's turn is not aligned with his waking up interval.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, whiteWerewolf: { wakingUpInterval: 4 } }) });
      const game = createFakeGame({ players, turn: 3, options });

      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return true when white werewolf is in the game, alive and powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, whiteWerewolf: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });

    it("should return true when white werewolf is in the game, alive, powerful, has targets and options say skip if no targets.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: true, whiteWerewolf: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      mocks.gameHelper.getLeftToEatByWhiteWerewolfPlayers.mockReturnValue([players[3]]);

      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });
  });

  describe("isPiedPiperGamePlaySuitableForCurrentPhase", () => {
    it("should return false when pied piper is not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isPiedPiperGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return true when pied piper is in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.PIED_PIPER } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isPiedPiperGamePlaySuitableForCurrentPhase"](gameDto)).toBe(true);
    });

    it("should return false when pied piper is not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isPiedPiperGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when pied piper is in the game can't charm anymore.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakePiedPiperAlivePlayer({ isAlive: false }),
      ]);
      jest.spyOn(PlayerHelper, "canPiedPiperCharm").mockReturnValue(false);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isPiedPiperGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return true when pied piper is in the game and can still charm.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
      ]);
      jest.spyOn(PlayerHelper, "canPiedPiperCharm").mockReturnValue(true);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isPiedPiperGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });
  });

  describe("isBigBadWolfGamePlaySuitableForCurrentPhase", () => {
    it("should return false when big bad wolf is not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[0]]);

      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return true when big bad wolf is in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.BIG_BAD_WOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[0]]);

      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(true);
    });

    it("should return false when big bad wolf is not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[0]]);
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when big bad wolf is in the game but dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[0]]);
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when big bad wolf is in the game but one werewolf is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, bigBadWolf: { isPowerlessIfWerewolfDies: true } }) });
      const game = createFakeGame({ players, options });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[0]]);
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when big bad wolf is in the game, all werewolves are alive and his turn is skipped if no targets.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: true, bigBadWolf: { isPowerlessIfWerewolfDies: true } }) });
      const game = createFakeGame({ players, options });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([]);

      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return true when big bad wolf is in the game, all werewolves are alive and his turn is skipped if no targets but there are targets.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: true, bigBadWolf: { isPowerlessIfWerewolfDies: true } }) });
      const game = createFakeGame({ players, options });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[1]]);

      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });

    it("should return true when big bad wolf is in the game, one werewolf is dead but classic rules are not followed.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, bigBadWolf: { isPowerlessIfWerewolfDies: false } }) });
      const game = createFakeGame({ players, options });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[0]]);
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });

    it("should return true when big bad wolf is in the game and all werewolves are alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, bigBadWolf: { isPowerlessIfWerewolfDies: true } }) });
      const game = createFakeGame({ players, options });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([players[0]]);
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });

    it("should return true when big bad wolf is in the game, all werewolves are alive and his turn is no skipped if no targets.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ doSkipCallIfNoTarget: false, bigBadWolf: { isPowerlessIfWerewolfDies: true } }) });
      const game = createFakeGame({ players, options });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([]);

      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });
  });

  describe("isThreeBrothersGamePlaySuitableForCurrentPhase", () => {
    let localMocks: {
      gamePlayService: {
        shouldBeCalledOnCurrentTurnInterval: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = { gamePlayService: { shouldBeCalledOnCurrentTurnInterval: jest.spyOn(services.gamePlay as unknown as { shouldBeCalledOnCurrentTurnInterval }, "shouldBeCalledOnCurrentTurnInterval").mockReturnValue(true) } };
    });

    it("should return false when three brothers are not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return false when three brothers are in the game dto but options specify that they are never called.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.THREE_BROTHERS } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.THREE_BROTHERS } },
        { role: { name: RoleNames.THREE_BROTHERS } },
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 0 } }) });
      const gameDto = createFakeCreateGameDto({ players, options });
      localMocks.gamePlayService.shouldBeCalledOnCurrentTurnInterval.mockReturnValue(false);
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return true when three brother are in the game dto and options specify that they are called every other night.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.THREE_BROTHERS } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.THREE_BROTHERS } },
        { role: { name: RoleNames.THREE_BROTHERS } },
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) });
      const gameDto = createFakeCreateGameDto({ players, options });
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](gameDto)).toBe(true);
    });

    it("should return false when three brothers are not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when three brothers is in the game but options specify that they are never called.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 0 } }) });
      const game = createFakeGame({ players, options });
      localMocks.gamePlayService.shouldBeCalledOnCurrentTurnInterval.mockReturnValue(false);
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should call shouldBeCalledOnCurrentTurnInterval method with three brothers waking up interval when called.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 789 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game);

      expect(localMocks.gamePlayService.shouldBeCalledOnCurrentTurnInterval).toHaveBeenCalledWith(789, game);
    });

    it("should return true when three brothers are alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, options });
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });

    it("should return true when two brothers are alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
        createFakeThreeBrothersAlivePlayer({ isAlive: false }),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, options });
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });

    it("should return false when only one brothers is alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeThreeBrothersAlivePlayer({ isAlive: false }),
        createFakeThreeBrothersAlivePlayer({ isAlive: false }),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, options });
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when all brothers are dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeThreeBrothersAlivePlayer({ isAlive: false }),
        createFakeThreeBrothersAlivePlayer({ isAlive: false }),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, options });
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });
  });

  describe("isTwoSistersGamePlaySuitableForCurrentPhase", () => {
    let localMocks: {
      gamePlayService: {
        shouldBeCalledOnCurrentTurnInterval: jest.SpyInstance;
      };
    };
    
    beforeEach(() => {
      localMocks = { gamePlayService: { shouldBeCalledOnCurrentTurnInterval: jest.spyOn(services.gamePlay as unknown as { shouldBeCalledOnCurrentTurnInterval }, "shouldBeCalledOnCurrentTurnInterval").mockReturnValue(true) } };
    });
    
    it("should return false when two sisters are not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.WITCH } },
        { role: { name: RoleNames.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return false when two sisters are in the game dto but options specify that they are never called.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.VILLAGER_VILLAGER } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.TWO_SISTERS } },
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 0 } }) });
      const gameDto = createFakeCreateGameDto({ players, options });
      localMocks.gamePlayService.shouldBeCalledOnCurrentTurnInterval.mockReturnValue(false);
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return true when two sisters are in the game dto and options specify that they are called every other night.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.WEREWOLF } },
        { role: { name: RoleNames.TWO_SISTERS } },
        { role: { name: RoleNames.TWO_SISTERS } },
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 2 } }) });
      const gameDto = createFakeCreateGameDto({ players, options });
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](gameDto)).toBe(true);
    });

    it("should return false when two sisters are not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, options });
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when two sisters is in the game but options specify that they are never called.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 0 } }) });
      const game = createFakeGame({ players, options });
      localMocks.gamePlayService.shouldBeCalledOnCurrentTurnInterval.mockReturnValue(false);
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should call shouldBeCalledOnCurrentTurnInterval method with two sisters waking up interval when called.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 342 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](game);

      expect(localMocks.gamePlayService.shouldBeCalledOnCurrentTurnInterval).toHaveBeenCalledWith(342, game);
    });

    it("should return true when two sisters are alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });

    it("should return false when one sister is alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when all sisters are dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeWildChildAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, turn: 1, options });
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });
  });

  describe("isRoleGamePlaySuitableForCurrentPhase", () => {
    let localMocks: {
      gamePlayService: {
        isTwoSistersGamePlaySuitableForCurrentPhase: jest.SpyInstance;
        isThreeBrothersGamePlaySuitableForCurrentPhase: jest.SpyInstance;
        isBigBadWolfGamePlaySuitableForCurrentPhase: jest.SpyInstance;
        isPiedPiperGamePlaySuitableForCurrentPhase: jest.SpyInstance;
        isWhiteWerewolfGamePlaySuitableForCurrentPhase: jest.SpyInstance;
        isWitchGamePlaySuitableForCurrentPhase: jest.SpyInstance;
      };
    };
    
    beforeEach(() => {
      localMocks = {
        gamePlayService: {
          isTwoSistersGamePlaySuitableForCurrentPhase: jest.spyOn(services.gamePlay as unknown as { isTwoSistersGamePlaySuitableForCurrentPhase }, "isTwoSistersGamePlaySuitableForCurrentPhase").mockImplementation(),
          isThreeBrothersGamePlaySuitableForCurrentPhase: jest.spyOn(services.gamePlay as unknown as { isThreeBrothersGamePlaySuitableForCurrentPhase }, "isThreeBrothersGamePlaySuitableForCurrentPhase").mockImplementation(),
          isBigBadWolfGamePlaySuitableForCurrentPhase: jest.spyOn(services.gamePlay as unknown as { isBigBadWolfGamePlaySuitableForCurrentPhase }, "isBigBadWolfGamePlaySuitableForCurrentPhase").mockImplementation(),
          isPiedPiperGamePlaySuitableForCurrentPhase: jest.spyOn(services.gamePlay as unknown as { isPiedPiperGamePlaySuitableForCurrentPhase }, "isPiedPiperGamePlaySuitableForCurrentPhase").mockImplementation(),
          isWhiteWerewolfGamePlaySuitableForCurrentPhase: jest.spyOn(services.gamePlay as unknown as { isWhiteWerewolfGamePlaySuitableForCurrentPhase }, "isWhiteWerewolfGamePlaySuitableForCurrentPhase").mockImplementation(),
          isWitchGamePlaySuitableForCurrentPhase: jest.spyOn(services.gamePlay as unknown as { isWitchGamePlaySuitableForCurrentPhase }, "isWitchGamePlaySuitableForCurrentPhase").mockImplementation(),
        },
      };
    });
    
    it("should return false when player is not in game.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySeerLooks();

      await expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).resolves.toBe(false);
    });

    it("should call two sisters method when game play source role is two sisters.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayTwoSistersMeetEachOther();
      await services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(localMocks.gamePlayService.isTwoSistersGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call three brothers method when game play source role is three brothers.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayThreeBrothersMeetEachOther();
      await services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(localMocks.gamePlayService.isThreeBrothersGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call big bad wolf method when game plays source role is big bad wolf.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayBigBadWolfEats();
      await services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(localMocks.gamePlayService.isBigBadWolfGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call pied piper method when game plays source role is pied piper.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayPiedPiperCharms();
      await services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(localMocks.gamePlayService.isPiedPiperGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call white werewolf method when game plays source role is white werewolf.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayWhiteWerewolfEats();
      await services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(localMocks.gamePlayService.isWhiteWerewolfGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call witch method when game plays source role is witch.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWitchAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayWitchUsesPotions();
      await services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(localMocks.gamePlayService.isWitchGamePlaySuitableForCurrentPhase).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should return true when game plays source role is hunter and player is dto.", async() => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.HUNTER } },
        { role: { name: RoleNames.WHITE_WEREWOLF } },
        { role: { name: RoleNames.VILLAGER_VILLAGER } },
        { role: { name: RoleNames.LITTLE_GIRL } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      const gamePlay = createFakeGamePlayHunterShoots();

      await expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](gameDto, gamePlay)).resolves.toBe(true);
    });

    it("should return true when game plays source role is hunter and player is powerful.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayHunterShoots();

      await expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).resolves.toBe(true);
    });

    it("should return false when game plays source role is hunter and player is powerless.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeHunterAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayHunterShoots();

      await expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).resolves.toBe(false);
    });

    it("should return true when game plays source role is scapegoat and player is dto.", async() => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SCAPEGOAT } },
        { role: { name: RoleNames.WHITE_WEREWOLF } },
        { role: { name: RoleNames.VILLAGER_VILLAGER } },
        { role: { name: RoleNames.LITTLE_GIRL } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      const gamePlay = createFakeGamePlayScapegoatBansVoting();

      await expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](gameDto, gamePlay)).resolves.toBe(true);
    });

    it("should return true when game plays source role is scapegoat and player is powerful.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeScapegoatAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayScapegoatBansVoting();

      await expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).resolves.toBe(true);
    });

    it("should return false when game plays source role is scapegoat and player is powerless.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeScapegoatAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayScapegoatBansVoting();

      await expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).resolves.toBe(false);
    });

    it("should return true when player is dto.", async() => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: RoleNames.SEER } },
        { role: { name: RoleNames.WHITE_WEREWOLF } },
        { role: { name: RoleNames.VILLAGER_VILLAGER } },
        { role: { name: RoleNames.LITTLE_GIRL } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      const gamePlay = createFakeGamePlaySeerLooks();

      await expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](gameDto, gamePlay)).resolves.toBe(true);
    });

    it("should return false when player is dead.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySeerLooks();

      await expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).resolves.toBe(false);
    });

    it("should return false when player is powerless.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySeerLooks();

      await expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).resolves.toBe(false);
    });

    it("should return true when player is alive and powerful.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySeerLooks();

      await expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).resolves.toBe(true);
    });
  });

  describe("isSheriffGamePlaySuitableForCurrentPhase", () => {
    it("should return false when sheriff is not enabled.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ isEnabled: false }) }) });
      const game = createFakeCreateGameDto({ options });
      
      expect(services.gamePlay["isSheriffGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return true when game is dto.", () => {
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ isEnabled: true }) }) });
      const game = createFakeCreateGameDto({ options });

      expect(services.gamePlay["isSheriffGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });

    it("should return false when sheriff is not in the game.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeCupidAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ isEnabled: true }) }) });
      const game = createFakeGame({ players, options });

      expect(services.gamePlay["isSheriffGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return true when sheriff is in the game.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] }),
        createFakeCupidAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ isEnabled: true }) }) });
      const game = createFakeGame({ players, options });

      expect(services.gamePlay["isSheriffGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });
  });

  describe("isGamePlaySuitableForCurrentPhase", () => {
    it("should call isRoleGamePlaySuitableForCurrentPhase when source is a sheriff.", async() => {
      const game = createFakeGame();
      const isSheriffGamePlaySuitableForCurrentPhaseSpy = jest.spyOn(services.gamePlay as unknown as { isSheriffGamePlaySuitableForCurrentPhase }, "isSheriffGamePlaySuitableForCurrentPhase");
      const gamePlay = createFakeGamePlaySheriffDelegates();
      await services.gamePlay["isGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(isSheriffGamePlaySuitableForCurrentPhaseSpy).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call isRoleGamePlaySuitableForCurrentPhase when source is a role.", async() => {
      const game = createFakeGame();
      const isRoleGamePlaySuitableForCurrentPhaseSpy = jest.spyOn(services.gamePlay as unknown as { isRoleGamePlaySuitableForCurrentPhase }, "isRoleGamePlaySuitableForCurrentPhase");
      const gamePlay = createFakeGamePlaySeerLooks();
      await services.gamePlay["isGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(isRoleGamePlaySuitableForCurrentPhaseSpy).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call isGroupGamePlaySuitableForCurrentPhase when source is a group.", async() => {
      const game = createFakeGame();
      const isGroupGamePlaySuitableForCurrentPhaseSpy = jest.spyOn(services.gamePlay as unknown as { isGroupGamePlaySuitableForCurrentPhase }, "isGroupGamePlaySuitableForCurrentPhase");
      const gamePlay = createFakeGamePlayAllVote();
      await services.gamePlay["isGamePlaySuitableForCurrentPhase"](game, gamePlay);
      
      expect(isGroupGamePlaySuitableForCurrentPhaseSpy).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });
  });
});