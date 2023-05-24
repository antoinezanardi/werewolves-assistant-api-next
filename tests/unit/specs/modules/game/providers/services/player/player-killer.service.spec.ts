import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { WITCH_POTIONS } from "../../../../../../../../src/modules/game/enums/game-play.enum";
import { PLAYER_DEATH_CAUSES } from "../../../../../../../../src/modules/game/enums/player.enum";
import * as GameHelper from "../../../../../../../../src/modules/game/helpers/game.helper";
import * as GameMutator from "../../../../../../../../src/modules/game/helpers/game.mutator";
import { createPowerlessByAncientPlayerAttribute, createWorshipedByWildChildPlayerAttribute } from "../../../../../../../../src/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { PlayerKillerService } from "../../../../../../../../src/modules/game/providers/services/player/player-killer.service";
import type { Game } from "../../../../../../../../src/modules/game/schemas/game.schema";
import type { Player } from "../../../../../../../../src/modules/game/schemas/player/player.schema";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../../../../src/modules/role/enums/role.enum";
import { UNEXPECTED_EXCEPTION_REASONS } from "../../../../../../../../src/shared/exception/enums/unexpected-exception.enum";
import * as UnexpectedExceptionFactory from "../../../../../../../../src/shared/exception/helpers/unexpected-exception.factory";
import { UnexpectedException } from "../../../../../../../../src/shared/exception/types/unexpected-exception.type";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordGuardProtectPlay, createFakeGameHistoryRecordPlayTarget, createFakeGameHistoryRecordWerewolvesEatPlay, createFakeGameHistoryRecordWitchUsePotionsPlay } from "../../../../../../../factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeAncientGameOptions, createFakeIdiotGameOptions, createFakeLittleGirlGameOptions, createFakeRolesGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGamePlayHunterShoots, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySheriffDelegates } from "../../../../../../../factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakeCantVoteByAllPlayerAttribute, createFakeContaminatedByRustySwordKnightPlayerAttribute, createFakeDrankLifePotionByWitchPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakePowerlessByAncientPlayerAttribute, createFakeProtectedByGuardPlayerAttribute, createFakeSheriffByAllPlayerAttribute, createFakeWorshipedByWildChildPlayerAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayerBrokenHeartByCupidDeath, createFakePlayerDeathPotionByWitchDeath, createFakePlayerEatenByWerewolvesDeath, createFakePlayerReconsiderPardonByAllDeath, createFakePlayerVoteByAllDeath, createFakePlayerVoteScapegoatedByAllDeath } from "../../../../../../../factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeAncientAlivePlayer, createFakeGuardAlivePlayer, createFakeHunterAlivePlayer, createFakeIdiotAlivePlayer, createFakeLittleGirlAlivePlayer, createFakeRustySwordKnightAlivePlayer, createFakeScapegoatAlivePlayer, createFakeSeerAlivePlayer, createFakeVillagerVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer } from "../../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer, createFakePlayerRole, createFakePlayerSide } from "../../../../../../../factories/game/schemas/player/player.schema.factory";

