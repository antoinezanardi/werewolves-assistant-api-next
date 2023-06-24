import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { when } from "jest-when";
import { WITCH_POTIONS } from "../../../../../../../../src/modules/game/enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES } from "../../../../../../../../src/modules/game/enums/player.enum";
import { GameHistoryRecordRepository } from "../../../../../../../../src/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "../../../../../../../../src/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "../../../../../../../../src/modules/game/providers/services/game-history/game-history-record.service";
import type { GameHistoryRecordPlay } from "../../../../../../../../src/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import type { GameHistoryRecordToInsert } from "../../../../../../../../src/modules/game/types/game-history-record.type";
import { API_RESOURCES } from "../../../../../../../../src/shared/api/enums/api.enum";
import { ResourceNotFoundException } from "../../../../../../../../src/shared/exception/types/resource-not-found-exception.type";
import { bulkCreateFakeGameAdditionalCards, createFakeGameAdditionalCard } from "../../../../../../../factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecordPlay } from "../../../../../../../factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { bulkCreateFakePlayers, createFakePlayer } from "../../../../../../../factories/game/schemas/player/player.schema.factory";
import { createFakeGameHistoryRecordToInsert } from "../../../../../../../factories/game/types/game-history-record/game-history-record.type.factory";
import { createFakeObjectId } from "../../../../../../../factories/shared/mongoose/mongoose.factory";

