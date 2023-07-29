import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { defaultGameOptions } from "../../../../../../../../src/modules/game/constants/game-options/game-options.constant";
import { GAME_PLAY_ACTIONS, GAME_PLAY_CAUSES } from "../../../../../../../../src/modules/game/enums/game-play.enum";
import { GAME_PHASES } from "../../../../../../../../src/modules/game/enums/game.enum";
import { PLAYER_GROUPS } from "../../../../../../../../src/modules/game/enums/player.enum";
import * as GameHelper from "../../../../../../../../src/modules/game/helpers/game.helper";
import * as PlayerHelper from "../../../../../../../../src/modules/game/helpers/player/player.helper";
import { GamePlayService } from "../../../../../../../../src/modules/game/providers/services/game-play/game-play.service";
import type { GamePlay } from "../../../../../../../../src/modules/game/schemas/game-play.schema";
import type { Game } from "../../../../../../../../src/modules/game/schemas/game.schema";
import { ROLE_NAMES } from "../../../../../../../../src/modules/role/enums/role.enum";
import { createFakeGameOptionsDto } from "../../../../../../../factories/game/dto/create-game/create-game-options/create-game-options.dto.factory";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "../../../../../../../factories/game/dto/create-game/create-game.dto.factory";
import { createFakeGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeRolesGameOptions, createFakeSheriffGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGamePlay, createFakeGamePlayAllElectSheriff, createFakeGamePlayAllVote, createFakeGamePlayBigBadWolfEats, createFakeGamePlayCharmedMeetEachOther, createFakeGamePlayFoxSniffs, createFakeGamePlayHunterShoots, createFakeGamePlayLoversMeetEachOther, createFakeGamePlayPiedPiperCharms, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySeerLooks, createFakeGamePlaySheriffDelegates, createFakeGamePlayThreeBrothersMeetEachOther, createFakeGamePlayTwoSistersMeetEachOther, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWitchUsesPotions } from "../../../../../../../factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakeInLoveByCupidPlayerAttribute, createFakePowerlessByAncientPlayerAttribute, createFakeSheriffByAllPlayerAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeAngelAlivePlayer, createFakeBigBadWolfAlivePlayer, createFakeCupidAlivePlayer, createFakeDogWolfAlivePlayer, createFakeFoxAlivePlayer, createFakeGuardAlivePlayer, createFakeHunterAlivePlayer, createFakePiedPiperAlivePlayer, createFakeRavenAlivePlayer, createFakeScapegoatAlivePlayer, createFakeSeerAlivePlayer, createFakeStutteringJudgeAlivePlayer, createFakeThiefAlivePlayer, createFakeThreeBrothersAlivePlayer, createFakeTwoSistersAlivePlayer, createFakeVileFatherOfWolvesAlivePlayer, createFakeVillagerAlivePlayer, createFakeVillagerVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer } from "../../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers } from "../../../../../../../factories/game/schemas/player/player.schema.factory";

