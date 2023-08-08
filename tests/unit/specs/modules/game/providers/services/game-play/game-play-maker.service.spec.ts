import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import lodash from "lodash";
import type { MakeGamePlayVoteWithRelationsDto } from "../../../../../../../../src/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import { GAME_PLAY_CAUSES, WITCH_POTIONS } from "../../../../../../../../src/modules/game/enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../../../../../../src/modules/game/enums/player.enum";
import * as GameMutator from "../../../../../../../../src/modules/game/helpers/game.mutator";
import { GamePlayMakerService } from "../../../../../../../../src/modules/game/providers/services/game-play/game-play-maker.service";
import { GamePlayVoteService } from "../../../../../../../../src/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import { PlayerKillerService } from "../../../../../../../../src/modules/game/providers/services/player/player-killer.service";
import type { Game } from "../../../../../../../../src/modules/game/schemas/game.schema";
import type { Player } from "../../../../../../../../src/modules/game/schemas/player/player.schema";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../../../../src/modules/role/enums/role.enum";
import * as UnexpectedExceptionFactory from "../../../../../../../../src/shared/exception/helpers/unexpected-exception.factory";
import { createFakeMakeGamePlayTargetWithRelationsDto } from "../../../../../../../factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-target-with-relations.dto.factory";
import { createFakeMakeGamePlayVoteWithRelationsDto } from "../../../../../../../factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-vote-with-relations.dto.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "../../../../../../../factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { bulkCreateFakeGameAdditionalCards, createFakeGameAdditionalCard } from "../../../../../../../factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeFoxGameOptions, createFakeRolesGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGamePlayAllElectSheriff, createFakeGamePlayAllVote, createFakeGamePlayBigBadWolfEats, createFakeGamePlayCupidCharms, createFakeGamePlayDogWolfChoosesSide, createFakeGamePlayFoxSniffs, createFakeGamePlayGuardProtects, createFakeGamePlayHunterShoots, createFakeGamePlayPiedPiperCharms, createFakeGamePlayRavenMarks, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySeerLooks, createFakeGamePlaySheriffDelegates, createFakeGamePlaySheriffSettlesVotes, createFakeGamePlayThiefChoosesCard, createFakeGamePlayTwoSistersMeetEachOther, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWildChildChoosesModel, createFakeGamePlayWitchUsesPotions } from "../../../../../../../factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakeCantVoteByScapegoatPlayerAttribute, createFakeCharmedByPiedPiperPlayerAttribute, createFakeDrankDeathPotionByWitchPlayerAttribute, createFakeDrankLifePotionByWitchPlayerAttribute, createFakeEatenByBigBadWolfPlayerAttribute, createFakeEatenByWerewolvesPlayerAttribute, createFakeEatenByWhiteWerewolfPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakePowerlessByAncientPlayerAttribute, createFakePowerlessByFoxPlayerAttribute, createFakeProtectedByGuardPlayerAttribute, createFakeRavenMarkedByRavenPlayerAttribute, createFakeSeenBySeerPlayerAttribute, createFakeSheriffByAllPlayerAttribute, createFakeSheriffBySheriffPlayerAttribute, createFakeWorshipedByWildChildPlayerAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayerShotByHunterDeath, createFakePlayerVoteByAllDeath, createFakePlayerVoteBySheriffDeath, createFakePlayerVoteScapegoatedByAllDeath } from "../../../../../../../factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeAncientAlivePlayer, createFakeDogWolfAlivePlayer, createFakeFoxAlivePlayer, createFakeRavenAlivePlayer, createFakeScapegoatAlivePlayer, createFakeSeerAlivePlayer, createFakeThiefAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer } from "../../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers, createFakePlayer } from "../../../../../../../factories/game/schemas/player/player.schema.factory";

