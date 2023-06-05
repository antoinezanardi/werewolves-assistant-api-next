import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { GAME_STATUSES } from "../../../../../../../src/modules/game/enums/game.enum";
import * as GameVictoryHelper from "../../../../../../../src/modules/game/helpers/game-victory/game-victory.helper";
import { GameHistoryRecordRepository } from "../../../../../../../src/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "../../../../../../../src/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "../../../../../../../src/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlaysManagerService } from "../../../../../../../src/modules/game/providers/services/game-play/game-plays-manager.service";
import { GamePlaysValidatorService } from "../../../../../../../src/modules/game/providers/services/game-play/game-plays-validator.service";
import { GameService } from "../../../../../../../src/modules/game/providers/services/game.service";
import { API_RESOURCES } from "../../../../../../../src/shared/api/enums/api.enum";
import { BadResourceMutationException } from "../../../../../../../src/shared/exception/types/bad-resource-mutation-exception.type";
import { ResourceNotFoundException } from "../../../../../../../src/shared/exception/types/resource-not-found-exception.type";
import { createFakeCreateGameDto } from "../../../../../../factories/game/dto/create-game/create-game.dto.factory";
import { createFakeMakeGamePlayDto } from "../../../../../../factories/game/dto/make-game-play/make-game-play.dto.factory";
import { createFakeGameVictory } from "../../../../../../factories/game/schemas/game-victory/game-victory.schema.factory";
import { createFakeGame } from "../../../../../../factories/game/schemas/game.schema.factory";
import { createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer } from "../../../../../../factories/game/schemas/player/player-with-role.schema.factory";

jest.mock("../../../../../../../src/shared/exception/types/bad-resource-mutation-exception.type");
jest.mock("../../../../../../../src/shared/exception/types/resource-not-found-exception.type");

describe("Game Service", () => {
  let mocks: {
    gameRepository: {
      find: jest.SpyInstance;
      findOne: jest.SpyInstance;
      create: jest.SpyInstance;
      updateOne: jest.SpyInstance;
    };
    gameHistoryRecordRepository: {
      find: jest.SpyInstance;
      create: jest.SpyInstance;
    };
    gamePlaysValidatorService: { validateGamePlayWithRelationsDtoData: jest.SpyInstance };
  };
  let services: { game: GameService };
  let repositories: { game: GameRepository };

  beforeEach(async() => {
    mocks = {
      gameRepository: {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        updateOne: jest.fn(),
      },
      gameHistoryRecordRepository: {
        find: jest.fn(),
        create: jest.fn(),
      },
      gamePlaysValidatorService: { validateGamePlayWithRelationsDtoData: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GameRepository,
          useValue: mocks.gameRepository,
        },
        {
          provide: GameHistoryRecordRepository,
          useValue: mocks.gameHistoryRecordRepository,
        },
        GamePlaysManagerService,
        {
          provide: GamePlaysValidatorService,
          useValue: mocks.gamePlaysValidatorService,
        },
        GameHistoryRecordService,
        GameService,
      ],
    }).compile();

    services = { game: module.get<GameService>(GameService) };
    repositories = { game: module.get<GameRepository>(GameRepository) };
  });

  describe("getGames", () => {
    it("should get all games when called.", async() => {
      await services.game.getGames();

      expect(repositories.game.find).toHaveBeenCalledWith();
    });
  });

  describe("createGame", () => {
    it("should create game when called.", async() => {
      const toCreateGame = createFakeCreateGameDto();
      await services.game.createGame(toCreateGame);

      expect(repositories.game.create).toHaveBeenCalledOnce();
    });
  });

  describe("cancelGame", () => {
    const existingPlayingGame = createFakeGame({ status: GAME_STATUSES.PLAYING });

    it("should throw error when game is not playing.", async() => {
      const canceledGame = createFakeGame({ status: GAME_STATUSES.CANCELED });

      await expect(services.game.cancelGame(canceledGame)).toReject();
      expect(BadResourceMutationException).toHaveBeenCalledWith(API_RESOURCES.GAMES, canceledGame._id.toString(), `Game doesn't have status with value "playing"`);
    });
    
    it("should call update method from repository when game can be canceled.", async() => {
      await services.game.cancelGame(existingPlayingGame);

      expect(mocks.gameRepository.updateOne).toHaveBeenCalledWith({ _id: existingPlayingGame._id }, { status: GAME_STATUSES.CANCELED });
    });

    it("should throw an error when game not found by update repositories.game method.", async() => {
      mocks.gameRepository.updateOne.mockResolvedValue(null);

      await expect(services.game.cancelGame(existingPlayingGame)).toReject();
      expect(ResourceNotFoundException).toHaveBeenCalledWith(API_RESOURCES.GAMES, existingPlayingGame._id.toString());
    });
  });

  describe("makeGamePlay", () => {
    const players = [
      createFakeWerewolfAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
      createFakeVillagerAlivePlayer(),
      createFakeVillagerAlivePlayer(),
    ];
    const game = createFakeGame({ status: GAME_STATUSES.PLAYING, players });
    const nearlyAllDeadPlayers = [
      createFakeWerewolfAlivePlayer(),
      createFakeWerewolfAlivePlayer({ isAlive: false }),
      createFakeVillagerAlivePlayer({ isAlive: false }),
      createFakeVillagerAlivePlayer({ isAlive: false }),
    ];
    const soonToBeOverGame = createFakeGame({ status: GAME_STATUSES.PLAYING, players: nearlyAllDeadPlayers });

    beforeEach(() => {
      mocks.gameRepository.updateOne.mockResolvedValue(game);
    });

    it("should throw an error when game is not playing.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const canceledGame = createFakeGame({ status: GAME_STATUSES.CANCELED });

      await expect(services.game.makeGamePlay(canceledGame, makeGamePlayDto)).toReject();
      expect(BadResourceMutationException).toHaveBeenCalledWith(API_RESOURCES.GAMES, canceledGame._id.toString(), `Game doesn't have status with value "playing"`);
    });

    it("should call play validator when called.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();

      await expect(services.game.makeGamePlay(game, makeGamePlayDto)).resolves.toStrictEqual(game);
      expect(mocks.gamePlaysValidatorService.validateGamePlayWithRelationsDtoData).toHaveBeenCalledOnce();
    });

    it("should throw an error when game not found by update repository method.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      mocks.gameRepository.updateOne.mockResolvedValue(null);

      await expect(services.game.makeGamePlay(game, makeGamePlayDto)).toReject();
      expect(ResourceNotFoundException).toHaveBeenCalledWith(API_RESOURCES.GAMES, game._id.toString());
    });

    it("should set game as over when the game is done.", async() => {
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      const gameVictoryData = createFakeGameVictory();
      jest.spyOn(GameVictoryHelper, "generateGameVictoryData").mockReturnValue(gameVictoryData);

      await services.game.makeGamePlay(soonToBeOverGame, makeGamePlayDto);
      expect(mocks.gameRepository.updateOne).toHaveBeenCalledWith({ _id: soonToBeOverGame._id }, { status: GAME_STATUSES.OVER, victory: gameVictoryData });
    });
  });
});