describe("Game Play Service", () => {
  let services: { gamePlay: GamePlayService };

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [GamePlayService] }).compile();
    
    services = { gamePlay: module.get<GamePlayService>(GamePlayService) };
  });

  describe("removeObsoleteUpcomingPlays", () => {
    it("should return game as is when no game play needs to be removed.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer(),
      ];
      const upcomingPlays = [
        createFakeGamePlaySeerLooks(),
        createFakeGamePlayHunterShoots(),
        createFakeGamePlayWitchUsesPotions(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const game = createFakeGame({ players, upcomingPlays });

      expect(services.gamePlay.removeObsoleteUpcomingPlays(game)).toStrictEqual<Game>(game);
    });

    it("should remove some game plays when players became powerless or died.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeHunterAlivePlayer({ isAlive: false }),
        createFakeWitchAlivePlayer({ isAlive: false }),
      ];
      const upcomingPlays = [
        createFakeGamePlaySeerLooks(),
        createFakeGamePlayHunterShoots(),
        createFakeGamePlayWitchUsesPotions(),
        createFakeGamePlayWerewolvesEat(),
      ];
      const game = createFakeGame({ players, upcomingPlays });
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [
          createFakeGamePlayHunterShoots(),
          createFakeGamePlayWerewolvesEat(),
        ],
      });

      expect(services.gamePlay.removeObsoleteUpcomingPlays(game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("proceedToNextGamePlay", () => {
    it("should return game as is when there is no upcoming plays.", () => {
      const game = createFakeGame();

      expect(services.gamePlay.proceedToNextGamePlay(game)).toStrictEqual<Game>(game);
    });

    it("should make proceed to next game play when called.", () => {
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayAllVote()], currentPlay: createFakeGamePlayFoxSniffs() });
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [],
        currentPlay: game.upcomingPlays[0],
      });

      expect(services.gamePlay.proceedToNextGamePlay(game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("getUpcomingDayPlays", () => {
    it("should get upcoming day plays when called.", () => {
      expect(services.gamePlay.getUpcomingDayPlays()).toStrictEqual<GamePlay[]>([createFakeGamePlayAllVote()]);
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
          createFakeGamePlay({ source: PLAYER_GROUPS.ALL, action: GAME_PLAY_ACTIONS.VOTE, cause: GAME_PLAY_CAUSES.ANGEL_PRESENCE }),
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
      expect(services.gamePlay.getUpcomingNightPlays(game)).toStrictEqual<GamePlay[]>(output);
    });
  });

  describe("isSheriffElectionTime", () => {
    it("should return false when sheriff is not enabled even if it's the time.", () => {
      const sheriffGameOptions = createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GAME_PHASES.NIGHT }, isEnabled: false, hasDoubledVote: false });
      
      expect(services.gamePlay["isSheriffElectionTime"](sheriffGameOptions, 1, GAME_PHASES.NIGHT)).toBe(false);
    });

    it("should return false when it's not the right turn.", () => {
      const sheriffGameOptions = createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GAME_PHASES.NIGHT }, isEnabled: true, hasDoubledVote: false });
      
      expect(services.gamePlay["isSheriffElectionTime"](sheriffGameOptions, 2, GAME_PHASES.NIGHT)).toBe(false);
    });

    it("should return false when it's not the right phase.", () => {
      const sheriffGameOptions = createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GAME_PHASES.DAY }, isEnabled: true, hasDoubledVote: false });
      
      expect(services.gamePlay["isSheriffElectionTime"](sheriffGameOptions, 1, GAME_PHASES.NIGHT)).toBe(false);
    });

    it("should return true when it's the right phase and turn.", () => {
      const sheriffGameOptions = createFakeSheriffGameOptions({ electedAt: { turn: 1, phase: GAME_PHASES.NIGHT }, isEnabled: true, hasDoubledVote: false });
      
      expect(services.gamePlay["isSheriffElectionTime"](sheriffGameOptions, 1, GAME_PHASES.NIGHT)).toBe(true);
    });
  });

  describe("isLoversGamePlaySuitableForCurrentPhase", () => {
    it("should return false when there is no cupid in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WHITE_WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return true when there is cupid in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.CUPID } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](gameDto)).toBe(true);
    });

    it("should return false when there is no cupid in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when there is cupid in the game but he is dead and there is no lovers.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeCupidAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when there is cupid in the game but he is powerless and there is no lovers.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeCupidAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return true when there is cupid alive and powerful and there is no lovers.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeCupidAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });

    it("should return false when cupid is dead but one of the lovers is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeVileFatherOfWolvesAlivePlayer({ isAlive: false, attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeCupidAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });

      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return true when cupid is dead and lovers are alive.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeVileFatherOfWolvesAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeCupidAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });

      expect(services.gamePlay["isLoversGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });
  });

  describe("isAllGamePlaySuitableForCurrentPhase", () => {
    it("should return true when game play's action is ELECT_SHERIFF.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeVillagerVillagerAlivePlayer(),
      ]);
      const game = createFakeGame({ players, turn: 1, phase: GAME_PHASES.DAY });
      const gamePlay = createFakeGamePlayAllElectSheriff();

      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(true);
    });
    
    it("should return true when game play's action is VOTE but reason is not angel presence.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeVillagerVillagerAlivePlayer(),
      ]);
      const game = createFakeGame({ players, turn: 1, phase: GAME_PHASES.DAY });
      const gamePlay = createFakeGamePlayAllVote({ cause: GAME_PLAY_CAUSES.PREVIOUS_VOTES_WERE_IN_TIES });

      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(true);
    });

    it("should return false when there is no angel in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WHITE_WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      const gamePlay = createFakeGamePlayAllVote({ cause: GAME_PLAY_CAUSES.ANGEL_PRESENCE });

      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](gameDto, gamePlay)).toBe(false);
    });

    it("should return true when there is angel in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.ANGEL } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      const gamePlay = createFakeGamePlayAllVote({ cause: GAME_PLAY_CAUSES.ANGEL_PRESENCE });

      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](gameDto, gamePlay)).toBe(true);
    });

    it("should return false when there is no angel in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeVillagerVillagerAlivePlayer(),
      ]);
      const game = createFakeGame({ players, turn: 1, phase: GAME_PHASES.NIGHT });
      const gamePlay = createFakeGamePlayAllVote({ cause: GAME_PLAY_CAUSES.ANGEL_PRESENCE });

      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(false);
    });

    it("should return false when there is angel in the game but he is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players, turn: 1, phase: GAME_PHASES.NIGHT });
      const gamePlay = createFakeGamePlayAllVote({ cause: GAME_PLAY_CAUSES.ANGEL_PRESENCE });
      
      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(false);
    });

    it("should return false when there is angel in the game but he is powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
      ]);
      const game = createFakeGame({ players, turn: 1, phase: GAME_PHASES.NIGHT });
      const gamePlay = createFakeGamePlayAllVote({ cause: GAME_PLAY_CAUSES.ANGEL_PRESENCE });
      
      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(false);
    });

    it("should return true when there is angel in the game alive and powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const game = createFakeGame({ players, turn: 1, phase: GAME_PHASES.NIGHT });
      const gamePlay = createFakeGamePlayAllVote({ cause: GAME_PLAY_CAUSES.ANGEL_PRESENCE });
      
      expect(services.gamePlay["isAllGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(true);
    });
  });

  describe("isGroupGamePlaySuitableForCurrentPhase", () => {
    it("should call all playable method when game plays source group is all.", () => {
      const isAllGamePlaySuitableForCurrentPhaseSpy = jest.spyOn(services.gamePlay as unknown as { isAllGamePlaySuitableForCurrentPhase }, "isAllGamePlaySuitableForCurrentPhase").mockReturnValue(true);
      const game = createFakeGame();
      const gamePlay = createFakeGamePlayAllVote();
      services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(isAllGamePlaySuitableForCurrentPhaseSpy).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call lovers playable method when game plays source group is lovers.", () => {
      const isLoversGamePlaySuitableForCurrentPhaseSpy = jest.spyOn(services.gamePlay as unknown as { isLoversGamePlaySuitableForCurrentPhase }, "isLoversGamePlaySuitableForCurrentPhase");
      const game = createFakeGame();
      const gamePlay = createFakeGamePlayLoversMeetEachOther();
      services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(isLoversGamePlaySuitableForCurrentPhaseSpy).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call charmed playable method when game plays source group is charmed people.", () => {
      const isPiedPiperGamePlaySuitableForCurrentPhaseSpy = jest.spyOn(services.gamePlay as unknown as { isPiedPiperGamePlaySuitableForCurrentPhase }, "isPiedPiperGamePlaySuitableForCurrentPhase");
      const game = createFakeGame();
      const gamePlay = createFakeGamePlayCharmedMeetEachOther();
      services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(isPiedPiperGamePlaySuitableForCurrentPhaseSpy).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should return true when game plays source group is werewolves and game is dto.", () => {
      const gameDto = createFakeCreateGameDto();
      const gamePlay = createFakeGamePlayWerewolvesEat();

      expect(services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](gameDto, gamePlay)).toBe(true);
    });

    it("should return false when game plays source group is villagers and game is dto.", () => {
      const gameDto = createFakeCreateGameDto();
      const gamePlay = createFakeGamePlayWerewolvesEat({ source: PLAYER_GROUPS.VILLAGERS });

      expect(services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](gameDto, gamePlay)).toBe(false);
    });

    it("should return false when game plays source group is werewolves and all are powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeBigBadWolfAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeWitchAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayWerewolvesEat();

      expect(services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(false);
    });

    it("should return true when game plays source group is werewolves and at least one is alive and powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeBigBadWolfAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayWerewolvesEat();

      expect(services.gamePlay["isGroupGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(true);
    });
  });

  describe("isWhiteWerewolfGamePlaySuitableForCurrentPhase", () => {
    it("should return false when white werewolf is not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
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
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
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
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(true);
    });

    it("should return false when white werewolf is not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
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
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
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
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
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
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
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
      
      expect(services.gamePlay["isWhiteWerewolfGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });
  });

  describe("isPiedPiperGamePlaySuitableForCurrentPhase", () => {
    it("should return false when pied piper is not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isPiedPiperGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return true when pied piper is in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.PIED_PIPER } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isPiedPiperGamePlaySuitableForCurrentPhase"](gameDto)).toBe(true);
    });

    it("should return false when pied piper is not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeAngelAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isPiedPiperGamePlaySuitableForCurrentPhase"](game)).toBe(false);
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
      
      expect(services.gamePlay["isPiedPiperGamePlaySuitableForCurrentPhase"](game)).toBe(false);
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
      
      expect(services.gamePlay["isPiedPiperGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });
  });

  describe("isBigBadWolfGamePlaySuitableForCurrentPhase", () => {
    it("should return false when big bad wolf is not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
    });

    it("should return true when big bad wolf is in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.BIG_BAD_WOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](gameDto)).toBe(true);
    });

    it("should return false when big bad wolf is not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return false when big bad wolf is in the game but dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
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
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(false);
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
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(true);
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
      
      expect(services.gamePlay["isBigBadWolfGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });
  });

  describe("isThreeBrothersGamePlaySuitableForCurrentPhase", () => {
    it("should return false when three brothers are not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
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
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
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
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](gameDto)).toBe(true);
    });

    it("should return false when three brothers are not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
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
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
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
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game)).toBe(true);
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
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game)).toBe(true);
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
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
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
      
      expect(services.gamePlay["isThreeBrothersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });
  });

  describe("isTwoSistersGamePlaySuitableForCurrentPhase", () => {
    it("should return false when two sisters are not in the game dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
        { role: { name: ROLE_NAMES.WITCH } },
        { role: { name: ROLE_NAMES.WEREWOLF } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
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
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](gameDto)).toBe(false);
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
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](gameDto)).toBe(true);
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
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
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
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
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
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](game)).toBe(true);
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
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
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
      
      expect(services.gamePlay["isTwoSistersGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });
  });

  describe("isRoleGamePlaySuitableForCurrentPhase", () => {
    it("should return false when player is not in game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySeerLooks();

      expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(false);
    });

    it("should call two sisters method when game play source role is two sisters.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const isTwoSistersGamePlaySuitableForCurrentPhaseSpy = jest.spyOn(services.gamePlay as unknown as { isTwoSistersGamePlaySuitableForCurrentPhase }, "isTwoSistersGamePlaySuitableForCurrentPhase");
      const gamePlay = createFakeGamePlayTwoSistersMeetEachOther();
      services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(isTwoSistersGamePlaySuitableForCurrentPhaseSpy).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call three brothers method when game play source role is three brothers.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeThreeBrothersAlivePlayer(),
        createFakeWitchAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
        createFakeThreeBrothersAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const isThreeBrothersGamePlaySuitableForCurrentPhaseSpy = jest.spyOn(services.gamePlay as unknown as { isThreeBrothersGamePlaySuitableForCurrentPhase }, "isThreeBrothersGamePlaySuitableForCurrentPhase");
      const gamePlay = createFakeGamePlayThreeBrothersMeetEachOther();
      services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(isThreeBrothersGamePlaySuitableForCurrentPhaseSpy).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call big bad wolf method when game plays source role is big bad wolf.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const isBigBadWolfGamePlaySuitableForCurrentPhaseSpy = jest.spyOn(services.gamePlay as unknown as { isBigBadWolfGamePlaySuitableForCurrentPhase }, "isBigBadWolfGamePlaySuitableForCurrentPhase");
      const gamePlay = createFakeGamePlayBigBadWolfEats();
      services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(isBigBadWolfGamePlaySuitableForCurrentPhaseSpy).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call pied piper method when game plays source role is pied piper.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const isPiedPiperGamePlaySuitableForCurrentPhaseSpy = jest.spyOn(services.gamePlay as unknown as { isPiedPiperGamePlaySuitableForCurrentPhase }, "isPiedPiperGamePlaySuitableForCurrentPhase").mockReturnValue(true);
      const gamePlay = createFakeGamePlayPiedPiperCharms();
      services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(isPiedPiperGamePlaySuitableForCurrentPhaseSpy).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call white werewolf method when game plays source role is white werewolf.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeBigBadWolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const isWhiteWerewolfGamePlaySuitableForCurrentPhaseSpy = jest.spyOn(services.gamePlay as unknown as { isWhiteWerewolfGamePlaySuitableForCurrentPhase }, "isWhiteWerewolfGamePlaySuitableForCurrentPhase");
      const gamePlay = createFakeGamePlayWhiteWerewolfEats();
      services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(isWhiteWerewolfGamePlaySuitableForCurrentPhaseSpy).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should return true when game plays source role is hunter and player is dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.HUNTER } },
        { role: { name: ROLE_NAMES.WHITE_WEREWOLF } },
        { role: { name: ROLE_NAMES.VILLAGER_VILLAGER } },
        { role: { name: ROLE_NAMES.LITTLE_GIRL } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      const gamePlay = createFakeGamePlayHunterShoots();

      expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](gameDto, gamePlay)).toBe(true);
    });

    it("should return true when game plays source role is hunter and player is powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeHunterAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayHunterShoots();

      expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(true);
    });

    it("should return false when game plays source role is hunter and player is powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeHunterAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayHunterShoots();

      expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(false);
    });

    it("should return true when game plays source role is scapegoat and player is dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SCAPEGOAT } },
        { role: { name: ROLE_NAMES.WHITE_WEREWOLF } },
        { role: { name: ROLE_NAMES.VILLAGER_VILLAGER } },
        { role: { name: ROLE_NAMES.LITTLE_GIRL } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      const gamePlay = createFakeGamePlayScapegoatBansVoting();

      expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](gameDto, gamePlay)).toBe(true);
    });

    it("should return true when game plays source role is scapegoat and player is powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeScapegoatAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayScapegoatBansVoting();

      expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(true);
    });

    it("should return false when game plays source role is scapegoat and player is powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeScapegoatAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlayScapegoatBansVoting();

      expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(false);
    });

    it("should return true when player is dto.", () => {
      const players = bulkCreateFakeCreateGamePlayerDto(4, [
        { role: { name: ROLE_NAMES.SEER } },
        { role: { name: ROLE_NAMES.WHITE_WEREWOLF } },
        { role: { name: ROLE_NAMES.VILLAGER_VILLAGER } },
        { role: { name: ROLE_NAMES.LITTLE_GIRL } },
      ]);
      const gameDto = createFakeCreateGameDto({ players });
      const gamePlay = createFakeGamePlaySeerLooks();

      expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](gameDto, gamePlay)).toBe(true);
    });

    it("should return false when player is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySeerLooks();

      expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(false);
    });

    it("should return false when player is powerless.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySeerLooks();

      expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(false);
    });

    it("should return true when player is alive and powerful.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeTwoSistersAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeWildChildAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      const gamePlay = createFakeGamePlaySeerLooks();

      expect(services.gamePlay["isRoleGamePlaySuitableForCurrentPhase"](game, gamePlay)).toBe(true);
    });
  });

  describe("isSheriffGamePlaySuitableForCurrentPhase", () => {
    it("should return false when sheriff is not enabled.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ isEnabled: false }) }) });
      const game = createFakeCreateGameDto({ options });
      
      expect(services.gamePlay["isSheriffGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return true when game is dto.", () => {
      const options = createFakeGameOptionsDto({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ isEnabled: true }) }) });
      const game = createFakeCreateGameDto({ options });

      expect(services.gamePlay["isSheriffGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });

    it("should return false when sheriff is not in the game.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeCupidAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ isEnabled: true }) }) });
      const game = createFakeGame({ players, options });

      expect(services.gamePlay["isSheriffGamePlaySuitableForCurrentPhase"](game)).toBe(false);
    });

    it("should return true when sheriff is in the game.", () => {
      const players = [
        createFakeWhiteWerewolfAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] }),
        createFakeCupidAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ isEnabled: true }) }) });
      const game = createFakeGame({ players, options });

      expect(services.gamePlay["isSheriffGamePlaySuitableForCurrentPhase"](game)).toBe(true);
    });
  });

  describe("isGamePlaySuitableForCurrentPhase", () => {
    it("should call isRoleGamePlaySuitableForCurrentPhase when source is a sheriff.", () => {
      const game = createFakeGame();
      const isSheriffGamePlaySuitableForCurrentPhaseSpy = jest.spyOn(services.gamePlay as unknown as { isSheriffGamePlaySuitableForCurrentPhase }, "isSheriffGamePlaySuitableForCurrentPhase");
      const gamePlay = createFakeGamePlaySheriffDelegates();
      services.gamePlay["isGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(isSheriffGamePlaySuitableForCurrentPhaseSpy).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call isRoleGamePlaySuitableForCurrentPhase when source is a role.", () => {
      const game = createFakeGame();
      const isRoleGamePlaySuitableForCurrentPhaseSpy = jest.spyOn(services.gamePlay as unknown as { isRoleGamePlaySuitableForCurrentPhase }, "isRoleGamePlaySuitableForCurrentPhase");
      const gamePlay = createFakeGamePlaySeerLooks();
      services.gamePlay["isGamePlaySuitableForCurrentPhase"](game, gamePlay);

      expect(isRoleGamePlaySuitableForCurrentPhaseSpy).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });

    it("should call isGroupGamePlaySuitableForCurrentPhase when source is a group.", () => {
      const game = createFakeGame();
      const isGroupGamePlaySuitableForCurrentPhaseSpy = jest.spyOn(services.gamePlay as unknown as { isGroupGamePlaySuitableForCurrentPhase }, "isGroupGamePlaySuitableForCurrentPhase");
      const gamePlay = createFakeGamePlayAllVote();
      services.gamePlay["isGamePlaySuitableForCurrentPhase"](game, gamePlay);
      
      expect(isGroupGamePlaySuitableForCurrentPhaseSpy).toHaveBeenCalledExactlyOnceWith(game, gamePlay);
    });
  });
});