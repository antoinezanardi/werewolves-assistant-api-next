import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { plainToInstance } from "class-transformer";
import { defaultGameOptions } from "../../../../../../../../src/modules/game/constants/game-options/game-options.constant";
import { CreateGameOptionsDto } from "../../../../../../../../src/modules/game/dto/create-game/create-game-options/create-game-options.dto";
import { GAME_PLAY_ACTIONS } from "../../../../../../../../src/modules/game/enums/game-play.enum";
import { GAME_PHASES } from "../../../../../../../../src/modules/game/enums/game.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../../../../../../src/modules/game/enums/player.enum";
import * as GameHelper from "../../../../../../../../src/modules/game/helpers/game.helper";
import * as PlayerHelper from "../../../../../../../../src/modules/game/helpers/player/player.helper";
import { GamePlaysManagerService } from "../../../../../../../../src/modules/game/providers/services/game-play/game-plays-manager.service";
import { GameOptions } from "../../../../../../../../src/modules/game/schemas/game-options/game-options.schema";
import type { SheriffGameOptions } from "../../../../../../../../src/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema";
import type { GamePlay } from "../../../../../../../../src/modules/game/schemas/game-play.schema";
import type { Game } from "../../../../../../../../src/modules/game/schemas/game.schema";
import { ROLE_NAMES } from "../../../../../../../../src/modules/role/enums/role.enum";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "../../../../../../../factories/game/dto/create-game/create-game.dto.factory";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakePlayerPowerlessAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeAngelPlayer, createFakeBigBadWolfPlayer, createFakeCupidPlayer, createFakeDogWolfPlayer, createFakeFoxPlayer, createFakeGuardPlayer, createFakePiedPiperPlayer, createFakeRavenPlayer, createFakeSeerPlayer, createFakeStutteringJudgePlayer, createFakeThiefPlayer, createFakeThreeBrothersPlayer, createFakeTwoSistersPlayer, createFakeVileFatherOfWolvesPlayer, createFakeVillagerPlayer, createFakeVillagerVillagerPlayer, createFakeWerewolfPlayer, createFakeWhiteWerewolfPlayer, createFakeWildChildPlayer, createFakeWitchPlayer } from "../../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers } from "../../../../../../../factories/game/schemas/player/player.schema.factory";