jest.mock("../../../../../../../../src/shared/exception/types/resource-not-found-exception.type");

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
    };
    gameRepository: { findOne: jest.SpyInstance };
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
      },
      gameRepository: { findOne: jest.fn() },
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
      await services.gameHistoryRecord.getLastGameHistoryTieInVotesRecord(gameId);

      expect(repositories.gameHistoryRecord.getLastGameHistoryTieInVotesRecord).toHaveBeenCalledExactlyOnceWith(gameId);
    });
  });

  describe("getGameHistoryWitchUsesSpecificPotionRecords", () => {
    it("should get game history records when witch used life potion when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, WITCH_POTIONS.LIFE);

      expect(repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords).toHaveBeenCalledExactlyOnceWith(gameId, WITCH_POTIONS.LIFE);
    });

    it("should get game history records when witch used death potion when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords(gameId, WITCH_POTIONS.DEATH);

      expect(repositories.gameHistoryRecord.getGameHistoryWitchUsesSpecificPotionRecords).toHaveBeenCalledExactlyOnceWith(gameId, WITCH_POTIONS.DEATH);
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

  describe("getPreviousGameHistoryRecord", () => {
    it("should previous game history record when called.", async() => {
      const gameId = createFakeObjectId();
      await services.gameHistoryRecord.getPreviousGameHistoryRecord(gameId);

      expect(repositories.gameHistoryRecord.getPreviousGameHistoryRecord).toHaveBeenCalledExactlyOnceWith(gameId);
    });
  });

  describe("validateGameHistoryRecordToInsertPlayData", () => {
    const fakeGameAdditionalCards = bulkCreateFakeGameAdditionalCards(3);
    const fakeGame = createFakeGame({ players: bulkCreateFakePlayers(4), additionalCards: fakeGameAdditionalCards });
    const fakePlayer = createFakePlayer();
    const fakeCard = createFakeGameAdditionalCard();

    it.each<{ play: GameHistoryRecordPlay; test: string; errorParameters: [API_RESOURCES, string, string] }>([
      {
        play: createFakeGameHistoryRecordPlay({ source: { name: PLAYER_ATTRIBUTE_NAMES.SHERIFF, players: [fakePlayer] } }),
        test: "a source is not in the game",
        errorParameters: [API_RESOURCES.PLAYERS, fakePlayer._id.toString(), "Game Play - Player in `source.players` is not in the game players"],
      },
      {
        play: createFakeGameHistoryRecordPlay({
          source: {
            name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
            players: fakeGame.players,
          },
          targets: [{ player: fakePlayer }],
        }),
        test: "a target is not in the game",
        errorParameters: [API_RESOURCES.PLAYERS, fakePlayer._id.toString(), "Game Play - Player in `targets.player` is not in the game players"],
      },
      {
        play: createFakeGameHistoryRecordPlay({
          source: {
            name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
            players: fakeGame.players,
          },
          votes: [{ source: fakePlayer, target: fakeGame.players[0] }],
        }),
        test: "a vote source is not in the game",
        errorParameters: [API_RESOURCES.PLAYERS, fakePlayer._id.toString(), "Game Play - Player in `votes.source` is not in the game players"],
      },
      {
        play: createFakeGameHistoryRecordPlay({
          source: {
            name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
            players: fakeGame.players,
          },
          votes: [{ target: fakePlayer, source: fakeGame.players[0] }],
        }),
        test: "a vote target is not in the game",
        errorParameters: [API_RESOURCES.PLAYERS, fakePlayer._id.toString(), "Game Play - Player in `votes.target` is not in the game players"],
      },
      {
        play: createFakeGameHistoryRecordPlay({
          source: {
            name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
            players: fakeGame.players,
          },
          chosenCard: fakeCard,
        }),
        test: "chosen card is not in the game",
        errorParameters: [API_RESOURCES.GAME_ADDITIONAL_CARDS, fakeCard._id.toString(), "Game Play - Chosen card is not in the game additional cards"],
      },
    ])("should throw resource not found error when $test [#$#].", ({ play, errorParameters }) => {
      expect(() => services.gameHistoryRecord["validateGameHistoryRecordToInsertPlayData"](play, fakeGame)).toThrow(ResourceNotFoundException);
      expect(ResourceNotFoundException).toHaveBeenCalledExactlyOnceWith(...errorParameters);
    });

    it("should not throw any errors when called with valid play data.", () => {
      const validPlay = createFakeGameHistoryRecordPlay({
        source: {
          name: PLAYER_ATTRIBUTE_NAMES.SHERIFF,
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

    it.each<{ gameHistoryRecord: GameHistoryRecordToInsert; test: string; errorParameters: [API_RESOURCES, string, string] }>([
      {
        gameHistoryRecord: createFakeGameHistoryRecordToInsert({ gameId: unknownId }),
        test: "game is not found with specified gameId",
        errorParameters: [API_RESOURCES.GAMES, unknownId.toString(), "Game Play - Game Id is unknown in database"],
      },
      {
        gameHistoryRecord: createFakeGameHistoryRecordToInsert({ gameId: existingId, revealedPlayers: [fakePlayer] }),
        test: "a revealed player is not in the game",
        errorParameters: [API_RESOURCES.PLAYERS, fakePlayer._id.toString(), "Game Play - Player in `revealedPlayers` is not in the game players"],
      },
      {
        gameHistoryRecord: createFakeGameHistoryRecordToInsert({ gameId: existingId, deadPlayers: [fakePlayer] }),
        test: "a dead player is not in the game",
        errorParameters: [API_RESOURCES.PLAYERS, fakePlayer._id.toString(), "Game Play - Player in `deadPlayers` is not in the game players"],
      },
    ])("should throw resource not found error when $test [#$#].", async({ gameHistoryRecord, errorParameters }) => {
      await expect(services.gameHistoryRecord["validateGameHistoryRecordToInsertData"](gameHistoryRecord)).toReject();
      expect(ResourceNotFoundException).toHaveBeenCalledExactlyOnceWith(...errorParameters);
    });

    it("should not throw any errors when called with valid data.", async() => {
      const validPlay = createFakeGameHistoryRecordToInsert({
        gameId: existingId,
        play: createFakeGameHistoryRecordPlay({ source: { name: PLAYER_ATTRIBUTE_NAMES.SHERIFF, players: existingGame.players } }),
        revealedPlayers: existingGame.players,
        deadPlayers: existingGame.players,
      });

      await expect(services.gameHistoryRecord["validateGameHistoryRecordToInsertData"](validPlay)).resolves.not.toThrow();
    });
  });
});