import { faker } from "@faker-js/faker";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { WITCH_POTIONS } from "../../../../../../../../src/modules/game/enums/game-play.enum";
import { PLAYER_DEATH_CAUSES } from "../../../../../../../../src/modules/game/enums/player.enum";
import { createPowerlessByAncientPlayerAttribute, createWorshipedByWildChildPlayerAttribute } from "../../../../../../../../src/modules/game/helpers/player/player-attribute/player-attribute.factory";
import { PlayerKillerService } from "../../../../../../../../src/modules/game/providers/services/player/player-killer.service";
import type { Game } from "../../../../../../../../src/modules/game/schemas/game.schema";
import type { Player } from "../../../../../../../../src/modules/game/schemas/player/player.schema";
import { ROLE_SIDES } from "../../../../../../../../src/modules/role/enums/role.enum";
import { UNEXPECTED_EXCEPTION_REASONS } from "../../../../../../../../src/shared/exception/enums/unexpected-exception.enum";
import type { ExceptionInterpolations } from "../../../../../../../../src/shared/exception/types/exception.type";
import { UnexpectedException } from "../../../../../../../../src/shared/exception/types/unexpected-exception.type";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordGuardProtectPlay, createFakeGameHistoryRecordPlayTarget, createFakeGameHistoryRecordWerewolvesEatPlay, createFakeGameHistoryRecordWitchUsePotionsPlay } from "../../../../../../../factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeAncientGameOptions, createFakeLittleGirlGameOptions, createFakeRolesGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakeCantVoteByAllPlayerAttribute, createFakeDrankLifePotionByWitchPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakePowerlessByAncientPlayerAttribute, createFakeProtectedByGuardPlayerAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayerBrokenHeartByCupidDeath, createFakePlayerDeathPotionByWitchDeath, createFakePlayerVoteByAllDeath } from "../../../../../../../factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeAncientAlivePlayer, createFakeGuardAlivePlayer, createFakeIdiotAlivePlayer, createFakeLittleGirlAlivePlayer, createFakeSeerAlivePlayer, createFakeVillagerVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer } from "../../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers, createFakePlayer, createFakePlayerRole, createFakePlayerSide } from "../../../../../../../factories/game/schemas/player/player.schema.factory";
import { createObjectIdFromString } from "../../../../../../../helpers/mongoose/mongoose.helper";

jest.mock("../../../../../../../../src/shared/exception/types/unexpected-exception.type");

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
      const exception = new UnexpectedException("revealPlayerRole", UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, { gameId: game._id.toString(), playerId: unknownPlayer._id.toString() });
      expect(() => service.revealPlayerRole(unknownPlayer, game)).toThrow(exception);
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
  
  describe.skip("getPlayerToKillInGame", () => {
    it("should throw error when player is not found.", () => {
      const unknownId = createObjectIdFromString(faker.database.mongodbObjectId());
      const players = bulkCreateFakePlayers(4);
      const game = createFakeGame({ players });
      expect(() => service.getPlayerToKillInGame(unknownId, game)).toThrow(UnexpectedException);
      const expectedExceptionInterpolations: ExceptionInterpolations = { gameId: game._id.toString(), playerId: unknownId.toString() };
      expect(UnexpectedException).toHaveBeenCalledWith("getPlayerToKillInGame", UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, expectedExceptionInterpolations);
    });

    it("should throw error when player is already dead.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      expect(() => service.getPlayerToKillInGame(players[1]._id, game)).toThrow(UnexpectedException);
      const expectedExceptionInterpolations: ExceptionInterpolations = { gameId: game._id.toString(), playerId: players[1]._id.toString() };
      expect(UnexpectedException).toHaveBeenCalledWith("getPlayerToKillInGame", UNEXPECTED_EXCEPTION_REASONS.PLAYER_IS_DEAD, expectedExceptionInterpolations);
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

  describe("killPlayer", () => {
    it.skip("should kill player when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      jest.spyOn(service, "getPlayerToKillInGame").mockReturnValue(game.players[1]);
      const death = createFakePlayerDeathPotionByWitchDeath();
      const updatedGame = service.killPlayer(players[1], game, death);
      expect(updatedGame.players[1]).toStrictEqual<Player>(createFakePlayer({
        ...players[1],
        isAlive: false,
        role: createFakePlayerRole({ ...players[1].role, isRevealed: true }),
        death,
      }));
    });
  });
});