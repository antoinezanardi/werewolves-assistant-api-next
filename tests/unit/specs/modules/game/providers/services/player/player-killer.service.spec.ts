import { faker } from "@faker-js/faker";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { PLAYER_DEATH_CAUSES } from "../../../../../../../../src/modules/game/enums/player.enum";
import { PlayerKillerService } from "../../../../../../../../src/modules/game/providers/services/player/player-killer.service";
import type { Player } from "../../../../../../../../src/modules/game/schemas/player/player.schema";
import { UNEXPECTED_EXCEPTION_REASONS, UNEXPECTED_EXCEPTION_SCOPES } from "../../../../../../../../src/shared/exception/enums/unexpected-exception.enum";
import type { ExceptionInterpolations } from "../../../../../../../../src/shared/exception/types/exception.type";
import { UnexpectedException } from "../../../../../../../../src/shared/exception/types/unexpected-exception.type";
import { createFakeGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeLittleGirlGameOptions, createFakeRolesGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakeDrankLifePotionByWitchPlayerAttribute, createFakePowerlessByAncientPlayerAttribute, createFakeProtectedByGuardPlayerAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeAncientAlivePlayer, createFakeIdiotAlivePlayer, createFakeLittleGirlAlivePlayer, createFakeSeerAlivePlayer, createFakeWerewolfAlivePlayer } from "../../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers, createFakePlayer } from "../../../../../../../factories/game/schemas/player/player.schema.factory";
import { createObjectIdFromString } from "../../../../../../../helpers/mongoose/mongoose.helper";

jest.mock("../../../../../../../../src/shared/exception/types/unexpected-exception.type");

describe("Player Killer Service", () => {
  let service: PlayerKillerService;
  
  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [PlayerKillerService] }).compile();
    
    service = module.get<PlayerKillerService>(PlayerKillerService);
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
      expect(isAncientKillableMock).toHaveBeenCalledWith(player);
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
  
  describe("getPlayerToKillInGame", () => {
    it("should throw error when player is not found.", () => {
      const unknownId = createObjectIdFromString(faker.database.mongodbObjectId());
      const players = bulkCreateFakePlayers(4);
      const game = createFakeGame({ players });
      expect(() => service.getPlayerToKillInGame(unknownId, game)).toThrow(UnexpectedException);
      const expectedExceptionInterpolations: ExceptionInterpolations = { gameId: game._id.toString(), playerId: unknownId.toString() };
      expect(UnexpectedException).toHaveBeenCalledWith(UNEXPECTED_EXCEPTION_SCOPES.KILL_PLAYER, UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, expectedExceptionInterpolations);
    });

    it("should throw error when player is already dead.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      expect(() => service.getPlayerToKillInGame(players[1]._id, game)).toThrow(UnexpectedException);
      const expectedExceptionInterpolations: ExceptionInterpolations = { playerId: players[1]._id.toString() };
      expect(UnexpectedException).toHaveBeenCalledWith(UNEXPECTED_EXCEPTION_SCOPES.KILL_PLAYER, UNEXPECTED_EXCEPTION_REASONS.PLAYER_IS_DEAD, expectedExceptionInterpolations);
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
});