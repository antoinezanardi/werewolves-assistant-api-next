import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { GamePhases } from "@/modules/game/enums/game.enum";
import * as GameHelper from "@/modules/game/helpers/game.helper";
import { GamePhaseService } from "@/modules/game/providers/services/game-phase/game-phase.service";
import { GamePlayService } from "@/modules/game/providers/services/game-play/game-play.service";
import { PlayerAttributeService } from "@/modules/game/providers/services/player/player-attribute.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import { RoleSides } from "@/modules/role/enums/role.enum";

import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";

import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeBearTamerGameOptions, createFakeRolesGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGamePlayHunterShoots, createFakeGamePlaySeerLooks, createFakeGamePlaySurvivorsVote, createFakeGamePlayWerewolvesEat } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeContaminatedByRustySwordKnightPlayerAttribute, createFakeDrankDeathPotionByWitchPlayerAttribute, createFakeEatenByWerewolvesPlayerAttribute, createFakeGrowledByBearTamerPlayerAttribute, createFakePowerlessByAncientPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeBearTamerAlivePlayer, createFakeBigBadWolfAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer, createFakePlayerSide } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Phase Service", () => {
  let services: { gamePhase: GamePhaseService };
  let mocks: {
    gamePhaseService: {
      applyEndingGamePhasePlayerAttributesOutcomesToPlayers: jest.SpyInstance;
      applyEndingGamePhasePlayerAttributesOutcomesToPlayer: jest.SpyInstance;
      applyEndingNightPlayerAttributesOutcomesToPlayer: jest.SpyInstance;
      applyEndingDayPlayerAttributesOutcomesToPlayer: jest.SpyInstance;
      applyStartingDayPlayerRoleOutcomesToPlayers: jest.SpyInstance;
      applyStartingDayBearTamerRoleOutcomes: jest.SpyInstance;
    };
    playerAttributeService: {
      applyDrankDeathPotionAttributeOutcomes: jest.SpyInstance;
      applyEatenAttributeOutcomes: jest.SpyInstance;
      applyContaminatedAttributeOutcomes: jest.SpyInstance;
    };
    gamePlayService: {
      getUpcomingNightPlays: jest.SpyInstance;
      getUpcomingDayPlays: jest.SpyInstance;
    };
    gameHelper: {
      getNearestAliveNeighbor: jest.SpyInstance;
    };
    unexpectedExceptionFactory: {
      createCantFindPlayerUnexpectedException: jest.SpyInstance;
    };
  };

  beforeEach(async() => {
    mocks = {
      gamePhaseService: {
        applyEndingGamePhasePlayerAttributesOutcomesToPlayers: jest.fn(),
        applyEndingGamePhasePlayerAttributesOutcomesToPlayer: jest.fn(),
        applyEndingNightPlayerAttributesOutcomesToPlayer: jest.fn(),
        applyEndingDayPlayerAttributesOutcomesToPlayer: jest.fn(),
        applyStartingDayPlayerRoleOutcomesToPlayers: jest.fn(),
        applyStartingDayBearTamerRoleOutcomes: jest.fn(),
      },
      playerAttributeService: {
        applyDrankDeathPotionAttributeOutcomes: jest.fn(),
        applyEatenAttributeOutcomes: jest.fn(),
        applyContaminatedAttributeOutcomes: jest.fn(),
      },
      gamePlayService: {
        getUpcomingNightPlays: jest.fn(),
        getUpcomingDayPlays: jest.fn(),
      },
      gameHelper: { getNearestAliveNeighbor: jest.spyOn(GameHelper, "getNearestAliveNeighbor").mockImplementation() },
      unexpectedExceptionFactory: { createCantFindPlayerUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createCantFindPlayerUnexpectedException").mockImplementation() },
    };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PlayerAttributeService,
          useValue: mocks.playerAttributeService,
        },
        {
          provide: GamePlayService,
          useValue: mocks.gamePlayService,
        },
        GamePhaseService,
      ],
    }).compile();

    services = { gamePhase: module.get<GamePhaseService>(GamePhaseService) };
  });

  describe("applyEndingGamePhaseOutcomes", () => {
    beforeEach(() => {
      mocks.gamePhaseService.applyEndingGamePhasePlayerAttributesOutcomesToPlayers = jest.spyOn(services.gamePhase as unknown as { applyEndingGamePhasePlayerAttributesOutcomesToPlayers }, "applyEndingGamePhasePlayerAttributesOutcomesToPlayers").mockImplementation();
    });

    it("should call applyEndingGamePhasePlayerAttributesOutcomesToPlayers method when called.", async() => {
      const game = createFakeGame();
      await services.gamePhase.applyEndingGamePhaseOutcomes(game);

      expect(mocks.gamePhaseService.applyEndingGamePhasePlayerAttributesOutcomesToPlayers).toHaveBeenCalledExactlyOnceWith(game);
    });
  });

  describe("switchPhaseAndAppendGamePhaseUpcomingPlays", () => {
    const upcomingDayPlays = [createFakeGamePlaySurvivorsVote()];
    const upcomingNightPlays = [
      createFakeGamePlayWerewolvesEat(),
      createFakeGamePlaySeerLooks(),
    ];

    beforeEach(() => {
      mocks.gamePlayService.getUpcomingDayPlays.mockReturnValue(upcomingDayPlays);
      mocks.gamePlayService.getUpcomingNightPlays.mockResolvedValue(upcomingNightPlays);
    });

    it("should switch to night and append upcoming night plays when game's current phase is DAY.", async() => {
      const game = createFakeGame({ phase: GamePhases.DAY, upcomingPlays: [createFakeGamePlayHunterShoots()] });
      const expectedGame = createFakeGame({
        ...game,
        phase: GamePhases.NIGHT,
        turn: game.turn + 1,
        upcomingPlays: [...game.upcomingPlays, ...upcomingNightPlays],
      });

      await expect(services.gamePhase.switchPhaseAndAppendGamePhaseUpcomingPlays(game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should switch to day and append upcoming day plays when game's current phase is NIGHT.", async() => {
      const game = createFakeGame({ phase: GamePhases.NIGHT, upcomingPlays: [createFakeGamePlayHunterShoots()] });
      const expectedGame = createFakeGame({
        ...game,
        phase: GamePhases.DAY,
        upcomingPlays: [...game.upcomingPlays, ...upcomingDayPlays],
      });

      await expect(services.gamePhase.switchPhaseAndAppendGamePhaseUpcomingPlays(game)).resolves.toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyStartingGamePhaseOutcomes", () => {
    beforeEach(() => {
      mocks.gamePhaseService.applyStartingDayPlayerRoleOutcomesToPlayers = jest.spyOn(services.gamePhase as unknown as { applyStartingDayPlayerRoleOutcomesToPlayers }, "applyStartingDayPlayerRoleOutcomesToPlayers").mockImplementation();
    });

    it("should do nothing when game's current phase is NIGHT.", () => {
      const game = createFakeGame({ phase: GamePhases.NIGHT });
      const result = services.gamePhase.applyStartingGamePhaseOutcomes(game);

      expect(mocks.gamePhaseService.applyStartingDayPlayerRoleOutcomesToPlayers).not.toHaveBeenCalled();
      expect(result).toStrictEqual<Game>(game);
    });

    it("should call applyStartingDayPlayerRoleOutcomesToPlayers method when game's current phase is DAY.", () => {
      const game = createFakeGame({ phase: GamePhases.DAY });
      services.gamePhase.applyStartingGamePhaseOutcomes(game);

      expect(mocks.gamePhaseService.applyStartingDayPlayerRoleOutcomesToPlayers).toHaveBeenCalledExactlyOnceWith(game);
    });
  });
  
  describe("applyEndingGamePhasePlayerAttributesOutcomesToPlayers", () => {
    beforeEach(() => {
      mocks.gamePhaseService.applyEndingGamePhasePlayerAttributesOutcomesToPlayer = jest.spyOn(services.gamePhase as unknown as { applyEndingGamePhasePlayerAttributesOutcomesToPlayer }, "applyEndingGamePhasePlayerAttributesOutcomesToPlayer").mockImplementation();
    });

    it("should call ending game phase method for each player when called.", async() => {
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ phase: GamePhases.NIGHT, players });
      mocks.gamePhaseService.applyEndingGamePhasePlayerAttributesOutcomesToPlayer.mockResolvedValue(game);
      await services.gamePhase["applyEndingGamePhasePlayerAttributesOutcomesToPlayers"](game);

      expect(mocks.gamePhaseService.applyEndingGamePhasePlayerAttributesOutcomesToPlayer).toHaveBeenNthCalledWith(1, players[0], game);
      expect(mocks.gamePhaseService.applyEndingGamePhasePlayerAttributesOutcomesToPlayer).toHaveBeenNthCalledWith(2, players[1], game);
      expect(mocks.gamePhaseService.applyEndingGamePhasePlayerAttributesOutcomesToPlayer).toHaveBeenNthCalledWith(3, players[2], game);
      expect(mocks.gamePhaseService.applyEndingGamePhasePlayerAttributesOutcomesToPlayer).toHaveBeenNthCalledWith(4, players[3], game);
    });
  });

  describe("applyEndingDayPlayerAttributesOutcomesToPlayer", () => {
    it("should do nothing when player doesn't have the contaminated attribute.", async() => {
      const player = createFakeWerewolfAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] });
      const game = createFakeGame({ players: [player] });
      
      await expect(services.gamePhase["applyEndingDayPlayerAttributesOutcomesToPlayer"](player, game)).resolves.toStrictEqual<Game>(game);
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
    it("should create cant find player exception in case player is not found in game when called.", async() => {
      const player = createFakeWerewolfAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] });
      const game = createFakeGame({ players: [player] });
      const interpolations = { gameId: game._id, playerId: player._id };
      await services.gamePhase["applyEndingNightPlayerAttributesOutcomesToPlayer"](player, game);

      expect(mocks.unexpectedExceptionFactory.createCantFindPlayerUnexpectedException).toHaveBeenCalledExactlyOnceWith("applyEndingNightPlayerAttributesOutcomesToPlayer", interpolations);
    });

    it("should do nothing when player doesn't have any ending night attributes.", async() => {
      const player = createFakeWerewolfAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] });
      const game = createFakeGame({ players: [player] });

      await expect(services.gamePhase["applyEndingNightPlayerAttributesOutcomesToPlayer"](player, game)).resolves.toStrictEqual<Game>(game);
      expect(mocks.playerAttributeService.applyEatenAttributeOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerAttributeService.applyDrankDeathPotionAttributeOutcomes).not.toHaveBeenCalled();
    });

    it("should call all attributes outcomes methods when player has every attributes.", async() => {
      const attributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
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
    beforeEach(() => {
      mocks.gamePhaseService.applyEndingNightPlayerAttributesOutcomesToPlayer = jest.spyOn(services.gamePhase as unknown as { applyEndingNightPlayerAttributesOutcomesToPlayer }, "applyEndingNightPlayerAttributesOutcomesToPlayer").mockImplementation();
      mocks.gamePhaseService.applyEndingDayPlayerAttributesOutcomesToPlayer = jest.spyOn(services.gamePhase as unknown as { applyEndingDayPlayerAttributesOutcomesToPlayer }, "applyEndingDayPlayerAttributesOutcomesToPlayer").mockImplementation();
    });

    it("should call ending night method when game phase is night.", async() => {
      const player = createFakePlayer();
      const game = createFakeGame({ phase: GamePhases.NIGHT });
      await services.gamePhase["applyEndingGamePhasePlayerAttributesOutcomesToPlayer"](player, game);

      expect(mocks.gamePhaseService.applyEndingNightPlayerAttributesOutcomesToPlayer).toHaveBeenCalledExactlyOnceWith(player, game);
      expect(mocks.gamePhaseService.applyEndingDayPlayerAttributesOutcomesToPlayer).not.toHaveBeenCalled();
    });

    it("should call ending day method when game phase is day.", async() => {
      const player = createFakePlayer();
      const game = createFakeGame({ phase: GamePhases.DAY });
      await services.gamePhase["applyEndingGamePhasePlayerAttributesOutcomesToPlayer"](player, game);

      expect(mocks.gamePhaseService.applyEndingDayPlayerAttributesOutcomesToPlayer).toHaveBeenCalledExactlyOnceWith(player, game);
      expect(mocks.gamePhaseService.applyEndingNightPlayerAttributesOutcomesToPlayer).not.toHaveBeenCalled();
    });
  });

  describe("applyStartingDayBearTamerRoleOutcomes", () => {
    it("should return game as is when none of the bear tamer neighbor is a werewolf and bear tamer is not infected.", () => {
      const bearTamerPlayer = createFakeBearTamerAlivePlayer();
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ bearTamer: createFakeBearTamerGameOptions({ doesGrowlIfInfected: true }) }) });
      const game = createFakeGame({ players: [bearTamerPlayer], options });
      mocks.gameHelper.getNearestAliveNeighbor.mockReturnValueOnce(createFakeVillagerAlivePlayer());
      mocks.gameHelper.getNearestAliveNeighbor.mockReturnValueOnce(createFakeVillagerAlivePlayer());
      const result = services.gamePhase["applyStartingDayBearTamerRoleOutcomes"](bearTamerPlayer, game);

      expect(result).toStrictEqual<Game>(game);
    });

    it("should return game as is when bear tamer is infected but options specify that it doesn't growl if it's the case.", () => {
      const bearTamerPlayer = createFakeBearTamerAlivePlayer({ side: createFakePlayerSide({ current: RoleSides.WEREWOLVES }) });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ bearTamer: createFakeBearTamerGameOptions({ doesGrowlIfInfected: false }) }) });
      const game = createFakeGame({ players: [bearTamerPlayer], options });
      mocks.gameHelper.getNearestAliveNeighbor.mockReturnValueOnce(createFakeVillagerAlivePlayer());
      mocks.gameHelper.getNearestAliveNeighbor.mockReturnValueOnce(createFakeVillagerAlivePlayer());
      const result = services.gamePhase["applyStartingDayBearTamerRoleOutcomes"](bearTamerPlayer, game);

      expect(result).toStrictEqual<Game>(game);
    });

    it("should add bear tamer player growled attribute when he is infected, even if none of his neighbors are werewolves.", () => {
      const bearTamerPlayer = createFakeBearTamerAlivePlayer({ side: createFakePlayerSide({ current: RoleSides.WEREWOLVES }) });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ bearTamer: createFakeBearTamerGameOptions({ doesGrowlIfInfected: true }) }) });
      const game = createFakeGame({ players: [bearTamerPlayer], options });
      mocks.gameHelper.getNearestAliveNeighbor.mockReturnValueOnce(createFakeVillagerAlivePlayer());
      mocks.gameHelper.getNearestAliveNeighbor.mockReturnValueOnce(createFakeVillagerAlivePlayer());
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakeBearTamerAlivePlayer({
            ...bearTamerPlayer,
            attributes: [createFakeGrowledByBearTamerPlayerAttribute()],
          }),
        ],
      });
      const result = services.gamePhase["applyStartingDayBearTamerRoleOutcomes"](bearTamerPlayer, game);

      expect(result).toStrictEqual<Game>(expectedGame);
    });

    it("should add bear tamer player growled attribute when his left neighbor is a werewolf.", () => {
      const bearTamerPlayer = createFakeBearTamerAlivePlayer();
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ bearTamer: createFakeBearTamerGameOptions({ doesGrowlIfInfected: true }) }) });
      const game = createFakeGame({ players: [bearTamerPlayer], options });
      mocks.gameHelper.getNearestAliveNeighbor.mockReturnValueOnce(createFakeBigBadWolfAlivePlayer());
      mocks.gameHelper.getNearestAliveNeighbor.mockReturnValueOnce(createFakeVillagerAlivePlayer());
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakeBearTamerAlivePlayer({
            ...bearTamerPlayer,
            attributes: [createFakeGrowledByBearTamerPlayerAttribute()],
          }),
        ],
      });
      const result = services.gamePhase["applyStartingDayBearTamerRoleOutcomes"](bearTamerPlayer, game);

      expect(result).toStrictEqual<Game>(expectedGame);
    });

    it("should add bear tamer player growled attribute when his right neighbor is a werewolf.", () => {
      const bearTamerPlayer = createFakeBearTamerAlivePlayer();
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ bearTamer: createFakeBearTamerGameOptions({ doesGrowlIfInfected: true }) }) });
      const game = createFakeGame({ players: [bearTamerPlayer], options });
      mocks.gameHelper.getNearestAliveNeighbor.mockReturnValueOnce(createFakeVillagerAlivePlayer());
      mocks.gameHelper.getNearestAliveNeighbor.mockReturnValueOnce(createFakeWhiteWerewolfAlivePlayer());
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakeBearTamerAlivePlayer({
            ...bearTamerPlayer,
            attributes: [createFakeGrowledByBearTamerPlayerAttribute()],
          }),
        ],
      });
      const result = services.gamePhase["applyStartingDayBearTamerRoleOutcomes"](bearTamerPlayer, game);

      expect(result).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyStartingDayPlayerRoleOutcomesToPlayers", () => {
    beforeEach(() => {
      mocks.gamePhaseService.applyStartingDayBearTamerRoleOutcomes = jest.spyOn(services.gamePhase as unknown as { applyStartingDayBearTamerRoleOutcomes }, "applyStartingDayBearTamerRoleOutcomes").mockImplementation();
    });
    
    it("should call applyStartingDayBearTamerRoleOutcomes method when one player in the game is bear tamer, alive and powerful.", () => {
      const bearTamerPlayer = createFakeBearTamerAlivePlayer();
      const game = createFakeGame({ players: [bearTamerPlayer] });
      services.gamePhase["applyStartingDayPlayerRoleOutcomesToPlayers"](game);

      expect(mocks.gamePhaseService.applyStartingDayBearTamerRoleOutcomes).toHaveBeenCalledExactlyOnceWith(bearTamerPlayer, game);
    });

    it("should not call applyStartingDayBearTamerRoleOutcomes method when there is no bear tamer.", () => {
      const game = createFakeGame({ players: [createFakeWerewolfAlivePlayer()] });
      services.gamePhase["applyStartingDayPlayerRoleOutcomesToPlayers"](game);

      expect(mocks.gamePhaseService.applyStartingDayBearTamerRoleOutcomes).not.toHaveBeenCalled();
    });

    it("should not call applyStartingDayBearTamerRoleOutcomes method when the bear tamer is dead.", () => {
      const bearTamerPlayer = createFakeBearTamerAlivePlayer({ isAlive: false });
      const game = createFakeGame({ players: [bearTamerPlayer] });
      services.gamePhase["applyStartingDayPlayerRoleOutcomesToPlayers"](game);

      expect(mocks.gamePhaseService.applyStartingDayBearTamerRoleOutcomes).not.toHaveBeenCalled();
    });

    it("should not call applyStartingDayBearTamerRoleOutcomes method when the bear tamer is powerless.", () => {
      const bearTamerPlayer = createFakeBearTamerAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] });
      const game = createFakeGame({ players: [bearTamerPlayer] });
      services.gamePhase["applyStartingDayPlayerRoleOutcomesToPlayers"](game);

      expect(mocks.gamePhaseService.applyStartingDayBearTamerRoleOutcomes).not.toHaveBeenCalled();
    });
  });
});