describe("Game Play Maker Service", () => {
  let services: { gamePlayMaker: GamePlayMakerService };
  let mocks: {
    playerKillerService: {
      killOrRevealPlayer: jest.SpyInstance;
      isAncientKillable: jest.SpyInstance;
    };
    gamePlayVoteService: { getNominatedPlayers: jest.SpyInstance };
    unexpectedExceptionFactory: {
      createNoCurrentGamePlayUnexpectedException: jest.SpyInstance;
    };
  };

  beforeEach(async() => {
    mocks = {
      playerKillerService: {
        killOrRevealPlayer: jest.fn(),
        isAncientKillable: jest.fn(),
      },
      gamePlayVoteService: { getNominatedPlayers: jest.fn() },
      unexpectedExceptionFactory: { createNoCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoCurrentGamePlayUnexpectedException").mockImplementation() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamePlayMakerService,
        {
          provide: GamePlayVoteService,
          useValue: mocks.gamePlayVoteService,
        },
        {
          provide: PlayerKillerService,
          useValue: mocks.playerKillerService,
        },
      ],
    }).compile();

    services = { gamePlayMaker: module.get<GamePlayMakerService>(GamePlayMakerService) };
  });

  describe("gameSourcePlayMethods", () => {
    it("should contain play methods from game play sources when accessed.", () => {
      expect(services.gamePlayMaker["gameSourcePlayMethods"][PLAYER_GROUPS.WEREWOLVES]).toStrictEqual(expect.any(Function));
      expect(services.gamePlayMaker["gameSourcePlayMethods"][ROLE_NAMES.FOX]).toStrictEqual(expect.any(Function));
      expect(services.gamePlayMaker["gameSourcePlayMethods"][PLAYER_ATTRIBUTE_NAMES.SHERIFF]).toStrictEqual(expect.any(Function));
    });
  });

  describe("makeGamePlay", () => {
    let localMocks: {
      gamePlayMakerService: {
        werewolvesEat: jest.SpyInstance;
        bigBadWolfEats: jest.SpyInstance;
        whiteWerewolfEats: jest.SpyInstance;
        seerLooks: jest.SpyInstance;
        cupidCharms: jest.SpyInstance;
        piedPiperCharms: jest.SpyInstance;
        witchUsesPotions: jest.SpyInstance;
        hunterShoots: jest.SpyInstance;
        guardProtects: jest.SpyInstance;
        foxSniffs: jest.SpyInstance;
        wildChildChoosesModel: jest.SpyInstance;
        dogWolfChoosesSide: jest.SpyInstance;
        scapegoatBansVoting: jest.SpyInstance;
        thiefChoosesCard: jest.SpyInstance;
        allPlay: jest.SpyInstance;
        ravenMarks: jest.SpyInstance;
        sheriffPlays: jest.SpyInstance;
      };
    };
    
    beforeEach(() => {
      localMocks = {
        gamePlayMakerService: {
          werewolvesEat: jest.spyOn(services.gamePlayMaker as unknown as { werewolvesEat }, "werewolvesEat").mockImplementation(),
          bigBadWolfEats: jest.spyOn(services.gamePlayMaker as unknown as { bigBadWolfEats }, "bigBadWolfEats").mockImplementation(),
          whiteWerewolfEats: jest.spyOn(services.gamePlayMaker as unknown as { whiteWerewolfEats }, "whiteWerewolfEats").mockImplementation(),
          seerLooks: jest.spyOn(services.gamePlayMaker as unknown as { seerLooks }, "seerLooks").mockImplementation(),
          cupidCharms: jest.spyOn(services.gamePlayMaker as unknown as { cupidCharms }, "cupidCharms").mockImplementation(),
          piedPiperCharms: jest.spyOn(services.gamePlayMaker as unknown as { piedPiperCharms }, "piedPiperCharms").mockImplementation(),
          witchUsesPotions: jest.spyOn(services.gamePlayMaker as unknown as { witchUsesPotions }, "witchUsesPotions").mockImplementation(),
          hunterShoots: jest.spyOn(services.gamePlayMaker as unknown as { hunterShoots }, "hunterShoots").mockImplementation(),
          guardProtects: jest.spyOn(services.gamePlayMaker as unknown as { guardProtects }, "guardProtects").mockImplementation(),
          foxSniffs: jest.spyOn(services.gamePlayMaker as unknown as { foxSniffs }, "foxSniffs").mockImplementation(),
          wildChildChoosesModel: jest.spyOn(services.gamePlayMaker as unknown as { wildChildChoosesModel }, "wildChildChoosesModel").mockImplementation(),
          dogWolfChoosesSide: jest.spyOn(services.gamePlayMaker as unknown as { dogWolfChoosesSide }, "dogWolfChoosesSide").mockImplementation(),
          scapegoatBansVoting: jest.spyOn(services.gamePlayMaker as unknown as { scapegoatBansVoting }, "scapegoatBansVoting").mockImplementation(),
          thiefChoosesCard: jest.spyOn(services.gamePlayMaker as unknown as { thiefChoosesCard }, "thiefChoosesCard").mockImplementation(),
          allPlay: jest.spyOn(services.gamePlayMaker as unknown as { allPlay }, "allPlay").mockImplementation(),
          ravenMarks: jest.spyOn(services.gamePlayMaker as unknown as { ravenMarks }, "ravenMarks").mockImplementation(),
          sheriffPlays: jest.spyOn(services.gamePlayMaker as unknown as { sheriffPlays }, "sheriffPlays").mockImplementation(),
        },
      };
    });

    it("should throw error when game's current play is not set.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame();
      const interpolations = { gameId: game._id };

      await expect(services.gamePlayMaker.makeGamePlay(play, game)).toReject();
      expect(mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("makeGamePlay", interpolations);
    });

    it("should call no play method when source is not in available methods.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayTwoSistersMeetEachOther() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      const gamePlayMakerServiceMockKeys = Object.keys(localMocks.gamePlayMakerService);
      for (const gamePlayMakerServiceMockKey of gamePlayMakerServiceMockKeys) {
        expect(localMocks.gamePlayMakerService[gamePlayMakerServiceMockKey]).not.toHaveBeenCalled();
      }
    });

    it("should return game as is when source is not in available methods.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayTwoSistersMeetEachOther() });

      await expect(services.gamePlayMaker.makeGamePlay(play, game)).resolves.toStrictEqual<Game>(game);
    });

    it("should call werewolvesEat method when it's werewolves turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayWerewolvesEat() });
      await services.gamePlayMaker.makeGamePlay(play, game);
      
      expect(localMocks.gamePlayMakerService.werewolvesEat).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call bigBadWolfEats method when it's big bad wolf's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayBigBadWolfEats() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.bigBadWolfEats).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call whiteWerewolfEats method when it's white werewolf's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayWhiteWerewolfEats() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.whiteWerewolfEats).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call seerLooks method when it's seer's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlaySeerLooks() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.seerLooks).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call cupidCharms method when it's cupid's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayCupidCharms() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.cupidCharms).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call piedPiperCharms method when it's pied piper's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayPiedPiperCharms() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.piedPiperCharms).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call witchUsesPotions method when it's witch's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.witchUsesPotions).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call hunterShoots method when it's hunter's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayHunterShoots() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.hunterShoots).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call guardProtects method when it's guard's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayGuardProtects() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.guardProtects).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call foxSniffs method when it's fox's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayFoxSniffs() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.foxSniffs).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call wildChildChoosesModel method when it's wild child's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayWildChildChoosesModel() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.wildChildChoosesModel).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call dogWolfChoosesSide method when it's dog wolf's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayDogWolfChoosesSide() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.dogWolfChoosesSide).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call scapegoatBansVoting method when it's scapegoat's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayScapegoatBansVoting() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.scapegoatBansVoting).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call thiefChoosesCard method when it's thief's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayThiefChoosesCard() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.thiefChoosesCard).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call allPlay method when it's all's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayAllVote() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.allPlay).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call ravenMarks method when it's raven's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayRavenMarks() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.ravenMarks).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call sheriffPlays method when it's sheriff's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlaySheriffDelegates() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(localMocks.gamePlayMakerService.sheriffPlays).toHaveBeenCalledExactlyOnceWith(play, game);
    });
  });

  describe("sheriffSettlesVotes", () => {
    it("should return game as is when target count is not the one expected.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGameWithCurrentPlay();
      const expectedGame = createFakeGame(game);

      await expect(services.gamePlayMaker["sheriffSettlesVotes"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should call killOrRevealPlayer method when sheriff delegates to a target.", async() => {
      const targetedPlayer = createFakePlayer();
      const play = createFakeMakeGamePlayWithRelationsDto({ targets: [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })] });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffDelegates() });
      await services.gamePlayMaker["sheriffSettlesVotes"](play, game);

      expect(mocks.playerKillerService.killOrRevealPlayer).toHaveBeenCalledExactlyOnceWith(targetedPlayer._id, game, createFakePlayerVoteBySheriffDeath());
    });
  });

  describe("sheriffDelegates", () => {
    it("should return game as is when target count is not the one expected.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGameWithCurrentPlay();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["sheriffDelegates"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should remove previous sheriff attribute and add it to the target when called.", () => {
      const players = bulkCreateFakePlayers(4, [{ attributes: [createFakeSheriffByAllPlayerAttribute()] }]);
      const play = createFakeMakeGamePlayWithRelationsDto({ targets: [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })] });
      const game = createFakeGameWithCurrentPlay({ players });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer({ ...players[0], attributes: [] }),
          createFakePlayer({ ...players[1], attributes: [createFakeSheriffBySheriffPlayerAttribute()] }),
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["sheriffDelegates"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("sheriffPlays", () => {
    let localMocks: {
      gamePlayMakerService: {
        sheriffDelegates: jest.SpyInstance;
        sheriffSettlesVotes: jest.SpyInstance;
      };
    };
    
    beforeEach(() => {
      localMocks = {
        gamePlayMakerService: {
          sheriffDelegates: jest.spyOn(services.gamePlayMaker as unknown as { sheriffDelegates }, "sheriffDelegates").mockImplementation(),
          sheriffSettlesVotes: jest.spyOn(services.gamePlayMaker as unknown as { sheriffSettlesVotes }, "sheriffSettlesVotes").mockImplementation(),
        },
      };
    });
    
    it("should return game as is when upcoming play is not for sheriff.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs() });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      await expect(services.gamePlayMaker["sheriffPlays"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should call sheriffDelegates method when upcoming play is sheriff role delegation.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffDelegates() });
      const play = createFakeMakeGamePlayWithRelationsDto();
      await services.gamePlayMaker["sheriffPlays"](play, game);

      expect(localMocks.gamePlayMakerService.sheriffDelegates).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call sheriffSettlesVotes method when upcoming play is sheriff settling vote.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffSettlesVotes() });
      const play = createFakeMakeGamePlayWithRelationsDto();
      await services.gamePlayMaker["sheriffPlays"](play, game);

      expect(localMocks.gamePlayMakerService.sheriffSettlesVotes).toHaveBeenCalledExactlyOnceWith(play, game);
    });
  });

  describe("handleTieInVotes", () => {
    let localMocks: { gameMutator: { prependUpcomingPlayInGame: jest.SpyInstance } };

    beforeEach(() => {
      localMocks = { gameMutator: { prependUpcomingPlayInGame: jest.spyOn(GameMutator, "prependUpcomingPlayInGame") } };
    });

    it("should not kill scapegoat when he's not the game.", async() => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      await services.gamePlayMaker["handleTieInVotes"](game);

      expect(mocks.playerKillerService.killOrRevealPlayer).not.toHaveBeenCalled();
    });

    it("should not kill scapegoat when he's dead.", async() => {
      const players: Player[] = [
        createFakeScapegoatAlivePlayer({ isAlive: false }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      await services.gamePlayMaker["handleTieInVotes"](game);

      expect(mocks.playerKillerService.killOrRevealPlayer).not.toHaveBeenCalled();
    });

    it("should not kill scapegoat when he's powerless.", async() => {
      const players: Player[] = [
        createFakeScapegoatAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      await services.gamePlayMaker["handleTieInVotes"](game);

      expect(mocks.playerKillerService.killOrRevealPlayer).not.toHaveBeenCalled();
    });

    it("should kill scapegoat when he's in the game and alive.", async() => {
      const players: Player[] = [
        createFakeScapegoatAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const playerDeath = createFakePlayerVoteScapegoatedByAllDeath();
      await services.gamePlayMaker["handleTieInVotes"](game);

      expect(mocks.playerKillerService.killOrRevealPlayer).toHaveBeenCalledExactlyOnceWith(players[0]._id, game, playerDeath);
    });

    it("should not prepend sheriff delegation game play when sheriff is not in the game.", async() => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const gamePlaySheriffSettlesVotes = createFakeGamePlaySheriffSettlesVotes();
      await services.gamePlayMaker["handleTieInVotes"](game);

      expect(localMocks.gameMutator.prependUpcomingPlayInGame).not.toHaveBeenCalledWith(gamePlaySheriffSettlesVotes, game);
    });

    it("should not prepend sheriff delegation game play when sheriff is dead.", async() => {
      const players: Player[] = [
        createFakeSeerAlivePlayer({ isAlive: false, attributes: [createFakeSheriffByAllPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const gamePlaySheriffSettlesVotes = createFakeGamePlaySheriffSettlesVotes();
      await services.gamePlayMaker["handleTieInVotes"](game);

      expect(localMocks.gameMutator.prependUpcomingPlayInGame).not.toHaveBeenCalledWith(gamePlaySheriffSettlesVotes, game);
    });

    it("should prepend sheriff delegation game play when sheriff is in the game.", async() => {
      const players: Player[] = [
        createFakeSeerAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const gamePlaySheriffSettlesVotes = createFakeGamePlaySheriffSettlesVotes();
      await services.gamePlayMaker["handleTieInVotes"](game);

      expect(localMocks.gameMutator.prependUpcomingPlayInGame).toHaveBeenCalledExactlyOnceWith(gamePlaySheriffSettlesVotes, game);
    });

    it("should prepend vote game play when previous play is not a tie.", async() => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const gamePlayAllVote = createFakeGamePlayAllVote({ cause: GAME_PLAY_CAUSES.PREVIOUS_VOTES_WERE_IN_TIES });
      await services.gamePlayMaker["handleTieInVotes"](game);

      expect(localMocks.gameMutator.prependUpcomingPlayInGame).toHaveBeenCalledExactlyOnceWith(gamePlayAllVote, game);
    });

    it("should prepend vote game play when there is no game history records.", async() => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const gamePlayAllVote = createFakeGamePlayAllVote({ cause: GAME_PLAY_CAUSES.PREVIOUS_VOTES_WERE_IN_TIES });
      await services.gamePlayMaker["handleTieInVotes"](game);

      expect(localMocks.gameMutator.prependUpcomingPlayInGame).toHaveBeenCalledExactlyOnceWith(gamePlayAllVote, game);
    });

    it("should not prepend vote game play when current play is due to a tie.", async() => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const currentPlay = createFakeGamePlayAllVote({ cause: GAME_PLAY_CAUSES.PREVIOUS_VOTES_WERE_IN_TIES });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay });
      const expectedGame = createFakeGame(game);

      await expect(services.gamePlayMaker["handleTieInVotes"](game)).resolves.toStrictEqual<Game>(expectedGame);
    });
  });
  
  describe("allVote", () => {
    let localMocks: {
      gamePlayMakerService: {
        handleTieInVotes: jest.SpyInstance;
      };
    };
      
    beforeEach(() => {
      localMocks = { gamePlayMakerService: { handleTieInVotes: jest.spyOn(services.gamePlayMaker as unknown as { handleTieInVotes }, "handleTieInVotes").mockImplementation() } };
    });
      
    it("should return game as is when there is no vote.", async() => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      await expect(services.gamePlayMaker["allVote"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when there is no nominated players.", async() => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ votes, doesJudgeRequestAnotherVote: false });
      const nominatedPlayers = [];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      const expectedGame = createFakeGame(game);

      await expect(services.gamePlayMaker["allVote"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });
      
    it("should call handleTieInVotes method when there are several nominated players.", async() => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ votes, doesJudgeRequestAnotherVote: false });
      const nominatedPlayers = [players[1], players[2]];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      await services.gamePlayMaker["allVote"](play, game);

      expect(localMocks.gamePlayMakerService.handleTieInVotes).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call handleTieInVotes method with prepended all vote game play from judge when there are several nominated players and judge requested it.", async() => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ votes, doesJudgeRequestAnotherVote: true });
      const nominatedPlayers = [players[1], players[2]];
      const expectedGame = createFakeGameWithCurrentPlay({
        ...game,
        upcomingPlays: [createFakeGamePlayAllVote({ cause: GAME_PLAY_CAUSES.STUTTERING_JUDGE_REQUEST })],
      });
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      await services.gamePlayMaker["allVote"](play, game);

      expect(localMocks.gamePlayMakerService.handleTieInVotes).toHaveBeenCalledExactlyOnceWith(expectedGame);
    });

    it("should call killOrRevealPlayer method when there is one nominated player.", async() => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ votes, doesJudgeRequestAnotherVote: false });
      const nominatedPlayers = [players[1]];
      const playerVoteByAllDeath = createFakePlayerVoteByAllDeath();
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      await services.gamePlayMaker["allVote"](play, game);

      expect(mocks.playerKillerService.killOrRevealPlayer).toHaveBeenCalledExactlyOnceWith(players[1]._id, game, playerVoteByAllDeath);
    });
  });

  describe("handleTieInSheriffElection", () => {
    let localMocks: { lodash: { sample: jest.SpyInstance } };
    
    beforeEach(() => {
      localMocks = { lodash: { sample: jest.spyOn(lodash, "sample").mockImplementation() } };
    });
    
    it("should prepend all elect sheriff game play when current play is not due to a tie.", () => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const currentPlay = createFakeGamePlayAllElectSheriff({ cause: GAME_PLAY_CAUSES.STUTTERING_JUDGE_REQUEST });
      const upcomingPlays = [createFakeGamePlayHunterShoots()];
      const game = createFakeGameWithCurrentPlay({ currentPlay, players, upcomingPlays });
      const nominatedPlayers = [players[0], players[1]];
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [createFakeGamePlayAllElectSheriff({ cause: GAME_PLAY_CAUSES.PREVIOUS_VOTES_WERE_IN_TIES }), ...upcomingPlays],
      });

      expect(services.gamePlayMaker["handleTieInSheriffElection"](nominatedPlayers, game)).toStrictEqual<Game>(expectedGame);
    });
    
    it("should add sheriff attribute to a random nominated player when current play is due to a tie.", () => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      localMocks.lodash.sample.mockReturnValue(players[0]);
      const currentPlay = createFakeGamePlayAllElectSheriff({ cause: GAME_PLAY_CAUSES.PREVIOUS_VOTES_WERE_IN_TIES });
      const upcomingPlays = [createFakeGamePlayHunterShoots()];
      const game = createFakeGameWithCurrentPlay({ currentPlay, players, upcomingPlays });
      const nominatedPlayers = [players[0], players[1]];
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer({
            ...players[0],
            attributes: [createFakeSheriffByAllPlayerAttribute()],
          }),
          players[1],
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["handleTieInSheriffElection"](nominatedPlayers, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when it's not possible to choose a random nominated player.", () => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      localMocks.lodash.sample.mockReturnValue(undefined);
      const currentPlay = createFakeGamePlayAllElectSheriff({ cause: GAME_PLAY_CAUSES.PREVIOUS_VOTES_WERE_IN_TIES });
      const upcomingPlays = [createFakeGamePlayHunterShoots()];
      const game = createFakeGameWithCurrentPlay({ currentPlay, players, upcomingPlays });
      const nominatedPlayers = [players[0], players[1]];
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["handleTieInSheriffElection"](nominatedPlayers, game)).toStrictEqual<Game>(expectedGame);
    });
  });
  
  describe("allElectSheriff", () => {
    let localMocks: {
      gamePlayMakerService: {
        handleTieInSheriffElection: jest.SpyInstance;
      };
    };
      
    beforeEach(() => {
      localMocks = { gamePlayMakerService: { handleTieInSheriffElection: jest.spyOn(services.gamePlayMaker as unknown as { handleTieInSheriffElection }, "handleTieInSheriffElection").mockImplementation() } };
    });
      
    it("should return game as is when there is no vote.", () => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["allElectSheriff"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when there is no nominated players.", () => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ votes });
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue([]);
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["allElectSheriff"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should call handleTieInSheriffElection method when there is a tie in votes.", () => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ votes });
      const nominatedPlayers = [players[0], players[1]];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      services.gamePlayMaker["allElectSheriff"](play, game);

      expect(localMocks.gamePlayMakerService.handleTieInSheriffElection).toHaveBeenCalledExactlyOnceWith(nominatedPlayers, game);
    });

    it("should add sheriff attribute to nominated player when called.", () => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ votes });
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue([players[1]]);
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          createFakePlayer({ ...players[1], attributes: [createFakeSheriffByAllPlayerAttribute()] }),
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["allElectSheriff"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("allPlay", () => {
    let localMocks: {
      gamePlayMakerService: {
        allElectSheriff: jest.SpyInstance;
        allVote: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayMakerService: {
          allElectSheriff: jest.spyOn(services.gamePlayMaker as unknown as { allElectSheriff }, "allElectSheriff").mockImplementation(),
          allVote: jest.spyOn(services.gamePlayMaker as unknown as { allVote }, "allVote").mockImplementation(),
        },
      };
    });

    it("should return game as is when upcoming play is not for all.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs() });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      await expect(services.gamePlayMaker["allPlay"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should call allElectSheriff method when upcoming play is sheriff role delegation.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayAllElectSheriff() });
      const play = createFakeMakeGamePlayWithRelationsDto();
      await services.gamePlayMaker["allPlay"](play, game);

      expect(localMocks.gamePlayMakerService.allElectSheriff).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call allVote method when upcoming play is sheriff settling vote.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayAllVote() });
      const play = createFakeMakeGamePlayWithRelationsDto();
      await services.gamePlayMaker["allPlay"](play, game);

      expect(localMocks.gamePlayMakerService.allVote).toHaveBeenCalledExactlyOnceWith(play, game);
    });
  });

  describe("thiefChoosesCard", () => {
    it("should return game as is when there is no thief player in game.", () => {
      const players: Player[] = [
        createFakeSeerAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const additionalCards = bulkCreateFakeGameAdditionalCards(4);
      const game = createFakeGameWithCurrentPlay({ players, additionalCards });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenCard: additionalCards[0] });
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["thiefChoosesCard"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when there is no chosen card.", () => {
      const players: Player[] = [
        createFakeThiefAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const additionalCards = bulkCreateFakeGameAdditionalCards(4);
      const game = createFakeGameWithCurrentPlay({ players, additionalCards });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["thiefChoosesCard"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when chosen card role is unknown.", () => {
      const players: Player[] = [
        createFakeThiefAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const additionalCards = bulkCreateFakeGameAdditionalCards(4);
      const game = createFakeGameWithCurrentPlay({ players, additionalCards });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenCard: createFakeGameAdditionalCard({}, { roleName: "Toto" }) });
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["thiefChoosesCard"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should update thief role and side when called.", () => {
      const players: Player[] = [
        createFakeThiefAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const additionalCards = bulkCreateFakeGameAdditionalCards(4, [createFakeGameAdditionalCard({ roleName: ROLE_NAMES.WEREWOLF })]);
      const game = createFakeGameWithCurrentPlay({ players, additionalCards });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenCard: additionalCards[0] });
      const expectedThiefPlayer = createFakePlayer({
        ...players[0],
        role: { ...players[0].role, current: ROLE_NAMES.WEREWOLF },
        side: { ...players[0].side, current: ROLE_SIDES.WEREWOLVES },
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          expectedThiefPlayer,
          players[1],
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["thiefChoosesCard"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("scapegoatBansVoting", () => {
    it("should return game as is when there are no targets.", () => {
      const players: Player[] = [
        createFakeThiefAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["scapegoatBansVoting"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add scapegoat ban voting attributes to targets when called.", () => {
      const players: Player[] = [
        createFakeThiefAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: players[2] }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          createFakePlayer({ ...players[1], attributes: [createFakeCantVoteByScapegoatPlayerAttribute(game)] }),
          createFakePlayer({ ...players[2], attributes: [createFakeCantVoteByScapegoatPlayerAttribute(game)] }),
          players[3],
        ],
      });

      expect(services.gamePlayMaker["scapegoatBansVoting"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("dogWolfChoosesSide", () => {
    it("should return game as is when chosen side is not set.", () => {
      const players: Player[] = [
        createFakeDogWolfAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["dogWolfChoosesSide"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when there is no dog wolf in the game.", () => {
      const players: Player[] = [
        createFakeThiefAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenSide: ROLE_SIDES.WEREWOLVES });
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["dogWolfChoosesSide"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return dog wolf on the werewolves side when called.", () => {
      const players: Player[] = [
        createFakeRavenAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenSide: ROLE_SIDES.WEREWOLVES });
      const expectedDogWolfPlayer = createFakePlayer({
        ...players[1],
        side: { ...players[1].side, current: ROLE_SIDES.WEREWOLVES },
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedDogWolfPlayer,
          players[2],
          players[3],
        ],
      });
      
      expect(services.gamePlayMaker["dogWolfChoosesSide"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("wildChildChoosesModel", () => {
    it("should return game as is when expected target count is not reached.", () => {
      const players: Player[] = [
        createFakeDogWolfAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["wildChildChoosesModel"](play, game)).toStrictEqual<Game>(expectedGame);
    });
    
    it("should add worshiped attribute to target when called.", () => {
      const players: Player[] = [
        createFakeDogWolfAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        attributes: [createFakeWorshipedByWildChildPlayerAttribute()],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedTargetedPlayer,
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["wildChildChoosesModel"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("foxSniffs", () => {
    it("should return game as is when expected target count is not reached.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer({ position: 0 }),
        createFakeRavenAlivePlayer({ position: 1 }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeWerewolfAlivePlayer({ position: 3 }),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["foxSniffs"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when there is no fox in the game.", () => {
      const players: Player[] = [
        createFakeSeerAlivePlayer({ position: 0 }),
        createFakeRavenAlivePlayer({ position: 1 }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeWerewolfAlivePlayer({ position: 3 }),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["foxSniffs"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when fox is not powerless if misses werewolves by game options.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer({ position: 0 }),
        createFakeRavenAlivePlayer({ position: 1 }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeWerewolfAlivePlayer({ position: 3 }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ fox: createFakeFoxGameOptions({ isPowerlessIfMissesWerewolf: false }) }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["foxSniffs"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when fox sniffes a werewolf in the group.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer({ position: 0 }),
        createFakeRavenAlivePlayer({ position: 1 }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeWerewolfAlivePlayer({ position: 3 }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ fox: createFakeFoxGameOptions({ isPowerlessIfMissesWerewolf: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["foxSniffs"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should make fox powerless when there is no werewolf in the group.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer({ position: 0 }),
        createFakeRavenAlivePlayer({ position: 1 }),
        createFakeVillagerAlivePlayer({ position: 2 }),
        createFakeWerewolfAlivePlayer({ position: 3 }),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ fox: createFakeFoxGameOptions({ isPowerlessIfMissesWerewolf: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedTargetedPlayer = createFakePlayer({
        ...players[0],
        attributes: [createFakePowerlessByFoxPlayerAttribute({ doesRemainAfterDeath: true })],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          expectedTargetedPlayer,
          players[1],
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["foxSniffs"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("ravenMarks", () => {
    it("should return game as is when expected target count is not reached.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["ravenMarks"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add raven marked attribute to target when called.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        attributes: [createFakeRavenMarkedByRavenPlayerAttribute()],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedTargetedPlayer,
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["ravenMarks"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("guardProtects", () => {
    it("should return game as is when expected target count is not reached.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["guardProtects"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add protected attribute to target when called.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        attributes: [createFakeProtectedByGuardPlayerAttribute()],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedTargetedPlayer,
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["guardProtects"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("hunterShoots", () => {
    it("should return game as is when expected target count is not reached.", async() => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      await expect(services.gamePlayMaker["hunterShoots"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should call killOrRevealPlayer method when called.", async() => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const playerDeath = createFakePlayerShotByHunterDeath();
      await services.gamePlayMaker["hunterShoots"](play, game);

      expect(mocks.playerKillerService.killOrRevealPlayer).toHaveBeenCalledExactlyOnceWith(players[1]._id, game, playerDeath);
    });
  });

  describe("witchUsesPotions", () => {
    it("should return game as is when expected target count is not reached.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["witchUsesPotions"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add only one potion attributes to targets when called.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1], drankPotion: WITCH_POTIONS.LIFE })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        attributes: [createFakeDrankLifePotionByWitchPlayerAttribute()],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedTargetedPlayer,
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["witchUsesPotions"](play, game)).toStrictEqual<Game>(expectedGame);
    });
    
    it("should add both potion attributes to targets when called.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1], drankPotion: WITCH_POTIONS.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: players[2], drankPotion: WITCH_POTIONS.DEATH }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedFirstTargetedPlayer = createFakePlayer({
        ...players[1],
        attributes: [createFakeDrankLifePotionByWitchPlayerAttribute()],
      });
      const expectedSecondTargetedPlayer = createFakePlayer({
        ...players[2],
        attributes: [createFakeDrankDeathPotionByWitchPlayerAttribute()],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedFirstTargetedPlayer,
          expectedSecondTargetedPlayer,
          players[3],
        ],
      });

      expect(services.gamePlayMaker["witchUsesPotions"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("piedPiperCharms", () => {
    it("should return game as is when targets are undefined.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["piedPiperCharms"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when targets are empty.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto({ targets: [] });
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["piedPiperCharms"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add pied piper charmed attributes to targets when called.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: players[2] }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedFirstTargetedPlayer = createFakePlayer({
        ...players[1],
        attributes: [createFakeCharmedByPiedPiperPlayerAttribute()],
      });
      const expectedSecondTargetedPlayer = createFakePlayer({
        ...players[2],
        attributes: [createFakeCharmedByPiedPiperPlayerAttribute()],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedFirstTargetedPlayer,
          expectedSecondTargetedPlayer,
          players[3],
        ],
      });

      expect(services.gamePlayMaker["piedPiperCharms"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("cupidCharms", () => {
    it("should return game as is when expected target count is not reached.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["cupidCharms"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add in-love attribute to targets when called.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: players[2] }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedFirstTargetedPlayer = createFakePlayer({
        ...players[1],
        attributes: [createFakeInLoveByCupidPlayerAttribute()],
      });
      const expectedSecondTargetedPlayer = createFakePlayer({
        ...players[2],
        attributes: [createFakeInLoveByCupidPlayerAttribute()],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedFirstTargetedPlayer,
          expectedSecondTargetedPlayer,
          players[3],
        ],
      });

      expect(services.gamePlayMaker["cupidCharms"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("seerLooks", () => {
    it("should return game as is when expected target count is not reached.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["seerLooks"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add seen attribute to target when called.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        attributes: [createFakeSeenBySeerPlayerAttribute()],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedTargetedPlayer,
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["seerLooks"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("whiteWerewolfEats", () => {
    it("should return game as is when expected target count is not reached.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["whiteWerewolfEats"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add eaten attribute by white werewolf to target when called.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        attributes: [createFakeEatenByWhiteWerewolfPlayerAttribute()],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedTargetedPlayer,
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["whiteWerewolfEats"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("bigBadWolfEats", () => {
    it("should return game as is when expected target count is not reached.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["bigBadWolfEats"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add eaten attribute by big bad wolf to target when called.", () => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        attributes: [createFakeEatenByBigBadWolfPlayerAttribute()],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedTargetedPlayer,
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["bigBadWolfEats"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("werewolvesEat", () => {
    it("should return game as is when expected target count is not reached.", async() => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      await expect(services.gamePlayMaker["werewolvesEat"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should add eaten attribute by werewolves to target when target is not infected.", async() => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1], isInfected: false })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      mocks.playerKillerService.isAncientKillable.mockReturnValue(false);
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        attributes: [createFakeEatenByWerewolvesPlayerAttribute()],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedTargetedPlayer,
          players[2],
          players[3],
        ],
      });

      await expect(services.gamePlayMaker["werewolvesEat"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should add eaten attribute by werewolves to target when target is infected but not killable ancient.", async() => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeAncientAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1], isInfected: true })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      mocks.playerKillerService.isAncientKillable.mockReturnValue(false);
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        attributes: [createFakeEatenByWerewolvesPlayerAttribute()],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedTargetedPlayer,
          players[2],
          players[3],
        ],
      });

      await expect(services.gamePlayMaker["werewolvesEat"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should change target side to werewolves when he's infected and not the ancient.", async() => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1], isInfected: true })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      mocks.playerKillerService.isAncientKillable.mockReturnValue(false);
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        side: { ...players[1].side, current: ROLE_SIDES.WEREWOLVES },
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedTargetedPlayer,
          players[2],
          players[3],
        ],
      });

      await expect(services.gamePlayMaker["werewolvesEat"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should change target side to werewolves when he's infected and killable as ancient.", async() => {
      const players: Player[] = [
        createFakeFoxAlivePlayer(),
        createFakeAncientAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1], isInfected: true })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      mocks.playerKillerService.isAncientKillable.mockReturnValue(true);
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        side: { ...players[1].side, current: ROLE_SIDES.WEREWOLVES },
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedTargetedPlayer,
          players[2],
          players[3],
        ],
      });

      await expect(services.gamePlayMaker["werewolvesEat"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });
  });
});