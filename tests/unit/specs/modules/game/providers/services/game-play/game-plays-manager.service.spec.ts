import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { defaultGameOptions } from "../../../../../../../../src/modules/game/constants/game-options/game-options.constant";
import { GAME_PLAY_ACTIONS } from "../../../../../../../../src/modules/game/enums/game-play.enum";
import { GAME_PHASES } from "../../../../../../../../src/modules/game/enums/game.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../../../../../../src/modules/game/enums/player.enum";
import * as GameHelper from "../../../../../../../../src/modules/game/helpers/game.helper";
import * as PlayerHelper from "../../../../../../../../src/modules/game/helpers/player/player.helper";
import { GamePlaysManagerService } from "../../../../../../../../src/modules/game/providers/services/game-play/game-plays-manager.service";
import type { GamePlay } from "../../../../../../../../src/modules/game/schemas/game-play.schema";
import type { Game } from "../../../../../../../../src/modules/game/schemas/game.schema";
import { ROLE_NAMES } from "../../../../../../../../src/modules/role/enums/role.enum";
import { createFakeGameOptionsDto } from "../../../../../../../factories/game/dto/create-game/create-game-options/create-game-options.dto.factory";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "../../../../../../../factories/game/dto/create-game/create-game.dto.factory";
import { createFakeRolesGameOptions, createFakeSheriffGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGamePlay } from "../../../../../../../factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakePowerlessByAncientPlayerAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeAngelAlivePlayer, createFakeBigBadWolfAlivePlayer, createFakeCupidAlivePlayer, createFakeDogWolfAlivePlayer, createFakeFoxAlivePlayer, createFakeGuardAlivePlayer, createFakePiedPiperAlivePlayer, createFakeRavenAlivePlayer, createFakeSeerAlivePlayer, createFakeStutteringJudgeAlivePlayer, createFakeThiefAlivePlayer, createFakeThreeBrothersAlivePlayer, createFakeTwoSistersAlivePlayer, createFakeVileFatherOfWolvesAlivePlayer, createFakeVillagerAlivePlayer, createFakeVillagerVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer } from "../../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers } from "../../../../../../../factories/game/schemas/player/player.schema.factory";

