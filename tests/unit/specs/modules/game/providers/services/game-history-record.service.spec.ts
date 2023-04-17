import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { when } from "jest-when";
import { PLAYER_ATTRIBUTE_NAMES } from "../../../../../../../src/modules/game/enums/player.enum";
import { GameHistoryRecordRepository } from "../../../../../../../src/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "../../../../../../../src/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "../../../../../../../src/modules/game/providers/services/game-history-record.service";
import type { GameHistoryRecordPlay } from "../../../../../../../src/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import type { GameHistoryRecordToInsert } from "../../../../../../../src/modules/game/types/game-history-record.type";
import { bulkCreateFakeGameAdditionalCards, createFakeGameAdditionalCard } from "../../../../../../factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecordPlay } from "../../../../../../factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGame } from "../../../../../../factories/game/schemas/game.schema.factory";
import { createFakePlayer } from "../../../../../../factories/game/schemas/player/player.schema.factory";
import { createFakeGameHistoryRecordToInsert } from "../../../../../../factories/game/types/game-history-record/game-history-record.type.factory";

describe("Game History Record Service", () => {
  let service: GameHistoryRecordService;
  let repository: GameHistoryRecordRepository;

  const gameHistoryRecordRepositoryMock = {
    find: jest.fn(),
    create: jest.fn(),
  };
  
  const gameRepositoryMock = { findOne: jest.fn() };

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GameHistoryRecordRepository,
          useValue: gameHistoryRecordRepositoryMock,
        },
        {
          provide: GameRepository,
          useValue: gameRepositoryMock,
        },
        GameHistoryRecordService,
      ],
    }).compile();
    service = module.get<GameHistoryRecordService>(GameHistoryRecordService);
    repository = module.get<GameHistoryRecordRepository>(GameHistoryRecordRepository);
  });

  describe("getGameHistoryRecordsByGameId", () => {
    it("should get all game history records when called with specific id.", async() => {
      await service.getGameHistoryRecordsByGameId("123");
      expect(repository.find).toHaveBeenCalledWith({ gameId: "123" });
    });
  });

  describe("checkGameHistoryRecordToInsertPlayData", () => {
    const fakeGameAdditionalCards = bulkCreateFakeGameAdditionalCards(3);
    const fakeGame = createFakeGame({ additionalCards: fakeGameAdditionalCards });
    const fakePlayer = createFakePlayer();
    const fakeCard = createFakeGameAdditionalCard();

    it.each<{ play: GameHistoryRecordPlay; test: string; errorMessage: string }>([
      {
        play: createFakeGameHistoryRecordPlay({ source: { name: PLAYER_ATTRIBUTE_NAMES.SHERIFF, players: [fakePlayer] } }),
        test: "a source is not in the game",
        errorMessage: `Player with id "${fakePlayer._id}" not found : Game Play - Player in \`source.players\` is not in the game players`,
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
        errorMessage: `Player with id "${fakePlayer._id}" not found : Game Play - Player in \`targets.player\` is not in the game players`,
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
        errorMessage: `Player with id "${fakePlayer._id}" not found : Game Play - Player in \`votes.source\` is not in the game players`,
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
        errorMessage: `Player with id "${fakePlayer._id}" not found : Game Play - Player in \`votes.target\` is not in the game players`,
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
        errorMessage: `Additional card with id "${fakeCard._id}" not found : Game Play - Chosen card is not in the game additional cards`,
      },
    ])("should throw resource not found error when $test [#$#].", ({ play, errorMessage }) => {
      expect(() => service.checkGameHistoryRecordToInsertPlayData(play, fakeGame)).toThrow(errorMessage);
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
      expect(() => service.checkGameHistoryRecordToInsertPlayData(validPlay, fakeGame)).not.toThrow();
    });
  });

  describe("checkGameHistoryRecordToInsertData", () => {
    const existingId = "good-id";
    const existingGame = createFakeGame();
    let fakePlayer = createFakePlayer();
    const unknownId = "bad-id";

    beforeEach(() => {
      when(gameRepositoryMock.findOne).calledWith({ _id: unknownId }).mockResolvedValue(null);
      when(gameRepositoryMock.findOne).calledWith({ _id: existingId }).mockResolvedValue(existingGame);
      fakePlayer = createFakePlayer();
    });

    it.each<{ gameHistoryRecord: GameHistoryRecordToInsert; test: string; errorMessage: string }>([
      {
        gameHistoryRecord: createFakeGameHistoryRecordToInsert({ gameId: unknownId }),
        test: "game is not found with specified gameId",
        errorMessage: `Game with id "${unknownId}" not found : Game Play - Game Id is unknown in database`,
      },
      {
        gameHistoryRecord: createFakeGameHistoryRecordToInsert({ gameId: existingId, revealedPlayers: [fakePlayer] }),
        test: "a revealed player is not in the game",
        errorMessage: `Player with id "${fakePlayer._id}" not found : Game Play - Player in \`revealedPlayers\` is not in the game players`,
      },
      {
        gameHistoryRecord: createFakeGameHistoryRecordToInsert({ gameId: existingId, deadPlayers: [fakePlayer] }),
        test: "a dead player is not in the game",
        errorMessage: `Player with id "${fakePlayer._id}" not found : Game Play - Player in \`deadPlayers\` is not in the game players`,
      },
    ])("should throw resource not found error when $test [#$#].", async({ gameHistoryRecord, errorMessage }) => {
      await expect(service.checkGameHistoryRecordToInsertData(gameHistoryRecord)).rejects.toThrow(errorMessage);
    });
    
    it("should not throw any errors when called with valid data.", async() => {
      const validPlay = createFakeGameHistoryRecordToInsert({
        gameId: existingId,
        play: createFakeGameHistoryRecordPlay({ source: { name: PLAYER_ATTRIBUTE_NAMES.SHERIFF, players: existingGame.players } }),
        revealedPlayers: existingGame.players,
        deadPlayers: existingGame.players,
      });
      await expect(service.checkGameHistoryRecordToInsertData(validPlay)).resolves.not.toThrow();
    });
  });

  describe("createGameHistoryRecord", () => {
    it("should create game history record when called with valid data.", async() => {
      jest.spyOn(service, "checkGameHistoryRecordToInsertData").mockImplementation();
      const validPlay = createFakeGameHistoryRecordToInsert({
        gameId: "123",
        play: createFakeGameHistoryRecordPlay(),
      });
      await service.createGameHistoryRecord(validPlay);
      expect(repository.create).toHaveBeenCalledWith(validPlay);
    });
  });
});