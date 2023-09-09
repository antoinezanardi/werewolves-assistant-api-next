import { Test } from "@nestjs/testing";
import { when } from "jest-when";
import type { TestingModule } from "@nestjs/testing";

import { GameHistoryRecordVotingResults } from "@/modules/game/enums/game-history-record.enum";
import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { createGamePlayAllElectSheriff } from "@/modules/game/helpers/game-play/game-play.factory";
import { GameHistoryRecordRepository } from "@/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "@/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlayVoteService } from "@/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import type { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { GameHistoryRecordToInsert } from "@/modules/game/types/game-history-record.type";
import { RoleSides } from "@/modules/role/enums/role.enum";

import { ApiResources } from "@/shared/api/enums/api.enum";
import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.type";

import { bulkCreateFakePlayers, createFakePlayer, createFakePlayerRole } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeAngelAlivePlayer, createFakeHunterAlivePlayer, createFakeSeerAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayerDeathPotionByWitchDeath, createFakePlayerVoteByAllDeath, createFakePlayerVoteScapegoatedByAllDeath } from "@tests/factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeSheriffByAllPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeGamePlayAllElectSheriff, createFakeGamePlayAllVote } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";
import { createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlaySource, createFakeGameHistoryRecordPlayTarget, createFakeGameHistoryRecordPlayVote, createFakeGameHistoryRecordPlayVoting } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { bulkCreateFakeGameAdditionalCards, createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { createFakeGameHistoryRecordToInsert } from "@tests/factories/game/types/game-history-record/game-history-record.type.factory";

jest.mock("@/shared/exception/types/resource-not-found-exception.type");

describe("Game History Record Service", () => {
  let mocks: {
    gameHistoryRecordRepository: {
      create: jest.SpyInstance;
      getLastGameHistoryGuardProtectsRecord: jest.SpyInstance;
      getLastGameHistoryTieInVotesRecord: jest.SpyInstance;
      getGameHistoryWitchUsesSpecificPotionRecords: jest.SpyInstance;
      getGameHistoryVileFatherOfWolvesInfectedRecords: jest.SpyInstance;
      getGameHistoryJudgeRequestRecords: jest.SpyInstance;
      getGameHistoryWerewolvesEatAncientRecords: jest.SpyInstance;
      getGameHistoryAncientProtectedFromWerewolvesRecords: jest.SpyInstance;
      getPreviousGameHistoryRecord: jest.SpyInstance;
      getGameHistory: jest.SpyInstance;
      getGameHistoryPhaseRecords: jest.SpyInstance;
    };
    gameRepository: { findOne: jest.SpyInstance };
    gamePlayVoteService: { getNominatedPlayers: jest.SpyInstance };
    unexpectedExceptionFactory: {
      createNoCurrentGamePlayUnexpectedException: jest.SpyInstance;
    };
  };
  let services: { gameHistoryRecord: GameHistoryRecordService };
  let repositories: { gameHistoryRecord: GameHistoryRecordRepository };

  beforeEach(async() => {
    mocks = {
      gameHistoryRecordRepository: {
        create: jest.fn(),
        getLastGameHistoryGuardProtectsRecord: jest.fn(),
        getLastGameHistoryTieInVotesRecord: jest.fn(),
        getGameHistoryWitchUsesSpecificPotionRecords: jest.fn(),
        getGameHistoryVileFatherOfWolvesInfectedRecords: jest.fn(),
        getGameHistoryJudgeRequestRecords: jest.fn(),
        getGameHistoryWerewolvesEatAncientRecords: jest.fn(),
        getGameHistoryAncientProtectedFromWerewolvesRecords: jest.fn(),
        getPreviousGameHistoryRecord: jest.fn(),
        getGameHistory: jest.fn(),
        getGameHistoryPhaseRecords: jest.fn(),
      },
      gameRepository: { findOne: jest.fn() },
      gamePlayVoteService: { getNominatedPlayers: jest.fn() },
      unexpectedExceptionFactory: { createNoCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoCurrentGamePlayUnexpectedException").mockImplementation() },
    };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GameHistoryRecordRepository,
          useValue: mocks.gameHistoryRecordRepository,
        },
        {
          provide: GameRepository,
          useValue: mocks.gameRepository,
        },
        {
          provide: GamePlayVoteService,
          useValue: mocks.gamePlayVoteService,
        },
        GameHistoryRecordService,
      ],
    }).compile();

    services = { gameHistoryRecord: module.get<GameHistoryRecordService>(GameHistoryRecordService) };
    repositories = { gameHistoryRecord: module.get<GameHistoryRecordRepository>(GameHistoryRecordRepository) };
  });

  describe("createGameHistoryRecord", () => {
    it("should create game history record when called with valid data.", async() => {
      jest.spyOn(services.gameHistoryRecord as unknown as { validateGameHistoryRecordToInsertData }, "validateGameHistoryRecordToInsertData").mockImplementation();
      const validPlay = createFakeGameHistoryRecordToInsert({
        gameId: createFakeObjectId(),
        play: createFakeGameHistoryRecordPlay(),
      });
      await services.gameHistoryRecord.createGameHistoryRecord(validPlay);

      expect(repositories.gameHistoryRecord.create).toHaveBeenCalledExactlyOnceWith(validPlay);
    });
  });

  describe("getLastGameHistoryGuardProtectsRecord", () => {
    it("should get game history when guard protected when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getLastGameHistoryGuardProtectsRecord(gameId);

      expect(repositories.gameHistoryRecord.getLastGameHistoryGuardProtectsRecord).toHaveBeenCalledExactlyOnceWith(gameId);
    });
  });

  describe("getLastGameHistoryTieInVotesRecord", () => {
    it("should get game history when all voted and there was a tie when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(gameId, GamePlayActions.VOTE);

      expect(repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord).toHaveBeenCalledExactlyOnceWith(gameId, GamePlayActions.VOTE);
    });
  });

  describe("getGameHistoryWitchUsesSpecificPotionRecords", () => {
    it("should get game history records when witch used life potion when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, WitchPotions.LIFE);

      expect(repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords).toHaveBeenCalledExactlyOnceWith(gameId, WitchPotions.LIFE);
    });

    it("should get game history records when witch used death potion when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, WitchPotions.DEATH);

      expect(repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords).toHaveBeenCalledExactlyOnceWith(gameId, WitchPotions.DEATH);
    });
  });

  describe("getGameHistoryVileFatherOfWolvesInfectedRecords", () => {
    it("should get game history records when vile father of wolves infected a player when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryVileFatherOfWolvesInfectedRecords(gameId);

      expect(repositories.gameHistoryRecord.getGameHistoryVileFatherOfWolvesInfectedRecords).toHaveBeenCalledExactlyOnceWith(gameId);
    });
  });

  describe("getGameHistoryJudgeRequestRecords", () => {
    it("should get game history records when stuttering judge requested another vote when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryJudgeRequestRecords(gameId);

      expect(repositories.gameHistoryRecord.getGameHistoryJudgeRequestRecords).toHaveBeenCalledExactlyOnceWith(gameId);
    });
  });
  
  describe("getGameHistoryWerewolvesEatAncientRecords", () => {
    it("should get game history records when any kind of werewolves eat ancient when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryWerewolvesEatAncientRecords(gameId);

      expect(repositories.gameHistoryRecord.getGameHistoryWerewolvesEatAncientRecords).toHaveBeenCalledExactlyOnceWith(gameId);
    });
  });

  describe("getGameHistoryAncientProtectedFromWerewolvesRecords", () => {
    it("should get game history records when ancient is protected from werewolves when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryAncientProtectedFromWerewolvesRecords(gameId);

      expect(repositories.gameHistoryRecord.getGameHistoryAncientProtectedFromWerewolvesRecords).toHaveBeenCalledExactlyOnceWith(gameId);
    });
  });

  describe("getGameHistoryPhaseRecords", () => {
    it("should call getGameHistoryPhaseRecords method when called.", async() => {
      const game = createFakeGame();
      await services.gameHistoryRecord.getGameHistoryPhaseRecords(game._id, game.turn, game.phase);

      expect(mocks.gameHistoryRecordRepository.getGameHistoryPhaseRecords).toHaveBeenCalledExactlyOnceWith(game._id, game.turn, game.phase);
    });
  });

  describe("getPreviousGameHistoryRecord", () => {
    it("should previous game history record when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getPreviousGameHistoryRecord(gameId);

      expect(repositories.gameHistoryRecord.getPreviousGameHistoryRecord).toHaveBeenCalledExactlyOnceWith(gameId);
    });
  });

  describe("generateCurrentGameHistoryRecordToInsert", () => {
    let localMocks: {
      gameHistoryRecordService: {
        generateCurrentGameHistoryRecordPlayToInsert: jest.SpyInstance;
        generateCurrentGameHistoryRecordRevealedPlayersToInsert: jest.SpyInstance;
        generateCurrentGameHistoryRecordDeadPlayersToInsert: jest.SpyInstance;
        generateCurrentGameHistoryRecordPlayVotingToInsert: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gameHistoryRecordService: {
          generateCurrentGameHistoryRecordPlayToInsert: jest.spyOn(services.gameHistoryRecord as unknown as { generateCurrentGameHistoryRecordPlayToInsert }, "generateCurrentGameHistoryRecordPlayToInsert").mockImplementation(),
          generateCurrentGameHistoryRecordRevealedPlayersToInsert: jest.spyOn(services.gameHistoryRecord as unknown as { generateCurrentGameHistoryRecordRevealedPlayersToInsert }, "generateCurrentGameHistoryRecordRevealedPlayersToInsert").mockImplementation(),
          generateCurrentGameHistoryRecordDeadPlayersToInsert: jest.spyOn(services.gameHistoryRecord as unknown as { generateCurrentGameHistoryRecordDeadPlayersToInsert }, "generateCurrentGameHistoryRecordDeadPlayersToInsert").mockImplementation(),
          generateCurrentGameHistoryRecordPlayVotingToInsert: jest.spyOn(services.gameHistoryRecord as unknown as { generateCurrentGameHistoryRecordPlayVotingToInsert }, "generateCurrentGameHistoryRecordPlayVotingToInsert").mockImplementation(),
        },
      };
    });
    
    it("should throw error when there is no current play for the game.", () => {
      const baseGame = createFakeGame();
      const newGame = createFakeGame();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const interpolations = { gameId: baseGame._id };

      expect(() => services.gameHistoryRecord.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play)).toThrow(undefined);
      expect(mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("generateCurrentGameHistoryRecordToInsert", interpolations);
    });
    
    it("should generate current game history to insert when called.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay();
      localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      const expectedCurrentGameHistoryToInsert = createFakeGameHistoryRecordToInsert({
        gameId: baseGame._id,
        turn: baseGame.turn,
        phase: baseGame.phase,
        tick: baseGame.tick,
        play: expectedCurrentGameHistoryPlayToInsert,
      });
      
      expect(services.gameHistoryRecord.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play)).toStrictEqual(expectedCurrentGameHistoryToInsert);
    });

    it("should call generateCurrentGameHistoryRecordPlayToInsert method when called.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay();
      localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      services.gameHistoryRecord.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayToInsert).toHaveBeenCalledExactlyOnceWith(baseGame, play);
    });

    it("should call generateCurrentGameHistoryRecordRevealedPlayersToInsert method when called.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay();
      localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      services.gameHistoryRecord.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordRevealedPlayersToInsert).toHaveBeenCalledExactlyOnceWith(baseGame, newGame);
    });

    it("should call generateCurrentGameHistoryRecordDeadPlayersToInsert method when called.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay();
      localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      services.gameHistoryRecord.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordDeadPlayersToInsert).toHaveBeenCalledExactlyOnceWith(baseGame, newGame);
    });
    
    it("should call generateCurrentGameHistoryRecordPlayVotingToInsert method when called with votes.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay({ votes: [] });
      localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      const gameHistoryRecordToInsert = {
        gameId: baseGame._id,
        turn: baseGame.turn,
        phase: baseGame.phase,
        tick: baseGame.tick,
        play: expectedCurrentGameHistoryPlayToInsert,
        revealedPlayers: undefined,
        deadPlayers: undefined,
      };
      services.gameHistoryRecord.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingToInsert).toHaveBeenCalledExactlyOnceWith(baseGame, newGame, gameHistoryRecordToInsert);
    });

    it("should not call generateCurrentGameHistoryRecordPlayVotingToInsert method when called without votes.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay();
      localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      services.gameHistoryRecord.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingToInsert).not.toHaveBeenCalled();
    });
  });

  describe("getGameHistory", () => {
    it("should call getGameHistory repository method when called.", async() => {
      const game = createFakeGame();
      await services.gameHistoryRecord.getGameHistory(game._id);

      expect(mocks.gameHistoryRecordRepository.getGameHistory).toHaveBeenCalledExactlyOnceWith(game._id);
    });
  });

  describe("generateCurrentGameHistoryRecordDeadPlayersToInsert", () => {
    it("should generate current game history dead players when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const baseGame = createFakeGame({ players });
      const newPlayers = [
        createFakePlayer({ ...players[0], isAlive: false }),
        createFakePlayer({ ...players[1] }),
        createFakePlayer({ ...players[2], isAlive: false }),
        createFakePlayer({ ...players[3] }),
        createFakePlayer({ ...players[4] }),
        createFakeAngelAlivePlayer({ isAlive: false }),
      ];
      const newGame = createFakeGame({
        ...baseGame,
        players: newPlayers,
      });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordDeadPlayersToInsert"](baseGame, newGame)).toStrictEqual<Player[]>([
        newPlayers[0],
        newPlayers[2],
      ]);
    });

    it("should return undefined when there is no dead players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const baseGame = createFakeGame({ players });
      const newPlayers = [
        createFakePlayer({ ...players[0] }),
        createFakePlayer({ ...players[1] }),
        createFakePlayer({ ...players[2] }),
        createFakePlayer({ ...players[3] }),
        createFakePlayer({ ...players[4] }),
        createFakeAngelAlivePlayer({ isAlive: false }),
      ];
      const newGame = createFakeGame({
        ...baseGame,
        players: newPlayers,
      });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordDeadPlayersToInsert"](baseGame, newGame)).toBeUndefined();
    });
  });

  describe("generateCurrentGameHistoryRecordRevealedPlayersToInsert", () => {
    it("should generate current game history revealed players but alive when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeVillagerAlivePlayer({ role: createFakePlayerRole({ isRevealed: true }) }),
        createFakeWerewolfAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeVillagerAlivePlayer({ isAlive: false, role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeVillagerAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
      ];
      const baseGame = createFakeGame({ players });
      const newPlayers = [
        createFakePlayer({ ...players[0], role: createFakePlayerRole({ isRevealed: true }) }),
        createFakePlayer({ ...players[1], role: createFakePlayerRole({ isRevealed: true }) }),
        createFakePlayer({ ...players[2], role: createFakePlayerRole({ isRevealed: true }) }),
        createFakePlayer({ ...players[3], role: createFakePlayerRole({ isRevealed: true }) }),
        createFakePlayer({ ...players[4], role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeAngelAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
      ];
      const newGame = createFakeGame({
        ...baseGame,
        players: newPlayers,
      });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordRevealedPlayersToInsert"](baseGame, newGame)).toStrictEqual<Player[]>([
        newPlayers[0],
        newPlayers[2],
      ]);
    });

    it("should return undefined when there is no new revealed players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeVillagerAlivePlayer({ role: createFakePlayerRole({ isRevealed: true }) }),
        createFakeWerewolfAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeVillagerAlivePlayer({ isAlive: false, role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeVillagerAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
      ];
      const baseGame = createFakeGame({ players });
      const newPlayers = [
        createFakePlayer({ ...players[0], role: createFakePlayerRole({ isRevealed: false }) }),
        createFakePlayer({ ...players[1], role: createFakePlayerRole({ isRevealed: true }) }),
        createFakePlayer({ ...players[2], role: createFakePlayerRole({ isRevealed: false }) }),
        createFakePlayer({ ...players[3], role: createFakePlayerRole({ isRevealed: true }) }),
        createFakePlayer({ ...players[4], role: createFakePlayerRole({ isRevealed: false }) }),
        createFakeAngelAlivePlayer({ role: createFakePlayerRole({ isRevealed: false }) }),
      ];
      const newGame = createFakeGame({
        ...baseGame,
        players: newPlayers,
      });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordRevealedPlayersToInsert"](baseGame, newGame)).toBeUndefined();
    });
  });

  describe("generateCurrentGameHistoryRecordPlayToInsert", () => {
    let localMocks: { gameHistoryRecordService: { generateCurrentGameHistoryRecordPlaySourceToInsert: jest.SpyInstance } };

    beforeEach(() => {
      localMocks = { gameHistoryRecordService: { generateCurrentGameHistoryRecordPlaySourceToInsert: jest.spyOn(services.gameHistoryRecord as unknown as { generateCurrentGameHistoryRecordPlaySourceToInsert }, "generateCurrentGameHistoryRecordPlaySourceToInsert").mockImplementation() } };
    });

    it("should generate current game history record play to insert when called.", () => {
      const game = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto({
        doesJudgeRequestAnotherVote: true,
        targets: [createFakeGameHistoryRecordPlayTarget({ isInfected: true })],
        votes: [createFakeGameHistoryRecordPlayVote()],
        chosenCard: createFakeGameAdditionalCard(),
        chosenSide: RoleSides.VILLAGERS,
      });
      const expectedGameHistoryRecordPlaySource = { name: undefined, players: undefined };
      localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlaySourceToInsert.mockReturnValue(expectedGameHistoryRecordPlaySource);
      const expectedGameHistoryRecordPlay = createFakeGameHistoryRecordPlay({
        action: game.currentPlay.action,
        didJudgeRequestAnotherVote: play.doesJudgeRequestAnotherVote,
        targets: play.targets,
        votes: play.votes,
        chosenCard: play.chosenCard,
        chosenSide: play.chosenSide,
      }, { source: expectedGameHistoryRecordPlaySource });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayToInsert"](game, play)).toStrictEqual(expectedGameHistoryRecordPlay);
    });
  });

  describe("generateCurrentGameHistoryRecordPlayVotingResultToInsert", () => {
    it("should return sheriff election when there is a sheriff in the game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllElectSheriff() });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer({ ...players[1], attributes: [createFakeSheriffByAllPlayerAttribute()] }),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert();

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.SHERIFF_ELECTION);
    });

    it("should return tie when there is no sheriff in the game after election.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllElectSheriff() });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert();

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.TIE);
    });

    it("should return skipped when there are no vote set.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote() });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ votes: undefined });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakePlayer({ ...players[1], isAlive: false, death: createFakePlayerVoteByAllDeath() })] });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.SKIPPED);
    });

    it("should return skipped when votes are empty.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote() });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ votes: [] });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakePlayer({ ...players[1], isAlive: false, death: createFakePlayerVoteByAllDeath() })] });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.SKIPPED);
    });

    it("should return death when there is at least one dead player from votes.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote() });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ votes: [createFakeGameHistoryRecordPlayVote()] });
      const deadPlayers = [
        createFakePlayer({ ...players[1], isAlive: false, death: createFakePlayerVoteByAllDeath() }),
        createFakePlayer({ ...players[1], isAlive: false, death: createFakePlayerDeathPotionByWitchDeath() }),
      ];
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.DEATH);
    });

    it("should return death when there is at least one dead player from scapegoat votes.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote() });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ votes: [createFakeGameHistoryRecordPlayVote()] });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakePlayer({ ...players[1], isAlive: false, death: createFakePlayerVoteScapegoatedByAllDeath() })] });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.DEATH);
    });

    it("should return inconsequential when there is no death from votes and current play was already after a tie.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }) });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ votes: [createFakeGameHistoryRecordPlayVote()] });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakePlayer({ ...players[1], isAlive: false, death: createFakePlayerDeathPotionByWitchDeath() })] });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.INCONSEQUENTIAL);
    });

    it("should return tie when there is no death from votes and current play was not after a tie.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote({ cause: GamePlayCauses.STUTTERING_JUDGE_REQUEST }) });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer(players[1]),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordPlay = createFakeGameHistoryRecordPlay({ votes: [createFakeGameHistoryRecordPlayVote()] });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakePlayer({ ...players[1], isAlive: false, death: createFakePlayerDeathPotionByWitchDeath() })] });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, gameHistoryRecordToInsert)).toBe(GameHistoryRecordVotingResults.TIE);
    });
  });

  describe("generateCurrentGameHistoryRecordPlayVotingToInsert", () => {
    let localMocks: {
      gameHistoryRecordService: {
        generateCurrentGameHistoryRecordPlayVotingResultToInsert: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = { gameHistoryRecordService: { generateCurrentGameHistoryRecordPlayVotingResultToInsert: jest.spyOn(services.gameHistoryRecord as unknown as { generateCurrentGameHistoryRecordPlayVotingResultToInsert }, "generateCurrentGameHistoryRecordPlayVotingResultToInsert").mockImplementation() } };
    });
    
    it("should generate current game history record play voting when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const newGame = createFakeGameWithCurrentPlay(game);
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert();
      const nominatedPlayers = [players[2]];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingResultToInsert.mockReturnValue(GameHistoryRecordVotingResults.DEATH);
      const expectedCurrentGameHistoryRecordPlayVoting = createFakeGameHistoryRecordPlayVoting({
        result: GameHistoryRecordVotingResults.DEATH,
        nominatedPlayers,
      });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingToInsert"](game, newGame, gameHistoryRecordToInsert)).toStrictEqual(expectedCurrentGameHistoryRecordPlayVoting);
    });

    it("should call getNominatedPlayers method with undefined votes when called without votes.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const newGame = createFakeGameWithCurrentPlay(game);
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert();
      const nominatedPlayers = [players[2]];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingResultToInsert.mockReturnValue(GameHistoryRecordVotingResults.DEATH);
      services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingToInsert"](game, newGame, gameHistoryRecordToInsert);

      expect(mocks.gamePlayVoteService.getNominatedPlayers).toHaveBeenCalledExactlyOnceWith(undefined, game);
    });

    it("should call getNominatedPlayers method with votes when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const newGame = createFakeGameWithCurrentPlay(game);
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: createFakeGameHistoryRecordPlay({ votes: [createFakeGameHistoryRecordPlayVote()] }) });
      const nominatedPlayers = [players[2]];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingResultToInsert.mockReturnValue(GameHistoryRecordVotingResults.DEATH);
      services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingToInsert"](game, newGame, gameHistoryRecordToInsert);

      expect(mocks.gamePlayVoteService.getNominatedPlayers).toHaveBeenCalledExactlyOnceWith(gameHistoryRecordToInsert.play.votes, game);
    });

    it("should call generateCurrentGameHistoryRecordPlayVotingResultToInsert method when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const newGame = createFakeGameWithCurrentPlay(game);
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: createFakeGameHistoryRecordPlay({ votes: [createFakeGameHistoryRecordPlayVote()] }) });
      const nominatedPlayers = [players[2]];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingResultToInsert.mockReturnValue(GameHistoryRecordVotingResults.DEATH);
      services.gameHistoryRecord["generateCurrentGameHistoryRecordPlayVotingToInsert"](game, newGame, gameHistoryRecordToInsert);

      expect(localMocks.gameHistoryRecordService.generateCurrentGameHistoryRecordPlayVotingResultToInsert).toHaveBeenCalledExactlyOnceWith(game, newGame, gameHistoryRecordToInsert);
    });
  });

  describe("generateCurrentGameHistoryRecordPlaySourceToInsert", () => {
    it("should generate current game history record play source when called.", () => {
      const players = [
        createFakeHunterAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
      ];
      const expectedPlayers = [players[0], players[1], players[3]];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createGamePlayAllElectSheriff({ source: createFakeGamePlaySource({ name: PlayerGroups.ALL, players: expectedPlayers }) }), players });
      const expectedGameHistoryRecordPlaySource = createFakeGameHistoryRecordPlaySource({
        name: game.currentPlay.source.name,
        players: expectedPlayers,
      });

      expect(services.gameHistoryRecord["generateCurrentGameHistoryRecordPlaySourceToInsert"](game)).toStrictEqual(expectedGameHistoryRecordPlaySource);
    });
  });

  describe("validateGameHistoryRecordToInsertPlayData", () => {
    const fakeGameAdditionalCards = bulkCreateFakeGameAdditionalCards(3);
    const fakeGame = createFakeGame({ players: bulkCreateFakePlayers(4), additionalCards: fakeGameAdditionalCards });
    const fakePlayer = createFakePlayer();
    const fakeCard = createFakeGameAdditionalCard();

    it.each<{ play: GameHistoryRecordPlay; test: string; errorParameters: [ApiResources, string, string] }>([
      {
        play: createFakeGameHistoryRecordPlay({ source: { name: PlayerAttributeNames.SHERIFF, players: [fakePlayer] } }),
        test: "a source is not in the game",
        errorParameters: [ApiResources.PLAYERS, fakePlayer._id.toString(), "Game Play - Player in `source.players` is not in the game players"],
      },
      {
        play: createFakeGameHistoryRecordPlay({
          source: {
            name: PlayerAttributeNames.SHERIFF,
            players: fakeGame.players,
          },
          targets: [{ player: fakePlayer }],
        }),
        test: "a target is not in the game",
        errorParameters: [ApiResources.PLAYERS, fakePlayer._id.toString(), "Game Play - Player in `targets.player` is not in the game players"],
      },
      {
        play: createFakeGameHistoryRecordPlay({
          source: {
            name: PlayerAttributeNames.SHERIFF,
            players: fakeGame.players,
          },
          votes: [{ source: fakePlayer, target: fakeGame.players[0] }],
        }),
        test: "a vote source is not in the game",
        errorParameters: [ApiResources.PLAYERS, fakePlayer._id.toString(), "Game Play - Player in `votes.source` is not in the game players"],
      },
      {
        play: createFakeGameHistoryRecordPlay({
          source: {
            name: PlayerAttributeNames.SHERIFF,
            players: fakeGame.players,
          },
          votes: [{ target: fakePlayer, source: fakeGame.players[0] }],
        }),
        test: "a vote target is not in the game",
        errorParameters: [ApiResources.PLAYERS, fakePlayer._id.toString(), "Game Play - Player in `votes.target` is not in the game players"],
      },
      {
        play: createFakeGameHistoryRecordPlay({
          source: {
            name: PlayerAttributeNames.SHERIFF,
            players: fakeGame.players,
          },
          chosenCard: fakeCard,
        }),
        test: "chosen card is not in the game",
        errorParameters: [ApiResources.GAME_ADDITIONAL_CARDS, fakeCard._id.toString(), "Game Play - Chosen card is not in the game additional cards"],
      },
    ])("should throw resource not found error when $test [#$#].", ({ play, errorParameters }) => {
      expect(() => services.gameHistoryRecord["validateGameHistoryRecordToInsertPlayData"](play, fakeGame)).toThrow(ResourceNotFoundException);
      expect(ResourceNotFoundException).toHaveBeenCalledExactlyOnceWith(...errorParameters);
    });

    it("should not throw any errors when called with valid play data.", () => {
      const validPlay = createFakeGameHistoryRecordPlay({
        source: {
          name: PlayerAttributeNames.SHERIFF,
          players: fakeGame.players,
        },
        targets: [{ player: fakeGame.players[0] }],
        votes: [{ target: fakeGame.players[1], source: fakeGame.players[0] }],
        chosenCard: fakeGameAdditionalCards[1],
      });

      expect(() => services.gameHistoryRecord["validateGameHistoryRecordToInsertPlayData"](validPlay, fakeGame)).not.toThrow();
    });
  });

  describe("validateGameHistoryRecordToInsertData", () => {
    const existingId = createFakeObjectId();
    const existingGame = createFakeGame();
    const fakePlayer = createFakePlayer();
    const unknownId = createFakeObjectId();

    beforeEach(() => {
      when(mocks.gameRepository.findOne).calledWith({ _id: unknownId.toJSON() }).mockResolvedValue(null);
      when(mocks.gameRepository.findOne).calledWith({ _id: existingId.toJSON() }).mockResolvedValue(existingGame);
    });

    it.each<{ gameHistoryRecord: GameHistoryRecordToInsert; test: string; errorParameters: [ApiResources, string, string] }>([
      {
        gameHistoryRecord: createFakeGameHistoryRecordToInsert({ gameId: unknownId }),
        test: "game is not found with specified gameId",
        errorParameters: [ApiResources.GAMES, unknownId.toString(), "Game Play - Game Id is unknown in database"],
      },
      {
        gameHistoryRecord: createFakeGameHistoryRecordToInsert({ gameId: existingId, revealedPlayers: [fakePlayer] }),
        test: "a revealed player is not in the game",
        errorParameters: [ApiResources.PLAYERS, fakePlayer._id.toString(), "Game Play - Player in `revealedPlayers` is not in the game players"],
      },
      {
        gameHistoryRecord: createFakeGameHistoryRecordToInsert({ gameId: existingId, deadPlayers: [fakePlayer] }),
        test: "a dead player is not in the game",
        errorParameters: [ApiResources.PLAYERS, fakePlayer._id.toString(), "Game Play - Player in `deadPlayers` is not in the game players"],
      },
    ])("should throw resource not found error when $test [#$#].", async({ gameHistoryRecord, errorParameters }) => {
      await expect(services.gameHistoryRecord["validateGameHistoryRecordToInsertData"](gameHistoryRecord)).toReject();
      expect(ResourceNotFoundException).toHaveBeenCalledExactlyOnceWith(...errorParameters);
    });

    it("should not throw any errors when called with valid data.", async() => {
      const validPlay = createFakeGameHistoryRecordToInsert({
        gameId: existingId,
        play: createFakeGameHistoryRecordPlay({ source: { name: PlayerAttributeNames.SHERIFF, players: existingGame.players } }),
        revealedPlayers: existingGame.players,
        deadPlayers: existingGame.players,
      });

      await expect(services.gameHistoryRecord["validateGameHistoryRecordToInsertData"](validPlay)).resolves.not.toThrow();
    });
  });
});