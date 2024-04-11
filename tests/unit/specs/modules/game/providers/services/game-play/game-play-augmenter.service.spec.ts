import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import * as GameHelper from "@/modules/game/helpers/game.helpers";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlayAugmenterService } from "@/modules/game/providers/services/game-play/game-play-augmenter.service";
import type { GamePlaySourceInteraction } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";

import { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enum";
import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";
import { UnexpectedException } from "@/shared/exception/types/unexpected-exception.types";

import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlayVoting } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeCupidGameOptions, createFakeDefenderGameOptions, createFakePiedPiperGameOptions, createFakeRolesGameOptions, createFakeThiefGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options/game-roles-options.schema.factory";
import { createFakeVotesGameOptions } from "@tests/factories/game/schemas/game-options/votes-game-options.schema.factory";
import { createFakeGamePlaySourceInteraction } from "@tests/factories/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source/game-play-source.schema.factory";
import { createFakeGamePlay, createFakeGamePlayAccursedWolfFatherInfects, createFakeGamePlayActorChoosesCard, createFakeGamePlayBearTamerGrowls, createFakeGamePlayBigBadWolfEats, createFakeGamePlayCharmedMeetEachOther, createFakeGamePlayCupidCharms, createFakeGamePlayDefenderProtects, createFakeGamePlayFoxSniffs, createFakeGamePlayHunterShoots, createFakeGamePlayLoversMeetEachOther, createFakeGamePlayPiedPiperCharms, createFakeGamePlayScandalmongerMarks, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySeerLooks, createFakeGamePlaySheriffDelegates, createFakeGamePlaySheriffSettlesVotes, createFakeGamePlayStutteringJudgeRequestsAnotherVote, createFakeGamePlaySurvivorsBuryDeadBodies, createFakeGamePlaySurvivorsElectSheriff, createFakeGamePlaySurvivorsVote, createFakeGamePlayThiefChoosesCard, createFakeGamePlayThreeBrothersMeetEachOther, createFakeGamePlayTwoSistersMeetEachOther, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWildChildChoosesModel, createFakeGamePlayWitchUsesPotions } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
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
      getGamePlaySourceInteractions: jest.SpyInstance;
      getExpectedPlayersToPlay: jest.SpyInstance;
      getSheriffSettlesVotesGamePlaySourceInteractions: jest.SpyInstance;
      getSheriffDelegatesGamePlaySourceInteractions: jest.SpyInstance;
      getSheriffGamePlaySourceInteractions: jest.SpyInstance;
      getSurvivorsVoteGamePlaySourceInteractionEligibleTargets: jest.SpyInstance;
      getSurvivorsVoteGamePlaySourceInteractions: jest.SpyInstance;
      getSurvivorsElectSheriffGamePlaySourceInteractions: jest.SpyInstance;
      getSurvivorsGamePlaySourceInteractions: jest.SpyInstance;
      getWerewolvesEatGamePlaySourceInteractions: jest.SpyInstance;
      getWerewolvesGamePlaySourceInteractions: jest.SpyInstance;
      getWhiteWerewolfEatGamePlaySourceInteractions: jest.SpyInstance;
      getWhiteWerewolfGamePlaySourceInteractions: jest.SpyInstance;
      getWitchUsesPotionsGamePlaySourceInteractions: jest.SpyInstance;
      getWitchGamePlaySourceInteractions: jest.SpyInstance;
      getBigBadWolfEatGamePlaySourceInteractions: jest.SpyInstance;
      getBigBadWolfGamePlaySourceInteractions: jest.SpyInstance;
      getFoxSniffsGamePlaySourceInteractions: jest.SpyInstance;
      getFoxGamePlaySourceInteractions: jest.SpyInstance;
      getDefenderProtectsGamePlaySourceInteractions: jest.SpyInstance;
      getDefenderGamePlaySourceInteractions: jest.SpyInstance;
      getHunterShootsGamePlaySourceInteractions: jest.SpyInstance;
      getHunterGamePlaySourceInteractions: jest.SpyInstance;
      getLoversMeetEachOtherGamePlaySourceInteractions: jest.SpyInstance;
      getLoversGamePlaySourceInteractions: jest.SpyInstance;
      getPiedPiperCharmsGamePlaySourceInteractions: jest.SpyInstance;
      getPiedPiperGamePlaySourceInteractions: jest.SpyInstance;
      getScandalmongerMarksGamePlaySourceInteractions: jest.SpyInstance;
      getScandalmongerGamePlaySourceInteractions: jest.SpyInstance;
      getScapegoatBansVotingGamePlaySourceInteractions: jest.SpyInstance;
      getScapegoatGamePlaySourceInteractions: jest.SpyInstance;
      getSeerLooksGamePlaySourceInteractions: jest.SpyInstance;
      getSeerGamePlaySourceInteractions: jest.SpyInstance;
      getThiefChoosesCardGamePlaySourceInteractions: jest.SpyInstance;
      getThiefGamePlaySourceInteractions: jest.SpyInstance;
      getThreeBrothersMeetEachOtherGamePlaySourceInteractions: jest.SpyInstance;
      getThreeBrothersGamePlaySourceInteractions: jest.SpyInstance;
      getTwoSistersMeetEachOtherGamePlaySourceInteractions: jest.SpyInstance;
      getTwoSistersGamePlaySourceInteractions: jest.SpyInstance;
      getWildChildChoosesModelGamePlaySourceInteractions: jest.SpyInstance;
      getWildChildGamePlaySourceInteractions: jest.SpyInstance;
      getCharmedMeetEachOtherGamePlaySourceInteractions: jest.SpyInstance;
      getCharmedGamePlaySourceInteractions: jest.SpyInstance;
      canSurvivorsSkipGamePlay: jest.SpyInstance;
      getSurvivorsBuryDeadBodiesGamePlaySourceDevotedServantInteraction: jest.SpyInstance;
      getSurvivorsBuryDeadBodiesGamePlaySourceInteractions: jest.SpyInstance;
      getWitchGamePlaySourceGiveLifePotionInteraction: jest.SpyInstance;
      getWitchGamePlaySourceGiveDeathPotionInteraction: jest.SpyInstance;
      getCupidGamePlaySourceInteractions: jest.SpyInstance;
      getAccursedWolfFatherGamePlaySourceInteractions: jest.SpyInstance;
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
      getGameHistoryAccursedWolfFatherInfectsWithTargetRecords: jest.SpyInstance;
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
        getGamePlaySourceInteractions: jest.fn(),
        getExpectedPlayersToPlay: jest.fn(),
        getSheriffSettlesVotesGamePlaySourceInteractions: jest.fn(),
        getSheriffDelegatesGamePlaySourceInteractions: jest.fn(),
        getSheriffGamePlaySourceInteractions: jest.fn(),
        getSurvivorsVoteGamePlaySourceInteractionEligibleTargets: jest.fn(),
        getSurvivorsBuryDeadBodiesGamePlaySourceDevotedServantInteraction: jest.fn(),
        getSurvivorsVoteGamePlaySourceInteractions: jest.fn(),
        getSurvivorsElectSheriffGamePlaySourceInteractions: jest.fn(),
        getSurvivorsGamePlaySourceInteractions: jest.fn(),
        getWerewolvesEatGamePlaySourceInteractions: jest.fn(),
        getWerewolvesGamePlaySourceInteractions: jest.fn(),
        getWhiteWerewolfEatGamePlaySourceInteractions: jest.fn(),
        getWhiteWerewolfGamePlaySourceInteractions: jest.fn(),
        getWitchUsesPotionsGamePlaySourceInteractions: jest.fn(),
        getWitchGamePlaySourceInteractions: jest.fn(),
        getBigBadWolfEatGamePlaySourceInteractions: jest.fn(),
        getBigBadWolfGamePlaySourceInteractions: jest.fn(),
        getFoxSniffsGamePlaySourceInteractions: jest.fn(),
        getFoxGamePlaySourceInteractions: jest.fn(),
        getDefenderProtectsGamePlaySourceInteractions: jest.fn(),
        getDefenderGamePlaySourceInteractions: jest.fn(),
        getHunterShootsGamePlaySourceInteractions: jest.fn(),
        getHunterGamePlaySourceInteractions: jest.fn(),
        getLoversMeetEachOtherGamePlaySourceInteractions: jest.fn(),
        getLoversGamePlaySourceInteractions: jest.fn(),
        getPiedPiperCharmsGamePlaySourceInteractions: jest.fn(),
        getPiedPiperGamePlaySourceInteractions: jest.fn(),
        getScandalmongerMarksGamePlaySourceInteractions: jest.fn(),
        getScandalmongerGamePlaySourceInteractions: jest.fn(),
        getScapegoatBansVotingGamePlaySourceInteractions: jest.fn(),
        getScapegoatGamePlaySourceInteractions: jest.fn(),
        getSeerLooksGamePlaySourceInteractions: jest.fn(),
        getSeerGamePlaySourceInteractions: jest.fn(),
        getThiefChoosesCardGamePlaySourceInteractions: jest.fn(),
        getThiefGamePlaySourceInteractions: jest.fn(),
        getThreeBrothersMeetEachOtherGamePlaySourceInteractions: jest.fn(),
        getThreeBrothersGamePlaySourceInteractions: jest.fn(),
        getTwoSistersMeetEachOtherGamePlaySourceInteractions: jest.fn(),
        getTwoSistersGamePlaySourceInteractions: jest.fn(),
        getWildChildChoosesModelGamePlaySourceInteractions: jest.fn(),
        getWildChildGamePlaySourceInteractions: jest.fn(),
        getCharmedMeetEachOtherGamePlaySourceInteractions: jest.fn(),
        getCharmedGamePlaySourceInteractions: jest.fn(),
        getSurvivorsBuryDeadBodiesGamePlaySourceInteractions: jest.fn(),
        canSurvivorsSkipGamePlay: jest.fn(),
        getWitchGamePlaySourceGiveDeathPotionInteraction: jest.fn(),
        getWitchGamePlaySourceGiveLifePotionInteraction: jest.fn(),
        getAccursedWolfFatherGamePlaySourceInteractions: jest.fn(),
        getCupidGamePlaySourceInteractions: jest.fn(),
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
        getGameHistoryAccursedWolfFatherInfectsWithTargetRecords: jest.fn(),
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

  describe("setGamePlaySourceInteractions", () => {
    beforeEach(() => {
      mocks.gamePlayAugmenterService.getGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as { getGamePlaySourceInteractions }, "getGamePlaySourceInteractions");
    });

    it("should return game play with source interactions when called.", async() => {
      const gamePlay = createFakeGamePlay();
      const game = createFakeGame();
      const expectedInteractions = [
        createFakeGamePlaySourceInteraction(),
        createFakeGamePlaySourceInteraction(),
        createFakeGamePlaySourceInteraction(),
      ];
      const expectedGamePlay = createFakeGamePlay({
        ...gamePlay,
        source: createFakeGamePlaySource({
          ...gamePlay.source,
          interactions: expectedInteractions,
        }),
      });
      mocks.gamePlayAugmenterService.getGamePlaySourceInteractions.mockResolvedValueOnce(expectedInteractions);

      await expect(services.gamePlayAugmenter.setGamePlaySourceInteractions(gamePlay, game)).resolves.toStrictEqual<GamePlay>(expectedGamePlay);
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

  describe("getSheriffSettlesVotesGamePlaySourceInteractions", () => {
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

      await expect(services.gamePlayAugmenter["getSheriffSettlesVotesGamePlaySourceInteractions"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSheriffSettlesVotesGamePlaySourceInteractions", { gameId: game._id });
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

      await expect(services.gamePlayAugmenter["getSheriffSettlesVotesGamePlaySourceInteractions"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSheriffSettlesVotesGamePlaySourceInteractions", { gameId: game._id });
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
      const expectedInteraction = createFakeGamePlaySourceInteraction({
        source: "sheriff",
        type: "sentence-to-death",
        eligibleTargets: [players[0], players[1]],
        boundaries: {
          min: 1,
          max: 1,
        },
      });

      await expect(services.gamePlayAugmenter["getSheriffSettlesVotesGamePlaySourceInteractions"](game)).resolves.toStrictEqual<GamePlaySourceInteraction[]>([expectedInteraction]);
    });
  });

  describe("getSheriffDelegatesGamePlaySourceInteractions", () => {
    it("should return all alive and not sheriff players as eligible targets with 1 to 1 targets boundaries when called.", () => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "sheriff",
        type: "transfer-sheriff-role",
        eligibleTargets: [players[0], players[3]],
        boundaries: {
          min: 1,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getSheriffDelegatesGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });
  });

  describe("getSheriffGamePlaySourceInteractions", () => {
    beforeEach(() => {
      mocks.gamePlayAugmenterService.getSheriffSettlesVotesGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as { getSheriffSettlesVotesGamePlaySourceInteractions }, "getSheriffSettlesVotesGamePlaySourceInteractions").mockImplementation();
      mocks.gamePlayAugmenterService.getSheriffDelegatesGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as { getSheriffDelegatesGamePlaySourceInteractions }, "getSheriffDelegatesGamePlaySourceInteractions").mockImplementation();
    });

    it("should call get sheriff delegates game play source interactions when game play action is delegate.", async() => {
      const gamePlay = createFakeGamePlaySheriffDelegates();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getSheriffGamePlaySourceInteractions"](game, gamePlay);

      expect(mocks.gamePlayAugmenterService.getSheriffDelegatesGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
      expect(mocks.gamePlayAugmenterService.getSheriffSettlesVotesGamePlaySourceInteractions).not.toHaveBeenCalled();
    });

    it("should call get sheriff settles votes game play source interactions when game play action is settles votes.", async() => {
      const gamePlay = createFakeGamePlaySheriffSettlesVotes();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getSheriffGamePlaySourceInteractions"](game, gamePlay);

      expect(mocks.gamePlayAugmenterService.getSheriffSettlesVotesGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
      expect(mocks.gamePlayAugmenterService.getSheriffDelegatesGamePlaySourceInteractions).not.toHaveBeenCalled();
    });

    it("should throw error when game play action is not delegate nor settles votes.", async() => {
      const gamePlay = createFakeGamePlayScandalmongerMarks();
      const game = createFakeGame();
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.MALFORMED_CURRENT_GAME_PLAY, { gamePlayAction: gamePlay.action });
      mocks.unexpectedExceptionFactory.createMalformedCurrentGamePlayUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayAugmenter["getSheriffGamePlaySourceInteractions"](game, gamePlay)).rejects.toThrow(mockedError);
      expect(mocks.unexpectedExceptionFactory.createMalformedCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSheriffGamePlaySourceInteractions", gamePlay, game._id);
    });
  });

  describe("getSurvivorsVoteGamePlaySourceInteractionEligibleTargets", () => {
    it("should return all alive players when votes are not cause of previous tie in votes.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySurvivorsVote({ cause: "angel-presence" });
      const expectedPlayers = [
        createFakePlayer(players[0]),
        createFakePlayer(players[1]),
        createFakePlayer(players[3]),
      ];

      await expect(services.gamePlayAugmenter["getSurvivorsVoteGamePlaySourceInteractionEligibleTargets"](game, gamePlay)).resolves.toStrictEqual<Player[]>(expectedPlayers);
    });

    it("should return nominated players when votes are cause of previous tie in votes.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySurvivorsVote({ cause: "previous-votes-were-in-ties" });
      const gameHistoryRecordPlayVoting = createFakeGameHistoryRecordPlayVoting({ nominatedPlayers: [players[0], players[1]] });
      const gameHistoryRecord = createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ voting: gameHistoryRecordPlayVoting }) });
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValueOnce(gameHistoryRecord);
      const expectedPlayers = [
        createFakePlayer(players[0]),
        createFakePlayer(players[1]),
      ];

      await expect(services.gamePlayAugmenter["getSurvivorsVoteGamePlaySourceInteractionEligibleTargets"](game, gamePlay)).resolves.toStrictEqual<Player[]>(expectedPlayers);
    });

    it("should throw error when there is no last tie in votes record.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySurvivorsVote({ cause: "previous-votes-were-in-ties" });
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.CANT_FIND_LAST_NOMINATED_PLAYERS, { gameId: game._id.toString() });
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValueOnce(null);
      mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException.mockReturnValue(mockedError);

      await expect(async() => services.gamePlayAugmenter["getSurvivorsVoteGamePlaySourceInteractionEligibleTargets"](game, gamePlay)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSurvivorsVoteGamePlaySourceInteractionEligibleTargets", { gameId: game._id });
    });

    it("should throw error when there is no nominated players in last tie in votes record.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySurvivorsVote({ cause: "previous-votes-were-in-ties" });
      const gameRecordPlayVoting = createFakeGameHistoryRecordPlayVoting({ nominatedPlayers: [] });
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.CANT_FIND_LAST_NOMINATED_PLAYERS, { gameId: game._id.toString() });
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValueOnce(createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ voting: gameRecordPlayVoting }) }));
      mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException.mockReturnValue(mockedError);

      await expect(async() => services.gamePlayAugmenter["getSurvivorsVoteGamePlaySourceInteractionEligibleTargets"](game, gamePlay)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastNominatedPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSurvivorsVoteGamePlaySourceInteractionEligibleTargets", { gameId: game._id });
    });
  });

  describe("getSurvivorsVoteGamePlaySourceInteractions", () => {
    beforeEach(() => {
      mocks.gameHelper.getAllowedToVotePlayers.mockReturnValue([]);
      mocks.gamePlayAugmenterService.canSurvivorsSkipGamePlay = jest.spyOn(services.gamePlayAugmenter as unknown as { canSurvivorsSkipGamePlay }, "canSurvivorsSkipGamePlay").mockImplementation();
      mocks.gamePlayAugmenterService.getSurvivorsVoteGamePlaySourceInteractionEligibleTargets = jest.spyOn(services.gamePlayAugmenter as unknown as { getSurvivorsVoteGamePlaySourceInteractionEligibleTargets }, "getSurvivorsVoteGamePlaySourceInteractionEligibleTargets").mockImplementation();
    });

    it("should return no players as eligible targets with 1 to alive players length when votes can't be skipped.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer(),
      ];
      const gamePlay = createFakeGamePlaySurvivorsVote({ canBeSkipped: false });
      const game = createFakeGame({ players });
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "survivors",
        type: "vote",
        eligibleTargets: [],
        boundaries: {
          min: 1,
          max: 3,
        },
      });
      mocks.gameHelper.getAllowedToVotePlayers.mockReturnValueOnce([players[0], players[1], players[3]]);
      mocks.gamePlayAugmenterService.canSurvivorsSkipGamePlay.mockReturnValueOnce(false);
      mocks.gamePlayAugmenterService.getSurvivorsVoteGamePlaySourceInteractionEligibleTargets.mockResolvedValueOnce([]);

      await expect(services.gamePlayAugmenter["getSurvivorsVoteGamePlaySourceInteractions"](game, gamePlay)).resolves.toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });

    it("should return alive players as eligible targets with boundaries from 0 to alive players length when votes can be skipped.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer(),
      ];
      const gamePlay = createFakeGamePlaySurvivorsVote({ canBeSkipped: true });
      const game = createFakeGame({ players });
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "survivors",
        type: "vote",
        eligibleTargets: [],
        boundaries: {
          min: 0,
          max: 3,
        },
      });
      mocks.gameHelper.getAllowedToVotePlayers.mockReturnValueOnce([players[0], players[1], players[3]]);
      mocks.gamePlayAugmenterService.canSurvivorsSkipGamePlay.mockReturnValueOnce(true);
      mocks.gamePlayAugmenterService.getSurvivorsVoteGamePlaySourceInteractionEligibleTargets.mockResolvedValueOnce([]);

      await expect(services.gamePlayAugmenter["getSurvivorsVoteGamePlaySourceInteractions"](game, gamePlay)).resolves.toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });
  });

  describe("getSurvivorsElectSheriffGamePlaySourceInteractions", () => {
    it("should return alive players as eligible targets with boundaries from 1 to 1 when called.", async() => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer(),
      ];
      const gamePlay = createFakeGamePlaySurvivorsElectSheriff();
      const game = createFakeGame({ players });
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "survivors",
        type: "choose-as-sheriff",
        eligibleTargets: [players[0], players[1], players[3]],
        boundaries: {
          min: 1,
          max: 3,
        },
      });

      await expect(services.gamePlayAugmenter["getSurvivorsElectSheriffGamePlaySourceInteractions"](game, gamePlay)).resolves.toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });
  });

  describe("getSurvivorsBuryDeadBodiesGamePlaySourceDevotedServantInteraction", () => {
    it("should return undefined when there is no devoted servant in the game.", () => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const deadPlayers = [
        createFakeDeadPlayer({ ...players[0], isAlive: false, death: createFakePlayerDeath() }),
        createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerDeath() }),
      ];

      expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlaySourceDevotedServantInteraction"](game, deadPlayers)).toBeUndefined();
    });

    it("should return undefined when devoted servant is dead.", () => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });
      const deadPlayers = [
        createFakeDeadPlayer({ ...players[0], isAlive: false, death: createFakePlayerDeath() }),
        createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerDeath() }),
      ];

      expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlaySourceDevotedServantInteraction"](game, deadPlayers)).toBeUndefined();
    });

    it("should return undefined when devoted servant is powerless.", () => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });
      const deadPlayers = [
        createFakeDeadPlayer({ ...players[0], isAlive: false, death: createFakePlayerDeath() }),
        createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerDeath() }),
      ];

      expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlaySourceDevotedServantInteraction"](game, deadPlayers)).toBeUndefined();
    });

    it("should return undefined when devoted servant is in love.", () => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeDevotedServantAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });
      const deadPlayers = [
        createFakeDeadPlayer({ ...players[0], isAlive: false, death: createFakePlayerDeath() }),
        createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerDeath() }),
      ];

      expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlaySourceDevotedServantInteraction"](game, deadPlayers)).toBeUndefined();
    });

    it("should return interaction for devoted servant with dead players as eligible targets with boundaries from 0 to 1 when called.", () => {
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
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "devoted-servant",
        type: "steal-role",
        eligibleTargets: [deadPlayers[0], deadPlayers[1]],
        boundaries: {
          min: 0,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlaySourceDevotedServantInteraction"](game, deadPlayers)).toStrictEqual<GamePlaySourceInteraction>(expectedGamePlaySourceInteraction);
    });
  });

  describe("getSurvivorsBuryDeadBodiesGamePlaySourceInteractions", () => {
    beforeEach(() => {
      mocks.gamePlayAugmenterService.getSurvivorsBuryDeadBodiesGamePlaySourceDevotedServantInteraction = jest.spyOn(services.gamePlayAugmenter as unknown as { getSurvivorsBuryDeadBodiesGamePlaySourceDevotedServantInteraction }, "getSurvivorsBuryDeadBodiesGamePlaySourceDevotedServantInteraction").mockImplementation();
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

      await expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlaySourceInteractions"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastDeadPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSurvivorsBuryDeadBodiesGamePlaySourceInteractions", { gameId: game._id });
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

      await expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlaySourceInteractions"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastDeadPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSurvivorsBuryDeadBodiesGamePlaySourceInteractions", { gameId: game._id });
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

      await expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlaySourceInteractions"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastDeadPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSurvivorsBuryDeadBodiesGamePlaySourceInteractions", { gameId: game._id });
    });

    it("should return inconsequential survivors bury dead bodies game play source interaction when called.", async() => {
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
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "survivors",
        type: "bury",
        eligibleTargets: deadPlayers,
        boundaries: {
          min: 0,
          max: 2,
        },
        isInconsequential: true,
      });

      await expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlaySourceInteractions"](game)).resolves.toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });

    it("should return devoted servant steals role game play source interaction plus bury interactions when there is devoted servant interaction.", async() => {
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
      const expectedGamePlaySourceInteractionStealRole = createFakeGamePlaySourceInteraction({
        source: "devoted-servant",
        type: "steal-role",
        eligibleTargets: deadPlayers,
        boundaries: {
          min: 0,
          max: 1,
        },
      });
      mocks.gamePlayAugmenterService.getSurvivorsBuryDeadBodiesGamePlaySourceDevotedServantInteraction.mockReturnValueOnce(expectedGamePlaySourceInteractionStealRole);
      const expectedGamePlaySourceInteractionBury = createFakeGamePlaySourceInteraction({
        source: "survivors",
        type: "bury",
        eligibleTargets: deadPlayers,
        boundaries: {
          min: 0,
          max: 2,
        },
        isInconsequential: true,
      });
      const expectedInteractions = [expectedGamePlaySourceInteractionBury, expectedGamePlaySourceInteractionStealRole];

      await expect(services.gamePlayAugmenter["getSurvivorsBuryDeadBodiesGamePlaySourceInteractions"](game)).resolves.toStrictEqual<GamePlaySourceInteraction[]>(expectedInteractions);
    });
  });

  describe("getSurvivorsGamePlaySourceInteractions", () => {
    beforeEach(() => {
      mocks.gamePlayAugmenterService.getSurvivorsElectSheriffGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as { getSurvivorsElectSheriffGamePlaySourceInteractions }, "getSurvivorsElectSheriffGamePlaySourceInteractions").mockImplementation();
      mocks.gamePlayAugmenterService.getSurvivorsVoteGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as { getSurvivorsVoteGamePlaySourceInteractions }, "getSurvivorsVoteGamePlaySourceInteractions").mockImplementation();
      mocks.gamePlayAugmenterService.getSurvivorsBuryDeadBodiesGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as { getSurvivorsBuryDeadBodiesGamePlaySourceInteractions }, "getSurvivorsBuryDeadBodiesGamePlaySourceInteractions").mockImplementation();
    });

    it("should call get survivors bury dead bodies game play eligible targets when game play action is bury dead bodies.", async() => {
      const gamePlay = createFakeGamePlaySurvivorsBuryDeadBodies();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getSurvivorsGamePlaySourceInteractions"](game, gamePlay);

      expect(mocks.gamePlayAugmenterService.getSurvivorsBuryDeadBodiesGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get survivors elect sheriff game play eligible targets when game play action is elect sheriff.", async() => {
      const gamePlay = createFakeGamePlaySurvivorsElectSheriff();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getSurvivorsGamePlaySourceInteractions"](game, gamePlay);

      expect(mocks.gamePlayAugmenterService.getSurvivorsElectSheriffGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
      expect(mocks.gamePlayAugmenterService.getSurvivorsVoteGamePlaySourceInteractions).not.toHaveBeenCalled();
    });

    it("should call get survivors vote game play eligible targets when game play action is vote.", async() => {
      const gamePlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getSurvivorsGamePlaySourceInteractions"](game, gamePlay);

      expect(mocks.gamePlayAugmenterService.getSurvivorsVoteGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
      expect(mocks.gamePlayAugmenterService.getSurvivorsElectSheriffGamePlaySourceInteractions).not.toHaveBeenCalled();
    });

    it("should throw error when game play action is not elect sheriff nor vote.", async() => {
      const gamePlay = createFakeGamePlayWildChildChoosesModel();
      const game = createFakeGame();
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.MALFORMED_CURRENT_GAME_PLAY, { gamePlayAction: gamePlay.action });
      mocks.unexpectedExceptionFactory.createMalformedCurrentGamePlayUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayAugmenter["getSurvivorsGamePlaySourceInteractions"](game, gamePlay)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createMalformedCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("getSurvivorsGamePlaySourceInteractions", gamePlay, game._id);
    });
  });

  describe("getWerewolvesGamePlaySourceInteractions", () => {
    it("should return alive villagers sided players as eligible targets with boundaries from 1 to 1 when called.", () => {
      const players = [
        createFakeAngelAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "werewolves",
        type: "eat",
        eligibleTargets: [players[0], players[3]],
        boundaries: {
          min: 1,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getWerewolvesGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });
  });

  describe("getBigBadWolfGamePlaySourceInteractions", () => {
    it("should return alive villagers as eligible targets with boundaries from 1 to 1 when there are still left to eat targets.", () => {
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
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "big-bad-wolf",
        type: "eat",
        eligibleTargets: [players[0], players[1]],
        boundaries: {
          min: 1,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getBigBadWolfGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });

    it("should return no eligible targets with target boundaries from 0 to 0 when there are no left to eat targets.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHelper.getEligibleWerewolvesTargets.mockReturnValueOnce([]);

      expect(services.gamePlayAugmenter["getBigBadWolfGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([]);
    });
  });

  describe("getCupidGamePlaySourceInteractions", () => {
    it("should return all alive eligible targets with 2 to 2 targets boundaries when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeCupidAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ cupid: createFakeCupidGameOptions({ mustWinWithLovers: false }) }) });
      const game = createFakeGame({ players, options });
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "cupid",
        type: "charm",
        eligibleTargets: [players[0], players[3]],
        boundaries: {
          min: 2,
          max: 2,
        },
      });

      expect(services.gamePlayAugmenter["getCupidGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });

    it("should return all alive and not cupid eligible targets with 2 to 2 targets boundaries when game options says that cupid must win with lovers.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeCupidAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ cupid: createFakeCupidGameOptions({ mustWinWithLovers: true }) }) });
      const game = createFakeGame({ players, options });
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "cupid",
        type: "charm",
        eligibleTargets: [players[0], players[1]],
        boundaries: {
          min: 2,
          max: 2,
        },
      });

      expect(services.gamePlayAugmenter["getCupidGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });

    it("should return empty array when there is not enough targets for cupid.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeCupidAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ cupid: createFakeCupidGameOptions({ mustWinWithLovers: true }) }) });
      const game = createFakeGame({ players, options });

      expect(services.gamePlayAugmenter["getCupidGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([]);
    });
  });

  describe("getFoxGamePlaySourceInteractions", () => {
    it("should return all alive eligible targets with 0 to 1 boundaries when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "fox",
        type: "sniff",
        eligibleTargets: [players[0], players[3]],
        boundaries: {
          min: 0,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getFoxGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });
  });

  describe("getDefenderGamePlaySourceInteractions", () => {
    it("should throw error when there is no defender in the game.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const mockedError = new UnexpectedException("error", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_CURRENT_ROLE_IN_GAME, { gameId: game._id.toString(), roleName: "defender" });
      mocks.unexpectedExceptionFactory.createCantFindPlayerWithCurrentRoleUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayAugmenter["getDefenderGamePlaySourceInteractions"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindPlayerWithCurrentRoleUnexpectedException).toHaveBeenCalledExactlyOnceWith("getDefenderGamePlaySourceInteractions", { gameId: game._id, roleName: "defender" });
    });

    it("should return all alive players as eligible targets with boundaries from 1 to 1 when there is no last protected players.", async() => {
      const players = [
        createFakeDefenderAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHistoryRecordService.getLastGameHistoryDefenderProtectsRecord.mockResolvedValueOnce(null);
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "defender",
        type: "protect",
        eligibleTargets: [players[0], players[1], players[2], players[3]],
        boundaries: { min: 1, max: 1 },
      });

      await expect(services.gamePlayAugmenter["getDefenderGamePlaySourceInteractions"](game)).resolves.toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });

    it("should return all alive players as eligible targets with boundaries from 1 to 1 when there is last protected players but defender can protect twice in a row.", async() => {
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
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "defender",
        type: "protect",
        eligibleTargets: [players[0], players[2], players[3]],
        boundaries: { min: 1, max: 1 },
      });

      await expect(services.gamePlayAugmenter["getDefenderGamePlaySourceInteractions"](game)).resolves.toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });

    it("should return all alive players but last protected player as eligible targets with boundaries from 1 to 1 when there is last protected players but defender can't protect twice in a row.", async() => {
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
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "defender",
        type: "protect",
        eligibleTargets: [players[0], players[3]],
        boundaries: { min: 1, max: 1 },
      });

      await expect(services.gamePlayAugmenter["getDefenderGamePlaySourceInteractions"](game)).resolves.toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });
  });

  describe("getHunterGamePlaySourceInteractions", () => {
    it("should return all alive players as eligible targets with boundaries from 1 to 1 when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "hunter",
        type: "shoot",
        eligibleTargets: [players[0], players[1], players[3]],
        boundaries: { min: 1, max: 1 },
      });

      expect(services.gamePlayAugmenter["getHunterGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });
  });

  describe("getPiedPiperGamePlaySourceInteractions", () => {
    it("should return 2 eligible targets with 2 to 2 targets boundaries when called.", () => {
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
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "pied-piper",
        type: "charm",
        eligibleTargets: [players[0], players[1]],
        boundaries: {
          min: 2,
          max: 2,
        },
      });

      expect(services.gamePlayAugmenter["getPiedPiperGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });

    it("should return 2 eligible targets with 1 to 1 targets boundaries when game options charm count is lower than left to charm players.", () => {
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
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "pied-piper",
        type: "charm",
        eligibleTargets: [players[0], players[1]],
        boundaries: {
          min: 1,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getPiedPiperGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });
  });

  describe("getScandalmongerGamePlaySourceInteractions", () => {
    it("should return all alive eligible targets with 0 to 1 targets boundaries when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "scandalmonger",
        type: "mark",
        eligibleTargets: [players[0], players[3]],
        boundaries: {
          min: 0,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getScandalmongerGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });
  });

  describe("getScapegoatGamePlaySourceInteractions", () => {
    it("should return all alive eligible targets with 0 to alive length target boundaries when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "scapegoat",
        type: "ban-voting",
        eligibleTargets: [players[0], players[3]],
        boundaries: {
          min: 0,
          max: 2,
        },
      });

      expect(services.gamePlayAugmenter["getScapegoatGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });
  });

  describe("getSeerGamePlaySourceInteractions", () => {
    it("should return alive players but seer as eligible targets with boundaries from 1 to 1 when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "seer",
        type: "look",
        eligibleTargets: [players[0], players[3]],
        boundaries: { min: 1, max: 1 },
      });

      expect(services.gamePlayAugmenter["getSeerGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });
  });

  describe("getWhiteWerewolfGamePlaySourceInteractions", () => {
    it("should return two eligible targets with 0 to 1 boundaries when there are still wolves to eat.", () => {
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
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "white-werewolf",
        type: "eat",
        eligibleTargets: [players[0], players[1]],
        boundaries: {
          min: 0,
          max: 1,
        },
      });

      expect(services.gamePlayAugmenter["getWhiteWerewolfGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });

    it("should return no eligible player with 0 to 0 boundaries when there are no wolves to eat.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHelper.getEligibleWhiteWerewolfTargets.mockReturnValueOnce([]);

      expect(services.gamePlayAugmenter["getWhiteWerewolfGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([]);
    });
  });

  describe("getWildChildGamePlaySourceInteractions", () => {
    it("should return alive players without wild child as eligible targets with 1 to 1 boundaries when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWildChildAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "wild-child",
        type: "choose-as-model",
        eligibleTargets: [players[0], players[3]],
        boundaries: { min: 1, max: 1 },
      });

      expect(services.gamePlayAugmenter["getWildChildGamePlaySourceInteractions"](game)).toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });
  });

  describe("getWitchGamePlaySourceGiveDeathPotionInteraction", () => {
    it("should return undefined when witch used death potion before.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeEatenByBigBadWolfPlayerAttribute()] }),
        createFakeWitchAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(services.gamePlayAugmenter["getWitchGamePlaySourceGiveDeathPotionInteraction"](game, true)).toBeUndefined();
    });

    it("should return interaction with alive not eaten eligible targets when witch didn't use her death potion before.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeEatenByBigBadWolfPlayerAttribute()] }),
        createFakeWitchAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });
      const expectedDeathPotionInteraction = createFakeGamePlaySourceInteraction({
        source: "witch",
        type: "give-death-potion",
        eligibleTargets: [players[0], players[2]],
        boundaries: { min: 0, max: 1 },
      });

      expect(services.gamePlayAugmenter["getWitchGamePlaySourceGiveDeathPotionInteraction"](game, false)).toStrictEqual<GamePlaySourceInteraction>(expectedDeathPotionInteraction);
    });
  });

  describe("getWitchGamePlaySourceGiveLifePotionInteraction", () => {
    it("should return undefined when witch used life potion before.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeEatenByBigBadWolfPlayerAttribute()] }),
        createFakeWitchAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGame({ players });

      expect(services.gamePlayAugmenter["getWitchGamePlaySourceGiveLifePotionInteraction"](game, true)).toBeUndefined();
    });

    it("should return interaction with alive eaten eligible targets when witch didn't use her life potion before.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeEatenByBigBadWolfPlayerAttribute()] }),
        createFakeWitchAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false, attributes: [createFakeEatenByBigBadWolfPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });
      const expectedLifePotionInteraction = createFakeGamePlaySourceInteraction({
        source: "witch",
        type: "give-life-potion",
        eligibleTargets: [players[1]],
        boundaries: { min: 0, max: 1 },
      });

      expect(services.gamePlayAugmenter["getWitchGamePlaySourceGiveLifePotionInteraction"](game, false)).toStrictEqual<GamePlaySourceInteraction>(expectedLifePotionInteraction);
    });
  });

  describe("getWitchGamePlaySourceInteractions", () => {
    beforeEach(() => {
      mocks.gamePlayAugmenterService.getWitchGamePlaySourceGiveDeathPotionInteraction = jest.spyOn(services.gamePlayAugmenter as unknown as { getWitchGamePlaySourceGiveDeathPotionInteraction }, "getWitchGamePlaySourceGiveDeathPotionInteraction").mockImplementation();
      mocks.gamePlayAugmenterService.getWitchGamePlaySourceGiveLifePotionInteraction = jest.spyOn(services.gamePlayAugmenter as unknown as { getWitchGamePlaySourceGiveLifePotionInteraction }, "getWitchGamePlaySourceGiveLifePotionInteraction").mockImplementation();
    });

    it("should throw error when witch is not in the game.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const mockedError = new UnexpectedException("getWitchGamePlaySourceInteractions", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_CURRENT_ROLE_IN_GAME, { gameId: game._id.toString(), roleName: "witch" });
      mocks.unexpectedExceptionFactory.createCantFindPlayerWithCurrentRoleUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayAugmenter["getWitchGamePlaySourceInteractions"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindPlayerWithCurrentRoleUnexpectedException).toHaveBeenCalledExactlyOnceWith("getWitchGamePlaySourceInteractions", { gameId: game._id, roleName: "witch" });
    });

    it("should get eligible targets from game when called and there is no history for life potion and death potion.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      await services.gamePlayAugmenter["getWitchGamePlaySourceInteractions"](game);

      expect(mocks.gamePlayAugmenterService.getWitchGamePlaySourceGiveLifePotionInteraction).toHaveBeenCalledExactlyOnceWith(game, false);
      expect(mocks.gamePlayAugmenterService.getWitchGamePlaySourceGiveDeathPotionInteraction).toHaveBeenCalledExactlyOnceWith(game, false);
    });

    it("should get eligible targets from game with life potion used when called and there is history for life potion.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([createFakeGameHistoryRecord()]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      await services.gamePlayAugmenter["getWitchGamePlaySourceInteractions"](game);

      expect(mocks.gamePlayAugmenterService.getWitchGamePlaySourceGiveLifePotionInteraction).toHaveBeenCalledExactlyOnceWith(game, true);
      expect(mocks.gamePlayAugmenterService.getWitchGamePlaySourceGiveDeathPotionInteraction).toHaveBeenCalledExactlyOnceWith(game, false);
    });

    it("should get eligible targets from game with death potion used when called and there is history for death potion.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([]);
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValueOnce([createFakeGameHistoryRecord()]);
      await services.gamePlayAugmenter["getWitchGamePlaySourceInteractions"](game);

      expect(mocks.gamePlayAugmenterService.getWitchGamePlaySourceGiveLifePotionInteraction).toHaveBeenCalledExactlyOnceWith(game, false);
      expect(mocks.gamePlayAugmenterService.getWitchGamePlaySourceGiveDeathPotionInteraction).toHaveBeenCalledExactlyOnceWith(game, true);
    });

    it("should return eligible targets for both life and death potions interactions when called.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedLifePotionInteraction = createFakeGamePlaySourceInteraction({
        source: "witch",
        type: "give-life-potion",
        eligibleTargets: [players[1]],
        boundaries: { min: 0, max: 1 },
      });
      mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords.mockResolvedValue([]);
      mocks.gamePlayAugmenterService.getWitchGamePlaySourceGiveLifePotionInteraction.mockReturnValueOnce(expectedLifePotionInteraction);
      mocks.gamePlayAugmenterService.getWitchGamePlaySourceGiveDeathPotionInteraction.mockReturnValueOnce(undefined);

      await expect(services.gamePlayAugmenter["getWitchGamePlaySourceInteractions"](game)).resolves.toStrictEqual<GamePlaySourceInteraction[]>([expectedLifePotionInteraction]);
    });
  });

  describe("getAccursedWolfFatherGamePlaySourceInteractions", () => {
    beforeEach(() => {
      mocks.gameHistoryRecordService.getGameHistoryAccursedWolfFatherInfectsWithTargetRecords.mockResolvedValue([]);
    });

    it("should throw error when there is no accursed wolf father in the game.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const mockedError = new UnexpectedException("getAccursedWolfFatherGamePlaySourceInteractions", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_CURRENT_ROLE_IN_GAME, { gameId: game._id.toString(), roleName: "accursed-wolf-father" });
      mocks.unexpectedExceptionFactory.createCantFindPlayerWithCurrentRoleUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayAugmenter["getAccursedWolfFatherGamePlaySourceInteractions"](game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindPlayerWithCurrentRoleUnexpectedException).toHaveBeenCalledExactlyOnceWith("getAccursedWolfFatherGamePlaySourceInteractions", { gameId: game._id, roleName: "accursed-wolf-father" });
    });

    it("should return empty array when there is a record for accursed wolf father infects with target.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gameHistoryRecord = createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ targets: [{ player: players[3] }] }) });
      mocks.gameHistoryRecordService.getGameHistoryAccursedWolfFatherInfectsWithTargetRecords.mockResolvedValueOnce([gameHistoryRecord]);

      await expect(services.gamePlayAugmenter["getAccursedWolfFatherGamePlaySourceInteractions"](game)).resolves.toStrictEqual<GamePlaySourceInteraction[]>([]);
    });

    it("should return all eaten by werewolves players as eligible targets with boundaries from 0 to 1 when called.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeAccursedWolfFatherAlivePlayer(),
        createFakeVillagerAlivePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });
      const expectedGamePlaySourceInteraction = createFakeGamePlaySourceInteraction({
        source: "accursed-wolf-father",
        type: "infect",
        eligibleTargets: [players[3]],
        boundaries: { min: 0, max: 1 },
      });

      await expect(services.gamePlayAugmenter["getAccursedWolfFatherGamePlaySourceInteractions"](game)).resolves.toStrictEqual<GamePlaySourceInteraction[]>([expectedGamePlaySourceInteraction]);
    });
  });

  describe("getGamePlaySourceInteractions", () => {
    beforeEach(() => {
      mocks.gamePlayAugmenterService.getSheriffGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getSheriffGamePlaySourceInteractions;
      }, "getSheriffGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getSurvivorsGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getSurvivorsGamePlaySourceInteractions;
      }, "getSurvivorsGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getWerewolvesGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getWerewolvesGamePlaySourceInteractions;
      }, "getWerewolvesGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getBigBadWolfGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getBigBadWolfGamePlaySourceInteractions;
      }, "getBigBadWolfGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getCupidGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getCupidGamePlaySourceInteractions;
      }, "getCupidGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getFoxGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getFoxGamePlaySourceInteractions;
      }, "getFoxGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getDefenderGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getDefenderGamePlaySourceInteractions;
      }, "getDefenderGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getHunterGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getHunterGamePlaySourceInteractions;
      }, "getHunterGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getPiedPiperGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getPiedPiperGamePlaySourceInteractions;
      }, "getPiedPiperGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getScandalmongerGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getScandalmongerGamePlaySourceInteractions;
      }, "getScandalmongerGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getScapegoatGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getScapegoatGamePlaySourceInteractions;
      }, "getScapegoatGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getSeerGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getSeerGamePlaySourceInteractions;
      }, "getSeerGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getWhiteWerewolfGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getWhiteWerewolfGamePlaySourceInteractions;
      }, "getWhiteWerewolfGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getWildChildGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getWildChildGamePlaySourceInteractions;
      }, "getWildChildGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getWitchGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getWitchGamePlaySourceInteractions;
      }, "getWitchGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
      mocks.gamePlayAugmenterService.getAccursedWolfFatherGamePlaySourceInteractions = jest.spyOn(services.gamePlayAugmenter as unknown as {
        getAccursedWolfFatherGamePlaySourceInteractions;
      }, "getAccursedWolfFatherGamePlaySourceInteractions").mockImplementation().mockReturnValue([]);
    });

    it("should return undefined when game play source name is not in getGamePlaySourceInteractionsMethods.", async() => {
      const gamePlay = createFakeGamePlayThreeBrothersMeetEachOther();
      const game = createFakeGame();

      await expect(services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game)).resolves.toBeUndefined();
    });

    it("should return undefined when eligible targets are empty array.", async() => {
      const gamePlay = createFakeGamePlaySheriffDelegates();
      const game = createFakeGame();
      mocks.gamePlayAugmenterService.getSheriffGamePlaySourceInteractions.mockReturnValueOnce([]);

      await expect(services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game)).resolves.toBeUndefined();
    });

    it("should return game play eligible targets when game play method returns eligible targets.", async() => {
      const gamePlay = createFakeGamePlaySheriffDelegates();
      const game = createFakeGame();
      const expectedInteractions = [
        createFakeGamePlaySourceInteraction(),
        createFakeGamePlaySourceInteraction(),
      ];
      mocks.gamePlayAugmenterService.getSheriffGamePlaySourceInteractions.mockReturnValueOnce(expectedInteractions);

      await expect(services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game)).resolves.toStrictEqual<GamePlaySourceInteraction[]>(expectedInteractions);
    });

    it("should call get game play eligible targets for sheriff when game play source name is sheriff.", async() => {
      const gamePlay = createFakeGamePlaySheriffDelegates();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getSheriffGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call get game play eligible targets for survivors when game play source name is survivors.", async() => {
      const gamePlay = createFakeGamePlaySurvivorsVote();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getSurvivorsGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call get game play eligible targets for werewolves when game play source name is werewolves.", async() => {
      const gamePlay = createFakeGamePlayWerewolvesEat();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getWerewolvesGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for big bad wolf when game play source name is big bad wolf.", async() => {
      const gamePlay = createFakeGamePlayBigBadWolfEats();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getBigBadWolfGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for cupid when game play source name is cupid.", async() => {
      const gamePlay = createFakeGamePlayCupidCharms();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getCupidGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for fox when game play source name is fox.", async() => {
      const gamePlay = createFakeGamePlayFoxSniffs();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getFoxGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for defender when game play source name is defender.", async() => {
      const gamePlay = createFakeGamePlayDefenderProtects();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getDefenderGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for hunter when game play source name is hunter.", async() => {
      const gamePlay = createFakeGamePlayHunterShoots();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getHunterGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for pied piper when game play source name is pied piper.", async() => {
      const gamePlay = createFakeGamePlayPiedPiperCharms();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getPiedPiperGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for scandalmonger when game play source name is scandalmonger.", async() => {
      const gamePlay = createFakeGamePlayScandalmongerMarks();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getScandalmongerGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for scapegoat when game play source name is scapegoat.", async() => {
      const gamePlay = createFakeGamePlayScapegoatBansVoting();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getScapegoatGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for see when game play source name is see.", async() => {
      const gamePlay = createFakeGamePlaySeerLooks();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getSeerGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for white werewolf when game play source name is white werewolf.", async() => {
      const gamePlay = createFakeGamePlayWhiteWerewolfEats();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getWhiteWerewolfGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for wild child when game play source name is wild child.", async() => {
      const gamePlay = createFakeGamePlayWildChildChoosesModel();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getWildChildGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for witch when game play source name is witch.", async() => {
      const gamePlay = createFakeGamePlayWitchUsesPotions();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getWitchGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call get game play eligible targets for accursed wolf-father when game play source name is accursed wolf-father.", async() => {
      const gamePlay = createFakeGamePlayAccursedWolfFatherInfects();
      const game = createFakeGame();
      await services.gamePlayAugmenter["getGamePlaySourceInteractions"](gamePlay, game);

      expect(mocks.gamePlayAugmenterService.getAccursedWolfFatherGamePlaySourceInteractions).toHaveBeenCalledExactlyOnceWith(game);
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
        gamePlay: createFakeGamePlay({ action: "elect-sheriff" }),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when game play action is vote and game play cause is angel presence.",
        gamePlay: createFakeGamePlaySurvivorsVote({ cause: "angel-presence" }),
        game: createFakeGame({ options: createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) }) }),
        expected: false,
      },
      {
        test: "should return true when game play action is bury dead bodies.",
        gamePlay: createFakeGamePlay({ action: "bury-dead-bodies" }),
        game: createFakeGame({ options: createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: false }) }) }),
        expected: true,
      },
      {
        test: "should return true when game play action is not elect sheriff and game options say that votes can be skipped.",
        gamePlay: createFakeGamePlay({ action: "vote" }),
        game: createFakeGame({ options: createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) }) }),
        expected: true,
      },
      {
        test: "should return true when game play action is not vote but because angel presence.",
        gamePlay: createFakeGamePlayScandalmongerMarks({ cause: "angel-presence" }),
        game: createFakeGame({ options: createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) }) }),
        expected: true,
      },
      {
        test: "should return false when game play action is not elect sheriff and game options say that votes can't be skipped.",
        gamePlay: createFakeGamePlay({ action: "vote" }),
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
            createFakeGameAdditionalCard({ roleName: "seer" }),
            createFakeGameAdditionalCard({ roleName: "werewolf" }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: true }) }) }),
        }),
        expected: true,
      },
      {
        test: "should return true when thief has to choose between werewolves cards but game options allow to skip.",
        game: createFakeGame({
          additionalCards: [
            createFakeGameAdditionalCard({ roleName: "werewolf" }),
            createFakeGameAdditionalCard({ roleName: "werewolf" }),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: false }) }) }),
        }),
        expected: true,
      },
      {
        test: "should return false when thief has to choose between werewolves cards and game options don't allow to skip.",
        game: createFakeGame({
          additionalCards: [
            createFakeGameAdditionalCard({ roleName: "werewolf" }),
            createFakeGameAdditionalCard({ roleName: "werewolf" }),
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
      {
        gamePlay: createFakeGamePlayStutteringJudgeRequestsAnotherVote(),
        test: "should return true when game play source name is stuttering judge.",
      },
      {
        gamePlay: createFakeGamePlayBearTamerGrowls(),
        test: "should return true when game play source name is bear tamer.",
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