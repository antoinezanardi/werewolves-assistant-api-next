import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import type { Player } from "@/modules/game/schemas/player/player.schema";
import { GamePlayActions, GamePlayCauses } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups, PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import * as GameHelper from "@/modules/game/helpers/game.helper";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlayAugmenterService } from "@/modules/game/providers/services/game-play/game-play-augmenter.service";
import type { GamePlayEligibleTargets } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets.schema";
import type { InteractablePlayer } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/interactable-player.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";

import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlayVoting } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeGuardGameOptions, createFakePiedPiperGameOptions, createFakeRolesGameOptions, createFakeThiefGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeVotesGameOptions } from "@tests/factories/game/schemas/game-options/votes-game-options.schema.factory";
import { createFakeGamePlayEligibleTargetsBoundaries } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.schema.factory";
import { createFakeGamePlayEligibleTargets } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/game-play-eligible-targets.schema.factory";
import { createFakeInteractablePlayer } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/interactable-player/interactable-player.schema.factory";
import { createFakePlayerInteraction } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/interactable-player/player-interaction/player-interaction.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";
import { createFakeGamePlay, createFakeGamePlayBigBadWolfEats, createFakeGamePlayCharmedMeetEachOther, createFakeGamePlayCupidCharms, createFakeGamePlayFoxSniffs, createFakeGamePlayGuardProtects, createFakeGamePlayHunterShoots, createFakeGamePlayLoversMeetEachOther, createFakeGamePlayPiedPiperCharms, createFakeGamePlayRavenMarks, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySeerLooks, createFakeGamePlaySheriffDelegates, createFakeGamePlaySheriffSettlesVotes, createFakeGamePlaySurvivorsElectSheriff, createFakeGamePlaySurvivorsVote, createFakeGamePlayThiefChoosesCard, createFakeGamePlayThreeBrothersMeetEachOther, createFakeGamePlayTwoSistersMeetEachOther, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWildChildChoosesModel, createFakeGamePlayWitchUsesPotions } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCantVoteBySurvivorsPlayerAttribute, createFakeEatenByBigBadWolfPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeAngelAlivePlayer, createFakeHunterAlivePlayer, createFakeScapegoatAlivePlayer, createFakeSeerAlivePlayer, createFakeTwoSistersAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Play Augmenter Service", () => {
  let services: { gamePlayAugmenter: GamePlayAugmenterService };
  let mocks: {
    gameHelper: {
      getLeftToEatByWerewolvesPlayers: jest.SpyInstance;
      getLeftToEatByWhiteWerewolfPlayers: jest.SpyInstance;
      getLeftToCharmByPiedPiperPlayers: jest.SpyInstance;
      getAllowedToVotePlayers: jest.SpyInstance;
    };
    gameHistoryRecordService: {
      getLastGameHistoryTieInVotesRecord: jest.SpyInstance;
      getLastGameHistoryGuardProtectsRecord: jest.SpyInstance;
      getGameHistoryWitchUsesSpecificPotionRecords: jest.SpyInstance;
    };
    unexpectedExceptionFactory: {
      createCantFindLastNominatedPlayersUnexpectedException: jest.SpyInstance;
      createMalformedCurrentGamePlayUnexpectedException: jest.SpyInstance;
      createNoCurrentGamePlayUnexpectedException: jest.SpyInstance;
    };
  };

  beforeEach(async() => {
    mocks = {
      gameHelper: {
        getLeftToEatByWerewolvesPlayers: jest.spyOn(GameHelper, "getLeftToEatByWerewolvesPlayers"),
        getLeftToEatByWhiteWerewolfPlayers: jest.spyOn(GameHelper, "getLeftToEatByWhiteWerewolfPlayers"),
        getLeftToCharmByPiedPiperPlayers: jest.spyOn(GameHelper, "getLeftToCharmByPiedPiperPlayers"),
        getAllowedToVotePlayers: jest.spyOn(GameHelper, "getAllowedToVotePlayers"),
      },
      gameHistoryRecordService: {
        getLastGameHistoryTieInVotesRecord: jest.fn(),
        getLastGameHistoryGuardProtectsRecord: jest.fn(),
        getGameHistoryWitchUsesSpecificPotionRecords: jest.fn(),
      },
      unexpectedExceptionFactory: {
        createCantFindLastNominatedPlayersUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createCantFindLastNominatedPlayersUnexpectedException"),
        createMalformedCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createMalformedCurrentGamePlayUnexpectedException"),
        createNoCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoCurrentGamePlayUnexpectedException"),
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
      localMocks = {
        gamePlayAugmenterService: {
          getGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getGamePlayEligibleTargets;
          }, "getGamePlayEligibleTargets"),
        },
      };
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

  describe("setGamePlaySourcePlayers", () => {
    let localMocks: {
      gamePlayAugmenterService: {
        getExpectedPlayersToPlay: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = { gamePlayAugmenterService: { getExpectedPlayersToPlay: jest.spyOn(services.gamePlayAugmenter as unknown as { getExpectedPlayersToPlay }, "getExpectedPlayersToPlay") } };
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
      localMocks.gamePlayAugmenterService.getExpectedPlayersToPlay.mockReturnValue(expectedGamePlaySourcePlayers);

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
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValueOnce(null);

      await expect(async() => services.gamePlayAugmenter["getSheriffSettlesVotesGamePlayEligibleTargets"](game)).rejects.toThrow(undefined);
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
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValueOnce(gameHistoryRecord);

      await expect(async() => services.gamePlayAugmenter["getSheriffSettlesVotesGamePlayEligibleTargets"](game)).rejects.toThrow(undefined);
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
    it("should return all alive players as interactable players with 1 to 1 targets boundaries when called.", () => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
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
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getSheriffDelegatesGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getSheriffGamePlayEligibleTargets", () => {
    let localMocks: {
      gamePlayAugmenterService: {
        getSheriffSettlesVotesGamePlayEligibleTargets: jest.SpyInstance;
        getSheriffDelegatesGamePlayEligibleTargets: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayAugmenterService: {
          getSheriffSettlesVotesGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as { getSheriffSettlesVotesGamePlayEligibleTargets }, "getSheriffSettlesVotesGamePlayEligibleTargets").mockImplementation(),
          getSheriffDelegatesGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as { getSheriffDelegatesGamePlayEligibleTargets }, "getSheriffDelegatesGamePlayEligibleTargets").mockImplementation(),
        },
      };
    });

    it("should call get sheriff delegate game play eligible targets when game play action is delegate.", async() => {
      const gamePlay = createFakeGamePlaySheriffDelegates();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getSheriffGamePlayEligibleTargets"](game, gamePlay);

      expect(localMocks.gamePlayAugmenterService.getSheriffDelegatesGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
      expect(localMocks.gamePlayAugmenterService.getSheriffSettlesVotesGamePlayEligibleTargets).not.toHaveBeenCalled();
    });

    it("should call get sheriff settles votes game play eligible targets when game play action is settles votes.", async() => {
      const gamePlay = createFakeGamePlaySheriffSettlesVotes();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getSheriffGamePlayEligibleTargets"](game, gamePlay);

      expect(localMocks.gamePlayAugmenterService.getSheriffSettlesVotesGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
      expect(localMocks.gamePlayAugmenterService.getSheriffDelegatesGamePlayEligibleTargets).not.toHaveBeenCalled();
    });

    it("should throw error when game play action is not delegate nor settles votes.", async() => {
      const gamePlay = createFakeGamePlayRavenMarks();
      const game = createFakeGame();

      await expect(services.gamePlayAugmenter["getSheriffGamePlayEligibleTargets"](game, gamePlay)).rejects.toThrow(undefined);
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
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValueOnce(null);

      await expect(async() => services.gamePlayAugmenter["getSurvivorsVoteGamePlayInteractablePlayers"](game, gamePlay)).rejects.toThrow(undefined);
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
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValueOnce(createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ voting: gameRecordPlayVoting }) }));

      await expect(async() => services.gamePlayAugmenter["getSurvivorsVoteGamePlayInteractablePlayers"](game, gamePlay)).rejects.toThrow(undefined);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSurvivorsVoteGamePlayInteractablePlayers", { gameId: game._id });
    });
  });

  describe("getSurvivorsVoteGamePlayEligibleTargets", () => {
    let localMocks: {
      gamePlayAugmenterService: {
        canSurvivorsSkipGamePlay: jest.SpyInstance;
        getSurvivorsVoteGamePlayInteractablePlayers: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      mocks.gameHelper.getAllowedToVotePlayers.mockReturnValue([]);
      localMocks = {
        gamePlayAugmenterService: {
          canSurvivorsSkipGamePlay: jest.spyOn(services.gamePlayAugmenter as unknown as { canSurvivorsSkipGamePlay }, "canSurvivorsSkipGamePlay").mockImplementation(),
          getSurvivorsVoteGamePlayInteractablePlayers: jest.spyOn(services.gamePlayAugmenter as unknown as { getSurvivorsVoteGamePlayInteractablePlayers }, "getSurvivorsVoteGamePlayInteractablePlayers").mockImplementation(),
        },
      };
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
      localMocks.gamePlayAugmenterService.canSurvivorsSkipGamePlay.mockReturnValueOnce(false);
      localMocks.gamePlayAugmenterService.getSurvivorsVoteGamePlayInteractablePlayers.mockResolvedValueOnce([]);

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
      localMocks.gamePlayAugmenterService.canSurvivorsSkipGamePlay.mockReturnValueOnce(true);
      localMocks.gamePlayAugmenterService.getSurvivorsVoteGamePlayInteractablePlayers.mockResolvedValueOnce([]);

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

  describe("getSurvivorsGamePlayEligibleTargets", () => {
    let localMocks: {
      gamePlayAugmenterService: {
        getSurvivorsElectSheriffGamePlayEligibleTargets: jest.SpyInstance;
        getSurvivorsVoteGamePlayEligibleTargets: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayAugmenterService: {
          getSurvivorsElectSheriffGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as { getSurvivorsElectSheriffGamePlayEligibleTargets }, "getSurvivorsElectSheriffGamePlayEligibleTargets").mockImplementation(),
          getSurvivorsVoteGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as { getSurvivorsVoteGamePlayEligibleTargets }, "getSurvivorsVoteGamePlayEligibleTargets").mockImplementation(),
        },
      };
    });

    it("should call get survivors elect sheriff game play eligible targets when game play action is elect sheriff.", async() => {
      const gamePlay = createFakeGamePlaySurvivorsElectSheriff();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getSurvivorsGamePlayEligibleTargets"](game, gamePlay);

      expect(localMocks.gamePlayAugmenterService.getSurvivorsElectSheriffGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
      expect(localMocks.gamePlayAugmenterService.getSurvivorsVoteGamePlayEligibleTargets).not.toHaveBeenCalled();
    });

    it("should call get survivors vote game play eligible targets when game play action is vote.", async() => {
      const gamePlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getSurvivorsGamePlayEligibleTargets"](game, gamePlay);

      expect(localMocks.gamePlayAugmenterService.getSurvivorsVoteGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
      expect(localMocks.gamePlayAugmenterService.getSurvivorsElectSheriffGamePlayEligibleTargets).not.toHaveBeenCalled();
    });

    it("should throw error when game play action is not elect sheriff nor vote.", async() => {
      const gamePlay = createFakeGamePlayWildChildChoosesModel();
      const game = createFakeGame();

      await expect(services.gamePlayAugmenter["getSurvivorsGamePlayEligibleTargets"](game, gamePlay)).rejects.toThrow(undefined);
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
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValueOnce([
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
      mocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValueOnce([]);

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
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
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

  describe("getGuardGamePlayEligibleTargets", () => {
    it("should return all alive players as interactable targets with boundaries from 1 to 1 when there is no last protected players.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHistoryRecordService.getLastGameHistoryGuardProtectsRecord.mockResolvedValueOnce(null);
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.GUARD,
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

      await expect(services.gamePlayAugmenter["getGuardGamePlayEligibleTargets"](game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should return all alive players as interactable targets with boundaries from 1 to 1 when there is last protected players but guard can protect twice in a row.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ guard: createFakeGuardGameOptions({ canProtectTwice: true }) }) });
      const game = createFakeGame({ players, options });
      const gameHistoryRecord = createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ targets: [{ player: players[2] }] }) });
      mocks.gameHistoryRecordService.getLastGameHistoryGuardProtectsRecord.mockResolvedValueOnce(gameHistoryRecord);
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.GUARD,
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

      await expect(services.gamePlayAugmenter["getGuardGamePlayEligibleTargets"](game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should return all alive players but last protected player as interactable targets with boundaries from 1 to 1 when there is last protected players but guard can't protect twice in a row.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ guard: createFakeGuardGameOptions({ canProtectTwice: false }) }) });
      const game = createFakeGame({ players, options });
      const gameHistoryRecord = createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ targets: [{ player: players[2] }] }) });
      mocks.gameHistoryRecordService.getLastGameHistoryGuardProtectsRecord.mockResolvedValueOnce(gameHistoryRecord);
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.GUARD,
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

      await expect(services.gamePlayAugmenter["getGuardGamePlayEligibleTargets"](game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
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
      mocks.gameHelper.getLeftToCharmByPiedPiperPlayers.mockReturnValueOnce([
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
      mocks.gameHelper.getLeftToCharmByPiedPiperPlayers.mockReturnValueOnce([
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

  describe("getRavenGamePlayEligibleTargets", () => {
    it("should return all alive interactable players with 0 to 1 targets boundaries when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedInteraction = createFakePlayerInteraction({
        source: RoleNames.RAVEN,
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

      expect(services.gamePlayAugmenter["getRavenGamePlayEligibleTargets"](game)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
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
      mocks.gameHelper.getLeftToEatByWhiteWerewolfPlayers.mockReturnValueOnce([
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
      mocks.gameHelper.getLeftToEatByWhiteWerewolfPlayers.mockReturnValueOnce([]);
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
    it("should return boundaries from 0 to 2 when the witch didn't use any potion.", () => {
      const expectedBoundaries = createFakeGamePlayEligibleTargetsBoundaries({
        min: 0,
        max: 2,
      });

      expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargetsBoundaries"](false, false)).toStrictEqual<typeof expectedBoundaries>(expectedBoundaries);
    });

    it("should return boundaries from 0 to 1 when the witch used life potion.", () => {
      const expectedBoundaries = createFakeGamePlayEligibleTargetsBoundaries({
        min: 0,
        max: 1,
      });

      expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargetsBoundaries"](true, false)).toStrictEqual<typeof expectedBoundaries>(expectedBoundaries);
    });

    it("should return boundaries from 0 to 1 when the witch used death potion.", () => {
      const expectedBoundaries = createFakeGamePlayEligibleTargetsBoundaries({
        min: 0,
        max: 1,
      });

      expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargetsBoundaries"](false, true)).toStrictEqual<typeof expectedBoundaries>(expectedBoundaries);
    });

    it("should return boundaries from 0 to 0 when the witch used life potion and death potion.", () => {
      const expectedBoundaries = createFakeGamePlayEligibleTargetsBoundaries({
        min: 0,
        max: 0,
      });

      expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargetsBoundaries"](true, true)).toStrictEqual<typeof expectedBoundaries>(expectedBoundaries);
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

      expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargetsInteractablePlayers"](game, false, false)).toStrictEqual<typeof expectedInteractablePlayers>(expectedInteractablePlayers);
    });

    it("should not get interactable players when witch used both potions.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeEatenByBigBadWolfPlayerAttribute()] }),
        createFakeWitchAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargetsInteractablePlayers"](game, true, true)).toStrictEqual([]);
    });
  });

  describe("getWitchGamePlayEligibleTargets", () => {
    let localMocks: {
      gamePlayAugmenterService: {
        getWitchGamePlayEligibleTargetsBoundaries: jest.SpyInstance; getWitchGamePlayEligibleTargetsInteractablePlayers: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayAugmenterService: {
          getWitchGamePlayEligibleTargetsBoundaries: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getWitchGamePlayEligibleTargetsBoundaries;
          }, "getWitchGamePlayEligibleTargetsBoundaries").mockImplementation(),
          getWitchGamePlayEligibleTargetsInteractablePlayers: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getWitchGamePlayEligibleTargetsInteractablePlayers;
          }, "getWitchGamePlayEligibleTargetsInteractablePlayers").mockImplementation(),
        },
      };
    });

    it("should get interactable players from game when called and there is no history for life potion and death potion.", async() => {
      const game = createFakeGame();
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      await services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game);

      expect(localMocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsInteractablePlayers).toHaveBeenCalledExactlyOnceWith(game, false, false);
    });

    it("should get interactable players from game with life potion used when called and there is history for life potion.", async() => {
      const game = createFakeGame();
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([createFakeGameHistoryRecord()]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      await services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game);

      expect(localMocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsInteractablePlayers).toHaveBeenCalledExactlyOnceWith(game, true, false);
    });

    it("should get interactable players from game with death potion used when called and there is history for death potion.", async() => {
      const game = createFakeGame();
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([createFakeGameHistoryRecord()]);
      await services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game);

      expect(localMocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsInteractablePlayers).toHaveBeenCalledExactlyOnceWith(game, false, true);
    });

    it("should get targets boundaries for witch when called and no potions are used.", async() => {
      const game = createFakeGame();
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      await services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game);

      expect(localMocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(false, false);
    });

    it("should get targets boundaries for witch when called and life potion is used.", async() => {
      const game = createFakeGame();
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([createFakeGameHistoryRecord()]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      await services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game);

      expect(localMocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(true, false);
    });

    it("should get targets boundaries for witch when called and death potion is used.", async() => {
      const game = createFakeGame();
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([createFakeGameHistoryRecord()]);
      await services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game);

      expect(localMocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(false, true);
    });

    it("should return eligible targets with interactable players and boundaries when called.", async() => {
      const game = createFakeGame();
      const expectedBoundaries = createFakeGamePlayEligibleTargetsBoundaries();
      const expectedInteractablePlayers = [
        createFakeInteractablePlayer(),
        createFakeInteractablePlayer(),
        createFakeInteractablePlayer(),
      ];
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValue([]);
      localMocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsBoundaries.mockReturnValueOnce(expectedBoundaries);
      localMocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargetsInteractablePlayers.mockReturnValueOnce(expectedInteractablePlayers);
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: expectedInteractablePlayers,
        boundaries: expectedBoundaries,
      });

      await expect(services.gamePlayAugmenter["getWitchGamePlayEligibleTargets"](game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });

  describe("getGamePlayEligibleTargets", () => {
    let localMocks: {
      gamePlayAugmenterService: {
        getSheriffGamePlayEligibleTargets: jest.SpyInstance;
        getSurvivorsGamePlayEligibleTargets: jest.SpyInstance;
        getWerewolvesGamePlayEligibleTargets: jest.SpyInstance;
        getBigBadWolfGamePlayEligibleTargets: jest.SpyInstance;
        getCupidGamePlayEligibleTargets: jest.SpyInstance;
        getFoxGamePlayEligibleTargets: jest.SpyInstance;
        getGuardGamePlayEligibleTargets: jest.SpyInstance;
        getHunterGamePlayEligibleTargets: jest.SpyInstance;
        getPiedPiperGamePlayEligibleTargets: jest.SpyInstance;
        getRavenGamePlayEligibleTargets: jest.SpyInstance;
        getScapegoatGamePlayEligibleTargets: jest.SpyInstance;
        getSeerGamePlayEligibleTargets: jest.SpyInstance;
        getWhiteWerewolfGamePlayEligibleTargets: jest.SpyInstance;
        getWildChildGamePlayEligibleTargets: jest.SpyInstance;
        getWitchGamePlayEligibleTargets: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayAugmenterService: {
          getSheriffGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getSheriffGamePlayEligibleTargets;
          }, "getSheriffGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
          getSurvivorsGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getSurvivorsGamePlayEligibleTargets;
          }, "getSurvivorsGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
          getWerewolvesGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getWerewolvesGamePlayEligibleTargets;
          }, "getWerewolvesGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
          getBigBadWolfGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getBigBadWolfGamePlayEligibleTargets;
          }, "getBigBadWolfGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
          getCupidGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getCupidGamePlayEligibleTargets;
          }, "getCupidGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
          getFoxGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getFoxGamePlayEligibleTargets;
          }, "getFoxGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
          getGuardGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getGuardGamePlayEligibleTargets;
          }, "getGuardGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
          getHunterGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getHunterGamePlayEligibleTargets;
          }, "getHunterGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
          getPiedPiperGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getPiedPiperGamePlayEligibleTargets;
          }, "getPiedPiperGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
          getRavenGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getRavenGamePlayEligibleTargets;
          }, "getRavenGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
          getScapegoatGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getScapegoatGamePlayEligibleTargets;
          }, "getScapegoatGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
          getSeerGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getSeerGamePlayEligibleTargets;
          }, "getSeerGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
          getWhiteWerewolfGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getWhiteWerewolfGamePlayEligibleTargets;
          }, "getWhiteWerewolfGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
          getWildChildGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getWildChildGamePlayEligibleTargets;
          }, "getWildChildGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
          getWitchGamePlayEligibleTargets: jest.spyOn(services.gamePlayAugmenter as unknown as {
            getWitchGamePlayEligibleTargets;
          }, "getWitchGamePlayEligibleTargets").mockImplementation().mockReturnValue({}),
        },
      };
    });

    it("should return undefined when game play source name is not in getGamePlayEligibleTargetsMethods.", async() => {
      const gamePlay = createFakeGamePlayThreeBrothersMeetEachOther();
      const game = createFakeGame();

      await expect(services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game)).resolves.toBeUndefined();
    });

    it("should return undefined when interactable players are undefined.", async() => {
      const gamePlay = createFakeGamePlaySheriffDelegates();
      const game = createFakeGame();
      localMocks.gamePlayAugmenterService.getSheriffGamePlayEligibleTargets.mockReturnValueOnce(createFakeGamePlayEligibleTargets({}, { interactablePlayers: undefined }));

      await expect(services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game)).resolves.toBeUndefined();
    });

    it("should return undefined when game play method returns empty array of interactable players.", async() => {
      const gamePlay = createFakeGamePlaySheriffDelegates();
      const game = createFakeGame();
      localMocks.gamePlayAugmenterService.getSheriffGamePlayEligibleTargets.mockReturnValueOnce(createFakeGamePlayEligibleTargets({ interactablePlayers: [] }));

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
      localMocks.gamePlayAugmenterService.getSheriffGamePlayEligibleTargets.mockReturnValueOnce(expectedGamePlayEligibleTargets);

      await expect(services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game)).resolves.toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });

    it("should call get game play eligible targets for sheriff when game play source name is sheriff.", async() => {
      const gamePlay = createFakeGamePlaySheriffDelegates();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getSheriffGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call get game play eligible targets for survivors when game play source name is survivors.", async() => {
      const gamePlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getSurvivorsGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call get game play eligible targets for werewolves when game play source name is werewolves.", async() => {
      const gamePlay = createFakeGamePlayWerewolvesEat();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getWerewolvesGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for big bad wolf when game play source name is big bad wolf.", async() => {
      const gamePlay = createFakeGamePlayBigBadWolfEats();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getBigBadWolfGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for cupid when game play source name is cupid.", async() => {
      const gamePlay = createFakeGamePlayCupidCharms();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getCupidGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for fox when game play source name is fox.", async() => {
      const gamePlay = createFakeGamePlayFoxSniffs();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getFoxGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for guard when game play source name is guard.", async() => {
      const gamePlay = createFakeGamePlayGuardProtects();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getGuardGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for hunter when game play source name is hunter.", async() => {
      const gamePlay = createFakeGamePlayHunterShoots();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getHunterGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for pied piper when game play source name is pied piper.", async() => {
      const gamePlay = createFakeGamePlayPiedPiperCharms();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getPiedPiperGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for raven when game play source name is raven.", async() => {
      const gamePlay = createFakeGamePlayRavenMarks();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getRavenGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for scapegoat when game play source name is scapegoat.", async() => {
      const gamePlay = createFakeGamePlayScapegoatBansVoting();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getScapegoatGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for see when game play source name is see.", async() => {
      const gamePlay = createFakeGamePlaySeerLooks();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getSeerGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for white werewolf when game play source name is white werewolf.", async() => {
      const gamePlay = createFakeGamePlayWhiteWerewolfEats();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getWhiteWerewolfGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for wild child when game play source name is wild child.", async() => {
      const gamePlay = createFakeGamePlayWildChildChoosesModel();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getWildChildGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for witch when game play source name is witch.", async() => {
      const gamePlay = createFakeGamePlayWitchUsesPotions();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlayEligibleTargets"](gamePlay, game);

      expect(localMocks.gamePlayAugmenterService.getWitchGamePlayEligibleTargets).toHaveBeenCalledExactlyOnceWith(game);
    });
  });

  describe("canSurvivorsSkipGamePlay", () => {
    it("should return false when game play action is elect sheriff.", () => {
      const gamePlay = createFakeGamePlay({ action: GamePlayActions.ELECT_SHERIFF });
      const game = createFakeGame();

      expect(services.gamePlayAugmenter["canSurvivorsSkipGamePlay"](game, gamePlay)).toBe(false);
    });

    it("should return false when game play action is vote and game play cause is angel presence.", () => {
      const gamePlay = createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE });
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) });
      const game = createFakeGame({ options });

      expect(services.gamePlayAugmenter["canSurvivorsSkipGamePlay"](game, gamePlay)).toBe(false);
    });

    it("should return true when game play action is not elect sheriff and game options say that votes can be skipped.", () => {
      const gamePlay = createFakeGamePlay({ action: GamePlayActions.VOTE });
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) });
      const game = createFakeGame({ options });

      expect(services.gamePlayAugmenter["canSurvivorsSkipGamePlay"](game, gamePlay)).toBe(true);
    });

    it("should return true when game play action is not vote but because angel presence.", () => {
      const gamePlay = createFakeGamePlayRavenMarks({ cause: GamePlayCauses.ANGEL_PRESENCE });
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) });
      const game = createFakeGame({ options });

      expect(services.gamePlayAugmenter["canSurvivorsSkipGamePlay"](game, gamePlay)).toBe(true);
    });

    it("should return false when game play action is not elect sheriff and game options say that votes can't be skipped.", () => {
      const gamePlay = createFakeGamePlay({ action: GamePlayActions.VOTE });
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: false }) });
      const players = [
        createFakeWhiteWerewolfAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
        createFakeAngelAlivePlayer(),
        createFakeWitchAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({
        players,
        options,
      });

      expect(services.gamePlayAugmenter["canSurvivorsSkipGamePlay"](game, gamePlay)).toBe(false);
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
      const game = createFakeGame({
        additionalCards,
        options,
      });

      expect(services.gamePlayAugmenter["canThiefSkipGamePlay"](game)).toBe(true);
    });

    it("should return true when thief has to choose between werewolves cards but game options allow to skip.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: false }) }) });
      const game = createFakeGame({
        additionalCards,
        options,
      });

      expect(services.gamePlayAugmenter["canThiefSkipGamePlay"](game)).toBe(true);
    });

    it("should return false when thief has to choose between werewolves cards and game options don't allow to skip.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: true }) }) });
      const game = createFakeGame({
        additionalCards,
        options,
      });

      expect(services.gamePlayAugmenter["canThiefSkipGamePlay"](game)).toBe(false);
    });
  });

  describe("canGamePlayBeSkipped", () => {
    let localMocks: {
      gamePlayAugmenterService: {
        canSurvivorsSkipGamePlay: jest.SpyInstance; canBigBadWolfSkipGamePlay: jest.SpyInstance; canThiefSkipGamePlay: jest.SpyInstance;
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

      expect(services.gamePlayAugmenter["canGamePlayBeSkipped"](game, gamePlay)).toBe(false);
    });

    it.each<{
      gamePlay: GamePlay; test: string;
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

      expect(services.gamePlayAugmenter["canGamePlayBeSkipped"](game, gamePlay)).toBe(true);
    });

    it("should call canSurvivorsSkipGamePlay method when game play source name is survivors.", () => {
      const gamePlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame();
      services.gamePlayAugmenter["canGamePlayBeSkipped"](game, gamePlay);

      expect(localMocks.gamePlayAugmenterService.canSurvivorsSkipGamePlay).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call canBigBadWolfSkipGamePlay method when game play source name is big bad wolf.", () => {
      const gamePlay = createFakeGamePlayBigBadWolfEats();
      const game = createFakeGame();
      services.gamePlayAugmenter["canGamePlayBeSkipped"](game, gamePlay);

      expect(localMocks.gamePlayAugmenterService.canBigBadWolfSkipGamePlay).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call canThiefSkipGamePlay method when game play source name is thief.", () => {
      const gamePlay = createFakeGamePlayThiefChoosesCard();
      const game = createFakeGame();
      services.gamePlayAugmenter["canGamePlayBeSkipped"](game, gamePlay);

      expect(localMocks.gamePlayAugmenterService.canThiefSkipGamePlay).toHaveBeenCalledExactlyOnceWith(game);
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

      expect(() => services.gamePlayAugmenter["getExpectedPlayersToPlay"](game)).toThrow(undefined);
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