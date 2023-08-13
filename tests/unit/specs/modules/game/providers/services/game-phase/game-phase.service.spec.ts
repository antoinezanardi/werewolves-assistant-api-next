import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { GAME_PHASES } from "../../../../../../../../src/modules/game/enums/game.enum";
import { GamePhaseService } from "../../../../../../../../src/modules/game/providers/services/game-phase/game-phase.service";
import { GamePlayService } from "../../../../../../../../src/modules/game/providers/services/game-play/game-play.service";
import { PlayerAttributeService } from "../../../../../../../../src/modules/game/providers/services/player/player-attribute.service";
import { createFakeGamePlayAllVote, createFakeGamePlayHunterShoots, createFakeGamePlaySeerLooks, createFakeGamePlayWerewolvesEat } from "../../../../../../../factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakeContaminatedByRustySwordKnightPlayerAttribute, createFakeDrankDeathPotionByWitchPlayerAttribute, createFakeEatenByWerewolvesPlayerAttribute, createFakeSheriffByAllPlayerAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeWerewolfAlivePlayer } from "../../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers, createFakePlayer } from "../../../../../../../factories/game/schemas/player/player.schema.factory";

describe("Game Phase Service", () => {
  let services: { gamePhase: GamePhaseService };
  let mocks: {
    playerAttributeService: {
      applyDrankDeathPotionAttributeOutcomes: jest.SpyInstance;
      applyEatenAttributeOutcomes: jest.SpyInstance;
      applyContaminatedAttributeOutcomes: jest.SpyInstance;
    };
    gamePlayService: {
      getUpcomingNightPlays: jest.SpyInstance;
      getUpcomingDayPlays: jest.SpyInstance;
    };
  };

  beforeEach(async() => {
    mocks = {
      playerAttributeService: {
        applyDrankDeathPotionAttributeOutcomes: jest.fn(),
        applyEatenAttributeOutcomes: jest.fn(),
        applyContaminatedAttributeOutcomes: jest.fn(),
      },
      gamePlayService: {
        getUpcomingNightPlays: jest.fn(),
        getUpcomingDayPlays: jest.fn(),
      },
    };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamePhaseService,
        {
          provide: PlayerAttributeService,
          useValue: mocks.playerAttributeService,
        },
        {
          provide: GamePlayService,
          useValue: mocks.gamePlayService,
        },
      ],
    }).compile();

    services = { gamePhase: module.get<GamePhaseService>(GamePhaseService) };
  });
  
  describe("applyEndingGamePhasePlayerAttributesOutcomesToPlayers", () => {
    let localMocks: {
      gamePhaseService: {
        applyEndingGamePhasePlayerAttributesOutcomesToPlayer: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = { gamePhaseService: { applyEndingGamePhasePlayerAttributesOutcomesToPlayer: jest.spyOn(services.gamePhase as unknown as { applyEndingGamePhasePlayerAttributesOutcomesToPlayer }, "applyEndingGamePhasePlayerAttributesOutcomesToPlayer").mockImplementation() } };
    });

    it("should call ending game phase method for each player when called.", async() => {
      const players = bulkCreateFakePlayers(4);
      const game = createFakeGame({ phase: GAME_PHASES.NIGHT, players });
      localMocks.gamePhaseService.applyEndingGamePhasePlayerAttributesOutcomesToPlayer.mockResolvedValue(game);
      await services.gamePhase.applyEndingGamePhasePlayerAttributesOutcomesToPlayers(game);

      expect(localMocks.gamePhaseService.applyEndingGamePhasePlayerAttributesOutcomesToPlayer).toHaveBeenNthCalledWith(1, players[0], game);
      expect(localMocks.gamePhaseService.applyEndingGamePhasePlayerAttributesOutcomesToPlayer).toHaveBeenNthCalledWith(2, players[1], game);
      expect(localMocks.gamePhaseService.applyEndingGamePhasePlayerAttributesOutcomesToPlayer).toHaveBeenNthCalledWith(3, players[2], game);
      expect(localMocks.gamePhaseService.applyEndingGamePhasePlayerAttributesOutcomesToPlayer).toHaveBeenNthCalledWith(4, players[3], game);
    });
  });

  describe("switchPhaseAndAppendGamePhaseUpcomingPlays", () => {
    const upcomingDayPlays = [createFakeGamePlayAllVote()];
    const upcomingNightPlays = [createFakeGamePlayWerewolvesEat(), createFakeGamePlaySeerLooks()];

    beforeEach(() => {
      mocks.gamePlayService.getUpcomingDayPlays.mockReturnValue(upcomingDayPlays);
      mocks.gamePlayService.getUpcomingNightPlays.mockResolvedValue(upcomingNightPlays);
    });

    it("should switch to night and append upcoming night plays when game's current phase is DAY.", async() => {
      const game = createFakeGame({ phase: GAME_PHASES.DAY, upcomingPlays: [createFakeGamePlayHunterShoots()] });
      const expectedGame = createFakeGame({
        ...game,
        phase: GAME_PHASES.NIGHT,
        turn: game.turn + 1,
        upcomingPlays: [...game.upcomingPlays, ...upcomingNightPlays],
      });

      await expect(services.gamePhase.switchPhaseAndAppendGamePhaseUpcomingPlays(game)).resolves.toStrictEqual(expectedGame);
    });

    it("should switch to day and append upcoming day plays when game's current phase is NIGHT.", async() => {
      const game = createFakeGame({ phase: GAME_PHASES.NIGHT, upcomingPlays: [createFakeGamePlayHunterShoots()] });
      const expectedGame = createFakeGame({
        ...game,
        phase: GAME_PHASES.DAY,
        upcomingPlays: [...game.upcomingPlays, ...upcomingDayPlays],
      });

      await expect(services.gamePhase.switchPhaseAndAppendGamePhaseUpcomingPlays(game)).resolves.toStrictEqual(expectedGame);
    });
  });

  describe("applyEndingDayPlayerAttributesOutcomesToPlayer", () => {
    it("should do nothing when player doesn't have the contaminated attribute.", async() => {
      const player = createFakeWerewolfAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] });
      const game = createFakeGame({ players: [player] });
      
      await expect(services.gamePhase["applyEndingDayPlayerAttributesOutcomesToPlayer"](player, game)).resolves.toStrictEqual(game);
      expect(mocks.playerAttributeService.applyContaminatedAttributeOutcomes).not.toHaveBeenCalled();
    });

    it("should call contaminated method when player has the contaminated attribute.", async() => {
      const player = createFakeWerewolfAlivePlayer({ attributes: [createFakeContaminatedByRustySwordKnightPlayerAttribute()] });
      const game = createFakeGame({ players: [player] });
      await services.gamePhase["applyEndingDayPlayerAttributesOutcomesToPlayer"](player, game);

      expect(mocks.playerAttributeService.applyContaminatedAttributeOutcomes).toHaveBeenCalledExactlyOnceWith(player, game);
    });
  });

  describe("applyEndingNightPlayerAttributesOutcomesToPlayer", () => {
    it("should do nothing when player doesn't have any ending night attributes.", async() => {
      const player = createFakeWerewolfAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] });
      const game = createFakeGame({ players: [player] });

      await expect(services.gamePhase["applyEndingNightPlayerAttributesOutcomesToPlayer"](player, game)).resolves.toStrictEqual(game);
      expect(mocks.playerAttributeService.applyEatenAttributeOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerAttributeService.applyDrankDeathPotionAttributeOutcomes).not.toHaveBeenCalled();
    });

    it("should call all attributes outcomes methods when player has every attributes.", async() => {
      const attributes = [
        createFakeSheriffByAllPlayerAttribute(),
        createFakeEatenByWerewolvesPlayerAttribute(),
        createFakeDrankDeathPotionByWitchPlayerAttribute(),
      ];
      const player = createFakeWerewolfAlivePlayer({ attributes });
      const game = createFakeGame({ players: [player] });
      mocks.playerAttributeService.applyEatenAttributeOutcomes.mockResolvedValue(game);
      mocks.playerAttributeService.applyDrankDeathPotionAttributeOutcomes.mockResolvedValue(game);
      await services.gamePhase["applyEndingNightPlayerAttributesOutcomesToPlayer"](player, game);

      expect(mocks.playerAttributeService.applyEatenAttributeOutcomes).toHaveBeenCalledExactlyOnceWith(player, game, attributes[1]);
      expect(mocks.playerAttributeService.applyDrankDeathPotionAttributeOutcomes).toHaveBeenCalledExactlyOnceWith(player, game);
    });
  });

  describe("applyEndingGamePhasePlayerAttributesOutcomesToPlayer", () => {
    let localMocks: {
      gamePhaseService: {
        applyEndingNightPlayerAttributesOutcomesToPlayer: jest.SpyInstance;
        applyEndingDayPlayerAttributesOutcomesToPlayer: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePhaseService: {
          applyEndingNightPlayerAttributesOutcomesToPlayer: jest.spyOn(services.gamePhase as unknown as { applyEndingNightPlayerAttributesOutcomesToPlayer }, "applyEndingNightPlayerAttributesOutcomesToPlayer").mockImplementation(),
          applyEndingDayPlayerAttributesOutcomesToPlayer: jest.spyOn(services.gamePhase as unknown as { applyEndingDayPlayerAttributesOutcomesToPlayer }, "applyEndingDayPlayerAttributesOutcomesToPlayer").mockImplementation(),
        },
      };
    });

    it("should call ending night method when game phase is night.", async() => {
      const player = createFakePlayer();
      const game = createFakeGame({ phase: GAME_PHASES.NIGHT });
      await services.gamePhase["applyEndingGamePhasePlayerAttributesOutcomesToPlayer"](player, game);

      expect(localMocks.gamePhaseService.applyEndingNightPlayerAttributesOutcomesToPlayer).toHaveBeenCalledExactlyOnceWith(player, game);
      expect(localMocks.gamePhaseService.applyEndingDayPlayerAttributesOutcomesToPlayer).not.toHaveBeenCalled();
    });

    it("should call ending day method when game phase is day.", async() => {
      const player = createFakePlayer();
      const game = createFakeGame({ phase: GAME_PHASES.DAY });
      await services.gamePhase["applyEndingGamePhasePlayerAttributesOutcomesToPlayer"](player, game);

      expect(localMocks.gamePhaseService.applyEndingDayPlayerAttributesOutcomesToPlayer).toHaveBeenCalledExactlyOnceWith(player, game);
      expect(localMocks.gamePhaseService.applyEndingNightPlayerAttributesOutcomesToPlayer).not.toHaveBeenCalled();
    });
  });
});