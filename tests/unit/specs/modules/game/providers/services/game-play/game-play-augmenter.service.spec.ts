import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import type { GamePlayEligibleTargets } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets.schema";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlayActions, GamePlayCauses } from "@/modules/game/enums/game-play.enum";
import * as GameHelper from "@/modules/game/helpers/game.helper";
import { GamePlayAugmenterService } from "@/modules/game/providers/services/game-play/game-play-augmenter.service";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecord } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakePiedPiperGameOptions, createFakeRolesGameOptions, createFakeThiefGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeVotesGameOptions } from "@tests/factories/game/schemas/game-options/votes-game-options.schema.factory";
import { createFakeGamePlayEligibleTargets } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/game-play-eligible-targets.schema.factory";
import { createFakeGamePlay, createFakeGamePlayBigBadWolfEats, createFakeGamePlayCharmedMeetEachOther, createFakeGamePlayCupidCharms, createFakeGamePlayFoxSniffs, createFakeGamePlayGuardProtects, createFakeGamePlayHunterShoots, createFakeGamePlayLoversMeetEachOther, createFakeGamePlayPiedPiperCharms, createFakeGamePlayRavenMarks, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySeerLooks, createFakeGamePlaySheriffDelegates, createFakeGamePlaySurvivorsVote, createFakeGamePlayThiefChoosesCard, createFakeGamePlayThreeBrothersMeetEachOther, createFakeGamePlayTwoSistersMeetEachOther, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWildChildChoosesModel, createFakeGamePlayWitchUsesPotions } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCantVoteBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeAngelAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWitchAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Play Augmenter Service", () => {
  let services: { gamePlayAugmenter: GamePlayAugmenterService };
  let mocks: {
    gameHelper: {
      getLeftToEatByWerewolvesPlayers: jest.SpyInstance;
      getLeftToEatByWhiteWerewolfPlayers: jest.SpyInstance;
      getLeftToCharmByPiedPiperPlayers: jest.SpyInstance;
    };
    gameHistoryRecordService: {
      getGameHistoryWitchUsesSpecificPotionRecords: jest.SpyInstance;
    };
  };

  beforeEach(async() => {
    mocks = {
      gameHelper: {
        getLeftToEatByWerewolvesPlayers: jest.spyOn(GameHelper, "getLeftToEatByWerewolvesPlayers"),
        getLeftToEatByWhiteWerewolfPlayers: jest.spyOn(GameHelper, "getLeftToEatByWhiteWerewolfPlayers"),
        getLeftToCharmByPiedPiperPlayers: jest.spyOn(GameHelper, "getLeftToCharmByPiedPiperPlayers"),
      },
      gameHistoryRecordService: { getGameHistoryWitchUsesSpecificPotionRecords: jest.fn() },
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
    let localMocks: {
      gamePlayAugmenterService: {
        canGamePlayBeSkipped: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = { gamePlayAugmenterService: { canGamePlayBeSkipped: jest.spyOn(services.gamePlayAugmenter as unknown as { canGamePlayBeSkipped }, "canGamePlayBeSkipped") } };
    });

    it("should return game play with canBeSkipped when called.", () => {
      const gamePlay = createFakeGamePlay();
      const game = createFakeGame();
      localMocks.gamePlayAugmenterService.canGamePlayBeSkipped.mockReturnValueOnce(true);
      const expectedGamePlay = createFakeGamePlay({
        ...gamePlay,
        canBeSkipped: true,
      });

      expect(services.gamePlayAugmenter.setGamePlayCanBeSkipped(gamePlay, game)).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("setGamePlayEligibleTargets", () => {
    let localMocks: {
      gamePlayAugmenterService: {
        getGamePlayEligibleTargets: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = { gamePlayAugmenterService: { getGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as { getGamePlayEligibleTargets }, "getGamePlayEligibleTargets") } };
    });

    it("should return game play with eligibleTargets when called.", async() => {
      const gamePlay = createFakeGamePlay();
      const game = createFakeGame();
      const expectedGamePlay = createFakeGamePlay({
        ...gamePlay,
        eligibleTargets: createFakeGamePlayEligibleTargets(),
      });
      localMocks.gamePlayAugmenterService.getGamePlayEligibleTargets.mockResolvedValueOnce(expectedGamePlay.eligibleTargets);

      await expect(services.gamePlayAugmenter.setGamePlayEligibleTargets(gamePlay, game)).resolves.toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("getBigBadWolfGamePlayEligibleTargets", () => {
    it("should return target boundaries based on left to eat by werewolves targets when called.", () => {
      const gamePlay = createFakeGamePlayBigBadWolfEats();
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValueOnce([players[0], players[1]]);

      expect(services.gamePlayAugmenter["getBigBadWolfGamePlayEligibleTargets"](gamePlay, game)).toStrictEqual<GamePlayEligibleTargets>(createFakeGamePlayEligibleTargets({ boundaries: { min: 2, max: 2 } }));
    });
  });

  describe("getCupidGamePlayEligibleTargets", () => {
    it("should return 2 to 2 targets boundaries when called.", () => {
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({ boundaries: { min: 2, max: 2 } });

      expect(services.gamePlayAugmenter["getCupidGamePlayEligibleTargets"]()).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getFoxGamePlayEligibleTargets", () => {
    it("should return 0 to 1 targets boundaries when called.", () => {
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({ boundaries: { min: 0, max: 1 } });

      expect(services.gamePlayAugmenter["getFoxGamePlayEligibleTargets"]()).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getPiedPiperGamePlayEligibleTargets", () => {
    it("should return targets boundaries based on left to charm players when game options charm count is greater.", () => {
      const gamePlay = createFakeGamePlayCharmedMeetEachOther();
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ charmedPeopleCountPerNight: 4 }) }) });
      const game = createFakeGame({ players, options });
      mocks.gameHelper.getLeftToCharmByPiedPiperPlayers.mockReturnValueOnce([players[0], players[1]]);
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({ boundaries: { min: 2, max: 2 } });

      expect(services.gamePlayAugmenter["getPiedPiperGamePlayEligibleTargets"](gamePlay, game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should return targets boundaries based on game options when game options charm count is lower than left to charm players.", () => {
      const gamePlay = createFakeGamePlayCharmedMeetEachOther();
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ charmedPeopleCountPerNight: 1 }) }) });
      const game = createFakeGame({ players, options });
      mocks.gameHelper.getLeftToCharmByPiedPiperPlayers.mockReturnValueOnce([players[0], players[1]]);
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({ boundaries: { min: 1, max: 1 } });

      expect(services.gamePlayAugmenter["getPiedPiperGamePlayEligibleTargets"](gamePlay, game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getRavenGamePlayEligibleTargets", () => {
    it("should return 0 to 1 targets boundaries when called.", () => {
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({ boundaries: { min: 0, max: 1 } });

      expect(services.gamePlayAugmenter["getRavenGamePlayEligibleTargets"]()).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getScapegoatGamePlayEligibleTargets", () => {
    it("should return 0 to alive players target boundaries when called.", () => {
      const gamePlay = createFakeGamePlayScapegoatBansVoting();
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({ boundaries: { min: 0, max: 2 } });

      expect(services.gamePlayAugmenter["getScapegoatGamePlayEligibleTargets"](gamePlay, game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getWhiteWerewolfGamePlayEligibleTargets", () => {
    it("should return 0 to 1 targets boundaries when there are still wolves to eat.", () => {
      const gamePlay = createFakeGamePlayWhiteWerewolfEats();
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHelper.getLeftToEatByWhiteWerewolfPlayers.mockReturnValueOnce([players[0], players[1]]);

      expect(services.gamePlayAugmenter["getWhiteWerewolfGamePlayEligibleTargets"](gamePlay, game)).toStrictEqual<GamePlayEligibleTargets>(createFakeGamePlayEligibleTargets({ boundaries: { min: 0, max: 1 } }));
    });

    it("should return 0 to 0 targets boundaries when there are no wolves to eat.", () => {
      const gamePlay = createFakeGamePlayWhiteWerewolfEats();
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHelper.getLeftToEatByWhiteWerewolfPlayers.mockReturnValueOnce([]);

      expect(services.gamePlayAugmenter["getWhiteWerewolfGamePlayEligibleTargets"](gamePlay, game)).toStrictEqual<GamePlayEligibleTargets>(createFakeGamePlayEligibleTargets({ boundaries: { min: 0, max: 0 } }));
    });
  });

  describe("getWitchGamePlayEligibleTargets", () => {
    it("should 0 to 2 targets boundaries when witch still has her two potions.", async() => {
      const gamePlay = createFakeGamePlayWitchUsesPotions();
      const game = createFakeGame();
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({ boundaries: { min: 0, max: 2 } });

      await expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](gamePlay, game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should 0 to 1 targets boundaries when witch still has her life potion.", async() => {
      const gamePlay = createFakeGamePlayWitchUsesPotions();
      const game = createFakeGame();
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([createFakeGameHistoryRecord()]);
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({ boundaries: { min: 0, max: 1 } });

      await expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](gamePlay, game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should 0 to 1 targets boundaries when witch still has her death potion.", async() => {
      const gamePlay = createFakeGamePlayWitchUsesPotions();
      const game = createFakeGame();
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([createFakeGameHistoryRecord()]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({ boundaries: { min: 0, max: 1 } });

      await expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](gamePlay, game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should 0 to 0 targets boundaries when witch has no potions.", async() => {
      const gamePlay = createFakeGamePlayWitchUsesPotions();
      const game = createFakeGame();
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([createFakeGameHistoryRecord()]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([createFakeGameHistoryRecord()]);
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({ boundaries: { min: 0, max: 0 } });

      await expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](gamePlay, game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getSingleTargetGamePlayEligibleTargets", () => {
    it("should return 1 to 1 targets boundaries when called.", () => {
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({ boundaries: { min: 1, max: 1 } });

      expect(services.gamePlayAugmenter["getSingleTargetGamePlayEligibleTargets"]()).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getGamePlayEligibleTargets", () => {
    let localMocks: {
      gamePlayAugmenterService: {
        getBigBadWolfGamePlayEligibleTargets: jest.SpyInstance;
        getCupidGamePlayEligibleTargets: jest.SpyInstance;
        getFoxGamePlayEligibleTargets: jest.SpyInstance;
        getPiedPiperGamePlayEligibleTargets: jest.SpyInstance;
        getRavenGamePlayEligibleTargets: jest.SpyInstance;
        getScapegoatGamePlayEligibleTargets: jest.SpyInstance;
        getWhiteWerewolfGamePlayEligibleTargets: jest.SpyInstance;
        getWitchGamePlayEligibleTargets: jest.SpyInstance;
        getSingleTargetGamePlayEligibleTargets: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayAugmenterService: {
          getBigBadWolfGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as { getBigBadWolfGamePlayEligibleTargets }, "getBigBadWolfGamePlayEligibleTargets").mockImplementation(),
          getCupidGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as { getCupidGamePlayEligibleTargets }, "getCupidGamePlayEligibleTargets").mockImplementation(),
          getFoxGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as { getFoxGamePlayEligibleTargets }, "getFoxGamePlayEligibleTargets").mockImplementation(),
          getPiedPiperGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as { getPiedPiperGamePlayEligibleTargets }, "getPiedPiperGamePlayEligibleTargets").mockImplementation(),
          getRavenGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as { getRavenGamePlayEligibleTargets }, "getRavenGamePlayEligibleTargets").mockImplementation(),
          getScapegoatGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as { getScapegoatGamePlayEligibleTargets }, "getScapegoatGamePlayEligibleTargets").mockImplementation(),
          getWhiteWerewolfGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as { getWhiteWerewolfGamePlayEligibleTargets }, "getWhiteWerewolfGamePlayEligibleTargets").mockImplementation(),
          getWitchGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as { getWitchGamePlayEligibleTargets }, "getWitchGamePlayEligibleTargets").mockImplementation(),
          getSingleTargetGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as { getSingleTargetGamePlayEligibleTargets }, "getSingleTargetGamePlayEligibleTargets").mockImplementation(),
        },
      };
    });

    it("should return eligible targets when game play source name is not in getGamePlayEligibleTargetsMethods.", async() => {
      const gamePlay = createFakeGamePlayThreeBrothersMeetEachOther();
      const game = createFakeGame();

      await expect(services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game)).resolves.toBeUndefined();
    });

    it("should call getSingleTargetGamePlayEligibleTargets when game play source name is sheriff.", async() => {
      const gamePlay = createFakeGamePlaySheriffDelegates();
      const game = createFakeGame();

      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getSingleTargetGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call getSingleTargetGamePlayEligibleTargets when game play source name is werewolves.", async() => {
      const gamePlay = createFakeGamePlayWerewolvesEat();
      const game = createFakeGame();

      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getSingleTargetGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call getBigBadWolfGamePlayEligibleTargets when game play source name is big bad wolf.", async() => {
      const gamePlay = createFakeGamePlayBigBadWolfEats();
      const game = createFakeGame();

      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getBigBadWolfGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(gamePlay, game);
    });

    it("should call getCupidGamePlayEligibleTargets when game play source name is cupid.", async() => {
      const gamePlay = createFakeGamePlayCupidCharms();
      const game = createFakeGame();

      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getCupidGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call getFoxGamePlayEligibleTargets when game play source name is fox.", async() => {
      const gamePlay = createFakeGamePlayFoxSniffs();
      const game = createFakeGame();

      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getFoxGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call getSingleTargetGamePlayEligibleTargets when game play source name is guard.", async() => {
      const gamePlay = createFakeGamePlayGuardProtects();
      const game = createFakeGame();

      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getSingleTargetGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call getSingleTargetGamePlayEligibleTargets when game play source name is hunter.", async() => {
      const gamePlay = createFakeGamePlayHunterShoots();
      const game = createFakeGame();

      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getSingleTargetGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call getPiedPiperGamePlayEligibleTargets when game play source name is pied piper.", async() => {
      const gamePlay = createFakeGamePlayPiedPiperCharms();
      const game = createFakeGame();

      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getPiedPiperGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(gamePlay, game);
    });

    it("should call getRavenGamePlayEligibleTargets when game play source name is raven.", async() => {
      const gamePlay = createFakeGamePlayRavenMarks();
      const game = createFakeGame();

      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getRavenGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call getScapegoatGamePlayEligibleTargets when game play source name is scapegoat.", async() => {
      const gamePlay = createFakeGamePlayScapegoatBansVoting();
      const game = createFakeGame();

      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getScapegoatGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(gamePlay, game);
    });

    it("should call getSingleTargetGamePlayEligibleTargets when game play source name is seer.", async() => {
      const gamePlay = createFakeGamePlaySeerLooks();
      const game = createFakeGame();

      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getSingleTargetGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call getWhiteWerewolfGamePlayEligibleTargets when game play source name is white werewolf.", async() => {
      const gamePlay = createFakeGamePlayWhiteWerewolfEats();
      const game = createFakeGame();

      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getWhiteWerewolfGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(gamePlay, game);
    });

    it("should call getSingleTargetGamePlayEligibleTargets when game play source name is wild child.", async() => {
      const gamePlay = createFakeGamePlayWildChildChoosesModel();
      const game = createFakeGame();

      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getSingleTargetGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call getWitchGamePlayEligibleTargets when game play source name is witch.", async() => {
      const gamePlay = createFakeGamePlayWitchUsesPotions();
      const game = createFakeGame();

      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(gamePlay, game);
    });
  });

  describe("canSurvivorsSkipGamePlay", () => {
    it("should return false when game play action is elect sheriff.", () => {
      const gamePlay = createFakeGamePlay({ action: GamePlayActions.ELECT_SHERIFF });
      const game = createFakeGame();

      expect(services.gamePlayAugmenter["canSurvivorsSkipGamePlay"](gamePlay, game)).toBe(false);
    });

    it("should return false when game play action is vote and game play cause is angel presence.", () => {
      const gamePlay = createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE });
      const game = createFakeGame();

      expect(services.gamePlayAugmenter["canSurvivorsSkipGamePlay"](gamePlay, game)).toBe(false);
    });

    it("should return true when game play action is not elect sheriff and game options say that votes can be skipped.", () => {
      const gamePlay = createFakeGamePlay({ action: GamePlayActions.VOTE });
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) });
      const game = createFakeGame({ options });

      expect(services.gamePlayAugmenter["canSurvivorsSkipGamePlay"](gamePlay, game)).toBe(true);
    });

    it("should return true when game play action is not vote but because angel presence.", () => {
      const gamePlay = createFakeGamePlayRavenMarks({ cause: GamePlayCauses.ANGEL_PRESENCE });
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) });
      const game = createFakeGame({ options });

      expect(services.gamePlayAugmenter["canSurvivorsSkipGamePlay"](gamePlay, game)).toBe(true);
    });

    it("should return false when game play action is not elect sheriff and game options say that votes can't be skipped.", () => {
      const gamePlay = createFakeGamePlay({ action: GamePlayActions.VOTE });
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: false }) });
      const players = [
        createFakeWhiteWerewolfAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
        createFakeAngelAlivePlayer(),
        createFakeWitchAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players, options });

      expect(services.gamePlayAugmenter["canSurvivorsSkipGamePlay"](gamePlay, game)).toBe(false);
    });
  });

  describe("canBigBadWolfSkipGamePlay", () => {
    it("should return true when there are no players left to eat by werewolves.", () => {
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValueOnce([]);
      const game = createFakeGame();

      expect(services.gamePlayAugmenter["canBigBadWolfSkipGamePlay"](game)).toBe(true);
    });

    it("should return false when there are players left to eat by werewolves.", () => {
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValueOnce([createFakePlayer()]);
      const game = createFakeGame();

      expect(services.gamePlayAugmenter["canBigBadWolfSkipGamePlay"](game)).toBe(false);
    });
  });

  describe("canThiefSkipGamePlay", () => {
    it("should return true when game has undefined additional cards.", () => {
      const game = createFakeGame();

      expect(services.gamePlayAugmenter["canThiefSkipGamePlay"](game)).toBe(true);
    });

    it("should return true when game has no additional cards.", () => {
      const additionalCards = [];
      const game = createFakeGame({ additionalCards });

      expect(services.gamePlayAugmenter["canThiefSkipGamePlay"](game)).toBe(true);
    });

    it("should return true when thief doesn't have to choose between werewolves cards.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.SEER }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: true }) }) });
      const game = createFakeGame({ additionalCards, options });

      expect(services.gamePlayAugmenter["canThiefSkipGamePlay"](game)).toBe(true);
    });

    it("should return true when thief has to choose between werewolves cards but game options allow to skip.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: false }) }) });
      const game = createFakeGame({ additionalCards, options });

      expect(services.gamePlayAugmenter["canThiefSkipGamePlay"](game)).toBe(true);
    });

    it("should return false when thief has to choose between werewolves cards and game options don't allow to skip.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: true }) }) });
      const game = createFakeGame({ additionalCards, options });

      expect(services.gamePlayAugmenter["canThiefSkipGamePlay"](game)).toBe(false);
    });
  });

  describe("canGamePlayBeSkipped", () => {
    let localMocks: {
      gamePlayAugmenterService: {
        canSurvivorsSkipGamePlay: jest.SpyInstance;
        canBigBadWolfSkipGamePlay: jest.SpyInstance;
        canThiefSkipGamePlay: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayAugmenterService: {
          canSurvivorsSkipGamePlay: jest.spyOn(services.gamePlayAugmenter as unknown as { canSurvivorsSkipGamePlay }, "canSurvivorsSkipGamePlay").mockImplementation(),
          canBigBadWolfSkipGamePlay: jest.spyOn(services.gamePlayAugmenter as unknown as { canBigBadWolfSkipGamePlay }, "canBigBadWolfSkipGamePlay").mockImplementation(),
          canThiefSkipGamePlay: jest.spyOn(services.gamePlayAugmenter as unknown as { canThiefSkipGamePlay }, "canThiefSkipGamePlay").mockImplementation(),
        },
      };
    });

    it("should return false when game play source name is not in canBeSkippedPlayMethods.", () => {
      const gamePlay = createFakeGamePlayWildChildChoosesModel();
      const game = createFakeGame();

      expect(services.gamePlayAugmenter["canGamePlayBeSkipped"](gamePlay, game)).toBe(false);
    });

    it.each<{
      gamePlay: GamePlay;
      test: string;
    }>([
      {
        gamePlay: createFakeGamePlayLoversMeetEachOther(),
        test: "game play source name are lovers.",
      },
      {
        gamePlay: createFakeGamePlayCharmedMeetEachOther(),
        test: "game play source name are charmed.",
      },
      {
        gamePlay: createFakeGamePlayFoxSniffs(),
        test: "game play source name is fox.",
      },
      {
        gamePlay: createFakeGamePlayRavenMarks(),
        test: "game play source name is raven.",
      },
      {
        gamePlay: createFakeGamePlayScapegoatBansVoting(),
        test: "game play source name is scapegoat.",
      },
      {
        gamePlay: createFakeGamePlayTwoSistersMeetEachOther(),
        test: "game play source name are two sisters.",
      },
      {
        gamePlay: createFakeGamePlayThreeBrothersMeetEachOther(),
        test: "game play source name are three brothers.",
      },
      {
        gamePlay: createFakeGamePlayWhiteWerewolfEats(),
        test: "game play source name is white werewolf.",
      },
      {
        gamePlay: createFakeGamePlayWitchUsesPotions(),
        test: "game play source name is witch.",
      },
    ])("should return true when $test [#$#].", ({ gamePlay }) => {
      const game = createFakeGame();

      expect(services.gamePlayAugmenter["canGamePlayBeSkipped"](gamePlay, game)).toBe(true);
    });

    it("should call canSurvivorsSkipGamePlay method when game play source name is survivors.", () => {
      const gamePlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame();
      services.gamePlayAugmenter["canGamePlayBeSkipped"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.canSurvivorsSkipGamePlay).toHaveBeenCalledExactlyOnceWith(gamePlay, game);
    });

    it("should call canBigBadWolfSkipGamePlay method when game play source name is big bad wolf.", () => {
      const gamePlay = createFakeGamePlayBigBadWolfEats();
      const game = createFakeGame();
      services.gamePlayAugmenter["canGamePlayBeSkipped"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.canBigBadWolfSkipGamePlay).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call canThiefSkipGamePlay method when game play source name is thief.", () => {
      const gamePlay = createFakeGamePlayThiefChoosesCard();
      const game = createFakeGame();
      services.gamePlayAugmenter["canGamePlayBeSkipped"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.canThiefSkipGamePlay).toHaveBeenCalledExactlyOnceWith(game);
    });
  });
});