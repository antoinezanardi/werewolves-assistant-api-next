import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { GamePlayAugmenterService } from "@/modules/game/providers/services/game-play/game-play-augmenter.service";
import * as GameHelper from "@/modules/game/helpers/game.helper";

import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeVotesGameOptions } from "@tests/factories/game/schemas/game-options/votes-game-options.schema.factory";
import { createFakeGamePlay, createFakeGamePlayBigBadWolfEats, createFakeGamePlayCharmedMeetEachOther, createFakeGamePlayFoxSniffs, createFakeGamePlayLoversMeetEachOther, createFakeGamePlayRavenMarks, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySurvivorsVote, createFakeGamePlayThiefChoosesCard, createFakeGamePlayThreeBrothersMeetEachOther, createFakeGamePlayTwoSistersMeetEachOther, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWildChildChoosesModel, createFakeGamePlayWitchUsesPotions } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Play Augmenter Service", () => {
  let services: { gamePlayAugmenter: GamePlayAugmenterService };
  let mocks: {
    gameHelper: {
      getLeftToEatByWerewolvesPlayers: jest.SpyInstance;
      getLeftToEatByWhiteWerewolfPlayers: jest.SpyInstance;
    };
  };

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [GamePlayAugmenterService] }).compile();
    mocks = {
      gameHelper: {
        getLeftToEatByWerewolvesPlayers: jest.spyOn(GameHelper, "getLeftToEatByWerewolvesPlayers"),
        getLeftToEatByWhiteWerewolfPlayers: jest.spyOn(GameHelper, "getLeftToEatByWhiteWerewolfPlayers"),
      },
    };

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

  describe("canSurvivorsSkipGamePlay", () => {
    it("should return false when game play action is elect sheriff.", () => {
      const gamePlay = createFakeGamePlay({ action: GamePlayActions.ELECT_SHERIFF });
      const game = createFakeGame();

      expect(services.gamePlayAugmenter["canSurvivorsSkipGamePlay"](gamePlay, game)).toBe(false);
    });

    it("should return true when game play action is not elect sheriff and game options say that votes can be skipped.", () => {
      const gamePlay = createFakeGamePlay({ action: GamePlayActions.VOTE });
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) });
      const game = createFakeGame({ options });

      expect(services.gamePlayAugmenter["canSurvivorsSkipGamePlay"](gamePlay, game)).toBe(true);
    });

    it("should return false when game play action is not elect sheriff and game options say that votes can't be skipped.", () => {
      const gamePlay = createFakeGamePlay({ action: GamePlayActions.VOTE });
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: false }) });
      const game = createFakeGame({ options });

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

  describe("canWhiteWerewolfSkipGamePlay", () => {
    it("should return true when there are no players left to eat by white werewolf.", () => {
      mocks.gameHelper.getLeftToEatByWhiteWerewolfPlayers.mockReturnValueOnce([]);
      const game = createFakeGame();

      expect(services.gamePlayAugmenter["canWhiteWerewolfSkipGamePlay"](game)).toBe(true);
    });

    it("should return false when there are players left to eat by white werewolf.", () => {
      mocks.gameHelper.getLeftToEatByWhiteWerewolfPlayers.mockReturnValueOnce([createFakePlayer()]);
      const game = createFakeGame();

      expect(services.gamePlayAugmenter["canWhiteWerewolfSkipGamePlay"](game)).toBe(false);
    });
  });

  describe("canGamePlayBeSkipped", () => {
    let localMocks: {
      gamePlayAugmenterService: {
        canSurvivorsSkipGamePlay: jest.SpyInstance;
        canBigBadWolfSkipGamePlay: jest.SpyInstance;
        canWhiteWerewolfSkipGamePlay: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayAugmenterService: {
          canSurvivorsSkipGamePlay: jest.spyOn(services.gamePlayAugmenter as unknown as { canSurvivorsSkipGamePlay }, "canSurvivorsSkipGamePlay").mockImplementation(),
          canBigBadWolfSkipGamePlay: jest.spyOn(services.gamePlayAugmenter as unknown as { canBigBadWolfSkipGamePlay }, "canBigBadWolfSkipGamePlay").mockImplementation(),
          canWhiteWerewolfSkipGamePlay: jest.spyOn(services.gamePlayAugmenter as unknown as { canWhiteWerewolfSkipGamePlay }, "canWhiteWerewolfSkipGamePlay").mockImplementation(),
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
        gamePlay: createFakeGamePlayThiefChoosesCard(),
        test: "game play source name is thief.",
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

    it("should call canWhiteWerewolfSkipGamePlay method when game play source name is white werewolf.", () => {
      const gamePlay = createFakeGamePlayWhiteWerewolfEats();
      const game = createFakeGame();
      services.gamePlayAugmenter["canGamePlayBeSkipped"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.canWhiteWerewolfSkipGamePlay).toHaveBeenCalledExactlyOnceWith(game);
    });
  });
});