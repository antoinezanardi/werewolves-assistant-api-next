import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import * as GameHelper from "@/modules/game/helpers/game.helpers";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { PlayerKillerService } from "@/modules/game/providers/services/player/player-killer.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import type { PlayerDeath } from "@/modules/game/schemas/player/player-death/player-death.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { PlayerDeathCause } from "@/modules/game/types/player/player-death/player-death.types";
import { RoleSides } from "@/modules/role/enums/role.enum";

import { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enum";
import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";
import { UnexpectedException } from "@/shared/exception/types/unexpected-exception.types";

import { createFakeGameHistoryRecord, createFakeGameHistoryRecordDefenderProtectPlay, createFakeGameHistoryRecordPlayTarget, createFakeGameHistoryRecordWerewolvesEatPlay, createFakeGameHistoryRecordWitchUsePotionsPlay } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeActorGameOptions, createFakeBigBadWolfGameOptions, createFakeElderGameOptions, createFakeIdiotGameOptions, createFakeLittleGirlGameOptions, createFakeRolesGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options/game-roles-options.schema.factory";
import { createFakeGamePlayHunterShoots, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySheriffDelegates, createFakeGamePlaySurvivorsBuryDeadBodies } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCantVoteBySurvivorsPlayerAttribute, createFakeContaminatedByRustySwordKnightPlayerAttribute, createFakeDrankLifePotionByWitchPlayerAttribute, createFakeEatenByWerewolvesPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakePowerlessByActorPlayerAttribute, createFakePowerlessByElderPlayerAttribute, createFakePowerlessByWerewolvesPlayerAttribute, createFakeProtectedByDefenderPlayerAttribute, createFakeScandalmongerMarkedByScandalmongerPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute, createFakeWorshipedByWildChildPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayerBrokenHeartByCupidDeath, createFakePlayerDeathPotionByWitchDeath, createFakePlayerEatenByWerewolvesDeath, createFakePlayerReconsiderPardonBySurvivorsDeath, createFakePlayerVoteBySurvivorsDeath, createFakePlayerVoteScapegoatedBySurvivorsDeath } from "@tests/factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeBigBadWolfAlivePlayer, createFakeDefenderAlivePlayer, createFakeElderAlivePlayer, createFakeHunterAlivePlayer, createFakeIdiotAlivePlayer, createFakeLittleGirlAlivePlayer, createFakeRustySwordKnightAlivePlayer, createFakeScapegoatAlivePlayer, createFakeSeerAlivePlayer, createFakeVillagerVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer, createFakePlayerRole, createFakePlayerSide } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Player Killer Service", () => {
  let mocks: {
    playerKillerService: {
      getPlayerToKillOrRevealInGame: jest.SpyInstance;
      isPlayerKillable: jest.SpyInstance;
      doesPlayerRoleMustBeRevealed: jest.SpyInstance;
      removePlayerAttributesAfterDeath: jest.SpyInstance;
      revealPlayerRole: jest.SpyInstance;
      killPlayer: jest.SpyInstance;
      applySheriffPlayerDeathOutcomes: jest.SpyInstance;
      applyInLovePlayerDeathOutcomes: jest.SpyInstance;
      applyWorshipedPlayerDeathOutcomes: jest.SpyInstance;
      applyHunterDeathOutcomes: jest.SpyInstance;
      applyElderDeathOutcomes: jest.SpyInstance;
      applyScapegoatDeathOutcomes: jest.SpyInstance;
      applyRustySwordKnightDeathOutcomes: jest.SpyInstance;
      applyPlayerRoleRevelationOutcomes: jest.SpyInstance;
      applyPlayerDeathOutcomes: jest.SpyInstance;
      applyPlayerSideDeathOutcomes: jest.SpyInstance;
      applyPlayerRoleDeathOutcomes: jest.SpyInstance;
      applyPlayerAttributesDeathOutcomes: jest.SpyInstance;
      getElderLivesCountAgainstWerewolves: jest.SpyInstance;
      isElderKillable: jest.SpyInstance;
      isIdiotKillable: jest.SpyInstance;
      canPlayerBeEaten: jest.SpyInstance;
    };
    gameHistoryRecordService: {
      getGameHistoryWerewolvesEatElderRecords: jest.SpyInstance;
      getGameHistoryElderProtectedFromWerewolvesRecords: jest.SpyInstance;
    };
    gameHelper: {
      getPlayerWithIdOrThrow: jest.SpyInstance;
      doesGameHaveCurrentOrUpcomingPlaySourceAndAction: jest.SpyInstance;
    };
    unexpectedExceptionFactory: {
      createCantFindPlayerWithIdUnexpectedException: jest.SpyInstance;
      createPlayerIsDeadUnexpectedException: jest.SpyInstance;
    };
  };
  let services: { playerKiller: PlayerKillerService };

  beforeEach(async() => {
    mocks = {
      playerKillerService: {
        getPlayerToKillOrRevealInGame: jest.fn(),
        isPlayerKillable: jest.fn(),
        doesPlayerRoleMustBeRevealed: jest.fn(),
        removePlayerAttributesAfterDeath: jest.fn(),
        revealPlayerRole: jest.fn(),
        killPlayer: jest.fn(),
        applySheriffPlayerDeathOutcomes: jest.fn(),
        applyInLovePlayerDeathOutcomes: jest.fn(),
        applyWorshipedPlayerDeathOutcomes: jest.fn(),
        applyHunterDeathOutcomes: jest.fn(),
        applyElderDeathOutcomes: jest.fn(),
        applyScapegoatDeathOutcomes: jest.fn(),
        applyRustySwordKnightDeathOutcomes: jest.fn(),
        applyPlayerRoleRevelationOutcomes: jest.fn(),
        applyPlayerDeathOutcomes: jest.fn(),
        applyPlayerSideDeathOutcomes: jest.fn(),
        applyPlayerRoleDeathOutcomes: jest.fn(),
        applyPlayerAttributesDeathOutcomes: jest.fn(),
        getElderLivesCountAgainstWerewolves: jest.fn(),
        isElderKillable: jest.fn(),
        isIdiotKillable: jest.fn(),
        canPlayerBeEaten: jest.fn(),
      },
      gameHistoryRecordService: {
        getGameHistoryWerewolvesEatElderRecords: jest.fn(),
        getGameHistoryElderProtectedFromWerewolvesRecords: jest.fn(),
      },
      gameHelper: {
        getPlayerWithIdOrThrow: jest.spyOn(GameHelper, "getPlayerWithIdOrThrow").mockImplementation(),
        doesGameHaveCurrentOrUpcomingPlaySourceAndAction: jest.spyOn(GameHelper, "doesGameHaveCurrentOrUpcomingPlaySourceAndAction").mockImplementation(),
      },
      unexpectedExceptionFactory: {
        createCantFindPlayerWithIdUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createCantFindPlayerWithIdUnexpectedException").mockImplementation(),
        createPlayerIsDeadUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createPlayerIsDeadUnexpectedException").mockImplementation(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GameHistoryRecordService,
          useValue: mocks.gameHistoryRecordService,
        },
        PlayerKillerService,
      ],
    }).compile();

    services = { playerKiller: module.get<PlayerKillerService>(PlayerKillerService) };
  });

  describe("killOrRevealPlayer", () => {
    beforeEach(() => {
      mocks.playerKillerService.getPlayerToKillOrRevealInGame = jest.spyOn(services.playerKiller as unknown as { getPlayerToKillOrRevealInGame }, "getPlayerToKillOrRevealInGame");
      mocks.playerKillerService.isPlayerKillable = jest.spyOn(services.playerKiller as unknown as { isPlayerKillable }, "isPlayerKillable");
      mocks.playerKillerService.killPlayer = jest.spyOn(services.playerKiller as unknown as { killPlayer }, "killPlayer");
      mocks.playerKillerService.doesPlayerRoleMustBeRevealed = jest.spyOn(services.playerKiller as unknown as { doesPlayerRoleMustBeRevealed }, "doesPlayerRoleMustBeRevealed");
      mocks.playerKillerService.revealPlayerRole = jest.spyOn(services.playerKiller as unknown as { revealPlayerRole }, "revealPlayerRole");
    });

    it("should return game as is when player can't be revealed or killed.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerDeathPotionByWitchDeath();

      mocks.playerKillerService.getPlayerToKillOrRevealInGame.mockReturnValue(players[0]);
      mocks.playerKillerService.isPlayerKillable.mockReturnValue(false);
      mocks.playerKillerService.doesPlayerRoleMustBeRevealed.mockReturnValue(false);

      await expect(services.playerKiller.killOrRevealPlayer(players[0]._id, game, death)).resolves.toStrictEqual<Game>(game);
      expect(mocks.playerKillerService.killPlayer).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.revealPlayerRole).not.toHaveBeenCalled();
    });

    it("should call kill method when player is killable.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerDeathPotionByWitchDeath();

      mocks.gameHelper.getPlayerWithIdOrThrow.mockReturnValue(players[0]);
      mocks.playerKillerService.getPlayerToKillOrRevealInGame.mockReturnValue(players[0]);
      mocks.playerKillerService.isPlayerKillable.mockReturnValue(true);
      mocks.playerKillerService.doesPlayerRoleMustBeRevealed.mockReturnValue(true);

      await services.playerKiller.killOrRevealPlayer(players[0]._id, game, death);
      expect(mocks.playerKillerService.killPlayer).toHaveBeenCalledExactlyOnceWith(players[0], game, death);
    });

    it("should call reveal role method when player role must be revealed but not killed.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerDeathPotionByWitchDeath();

      mocks.playerKillerService.getPlayerToKillOrRevealInGame.mockReturnValue(players[0]);
      mocks.gameHelper.getPlayerWithIdOrThrow.mockReturnValue(players[0]);
      mocks.playerKillerService.isPlayerKillable.mockReturnValue(false);
      mocks.playerKillerService.doesPlayerRoleMustBeRevealed.mockReturnValue(true);

      await services.playerKiller.killOrRevealPlayer(players[0]._id, game, death);
      expect(mocks.playerKillerService.killPlayer).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.revealPlayerRole).toHaveBeenCalledExactlyOnceWith(players[0], game);
    });
  });

  describe("applyPlayerDeathOutcomes", () => {
    beforeEach(() => {
      mocks.playerKillerService.applyPlayerRoleDeathOutcomes = jest.spyOn(services.playerKiller as unknown as { applyPlayerRoleDeathOutcomes }, "applyPlayerRoleDeathOutcomes").mockImplementation();
      mocks.playerKillerService.applyPlayerSideDeathOutcomes = jest.spyOn(services.playerKiller as unknown as { applyPlayerSideDeathOutcomes }, "applyPlayerSideDeathOutcomes").mockImplementation();
      mocks.playerKillerService.applyPlayerAttributesDeathOutcomes = jest.spyOn(services.playerKiller as unknown as { applyPlayerAttributesDeathOutcomes }, "applyPlayerAttributesDeathOutcomes").mockImplementation();
    });

    it("should create unexpected exception for later purposes when called.", () => {
      const death = createFakePlayerDeathPotionByWitchDeath();
      const players = [
        createFakeRustySwordKnightAlivePlayer({ isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const exception = new UnexpectedException("applyPlayerAttributesDeathOutcomes", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME, { gameId: game._id.toString(), playerId: players[0]._id.toString() });

      mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException.mockReturnValue(exception);
      mocks.gameHelper.getPlayerWithIdOrThrow.mockReturnValue(players[0]);
      mocks.gameHelper.doesGameHaveCurrentOrUpcomingPlaySourceAndAction.mockReturnValue(true);
      mocks.playerKillerService.applyPlayerRoleDeathOutcomes.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerSideDeathOutcomes.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerAttributesDeathOutcomes.mockReturnValue(game);
      services.playerKiller.applyPlayerDeathOutcomes(players[0] as DeadPlayer, game);

      expect(mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException).toHaveBeenCalledExactlyOnceWith("applyPlayerDeathOutcomes", { gameId: game._id, playerId: players[0]._id });
    });

    it("should apply player role death outcomes when called.", () => {
      const death = createFakePlayerDeathPotionByWitchDeath();
      const players = [
        createFakeRustySwordKnightAlivePlayer({ isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const exception = new UnexpectedException("applyPlayerAttributesDeathOutcomes", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME, { gameId: game._id.toString(), playerId: players[0]._id.toString() });

      mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException.mockReturnValue(exception);
      mocks.gameHelper.getPlayerWithIdOrThrow.mockReturnValue(players[0]);
      mocks.gameHelper.doesGameHaveCurrentOrUpcomingPlaySourceAndAction.mockReturnValue(true);
      mocks.playerKillerService.applyPlayerRoleDeathOutcomes.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerSideDeathOutcomes.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerAttributesDeathOutcomes.mockReturnValue(game);
      services.playerKiller.applyPlayerDeathOutcomes(players[0] as DeadPlayer, game);

      expect(mocks.playerKillerService.applyPlayerRoleDeathOutcomes).toHaveBeenCalledExactlyOnceWith(players[0], game);
    });

    it("should apply player side death outcomes when called.", () => {
      const death = createFakePlayerDeathPotionByWitchDeath();
      const players = [
        createFakeRustySwordKnightAlivePlayer({ isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const exception = new UnexpectedException("applyPlayerAttributesDeathOutcomes", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME, { gameId: game._id.toString(), playerId: players[0]._id.toString() });

      mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException.mockReturnValue(exception);
      mocks.gameHelper.getPlayerWithIdOrThrow.mockReturnValue(players[0]);
      mocks.gameHelper.doesGameHaveCurrentOrUpcomingPlaySourceAndAction.mockReturnValue(true);
      mocks.playerKillerService.applyPlayerRoleDeathOutcomes.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerSideDeathOutcomes.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerAttributesDeathOutcomes.mockReturnValue(game);
      services.playerKiller.applyPlayerDeathOutcomes(players[0] as DeadPlayer, game);

      expect(mocks.playerKillerService.applyPlayerSideDeathOutcomes).toHaveBeenCalledExactlyOnceWith(players[0], game);
    });

    it("should apply player attributes death outcomes when called.", () => {
      const death = createFakePlayerDeathPotionByWitchDeath();
      const players = [
        createFakeRustySwordKnightAlivePlayer({ isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const exception = new UnexpectedException("applyPlayerAttributesDeathOutcomes", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME, { gameId: game._id.toString(), playerId: players[0]._id.toString() });

      mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException.mockReturnValue(exception);
      mocks.gameHelper.getPlayerWithIdOrThrow.mockReturnValue(players[0]);
      mocks.gameHelper.doesGameHaveCurrentOrUpcomingPlaySourceAndAction.mockReturnValue(true);
      mocks.playerKillerService.applyPlayerRoleDeathOutcomes.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerSideDeathOutcomes.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerAttributesDeathOutcomes.mockReturnValue(game);
      services.playerKiller.applyPlayerDeathOutcomes(players[0] as DeadPlayer, game);

      expect(mocks.playerKillerService.applyPlayerAttributesDeathOutcomes).toHaveBeenCalledExactlyOnceWith(players[0], game);
    });

    it("should filter out player attributes which need to be removed after death when called.", () => {
      const death = createFakePlayerDeathPotionByWitchDeath();
      const players = [
        createFakeRustySwordKnightAlivePlayer({ isAlive: false, death, attributes: [createFakeScandalmongerMarkedByScandalmongerPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const exception = new UnexpectedException("applyPlayerAttributesDeathOutcomes", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME, { gameId: game._id.toString(), playerId: players[0]._id.toString() });

      mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException.mockReturnValue(exception);
      mocks.gameHelper.getPlayerWithIdOrThrow.mockReturnValue(players[0]);
      mocks.gameHelper.doesGameHaveCurrentOrUpcomingPlaySourceAndAction.mockReturnValue(true);
      mocks.playerKillerService.applyPlayerRoleDeathOutcomes.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerSideDeathOutcomes.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerAttributesDeathOutcomes.mockReturnValue(game);
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer({
            ...players[0],
            attributes: [],
          }),
          game.players[1],
          game.players[2],
          game.players[3],
        ],
      });

      expect(services.playerKiller.applyPlayerDeathOutcomes(players[0] as DeadPlayer, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("revealPlayerRole", () => {
    it("should create can't find player exception for later purposes when called.", () => {
      const players = [
        createFakeWildChildAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedInterpolations = { gameId: game._id, playerId: players[0]._id };
      mocks.gameHelper.getPlayerWithIdOrThrow.mockReturnValue(players[0]);
      services.playerKiller.revealPlayerRole(players[0], game);

      expect(mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException).toHaveBeenCalledExactlyOnceWith("revealPlayerRole", expectedInterpolations);
    });

    it("should reveal player role when called.", () => {
      const players = [
        createFakeWildChildAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer({
            ...players[0],
            role: createFakePlayerRole({ ...players[0].role, isRevealed: true }),
          }),
          game.players[1],
          game.players[2],
          game.players[3],
        ],
      });
      mocks.gameHelper.getPlayerWithIdOrThrow.mockReturnValue(players[0]);

      expect(services.playerKiller.revealPlayerRole(players[0], game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("getElderLivesCountAgainstWerewolves", () => {
    it("should get elder lives count against werewolves when called.", async() => {
      const livesCountAgainstWerewolves = 3;
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ elder: createFakeElderGameOptions({ livesCountAgainstWerewolves }) }) });
      const elderPlayer = createFakeElderAlivePlayer();
      const game = createFakeGame({ turn: 2, currentPlay: createFakeGamePlayHunterShoots(), options });
      mocks.gameHistoryRecordService.getGameHistoryWerewolvesEatElderRecords.mockResolvedValue([]);
      mocks.gameHistoryRecordService.getGameHistoryElderProtectedFromWerewolvesRecords.mockResolvedValue([]);
      await services.playerKiller["getElderLivesCountAgainstWerewolves"](game, elderPlayer);

      expect(mocks.gameHistoryRecordService.getGameHistoryWerewolvesEatElderRecords).toHaveBeenCalledExactlyOnceWith(game._id, elderPlayer._id);
    });

    it("should get elder protected from werewolves records when called.", async() => {
      const livesCountAgainstWerewolves = 3;
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ elder: createFakeElderGameOptions({ livesCountAgainstWerewolves }) }) });
      const elderPlayer = createFakeElderAlivePlayer();
      const game = createFakeGame({ turn: 2, currentPlay: createFakeGamePlayHunterShoots(), options });
      mocks.gameHistoryRecordService.getGameHistoryWerewolvesEatElderRecords.mockResolvedValue([]);
      mocks.gameHistoryRecordService.getGameHistoryElderProtectedFromWerewolvesRecords.mockResolvedValue([]);
      await services.playerKiller["getElderLivesCountAgainstWerewolves"](game, elderPlayer);

      expect(mocks.gameHistoryRecordService.getGameHistoryElderProtectedFromWerewolvesRecords).toHaveBeenCalledExactlyOnceWith(game._id, elderPlayer._id);
    });

    it("should return same amount of lives when no werewolves attack against elder.", async() => {
      const livesCountAgainstWerewolves = 3;
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ elder: createFakeElderGameOptions({ livesCountAgainstWerewolves }) }) });
      const elderPlayer = createFakeElderAlivePlayer();
      const game = createFakeGame({ turn: 2, currentPlay: createFakeGamePlayHunterShoots(), options });
      const gameHistoryRecordPlayElderTarget = createFakeGameHistoryRecordPlayTarget({ player: createFakeElderAlivePlayer() });
      const elderProtectedFromWerewolvesRecords = [
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordDefenderProtectPlay({ targets: [gameHistoryRecordPlayElderTarget] }),
          turn: 1,
        }),
      ];
      mocks.gameHistoryRecordService.getGameHistoryWerewolvesEatElderRecords.mockResolvedValue([]);
      mocks.gameHistoryRecordService.getGameHistoryElderProtectedFromWerewolvesRecords.mockResolvedValue(elderProtectedFromWerewolvesRecords);

      await expect(services.playerKiller["getElderLivesCountAgainstWerewolves"](game, elderPlayer)).resolves.toBe(3);
    });

    it("should return amount of lives minus one when werewolves attacked the elder on current turn.", async() => {
      const livesCountAgainstWerewolves = 3;
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ elder: createFakeElderGameOptions({ livesCountAgainstWerewolves }) }) });
      const elderPlayer = createFakeElderAlivePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()] });
      const game = createFakeGame({ turn: 2, currentPlay: createFakeGamePlayHunterShoots(), options });
      const gameHistoryRecordPlayElderTarget = createFakeGameHistoryRecordPlayTarget({ player: elderPlayer });
      const elderProtectedFromWerewolvesRecords = [
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordDefenderProtectPlay({ targets: [gameHistoryRecordPlayElderTarget] }),
          turn: 1,
        }),
      ];
      mocks.gameHistoryRecordService.getGameHistoryWerewolvesEatElderRecords.mockResolvedValue([]);
      mocks.gameHistoryRecordService.getGameHistoryElderProtectedFromWerewolvesRecords.mockResolvedValue(elderProtectedFromWerewolvesRecords);

      await expect(services.playerKiller["getElderLivesCountAgainstWerewolves"](game, elderPlayer)).resolves.toBe(2);
    });

    it("should return amount of lives minus two when werewolves attacked the elder on current turn and also before that.", async() => {
      const livesCountAgainstWerewolves = 3;
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ elder: createFakeElderGameOptions({ livesCountAgainstWerewolves }) }) });
      const elderPlayer = createFakeElderAlivePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()] });
      const game = createFakeGame({ turn: 2, currentPlay: createFakeGamePlayHunterShoots(), options });
      const gameHistoryRecordPlayElderTarget = createFakeGameHistoryRecordPlayTarget({ player: elderPlayer });
      const werewolvesEatElderRecords = [
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [gameHistoryRecordPlayElderTarget] }),
          turn: 1,
        }),
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [gameHistoryRecordPlayElderTarget] }),
          turn: 2,
        }),
      ];
      mocks.gameHistoryRecordService.getGameHistoryWerewolvesEatElderRecords.mockResolvedValue(werewolvesEatElderRecords);
      mocks.gameHistoryRecordService.getGameHistoryElderProtectedFromWerewolvesRecords.mockResolvedValue([]);

      await expect(services.playerKiller["getElderLivesCountAgainstWerewolves"](game, elderPlayer)).resolves.toBe(1);
    });

    it("should return amount of lives minus one when elder was attacked three times but protected once and saved by witch once.", async() => {
      const livesCountAgainstWerewolves = 3;
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ elder: createFakeElderGameOptions({ livesCountAgainstWerewolves }) }) });
      const elderPlayer = createFakeElderAlivePlayer();
      const game = createFakeGame({ turn: 4, currentPlay: createFakeGamePlayHunterShoots(), options });
      const gameHistoryRecordPlayElderTarget = createFakeGameHistoryRecordPlayTarget({ player: createFakeElderAlivePlayer() });
      const gameHistoryRecordPlayElderDrankLifePotionTarget = createFakeGameHistoryRecordPlayTarget({ ...gameHistoryRecordPlayElderTarget, drankPotion: "life" });
      const werewolvesEatElderRecords = [
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [gameHistoryRecordPlayElderTarget] }),
          turn: 1,
        }),
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [gameHistoryRecordPlayElderTarget] }),
          turn: 2,
        }),
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [gameHistoryRecordPlayElderTarget] }),
          turn: 3,
        }),
      ];
      const elderProtectedFromWerewolvesRecords = [
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordDefenderProtectPlay({ targets: [gameHistoryRecordPlayElderTarget] }),
          turn: 1,
        }),
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: [gameHistoryRecordPlayElderDrankLifePotionTarget] }),
          turn: 2,
        }),
      ];
      mocks.gameHistoryRecordService.getGameHistoryWerewolvesEatElderRecords.mockResolvedValue(werewolvesEatElderRecords);
      mocks.gameHistoryRecordService.getGameHistoryElderProtectedFromWerewolvesRecords.mockResolvedValue(elderProtectedFromWerewolvesRecords);

      await expect(services.playerKiller["getElderLivesCountAgainstWerewolves"](game, elderPlayer)).resolves.toBe(2);
    });

    it("should return amount of lives minus 1 when elder was attacked but not protected or saved by witch.", async() => {
      const livesCountAgainstWerewolves = 3;
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ elder: createFakeElderGameOptions({ livesCountAgainstWerewolves }) }) });
      const elderPlayer = createFakeElderAlivePlayer();
      const game = createFakeGame({ turn: 2, currentPlay: createFakeGamePlayHunterShoots(), options });
      const gameHistoryRecordPlayElderTarget = createFakeGameHistoryRecordPlayTarget({ player: createFakeElderAlivePlayer() });
      const werewolvesEatElderRecords = [
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [gameHistoryRecordPlayElderTarget] }),
          turn: 1,
        }),
      ];
      mocks.gameHistoryRecordService.getGameHistoryWerewolvesEatElderRecords.mockResolvedValue(werewolvesEatElderRecords);
      mocks.gameHistoryRecordService.getGameHistoryElderProtectedFromWerewolvesRecords.mockResolvedValue([]);

      await expect(services.playerKiller["getElderLivesCountAgainstWerewolves"](game, elderPlayer)).resolves.toBe(2);
    });
  });

  describe("applyPlayerRoleRevelationOutcomes", () => {
    it("should add can't vote attribute when player is idiot.", () => {
      const players = [
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer({
            ...players[0],
            attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()],
          }),
          game.players[1],
          game.players[2],
          game.players[3],
        ],
      });

      expect(services.playerKiller["applyPlayerRoleRevelationOutcomes"](game.players[0], game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return the game as is when player is not an idiot.", () => {
      const players = [
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyPlayerRoleRevelationOutcomes"](game.players[1], game)).toStrictEqual<Game>(game);
    });
  });

  describe("isElderKillable", () => {
    beforeEach(() => {
      mocks.playerKillerService.getElderLivesCountAgainstWerewolves = jest.spyOn(services.playerKiller as unknown as { getElderLivesCountAgainstWerewolves }, "getElderLivesCountAgainstWerewolves").mockImplementation();
    });

    it.each<{
      test: string;
      elderPlayer: Player;
      cause: PlayerDeathCause;
      getElderLivesCountAgainstWerewolvesMockReturnValue: number;
      expected: boolean;
    }>([
      {
        test: "should return true when cause is not EATEN.",
        elderPlayer: createFakeElderAlivePlayer(),
        cause: "vote",
        getElderLivesCountAgainstWerewolvesMockReturnValue: 2,
        expected: true,
      },
      {
        test: "should return false when cause is EATEN but elder still have at least one life left.",
        elderPlayer: createFakeElderAlivePlayer(),
        cause: "eaten",
        getElderLivesCountAgainstWerewolvesMockReturnValue: 2,
        expected: false,
      },
      {
        test: "should return true when cause is EATEN but elder has 0 life left.",
        elderPlayer: createFakeElderAlivePlayer(),
        cause: "eaten",
        getElderLivesCountAgainstWerewolvesMockReturnValue: 0,
        expected: true,
      },
    ])("$test", async({ elderPlayer, cause, getElderLivesCountAgainstWerewolvesMockReturnValue, expected }) => {
      const game = createFakeGame();
      mocks.playerKillerService.getElderLivesCountAgainstWerewolves.mockReturnValue(getElderLivesCountAgainstWerewolvesMockReturnValue);

      await expect(services.playerKiller.isElderKillable(game, elderPlayer, cause)).resolves.toBe(expected);
    });
  });

  describe("doesPlayerRoleMustBeRevealed", () => {
    it.each<{
      test: string;
      player: Player;
      death: PlayerDeath;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when player role is already revealed.",
        player: createFakeVillagerVillagerAlivePlayer(),
        death: createFakePlayerVoteBySurvivorsDeath(),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when player is dead but options doesn't allow the role to be revealed.",
        player: createFakeWitchAlivePlayer(),
        death: createFakePlayerVoteBySurvivorsDeath(),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ areRevealedOnDeath: false }) }) }),
        expected: false,
      },
      {
        test: "should return false when player role is not idiot.",
        player: createFakeSeerAlivePlayer(),
        death: createFakePlayerVoteBySurvivorsDeath(),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when player role is idiot but powerless.",
        player: createFakeIdiotAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
        death: createFakePlayerVoteBySurvivorsDeath(),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when player role is idiot but death cause is not vote.",
        player: createFakeIdiotAlivePlayer(),
        death: createFakePlayerDeathPotionByWitchDeath(),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when player is not dead and his role can be revealed to others.",
        player: createFakeWitchAlivePlayer(),
        death: createFakePlayerVoteBySurvivorsDeath(),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ areRevealedOnDeath: true }) }) }),
        expected: false,
      },
      {
        test: "should return true when player is dead and his role can be revealed to others.",
        player: createFakeWitchAlivePlayer({ isAlive: false }),
        death: createFakePlayerVoteBySurvivorsDeath(),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ areRevealedOnDeath: true }) }) }),
        expected: true,
      },
      {
        test: "should return true when player role is idiot and death cause is vote.",
        player: createFakeIdiotAlivePlayer(),
        death: createFakePlayerVoteBySurvivorsDeath(),
        game: createFakeGame(),
        expected: true,
      },
    ])("$test", ({ player, death, game, expected }) => {
      expect(services.playerKiller["doesPlayerRoleMustBeRevealed"](player, death, game)).toBe(expected);
    });
  });

  describe("removePlayerAttributesAfterDeath", () => {
    it("should remove player attributes which need to be removed after death when called.", () => {
      const player = createFakePlayer({
        isAlive: false,
        attributes: [
          createFakeCantVoteBySurvivorsPlayerAttribute({ doesRemainAfterDeath: false }),
          createFakePowerlessByElderPlayerAttribute(),
          createFakeSheriffBySurvivorsPlayerAttribute({ doesRemainAfterDeath: true }),
        ],
      });
      const expectedPlayer = createFakePlayer({
        ...player,
        attributes: [
          player.attributes[1],
          player.attributes[2],
        ],
      });

      expect(services.playerKiller["removePlayerAttributesAfterDeath"](player)).toStrictEqual<Player>(expectedPlayer);
    });
  });

  describe("isIdiotKillable", () => {
    it.each<{
      test: string;
      player: Player;
      cause: PlayerDeathCause;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return true when idiot is already revealed.",
        player: createFakeIdiotAlivePlayer({ role: createFakePlayerRole({ isRevealed: true }) }),
        cause: "vote",
        game: createFakeGame(),
        expected: true,
      },
      {
        test: "should return true when idiot is killed by other cause than a vote.",
        player: createFakeIdiotAlivePlayer(),
        cause: "death-potion",
        game: createFakeGame(),
        expected: true,
      },
      {
        test: "should return true when idiot is killed by vote but powerless.",
        player: createFakeIdiotAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
        cause: "vote",
        game: createFakeGame(),
        expected: true,
      },
      {
        test: "should return false when idiot is not revealed, dies from votes and is not powerless.",
        player: createFakeIdiotAlivePlayer(),
        cause: "vote",
        game: createFakeGame(),
        expected: false,
      },
    ])("$test", ({ player, cause, game, expected }) => {
      expect(services.playerKiller["isIdiotKillable"](player, cause, game)).toBe(expected);
    });
  });

  describe("canPlayerBeEaten", () => {
    it.each<{
      test: string;
      player: Player;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when player is saved by the witch.",
        player: createFakeSeerAlivePlayer({ attributes: [createFakeDrankLifePotionByWitchPlayerAttribute()] }),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return false when player is protected by defender and is not little girl.",
        player: createFakeSeerAlivePlayer({ attributes: [createFakeProtectedByDefenderPlayerAttribute()] }),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ littleGirl: createFakeLittleGirlGameOptions({ isProtectedByDefender: true }) }) }) }),
        expected: false,
      },
      {
        test: "should return false when player is protected by defender, is little girl but game options allows defender to protect her.",
        player: createFakeLittleGirlAlivePlayer({ attributes: [createFakeProtectedByDefenderPlayerAttribute()] }),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ littleGirl: createFakeLittleGirlGameOptions({ isProtectedByDefender: true }) }) }) }),
        expected: false,
      },
      {
        test: "should return true when player is protected by defender, is little girl but game options doesn't allow defender to protect her.",
        player: createFakeLittleGirlAlivePlayer({ attributes: [createFakeProtectedByDefenderPlayerAttribute()] }),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ littleGirl: createFakeLittleGirlGameOptions({ isProtectedByDefender: false }) }) }) }),
        expected: true,
      },
      {
        test: "should return false when little girl is saved by the witch.",
        player: createFakeLittleGirlAlivePlayer({ attributes: [createFakeDrankLifePotionByWitchPlayerAttribute()] }),
        game: createFakeGame(),
        expected: false,
      },
      {
        test: "should return true when player defenseless.",
        player: createFakeSeerAlivePlayer({ attributes: [] }),
        game: createFakeGame({ options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ littleGirl: createFakeLittleGirlGameOptions({ isProtectedByDefender: true }) }) }) }),
        expected: true,
      },
    ])("$test", ({ player, game, expected }) => {
      expect(services.playerKiller["canPlayerBeEaten"](player, game)).toBe(expected);
    });

    it("should return false when player is protected by defender and is not little girl.", () => {
      const player = createFakeSeerAlivePlayer({ attributes: [createFakeProtectedByDefenderPlayerAttribute()] });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ littleGirl: createFakeLittleGirlGameOptions({ isProtectedByDefender: false }) }) });
      const game = createFakeGame({ options });

      expect(services.playerKiller["canPlayerBeEaten"](player, game)).toBe(false);
    });
  });

  describe("isPlayerKillable", () => {
    beforeEach(() => {
      mocks.playerKillerService.isIdiotKillable = jest.spyOn(services.playerKiller as unknown as { isIdiotKillable }, "isIdiotKillable").mockImplementation();
      mocks.playerKillerService.isElderKillable = jest.spyOn(services.playerKiller as unknown as { isElderKillable }, "isElderKillable").mockImplementation();
      mocks.playerKillerService.canPlayerBeEaten = jest.spyOn(services.playerKiller as unknown as { canPlayerBeEaten }, "canPlayerBeEaten").mockImplementation();
    });

    it("should return false when cause is EATEN and player can't be eaten.", async() => {
      const player = createFakePlayer();
      const game = createFakeGame();
      mocks.playerKillerService.canPlayerBeEaten.mockReturnValue(false);

      await expect(services.playerKiller["isPlayerKillable"](player, game, "eaten")).resolves.toBe(false);
    });

    it("should not call can player be eaten validator when cause is not EATEN.", async() => {
      const player = createFakePlayer();
      const game = createFakeGame();
      mocks.playerKillerService.canPlayerBeEaten.mockReturnValue(false);
      await services.playerKiller["isPlayerKillable"](player, game, "vote");

      expect(mocks.playerKillerService.canPlayerBeEaten).not.toHaveBeenCalled();
    });

    it("should call is idiot killable when player is an idiot.", async() => {
      const player = createFakeIdiotAlivePlayer();
      const game = createFakeGame();
      mocks.playerKillerService.isIdiotKillable.mockReturnValue(false);
      await services.playerKiller["isPlayerKillable"](player, game, "vote");

      expect(mocks.playerKillerService.isIdiotKillable).toHaveBeenCalledExactlyOnceWith(player, "vote", game);
    });

    it("should not call is idiot killable when player is not an idiot.", async() => {
      const player = createFakeSeerAlivePlayer();
      const game = createFakeGame();
      mocks.playerKillerService.isIdiotKillable.mockReturnValue(false);
      await services.playerKiller["isPlayerKillable"](player, game, "vote");

      expect(mocks.playerKillerService.isIdiotKillable).not.toHaveBeenCalled();
    });

    it("should call is elder killable when player is an elder.", async() => {
      const player = createFakeElderAlivePlayer();
      const game = createFakeGame();
      mocks.playerKillerService.isElderKillable.mockReturnValue(false);
      await services.playerKiller["isPlayerKillable"](player, game, "vote");

      expect(mocks.playerKillerService.isElderKillable).toHaveBeenCalledExactlyOnceWith(game, player, "vote");
    });

    it("should not call is elder killable when player is not an elder.", async() => {
      const player = createFakeSeerAlivePlayer();
      const game = createFakeGame();
      mocks.playerKillerService.isElderKillable.mockReturnValue(false);
      await services.playerKiller["isPlayerKillable"](player, game, "vote");

      expect(mocks.playerKillerService.isElderKillable).not.toHaveBeenCalled();
    });

    it("should return true when there are no contraindications.", async() => {
      const player = createFakeSeerAlivePlayer();
      const game = createFakeGame();

      await expect(services.playerKiller["isPlayerKillable"](player, game, "vote")).resolves.toBe(true);
    });
  });

  describe("applyWorshipedPlayerDeathOutcomes", () => {
    it("should return game as is when killed player doesn't have the worshiped attribute.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWildChildAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer({ attributes: [createFakeWorshipedByWildChildPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyWorshipedPlayerDeathOutcomes"](players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when there is no wild child player.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeWorshipedByWildChildPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyWorshipedPlayerDeathOutcomes"](players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when wild child player is dead.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeWorshipedByWildChildPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWildChildAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyWorshipedPlayerDeathOutcomes"](players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when wild child player is powerless.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeWorshipedByWildChildPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWildChildAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyWorshipedPlayerDeathOutcomes"](players[0], game)).toStrictEqual<Game>(game);
    });

    it("should transform wild child to a werewolf sided player when called.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeWorshipedByWildChildPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          game.players[0],
          game.players[1],
          game.players[2],
          createFakePlayer({
            ...game.players[3],
            side: createFakePlayerSide({ ...game.players[3].side, current: RoleSides.WEREWOLVES }),
          }),
        ],
      });

      expect(services.playerKiller["applyWorshipedPlayerDeathOutcomes"](players[0], game)).toStrictEqual<Game>(expectedGame);
    });

    it("should transform wild child to a werewolf sided player and add powerless attribute when wild child is actor in disguise.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeWorshipedByWildChildPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWildChildAlivePlayer({
          role: createFakePlayerRole({ original: "actor", current: "wild-child" }),
          attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()],
        }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: true }) }) });
      const game = createFakeGame({ players, options });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          game.players[0],
          game.players[1],
          game.players[2],
          createFakePlayer({
            ...game.players[3],
            side: createFakePlayerSide({ ...game.players[3].side, current: RoleSides.WEREWOLVES }),
            attributes: [...game.players[3].attributes, createFakePowerlessByActorPlayerAttribute()],
          }),
        ],
      });

      expect(services.playerKiller["applyWorshipedPlayerDeathOutcomes"](players[0], game)).toStrictEqual<Game>(expectedGame);
    });

    it("should transform wild child to a werewolf sided player but without powerless attribute when wild child is actor in disguise and game options are changed.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeWorshipedByWildChildPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWildChildAlivePlayer({
          role: createFakePlayerRole({ original: "actor", current: "wild-child" }),
          attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()],
        }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: false }) }) });
      const game = createFakeGame({ players, options });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          game.players[0],
          game.players[1],
          game.players[2],
          createFakePlayer({
            ...game.players[3],
            side: createFakePlayerSide({ ...game.players[3].side, current: RoleSides.WEREWOLVES }),
            attributes: [...game.players[3].attributes],
          }),
        ],
      });

      expect(services.playerKiller["applyWorshipedPlayerDeathOutcomes"](players[0], game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyInLovePlayerDeathOutcomes", () => {
    beforeEach(() => {
      mocks.playerKillerService.killPlayer = jest.spyOn(services.playerKiller as unknown as { killPlayer }, "killPlayer").mockImplementation();
    });

    it("should return game as is when killed player doesn't have the in love attribute.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyInLovePlayerDeathOutcomes"](players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when the other lover is not found because no other one has the in love attribute.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyInLovePlayerDeathOutcomes"](players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when the other lover is not found because he is dead.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()], isAlive: false }),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyInLovePlayerDeathOutcomes"](players[0], game)).toStrictEqual<Game>(game);
    });

    it("should kill the other lover when called.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      services.playerKiller["applyInLovePlayerDeathOutcomes"](players[1], game);

      expect(mocks.playerKillerService.killPlayer).toHaveBeenCalledExactlyOnceWith(players[0], game, createFakePlayerBrokenHeartByCupidDeath());
    });
  });

  describe("applySheriffPlayerDeathOutcomes", () => {
    it("should return game as is when player is not the sheriff.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applySheriffPlayerDeathOutcomes"](players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when player is idiot and not powerless.", () => {
      const players = [
        createFakeIdiotAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applySheriffPlayerDeathOutcomes"](players[0], game)).toStrictEqual<Game>(game);
    });

    it("should prepend sheriff election game play when called with powerless idiot.", () => {
      const players = [
        createFakeIdiotAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute(), createFakePowerlessByElderPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const upcomingPlays = [createFakeGamePlayHunterShoots()];
      const game = createFakeGame({ players, upcomingPlays });
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [createFakeGamePlaySheriffDelegates(), ...game.upcomingPlays],
      });

      expect(services.playerKiller["applySheriffPlayerDeathOutcomes"](players[0], game)).toStrictEqual<Game>(expectedGame);
    });

    it("should prepend sheriff election game play when called with any other role.", () => {
      const players = [
        createFakeWildChildAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const upcomingPlays = [createFakeGamePlayHunterShoots()];
      const game = createFakeGame({ players, upcomingPlays });
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [createFakeGamePlaySheriffDelegates(), ...game.upcomingPlays],
      });

      expect(services.playerKiller["applySheriffPlayerDeathOutcomes"](players[0], game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyPlayerAttributesDeathOutcomes", () => {
    beforeEach(() => {
      mocks.playerKillerService.applySheriffPlayerDeathOutcomes = jest.spyOn(services.playerKiller as unknown as { applySheriffPlayerDeathOutcomes }, "applySheriffPlayerDeathOutcomes").mockImplementation();
      mocks.playerKillerService.applyInLovePlayerDeathOutcomes = jest.spyOn(services.playerKiller as unknown as { applyInLovePlayerDeathOutcomes }, "applyInLovePlayerDeathOutcomes").mockImplementation();
      mocks.playerKillerService.applyWorshipedPlayerDeathOutcomes = jest.spyOn(services.playerKiller as unknown as { applyWorshipedPlayerDeathOutcomes }, "applyWorshipedPlayerDeathOutcomes").mockImplementation();
      mocks.gameHelper.getPlayerWithIdOrThrow = jest.spyOn(GameHelper, "getPlayerWithIdOrThrow").mockImplementation();
    });

    it("should call no methods when player doesn't have the right attributes.", () => {
      const players = [
        createFakeIdiotAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      services.playerKiller["applyPlayerAttributesDeathOutcomes"](game.players[0], game);

      expect(mocks.playerKillerService.applySheriffPlayerDeathOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.applyInLovePlayerDeathOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.applyWorshipedPlayerDeathOutcomes).not.toHaveBeenCalled();
      expect(mocks.gameHelper.getPlayerWithIdOrThrow).not.toHaveBeenCalled();
    });

    it("should call survivors methods when player have all attributes.", () => {
      const players = [
        createFakeIdiotAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute(), createFakeInLoveByCupidPlayerAttribute(), createFakeWorshipedByWildChildPlayerAttribute()] }),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const interpolations = { gameId: game._id.toString(), playerId: players[2]._id.toString() };
      const exception = new UnexpectedException("applyPlayerAttributesDeathOutcomes", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME, interpolations);
      const expectedInterpolations = { gameId: game._id, playerId: players[2]._id };

      mocks.playerKillerService.applySheriffPlayerDeathOutcomes.mockReturnValue(game);
      mocks.playerKillerService.applyInLovePlayerDeathOutcomes.mockReturnValue(game);
      mocks.playerKillerService.applyWorshipedPlayerDeathOutcomes.mockReturnValue(game);
      mocks.gameHelper.getPlayerWithIdOrThrow.mockReturnValue(game.players[2]);
      mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException.mockReturnValue(exception);
      services.playerKiller["applyPlayerAttributesDeathOutcomes"](game.players[2], game);

      expect(mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException).toHaveBeenCalledExactlyOnceWith("applyPlayerAttributesDeathOutcomes", expectedInterpolations);
      expect(mocks.playerKillerService.applySheriffPlayerDeathOutcomes).toHaveBeenCalledExactlyOnceWith(game.players[2], game);
      expect(mocks.playerKillerService.applyInLovePlayerDeathOutcomes).toHaveBeenCalledExactlyOnceWith(game.players[2], game);
      expect(mocks.playerKillerService.applyWorshipedPlayerDeathOutcomes).toHaveBeenCalledExactlyOnceWith(game.players[2], game);
      expect(mocks.gameHelper.getPlayerWithIdOrThrow).toHaveBeenNthCalledWith(1, game.players[2]._id, game, exception);
      expect(mocks.gameHelper.getPlayerWithIdOrThrow).toHaveBeenNthCalledWith(2, game.players[2]._id, game, exception);
    });
  });

  describe("applyPlayerSideDeathOutcomes", () => {
    it("should return game as is when player is not a werewolf sided player.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ bigBadWolf: createFakeBigBadWolfGameOptions({ isPowerlessIfWerewolfDies: true }) }) });
      const game = createFakeGame({ players, options });

      expect(services.playerKiller["applyPlayerSideDeathOutcomes"](players[3], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when player is a werewolf sided player but there is no big bad wolf in the game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ bigBadWolf: createFakeBigBadWolfGameOptions({ isPowerlessIfWerewolfDies: true }) }) });
      const game = createFakeGame({ players, options });

      expect(services.playerKiller["applyPlayerSideDeathOutcomes"](players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when player is a werewolf sided player but game options say that big bad wolf is not powerless if one werewolf dies.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ bigBadWolf: createFakeBigBadWolfGameOptions({ isPowerlessIfWerewolfDies: false }) }) });
      const game = createFakeGame({ players, options });

      expect(services.playerKiller["applyPlayerSideDeathOutcomes"](players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when player is a werewolf sided player but killed player is big bad wolf himself.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ bigBadWolf: createFakeBigBadWolfGameOptions({ isPowerlessIfWerewolfDies: true }) }) });
      const game = createFakeGame({ players, options });

      expect(services.playerKiller["applyPlayerSideDeathOutcomes"](players[2], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when player is a werewolf sided player but big bad wolf is already powerless by werewolves.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeBigBadWolfAlivePlayer({ attributes: [createFakePowerlessByWerewolvesPlayerAttribute()] }),
        createFakeSeerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ bigBadWolf: createFakeBigBadWolfGameOptions({ isPowerlessIfWerewolfDies: true }) }) });
      const game = createFakeGame({ players, options });

      expect(services.playerKiller["applyPlayerSideDeathOutcomes"](players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game with powerless big bad wolf when killer player is werewolf sided and big bad wolf is not already powerless by werewolves.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ bigBadWolf: createFakeBigBadWolfGameOptions({ isPowerlessIfWerewolfDies: true }) }) });
      const game = createFakeGame({ players, options });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          players[1],
          createFakePlayer({
            ...players[2],
            attributes: [createFakePowerlessByWerewolvesPlayerAttribute()],
          }),
          players[3],
        ],
      });

      expect(services.playerKiller["applyPlayerSideDeathOutcomes"](players[0], game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyRustySwordKnightDeathOutcomes", () => {
    it("should return game as is when killed player is not rusty sword knight.", () => {
      const death = createFakePlayerEatenByWerewolvesDeath();
      const players = [
        createFakeIdiotAlivePlayer({ isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyRustySwordKnightDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when killed player is powerless.", () => {
      const death = createFakePlayerEatenByWerewolvesDeath();
      const players = [
        createFakeRustySwordKnightAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()], isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyRustySwordKnightDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when death cause is not eaten.", () => {
      const death = createFakePlayerVoteBySurvivorsDeath();
      const players = [
        createFakeRustySwordKnightAlivePlayer({ isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyRustySwordKnightDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when no left alive werewolf is found.", () => {
      const death = createFakePlayerEatenByWerewolvesDeath();
      const players = [
        createFakeRustySwordKnightAlivePlayer({ isAlive: false, death }),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyRustySwordKnightDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
    });

    it("should return game with first left alive werewolf player with contaminated attribute when called.", () => {
      const death = createFakePlayerEatenByWerewolvesDeath();
      const players = [
        createFakeRustySwordKnightAlivePlayer({ position: 1, isAlive: false, death }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeWerewolfAlivePlayer({ position: 3 }),
        createFakeDefenderAlivePlayer({ position: 4 }),
      ];
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          players[1],
          createFakePlayer({ ...players[2], attributes: [createFakeContaminatedByRustySwordKnightPlayerAttribute()] }),
          players[3],
        ],
      });

      expect(services.playerKiller["applyRustySwordKnightDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyScapegoatDeathOutcomes", () => {
    it("should return game as is when killed player is not scapegoat.", () => {
      const death = createFakePlayerVoteScapegoatedBySurvivorsDeath();
      const players = [
        createFakeIdiotAlivePlayer({ isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyScapegoatDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when killed player is powerless.", () => {
      const death = createFakePlayerVoteScapegoatedBySurvivorsDeath();
      const players = [
        createFakeScapegoatAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()], isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyScapegoatDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when killed player was not scapegoated.", () => {
      const death = createFakePlayerVoteBySurvivorsDeath();
      const players = [
        createFakeScapegoatAlivePlayer({ isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyScapegoatDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
    });

    it("should return game with upcoming scapegoat bans votes play when called.", () => {
      const death = createFakePlayerVoteScapegoatedBySurvivorsDeath();
      const players = [
        createFakeScapegoatAlivePlayer({ isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const upcomingPlays = [createFakeGamePlayHunterShoots()];
      const game = createFakeGame({ players, upcomingPlays });
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [createFakeGamePlayScapegoatBansVoting(), ...upcomingPlays],
      });

      expect(services.playerKiller["applyScapegoatDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyElderDeathOutcomes", () => {
    beforeEach(() => {
      mocks.playerKillerService.killPlayer = jest.spyOn(services.playerKiller as unknown as { killPlayer }, "killPlayer").mockImplementation();
    });

    it("should return game as is when killed player is not elder.", () => {
      const death = createFakePlayerVoteScapegoatedBySurvivorsDeath();
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false, death }),
        createFakeIdiotAlivePlayer({ role: createFakePlayerRole({ isRevealed: true, current: "idiot", original: "idiot" }) }),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const elderOptions = createFakeElderGameOptions({ doesTakeHisRevenge: true });
      const idiotOptions = createFakeIdiotGameOptions({ doesDieOnElderDeath: true });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ idiot: idiotOptions, elder: elderOptions }) });
      const game = createFakeGame({ players, options });

      expect(services.playerKiller["applyElderDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when killed player is powerless.", () => {
      const death = createFakePlayerVoteBySurvivorsDeath();
      const players = [
        createFakeElderAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()], isAlive: false, death }),
        createFakeIdiotAlivePlayer({ role: createFakePlayerRole({ isRevealed: true, current: "idiot", original: "idiot" }) }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const elderOptions = createFakeElderGameOptions({ doesTakeHisRevenge: true });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ elder: elderOptions }) });
      const game = createFakeGame({ players, options });

      expect(services.playerKiller["applyElderDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when elder doesn't take his revenge and idiot is not revealed.", () => {
      const death = createFakePlayerEatenByWerewolvesDeath();
      const players = [
        createFakeElderAlivePlayer({ isAlive: false, death }),
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyElderDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
    });

    it("should game as is when elder doesn't take his revenge from game options.", () => {
      const death = createFakePlayerDeathPotionByWitchDeath();
      const players = [
        createFakeElderAlivePlayer({ isAlive: false, death }),
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ elder: createFakeElderGameOptions({ doesTakeHisRevenge: false }) }) });
      const game = createFakeGame({ players, options });

      expect(services.playerKiller["applyElderDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
    });

    it("should return game with all villagers powerless when elder takes his revenge.", () => {
      const death = createFakePlayerDeathPotionByWitchDeath();
      const players = [
        createFakeElderAlivePlayer({ isAlive: false, death }),
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ elder: createFakeElderGameOptions({ doesTakeHisRevenge: true }) }) });
      const game = createFakeGame({ players, options });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          createFakePlayer({ ...players[1], attributes: [createFakePowerlessByElderPlayerAttribute()] }),
          players[2],
          createFakePlayer({ ...players[3], attributes: [createFakePowerlessByElderPlayerAttribute()] }),
          createFakePlayer(players[4]),
        ],
      });

      expect(services.playerKiller["applyElderDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when idiot was revealed before but doesn't die on elder death thanks to game options.", () => {
      const death = createFakePlayerDeathPotionByWitchDeath();
      const players = [
        createFakeElderAlivePlayer({ isAlive: false, death }),
        createFakeIdiotAlivePlayer({ role: createFakePlayerRole({ isRevealed: true, current: "idiot", original: "idiot" }) }),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const elderOptions = createFakeElderGameOptions({ doesTakeHisRevenge: false });
      const idiotOptions = createFakeIdiotGameOptions({ doesDieOnElderDeath: false });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ elder: elderOptions, idiot: idiotOptions }) });
      const game = createFakeGame({ players, options });

      expect(services.playerKiller["applyElderDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
      expect(mocks.playerKillerService.killPlayer).not.toHaveBeenCalled();
    });

    it("should return game with killed idiot when idiot was revealed before.", () => {
      const death = createFakePlayerDeathPotionByWitchDeath();
      const players = [
        createFakeElderAlivePlayer({ isAlive: false, death }),
        createFakeIdiotAlivePlayer({ role: createFakePlayerRole({ isRevealed: true, current: "idiot", original: "idiot" }) }),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const elderOptions = createFakeElderGameOptions({ doesTakeHisRevenge: false });
      const idiotOptions = createFakeIdiotGameOptions({ doesDieOnElderDeath: true });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ elder: elderOptions, idiot: idiotOptions }) });
      const game = createFakeGame({ players, options });
      services.playerKiller["applyElderDeathOutcomes"](players[0] as DeadPlayer, game);

      expect(mocks.playerKillerService.killPlayer).toHaveBeenCalledExactlyOnceWith(players[1], game, createFakePlayerReconsiderPardonBySurvivorsDeath());
    });
  });

  describe("applyHunterDeathOutcomes", () => {
    it("should return game as is when killed player is not hunter.", () => {
      const players = [
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyHunterDeathOutcomes"](players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when killed player powerless.", () => {
      const players = [
        createFakeHunterAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyHunterDeathOutcomes"](players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game with upcoming hunter shoots play when called.", () => {
      const players = [
        createFakeHunterAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const upcomingPlays = [createFakeGamePlayScapegoatBansVoting()];
      const game = createFakeGame({ players, upcomingPlays });
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [createFakeGamePlayHunterShoots(), ...upcomingPlays],
      });

      expect(services.playerKiller["applyHunterDeathOutcomes"](players[0], game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyPlayerRoleDeathOutcomes", () => {
    beforeEach(() => {
      mocks.playerKillerService.applyHunterDeathOutcomes = jest.spyOn(services.playerKiller as unknown as { applyHunterDeathOutcomes }, "applyHunterDeathOutcomes").mockImplementation();
      mocks.playerKillerService.applyElderDeathOutcomes = jest.spyOn(services.playerKiller as unknown as { applyElderDeathOutcomes }, "applyElderDeathOutcomes").mockImplementation();
      mocks.playerKillerService.applyScapegoatDeathOutcomes = jest.spyOn(services.playerKiller as unknown as { applyScapegoatDeathOutcomes }, "applyScapegoatDeathOutcomes").mockImplementation();
      mocks.playerKillerService.applyRustySwordKnightDeathOutcomes = jest.spyOn(services.playerKiller as unknown as { applyRustySwordKnightDeathOutcomes }, "applyRustySwordKnightDeathOutcomes").mockImplementation();
    });

    it("should return game as is without calling role method outcomes when killed player doesn't have the right role.", () => {
      const death = createFakePlayerDeathPotionByWitchDeath();
      const players = [
        createFakeWerewolfAlivePlayer({ isAlive: false, death }),
        createFakeHunterAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(services.playerKiller["applyPlayerRoleDeathOutcomes"](players[0] as DeadPlayer, game)).toStrictEqual<Game>(game);
      expect(mocks.playerKillerService.applyHunterDeathOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.applyElderDeathOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.applyScapegoatDeathOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.applyRustySwordKnightDeathOutcomes).not.toHaveBeenCalled();
    });

    it("should call killed hunter outcomes method when killed player is hunter.", () => {
      const death = createFakePlayerDeathPotionByWitchDeath();
      const players = [
        createFakeHunterAlivePlayer({ isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      services.playerKiller["applyPlayerRoleDeathOutcomes"](players[0] as DeadPlayer, game);

      expect(mocks.playerKillerService.applyHunterDeathOutcomes).toHaveBeenCalledExactlyOnceWith(players[0], game);
      expect(mocks.playerKillerService.applyElderDeathOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.applyScapegoatDeathOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.applyRustySwordKnightDeathOutcomes).not.toHaveBeenCalled();
    });

    it("should call killed elder outcomes method when killed player is elder.", () => {
      const death = createFakePlayerDeathPotionByWitchDeath();
      const players = [
        createFakeElderAlivePlayer({ isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      services.playerKiller["applyPlayerRoleDeathOutcomes"](players[0] as DeadPlayer, game);
      expect(mocks.playerKillerService.applyElderDeathOutcomes).toHaveBeenCalledExactlyOnceWith(players[0], game);
      expect(mocks.playerKillerService.applyHunterDeathOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.applyScapegoatDeathOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.applyRustySwordKnightDeathOutcomes).not.toHaveBeenCalled();
    });

    it("should call killed scapegoat outcomes method when killed player is scapegoat.", () => {
      const death = createFakePlayerDeathPotionByWitchDeath();
      const players = [
        createFakeScapegoatAlivePlayer({ isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      services.playerKiller["applyPlayerRoleDeathOutcomes"](players[0] as DeadPlayer, game);

      expect(mocks.playerKillerService.applyScapegoatDeathOutcomes).toHaveBeenCalledExactlyOnceWith(players[0], game);
      expect(mocks.playerKillerService.applyHunterDeathOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.applyElderDeathOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.applyRustySwordKnightDeathOutcomes).not.toHaveBeenCalled();
    });

    it("should call killed rusty sword knight outcomes method when killed player is rusty sword knight.", () => {
      const death = createFakePlayerDeathPotionByWitchDeath();
      const players = [
        createFakeRustySwordKnightAlivePlayer({ isAlive: false, death }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      services.playerKiller["applyPlayerRoleDeathOutcomes"](players[0] as DeadPlayer, game);

      expect(mocks.playerKillerService.applyRustySwordKnightDeathOutcomes).toHaveBeenCalledExactlyOnceWith(players[0], game);
      expect(mocks.playerKillerService.applyHunterDeathOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.applyElderDeathOutcomes).not.toHaveBeenCalled();
      expect(mocks.playerKillerService.applyScapegoatDeathOutcomes).not.toHaveBeenCalled();
    });
  });

  describe("killPlayer", () => {
    beforeEach(() => {
      mocks.playerKillerService.removePlayerAttributesAfterDeath = jest.spyOn(services.playerKiller as unknown as { removePlayerAttributesAfterDeath }, "removePlayerAttributesAfterDeath").mockImplementation();
      mocks.playerKillerService.applyPlayerDeathOutcomes = jest.spyOn(services.playerKiller as unknown as { applyPlayerDeathOutcomes }, "applyPlayerDeathOutcomes").mockImplementation();
      mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException = jest.spyOn(UnexpectedExceptionFactory, "createCantFindPlayerWithIdUnexpectedException").mockImplementation();
      mocks.gameHelper.getPlayerWithIdOrThrow = jest.spyOn(GameHelper, "getPlayerWithIdOrThrow").mockImplementation();
    });

    it("should set player to dead with his death and add survivors bury dead bodies game play when not present in upcoming plays.", () => {
      const players = [
        createFakeRustySwordKnightAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ areRevealedOnDeath: true }) });
      const game = createFakeGame({ players, options });
      const death = createFakePlayerDeathPotionByWitchDeath();
      const expectedKilledPlayer = createFakePlayer({ ...players[0], isAlive: false, death });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          expectedKilledPlayer,
          players[1],
          players[2],
          players[3],
        ],
        upcomingPlays: [createFakeGamePlaySurvivorsBuryDeadBodies()],
      });

      expect(services.playerKiller["killPlayer"](players[0], game, death)).toStrictEqual<Game>(expectedGame);
    });

    it("should set player to dead with his death but doesn't add survivors bury dead bodies game play when present in upcoming plays.", () => {
      const players = [
        createFakeRustySwordKnightAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeDefenderAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ areRevealedOnDeath: true }) });
      const game = createFakeGame({
        upcomingPlays: [
          createFakeGamePlaySheriffDelegates(),
          createFakeGamePlaySurvivorsBuryDeadBodies(),
        ],
        players,
        options,
      });
      const death = createFakePlayerDeathPotionByWitchDeath();
      const expectedKilledPlayer = createFakePlayer({ ...players[0], isAlive: false, death });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          expectedKilledPlayer,
          players[1],
          players[2],
          players[3],
        ],
      });

      expect(services.playerKiller["killPlayer"](players[0], game, death)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("getPlayerToKillOrRevealInGame", () => {
    it("should throw error when player is already dead.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const interpolations = { gameId: game._id.toString(), playerId: players[1]._id.toString() };
      const cantFindPlayerException = new UnexpectedException("getPlayerToKillOrRevealInGame", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME, interpolations);
      const playerIsDeadException = new UnexpectedException("getPlayerToKillOrRevealInGame", UnexpectedExceptionReasons.PLAYER_IS_DEAD, interpolations);
      const expectedInterpolations = { gameId: game._id, playerId: players[1]._id };

      mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException.mockReturnValue(cantFindPlayerException);
      mocks.gameHelper.getPlayerWithIdOrThrow.mockReturnValue(players[1]);
      mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException.mockReturnValue(cantFindPlayerException);
      mocks.unexpectedExceptionFactory.createPlayerIsDeadUnexpectedException.mockReturnValue(playerIsDeadException);

      expect(() => services.playerKiller["getPlayerToKillOrRevealInGame"](players[1]._id, game)).toThrow(playerIsDeadException);
      expect(mocks.unexpectedExceptionFactory.createCantFindPlayerWithIdUnexpectedException).toHaveBeenCalledExactlyOnceWith("getPlayerToKillOrRevealInGame", expectedInterpolations);
      expect(mocks.unexpectedExceptionFactory.createPlayerIsDeadUnexpectedException).toHaveBeenCalledExactlyOnceWith("getPlayerToKillOrRevealInGame", expectedInterpolations);
    });

    it("should get player to kill when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      mocks.gameHelper.getPlayerWithIdOrThrow.mockReturnValue(players[1]);

      expect(services.playerKiller["getPlayerToKillOrRevealInGame"](players[1]._id, game)).toStrictEqual<Player>(players[1]);
    });
  });
});