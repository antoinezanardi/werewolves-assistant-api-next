import { createGamePlaySurvivorsElectSheriff } from "@/modules/game/helpers/game-play/game-play.factory";
import { GameHistoryRecordToInsertGeneratorService } from "@/modules/game/providers/services/game-history/game-history-record-to-insert-generator.service";
import { GamePlayVoteService } from "@/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import type { GameHistoryRecordPlaySource } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.schema";
import type { GameHistoryRecordPlayVoting } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.schema";
import type { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import type { GameHistoryRecordPlayerAttributeAlteration } from "@/modules/game/schemas/game-history-record/game-history-record-player-attribute-alteration/game-history-record-player-attribute-alteration.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { GameHistoryRecordToInsert } from "@/modules/game/types/game-history-record/game-history-record.types";
import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { createFakeMakeGamePlayWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlayerAttributeAlteration, createFakeGameHistoryRecordPlaySource, createFakeGameHistoryRecordPlayTarget, createFakeGameHistoryRecordPlayVote, createFakeGameHistoryRecordPlayVoting } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGamePhase } from "@tests/factories/game/schemas/game-phase/game-phase.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source/game-play-source.schema.factory";
import { createFakeGamePlaySurvivorsElectSheriff, createFakeGamePlaySurvivorsVote } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCharmedByPiedPiperPlayerAttribute, createFakeDrankDeathPotionByWitchPlayerAttribute, createFakePlayerAttributeActivation, createFakeSeenBySeerPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayerDeathPotionByWitchDeath, createFakePlayerVoteBySurvivorsDeath, createFakePlayerVoteScapegoatedBySurvivorsDeath } from "@tests/factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeAngelAlivePlayer, createFakeHunterAlivePlayer, createFakeSeerAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakeDeadPlayer, createFakePlayer, createFakePlayerRole } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeGameHistoryRecordToInsert } from "@tests/factories/game/types/game-history-record/game-history-record.type.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

