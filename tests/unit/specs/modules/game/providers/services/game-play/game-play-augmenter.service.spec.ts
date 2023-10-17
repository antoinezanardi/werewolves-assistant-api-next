import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { GamePlayActions, GamePlayCauses } from "@/modules/game/enums/game-play.enum";
import * as GameHelper from "@/modules/game/helpers/game.helper";
import { GamePlayAugmenterService } from "@/modules/game/providers/services/game-play/game-play-augmenter.service";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeRolesGameOptions, createFakeThiefGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeVotesGameOptions } from "@tests/factories/game/schemas/game-options/votes-game-options.schema.factory";
import { createFakeGamePlay, createFakeGamePlayBigBadWolfEats, createFakeGamePlayCharmedMeetEachOther, createFakeGamePlayFoxSniffs, createFakeGamePlayLoversMeetEachOther, createFakeGamePlayRavenMarks, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySurvivorsVote, createFakeGamePlayThiefChoosesCard, createFakeGamePlayThreeBrothersMeetEachOther, createFakeGamePlayTwoSistersMeetEachOther, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWildChildChoosesModel, createFakeGamePlayWitchUsesPotions } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCantVoteBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeAngelAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWitchAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
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