describe("Player Killer Service", () => {
  let service: PlayerKillerService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [PlayerKillerService] }).compile();

    service = module.get<PlayerKillerService>(PlayerKillerService);
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
            attributes: [createFakeCantVoteByAllPlayerAttribute()],
          }),
          game.players[1],
          game.players[2],
          game.players[3],
        ],
      });
      expect(service.applyPlayerRoleRevelationOutcomes(game.players[0], game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return the game as is when player is not an idiot.", () => {
      const players = [
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      expect(service.applyPlayerRoleRevelationOutcomes(game.players[1], game)).toStrictEqual<Game>(game);
    });
  });

  describe("revealPlayerRole", () => {
    it("should throw error when player to reveal is not found among players.", () => {
      const players = [
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const unknownPlayer = createFakePlayer();
      const interpolations = { gameId: game._id.toString(), playerId: unknownPlayer._id.toString() };
      const exception = new UnexpectedException("revealPlayerRole", UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, interpolations);

      const createCantFindPlayerUnexpectedExceptionMock = jest.spyOn(UnexpectedExceptionFactory, "createCantFindPlayerUnexpectedException").mockReturnValue(exception);

      expect(() => service.revealPlayerRole(unknownPlayer, game)).toThrow(exception);
      expect(createCantFindPlayerUnexpectedExceptionMock).toHaveBeenCalledOnceWith("revealPlayerRole", interpolations);
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
      expect(service.revealPlayerRole(players[0], game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("doesPlayerRoleMustBeRevealed", () => {
    it("should return false when player role is already revealed.", () => {
      const player = createFakeVillagerVillagerAlivePlayer();
      const death = createFakePlayerVoteByAllDeath();
      expect(service.doesPlayerRoleMustBeRevealed(player, death)).toBe(false);
    });

    it("should return false when player role is not idiot.", () => {
      const player = createFakeSeerAlivePlayer();
      const death = createFakePlayerVoteByAllDeath();
      expect(service.doesPlayerRoleMustBeRevealed(player, death)).toBe(false);
    });

    it("should return false when player role is idiot but powerless.", () => {
      const player = createFakeIdiotAlivePlayer({ attributes: [createPowerlessByAncientPlayerAttribute()] });
      const death = createFakePlayerVoteByAllDeath();
      expect(service.doesPlayerRoleMustBeRevealed(player, death)).toBe(false);
    });

    it("should return false when player role is idiot but death cause is not vote.", () => {
      const player = createFakeIdiotAlivePlayer();
      const death = createFakePlayerDeathPotionByWitchDeath();
      expect(service.doesPlayerRoleMustBeRevealed(player, death)).toBe(false);
    });

    it("should return true when player role is idiot and death cause is not vote.", () => {
      const player = createFakeIdiotAlivePlayer();
      const death = createFakePlayerVoteByAllDeath();
      expect(service.doesPlayerRoleMustBeRevealed(player, death)).toBe(true);
    });
  });

  describe("getAncientLivesCountAgainstWerewolves", () => {
    it("should return same amount of lives when no werewolves attack against ancient.", () => {
      const livesCountAgainstWerewolves = 3;
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ ancient: createFakeAncientGameOptions({ livesCountAgainstWerewolves }) }) });
      const game = createFakeGame({ options });
      const gameHistoryRecordPlayAncientTarget = createFakeGameHistoryRecordPlayTarget({ player: createFakeAncientAlivePlayer() });
      const gameHistoryRecordPlaySeerTarget = createFakeGameHistoryRecordPlayTarget({ player: createFakeSeerAlivePlayer() });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordGuardProtectPlay({ targets: [gameHistoryRecordPlayAncientTarget] }),
          turn: 1,
        }),
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [gameHistoryRecordPlaySeerTarget] }),
          turn: 1,
        }),
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [gameHistoryRecordPlaySeerTarget] }),
          turn: 2,
        }),
      ];
      expect(service.getAncientLivesCountAgainstWerewolves(game, gameHistoryRecords)).toBe(3);
    });

    it("should return amount of lives minus one when ancient was attacked three times but protected once and saved by witch once.", () => {
      const livesCountAgainstWerewolves = 3;
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ ancient: createFakeAncientGameOptions({ livesCountAgainstWerewolves }) }) });
      const game = createFakeGame({ options });
      const gameHistoryRecordPlayAncientTarget = createFakeGameHistoryRecordPlayTarget({ player: createFakeAncientAlivePlayer() });
      const gameHistoryRecordPlayAncientDrankLifePotionTarget = createFakeGameHistoryRecordPlayTarget({ ...gameHistoryRecordPlayAncientTarget, drankPotion: WITCH_POTIONS.LIFE });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [gameHistoryRecordPlayAncientTarget] }),
          turn: 1,
        }),
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordGuardProtectPlay({ targets: [gameHistoryRecordPlayAncientTarget] }),
          turn: 1,
        }),
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [gameHistoryRecordPlayAncientTarget] }),
          turn: 2,
        }),
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: [gameHistoryRecordPlayAncientDrankLifePotionTarget] }),
          turn: 2,
        }),
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [gameHistoryRecordPlayAncientTarget] }),
          turn: 3,
        }),
      ];
      expect(service.getAncientLivesCountAgainstWerewolves(game, gameHistoryRecords)).toBe(2);
    });

    it("should return amount of lives minus one when ancient was attacked but not protected and killed by witch.", () => {
      const livesCountAgainstWerewolves = 3;
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ ancient: createFakeAncientGameOptions({ livesCountAgainstWerewolves }) }) });
      const game = createFakeGame({ options });
      const gameHistoryRecordPlayAncientTarget = createFakeGameHistoryRecordPlayTarget({ player: createFakeAncientAlivePlayer() });
      const gameHistoryRecordPlaySeerTarget = createFakeGameHistoryRecordPlayTarget({ player: createFakeSeerAlivePlayer() });
      const gameHistoryRecordPlayAncientDrankDeathPotionTarget = createFakeGameHistoryRecordPlayTarget({ ...gameHistoryRecordPlayAncientTarget, drankPotion: WITCH_POTIONS.DEATH });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: [gameHistoryRecordPlayAncientTarget] }),
          turn: 1,
        }),
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordGuardProtectPlay({ targets: [gameHistoryRecordPlaySeerTarget] }),
          turn: 1,
        }),
        createFakeGameHistoryRecord({
          play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: [gameHistoryRecordPlayAncientDrankDeathPotionTarget] }),
          turn: 1,
        }),
      ];
      expect(service.getAncientLivesCountAgainstWerewolves(game, gameHistoryRecords)).toBe(2);
    });
  });

  describe("isAncientKillable", () => {
    it("should return true when cause is not EATEN.", () => {
      const ancientPlayer = createFakeAncientAlivePlayer();
      const game = createFakeGame();
      jest.spyOn(service, "getAncientLivesCountAgainstWerewolves").mockReturnValue(2);
      expect(service.isAncientKillable(ancientPlayer, game, PLAYER_DEATH_CAUSES.VOTE, [])).toBe(true);
    });

    it("should return false when cause is EATEN but ancient still have at least one life left.", () => {
      const ancientPlayer = createFakeAncientAlivePlayer();
      const game = createFakeGame();
      jest.spyOn(service, "getAncientLivesCountAgainstWerewolves").mockReturnValue(2);
      expect(service.isAncientKillable(ancientPlayer, game, PLAYER_DEATH_CAUSES.EATEN, [])).toBe(false);
    });

    it("should return true when cause is EATEN but ancient has only one life left.", () => {
      const ancientPlayer = createFakeAncientAlivePlayer();
      const game = createFakeGame();
      jest.spyOn(service, "getAncientLivesCountAgainstWerewolves").mockReturnValue(1);
      expect(service.isAncientKillable(ancientPlayer, game, PLAYER_DEATH_CAUSES.EATEN, [])).toBe(true);
    });

    it("should return true when cause is EATEN but ancient has 0 life left.", () => {
      const ancientPlayer = createFakeAncientAlivePlayer();
      const game = createFakeGame();
      jest.spyOn(service, "getAncientLivesCountAgainstWerewolves").mockReturnValue(0);
      expect(service.isAncientKillable(ancientPlayer, game, PLAYER_DEATH_CAUSES.EATEN, [])).toBe(true);
    });
  });

  describe("isIdiotKillable", () => {
    it("should return true when idiot is already revealed.", () => {
      const player = createFakeIdiotAlivePlayer();
      player.role.isRevealed = true;
      expect(service.isIdiotKillable(player, PLAYER_DEATH_CAUSES.VOTE)).toBe(true);
    });

    it("should return true when idiot is killed by other cause than a vote.", () => {
      const player = createFakeIdiotAlivePlayer();
      expect(service.isIdiotKillable(player, PLAYER_DEATH_CAUSES.DEATH_POTION)).toBe(true);
    });

    it("should return true when idiot is killed by vote but powerless.", () => {
      const player = createFakeIdiotAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] });
      expect(service.isIdiotKillable(player, PLAYER_DEATH_CAUSES.VOTE)).toBe(true);
    });

    it("should return false when idiot is not revealed, dies from votes and is not powerless.", () => {
      const player = createFakeIdiotAlivePlayer();
      expect(service.isIdiotKillable(player, PLAYER_DEATH_CAUSES.VOTE)).toBe(false);
    });
  });

  describe("canPlayerBeEaten", () => {
    it("should return false when player is saved by the witch.", () => {
      const player = createFakeSeerAlivePlayer({ attributes: [createFakeDrankLifePotionByWitchPlayerAttribute()] });
      const game = createFakeGame();
      expect(service.canPlayerBeEaten(player, game)).toBe(false);
    });

    it("should return false when player is protected by guard and is not little girl.", () => {
      const player = createFakeSeerAlivePlayer({ attributes: [createFakeProtectedByGuardPlayerAttribute()] });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ littleGirl: createFakeLittleGirlGameOptions({ isProtectedByGuard: false }) }) });
      const game = createFakeGame({ options });
      expect(service.canPlayerBeEaten(player, game)).toBe(false);
    });

    it("should return false when player is protected by guard, is little girl but game options allows guard to protect her.", () => {
      const player = createFakeLittleGirlAlivePlayer({ attributes: [createFakeProtectedByGuardPlayerAttribute()] });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ littleGirl: createFakeLittleGirlGameOptions({ isProtectedByGuard: true }) }) });
      const game = createFakeGame({ options });
      expect(service.canPlayerBeEaten(player, game)).toBe(false);
    });

    it("should return true when player is protected by guard, is little girl but game options doesn't allow guard to protect her.", () => {
      const player = createFakeLittleGirlAlivePlayer({ attributes: [createFakeProtectedByGuardPlayerAttribute()] });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ littleGirl: createFakeLittleGirlGameOptions({ isProtectedByGuard: false }) }) });
      const game = createFakeGame({ options });
      expect(service.canPlayerBeEaten(player, game)).toBe(true);
    });

    it("should return true when player defenseless.", () => {
      const player = createFakeSeerAlivePlayer({ attributes: [] });
      const game = createFakeGame();
      expect(service.canPlayerBeEaten(player, game)).toBe(true);
    });
  });

  describe("isPlayerKillable", () => {
    it("should return false when cause is EATEN and player can't be eaten.", () => {
      jest.spyOn(service, "canPlayerBeEaten").mockReturnValue(false);
      const player = createFakePlayer();
      const game = createFakeGame();
      expect(service.isPlayerKillable(player, game, PLAYER_DEATH_CAUSES.EATEN, [])).toBe(false);
    });

    it("should not call can player be eaten validator when cause is not EATEN.", () => {
      const canPlayerBeEatenMock = jest.spyOn(service, "canPlayerBeEaten").mockReturnValue(false);
      const player = createFakePlayer();
      const game = createFakeGame();
      service.isPlayerKillable(player, game, PLAYER_DEATH_CAUSES.VOTE, []);
      expect(canPlayerBeEatenMock).not.toHaveBeenCalledOnce();
    });

    it("should call is idiot killable when player is an idiot.", () => {
      const isIdiotKillableMock = jest.spyOn(service, "isIdiotKillable").mockReturnValue(false);
      const player = createFakeIdiotAlivePlayer();
      const game = createFakeGame();
      service.isPlayerKillable(player, game, PLAYER_DEATH_CAUSES.VOTE, []);
      expect(isIdiotKillableMock).toHaveBeenCalledWith(player, PLAYER_DEATH_CAUSES.VOTE);
    });

    it("should not call is idiot killable when player is not an idiot.", () => {
      const isIdiotKillableMock = jest.spyOn(service, "isIdiotKillable").mockReturnValue(false);
      const player = createFakeSeerAlivePlayer();
      const game = createFakeGame();
      service.isPlayerKillable(player, game, PLAYER_DEATH_CAUSES.VOTE, []);
      expect(isIdiotKillableMock).not.toHaveBeenCalledOnce();
    });

    it("should call is ancient killable when player is an ancient.", () => {
      const isAncientKillableMock = jest.spyOn(service, "isAncientKillable").mockReturnValue(false);
      const player = createFakeAncientAlivePlayer();
      const game = createFakeGame();
      service.isPlayerKillable(player, game, PLAYER_DEATH_CAUSES.VOTE, []);
      expect(isAncientKillableMock).toHaveBeenCalledWith(player, game, PLAYER_DEATH_CAUSES.VOTE, []);
    });

    it("should not call is ancient killable when player is not an ancient.", () => {
      const isAncientKillableMock = jest.spyOn(service, "isAncientKillable").mockReturnValue(false);
      const player = createFakeSeerAlivePlayer();
      const game = createFakeGame();
      service.isPlayerKillable(player, game, PLAYER_DEATH_CAUSES.VOTE, []);
      expect(isAncientKillableMock).not.toHaveBeenCalledOnce();
    });

    it("should return true when there are no contraindications.", () => {
      const player = createFakeSeerAlivePlayer();
      const game = createFakeGame();
      expect(service.isPlayerKillable(player, game, PLAYER_DEATH_CAUSES.VOTE, [])).toBe(true);
    });
  });

  describe("applyWorshipedPlayerDeathOutcomes", () => {
    it("should return game as is when killed player doesn't have the worshiped attribute.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWildChildAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer({ attributes: [createWorshipedByWildChildPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });
      expect(service.applyWorshipedPlayerDeathOutcomes(players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when there is no wild child player.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createWorshipedByWildChildPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      expect(service.applyWorshipedPlayerDeathOutcomes(players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when wild child player is dead.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createWorshipedByWildChildPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWildChildAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      expect(service.applyWorshipedPlayerDeathOutcomes(players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when wild child player is powerless.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createWorshipedByWildChildPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWildChildAlivePlayer({ attributes: [createPowerlessByAncientPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      expect(service.applyWorshipedPlayerDeathOutcomes(players[0], game)).toStrictEqual<Game>(game);
    });

    it("should transform wild child to a werewolf sided player when called.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createWorshipedByWildChildPlayerAttribute()] }),
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
            side: createFakePlayerSide({ ...game.players[3].side, current: ROLE_SIDES.WEREWOLVES }),
          }),
        ],
      });
      expect(service.applyWorshipedPlayerDeathOutcomes(players[0], game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyInLovePlayerDeathOutcomes", () => {
    it("should return game as is when killed player doesn't have the in love attribute.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      expect(service.applyInLovePlayerDeathOutcomes(players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when the other lover is not found because no other one has the in love attribute.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      expect(service.applyInLovePlayerDeathOutcomes(players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when the other lover is not found because he is dead.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()], isAlive: false }),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      expect(service.applyInLovePlayerDeathOutcomes(players[0], game)).toStrictEqual<Game>(game);
    });

    it("should kill the other lover when called.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const killPlayerMock = jest.spyOn(service, "killPlayer").mockImplementation();
      service.applyInLovePlayerDeathOutcomes(players[1], game);
      expect(killPlayerMock).toHaveBeenCalledWith(players[0], game, createFakePlayerBrokenHeartByCupidDeath());
    });
  });

  describe("applySheriffPlayerDeathOutcomes", () => {
    it("should return game as is when player is not the sheriff.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      expect(service.applySheriffPlayerDeathOutcomes(players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when player is idiot and not powerless.", () => {
      const players = [
        createFakeIdiotAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      expect(service.applySheriffPlayerDeathOutcomes(players[0], game)).toStrictEqual<Game>(game);
    });

    it("should prepend sheriff election game play when called with powerless idiot.", () => {
      const players = [
        createFakeIdiotAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute(), createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const upcomingPlays = [createFakeGamePlayHunterShoots()];
      const game = createFakeGame({ players, upcomingPlays });
      expect(service.applySheriffPlayerDeathOutcomes(players[0], game)).toStrictEqual<Game>(createFakeGame({
        ...game,
        upcomingPlays: [createFakeGamePlaySheriffDelegates(), ...game.upcomingPlays],
      }));
    });

    it("should prepend sheriff election game play when called with any other role.", () => {
      const players = [
        createFakeWildChildAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const upcomingPlays = [createFakeGamePlayHunterShoots()];
      const game = createFakeGame({ players, upcomingPlays });
      expect(service.applySheriffPlayerDeathOutcomes(players[0], game)).toStrictEqual<Game>(createFakeGame({
        ...game,
        upcomingPlays: [createFakeGamePlaySheriffDelegates(), ...game.upcomingPlays],
      }));
    });
  });

  describe("applyPlayerAttributesDeathOutcomes", () => {
    let applySheriffPlayerDeathOutcomesMock: jest.SpyInstance;
    let applyInLovePlayerDeathOutcomesMock: jest.SpyInstance;
    let applyWorshipedPlayerDeathOutcomesMock: jest.SpyInstance;
    let getPlayerWithIdOrThrowMock: jest.SpyInstance;
    let createCantFindPlayerUnexpectedExceptionMock: jest.SpyInstance;

    beforeEach(() => {
      applySheriffPlayerDeathOutcomesMock = jest.spyOn(service, "applySheriffPlayerDeathOutcomes").mockImplementation();
      applyInLovePlayerDeathOutcomesMock = jest.spyOn(service, "applyInLovePlayerDeathOutcomes").mockImplementation();
      applyWorshipedPlayerDeathOutcomesMock = jest.spyOn(service, "applyWorshipedPlayerDeathOutcomes").mockImplementation();
      getPlayerWithIdOrThrowMock = jest.spyOn(GameHelper, "getPlayerWithIdOrThrow").mockImplementation();
      createCantFindPlayerUnexpectedExceptionMock = jest.spyOn(UnexpectedExceptionFactory, "createCantFindPlayerUnexpectedException").mockImplementation();
    });

    it("should call no methods when player doesn't have the right attributes.", () => {
      const players = [
        createFakeIdiotAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      service.applyPlayerAttributesDeathOutcomes(game.players[0], game);
      expect(applySheriffPlayerDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(applyInLovePlayerDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(applyWorshipedPlayerDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(getPlayerWithIdOrThrowMock).not.toHaveBeenCalledOnce();
    });

    it("should call all methods when player have all attributes.", () => {
      const players = [
        createFakeIdiotAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute(), createFakeInLoveByCupidPlayerAttribute(), createFakeWorshipedByWildChildPlayerAttribute()] }),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const interpolations = { gameId: game._id.toString(), playerId: players[2]._id.toString() };
      const exception = new UnexpectedException("applyPlayerAttributesDeathOutcomes", UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, interpolations);

      applySheriffPlayerDeathOutcomesMock.mockReturnValue(game);
      applyInLovePlayerDeathOutcomesMock.mockReturnValue(game);
      applyWorshipedPlayerDeathOutcomesMock.mockReturnValue(game);
      getPlayerWithIdOrThrowMock.mockReturnValue(game.players[2]);
      createCantFindPlayerUnexpectedExceptionMock.mockReturnValue(exception);
      service.applyPlayerAttributesDeathOutcomes(game.players[2], game);

      expect(createCantFindPlayerUnexpectedExceptionMock).toHaveBeenCalledOnceWith("applyPlayerAttributesDeathOutcomes", interpolations);
      expect(applySheriffPlayerDeathOutcomesMock).toHaveBeenCalledWith(game.players[2], game);
      expect(applyInLovePlayerDeathOutcomesMock).toHaveBeenCalledWith(game.players[2], game);
      expect(applyWorshipedPlayerDeathOutcomesMock).toHaveBeenCalledWith(game.players[2], game);
      expect(getPlayerWithIdOrThrowMock).toHaveBeenNthCalledWith(1, game.players[2]._id, game, exception);
      expect(getPlayerWithIdOrThrowMock).toHaveBeenNthCalledWith(2, game.players[2]._id, game, exception);
    });
  });

  describe("applyRustySwordKnightDeathOutcomes", () => {
    it("should return game as is when killed player is not rusty sword knight.", () => {
      const players = [
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerEatenByWerewolvesDeath();
      expect(service.applyRustySwordKnightDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(game);
    });

    it("should return game as is when killed player is powerless.", () => {
      const players = [
        createFakeRustySwordKnightAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerEatenByWerewolvesDeath();
      expect(service.applyRustySwordKnightDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(game);
    });

    it("should return game as is when death cause is not eaten.", () => {
      const players = [
        createFakeRustySwordKnightAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerVoteByAllDeath();
      expect(service.applyRustySwordKnightDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(game);
    });

    it("should return game as is when no left alive werewolf is found.", () => {
      const players = [
        createFakeRustySwordKnightAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerEatenByWerewolvesDeath();
      expect(service.applyRustySwordKnightDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(game);
    });

    it("should return game with first left alive werewolf player with contaminated attribute when called.", () => {
      const players = [
        createFakeRustySwordKnightAlivePlayer({ position: 1 }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeWerewolfAlivePlayer({ position: 3 }),
        createFakeGuardAlivePlayer({ position: 4 }),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerEatenByWerewolvesDeath();
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          players[1],
          createFakePlayer({ ...players[2], attributes: [createFakeContaminatedByRustySwordKnightPlayerAttribute()] }),
          players[3],
        ],
      });
      expect(service.applyRustySwordKnightDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyScapegoatDeathOutcomes", () => {
    it("should return game as is when killed player is not scapegoat.", () => {
      const players = [
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerVoteScapegoatedByAllDeath();
      expect(service.applyScapegoatDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(game);
    });

    it("should return game as is when killed player is powerless.", () => {
      const players = [
        createFakeScapegoatAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerVoteScapegoatedByAllDeath();
      expect(service.applyScapegoatDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(game);
    });

    it("should return game as is when killed player was not scapegoated.", () => {
      const players = [
        createFakeScapegoatAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerVoteByAllDeath();
      expect(service.applyScapegoatDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(game);
    });

    it("should return game with upcoming scapegoat bans votes play when called.", () => {
      const players = [
        createFakeScapegoatAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const upcomingPlays = [createFakeGamePlayHunterShoots()];
      const game = createFakeGame({ players, upcomingPlays });
      const death = createFakePlayerVoteScapegoatedByAllDeath();
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [createFakeGamePlayScapegoatBansVoting(), ...upcomingPlays],
      });
      expect(service.applyScapegoatDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyAncientDeathOutcomes", () => {
    it("should return game as is when killed player is not ancient.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer({ role: createFakePlayerRole({ isRevealed: true, current: ROLE_NAMES.IDIOT, original: ROLE_NAMES.IDIOT }) }),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const ancientOptions = createFakeAncientGameOptions({ doesTakeHisRevenge: true });
      const idiotOptions = createFakeIdiotGameOptions({ doesDieOnAncientDeath: true });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ idiot: idiotOptions, ancient: ancientOptions }) });
      const game = createFakeGame({ players, options });
      const death = createFakePlayerVoteScapegoatedByAllDeath();
      expect(service.applyAncientDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(game);
    });

    it("should return game as is when killed player is powerless.", () => {
      const players = [
        createFakeAncientAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeIdiotAlivePlayer({ role: createFakePlayerRole({ isRevealed: true, current: ROLE_NAMES.IDIOT, original: ROLE_NAMES.IDIOT }) }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const ancientOptions = createFakeAncientGameOptions({ doesTakeHisRevenge: true });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ ancient: ancientOptions }) });
      const game = createFakeGame({ players, options });
      const death = createFakePlayerVoteByAllDeath();
      expect(service.applyAncientDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(game);
    });

    it("should return game as is when ancient doesn't take his revenge and idiot is not revealed.", () => {
      const players = [
        createFakeAncientAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerEatenByWerewolvesDeath();
      expect(service.applyAncientDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(game);
    });

    it("should game as is when ancient doesn't take his revenge from game options.", () => {
      const players = [
        createFakeAncientAlivePlayer({ isAlive: false }),
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ ancient: createFakeAncientGameOptions({ doesTakeHisRevenge: false }) }) });
      const game = createFakeGame({ players, options });
      const death = createFakePlayerDeathPotionByWitchDeath();
      expect(service.applyAncientDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(game);
    });

    it("should return game with all villagers powerless when ancient takes his revenge.", () => {
      const players = [
        createFakeAncientAlivePlayer({ isAlive: false }),
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ ancient: createFakeAncientGameOptions({ doesTakeHisRevenge: true }) }) });
      const game = createFakeGame({ players, options });
      const death = createFakePlayerDeathPotionByWitchDeath();
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          createFakePlayer({ ...players[1], attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
          players[2],
          createFakePlayer({ ...players[3], attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
          createFakePlayer(players[4]),
        ],
      });
      expect(service.applyAncientDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when idiot was revealed before but doesn't die on ancient death thanks to game options.", () => {
      const players = [
        createFakeAncientAlivePlayer({ isAlive: false }),
        createFakeIdiotAlivePlayer({ role: createFakePlayerRole({ isRevealed: true, current: ROLE_NAMES.IDIOT, original: ROLE_NAMES.IDIOT }) }),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const ancientOptions = createFakeAncientGameOptions({ doesTakeHisRevenge: false });
      const idiotOptions = createFakeIdiotGameOptions({ doesDieOnAncientDeath: false });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ ancient: ancientOptions, idiot: idiotOptions }) });
      const game = createFakeGame({ players, options });
      const killPlayerMock = jest.spyOn(service, "killPlayer").mockImplementation();
      const death = createFakePlayerDeathPotionByWitchDeath();
      expect(service.applyAncientDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(game);
      expect(killPlayerMock).not.toHaveBeenCalledOnce();
    });

    it("should return game with killed idiot when idiot was revealed before.", () => {
      const players = [
        createFakeAncientAlivePlayer({ isAlive: false }),
        createFakeIdiotAlivePlayer({ role: createFakePlayerRole({ isRevealed: true, current: ROLE_NAMES.IDIOT, original: ROLE_NAMES.IDIOT }) }),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
      ];
      const ancientOptions = createFakeAncientGameOptions({ doesTakeHisRevenge: false });
      const idiotOptions = createFakeIdiotGameOptions({ doesDieOnAncientDeath: true });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ ancient: ancientOptions, idiot: idiotOptions }) });
      const game = createFakeGame({ players, options });
      const killPlayerMock = jest.spyOn(service, "killPlayer").mockImplementation();
      const death = createFakePlayerDeathPotionByWitchDeath();
      service.applyAncientDeathOutcomes(players[0], game, death);
      expect(killPlayerMock).toHaveBeenCalledWith(players[1], game, createFakePlayerReconsiderPardonByAllDeath());
    });
  });

  describe("applyHunterDeathOutcomes", () => {
    it("should return game as is when killed player is not hunter.", () => {
      const players = [
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      expect(service.applyHunterDeathOutcomes(players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when killed player powerless.", () => {
      const players = [
        createFakeHunterAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      expect(service.applyHunterDeathOutcomes(players[0], game)).toStrictEqual<Game>(game);
    });

    it("should return game with upcoming hunter shoots play when called.", () => {
      const players = [
        createFakeHunterAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const upcomingPlays = [createFakeGamePlayScapegoatBansVoting()];
      const game = createFakeGame({ players, upcomingPlays });
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [createFakeGamePlayHunterShoots(), ...upcomingPlays],
      });
      expect(service.applyHunterDeathOutcomes(players[0], game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("applyPlayerRoleDeathOutcomes", () => {
    let applyHunterDeathOutcomesMock: jest.SpyInstance;
    let applyAncientDeathOutcomesMock: jest.SpyInstance;
    let applyScapegoatDeathOutcomesMock: jest.SpyInstance;
    let applyRustySwordKnightDeathOutcomesMock: jest.SpyInstance;

    beforeEach(() => {
      applyHunterDeathOutcomesMock = jest.spyOn(service, "applyHunterDeathOutcomes").mockImplementation();
      applyAncientDeathOutcomesMock = jest.spyOn(service, "applyAncientDeathOutcomes").mockImplementation();
      applyScapegoatDeathOutcomesMock = jest.spyOn(service, "applyScapegoatDeathOutcomes").mockImplementation();
      applyRustySwordKnightDeathOutcomesMock = jest.spyOn(service, "applyRustySwordKnightDeathOutcomes").mockImplementation();
    });

    it("should return game as is without calling role method outcomes when killed player doesn't have the right role.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerDeathPotionByWitchDeath();
      expect(service.applyPlayerRoleDeathOutcomes(players[0], game, death)).toStrictEqual<Game>(game);
      expect(applyHunterDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(applyAncientDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(applyScapegoatDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(applyRustySwordKnightDeathOutcomesMock).not.toHaveBeenCalledOnce();
    });

    it("should call killed hunter outcomes method when killed player is hunter.", () => {
      const players = [
        createFakeHunterAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerDeathPotionByWitchDeath();
      service.applyPlayerRoleDeathOutcomes(players[0], game, death);
      expect(applyHunterDeathOutcomesMock).toHaveBeenCalledOnceWith(players[0], game);
      expect(applyAncientDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(applyScapegoatDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(applyRustySwordKnightDeathOutcomesMock).not.toHaveBeenCalledOnce();
    });

    it("should call killed ancient outcomes method when killed player is ancient.", () => {
      const players = [
        createFakeAncientAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerDeathPotionByWitchDeath();
      service.applyPlayerRoleDeathOutcomes(players[0], game, death);
      expect(applyHunterDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(applyAncientDeathOutcomesMock).toHaveBeenCalledOnceWith(players[0], game, death);
      expect(applyScapegoatDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(applyRustySwordKnightDeathOutcomesMock).not.toHaveBeenCalledOnce();
    });

    it("should call killed scapegoat outcomes method when killed player is scapegoat.", () => {
      const players = [
        createFakeScapegoatAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerDeathPotionByWitchDeath();
      service.applyPlayerRoleDeathOutcomes(players[0], game, death);
      expect(applyHunterDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(applyAncientDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(applyScapegoatDeathOutcomesMock).toHaveBeenCalledOnceWith(players[0], game, death);
      expect(applyRustySwordKnightDeathOutcomesMock).not.toHaveBeenCalledOnce();
    });

    it("should call killed rusty sword knight outcomes method when killed player is rusty sword knight.", () => {
      const players = [
        createFakeRustySwordKnightAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerDeathPotionByWitchDeath();
      service.applyPlayerRoleDeathOutcomes(players[0], game, death);
      expect(applyHunterDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(applyAncientDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(applyScapegoatDeathOutcomesMock).not.toHaveBeenCalledOnce();
      expect(applyRustySwordKnightDeathOutcomesMock).toHaveBeenCalledOnceWith(players[0], game, death);
    });
  });

  describe("applyPlayerDeathOutcomes", () => {
    it("should call player death outcomes methods when called.", () => {
      const players = [
        createFakeRustySwordKnightAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerDeathPotionByWitchDeath();
      const exception = new UnexpectedException("applyPlayerAttributesDeathOutcomes", UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, { gameId: game._id.toString(), playerId: players[0]._id.toString() });

      const createCantFindPlayerUnexpectedExceptionMock = jest.spyOn(UnexpectedExceptionFactory, "createCantFindPlayerUnexpectedException").mockReturnValue(exception);
      const applyPlayerRoleDeathOutcomesMock = jest.spyOn(service, "applyPlayerRoleDeathOutcomes").mockReturnValue(game);
      const getPlayerWithIdOrThrowMock = jest.spyOn(GameHelper, "getPlayerWithIdOrThrow").mockReturnValue(players[0]);
      const applyPlayerAttributesDeathOutcomesMock = jest.spyOn(service, "applyPlayerAttributesDeathOutcomes").mockImplementation();

      service.applyPlayerDeathOutcomes(players[0], game, death);
      expect(createCantFindPlayerUnexpectedExceptionMock).toHaveBeenCalledOnceWith("applyPlayerDeathOutcomes", { gameId: game._id, playerId: players[0]._id });
      expect(applyPlayerRoleDeathOutcomesMock).toHaveBeenCalledOnceWith(players[0], game, death);
      expect(getPlayerWithIdOrThrowMock).toHaveBeenCalledOnceWith(players[0]._id, game, exception);
      expect(applyPlayerAttributesDeathOutcomesMock).toHaveBeenCalledOnceWith(players[0], game);
    });
  });

  describe("killPlayer", () => {
    it("should set player to dead and call death outcomes method when called.", () => {
      const players = [
        createFakeRustySwordKnightAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeGuardAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerDeathPotionByWitchDeath();
      const exception = new UnexpectedException("applyPlayerAttributesDeathOutcomes", UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, { gameId: game._id.toString(), playerId: players[0]._id.toString() });
      const expectedKilledPlayer = createFakePlayer({ ...players[0], isAlive: false, role: createFakePlayerRole({ ...players[0].role, isRevealed: true }), death });

      const createCantFindPlayerUnexpectedExceptionMock = jest.spyOn(UnexpectedExceptionFactory, "createCantFindPlayerUnexpectedException").mockReturnValue(exception);
      const updatePlayerInGameMock = jest.spyOn(GameMutator, "updatePlayerInGame").mockReturnValue(game);
      const getPlayerWithIdOrThrowMock = jest.spyOn(GameHelper, "getPlayerWithIdOrThrow").mockReturnValue(expectedKilledPlayer);
      const applyPlayerDeathOutcomesMock = jest.spyOn(service, "applyPlayerDeathOutcomes").mockReturnValue(game);

      service.killPlayer(players[0], game, death);
      expect(createCantFindPlayerUnexpectedExceptionMock).toHaveBeenCalledOnceWith("killPlayer", { gameId: game._id, playerId: players[0]._id });
      expect(updatePlayerInGameMock).toHaveBeenNthCalledWith(1, players[0]._id, expectedKilledPlayer, game);
      expect(getPlayerWithIdOrThrowMock).toHaveBeenNthCalledWith(1, expectedKilledPlayer._id, game, exception);
      expect(applyPlayerDeathOutcomesMock).toHaveBeenCalledOnceWith(expectedKilledPlayer, game, death);
      expect(getPlayerWithIdOrThrowMock).toHaveBeenNthCalledWith(2, expectedKilledPlayer._id, game, exception);
      expect(updatePlayerInGameMock).toHaveBeenNthCalledWith(2, players[0]._id, { attributes: [] }, game);
    });
  });

  describe("getPlayerToKillInGame", () => {
    it("should throw error when player is already dead.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const exceptionInterpolations = { gameId: game._id.toString(), playerId: players[1]._id.toString() };
      const cantFindPlayerException = new UnexpectedException("getPlayerToKillInGame", UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, exceptionInterpolations);
      const playerIsDeadException = new UnexpectedException("getPlayerToKillInGame", UNEXPECTED_EXCEPTION_REASONS.PLAYER_IS_DEAD, exceptionInterpolations);

      const createCantFindPlayerUnexpectedExceptionMock = jest.spyOn(UnexpectedExceptionFactory, "createCantFindPlayerUnexpectedException").mockReturnValue(cantFindPlayerException);
      const createPlayerIsDeadUnexpectedExceptionMock = jest.spyOn(UnexpectedExceptionFactory, "createPlayerIsDeadUnexpectedException").mockReturnValue(playerIsDeadException);

      expect(() => service.getPlayerToKillInGame(players[1]._id, game)).toThrow(playerIsDeadException);
      expect(createCantFindPlayerUnexpectedExceptionMock).toHaveBeenCalledWith("getPlayerToKillInGame", exceptionInterpolations);
      expect(createPlayerIsDeadUnexpectedExceptionMock).toHaveBeenCalledWith("getPlayerToKillInGame", exceptionInterpolations);
    });

    it("should get player to kill when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      expect(service.getPlayerToKillInGame(players[1]._id, game)).toStrictEqual<Player>(players[1]);
    });
  });

  describe("killOrRevealPlayer", () => {
    let getPlayerToKillInGameMock: jest.SpyInstance;
    let isPlayerKillableMock: jest.SpyInstance;
    let killPlayerMock: jest.SpyInstance;
    let doesPlayerRoleMustBeRevealedMock: jest.SpyInstance;
    let revealPlayerRoleMock: jest.SpyInstance;

    beforeEach(() => {
      getPlayerToKillInGameMock = jest.spyOn(service, "getPlayerToKillInGame");
      isPlayerKillableMock = jest.spyOn(service, "isPlayerKillable");
      killPlayerMock = jest.spyOn(service, "killPlayer");
      doesPlayerRoleMustBeRevealedMock = jest.spyOn(service, "doesPlayerRoleMustBeRevealed");
      revealPlayerRoleMock = jest.spyOn(service, "revealPlayerRole");
    });

    it("should return game as is when player can't be revealed or killed.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerDeathPotionByWitchDeath();

      getPlayerToKillInGameMock.mockReturnValue(players[0]);
      isPlayerKillableMock.mockReturnValue(false);
      doesPlayerRoleMustBeRevealedMock.mockReturnValue(false);

      expect(service.killOrRevealPlayer(players[0]._id, game, death, [])).toStrictEqual<Game>(game);
      expect(killPlayerMock).not.toHaveBeenCalledOnce();
      expect(revealPlayerRoleMock).not.toHaveBeenCalledOnce();
    });

    it("should call kill method when player is killable.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerDeathPotionByWitchDeath();

      getPlayerToKillInGameMock.mockReturnValue(players[0]);
      isPlayerKillableMock.mockReturnValue(true);
      doesPlayerRoleMustBeRevealedMock.mockReturnValue(true);

      service.killOrRevealPlayer(players[0]._id, game, death, []);
      expect(killPlayerMock).toHaveBeenCalledOnceWith(players[0], game, death);
      expect(revealPlayerRoleMock).not.toHaveBeenCalledOnce();
    });

    it("should call reveal role method when player role must be revealed.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const death = createFakePlayerDeathPotionByWitchDeath();

      getPlayerToKillInGameMock.mockReturnValue(players[0]);
      isPlayerKillableMock.mockReturnValue(false);
      doesPlayerRoleMustBeRevealedMock.mockReturnValue(true);

      service.killOrRevealPlayer(players[0]._id, game, death, []);
      expect(killPlayerMock).not.toHaveBeenCalledOnce();
      expect(revealPlayerRoleMock).toHaveBeenCalledOnceWith(players[0], game);
    });
  });
});