describe("Game History Record To Insert Generator Service", () => {
  let mocks: {
    gameHistoryRecordToInsertGeneratorService: {
      generateCurrentGameHistoryRecordPlayToInsert: jest.SpyInstance;
      generateCurrentGameHistoryRecordRevealedPlayersToInsert: jest.SpyInstance;
      generateCurrentGameHistoryRecordDeadPlayersToInsert: jest.SpyInstance;
      generateCurrentGameHistoryRecordPlayVotingToInsert: jest.SpyInstance;
      generateCurrentGameHistoryRecordPlayVotingResultToInsert: jest.SpyInstance;
      generateCurrentGameHistoryRecordPlaySourceToInsert: jest.SpyInstance;
      generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert: jest.SpyInstance;
      generateCurrentGameHistoryRecordAttachedPlayerAttributesToInsertForPlayer: jest.SpyInstance;
      generateCurrentGameHistoryRecordDetachedPlayerAttributesToInsertForPlayer: jest.SpyInstance;
      generateCurrentGameHistoryRecordActivatedPlayerAttributesToInsertForPlayer: jest.SpyInstance;
    };
    gamePlayVoteService: {
      getGamePlayVoting: jest.SpyInstance;
      getNominatedPlayers: jest.SpyInstance;
    };
    unexpectedExceptionFactory: {
      createNoCurrentGamePlayUnexpectedException: jest.SpyInstance;
    };
  };
  let services: { gameHistoryRecordToInsertGenerator: GameHistoryRecordToInsertGeneratorService };

  beforeEach(async() => {
    mocks = {
      gameHistoryRecordToInsertGeneratorService: {
        generateCurrentGameHistoryRecordPlayToInsert: jest.fn(),
        generateCurrentGameHistoryRecordRevealedPlayersToInsert: jest.fn(),
        generateCurrentGameHistoryRecordDeadPlayersToInsert: jest.fn(),
        generateCurrentGameHistoryRecordPlayVotingToInsert: jest.fn(),
        generateCurrentGameHistoryRecordPlayVotingResultToInsert: jest.fn(),
        generateCurrentGameHistoryRecordPlaySourceToInsert: jest.fn(),
        generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert: jest.fn(),
        generateCurrentGameHistoryRecordAttachedPlayerAttributesToInsertForPlayer: jest.fn(),
        generateCurrentGameHistoryRecordDetachedPlayerAttributesToInsertForPlayer: jest.fn(),
        generateCurrentGameHistoryRecordActivatedPlayerAttributesToInsertForPlayer: jest.fn(),
      },
      gamePlayVoteService: {
        getGamePlayVoting: jest.fn(),
        getNominatedPlayers: jest.fn(),
      },
      unexpectedExceptionFactory: {
        createNoCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoCurrentGamePlayUnexpectedException").mockImplementation(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameHistoryRecordToInsertGeneratorService,
        {
          provide: GamePlayVoteService,
          useValue: mocks.gamePlayVoteService,
        },
      ],
    }).compile();

    services = { gameHistoryRecordToInsertGenerator: module.get<GameHistoryRecordToInsertGeneratorService>(GameHistoryRecordToInsertGeneratorService) };
  });

  describe("generateCurrentGameHistoryRecordToInsert", () => {
    beforeEach(() => {
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayToInsert = jest.spyOn(services.gameHistoryRecordToInsertGenerator as unknown as { generateCurrentGameHistoryRecordPlayToInsert }, "generateCurrentGameHistoryRecordPlayToInsert").mockImplementation();
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordRevealedPlayersToInsert = jest.spyOn(services.gameHistoryRecordToInsertGenerator as unknown as { generateCurrentGameHistoryRecordRevealedPlayersToInsert }, "generateCurrentGameHistoryRecordRevealedPlayersToInsert").mockImplementation();
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordDeadPlayersToInsert = jest.spyOn(services.gameHistoryRecordToInsertGenerator as unknown as { generateCurrentGameHistoryRecordDeadPlayersToInsert }, "generateCurrentGameHistoryRecordDeadPlayersToInsert").mockImplementation();
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayVotingToInsert = jest.spyOn(services.gameHistoryRecordToInsertGenerator as unknown as { generateCurrentGameHistoryRecordPlayVotingToInsert }, "generateCurrentGameHistoryRecordPlayVotingToInsert").mockImplementation();
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert = jest.spyOn(services.gameHistoryRecordToInsertGenerator as unknown as { generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert }, "generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert").mockImplementation();
    });

    it("should throw error when there is no current play for the game.", () => {
      const baseGame = createFakeGame();
      const newGame = createFakeGame();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const interpolations = { gameId: baseGame._id };
      const mockedError = "error";
      mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException.mockReturnValue(mockedError);

      expect(() => services.gameHistoryRecordToInsertGenerator.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play)).toThrow(mockedError);
      expect(mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("generateCurrentGameHistoryRecordToInsert", interpolations);
    });

    it("should generate current game history to insert when called.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay();
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      const expectedCurrentGameHistoryToInsert = createFakeGameHistoryRecordToInsert({
        gameId: baseGame._id,
        turn: baseGame.turn,
        phase: baseGame.phase,
        tick: baseGame.tick,
        play: expectedCurrentGameHistoryPlayToInsert,
      });

      expect(services.gameHistoryRecordToInsertGenerator.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play)).toStrictEqual<GameHistoryRecordToInsert>(expectedCurrentGameHistoryToInsert);
    });

    it("should call generateCurrentGameHistoryRecordPlayToInsert method when called.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay();
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      services.gameHistoryRecordToInsertGenerator.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayToInsert).toHaveBeenCalledExactlyOnceWith(baseGame, play);
    });

    it("should call generateCurrentGameHistoryRecordRevealedPlayersToInsert method when called.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay();
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      services.gameHistoryRecordToInsertGenerator.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordRevealedPlayersToInsert).toHaveBeenCalledExactlyOnceWith(baseGame, newGame);
    });

    it("should call generateCurrentGameHistoryRecordDeadPlayersToInsert method when called.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay();
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      services.gameHistoryRecordToInsertGenerator.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordDeadPlayersToInsert).toHaveBeenCalledExactlyOnceWith(baseGame, newGame);
    });

    it("should call generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert method when called.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay();
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      services.gameHistoryRecordToInsertGenerator.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert).toHaveBeenCalledExactlyOnceWith(baseGame, newGame);
    });

    it("should call generateCurrentGameHistoryRecordPlayVotingToInsert method when called with votes and play type is vote.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay({
        type: "vote",
        votes: [],
      });
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      const gameHistoryRecordToInsert = {
        gameId: baseGame._id,
        turn: baseGame.turn,
        phase: baseGame.phase,
        tick: baseGame.tick,
        play: expectedCurrentGameHistoryPlayToInsert,
        revealedPlayers: undefined,
        deadPlayers: undefined,
      };
      services.gameHistoryRecordToInsertGenerator.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayVotingToInsert).toHaveBeenCalledExactlyOnceWith(baseGame, newGame, gameHistoryRecordToInsert);
    });

    it("should not call generateCurrentGameHistoryRecordPlayVotingToInsert method when called with votes and play type is not vote.", () => {
      const baseGame = createFakeGameWithCurrentPlay();
      const newGame = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedCurrentGameHistoryPlayToInsert = createFakeGameHistoryRecordPlay({
        type: "target",
        votes: [],
      });
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayToInsert.mockReturnValue(expectedCurrentGameHistoryPlayToInsert);
      services.gameHistoryRecordToInsertGenerator.generateCurrentGameHistoryRecordToInsert(baseGame, newGame, play);

      expect(mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayVotingToInsert).not.toHaveBeenCalled();
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

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordDeadPlayersToInsert"](baseGame, newGame)).toStrictEqual<Player[]>([
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

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordDeadPlayersToInsert"](baseGame, newGame)).toBeUndefined();
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

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordRevealedPlayersToInsert"](baseGame, newGame)).toStrictEqual<Player[]>([
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

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordRevealedPlayersToInsert"](baseGame, newGame)).toBeUndefined();
    });
  });

  describe("generateCurrentGameHistoryRecordAttachedPlayerAttributesToInsertForPlayer", () => {
    it("should generate current game history attached player attributes for player when called.", () => {
      const basePlayer = createFakePlayer({
        name: "Antoine",
        attributes: [createFakeSeenBySeerPlayerAttribute()],
      });
      const newPlayer = createFakePlayer({
        name: "New Antoine",
        attributes: [
          createFakeSeenBySeerPlayerAttribute(),
          createFakeDrankDeathPotionByWitchPlayerAttribute(),
        ],
      });
      const expectedAttachedPlayerAttributes = [
        createFakeGameHistoryRecordPlayerAttributeAlteration({
          playerName: newPlayer.name,
          name: "drank-death-potion",
          source: "witch",
          status: "attached",
        }),
      ];

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordAttachedPlayerAttributesToInsertForPlayer"](basePlayer, newPlayer)).toStrictEqual<GameHistoryRecordPlayerAttributeAlteration[]>(expectedAttachedPlayerAttributes);
    });
  });

  describe("generateCurrentGameHistoryRecordDetachedPlayerAttributesToInsertForPlayer", () => {
    it("should generate current game history detached player attributes for player when called.", () => {
      const basePlayer = createFakePlayer({
        name: "Antoine",
        attributes: [
          createFakeSeenBySeerPlayerAttribute(),
          createFakeDrankDeathPotionByWitchPlayerAttribute(),
        ],
      });
      const newPlayer = createFakePlayer({
        name: "New Antoine",
        attributes: [createFakeDrankDeathPotionByWitchPlayerAttribute()],
      });
      const expectedDetachedPlayerAttributes = [
        createFakeGameHistoryRecordPlayerAttributeAlteration({
          playerName: newPlayer.name,
          name: "seen",
          source: "seer",
          status: "detached",
        }),
      ];

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordDetachedPlayerAttributesToInsertForPlayer"](basePlayer, newPlayer)).toStrictEqual<GameHistoryRecordPlayerAttributeAlteration[]>(expectedDetachedPlayerAttributes);
    });
  });

  describe("generateCurrentGameHistoryRecordActivatedPlayerAttributesToInsertForPlayer", () => {
    it("should generate current game history activated player attributes for player when called.", () => {
      const attributes = [
        createFakeDrankDeathPotionByWitchPlayerAttribute({
          activeAt: createFakePlayerAttributeActivation({
            turn: 2,
            phaseName: "night",
          }),
        }),
        createFakeSeenBySeerPlayerAttribute({
          activeAt: createFakePlayerAttributeActivation({
            turn: 2,
            phaseName: "day",
          }),
        }),
      ];
      const baseGame = createFakeGame({
        turn: 1,
        phase: createFakeGamePhase({ name: "day" }),
      });
      const newGame = createFakeGame({
        turn: 2,
        phase: createFakeGamePhase({ name: "night" }),
      });
      const basePlayer = createFakePlayer({
        name: "Antoine",
        attributes,
      });
      const newPlayer = createFakePlayer({
        name: "New Antoine",
        attributes: [
          ...attributes,
          createFakeCharmedByPiedPiperPlayerAttribute({
            activeAt: createFakePlayerAttributeActivation({
              turn: 2,
              phaseName: "night",
            }),
          }),
        ],
      });
      const expectedActivatedPlayerAttributes = [
        createFakeGameHistoryRecordPlayerAttributeAlteration({
          playerName: newPlayer.name,
          name: "drank-death-potion",
          source: "witch",
          status: "activated",
        }),
      ];

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordActivatedPlayerAttributesToInsertForPlayer"](baseGame, newGame, basePlayer, newPlayer)).toStrictEqual<GameHistoryRecordPlayerAttributeAlteration[]>(expectedActivatedPlayerAttributes);
    });
  });

  describe("generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert", () => {
    beforeEach(() => {
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordAttachedPlayerAttributesToInsertForPlayer = jest.spyOn(services.gameHistoryRecordToInsertGenerator as unknown as { generateCurrentGameHistoryRecordAttachedPlayerAttributesToInsertForPlayer }, "generateCurrentGameHistoryRecordAttachedPlayerAttributesToInsertForPlayer").mockImplementation();
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordDetachedPlayerAttributesToInsertForPlayer = jest.spyOn(services.gameHistoryRecordToInsertGenerator as unknown as { generateCurrentGameHistoryRecordDetachedPlayerAttributesToInsertForPlayer }, "generateCurrentGameHistoryRecordDetachedPlayerAttributesToInsertForPlayer").mockImplementation();
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordActivatedPlayerAttributesToInsertForPlayer = jest.spyOn(services.gameHistoryRecordToInsertGenerator as unknown as { generateCurrentGameHistoryRecordActivatedPlayerAttributesToInsertForPlayer }, "generateCurrentGameHistoryRecordActivatedPlayerAttributesToInsertForPlayer").mockImplementation();
    });

    it("should generate attached for each matching from base game when called.", () => {
      const goodId = createFakeObjectId();
      const matchingPlayer = createFakePlayer({
        _id: goodId,
        name: "Antoine",
        attributes: [createFakeSeenBySeerPlayerAttribute()],
      });
      const basePlayers = [
        matchingPlayer,
        createFakePlayer({
          name: "New Antoine",
          attributes: [createFakeDrankDeathPotionByWitchPlayerAttribute()],
        }),
      ];
      const newPlayers = [matchingPlayer];
      const baseGame = createFakeGame({ players: basePlayers });
      const newGame = createFakeGame({ players: newPlayers });
      services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert"](baseGame, newGame);

      expect(mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordAttachedPlayerAttributesToInsertForPlayer).toHaveBeenCalledExactlyOnceWith(matchingPlayer, matchingPlayer);
    });

    it("should generate detached for each matching from new game when called.", () => {
      const goodId = createFakeObjectId();
      const matchingPlayer = createFakePlayer({
        _id: goodId,
        name: "Antoine",
        attributes: [createFakeSeenBySeerPlayerAttribute()],
      });
      const basePlayers = [
        matchingPlayer,
        createFakePlayer({
          name: "New Antoine",
          attributes: [createFakeDrankDeathPotionByWitchPlayerAttribute()],
        }),
      ];
      const newPlayers = [matchingPlayer];
      const baseGame = createFakeGame({ players: basePlayers });
      const newGame = createFakeGame({ players: newPlayers });
      services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert"](baseGame, newGame);

      expect(mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordDetachedPlayerAttributesToInsertForPlayer).toHaveBeenCalledExactlyOnceWith(matchingPlayer, matchingPlayer);
    });

    it("should generate activated for each matching from new game when called.", () => {
      const goodId = createFakeObjectId();
      const matchingPlayer = createFakePlayer({
        _id: goodId,
        name: "Antoine",
        attributes: [
          createFakeSeenBySeerPlayerAttribute({
            activeAt: createFakePlayerAttributeActivation({
              turn: 2,
              phaseName: "day",
            }),
          }),
        ],
      });
      const basePlayers = [
        matchingPlayer,
        createFakePlayer({
          name: "New Antoine",
          attributes: [
            createFakeDrankDeathPotionByWitchPlayerAttribute({
              activeAt: createFakePlayerAttributeActivation({
                turn: 2,
                phaseName: "night",
              }),
            }),
          ],
        }),
      ];
      const newPlayers = [matchingPlayer];
      const baseGame = createFakeGame({
        turn: 1,
        phase: createFakeGamePhase({ name: "day" }),
        players: basePlayers,
      });
      const newGame = createFakeGame({
        turn: 2,
        phase: createFakeGamePhase({ name: "night" }),
        players: newPlayers,
      });
      services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert"](baseGame, newGame);

      expect(mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordActivatedPlayerAttributesToInsertForPlayer).toHaveBeenCalledExactlyOnceWith(baseGame, newGame, matchingPlayer, matchingPlayer);
    });

    it("should concat all alterations for each matching player when called.", () => {
      const attachedPlayerAttributes = [createFakeGameHistoryRecordPlayerAttributeAlteration()];
      const detachedPlayerAttributes = [createFakeGameHistoryRecordPlayerAttributeAlteration()];
      const activatedPlayerAttributes = [createFakeGameHistoryRecordPlayerAttributeAlteration()];
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordAttachedPlayerAttributesToInsertForPlayer.mockReturnValue(attachedPlayerAttributes);
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordDetachedPlayerAttributesToInsertForPlayer.mockReturnValue(detachedPlayerAttributes);
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordActivatedPlayerAttributesToInsertForPlayer.mockReturnValue(activatedPlayerAttributes);
      const goodId = createFakeObjectId();
      const matchingPlayer = createFakePlayer({
        _id: goodId,
        name: "Antoine",
        attributes: [
          createFakeSeenBySeerPlayerAttribute(),
          createFakeDrankDeathPotionByWitchPlayerAttribute(),
        ],
      });
      const basePlayers = [matchingPlayer];
      const newPlayers = [
        matchingPlayer,
        createFakePlayer({
          name: "New Antoine",
          attributes: [createFakeDrankDeathPotionByWitchPlayerAttribute()],
        }),
      ];
      const baseGame = createFakeGame({ players: basePlayers });
      const newGame = createFakeGame({ players: newPlayers });
      const expectedPlayerAttributeAlterations = [
        ...attachedPlayerAttributes,
        ...detachedPlayerAttributes,
        ...activatedPlayerAttributes,
      ];

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert"](baseGame, newGame)).toStrictEqual<GameHistoryRecordPlayerAttributeAlteration[]>(expectedPlayerAttributeAlterations);
    });

    it("should return undefined when there are no alterations for every players.", () => {
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordAttachedPlayerAttributesToInsertForPlayer.mockReturnValue([]);
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordDetachedPlayerAttributesToInsertForPlayer.mockReturnValue([]);
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordActivatedPlayerAttributesToInsertForPlayer.mockReturnValue([]);
      const basePlayers = [
        createFakePlayer({
          name: "Antoine",
          attributes: [createFakeSeenBySeerPlayerAttribute()],
        }),
        createFakePlayer({
          name: "New Antoine",
          attributes: [createFakeDrankDeathPotionByWitchPlayerAttribute()],
        }),
      ];
      const newPlayers = [
        createFakePlayer({
          name: "Antoine",
          attributes: [createFakeSeenBySeerPlayerAttribute()],
        }),
        createFakePlayer({
          name: "New Antoine",
          attributes: [createFakeDrankDeathPotionByWitchPlayerAttribute()],
        }),
      ];
      const baseGame = createFakeGame({ players: basePlayers });
      const newGame = createFakeGame({ players: newPlayers });

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayerAttributeAlterationsToInsert"](baseGame, newGame)).toBeUndefined();
    });
  });

  describe("generateCurrentGameHistoryRecordPlayToInsert", () => {
    beforeEach(() => {
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlaySourceToInsert = jest.spyOn(services.gameHistoryRecordToInsertGenerator as unknown as { generateCurrentGameHistoryRecordPlaySourceToInsert }, "generateCurrentGameHistoryRecordPlaySourceToInsert").mockImplementation();
    });

    it("should generate current game history record play to insert when called.", () => {
      const game = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto({
        doesJudgeRequestAnotherVote: true,
        targets: [createFakeGameHistoryRecordPlayTarget()],
        votes: [createFakeGameHistoryRecordPlayVote()],
        chosenCard: createFakeGameAdditionalCard(),
        chosenSide: "villagers",
      });
      const expectedGameHistoryRecordPlaySource = { name: undefined, players: undefined };
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlaySourceToInsert.mockReturnValue(expectedGameHistoryRecordPlaySource);
      const expectedGameHistoryRecordPlay = createFakeGameHistoryRecordPlay({
        type: game.currentPlay.type,
        action: game.currentPlay.action,
        didJudgeRequestAnotherVote: play.doesJudgeRequestAnotherVote,
        targets: play.targets,
        votes: play.votes,
        chosenCard: play.chosenCard,
        chosenSide: play.chosenSide,
      }, { source: expectedGameHistoryRecordPlaySource });

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayToInsert"](game, play)).toStrictEqual<GameHistoryRecordPlay>(expectedGameHistoryRecordPlay);
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
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsElectSheriff() });
      const newGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(players[0]),
          createFakePlayer({ ...players[1], attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
          createFakePlayer(players[2]),
          createFakePlayer(players[3]),
        ],
      });
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert();

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe("sheriff-election");
    });

    it("should return tie when there is no sheriff in the game after election.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsElectSheriff() });
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

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe("tie");
    });

    it("should return skipped when there are no vote set.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
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
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerVoteBySurvivorsDeath() })] });

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe("skipped");
    });

    it("should return skipped when votes are empty.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
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
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerVoteBySurvivorsDeath() })] });

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe("skipped");
    });

    it("should return death when there is at least one dead player from votes.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
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
        createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerVoteBySurvivorsDeath() }),
        createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerDeathPotionByWitchDeath() }),
      ];
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers });

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe("death");
    });

    it("should return death when there is at least one dead player from scapegoat votes.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
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
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerVoteScapegoatedBySurvivorsDeath() })] });

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe("death");
    });

    it("should return inconsequential when there is no death from votes and current play was already after a tie.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote({ causes: ["previous-votes-were-in-ties"] }) });
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
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerDeathPotionByWitchDeath() })] });

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe("inconsequential");
    });

    it("should return inconsequential when there is no death from votes, current play was not already after a tie but only one player was nominated.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote({ causes: ["stuttering-judge-request"] }) });
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
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerDeathPotionByWitchDeath() })] });

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe("inconsequential");
    });

    it("should return tie when there is no death from votes, current play was not after a tie and there are several nominated players.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const nominatedPlayers = [players[2], players[3]];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote({ causes: ["stuttering-judge-request"] }) });
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
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert({ play: gameHistoryRecordPlay, deadPlayers: [createFakeDeadPlayer({ ...players[1], isAlive: false, death: createFakePlayerDeathPotionByWitchDeath() })] });

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayVotingResultToInsert"](game, newGame, nominatedPlayers, gameHistoryRecordToInsert)).toBe("tie");
    });
  });

  describe("generateCurrentGameHistoryRecordPlayVotingToInsert", () => {
    beforeEach(() => {
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayVotingResultToInsert = jest.spyOn(services.gameHistoryRecordToInsertGenerator as unknown as { generateCurrentGameHistoryRecordPlayVotingResultToInsert }, "generateCurrentGameHistoryRecordPlayVotingResultToInsert").mockImplementation();
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
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayVotingResultToInsert.mockReturnValue("death");
      const expectedCurrentGameHistoryRecordPlayVoting = createFakeGameHistoryRecordPlayVoting({
        result: "death",
        nominatedPlayers,
      });

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayVotingToInsert"](game, newGame, gameHistoryRecordToInsert)).toStrictEqual<GameHistoryRecordPlayVoting>(expectedCurrentGameHistoryRecordPlayVoting);
    });

    it("should generate current game history record play voting without nominated players when no nominated players are found.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const newGame = createFakeGameWithCurrentPlay(game);
      const gameHistoryRecordToInsert = createFakeGameHistoryRecordToInsert();
      const nominatedPlayers = [];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayVotingResultToInsert.mockReturnValue("death");
      const expectedCurrentGameHistoryRecordPlayVoting = createFakeGameHistoryRecordPlayVoting({ result: "death" });

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayVotingToInsert"](game, newGame, gameHistoryRecordToInsert)).toStrictEqual<GameHistoryRecordPlayVoting>(expectedCurrentGameHistoryRecordPlayVoting);
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
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayVotingResultToInsert.mockReturnValue("death");
      services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayVotingToInsert"](game, newGame, gameHistoryRecordToInsert);

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
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayVotingResultToInsert.mockReturnValue("death");
      services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayVotingToInsert"](game, newGame, gameHistoryRecordToInsert);

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
      mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayVotingResultToInsert.mockReturnValue("death");
      services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlayVotingToInsert"](game, newGame, gameHistoryRecordToInsert);

      expect(mocks.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordPlayVotingResultToInsert).toHaveBeenCalledExactlyOnceWith(game, newGame, nominatedPlayers, gameHistoryRecordToInsert);
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
      const game = createFakeGameWithCurrentPlay({ currentPlay: createGamePlaySurvivorsElectSheriff({ source: createFakeGamePlaySource({ name: "survivors", players: expectedPlayers }) }), players });
      const expectedGameHistoryRecordPlaySource = createFakeGameHistoryRecordPlaySource({
        name: game.currentPlay.source.name,
        players: expectedPlayers,
      });

      expect(services.gameHistoryRecordToInsertGenerator["generateCurrentGameHistoryRecordPlaySourceToInsert"](game)).toStrictEqual<GameHistoryRecordPlaySource>(expectedGameHistoryRecordPlaySource);
    });
  });
});