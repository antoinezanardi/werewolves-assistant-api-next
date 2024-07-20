import { GameEventsGeneratorService } from "@/modules/game/providers/services/game-event/game-events-generator.service";
import type { GameEvent } from "@/modules/game/schemas/game-event/game-event.schema";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { createFakeGameEvent } from "@tests/factories/game/schemas/game-event/game-event.schema.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlaySource, createFakeGameHistoryRecordPlayTarget } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeActorAlivePlayer, createFakeThiefAlivePlayer, createFakeWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";

describe("Game Events Generator Service", () => {
  let mocks: {
    gameEventsGeneratorService: {
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

  describe("generateSeerHasSeenGameEvent", () => {
    it("should return seer has seen game event with targets when there are targets in last game history record.", () => {
      const targetedPlayers = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          targets: [
            createFakeGameHistoryRecordPlayTarget({ player: targetedPlayers[0] }),
            createFakeGameHistoryRecordPlayTarget({ player: targetedPlayers[1] }),
          ],
        }),
      });
      const gameEvent = services.gameEventsGenerator["generateSeerHasSeenGameEvent"](gameHistoryRecord);
      const expectedGameEvent = createFakeGameEvent({
        type: "seer-has-seen",
        players: targetedPlayers,
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should return seer has seen game event without targets when there are no targets in last game history record.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay(),
      });
      const gameEvent = services.gameEventsGenerator["generateSeerHasSeenGameEvent"](gameHistoryRecord);
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
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          targets: [
            createFakeGameHistoryRecordPlayTarget({ player: targetedPlayers[0] }),
            createFakeGameHistoryRecordPlayTarget({ player: targetedPlayers[1] }),
          ],
        }),
      });
      const gameEvent = services.gameEventsGenerator["generateScandalmongerHayHaveMarkedGameEvent"](gameHistoryRecord);
      const expectedGameEvent = createFakeGameEvent({
        type: "scandalmonger-may-have-marked",
        players: targetedPlayers,
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should return scandalmonger has marked game event without targets when there are no targets in last game history record.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay(),
      });
      const gameEvent = services.gameEventsGenerator["generateScandalmongerHayHaveMarkedGameEvent"](gameHistoryRecord);
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
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          targets: [
            createFakeGameHistoryRecordPlayTarget({ player: targetedPlayers[0] }),
            createFakeGameHistoryRecordPlayTarget({ player: targetedPlayers[1] }),
          ],
        }),
      });
      const gameEvent = services.gameEventsGenerator["generateAccursedWolfFatherMayHaveInfectedGameEvent"](gameHistoryRecord);
      const expectedGameEvent = createFakeGameEvent({
        type: "accursed-wolf-father-may-have-infected",
        players: targetedPlayers,
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should return accursed wolf father may have infected game event without targets when there are no targets in last game history record.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay(),
      });
      const gameEvent = services.gameEventsGenerator["generateAccursedWolfFatherMayHaveInfectedGameEvent"](gameHistoryRecord);
      const expectedGameEvent = createFakeGameEvent({
        type: "accursed-wolf-father-may-have-infected",
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });
  });

  describe("generateWolfHoundHasChosenSideGameEvent", () => {
    it("should return wolf hound has chosen side game event when called.", () => {
      const gameEvent = services.gameEventsGenerator["generateWolfHoundHasChosenSideGameEvent"]();
      const expectedGameEvent = createFakeGameEvent({
        type: "wolf-hound-has-chosen-side",
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
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          targets: [
            createFakeGameHistoryRecordPlayTarget({ player: targetedPlayers[0] }),
            createFakeGameHistoryRecordPlayTarget({ player: targetedPlayers[1] }),
          ],
        }),
      });
      const gameEvent = services.gameEventsGenerator["generatePiedPiperHasCharmedGameEvent"](gameHistoryRecord);
      const expectedGameEvent = createFakeGameEvent({
        type: "pied-piper-has-charmed",
        players: targetedPlayers,
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should return pied piper has charmed game event without targets when there are no targets in last game history record.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay(),
      });
      const gameEvent = services.gameEventsGenerator["generatePiedPiperHasCharmedGameEvent"](gameHistoryRecord);
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
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          targets: [
            createFakeGameHistoryRecordPlayTarget({ player: targetedPlayers[0] }),
            createFakeGameHistoryRecordPlayTarget({ player: targetedPlayers[1] }),
          ],
        }),
      });
      const gameEvent = services.gameEventsGenerator["generateCupidHasCharmedGameEvent"](gameHistoryRecord);
      const expectedGameEvent = createFakeGameEvent({
        type: "cupid-has-charmed",
        players: targetedPlayers,
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should return cupid has charmed game event without targets when there are no targets in last game history record.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay(),
      });
      const gameEvent = services.gameEventsGenerator["generateCupidHasCharmedGameEvent"](gameHistoryRecord);
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
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          targets: [
            createFakeGameHistoryRecordPlayTarget({ player: targetedPlayers[0] }),
            createFakeGameHistoryRecordPlayTarget({ player: targetedPlayers[1] }),
          ],
        }),
      });
      const gameEvent = services.gameEventsGenerator["generateFoxMayHaveSniffedGameEvent"](gameHistoryRecord);
      const expectedGameEvent = createFakeGameEvent({
        type: "fox-may-have-sniffed",
        players: targetedPlayers,
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });

    it("should return fox may have sniffed game event without targets when there are no targets in last game history record.", () => {
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay(),
      });
      const gameEvent = services.gameEventsGenerator["generateFoxMayHaveSniffedGameEvent"](gameHistoryRecord);
      const expectedGameEvent = createFakeGameEvent({
        type: "fox-may-have-sniffed",
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });
  });

  describe("generateThiefMayHaveChosenCardGameEvent", () => {
    it("should return thief may have chosen card game event when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeThiefAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gameEvent = services.gameEventsGenerator["generateThiefMayHaveChosenCardGameEvent"](game);
      const expectedGameEvent = createFakeGameEvent({
        type: "thief-may-have-chosen-card",
        players: [players[1]],
      });

      expect(gameEvent).toStrictEqual<GameEvent>(expectedGameEvent);
    });
  });

  describe("generateActorMayHaveChosenCardGameEvent", () => {
    it("should return actor may have chosen card game event when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeActorAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const gameEvent = services.gameEventsGenerator["generateActorMayHaveChosenCardGameEvent"](game);
      const expectedGameEvent = createFakeGameEvent({
        type: "actor-may-have-chosen-card",
        players: [players[1]],
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
      const game = createFakeGame();
      const gameHistoryRecord = createFakeGameHistoryRecord({
        play: createFakeGameHistoryRecordPlay({
          source: createFakeGameHistoryRecordPlaySource({
            name: "seer",
          }),
        }),
      });
      services.gameEventsGenerator["generateLastGamePlaySourceGameEvent"](game, gameHistoryRecord);

      expect(mocks.gameEventsGeneratorService.generateSeerHasSeenGameEvent).toHaveBeenCalledExactlyOnceWith(gameHistoryRecord);
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

      expect(mocks.gameEventsGeneratorService.generateScandalmongerHayHaveMarkedGameEvent).toHaveBeenCalledExactlyOnceWith(gameHistoryRecord);
    });
  });
});