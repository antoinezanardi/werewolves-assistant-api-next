import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import { GameEventsGeneratorService } from "@/modules/game/providers/services/game-event/game-events-generator.service";
import type { GameEvent } from "@/modules/game/schemas/game-event/game-event.schema";

import { createFakeGameEvent } from "@tests/factories/game/schemas/game-event/game-event.schema.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlayerAttributeAlteration, createFakeGameHistoryRecordPlaySource, createFakeGameHistoryRecordPlayTarget } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGamePhase } from "@tests/factories/game/schemas/game-phase/game-phase.schema.factory";
import { createFakeGamePlaySurvivorsVote, createFakeGamePlayWerewolvesEat } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakePlayerAttribute, createFakeScandalmongerMarkedByScandalmongerPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeActorAlivePlayer, createFakeBearTamerAlivePlayer, createFakeElderAlivePlayer, createFakeIdiotAlivePlayer, createFakePrejudicedManipulatorAlivePlayer, createFakeScandalmongerAlivePlayer, createFakeThiefAlivePlayer, createFakeVillagerAlivePlayer, createFakeVillagerVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWolfHoundAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakeDeadPlayer, createFakePlayerSide } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Events Generator Service", () => {
  let mocks: {
    gameEventsGeneratorService: {
      generateFirstTickRoleBasedGameEvents: jest.SpyInstance;
      generateSeerHasSeenGameEvent: jest.SpyInstance;
      generateScandalmongerHayHaveMarkedGameEvent: jest.SpyInstance;
      generateAccursedWolfFatherMayHaveInfectedGameEvent: jest.SpyInstance;
      generateWolfHoundHasChosenSideGameEvent: jest.SpyInstance;
      generatePiedPiperHasCharmedGameEvent: jest.SpyInstance;
      generateCupidHasCharmedGameEvent: jest.SpyInstance;
      generateFoxMayHaveSniffedGameEvent: jest.SpyInstance;
      generateThiefMayHaveChosenCardGameEvent: jest.SpyInstance;
      generateActorMayHaveChosenCardGameEvent: jest.SpyInstance;
      generateLastGamePlaySourceGameEvent: jest.SpyInstance;
      generateFirstTickGameEvents: jest.SpyInstance;
      generateRevealedPlayersGameEvents: jest.SpyInstance;
      generateSwitchedSidePlayersGameEvents: jest.SpyInstance;
      generateDeadPlayersGameEvents: jest.SpyInstance;
      generateBearGrowlsOrSleepsGameEvent: jest.SpyInstance;
      generatePlayerAttributeAlterationsEvents: jest.SpyInstance;
      generateTurnStartsGameEvents: jest.SpyInstance;
    };
  };
  let services: { gameEventsGenerator: GameEventsGeneratorService };

  beforeEach(async() => {
    mocks = {
      gameEventsGeneratorService: {
        generateFirstTickRoleBasedGameEvents: jest.fn(),
        generateSeerHasSeenGameEvent: jest.fn(),
        generateScandalmongerHayHaveMarkedGameEvent: jest.fn(),
        generateAccursedWolfFatherMayHaveInfectedGameEvent: jest.fn(),
        generateWolfHoundHasChosenSideGameEvent: jest.fn(),
        generatePiedPiperHasCharmedGameEvent: jest.fn(),
        generateCupidHasCharmedGameEvent: jest.fn(),
        generateFoxMayHaveSniffedGameEvent: jest.fn(),
        generateThiefMayHaveChosenCardGameEvent: jest.fn(),
        generateActorMayHaveChosenCardGameEvent: jest.fn(),
        generateLastGamePlaySourceGameEvent: jest.fn(),
        generateFirstTickGameEvents: jest.fn(),
        generateRevealedPlayersGameEvents: jest.fn(),
        generateSwitchedSidePlayersGameEvents: jest.fn(),
        generateDeadPlayersGameEvents: jest.fn(),
        generateBearGrowlsOrSleepsGameEvent: jest.fn(),
        generatePlayerAttributeAlterationsEvents: jest.fn(),
        generateTurnStartsGameEvents: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({ providers: [GameEventsGeneratorService] }).compile();

    services = { gameEventsGenerator: module.get<GameEventsGeneratorService>(GameEventsGeneratorService) };
  });

  describe("generateGameEventsFromGameAndLastRecord", () => {
    beforeEach(() => {
      mocks.gameEventsGeneratorService.generateFirstTickGameEvents = jest.spyOn(services.gameEventsGenerator as unknown as { generateFirstTickGameEvents }, "generateFirstTickGameEvents").mockReturnValue([]);
      mocks.gameEventsGeneratorService.generateRevealedPlayersGameEvents = jest.spyOn(services.gameEventsGenerator as unknown as { generateRevealedPlayersGameEvents }, "generateRevealedPlayersGameEvents").mockReturnValue([]);
      mocks.gameEventsGeneratorService.generateSwitchedSidePlayersGameEvents = jest.spyOn(services.gameEventsGenerator as unknown as { generateSwitchedSidePlayersGameEvents }, "generateSwitchedSidePlayersGameEvents").mockReturnValue([]);
      mocks.gameEventsGeneratorService.generateDeadPlayersGameEvents = jest.spyOn(services.gameEventsGenerator as unknown as { generateDeadPlayersGameEvents }, "generateDeadPlayersGameEvents").mockReturnValue([]);
      mocks.gameEventsGeneratorService.generateBearGrowlsOrSleepsGameEvent = jest.spyOn(services.gameEventsGenerator as unknown as { generateBearGrowlsOrSleepsGameEvent }, "generateBearGrowlsOrSleepsGameEvent").mockReturnValue([]);
      mocks.gameEventsGeneratorService.generatePlayerAttributeAlterationsEvents = jest.spyOn(services.gameEventsGenerator as unknown as { generatePlayerAttributeAlterationsEvents }, "generatePlayerAttributeAlterationsEvents").mockReturnValue([]);
      mocks.gameEventsGeneratorService.generateTurnStartsGameEvents = jest.spyOn(services.gameEventsGenerator as unknown as { generateTurnStartsGameEvents }, "generateTurnStartsGameEvents").mockReturnValue([]);
      mocks.gameEventsGeneratorService.generateLastGamePlaySourceGameEvent = jest.spyOn(services.gameEventsGenerator as unknown as { generateLastGamePlaySourceGameEvent }, "generateLastGamePlaySourceGameEvent").mockReturnValue(undefined);
    });

    it("should generate first tick game events when called.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord();
      const game = createFakeGame();
      services.gameEventsGenerator.generateGameEventsFromGameAndLastRecord(game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateFirstTickGameEvents).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should generate revealed players game events when called.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord();
      const game = createFakeGame();
      services.gameEventsGenerator.generateGameEventsFromGameAndLastRecord(game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateRevealedPlayersGameEvents).toHaveBeenCalledExactlyOnceWith(gameHistoryRecord);
    });

    it("should generate last game play source game event when called.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord();
      const game = createFakeGame();
      services.gameEventsGenerator.generateGameEventsFromGameAndLastRecord(game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateLastGamePlaySourceGameEvent).toHaveBeenCalledExactlyOnceWith(game, gameHistoryRecord);
    });

    it("should generate switched side players game events when called.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord();
      const game = createFakeGame();
      services.gameEventsGenerator.generateGameEventsFromGameAndLastRecord(game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateSwitchedSidePlayersGameEvents).toHaveBeenCalledExactlyOnceWith(gameHistoryRecord);
    });

    it("should generate dead players game events when called.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord();
      const game = createFakeGame();
      services.gameEventsGenerator.generateGameEventsFromGameAndLastRecord(game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateDeadPlayersGameEvents).toHaveBeenCalledExactlyOnceWith(gameHistoryRecord);
    });

    it("should generate player attribute alterations events when called.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord();
      const game = createFakeGame();
      services.gameEventsGenerator.generateGameEventsFromGameAndLastRecord(game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generatePlayerAttributeAlterationsEvents).toHaveBeenCalledExactlyOnceWith(game, gameHistoryRecord);
    });

    it("should generate starting game phase tick game events when called.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord();
      const game = createFakeGame();
      services.gameEventsGenerator.generateGameEventsFromGameAndLastRecord(game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateTurnStartsGameEvents).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should generate turn start game events when called.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord();
      const game = createFakeGame();
      services.gameEventsGenerator.generateGameEventsFromGameAndLastRecord(game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateTurnStartsGameEvents).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should return generated events with last game play source event when there is a last game play source event.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord();
      const game = createFakeGame();
      const gameEvent = createFakeGameEvent();
      mocks.gameEventsGeneratorService.generateLastGamePlaySourceGameEvent.mockReturnValue(gameEvent);
      const gameEvents = services.gameEventsGenerator.generateGameEventsFromGameAndLastRecord(game, gameHistoryRecord);

      expect(gameEvents).toStrictEqual<GameEvent[]>([gameEvent]);
    });

    it("should return generated events without last game play source event when there is no last game play source event.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord();
      const game = createFakeGame();
      mocks.gameEventsGeneratorService.generateLastGamePlaySourceGameEvent.mockReturnValue(undefined);
      const gameEvents = services.gameEventsGenerator.generateGameEventsFromGameAndLastRecord(game, gameHistoryRecord);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });
  });

  describe("sortGameEventsByGamePhase", () => {
    it("should sort events for day phase when game phase is day.", () => {
      const game = createFakeGame({
        phase: createFakeGamePhase({ name: "day" }),
      });
      const gameEvents = [
        createFakeGameEvent({ type: "elder-has-taken-revenge" }),
        createFakeGameEvent({ type: "death" }),
        createFakeGameEvent({ type: "game-starts" }),
        createFakeGameEvent({ type: "game-phase-starts" }),
        createFakeGameEvent({ type: "game-turn-starts" }),
        createFakeGameEvent({ type: "seer-has-seen" }),
      ];
      const sortedGameEvents = services.gameEventsGenerator["sortGameEventsByGamePhase"](gameEvents, game);
      const expectedSortedGameEvents = [
        gameEvents[2],
        gameEvents[3],
        gameEvents[1],
        gameEvents[0],
        gameEvents[4],
        gameEvents[5],
      ];

      expect(sortedGameEvents).toStrictEqual<GameEvent[]>(expectedSortedGameEvents);
    });

    it("should sort events for night phase when game phase is night.", () => {
      const game = createFakeGame({
        phase: createFakeGamePhase({ name: "night" }),
      });
      const gameEvents = [
        createFakeGameEvent({ type: "elder-has-taken-revenge" }),
        createFakeGameEvent({ type: "death" }),
        createFakeGameEvent({ type: "game-starts" }),
        createFakeGameEvent({ type: "game-phase-starts" }),
        createFakeGameEvent({ type: "game-turn-starts" }),
        createFakeGameEvent({ type: "seer-has-seen" }),
      ];
      const sortedGameEvents = services.gameEventsGenerator["sortGameEventsByGamePhase"](gameEvents, game);
      const expectedSortedGameEvents = [
        gameEvents[2],
        gameEvents[1],
        gameEvents[5],
        gameEvents[0],
        gameEvents[3],
        gameEvents[4],
      ];

      expect(sortedGameEvents).toStrictEqual<GameEvent[]>(expectedSortedGameEvents);
    });

    it("should sort events for night phase when game phase is twilight.", () => {
      const game = createFakeGame({
        phase: createFakeGamePhase({ name: "twilight" }),
      });
      const gameEvents = [
        createFakeGameEvent({ type: "elder-has-taken-revenge" }),
        createFakeGameEvent({ type: "death" }),
        createFakeGameEvent({ type: "game-starts" }),
        createFakeGameEvent({ type: "game-phase-starts" }),
        createFakeGameEvent({ type: "game-turn-starts" }),
        createFakeGameEvent({ type: "seer-has-seen" }),
      ];
      const sortedGameEvents = services.gameEventsGenerator["sortGameEventsByGamePhase"](gameEvents, game);
      const expectedSortedGameEvents = [
        gameEvents[2],
        gameEvents[1],
        gameEvents[5],
        gameEvents[0],
        gameEvents[3],
        gameEvents[4],
      ];

      expect(sortedGameEvents).toStrictEqual<GameEvent[]>(expectedSortedGameEvents);
    });
  });

  describe("generateSeerHasSeenGameEvent", () => {
    it("should return seer has seen game event with targets when there are targets in last game history record.", () => {
      const targetedPlayers = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const gameEvent = services.gameEventsGenerator["generateSeerHasSeenGameEvent"](targetedPlayers);
      const expectedGameEvent = createFakeGameEvent({
        type: "seer-has-seen",
        players: targetedPlayers,
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should return seer has seen game event without targets when there are no targets in last game history record.", () => {
      const gameEvent = services.gameEventsGenerator["generateSeerHasSeenGameEvent"]();
      const expectedGameEvent = createFakeGameEvent({
        type: "seer-has-seen",
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });
  });

  describe("generateScandalmongerHayHaveMarkedGameEvent", () => {
    it("should return scandalmonger has marked game event with targets when there are targets in last game history record.", () => {
      const targetedPlayers = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const gameEvent = services.gameEventsGenerator["generateScandalmongerHayHaveMarkedGameEvent"](targetedPlayers);
      const expectedGameEvent = createFakeGameEvent({
        type: "scandalmonger-may-have-marked",
        players: targetedPlayers,
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should return scandalmonger has marked game event without targets when there are no targets in last game history record.", () => {
      const gameEvent = services.gameEventsGenerator["generateScandalmongerHayHaveMarkedGameEvent"]();
      const expectedGameEvent = createFakeGameEvent({
        type: "scandalmonger-may-have-marked",
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });
  });

  describe("generateAccursedWolfFatherMayHaveInfectedGameEvent", () => {
    it("should return accursed wolf father may have infected game event with targets when there are targets in last game history record.", () => {
      const targetedPlayers = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const gameEvent = services.gameEventsGenerator["generateAccursedWolfFatherMayHaveInfectedGameEvent"](targetedPlayers);
      const expectedGameEvent = createFakeGameEvent({
        type: "accursed-wolf-father-may-have-infected",
        players: targetedPlayers,
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should return accursed wolf father may have infected game event without targets when there are no targets in last game history record.", () => {
      const gameEvent = services.gameEventsGenerator["generateAccursedWolfFatherMayHaveInfectedGameEvent"]();
      const expectedGameEvent = createFakeGameEvent({
        type: "accursed-wolf-father-may-have-infected",
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });
  });

  describe("generateWolfHoundHasChosenSideGameEvent", () => {
    it("should return wolf hound has chosen side game event when called.", () => {
      const wolfHoundPlayer = createFakeWolfHoundAlivePlayer();
      const game = createFakeGame({
        players: [wolfHoundPlayer],
      });
      const gameEvent = services.gameEventsGenerator["generateWolfHoundHasChosenSideGameEvent"](game);
      const expectedGameEvent = createFakeGameEvent({
        type: "wolf-hound-has-chosen-side",
        players: [wolfHoundPlayer],
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });
  });

  describe("generatePiedPiperHasCharmedGameEvent", () => {
    it("should return pied piper has charmed game event with targets when there are targets in last game history record.", () => {
      const targetedPlayers = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const gameEvent = services.gameEventsGenerator["generatePiedPiperHasCharmedGameEvent"](targetedPlayers);
      const expectedGameEvent = createFakeGameEvent({
        type: "pied-piper-has-charmed",
        players: targetedPlayers,
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should return pied piper has charmed game event without targets when there are no targets in last game history record.", () => {
      const gameEvent = services.gameEventsGenerator["generatePiedPiperHasCharmedGameEvent"]();
      const expectedGameEvent = createFakeGameEvent({
        type: "pied-piper-has-charmed",
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });
  });

  describe("generateCupidHasCharmedGameEvent", () => {
    it("should return cupid has charmed game event with targets when there are targets in last game history record.", () => {
      const targetedPlayers = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const gameEvent = services.gameEventsGenerator["generateCupidHasCharmedGameEvent"](targetedPlayers);
      const expectedGameEvent = createFakeGameEvent({
        type: "cupid-has-charmed",
        players: targetedPlayers,
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should return cupid has charmed game event without targets when there are no targets in last game history record.", () => {
      const gameEvent = services.gameEventsGenerator["generateCupidHasCharmedGameEvent"]();
      const expectedGameEvent = createFakeGameEvent({
        type: "cupid-has-charmed",
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });
  });

  describe("generateFoxMayHaveSniffedGameEvent", () => {
    it("should return fox may have sniffed game event with targets when there are targets in last game history record.", () => {
      const targetedPlayers = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const gameEvent = services.gameEventsGenerator["generateFoxMayHaveSniffedGameEvent"](targetedPlayers);
      const expectedGameEvent = createFakeGameEvent({
        type: "fox-may-have-sniffed",
        players: targetedPlayers,
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should return fox may have sniffed game event without targets when there are no targets in last game history record.", () => {
      const gameEvent = services.gameEventsGenerator["generateFoxMayHaveSniffedGameEvent"]();
      const expectedGameEvent = createFakeGameEvent({
        type: "fox-may-have-sniffed",
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });
  });

  describe("generateThiefMayHaveChosenCardGameEvent", () => {
    it("should return thief may have chosen card game event when called.", () => {
      const players = [createFakeThiefAlivePlayer()];
      const gameEvent = services.gameEventsGenerator["generateThiefMayHaveChosenCardGameEvent"](players);
      const expectedGameEvent = createFakeGameEvent({
        type: "thief-may-have-chosen-card",
        players,
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });
  });

  describe("generateActorMayHaveChosenCardGameEvent", () => {
    it("should return actor may have chosen card game event when called.", () => {
      const players = [createFakeActorAlivePlayer()];
      const gameEvent = services.gameEventsGenerator["generateActorMayHaveChosenCardGameEvent"](players);
      const expectedGameEvent = createFakeGameEvent({
        type: "actor-may-have-chosen-card",
        players,
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });
  });

  describe("generateLastGamePlaySourceGameEvent", () => {
    beforeEach(() => {
      mocks.gameEventsGeneratorService.generateSeerHasSeenGameEvent = jest.spyOn(services.gameEventsGenerator as unknown as { generateSeerHasSeenGameEvent }, "generateSeerHasSeenGameEvent").mockImplementation();
      mocks.gameEventsGeneratorService.generateScandalmongerHayHaveMarkedGameEvent = jest.spyOn(services.gameEventsGenerator as unknown as { generateScandalmongerHayHaveMarkedGameEvent }, "generateScandalmongerHayHaveMarkedGameEvent").mockImplementation();
      mocks.gameEventsGeneratorService.generateAccursedWolfFatherMayHaveInfectedGameEvent = jest.spyOn(services.gameEventsGenerator as unknown as { generateAccursedWolfFatherMayHaveInfectedGameEvent }, "generateAccursedWolfFatherMayHaveInfectedGameEvent").mockImplementation();
      mocks.gameEventsGeneratorService.generateWolfHoundHasChosenSideGameEvent = jest.spyOn(services.gameEventsGenerator as unknown as { generateWolfHoundHasChosenSideGameEvent }, "generateWolfHoundHasChosenSideGameEvent").mockImplementation();
      mocks.gameEventsGeneratorService.generatePiedPiperHasCharmedGameEvent = jest.spyOn(services.gameEventsGenerator as unknown as { generatePiedPiperHasCharmedGameEvent }, "generatePiedPiperHasCharmedGameEvent").mockImplementation();
      mocks.gameEventsGeneratorService.generateCupidHasCharmedGameEvent = jest.spyOn(services.gameEventsGenerator as unknown as { generateCupidHasCharmedGameEvent }, "generateCupidHasCharmedGameEvent").mockImplementation();
      mocks.gameEventsGeneratorService.generateFoxMayHaveSniffedGameEvent = jest.spyOn(services.gameEventsGenerator as unknown as { generateFoxMayHaveSniffedGameEvent }, "generateFoxMayHaveSniffedGameEvent").mockImplementation();
      mocks.gameEventsGeneratorService.generateThiefMayHaveChosenCardGameEvent = jest.spyOn(services.gameEventsGenerator as unknown as { generateThiefMayHaveChosenCardGameEvent }, "generateThiefMayHaveChosenCardGameEvent").mockImplementation();
      mocks.gameEventsGeneratorService.generateActorMayHaveChosenCardGameEvent = jest.spyOn(services.gameEventsGenerator as unknown as { generateActorMayHaveChosenCardGameEvent }, "generateActorMayHaveChosenCardGameEvent").mockImplementation();
    });

    it("should return undefined when game history record is undefined.", () => {
      const game = createFakeGame();
      const gameEvent = services.gameEventsGenerator["generateLastGamePlaySourceGameEvent"](game, undefined);

      expect(gameEvent).toBeUndefined();
    });

    it("should generate seer has seen game event when the last game play source is seer.", () => {
      const targetedPlayers = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players: targetedPlayers });
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          source: createFakeGameHistoryRecordPlaySource({
            name: "seer",
          }),
          targets: [
            createFakeGameHistoryRecordPlayTarget({ player: targetedPlayers[0] }),
            createFakeGameHistoryRecordPlayTarget({ player: targetedPlayers[1] }),
          ],
        }),
      });
      services.gameEventsGenerator["generateLastGamePlaySourceGameEvent"](game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateSeerHasSeenGameEvent).toHaveBeenCalledExactlyOnceWith(targetedPlayers);
    });

    it("should generate scandalmonger may have marked game event when the last game play source is scandalmonger.", () => {
      const game = createFakeGame();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          source: createFakeGameHistoryRecordPlaySource({
            name: "scandalmonger",
          }),
        }),
      });
      services.gameEventsGenerator["generateLastGamePlaySourceGameEvent"](game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateScandalmongerHayHaveMarkedGameEvent).toHaveBeenCalledExactlyOnceWith();
    });

    it("should generate accursed wolf father may have infected game event when the last game play source is accursed wolf father.", () => {
      const game = createFakeGame();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          source: createFakeGameHistoryRecordPlaySource({
            name: "accursed-wolf-father",
          }),
        }),
      });
      services.gameEventsGenerator["generateLastGamePlaySourceGameEvent"](game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateAccursedWolfFatherMayHaveInfectedGameEvent).toHaveBeenCalledExactlyOnceWith();
    });

    it("should generate wolf hound has chosen side game event when the last game play source is wolf hound.", () => {
      const game = createFakeGame();
      const wolfHoundPlayer = createFakeWolfHoundAlivePlayer();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          source: createFakeGameHistoryRecordPlaySource({
            name: "wolf-hound",
            players: [wolfHoundPlayer],
          }),
        }),
      });
      services.gameEventsGenerator["generateLastGamePlaySourceGameEvent"](game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateWolfHoundHasChosenSideGameEvent).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should generate pied piper has charmed game event when the last game play source is pied piper.", () => {
      const game = createFakeGame();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          source: createFakeGameHistoryRecordPlaySource({
            name: "pied-piper",
          }),
        }),
      });
      services.gameEventsGenerator["generateLastGamePlaySourceGameEvent"](game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generatePiedPiperHasCharmedGameEvent).toHaveBeenCalledExactlyOnceWith();
    });

    it("should generate cupid has charmed game event when the last game play source is cupid.", () => {
      const game = createFakeGame();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          source: createFakeGameHistoryRecordPlaySource({
            name: "cupid",
          }),
        }),
      });
      services.gameEventsGenerator["generateLastGamePlaySourceGameEvent"](game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateCupidHasCharmedGameEvent).toHaveBeenCalledExactlyOnceWith();
    });

    it("should generate fox may have sniffed game event when the last game play source is fox.", () => {
      const game = createFakeGame();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          source: createFakeGameHistoryRecordPlaySource({
            name: "fox",
          }),
          targets: [
            createFakeGameHistoryRecordPlayTarget({ player: createFakeWerewolfAlivePlayer() }),
            createFakeGameHistoryRecordPlayTarget({ player: createFakeWerewolfAlivePlayer() }),
          ],
        }),
      });
      services.gameEventsGenerator["generateLastGamePlaySourceGameEvent"](game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateFoxMayHaveSniffedGameEvent).toHaveBeenCalledExactlyOnceWith([]);
    });

    it("should generate thief may have chosen card game event when the last game play source is thief.", () => {
      const thiefPlayer = createFakeThiefAlivePlayer();
      const game = createFakeGame({
        players: [thiefPlayer],
      });
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          source: createFakeGameHistoryRecordPlaySource({
            name: "thief",
            players: [thiefPlayer],
          }),
        }),
      });
      services.gameEventsGenerator["generateLastGamePlaySourceGameEvent"](game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateThiefMayHaveChosenCardGameEvent).toHaveBeenCalledExactlyOnceWith([thiefPlayer]);
    });

    it("should generate actor may have chosen card game event when the last game play source is actor.", () => {
      const game = createFakeGame();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          source: createFakeGameHistoryRecordPlaySource({
            name: "actor",
            players: [createFakeActorAlivePlayer()],
          }),
        }),
      });
      services.gameEventsGenerator["generateLastGamePlaySourceGameEvent"](game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateActorMayHaveChosenCardGameEvent).toHaveBeenCalledExactlyOnceWith([]);
    });

    it("should generate actor may have chosen card game event without actor when the last game play source is actor.", () => {
      const game = createFakeGame();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          source: createFakeGameHistoryRecordPlaySource({
            name: "actor",
          }),
        }),
      });
      gameHistoryRecord.play.source.players = undefined;
      services.gameEventsGenerator["generateLastGamePlaySourceGameEvent"](game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateActorMayHaveChosenCardGameEvent).toHaveBeenCalledExactlyOnceWith();
    });

    it("should return undefined when the last game play source is not a special role.", () => {
      const game = createFakeGame();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          source: createFakeGameHistoryRecordPlaySource({
            name: "defender",
          }),
        }),
      });
      const gameEvent = services.gameEventsGenerator["generateLastGamePlaySourceGameEvent"](game, gameHistoryRecord);

      expect(gameEvent).toBeUndefined();
    });
  });

  describe("generateFirstTickRoleBasedGameEvents", () => {
    it("should return villager-villager introduction event when there is a villager villager in the game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerVillagerAlivePlayer(),
      ];
      const game = createFakeGame({
        tick: 1,
        players,
      });
      const gameEvents = services.gameEventsGenerator["generateFirstTickRoleBasedGameEvents"](game);
      const expectedGameEvents = [
        createFakeGameEvent({
          type: "villager-villager-introduction",
          players: [players[3]],
        }),
      ];

      expect(gameEvents).toStrictEqual<GameEvent[]>(expectedGameEvents);
    });

    it("should generate prejudiced manipulator groups announced event when there is a prejudiced manipulator in the game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakePrejudicedManipulatorAlivePlayer(),
      ];
      const game = createFakeGame({
        tick: 1,
        players,
      });
      const gameEvents = services.gameEventsGenerator["generateFirstTickRoleBasedGameEvents"](game);
      const expectedGameEvents = [
        createFakeGameEvent({
          type: "prejudiced-manipulator-groups-announced",
          players: [players[3]],
        }),
      ];

      expect(gameEvents).toStrictEqual<GameEvent[]>(expectedGameEvents);
    });

    it("should return empty array when there is no special role in the game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({
        tick: 1,
        players,
      });
      const gameEvents = services.gameEventsGenerator["generateFirstTickRoleBasedGameEvents"](game);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });
  });

  describe("generateFirstTickGameEvents", () => {
    beforeEach(() => {
      mocks.gameEventsGeneratorService.generateFirstTickRoleBasedGameEvents = jest.spyOn(services.gameEventsGenerator as unknown as { generateFirstTickRoleBasedGameEvents }, "generateFirstTickRoleBasedGameEvents").mockReturnValue([]);
    });

    it("should return empty array when it's not the first tick of the game..", () => {
      const game = createFakeGame({ tick: 2 });
      const gameEvents = services.gameEventsGenerator["generateFirstTickGameEvents"](game);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });

    it("should return game starts game event when it's the first tick of the game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({
        tick: 1,
        players,
      });
      const gameEvents = services.gameEventsGenerator["generateFirstTickGameEvents"](game);
      const expectedGameEvent = createFakeGameEvent({
        type: "game-starts",
        players,
      });

      expect(gameEvents).toStrictEqual<GameEvent[]>([expectedGameEvent]);
    });

    it("should generate first tick role based game events when it's the first tick of the game.", () => {
      const game = createFakeGame({
        tick: 1,
      });
      services.gameEventsGenerator["generateFirstTickGameEvents"](game);

      expect(mocks.gameEventsGeneratorService.generateFirstTickRoleBasedGameEvents).toHaveBeenCalledExactlyOnceWith(game);
    });
  });

  describe("generateRevealedPlayersGameEvents", () => {
    it("should return empty array when there are no revealed players.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord();
      const gameEvents = services.gameEventsGenerator["generateRevealedPlayersGameEvents"](gameHistoryRecord);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });

    it("should return empty array when game history record is undefined.", () => {
      const gameEvents = services.gameEventsGenerator["generateRevealedPlayersGameEvents"](undefined);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });

    it("should return idiot is spared game event when the revealed player is idiot.", () => {
      const revealedPlayer = createFakeIdiotAlivePlayer();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        revealedPlayers: [revealedPlayer],
      });
      const gameEvents = services.gameEventsGenerator["generateRevealedPlayersGameEvents"](gameHistoryRecord);
      const expectedGameEvent = createFakeGameEvent({
        type: "idiot-is-spared",
        players: [revealedPlayer],
      });

      expect(gameEvents).toStrictEqual<GameEvent[]>([expectedGameEvent]);
    });

    it("should return empty array when the revealed player is not idiot.", () => {
      const revealedPlayer = createFakeWerewolfAlivePlayer();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        revealedPlayers: [revealedPlayer],
      });
      const gameEvents = services.gameEventsGenerator["generateRevealedPlayersGameEvents"](gameHistoryRecord);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });
  });

  describe("generateSwitchedSidePlayersGameEvents", () => {
    it("should return empty array when there are no switched side players.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord();
      const gameEvents = services.gameEventsGenerator["generateSwitchedSidePlayersGameEvents"](gameHistoryRecord);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });

    it("should return empty array when game history record is undefined.", () => {
      const gameEvents = services.gameEventsGenerator["generateSwitchedSidePlayersGameEvents"](undefined);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });

    it("should return wild child has transformed game event when the switched side player is wild child and last game play action is bury dead bodies.", () => {
      const switchedSidePlayer = createFakeWildChildAlivePlayer();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        switchedSidePlayers: [switchedSidePlayer],
        play: createFakeGameHistoryRecordPlay({
          action: "bury-dead-bodies",
        }),
      });
      const gameEvents = services.gameEventsGenerator["generateSwitchedSidePlayersGameEvents"](gameHistoryRecord);
      const expectedGameEvent = createFakeGameEvent({
        type: "wild-child-has-transformed",
        players: [switchedSidePlayer],
      });

      expect(gameEvents).toStrictEqual<GameEvent[]>([expectedGameEvent]);
    });

    it("should return empty array when the switched side player is wild child and last game play action is not bury dead bodies.", () => {
      const switchedSidePlayer = createFakeWildChildAlivePlayer();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        switchedSidePlayers: [switchedSidePlayer],
        play: createFakeGameHistoryRecordPlay({
          action: "vote",
        }),
      });
      const gameEvents = services.gameEventsGenerator["generateSwitchedSidePlayersGameEvents"](gameHistoryRecord);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });

    it("should return empty array when the switched side player is not wild child.", () => {
      const switchedSidePlayer = createFakeWerewolfAlivePlayer();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        switchedSidePlayers: [switchedSidePlayer],
        play: createFakeGameHistoryRecordPlay({
          action: "bury-dead-bodies",
        }),
      });
      const gameEvents = services.gameEventsGenerator["generateSwitchedSidePlayersGameEvents"](gameHistoryRecord);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });
  });

  describe("generateDeadPlayersGameEvents", () => {
    it("should return empty array when there are no dead players.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord();
      const gameEvents = services.gameEventsGenerator["generateDeadPlayersGameEvents"](gameHistoryRecord);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });

    it("should return empty array when game history record is undefined.", () => {
      const gameEvents = services.gameEventsGenerator["generateDeadPlayersGameEvents"](undefined);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });

    it("should return player dies game event with all dead players when there are dead players.", () => {
      const deadPlayers = [
        createFakeDeadPlayer({ isAlive: false }),
        createFakeDeadPlayer({ isAlive: false }),
      ];
      const gameHistoryRecord = createFakeGameHistoryRecord({
        deadPlayers,
      });
      const gameEvents = services.gameEventsGenerator["generateDeadPlayersGameEvents"](gameHistoryRecord);
      const expectedGameEvent = createFakeGameEvent({
        type: "death",
        players: deadPlayers,
      });

      expect(gameEvents).toStrictEqual<GameEvent[]>([expectedGameEvent]);
    });
  });

  describe("generateBearGrowlsOrSleepsGameEvent", () => {
    it("should generate bear growls game event when left neighbor is a werewolf.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ position: 1 }),
        createFakeBearTamerAlivePlayer({ position: 2 }),
        createFakeVillagerAlivePlayer({ position: 3 }),
      ];
      const game = createFakeGame({
        players,
        options: DEFAULT_GAME_OPTIONS,
      });
      const gameEvent = services.gameEventsGenerator["generateBearGrowlsOrSleepsGameEvent"](game, players[1]);
      const expectedGameEvent = createFakeGameEvent({
        type: "bear-growls",
        players: [players[1]],
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should generate bear sleeps game event when left neighbor is not a werewolf.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ position: 1 }),
        createFakeBearTamerAlivePlayer({ position: 2 }),
        createFakeVillagerAlivePlayer({ position: 3 }),
      ];
      const game = createFakeGame({
        players,
        options: DEFAULT_GAME_OPTIONS,
      });
      const gameEvent = services.gameEventsGenerator["generateBearGrowlsOrSleepsGameEvent"](game, players[1]);
      const expectedGameEvent = createFakeGameEvent({
        type: "bear-sleeps",
        players: [players[1]],
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should generate bear growls when right neighbor is a werewolf.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ position: 1 }),
        createFakeBearTamerAlivePlayer({ position: 2 }),
        createFakeWerewolfAlivePlayer({ position: 3 }),
      ];
      const game = createFakeGame({
        players,
        options: DEFAULT_GAME_OPTIONS,
      });
      const gameEvent = services.gameEventsGenerator["generateBearGrowlsOrSleepsGameEvent"](game, players[1]);
      const expectedGameEvent = createFakeGameEvent({
        type: "bear-growls",
        players: [players[1]],
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should generate bear sleeps when right neighbor is not a werewolf.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ position: 1 }),
        createFakeBearTamerAlivePlayer({ position: 2 }),
        createFakeVillagerAlivePlayer({ position: 3 }),
      ];
      const game = createFakeGame({
        players,
        options: DEFAULT_GAME_OPTIONS,
      });
      const gameEvent = services.gameEventsGenerator["generateBearGrowlsOrSleepsGameEvent"](game, players[1]);
      const expectedGameEvent = createFakeGameEvent({
        type: "bear-sleeps",
        players: [players[1]],
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should generate bear growls when both neighbors are werewolves.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ position: 1 }),
        createFakeBearTamerAlivePlayer({ position: 2 }),
        createFakeWerewolfAlivePlayer({ position: 3 }),
      ];
      const game = createFakeGame({
        players,
        options: DEFAULT_GAME_OPTIONS,
      });
      const gameEvent = services.gameEventsGenerator["generateBearGrowlsOrSleepsGameEvent"](game, players[1]);
      const expectedGameEvent = createFakeGameEvent({
        type: "bear-growls",
        players: [players[1]],
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should generate bear growls when bear tamer is infected but both neighbors are not werewolves.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeBearTamerAlivePlayer({
          side: createFakePlayerSide({ current: "werewolves" }),
        }),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({
        players,
        options: DEFAULT_GAME_OPTIONS,
      });
      const gameEvent = services.gameEventsGenerator["generateBearGrowlsOrSleepsGameEvent"](game, players[1]);
      const expectedGameEvent = createFakeGameEvent({
        type: "bear-growls",
        players: [players[1]],
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should generate bear sleeps when bear tamer is infected and both neighbors are not werewolves but game options doesn't make the infected bear tamer to growl.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeBearTamerAlivePlayer({
          side: createFakePlayerSide({ current: "werewolves" }),
        }),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({
        players,
        options: DEFAULT_GAME_OPTIONS,
      });
      game.options.roles.bearTamer.doesGrowlOnWerewolvesSide = false;
      const gameEvent = services.gameEventsGenerator["generateBearGrowlsOrSleepsGameEvent"](game, players[1]);
      const expectedGameEvent = createFakeGameEvent({
        type: "bear-sleeps",
        players: [players[1]],
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });
  });

  describe("generateGamePhaseStartsGameEvents", () => {
    beforeEach(() => {
      mocks.gameEventsGeneratorService.generateBearGrowlsOrSleepsGameEvent = jest.spyOn(services.gameEventsGenerator as unknown as { generateBearGrowlsOrSleepsGameEvent }, "generateBearGrowlsOrSleepsGameEvent").mockReturnValue(createFakeGameEvent());
    });

    it("should return empty array when game phase tick is not 1.", () => {
      const game = createFakeGame({
        phase: createFakeGamePhase({
          tick: 2,
          name: "day",
        }),
      });
      const gameEvents = services.gameEventsGenerator["generateGamePhaseStartsGameEvents"](game);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });

    it("should return empty array when game phase name is twilight.", () => {
      const game = createFakeGame({
        phase: createFakeGamePhase({
          tick: 1,
          name: "twilight",
        }),
      });
      const gameEvents = services.gameEventsGenerator["generateGamePhaseStartsGameEvents"](game);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });

    it("should return game phase starts game event when game phase tick is 1 and not twilight.", () => {
      const game = createFakeGame({
        phase: createFakeGamePhase({
          tick: 1,
          name: "night",
        }),
      });
      const gameEvents = services.gameEventsGenerator["generateGamePhaseStartsGameEvents"](game);
      const expectedGameEvent = createFakeGameEvent({
        type: "game-phase-starts",
      });

      expect(gameEvents).toStrictEqual<GameEvent[]>([expectedGameEvent]);
    });

    it("should generate bear growls or sleeps game event when game phase tick is 1 and day and bear tamer is in game and alive and powerful.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeBearTamerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({
        phase: createFakeGamePhase({
          tick: 1,
          name: "day",
        }),
        players,
        options: DEFAULT_GAME_OPTIONS,
      });
      services.gameEventsGenerator["generateGamePhaseStartsGameEvents"](game);

      expect(mocks.gameEventsGeneratorService.generateBearGrowlsOrSleepsGameEvent).toHaveBeenCalledExactlyOnceWith(game, players[1]);
    });

    it("should not generate bear growls or sleeps game event when game phase tick is 1 and day and bear tamer is not in game.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({
        phase: createFakeGamePhase({
          tick: 1,
          name: "day",
        }),
        players,
        options: DEFAULT_GAME_OPTIONS,
      });
      services.gameEventsGenerator["generateGamePhaseStartsGameEvents"](game);

      expect(mocks.gameEventsGeneratorService.generateBearGrowlsOrSleepsGameEvent).not.toHaveBeenCalled();
    });

    it("should not generate bear growls or sleeps game event when game phase tick is 1 and day and bear tamer is not alive.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeBearTamerAlivePlayer({
          isAlive: false,
        }),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({
        phase: createFakeGamePhase({
          tick: 1,
          name: "day",
        }),
        players,
        options: DEFAULT_GAME_OPTIONS,
      });
      services.gameEventsGenerator["generateGamePhaseStartsGameEvents"](game);

      expect(mocks.gameEventsGeneratorService.generateBearGrowlsOrSleepsGameEvent).not.toHaveBeenCalled();
    });

    it("should not generate bear growls or sleeps game event when game phase tick is 1 and bear tamer is in game and alive and powerful but phase is night.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeBearTamerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({
        phase: createFakeGamePhase({
          tick: 1,
          name: "night",
        }),
        players,
        options: DEFAULT_GAME_OPTIONS,
      });
      services.gameEventsGenerator["generateGamePhaseStartsGameEvents"](game);

      expect(mocks.gameEventsGeneratorService.generateBearGrowlsOrSleepsGameEvent).not.toHaveBeenCalled();
    });
  });

  describe("generatePlayerAttributeAlterationsEvents", () => {
    it("should return empty array when there are no player attribute alterations.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gameHistoryRecord = createFakeGameHistoryRecord();
      const gameEvents = services.gameEventsGenerator["generatePlayerAttributeAlterationsEvents"](game, gameHistoryRecord);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });

    it("should return empty array when game history record is undefined.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gameEvents = services.gameEventsGenerator["generatePlayerAttributeAlterationsEvents"](game, undefined);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });

    it("should return elder has taken revenge game event when elder has taken revenge.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeElderAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gameHistoryRecord = createFakeGameHistoryRecord({
        playerAttributeAlterations: [
          createFakeGameHistoryRecordPlayerAttributeAlteration({
            source: "elder",
            name: "powerless",
            status: "attached",
          }),
        ],
      });
      const gameEvents = services.gameEventsGenerator["generatePlayerAttributeAlterationsEvents"](game, gameHistoryRecord);
      const expectedGameEvent = createFakeGameEvent({
        type: "elder-has-taken-revenge",
        players: [players[1]],
      });

      expect(gameEvents).toStrictEqual<GameEvent[]>([expectedGameEvent]);
    });

    it("should return sheriff promotion game event when sheriff has been promoted.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({
          attributes: [createFakePlayerAttribute({ name: "sheriff" })],
        }),
      ];
      const game = createFakeGame({ players });
      const gameHistoryRecord = createFakeGameHistoryRecord({
        playerAttributeAlterations: [
          createFakeGameHistoryRecordPlayerAttributeAlteration({
            name: "sheriff",
            status: "attached",
          }),
        ],
      });
      const gameEvents = services.gameEventsGenerator["generatePlayerAttributeAlterationsEvents"](game, gameHistoryRecord);
      const expectedGameEvent = createFakeGameEvent({
        type: "sheriff-promotion",
        players: [players[1]],
      });

      expect(gameEvents).toStrictEqual<GameEvent[]>([expectedGameEvent]);
    });

    it("should return empty array when sheriff is not promoted or elder has not taken revenge.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gameHistoryRecord = createFakeGameHistoryRecord({
        playerAttributeAlterations: [
          createFakeGameHistoryRecordPlayerAttributeAlteration({
            source: "elder",
            name: "powerless",
            status: "detached",
          }),
        ],
      });
      const gameEvents = services.gameEventsGenerator["generatePlayerAttributeAlterationsEvents"](game, gameHistoryRecord);

      expect(gameEvents).toStrictEqual<GameEvent[]>([]);
    });
  });

  describe("generateTurnStartsGameEvents", () => {
    it("should return game turn starts when called.", () => {
      const game = createFakeGame();
      const gameEvents = services.gameEventsGenerator["generateTurnStartsGameEvents"](game);
      const expectedGameEvent = createFakeGameEvent({
        type: "game-turn-starts",
      });

      expect(gameEvents).toStrictEqual<GameEvent[]>([expectedGameEvent]);
    });

    it("should generate game turn starts and scandalmonger mark is active game events when current play is vote and one player has the mark.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeVillagerAlivePlayer({
          attributes: [createFakeScandalmongerMarkedByScandalmongerPlayerAttribute()],
        }),
      ];
      const game = createFakeGame({
        players,
        currentPlay: createFakeGamePlaySurvivorsVote(),
      });
      const gameEvents = services.gameEventsGenerator["generateTurnStartsGameEvents"](game);
      const expectedGameEvents = [
        createFakeGameEvent({
          type: "scandalmonger-mark-is-active",
          players: [players[2]],
        }),
        createFakeGameEvent({
          type: "game-turn-starts",
        }),
      ];

      expect(gameEvents).toStrictEqual<GameEvent[]>(expectedGameEvents);
    });

    it("should generate only game turn starts game event when current play is vote and no player has the mark.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({
        players,
        currentPlay: createFakeGamePlaySurvivorsVote(),
      });
      const gameEvents = services.gameEventsGenerator["generateTurnStartsGameEvents"](game);
      const expectedGameEvent = createFakeGameEvent({
        type: "game-turn-starts",
      });

      expect(gameEvents).toStrictEqual<GameEvent[]>([expectedGameEvent]);
    });

    it("should generate only game turn starts game event when current play is not vote and one player is marked.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeVillagerAlivePlayer({
          attributes: [createFakeScandalmongerMarkedByScandalmongerPlayerAttribute()],
        }),
      ];
      const game = createFakeGame({
        players,
        currentPlay: createFakeGamePlayWerewolvesEat(),
      });
      const gameEvents = services.gameEventsGenerator["generateTurnStartsGameEvents"](game);
      const expectedGameEvent = createFakeGameEvent({
        type: "game-turn-starts",
      });

      expect(gameEvents).toStrictEqual<GameEvent[]>([expectedGameEvent]);
    });

    it("should generate only game turn starts game event when current play is null and one player is marked.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeVillagerAlivePlayer({
          attributes: [createFakeScandalmongerMarkedByScandalmongerPlayerAttribute()],
        }),
      ];
      const game = createFakeGame({
        players,
        currentPlay: null,
      });
      const gameEvents = services.gameEventsGenerator["generateTurnStartsGameEvents"](game);
      const expectedGameEvent = createFakeGameEvent({
        type: "game-turn-starts",
      });

      expect(gameEvents).toStrictEqual<GameEvent[]>([expectedGameEvent]);
    });
  });
});