describe("Game Plays Manager Service", () => {
  let service: GamePlaysManagerService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [GamePlaysManagerService] }).compile();
    service = module.get<GamePlaysManagerService>(GamePlaysManagerService);
  });

  describe("getUpcomingNightPlays", () => {
    it.each<{ game: Game; output: GamePlay[]; test: string }>([
      {
        test: "it's the first night with official rules and some roles",
        game: createFakeGame({
          turn: 1,
          phase: GAME_PHASES.NIGHT,
          players: bulkCreateFakePlayers(4, [
            createFakeVillagerAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
          ]),
          options: defaultGameOptions,
        }),
        output: [
          createFakeGamePlay({ source: PLAYER_GROUPS.ALL, action: GAME_PLAY_ACTIONS.ELECT_SHERIFF }),
          createFakeGamePlay({ source: ROLE_NAMES.SEER, action: GAME_PLAY_ACTIONS.LOOK }),
          createFakeGamePlay({ source: PLAYER_GROUPS.WEREWOLVES, action: GAME_PLAY_ACTIONS.EAT }),
        ],
      },
      {
        test: "it's the first night with official rules and all roles who act during the night",
        game: createFakeGame({
          turn: 1,
          phase: GAME_PHASES.NIGHT,
          players: bulkCreateFakePlayers(22, [
            createFakeVillagerAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeWhiteWerewolfAlivePlayer(),
            createFakeAngelAlivePlayer(),
            createFakeThiefAlivePlayer(),
            createFakeDogWolfAlivePlayer(),
            createFakeCupidAlivePlayer(),
            createFakeFoxAlivePlayer(),
            createFakeStutteringJudgeAlivePlayer(),
            createFakeTwoSistersAlivePlayer(),
            createFakeTwoSistersAlivePlayer(),
            createFakeThreeBrothersAlivePlayer(),
            createFakeThreeBrothersAlivePlayer(),
            createFakeThreeBrothersAlivePlayer(),
            createFakeWildChildAlivePlayer(),
            createFakeRavenAlivePlayer(),
            createFakeGuardAlivePlayer(),
            createFakeBigBadWolfAlivePlayer(),
            createFakeWitchAlivePlayer(),
            createFakePiedPiperAlivePlayer(),
          ]),
          options: defaultGameOptions,
        }),
        output: [
          createFakeGamePlay({ source: PLAYER_GROUPS.ALL, action: GAME_PLAY_ACTIONS.ELECT_SHERIFF }),
          createFakeGamePlay({ source: PLAYER_GROUPS.ALL, action: GAME_PLAY_ACTIONS.VOTE }),
          createFakeGamePlay({ source: ROLE_NAMES.THIEF, action: GAME_PLAY_ACTIONS.CHOOSE_CARD }),
          createFakeGamePlay({ source: ROLE_NAMES.DOG_WOLF, action: GAME_PLAY_ACTIONS.CHOOSE_SIDE }),
          createFakeGamePlay({ source: ROLE_NAMES.CUPID, action: GAME_PLAY_ACTIONS.CHARM }),
          createFakeGamePlay({ source: ROLE_NAMES.SEER, action: GAME_PLAY_ACTIONS.LOOK }),
          createFakeGamePlay({ source: ROLE_NAMES.FOX, action: GAME_PLAY_ACTIONS.SNIFF }),
          createFakeGamePlay({ source: PLAYER_GROUPS.LOVERS, action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER }),
          createFakeGamePlay({ source: ROLE_NAMES.STUTTERING_JUDGE, action: GAME_PLAY_ACTIONS.CHOOSE_SIGN }),
          createFakeGamePlay({ source: ROLE_NAMES.TWO_SISTERS, action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER }),
          createFakeGamePlay({ source: ROLE_NAMES.THREE_BROTHERS, action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER }),
          createFakeGamePlay({ source: ROLE_NAMES.WILD_CHILD, action: GAME_PLAY_ACTIONS.CHOOSE_MODEL }),
          createFakeGamePlay({ source: ROLE_NAMES.RAVEN, action: GAME_PLAY_ACTIONS.MARK }),
          createFakeGamePlay({ source: ROLE_NAMES.GUARD, action: GAME_PLAY_ACTIONS.PROTECT }),
          createFakeGamePlay({ source: PLAYER_GROUPS.WEREWOLVES, action: GAME_PLAY_ACTIONS.EAT }),
          createFakeGamePlay({ source: ROLE_NAMES.WHITE_WEREWOLF, action: GAME_PLAY_ACTIONS.EAT }),
          createFakeGamePlay({ source: ROLE_NAMES.BIG_BAD_WOLF, action: GAME_PLAY_ACTIONS.EAT }),
          createFakeGamePlay({ source: ROLE_NAMES.WITCH, action: GAME_PLAY_ACTIONS.USE_POTIONS }),
          createFakeGamePlay({ source: ROLE_NAMES.PIED_PIPER, action: GAME_PLAY_ACTIONS.CHARM }),
          createFakeGamePlay({ source: PLAYER_GROUPS.CHARMED, action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER }),
        ],
      },
      {
        test: "it's the second night with official rules and some roles",
        game: createFakeGame({
          turn: 2,
          phase: GAME_PHASES.NIGHT,
          players: bulkCreateFakePlayers(4, [
            createFakeCupidAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeSeerAlivePlayer({ isAlive: false }),
            createFakeWitchAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
            createFakeAngelAlivePlayer(),
          ]),
          options: defaultGameOptions,
        }),
        output: [createFakeGamePlay({ source: PLAYER_GROUPS.WEREWOLVES, action: GAME_PLAY_ACTIONS.EAT })],
      },
    ])("should get upcoming night plays when $test [#$#].", ({ game, output }) => {
      expect(service.getUpcomingNightPlays(game)).toStrictEqual(output);
    });
  });

  describe("isSheriffElectionTime", () => {
    it("should return false when sheriff is not enabled even if it's the time.", () => {
      const sheriffGameOptions = createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GAME_PHASES.NIGHT }, isEnabled: false, hasDoubledVote: false });
      expect(service["isSheriffElectionTime"](sheriffGameOptions, 1, GAME_PHASES.NIGHT)).toBe(false);
    });

    it("should return false when it's not the right turn.", () => {
      const sheriffGameOptions = createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GAME_PHASES.NIGHT }, isEnabled: true, hasDoubledVote: false });
      expect(service["isSheriffElectionTime"](sheriffGameOptions, 2, GAME_PHASES.NIGHT)).toBe(false);
    });

    it("should return false when it's not the right phase.", () => {
      const sheriffGameOptions = createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GAME_PHASES.DAY }, isEnabled: true, hasDoubledVote: false });
      expect(service["isSheriffElectionTime"](sheriffGameOptions, 1, GAME_PHASES.NIGHT)).toBe(false);
    });

    it("should return true when it's the right phase and turn.", () => {
      const sheriffGameOptions = createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GAME_PHASES.NIGHT }, isEnabled: true, hasDoubledVote: false });
      expect(service["isSheriffElectionTime"](sheriffGameOptions, 1, GAME_PHASES.NIGHT)).toBe(true);
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
      expect(service["areLoversPlayableForNight"](gameDto)).toBe(false);
    });

    it("should return true when there is cupid in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.CUPID } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service["areLoversPlayableForNight"](gameDto)).toBe(true);
    });

    it("should return false when there is no cupid in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service["areLoversPlayableForNight"](game)).toBe(false);
    });

    it("should return false when there is cupid in the game but he is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeCupidAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });
      expect(service["areLoversPlayableForNight"](game)).toBe(false);
    });

    it("should return false when there is cupid in the game but he is powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeCupidAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
      ]);
      const game = createFakeGame({ players });
      expect(service["areLoversPlayableForNight"](game)).toBe(false);
    });

    it("should return true when there is cupid alive and powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeCupidAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service["areLoversPlayableForNight"](game)).toBe(true);
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
      expect(service["areAllPlayableForNight"](gameDto)).toBe(false);
    });

    it("should return true when there is angel in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.ANGEL } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service["areAllPlayableForNight"](gameDto)).toBe(true);
    });

    it("should return false when there is no angel in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeVillagerVillagerAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service["areAllPlayableForNight"](game)).toBe(false);
    });

    it("should return false when there is angel in the game but he is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });
      expect(service["areAllPlayableForNight"](game)).toBe(false);
    });

    it("should return false when there is angel in the game but he is powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
      ]);
      const game = createFakeGame({ players });
      expect(service["areAllPlayableForNight"](game)).toBe(false);
    });

    it("should return true when there is angel in the game alive and powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service["areAllPlayableForNight"](game)).toBe(true);
    });
  });

  describe("isGroupPlayableForNight", () => {
    it("should call all playable method when group is all.", () => {
      const areAllPlayableForNightSpy = jest.spyOn(service as unknown as { areAllPlayableForNight }, "areAllPlayableForNight").mockReturnValue(true);
      const game = createFakeGame();
      const isPlayable = service["isGroupPlayableForNight"](game, PLAYER_GROUPS.ALL);
      expect(areAllPlayableForNightSpy).toHaveBeenCalledWith(game);
      expect(isPlayable).toBe(true);
    });

    it("should call lovers playable method when group is lovers.", () => {
      const areLoversPlayableForNightSpy = jest.spyOn(service as unknown as { areLoversPlayableForNight }, "areLoversPlayableForNight");
      const game = createFakeGame();
      service["isGroupPlayableForNight"](game, PLAYER_GROUPS.LOVERS);
      expect(areLoversPlayableForNightSpy).toHaveBeenCalledWith(game);
    });

    it("should call charmed playable method when group is charmed people.", () => {
      const isPiedPiperPlayableForNightSpy = jest.spyOn(service as unknown as { isPiedPiperPlayableForNight }, "isPiedPiperPlayableForNight");
      const game = createFakeGame();
      service["isGroupPlayableForNight"](game, PLAYER_GROUPS.CHARMED);
      expect(isPiedPiperPlayableForNightSpy).toHaveBeenCalledWith(game);
    });

    it("should return true when group is werewolves and game is dto.", () => {
      const gameDto = createFakeCreateGameDto();
      expect(service["isGroupPlayableForNight"](gameDto, PLAYER_GROUPS.WEREWOLVES)).toBe(true);
    });

    it("should return true when group is villagers and game is dto.", () => {
      const gameDto = createFakeCreateGameDto();
      expect(service["isGroupPlayableForNight"](gameDto, PLAYER_GROUPS.VILLAGERS)).toBe(true);
    });

    it("should return false when group is werewolves and all are powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeBigBadWolfAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeWitchAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service["isGroupPlayableForNight"](game, PLAYER_GROUPS.WEREWOLVES)).toBe(false);
    });

    it("should return true when group is werewolves and at least one is alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeBigBadWolfAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service["isGroupPlayableForNight"](game, PLAYER_GROUPS.WEREWOLVES)).toBe(true);
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
      expect(service["isWhiteWerewolfPlayableForNight"](gameDto)).toBe(false);
    });

    it("should return false when white werewolf is in the game dto but options specify that he's never called.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WHITE_WEREWOLF } },
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ whiteWerewolf: { wakingUpInterval: 0 } }) });
      const gameDto = createFakeCreateGameDto({ players, options });
      expect(service["isWhiteWerewolfPlayableForNight"](gameDto)).toBe(false);
    });

    it("should return true when white werewolf is in the game dto and options specify that he's called every other night.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WHITE_WEREWOLF } },
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ whiteWerewolf: { wakingUpInterval: 2 } }) });
      const gameDto = createFakeCreateGameDto({ players, options });
      expect(service["isWhiteWerewolfPlayableForNight"](gameDto)).toBe(true);
    });

    it("should return false when white werewolf is not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service["isWhiteWerewolfPlayableForNight"](game)).toBe(false);
    });

    it("should return false when white werewolf is in the game but options specify that he's never called.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ whiteWerewolf: { wakingUpInterval: 0 } }) });
      const game = createFakeGame({ players, options });
      expect(service["isWhiteWerewolfPlayableForNight"](game)).toBe(false);
    });

    it("should return false when white werewolf is in the game but dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ whiteWerewolf: { wakingUpInterval: 1 } }) });
      const game = createFakeGame({ players, options });
      expect(service["isWhiteWerewolfPlayableForNight"](game)).toBe(false);
    });

    it("should return false when white werewolf is in the game but powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ whiteWerewolf: { wakingUpInterval: 1 } }) });
      const game = createFakeGame({ players, options });
      expect(service["isWhiteWerewolfPlayableForNight"](game)).toBe(false);
    });

    it("should return true when white werewolf is in the game, alive and powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ whiteWerewolf: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, options });
      expect(service["isWhiteWerewolfPlayableForNight"](game)).toBe(true);
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
      expect(service["isPiedPiperPlayableForNight"](gameDto)).toBe(false);
    });

    it("should return true when pied piper is in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.PIED_PIPER } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service["isPiedPiperPlayableForNight"](gameDto)).toBe(true);
    });

    it("should return false when pied piper is not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service["isPiedPiperPlayableForNight"](game)).toBe(false);
    });

    it("should return false when pied piper is in the game can't charm anymore.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakePiedPiperAlivePlayer({ isAlive: false }),
      ]);
      jest.spyOn(PlayerHelper, "canPiedPiperCharm").mockReturnValue(false);
      const game = createFakeGame({ players });
      expect(service["isPiedPiperPlayableForNight"](game)).toBe(false);
    });

    it("should return true when pied piper is in the game and can still charm.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
      ]);
      jest.spyOn(PlayerHelper, "canPiedPiperCharm").mockReturnValue(true);
      const game = createFakeGame({ players });
      expect(service["isPiedPiperPlayableForNight"](game)).toBe(true);
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
      expect(service["isBigBadWolfPlayableForNight"](gameDto)).toBe(false);
    });

    it("should return true when big bad wolf is in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.BIG_BAD_WOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      expect(service["isBigBadWolfPlayableForNight"](gameDto)).toBe(true);
    });

    it("should return false when big bad wolf is not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service["isBigBadWolfPlayableForNight"](game)).toBe(false);
    });

    it("should return false when big bad wolf is in the game but dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });
      expect(service["isBigBadWolfPlayableForNight"](game)).toBe(false);
    });

    it("should return false when big bad wolf is in the game but one werewolf is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ bigBadWolf: { isPowerlessIfWerewolfDies: true } }) });
      jest.spyOn(GameHelper, "areAllWerewolvesAlive").mockReturnValue(false);
      const game = createFakeGame({ players, options });
      expect(service["isBigBadWolfPlayableForNight"](game)).toBe(false);
    });

    it("should return true when big bad wolf is in the game, one werewolf is dead but classic rules are not followed.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ]);
      jest.spyOn(GameHelper, "areAllWerewolvesAlive").mockReturnValue(false);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ bigBadWolf: { isPowerlessIfWerewolfDies: false } }) });
      const game = createFakeGame({ players, options });
      expect(service["isBigBadWolfPlayableForNight"](game)).toBe(true);
    });

    it("should return true when big bad wolf is in the game and all werewolves are alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ]);
      jest.spyOn(GameHelper, "areAllWerewolvesAlive").mockReturnValue(true);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ bigBadWolf: { isPowerlessIfWerewolfDies: true } }) });
      const game = createFakeGame({ players, options });
      expect(service["isBigBadWolfPlayableForNight"](game)).toBe(true);
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
      expect(service["areThreeBrothersPlayableForNight"](gameDto)).toBe(false);
    });

    it("should return false when three brothers are in the game dto but options specify that they are never called.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.THREE_BROTHERS } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.THREE_BROTHERS } },
        { role: { name: ROLE_NAMES.THREE_BROTHERS } },
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 0 } }) });
      const gameDto = createFakeCreateGameDto({ players, options });
      expect(service["areThreeBrothersPlayableForNight"](gameDto)).toBe(false);
    });

    it("should return true when three brother are in the game dto and options specify that they are called every other night.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.THREE_BROTHERS } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.THREE_BROTHERS } },
        { role: { name: ROLE_NAMES.THREE_BROTHERS } },
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) });
      const gameDto = createFakeCreateGameDto({ players, options });
      expect(service["areThreeBrothersPlayableForNight"](gameDto)).toBe(true);
    });

    it("should return false when three brothers are not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service["areThreeBrothersPlayableForNight"](game)).toBe(false);
    });

    it("should return false when three brothers is in the game but options specify that they are never called.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 0 } }) });
      const game = createFakeGame({ players, options });
      expect(service["areThreeBrothersPlayableForNight"](game)).toBe(false);
    });

    it("should return true when three brothers are alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, options });
      expect(service["areThreeBrothersPlayableForNight"](game)).toBe(true);
    });

    it("should return true when two brothers are alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
        createFakeThreeBrothersAlivePlayer({ isAlive: false }),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, options });
      expect(service["areThreeBrothersPlayableForNight"](game)).toBe(true);
    });

    it("should return false when one brothers is alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeThreeBrothersAlivePlayer({ isAlive: false }),
        createFakeThreeBrothersAlivePlayer({ isAlive: false }),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, options });
      expect(service["areThreeBrothersPlayableForNight"](game)).toBe(false);
    });

    it("should return false when all brothers are dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeThreeBrothersAlivePlayer({ isAlive: false }),
        createFakeThreeBrothersAlivePlayer({ isAlive: false }),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ threeBrothers: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, options });
      expect(service["areThreeBrothersPlayableForNight"](game)).toBe(false);
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
      expect(service["areTwoSistersPlayableForNight"](gameDto)).toBe(false);
    });

    it("should return false when two sisters are in the game dto but options specify that they are never called.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.VILLAGER_VILLAGER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.TWO_SISTERS } },
        { role: { name: ROLE_NAMES.TWO_SISTERS } },
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 0 } }) });
      const gameDto = createFakeCreateGameDto({ players, options });
      expect(service["areTwoSistersPlayableForNight"](gameDto)).toBe(false);
    });

    it("should return true when two sisters are in the game dto and options specify that they are called every other night.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.TWO_SISTERS } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.TWO_SISTERS } },
        { role: { name: ROLE_NAMES.TWO_SISTERS } },
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 2 } }) });
      const gameDto = createFakeCreateGameDto({ players, options });
      expect(service["areTwoSistersPlayableForNight"](gameDto)).toBe(true);
    });

    it("should return false when two sisters are not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, options });
      expect(service["areTwoSistersPlayableForNight"](game)).toBe(false);
    });

    it("should return false when two sisters is in the game but options specify that they are never called.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 0 } }) });
      const game = createFakeGame({ players, options });
      expect(service["areTwoSistersPlayableForNight"](game)).toBe(false);
    });

    it("should return true when two sisters are alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, options });
      expect(service["areTwoSistersPlayableForNight"](game)).toBe(true);
    });

    it("should return false when one sister is alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, options });
      expect(service["areTwoSistersPlayableForNight"](game)).toBe(false);
    });

    it("should return false when all sisters are dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeWildChildAlivePlayer(),
      ]);
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ twoSisters: { wakingUpInterval: 2 } }) });
      const game = createFakeGame({ players, options });
      expect(service["areTwoSistersPlayableForNight"](game)).toBe(false);
    });
  });

  describe("isRolePlayableForNight", () => {
    it("should return false when player is not in game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service["isRolePlayableForNight"](game, ROLE_NAMES.SEER)).toBe(false);
    });

    it("should call two sisters method when role is two sisters.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const areTwoSistersPlayableForNightSpy = jest.spyOn(service as unknown as { areTwoSistersPlayableForNight }, "areTwoSistersPlayableForNight");
      service["isRolePlayableForNight"](game, ROLE_NAMES.TWO_SISTERS);
      expect(areTwoSistersPlayableForNightSpy).toHaveBeenCalledWith(game);
    });

    it("should call three brothers method when role is three brothers.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const areThreeBrothersPlayableForNightSpy = jest.spyOn(service as unknown as { areThreeBrothersPlayableForNight }, "areThreeBrothersPlayableForNight");
      service["isRolePlayableForNight"](game, ROLE_NAMES.THREE_BROTHERS);
      expect(areThreeBrothersPlayableForNightSpy).toHaveBeenCalledWith(game);
    });

    it("should call big bad wolf method when role is big bad wolf.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const isBigBadWolfPlayableForNightSpy = jest.spyOn(service as unknown as { isBigBadWolfPlayableForNight }, "isBigBadWolfPlayableForNight");
      service["isRolePlayableForNight"](game, ROLE_NAMES.BIG_BAD_WOLF);
      expect(isBigBadWolfPlayableForNightSpy).toHaveBeenCalledWith(game);
    });

    it("should call pied piper method when role is pied piper.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const isPiedPiperPlayableForNightSpy = jest.spyOn(service as unknown as { isPiedPiperPlayableForNight }, "isPiedPiperPlayableForNight").mockReturnValue(true);
      const isPlayable = service["isRolePlayableForNight"](game, ROLE_NAMES.PIED_PIPER);
      expect(isPiedPiperPlayableForNightSpy).toHaveBeenCalledWith(game);
      expect(isPlayable).toBe(true);
    });

    it("should call white werewolf method when role is white werewolf.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const isWhiteWerewolfPlayableForNightSpy = jest.spyOn(service as unknown as { isWhiteWerewolfPlayableForNight }, "isWhiteWerewolfPlayableForNight");
      service["isRolePlayableForNight"](game, ROLE_NAMES.WHITE_WEREWOLF);
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
      expect(service["isRolePlayableForNight"](gameDto, ROLE_NAMES.SEER)).toBe(true);
    });

    it("should return false when player is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service["isRolePlayableForNight"](game, ROLE_NAMES.SEER)).toBe(false);
    });

    it("should return false when player is powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service["isRolePlayableForNight"](game, ROLE_NAMES.SEER)).toBe(false);
    });

    it("should return true when player is alive and powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      expect(service["isRolePlayableForNight"](game, ROLE_NAMES.SEER)).toBe(true);
    });
  });

  describe("isSourcePlayableForNight", () => {
    it("should return false when source is not a role or a group.", () => {
      const game = createFakeGame();
      expect(service["isSourcePlayableForNight"](game, PLAYER_ATTRIBUTE_NAMES.SHERIFF)).toBe(false);
    });

    it("should call isRolePlayableForNight when source is a role.", () => {
      const game = createFakeGame();
      const isRolePlayableForNightSpy = jest.spyOn(service as unknown as { isRolePlayableForNight }, "isRolePlayableForNight");
      service["isSourcePlayableForNight"](game, ROLE_NAMES.SEER);
      expect(isRolePlayableForNightSpy).toHaveBeenCalledWith(game, ROLE_NAMES.SEER);
    });

    it("should call isGroupPlayableForNight when source is a group.", () => {
      const game = createFakeGame();
      const isGroupPlayableForNightSpy = jest.spyOn(service as unknown as { isGroupPlayableForNight }, "isGroupPlayableForNight");
      service["isSourcePlayableForNight"](game, PLAYER_GROUPS.ALL);
      expect(isGroupPlayableForNightSpy).toHaveBeenCalledWith(game, PLAYER_GROUPS.ALL);
    });
  });
});