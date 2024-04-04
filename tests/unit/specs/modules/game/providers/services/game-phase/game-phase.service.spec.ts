import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import * as GameHelper from "@/modules/game/helpers/game.helpers";
import { GamePhaseService } from "@/modules/game/providers/services/game-phase/game-phase.service";
import { GamePlayService } from "@/modules/game/providers/services/game-play/game-play.service";
import { PlayerAttributeService } from "@/modules/game/providers/services/player/player-attribute.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";

import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeActorGameOptions, createFakeRolesGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options/game-roles-options.schema.factory";
import { createFakeGamePlayHunterShoots, createFakeGamePlaySeerLooks, createFakeGamePlayWerewolvesEat } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeActingByActorPlayerAttribute, createFakeContaminatedByRustySwordKnightPlayerAttribute, createFakeDrankDeathPotionByWitchPlayerAttribute, createFakeEatenByWerewolvesPlayerAttribute, createFakePowerlessByAccursedWolfFatherPlayerAttribute, createFakePowerlessByActorPlayerAttribute, createFakePowerlessByElderPlayerAttribute, createFakePowerlessByFoxPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeActorAlivePlayer, createFakeSeerAlivePlayer, createFakeWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer, createFakePlayerRole } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Phase Service", () => {
  let services: { gamePhase: GamePhaseService };
  let mocks: {
    gamePhaseService: {
      applyEndingGamePhasePlayerAttributesOutcomesToPlayers: jest.SpyInstance;
      applyEndingGamePhasePlayerAttributesOutcomesToPlayer: jest.SpyInstance;
      applyEndingNightPlayerAttributesOutcomesToPlayer: jest.SpyInstance;
      applyEndingDayPlayerAttributesOutcomesToPlayer: jest.SpyInstance;
      applyStartingDayBearTamerRoleOutcomes: jest.SpyInstance;
      applyStartingNightPlayerAttributesOutcomes: jest.SpyInstance;
      applyStartingNightActingPlayerOutcomes: jest.SpyInstance;
    };
    playerAttributeService: {
      applyDrankDeathPotionAttributeOutcomes: jest.SpyInstance;
      applyEatenAttributeOutcomes: jest.SpyInstance;
      applyContaminatedAttributeOutcomes: jest.SpyInstance;
    };
    gamePlayService: {
      getPhaseUpcomingPlays: jest.SpyInstance;
    };
    gameHelper: {
      getNearestAliveNeighbor: jest.SpyInstance;
    };
    unexpectedExceptionFactory: {
      createCantFindPlayerWithIdUnexpectedException: jest.SpyInstance;
    };
  };

  beforeEach(async() => {
    mocks = {
      gamePhaseService: {
        applyEndingGamePhasePlayerAttributesOutcomesToPlayers: jest.fn(),
        applyEndingGamePhasePlayerAttributesOutcomesToPlayer: jest.fn(),
        applyEndingNightPlayerAttributesOutcomesToPlayer: jest.fn(),
        applyEndingDayPlayerAttributesOutcomesToPlayer: jest.fn(),
        applyStartingDayBearTamerRoleOutcomes: jest.fn(),
        applyStartingNightPlayerAttributesOutcomes: jest.fn(),
        applyStartingNightActingPlayerOutcomes: jest.fn(),
      },
      playerAttributeService: {
        applyDrankDeathPotionAttributeOutcomes: jest.fn(),
        applyEatenAttributeOutcomes: jest.fn(),
        applyContaminatedAttributeOutcomes: jest.fn(),
      },
      gamePlayService: { getPhaseUpcomingPlays: jest.fn() },
      gameHelper: { getNearestAliveNeighbor: jest.spyOn(GameHelper, "getNearestAliveNeighbor").mockImplementation() },
      unexpectedExceptionFactory: { createCantFindPlayerWithIdUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createCantFindPlayerWithIdUnexpectedException").mockImplementation() },
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
    const upcomingPlays = [
      createFakeGamePlayWerewolvesEat(),
      createFakeGamePlaySeerLooks(),
    ];

    beforeEach(() => {
      mocks.gamePlayService.getPhaseUpcomingPlays.mockResolvedValue(upcomingPlays);
    });

    it("should switch to night and append upcoming night plays when game's current phase is DAY.", async() => {
      const game = createFakeGame({ phase: "day", upcomingPlays: [createFakeGamePlayHunterShoots()] });
      const expectedGame = createFakeGame({
        ...game,
        phase: "night",
        turn: game.turn + 1,
        upcomingPlays: [...game.upcomingPlays, ...upcomingPlays],
      });

      await expect(services.gamePhase.switchPhaseAndAppendGamePhaseUpcomingPlays(game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should switch to day and append upcoming day plays when game's current phase is NIGHT.", async() => {
      const game = createFakeGame({ phase: "night", upcomingPlays: [createFakeGamePlayHunterShoots()] });
      const expectedGame = createFakeGame({
        ...game,
        phase: "day",
        upcomingPlays: [...game.upcomingPlays, ...upcomingPlays],
      });

      await expect(services.gamePhase.switchPhaseAndAppendGamePhaseUpcomingPlays(game)).resolves.toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyStartingGamePhaseOutcomes", () => {
    beforeEach(() => {
      mocks.gamePhaseService.applyStartingNightPlayerAttributesOutcomes = jest.spyOn(services.gamePhase as unknown as { applyStartingNightPlayerAttributesOutcomes }, "applyStartingNightPlayerAttributesOutcomes").mockImplementation();
    });

    it("should call applyStartingNightPlayerAttributesOutcomes when game's current phase is NIGHT.", () => {
      const game = createFakeGame({ phase: "night" });
      services.gamePhase.applyStartingGamePhaseOutcomes(game);

      expect(mocks.gamePhaseService.applyStartingNightPlayerAttributesOutcomes).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should return game as is when game's current phase is DAY.", () => {
      const game = createFakeGame({ phase: "day" });
      services.gamePhase.applyStartingGamePhaseOutcomes(game);

      expect(mocks.gamePhaseService.applyStartingNightPlayerAttributesOutcomes).not.toHaveBeenCalled();
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
      const game = createFakeGame({ phase: "night", players });
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
    it("should create can't find player exception in case player is not found in game when called.", async() => {
      const player = createFakeWerewolfAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] });
      const game = createFakeGame({ players: [player] });
      const interpolations = { gameId: game._id, playerId: player._id };
      await services.gamePhase["applyEndingNightPlayerAttributesOutcomesToPlayer"](player, game);

      expect(mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException).toHaveBeenCalledExactlyOnceWith("applyEndingNightPlayerAttributesOutcomesToPlayer", interpolations);
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
      const game = createFakeGame({ phase: "night" });
      await services.gamePhase["applyEndingGamePhasePlayerAttributesOutcomesToPlayer"](player, game);

      expect(mocks.gamePhaseService.applyEndingNightPlayerAttributesOutcomesToPlayer).toHaveBeenCalledExactlyOnceWith(player, game);
      expect(mocks.gamePhaseService.applyEndingDayPlayerAttributesOutcomesToPlayer).not.toHaveBeenCalled();
    });

    it("should call ending day method when game phase is day.", async() => {
      const player = createFakePlayer();
      const game = createFakeGame({ phase: "day" });
      await services.gamePhase["applyEndingGamePhasePlayerAttributesOutcomesToPlayer"](player, game);

      expect(mocks.gamePhaseService.applyEndingDayPlayerAttributesOutcomesToPlayer).toHaveBeenCalledExactlyOnceWith(player, game);
      expect(mocks.gamePhaseService.applyEndingNightPlayerAttributesOutcomesToPlayer).not.toHaveBeenCalled();
    });
  });

  describe("isActingPlayerAttributeRelevantOnStartingNight", () => {
    it.each<{
      test: string;
      attribute: PlayerAttribute;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return true when attribute is nor acting or powerless.",
        attribute: createFakeEatenByWerewolvesPlayerAttribute(),
        game: createFakeGame(),
        expected: true,
      },
      {
        test: "should return false when attribute is acting.",
        attribute: createFakeActingByActorPlayerAttribute(),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return true when attribute is powerless from actor.",
        attribute: createFakePowerlessByActorPlayerAttribute(),
        game: createFakeGame(),
        expected: true,
      },
      {
        test: "should return true when attribute is powerless from elder.",
        attribute: createFakePowerlessByElderPlayerAttribute(),
        game: createFakeGame(),
        expected: true,
      },
      {
        test: "should return true when attribute is powerless from accursed wolf-father and game options say that actor is powerless on werewolves side.",
        attribute: createFakePowerlessByActorPlayerAttribute(),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: true }) }) }) }),
        expected: true,
      },
      {
        test: "should return false when attribute is powerless from accursed wolf-father and game options say that actor is not powerless on werewolves side.",
        attribute: createFakePowerlessByActorPlayerAttribute(),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: false }) }) }) }),
        expected: false,
      },
    ]);
  });

  describe("applyStartingNightActingPlayerOutcomes", () => {
    it("should set player current role to actor and remove obsolete powerless and acting attributes when called.", () => {
      const actorRole = createFakePlayerRole({
        original: RoleNames.ACTOR,
        current: RoleNames.WEREWOLF,
        isRevealed: true,
      });
      const attributes = [
        createFakePowerlessByElderPlayerAttribute(),
        createFakePowerlessByAccursedWolfFatherPlayerAttribute(),
        createFakePowerlessByActorPlayerAttribute(),
        createFakeContaminatedByRustySwordKnightPlayerAttribute(),
        createFakeActingByActorPlayerAttribute(),
        createFakePowerlessByFoxPlayerAttribute(),
      ];
      const actorPlayer = createFakeWerewolfAlivePlayer({ role: actorRole, attributes });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: true }) }) });
      const game = createFakeGame({ players: [actorPlayer], options });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakeActorAlivePlayer({
            ...actorPlayer,
            role: createFakePlayerRole({ ...actorPlayer.role, current: RoleNames.ACTOR, isRevealed: false }),
            attributes: [
              attributes[0],
              attributes[1],
              attributes[2],
              attributes[3],
            ],
          }),
        ],
      });
      const result = services.gamePhase["applyStartingNightActingPlayerOutcomes"](actorPlayer, game);

      expect(result).toStrictEqual<Game>(expectedGame);
    });

    it("should add powerless attribute from accursed wolf-father when actor is powerless on werewolves side and doesn't have it yet.", () => {
      const actorRole = createFakePlayerRole({
        original: RoleNames.ACTOR,
        current: RoleNames.WEREWOLF,
        isRevealed: true,
      });
      const attributes = [
        createFakePowerlessByElderPlayerAttribute(),
        createFakePowerlessByActorPlayerAttribute(),
        createFakeContaminatedByRustySwordKnightPlayerAttribute(),
        createFakeActingByActorPlayerAttribute(),
      ];
      const actorPlayer = createFakeWerewolfAlivePlayer({ role: actorRole, attributes });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: true }) }) });
      const game = createFakeGame({ players: [actorPlayer], options });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakeActorAlivePlayer({
            ...actorPlayer,
            role: createFakePlayerRole({ ...actorPlayer.role, current: RoleNames.ACTOR, isRevealed: false }),
            attributes: [
              attributes[0],
              attributes[1],
              attributes[2],
              createFakePowerlessByAccursedWolfFatherPlayerAttribute(),
            ],
          }),
        ],
      });
      const result = services.gamePhase["applyStartingNightActingPlayerOutcomes"](actorPlayer, game);

      expect(result).toStrictEqual<Game>(expectedGame);
    });

    it("should not add powerless attribute from accursed wolf-father when actor is powerless on werewolves side and already has it.", () => {
      const actorRole = createFakePlayerRole({
        original: RoleNames.ACTOR,
        current: RoleNames.WEREWOLF,
        isRevealed: true,
      });
      const attributes = [
        createFakePowerlessByElderPlayerAttribute(),
        createFakePowerlessByActorPlayerAttribute(),
        createFakePowerlessByAccursedWolfFatherPlayerAttribute(),
        createFakeContaminatedByRustySwordKnightPlayerAttribute(),
        createFakeActingByActorPlayerAttribute(),
      ];
      const actorPlayer = createFakeWerewolfAlivePlayer({ role: actorRole, attributes });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: true }) }) });
      const game = createFakeGame({ players: [actorPlayer], options });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakeActorAlivePlayer({
            ...actorPlayer,
            role: createFakePlayerRole({ ...actorPlayer.role, current: RoleNames.ACTOR, isRevealed: false }),
            attributes: [
              attributes[0],
              attributes[1],
              attributes[2],
              attributes[3],
            ],
          }),
        ],
      });
      const result = services.gamePhase["applyStartingNightActingPlayerOutcomes"](actorPlayer, game);

      expect(result).toStrictEqual<Game>(expectedGame);
    });

    it("should not add powerless attribute from accursed wolf-father when actor is not powerless on werewolves side.", () => {
      const actorRole = createFakePlayerRole({
        original: RoleNames.ACTOR,
        current: RoleNames.WEREWOLF,
        isRevealed: true,
      });
      const attributes = [
        createFakePowerlessByElderPlayerAttribute(),
        createFakePowerlessByActorPlayerAttribute(),
        createFakeContaminatedByRustySwordKnightPlayerAttribute(),
        createFakeActingByActorPlayerAttribute(),
      ];
      const actorPlayer = createFakeWerewolfAlivePlayer({ role: actorRole, attributes });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: false }) }) });
      const game = createFakeGame({ players: [actorPlayer], options });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakeActorAlivePlayer({
            ...actorPlayer,
            role: createFakePlayerRole({ ...actorPlayer.role, current: RoleNames.ACTOR, isRevealed: false }),
            attributes: [
              attributes[0],
              attributes[1],
              attributes[2],
            ],
          }),
        ],
      });
      const result = services.gamePhase["applyStartingNightActingPlayerOutcomes"](actorPlayer, game);

      expect(result).toStrictEqual<Game>(expectedGame);
    });

    it("should not add powerless attribute from accursed wolf-father when actor is powerless on werewolves side but on villagers side.", () => {
      const actorRole = createFakePlayerRole({
        original: RoleNames.ACTOR,
        current: RoleNames.VILLAGER,
        isRevealed: true,
      });
      const attributes = [
        createFakePowerlessByElderPlayerAttribute(),
        createFakePowerlessByActorPlayerAttribute(),
        createFakeContaminatedByRustySwordKnightPlayerAttribute(),
        createFakeActingByActorPlayerAttribute(),
      ];
      const actorPlayer = createFakeSeerAlivePlayer({ role: actorRole, attributes });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: true }) }) });
      const game = createFakeGame({ players: [actorPlayer], options });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakeActorAlivePlayer({
            ...actorPlayer,
            role: createFakePlayerRole({ ...actorPlayer.role, current: RoleNames.ACTOR, isRevealed: false }),
            attributes: [
              attributes[0],
              attributes[1],
              attributes[2],
            ],
          }),
        ],
      });
      const result = services.gamePhase["applyStartingNightActingPlayerOutcomes"](actorPlayer, game);

      expect(result).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyStartingNightPlayerAttributesOutcomes", () => {
    beforeEach(() => {
      mocks.gamePhaseService.applyStartingNightActingPlayerOutcomes = jest.spyOn(services.gamePhase as unknown as { applyStartingNightActingPlayerOutcomes }, "applyStartingNightActingPlayerOutcomes").mockImplementation();
    });

    it("should not call applyStartingNightActingPlayerOutcomes when player doesn't have acting attribute.", () => {
      const player = createFakeWerewolfAlivePlayer();
      const game = createFakeGame({ players: [player] });
      services.gamePhase["applyStartingNightPlayerAttributesOutcomes"](game);

      expect(mocks.gamePhaseService.applyStartingNightActingPlayerOutcomes).not.toHaveBeenCalled();
    });

    it("should call applyStartingNightActingPlayerOutcomes when player has acting attribute.", () => {
      const actorPlayer = createFakeActorAlivePlayer({ attributes: [createFakeActingByActorPlayerAttribute()] });
      const game = createFakeGame({ players: [actorPlayer] });
      services.gamePhase["applyStartingNightPlayerAttributesOutcomes"](game);

      expect(mocks.gamePhaseService.applyStartingNightActingPlayerOutcomes).toHaveBeenCalledExactlyOnceWith(actorPlayer, game);
    });
  });
});