describe("Game Plays Manager Service", () => {
  let service: GamePlaysManagerService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [GamePlaysManagerService] }).compile();
    service = module.get<GamePlaysManagerService>(GamePlaysManagerService);
  });

  describe("isSheriffElectionTime", () => {
    it("should return false when sheriff is not enabled even if it's the time.", () => {
      const sheriffGameOptions: SheriffGameOptions = { electedAt: { turn: 1, phase: GAME_PHASES.NIGHT }, isEnabled: false, hasDoubledVote: false };
      expect(service.isSheriffElectionTime(sheriffGameOptions, 1, GAME_PHASES.NIGHT)).toBe(false);
    });

    it("should return false when it's not the right turn.", () => {
      const sheriffGameOptions: SheriffGameOptions = { electedAt: { turn: 1, phase: GAME_PHASES.NIGHT }, isEnabled: true, hasDoubledVote: false };
      expect(service.isSheriffElectionTime(sheriffGameOptions, 2, GAME_PHASES.NIGHT)).toBe(false);
    });

    it("should return false when it's not the right phase.", () => {
      const sheriffGameOptions: SheriffGameOptions = { electedAt: { turn: 1, phase: GAME_PHASES.DAY }, isEnabled: true, hasDoubledVote: false };
      expect(service.isSheriffElectionTime(sheriffGameOptions, 1, GAME_PHASES.NIGHT)).toBe(false);
    });

    it("should return true when it's the right phase and turn.", () => {
      const sheriffGameOptions: SheriffGameOptions = { electedAt: { turn: 1, phase: GAME_PHASES.NIGHT }, isEnabled: true, hasDoubledVote: false };
      expect(service.isSheriffElectionTime(sheriffGameOptions, 1, GAME_PHASES.NIGHT)).toBe(true);
    });
  });

  describe("areLoversPlayableForNight", () => {
    it("should return false when there is no cupid in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WHITE_WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service.areLoversPlayableForNight(gameDto)).toBe(false);
    });

    it("should return true when there is cupid in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.CUPID } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service.areLoversPlayableForNight(gameDto)).toBe(true);
    });

    it("should return false when there is no cupid in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeVillagerPlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service.areLoversPlayableForNight(game)).toBe(false);
    });

    it("should return false when there is cupid in the game but he is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeCupidPlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });
      expect(service.areLoversPlayableForNight(game)).toBe(false);
    });

    it("should return false when there is cupid in the game but he is powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeCupidPlayer({ attributes: [createFakePlayerPowerlessAttribute()] }),
      ]);
      const game = createFakeGame({ players });
      expect(service.areLoversPlayableForNight(game)).toBe(false);
    });

    it("should return true when there is cupid alive and powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeCupidPlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service.areLoversPlayableForNight(game)).toBe(true);
    });
  });

  describe("areAllPlayableForNight", () => {
    it("should return false when there is no angel in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WHITE_WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service.areAllPlayableForNight(gameDto)).toBe(false);
    });

    it("should return true when there is angel in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.ANGEL } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service.areAllPlayableForNight(gameDto)).toBe(true);
    });

    it("should return false when there is no angel in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeVillagerVillagerPlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service.areAllPlayableForNight(game)).toBe(false);
    });

    it("should return false when there is angel in the game but he is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeAngelPlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });
      expect(service.areAllPlayableForNight(game)).toBe(false);
    });

    it("should return false when there is angel in the game but he is powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeAngelPlayer({ attributes: [createFakePlayerPowerlessAttribute()] }),
      ]);
      const game = createFakeGame({ players });
      expect(service.areAllPlayableForNight(game)).toBe(false);
    });

    it("should return true when there is angel in the game alive and powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeAngelPlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service.areAllPlayableForNight(game)).toBe(true);
    });
  });

  describe("isGroupPlayableForNight", () => {
    it("should call all playable method when group is all.", () => {
      const areAllPlayableForNightSpy = jest.spyOn(service, "areAllPlayableForNight").mockReturnValue(true);
      const game = createFakeGame();
      const isPlayable = service.isGroupPlayableForNight(game, PLAYER_GROUPS.ALL);
      expect(areAllPlayableForNightSpy).toHaveBeenCalledWith(game);
      expect(isPlayable).toBe(true);
    });

    it("should call lovers playable method when group is lovers.", () => {
      const areLoversPlayableForNightSpy = jest.spyOn(service, "areLoversPlayableForNight");
      const game = createFakeGame();
      service.isGroupPlayableForNight(game, PLAYER_GROUPS.LOVERS);
      expect(areLoversPlayableForNightSpy).toHaveBeenCalledWith(game);
    });

    it("should call charmed playable method when group is charmed people.", () => {
      const isPiedPiperPlayableForNightSpy = jest.spyOn(service, "isPiedPiperPlayableForNight");
      const game = createFakeGame();
      service.isGroupPlayableForNight(game, PLAYER_GROUPS.CHARMED);
      expect(isPiedPiperPlayableForNightSpy).toHaveBeenCalledWith(game);
    });

    it("should return true when group is werewolves and game is dto.", () => {
      const gameDto = createFakeCreateGameDto();
      expect(service.isGroupPlayableForNight(gameDto, PLAYER_GROUPS.WEREWOLVES)).toBe(true);
    });

    it("should return true when group is villagers and game is dto.", () => {
      const gameDto = createFakeCreateGameDto();
      expect(service.isGroupPlayableForNight(gameDto, PLAYER_GROUPS.VILLAGERS)).toBe(true);
    });

    it("should return false when group is werewolves and all are powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfPlayer({ attributes: [createFakePlayerPowerlessAttribute()] }),
        createFakeBigBadWolfPlayer({ attributes: [createFakePlayerPowerlessAttribute()] }),
        createFakeWitchPlayer(),
        createFakeWildChildPlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service.isGroupPlayableForNight(game, PLAYER_GROUPS.WEREWOLVES)).toBe(false);
    });

    it("should return true when group is werewolves and at least one is alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfPlayer({ isAlive: false }),
        createFakeBigBadWolfPlayer(),
        createFakeWitchPlayer(),
        createFakeWildChildPlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service.isGroupPlayableForNight(game, PLAYER_GROUPS.WEREWOLVES)).toBe(true);
    });
  });

  describe("isWhiteWerewolfPlayableForNight", () => {
    it("should return false when white werewolf is not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service.isWhiteWerewolfPlayableForNight(gameDto)).toBe(false);
    });

    it("should return false when white werewolf is in the game dto but options specify that he's never called.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WHITE_WEREWOLF } },
      ]);
      const options = plainToInstance(CreateGameOptionsDto, { roles: { whiteWerewolf: { wakingUpInterval: 0 } } });
      const gameDto = createFakeCreateGameDto({ players, options });
      expect(service.isWhiteWerewolfPlayableForNight(gameDto)).toBe(false);
    });

    it("should return true when white werewolf is in the game dto and options specify that he's called every other night.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WHITE_WEREWOLF } },
      ]);
      const options = plainToInstance(CreateGameOptionsDto, { roles: { whiteWerewolf: { wakingUpInterval: 2 } } });
      const gameDto = createFakeCreateGameDto({ players, options });
      expect(service.isWhiteWerewolfPlayableForNight(gameDto)).toBe(true);
    });

    it("should return false when white werewolf is not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeAngelPlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service.isWhiteWerewolfPlayableForNight(game)).toBe(false);
    });

    it("should return false when white werewolf is in the game but options specify that he's never called.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeAngelPlayer(),
      ]);
      const options = plainToInstance(GameOptions, { roles: { whiteWerewolf: { wakingUpInterval: 0 } } });
      const game = createFakeGame({ players, options });
      expect(service.isWhiteWerewolfPlayableForNight(game)).toBe(false);
    });

    it("should return false when white werewolf is in the game but dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer({ isAlive: false }),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeAngelPlayer(),
      ]);
      const options = plainToInstance(GameOptions, { roles: { whiteWerewolf: { wakingUpInterval: 1 } } });
      const game = createFakeGame({ players, options });
      expect(service.isWhiteWerewolfPlayableForNight(game)).toBe(false);
    });

    it("should return false when white werewolf is in the game but powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer({ attributes: [createFakePlayerPowerlessAttribute()] }),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeAngelPlayer(),
      ]);
      const options = plainToInstance(GameOptions, { roles: { whiteWerewolf: { wakingUpInterval: 1 } } });
      const game = createFakeGame({ players, options });
      expect(service.isWhiteWerewolfPlayableForNight(game)).toBe(false);
    });

    it("should return true when white werewolf is in the game, alive and powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeAngelPlayer(),
      ]);
      const options = plainToInstance(GameOptions, { roles: { whiteWerewolf: { wakingUpInterval: 2 } } });
      const game = createFakeGame({ players, options });
      expect(service.isWhiteWerewolfPlayableForNight(game)).toBe(true);
    });
  });

  describe("isPiedPiperPlayableForNight", () => {
    it("should return false when pied piper is not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service.isPiedPiperPlayableForNight(gameDto)).toBe(false);
    });

    it("should return true when pied piper is in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.PIED_PIPER } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service.isPiedPiperPlayableForNight(gameDto)).toBe(true);
    });

    it("should return false when pied piper is not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeAngelPlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service.isPiedPiperPlayableForNight(game)).toBe(false);
    });

    it("should return false when pied piper is in the game can't charm anymore.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakePiedPiperPlayer({ isAlive: false }),
      ]);
      jest.spyOn(PlayerHelper, "canPiedPiperCharm").mockReturnValue(false);
      const game = createFakeGame({ players });
      expect(service.isPiedPiperPlayableForNight(game)).toBe(false);
    });

    it("should return true when pied piper is in the game and can still charm.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakePiedPiperPlayer(),
      ]);
      jest.spyOn(PlayerHelper, "canPiedPiperCharm").mockReturnValue(true);
      const game = createFakeGame({ players });
      expect(service.isPiedPiperPlayableForNight(game)).toBe(true);
    });
  });

  describe("isBigBadWolfPlayableForNight", () => {
    it("should return false when big bad wolf is not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service.isBigBadWolfPlayableForNight(gameDto)).toBe(false);
    });

    it("should return true when big bad wolf is in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.BIG_BAD_WOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service.isBigBadWolfPlayableForNight(gameDto)).toBe(true);
    });

    it("should return false when big bad wolf is not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakePiedPiperPlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service.isBigBadWolfPlayableForNight(game)).toBe(false);
    });

    it("should return false when big bad wolf is in the game but dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeBigBadWolfPlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });
      expect(service.isBigBadWolfPlayableForNight(game)).toBe(false);
    });

    it("should return false when big bad wolf is in the game but one werewolf is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer({ isAlive: false }),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeBigBadWolfPlayer(),
      ]);
      const options = plainToInstance(GameOptions, { roles: { bigBadWolf: { isPowerlessIfWerewolfDies: true } } });
      jest.spyOn(GameHelper, "areAllWerewolvesAlive").mockReturnValue(false);
      const game = createFakeGame({ players, options });
      expect(service.isBigBadWolfPlayableForNight(game)).toBe(false);
    });

    it("should return true when big bad wolf is in the game, one werewolf is dead but classic rules are not followed.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer({ isAlive: false }),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeBigBadWolfPlayer(),
      ]);
      jest.spyOn(GameHelper, "areAllWerewolvesAlive").mockReturnValue(false);
      const options = plainToInstance(GameOptions, { roles: { bigBadWolf: { isPowerlessIfWerewolfDies: false } } });
      const game = createFakeGame({ players, options });
      expect(service.isBigBadWolfPlayableForNight(game)).toBe(true);
    });

    it("should return true when big bad wolf is in the game and all werewolves are alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeBigBadWolfPlayer(),
      ]);
      jest.spyOn(GameHelper, "areAllWerewolvesAlive").mockReturnValue(true);
      const options = plainToInstance(GameOptions, { roles: { bigBadWolf: { isPowerlessIfWerewolfDies: true } } });
      const game = createFakeGame({ players, options });
      expect(service.isBigBadWolfPlayableForNight(game)).toBe(true);
    });
  });

  describe("areThreeBrothersPlayableForNight", () => {
    it("should return false when three brothers are not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service.areThreeBrothersPlayableForNight(gameDto)).toBe(false);
    });

    it("should return false when three brothers are in the game dto but options specify that they are never called.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.THREE_BROTHERS } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.THREE_BROTHERS } },
        { role: { name: ROLE_NAMES.THREE_BROTHERS } },
      ]);
      const options = plainToInstance(CreateGameOptionsDto, { roles: { threeBrothers: { wakingUpInterval: 0 } } });
      const gameDto = createFakeCreateGameDto({ players, options });
      expect(service.areThreeBrothersPlayableForNight(gameDto)).toBe(false);
    });

    it("should return true when three brother are in the game dto and options specify that they are called every other night.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.THREE_BROTHERS } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.THREE_BROTHERS } },
        { role: { name: ROLE_NAMES.THREE_BROTHERS } },
      ]);
      const options = plainToInstance(CreateGameOptionsDto, { roles: { threeBrothers: { wakingUpInterval: 2 } } });
      const gameDto = createFakeCreateGameDto({ players, options });
      expect(service.areThreeBrothersPlayableForNight(gameDto)).toBe(true);
    });

    it("should return false when three brothers are not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakeVileFatherOfWolvesPlayer(),
        createFakeBigBadWolfPlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service.areThreeBrothersPlayableForNight(game)).toBe(false);
    });

    it("should return false when three brothers is in the game but options specify that they are never called.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersPlayer(),
        createFakeSeerPlayer(),
        createFakeThreeBrothersPlayer(),
        createFakeThreeBrothersPlayer(),
      ]);
      const options = plainToInstance(GameOptions, { roles: { threeBrothers: { wakingUpInterval: 0 } } });
      const game = createFakeGame({ players, options });
      expect(service.areThreeBrothersPlayableForNight(game)).toBe(false);
    });

    it("should return true when three brothers are alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersPlayer(),
        createFakeSeerPlayer(),
        createFakeThreeBrothersPlayer(),
        createFakeThreeBrothersPlayer(),
      ]);
      const options = plainToInstance(GameOptions, { roles: { threeBrothers: { wakingUpInterval: 2 } } });
      const game = createFakeGame({ players, options });
      expect(service.areThreeBrothersPlayableForNight(game)).toBe(true);
    });

    it("should return true when two brothers are alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersPlayer(),
        createFakeSeerPlayer(),
        createFakeThreeBrothersPlayer(),
        createFakeThreeBrothersPlayer({ isAlive: false }),
      ]);
      const options = plainToInstance(GameOptions, { roles: { threeBrothers: { wakingUpInterval: 2 } } });
      const game = createFakeGame({ players, options });
      expect(service.areThreeBrothersPlayableForNight(game)).toBe(true);
    });

    it("should return false when one brothers is alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersPlayer(),
        createFakeSeerPlayer(),
        createFakeThreeBrothersPlayer({ isAlive: false }),
        createFakeThreeBrothersPlayer({ isAlive: false }),
      ]);
      const options = plainToInstance(GameOptions, { roles: { threeBrothers: { wakingUpInterval: 2 } } });
      const game = createFakeGame({ players, options });
      expect(service.areThreeBrothersPlayableForNight(game)).toBe(false);
    });

    it("should return false when all brothers are dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersPlayer({ isAlive: false }),
        createFakeSeerPlayer(),
        createFakeThreeBrothersPlayer({ isAlive: false }),
        createFakeThreeBrothersPlayer({ isAlive: false }),
      ]);
      const options = plainToInstance(GameOptions, { roles: { threeBrothers: { wakingUpInterval: 2 } } });
      const game = createFakeGame({ players, options });
      expect(service.areThreeBrothersPlayableForNight(game)).toBe(false);
    });
  });

  describe("areTwoSistersPlayableForNight", () => {
    it("should return false when two sisters are not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service.areTwoSistersPlayableForNight(gameDto)).toBe(false);
    });

    it("should return false when two sisters are in the game dto but options specify that they are never called.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.VILLAGER_VILLAGER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.TWO_SISTERS } },
        { role: { name: ROLE_NAMES.TWO_SISTERS } },
      ]);
      const options = plainToInstance(CreateGameOptionsDto, { roles: { twoSisters: { wakingUpInterval: 0 } } });
      const gameDto = createFakeCreateGameDto({ players, options });
      expect(service.areTwoSistersPlayableForNight(gameDto)).toBe(false);
    });

    it("should return true when two sisters are in the game dto and options specify that they are called every other night.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.TWO_SISTERS } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.TWO_SISTERS } },
        { role: { name: ROLE_NAMES.TWO_SISTERS } },
      ]);
      const options = plainToInstance(CreateGameOptionsDto, { roles: { twoSisters: { wakingUpInterval: 2 } } });
      const gameDto = createFakeCreateGameDto({ players, options });
      expect(service.areTwoSistersPlayableForNight(gameDto)).toBe(true);
    });

    it("should return false when two sisters are not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfPlayer(),
        createFakeSeerPlayer(),
        createFakePiedPiperPlayer(),
        createFakeWildChildPlayer(),
      ]);
      const options = plainToInstance(GameOptions, { roles: { twoSisters: { wakingUpInterval: 2 } } });
      const game = createFakeGame({ players, options });
      expect(service.areTwoSistersPlayableForNight(game)).toBe(false);
    });

    it("should return false when two sisters is in the game but options specify that they are never called.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersPlayer(),
        createFakeSeerPlayer(),
        createFakeTwoSistersPlayer(),
        createFakeWildChildPlayer(),
      ]);
      const options = plainToInstance(GameOptions, { roles: { twoSisters: { wakingUpInterval: 0 } } });
      const game = createFakeGame({ players, options });
      expect(service.areTwoSistersPlayableForNight(game)).toBe(false);
    });

    it("should return true when two sisters are alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersPlayer(),
        createFakeSeerPlayer(),
        createFakeTwoSistersPlayer(),
        createFakeWildChildPlayer(),
      ]);
      const options = plainToInstance(GameOptions, { roles: { twoSisters: { wakingUpInterval: 2 } } });
      const game = createFakeGame({ players, options });
      expect(service.areTwoSistersPlayableForNight(game)).toBe(true);
    });

    it("should return false when one sister is alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersPlayer({ isAlive: false }),
        createFakeSeerPlayer(),
        createFakeTwoSistersPlayer(),
        createFakeWildChildPlayer(),
      ]);
      const options = plainToInstance(GameOptions, { roles: { twoSisters: { wakingUpInterval: 2 } } });
      const game = createFakeGame({ players, options });
      expect(service.areTwoSistersPlayableForNight(game)).toBe(false);
    });

    it("should return false when all sisters are dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersPlayer({ isAlive: false }),
        createFakeSeerPlayer(),
        createFakeTwoSistersPlayer({ isAlive: false }),
        createFakeWildChildPlayer(),
      ]);
      const options = plainToInstance(GameOptions, { roles: { twoSisters: { wakingUpInterval: 2 } } });
      const game = createFakeGame({ players, options });
      expect(service.areTwoSistersPlayableForNight(game)).toBe(false);
    });
  });

  describe("isRolePlayableForNight", () => {
    it("should return false when player is not in game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersPlayer(),
        createFakeWitchPlayer(),
        createFakeTwoSistersPlayer(),
        createFakeWildChildPlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service.isRolePlayableForNight(game, ROLE_NAMES.SEER)).toBe(false);
    });

    it("should call two sisters method when role is two sisters.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersPlayer(),
        createFakeWitchPlayer(),
        createFakeTwoSistersPlayer(),
        createFakeWildChildPlayer(),
      ]);
      const game = createFakeGame({ players });
      const areTwoSistersPlayableForNightSpy = jest.spyOn(service, "areTwoSistersPlayableForNight");
      service.isRolePlayableForNight(game, ROLE_NAMES.TWO_SISTERS);
      expect(areTwoSistersPlayableForNightSpy).toHaveBeenCalledWith(game);
    });

    it("should call three brothers method when role is three brothers.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersPlayer(),
        createFakeWitchPlayer(),
        createFakeThreeBrothersPlayer(),
        createFakeThreeBrothersPlayer(),
      ]);
      const game = createFakeGame({ players });
      const areThreeBrothersPlayableForNightSpy = jest.spyOn(service, "areThreeBrothersPlayableForNight");
      service.isRolePlayableForNight(game, ROLE_NAMES.THREE_BROTHERS);
      expect(areThreeBrothersPlayableForNightSpy).toHaveBeenCalledWith(game);
    });

    it("should call big bad wolf method when role is big bad wolf.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersPlayer(),
        createFakeBigBadWolfPlayer(),
        createFakeTwoSistersPlayer(),
        createFakeWildChildPlayer(),
      ]);
      const game = createFakeGame({ players });
      const isBigBadWolfPlayableForNightSpy = jest.spyOn(service, "isBigBadWolfPlayableForNight");
      service.isRolePlayableForNight(game, ROLE_NAMES.BIG_BAD_WOLF);
      expect(isBigBadWolfPlayableForNightSpy).toHaveBeenCalledWith(game);
    });

    it("should call pied piper method when role is pied piper.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersPlayer(),
        createFakeBigBadWolfPlayer(),
        createFakeTwoSistersPlayer(),
        createFakePiedPiperPlayer(),
      ]);
      const game = createFakeGame({ players });
      const isPiedPiperPlayableForNightSpy = jest.spyOn(service, "isPiedPiperPlayableForNight").mockReturnValue(true);
      const isPlayable = service.isRolePlayableForNight(game, ROLE_NAMES.PIED_PIPER);
      expect(isPiedPiperPlayableForNightSpy).toHaveBeenCalledWith(game);
      expect(isPlayable).toBe(true);
    });

    it("should call white werewolf method when role is white werewolf.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfPlayer(),
        createFakeBigBadWolfPlayer(),
        createFakeTwoSistersPlayer(),
        createFakeWildChildPlayer(),
      ]);
      const game = createFakeGame({ players });
      const isWhiteWerewolfPlayableForNightSpy = jest.spyOn(service, "isWhiteWerewolfPlayableForNight");
      service.isRolePlayableForNight(game, ROLE_NAMES.WHITE_WEREWOLF);
      expect(isWhiteWerewolfPlayableForNightSpy).toHaveBeenCalledWith(game);
    });

    it("should return true when player is dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WHITE_WEREWOLF } },
        { role: { name: ROLE_NAMES.VILLAGER_VILLAGER } },
        { role: { name: ROLE_NAMES.LITTLE_GIRL } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service.isRolePlayableForNight(gameDto, ROLE_NAMES.SEER)).toBe(true);
    });

    it("should return false when player is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersPlayer(),
        createFakeSeerPlayer({ isAlive: false }),
        createFakeTwoSistersPlayer(),
        createFakeWildChildPlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service.isRolePlayableForNight(game, ROLE_NAMES.SEER)).toBe(false);
    });

    it("should return false when player is powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersPlayer(),
        createFakeSeerPlayer({ attributes: [createFakePlayerPowerlessAttribute()] }),
        createFakeTwoSistersPlayer(),
        createFakeWildChildPlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service.isRolePlayableForNight(game, ROLE_NAMES.SEER)).toBe(false);
    });

    it("should return true when player is alive and powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersPlayer(),
        createFakeSeerPlayer(),
        createFakeTwoSistersPlayer(),
        createFakeWildChildPlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service.isRolePlayableForNight(game, ROLE_NAMES.SEER)).toBe(true);
    });
  });

  describe("isSourcePlayableForNight", () => {
    it("should return false when source is not a role or a group.", () => {
      const game = createFakeGame();
      expect(service.isSourcePlayableForNight(game, PLAYER_ATTRIBUTE_NAMES.SHERIFF)).toBe(false);
    });

    it("should call isRolePlayableForNight when source is a role.", () => {
      const game = createFakeGame();
      const isRolePlayableForNightSpy = jest.spyOn(service, "isRolePlayableForNight");
      service.isSourcePlayableForNight(game, ROLE_NAMES.SEER);
      expect(isRolePlayableForNightSpy).toHaveBeenCalledWith(game, ROLE_NAMES.SEER);
    });

    it("should call isGroupPlayableForNight when source is a group.", () => {
      const game = createFakeGame();
      const isGroupPlayableForNightSpy = jest.spyOn(service, "isGroupPlayableForNight");
      service.isSourcePlayableForNight(game, PLAYER_GROUPS.ALL);
      expect(isGroupPlayableForNightSpy).toHaveBeenCalledWith(game, PLAYER_GROUPS.ALL);
    });
  });

  describe("getUpcomingNightPlays", () => {
    it.each<{ game: Game; output: GamePlay[]; test: string }>([
      {
        test: "it's the first night with official rules and some roles",
        game: createFakeGame({
          turn: 1,
          phase: GAME_PHASES.NIGHT,
          players: bulkCreateFakePlayers(4, [
            createFakeVillagerPlayer(),
            createFakeWerewolfPlayer(),
            createFakeWerewolfPlayer(),
            createFakeSeerPlayer(),
          ]),
          options: defaultGameOptions,
        }),
        output: [
          { source: PLAYER_GROUPS.ALL, action: GAME_PLAY_ACTIONS.ELECT_SHERIFF },
          { source: ROLE_NAMES.SEER, action: GAME_PLAY_ACTIONS.LOOK },
          { source: PLAYER_GROUPS.WEREWOLVES, action: GAME_PLAY_ACTIONS.EAT },
        ],
      },
      {
        test: "it's the first night with official rules and all roles who act during the night",
        game: createFakeGame({
          turn: 1,
          phase: GAME_PHASES.NIGHT,
          players: bulkCreateFakePlayers(22, [
            createFakeVillagerPlayer(),
            createFakeWerewolfPlayer(),
            createFakeSeerPlayer(),
            createFakeWerewolfPlayer(),
            createFakeWhiteWerewolfPlayer(),
            createFakeAngelPlayer(),
            createFakeThiefPlayer(),
            createFakeDogWolfPlayer(),
            createFakeCupidPlayer(),
            createFakeFoxPlayer(),
            createFakeStutteringJudgePlayer(),
            createFakeTwoSistersPlayer(),
            createFakeTwoSistersPlayer(),
            createFakeThreeBrothersPlayer(),
            createFakeThreeBrothersPlayer(),
            createFakeThreeBrothersPlayer(),
            createFakeWildChildPlayer(),
            createFakeRavenPlayer(),
            createFakeGuardPlayer(),
            createFakeBigBadWolfPlayer(),
            createFakeWitchPlayer(),
            createFakePiedPiperPlayer(),
          ]),
          options: defaultGameOptions,
        }),
        output: [
          { source: PLAYER_GROUPS.ALL, action: GAME_PLAY_ACTIONS.ELECT_SHERIFF },
          { source: PLAYER_GROUPS.ALL, action: GAME_PLAY_ACTIONS.VOTE },
          { source: ROLE_NAMES.THIEF, action: GAME_PLAY_ACTIONS.CHOOSE_CARD },
          { source: ROLE_NAMES.DOG_WOLF, action: GAME_PLAY_ACTIONS.CHOOSE_SIDE },
          { source: ROLE_NAMES.CUPID, action: GAME_PLAY_ACTIONS.CHARM },
          { source: ROLE_NAMES.SEER, action: GAME_PLAY_ACTIONS.LOOK },
          { source: ROLE_NAMES.FOX, action: GAME_PLAY_ACTIONS.SNIFF },
          { source: PLAYER_GROUPS.LOVERS, action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER },
          { source: ROLE_NAMES.STUTTERING_JUDGE, action: GAME_PLAY_ACTIONS.CHOOSE_SIGN },
          { source: ROLE_NAMES.TWO_SISTERS, action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER },
          { source: ROLE_NAMES.THREE_BROTHERS, action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER },
          { source: ROLE_NAMES.WILD_CHILD, action: GAME_PLAY_ACTIONS.CHOOSE_MODEL },
          { source: ROLE_NAMES.RAVEN, action: GAME_PLAY_ACTIONS.MARK },
          { source: ROLE_NAMES.GUARD, action: GAME_PLAY_ACTIONS.PROTECT },
          { source: PLAYER_GROUPS.WEREWOLVES, action: GAME_PLAY_ACTIONS.EAT },
          { source: ROLE_NAMES.WHITE_WEREWOLF, action: GAME_PLAY_ACTIONS.EAT },
          { source: ROLE_NAMES.BIG_BAD_WOLF, action: GAME_PLAY_ACTIONS.EAT },
          { source: ROLE_NAMES.WITCH, action: GAME_PLAY_ACTIONS.USE_POTIONS },
          { source: ROLE_NAMES.PIED_PIPER, action: GAME_PLAY_ACTIONS.CHARM },
          { source: PLAYER_GROUPS.CHARMED, action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER },
        ],
      },
      {
        test: "it's the second night with official rules and some roles",
        game: createFakeGame({
          turn: 2,
          phase: GAME_PHASES.NIGHT,
          players: bulkCreateFakePlayers(4, [
            createFakeCupidPlayer(),
            createFakeWerewolfPlayer(),
            createFakeSeerPlayer({ isAlive: false }),
            createFakeWitchPlayer({ attributes: [createFakePlayerPowerlessAttribute()] }),
            createFakeAngelPlayer(),
          ]),
          options: defaultGameOptions,
        }),
        output: [{ source: PLAYER_GROUPS.WEREWOLVES, action: GAME_PLAY_ACTIONS.EAT }],
      },
    ])("should get upcoming night plays when $test [#$#].", ({ game, output }) => {
      expect(service.getUpcomingNightPlays(game)).toStrictEqual(output);
    });
  });
});