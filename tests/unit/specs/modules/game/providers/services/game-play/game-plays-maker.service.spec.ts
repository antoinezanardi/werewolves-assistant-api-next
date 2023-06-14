import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { MakeGamePlayVoteWithRelationsDto } from "../../../../../../../../src/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../../../../../../src/modules/game/enums/player.enum";
import { GamePlaysMakerService } from "../../../../../../../../src/modules/game/providers/services/game-play/game-plays-maker.service";
import { PlayerKillerService } from "../../../../../../../../src/modules/game/providers/services/player/player-killer.service";
import type { GameHistoryRecord } from "../../../../../../../../src/modules/game/schemas/game-history-record/game-history-record.schema";
import type { Game } from "../../../../../../../../src/modules/game/schemas/game.schema";
import type { Player } from "../../../../../../../../src/modules/game/schemas/player/player.schema";
import type { PlayerVoteCount } from "../../../../../../../../src/modules/game/types/game-play.type";
import { ROLE_NAMES } from "../../../../../../../../src/modules/role/enums/role.enum";
import { createFakeMakeGamePlayTargetWithRelationsDto } from "../../../../../../../factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-target-with-relations.dto.factory";
import { createFakeMakeGamePlayVoteWithRelationsDto } from "../../../../../../../factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-vote-with-relations.dto.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "../../../../../../../factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeRavenGameOptions, createFakeRolesGameOptions, createFakeSheriffGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGamePlayAllElectSheriff, createFakeGamePlayAllVote, createFakeGamePlayBigBadWolfEats, createFakeGamePlayCupidCharms, createFakeGamePlayDogWolfChoosesSide, createFakeGamePlayFoxSniffs, createFakeGamePlayGuardProtects, createFakeGamePlayHunterShoots, createFakeGamePlayPiedPiperCharms, createFakeGamePlayRavenMarks, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySeerLooks, createFakeGamePlaySheriffDelegates, createFakeGamePlaySheriffSettlesVotes, createFakeGamePlayThiefChoosesCard, createFakeGamePlayTwoSistersMeetEachOther, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWildChildChoosesModel, createFakeGamePlayWitchUsesPotions } from "../../../../../../../factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakePowerlessByAncientPlayerAttribute, createFakeRavenMarkedByRavenPlayerAttribute, createFakeSheriffByAllPlayerAttribute, createFakeSheriffBySheriffPlayerAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayerVoteBySheriffDeath } from "../../../../../../../factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeAncientAlivePlayer, createFakeFoxAlivePlayer, createFakeRavenAlivePlayer, createFakeScapegoatAlivePlayer, createFakeSeerAlivePlayer, createFakeWerewolfAlivePlayer } from "../../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers, createFakePlayer } from "../../../../../../../factories/game/schemas/player/player.schema.factory";

describe("Game Plays Maker Service", () => {
  let services: { gamePlaysMaker: GamePlaysMakerService };
  let mocks: {
    playerKillerService: {
      killOrRevealPlayer: jest.SpyInstance;
    };
  };

  beforeEach(async() => {
    mocks = { playerKillerService: { killOrRevealPlayer: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamePlaysMakerService,
        {
          provide: PlayerKillerService,
          useValue: mocks.playerKillerService,
        },
      ],
    }).compile();

    services = { gamePlaysMaker: module.get<GamePlaysMakerService>(GamePlaysMakerService) };
  });

  describe("gameSourcePlayMethods", () => {
    it("should contain play methods from game play sources when accessed.", () => {
      expect(services.gamePlaysMaker["gameSourcePlayMethods"][PLAYER_GROUPS.WEREWOLVES]).toStrictEqual(expect.any(Function));
      expect(services.gamePlaysMaker["gameSourcePlayMethods"][ROLE_NAMES.FOX]).toStrictEqual(expect.any(Function));
      expect(services.gamePlaysMaker["gameSourcePlayMethods"][PLAYER_ATTRIBUTE_NAMES.SHERIFF]).toStrictEqual(expect.any(Function));
    });
  });

  describe("makeGamePlay", () => {
    let localMocks: {
      gamePlaysMakerService: {
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
        gamePlaysMakerService: {
          werewolvesEat: jest.fn(),
          bigBadWolfEats: jest.fn(),
          whiteWerewolfEats: jest.fn(),
          seerLooks: jest.fn(),
          cupidCharms: jest.fn(),
          piedPiperCharms: jest.fn(),
          witchUsesPotions: jest.fn(),
          hunterShoots: jest.fn(),
          guardProtects: jest.fn(),
          foxSniffs: jest.fn(),
          wildChildChoosesModel: jest.fn(),
          dogWolfChoosesSide: jest.fn(),
          scapegoatBansVoting: jest.fn(),
          thiefChoosesCard: jest.fn(),
          allPlay: jest.fn(),
          ravenMarks: jest.fn(),
          sheriffPlays: jest.fn(),
        },
      };

      (services.gamePlaysMaker as unknown as { gameSourcePlayMethods }).gameSourcePlayMethods = {
        [PLAYER_GROUPS.WEREWOLVES]: localMocks.gamePlaysMakerService.werewolvesEat,
        [ROLE_NAMES.BIG_BAD_WOLF]: localMocks.gamePlaysMakerService.bigBadWolfEats,
        [ROLE_NAMES.WHITE_WEREWOLF]: localMocks.gamePlaysMakerService.whiteWerewolfEats,
        [ROLE_NAMES.SEER]: localMocks.gamePlaysMakerService.seerLooks,
        [ROLE_NAMES.CUPID]: localMocks.gamePlaysMakerService.cupidCharms,
        [ROLE_NAMES.PIED_PIPER]: localMocks.gamePlaysMakerService.piedPiperCharms,
        [ROLE_NAMES.WITCH]: localMocks.gamePlaysMakerService.witchUsesPotions,
        [ROLE_NAMES.HUNTER]: localMocks.gamePlaysMakerService.hunterShoots,
        [ROLE_NAMES.GUARD]: localMocks.gamePlaysMakerService.guardProtects,
        [ROLE_NAMES.FOX]: localMocks.gamePlaysMakerService.foxSniffs,
        [ROLE_NAMES.WILD_CHILD]: localMocks.gamePlaysMakerService.wildChildChoosesModel,
        [ROLE_NAMES.DOG_WOLF]: localMocks.gamePlaysMakerService.dogWolfChoosesSide,
        [ROLE_NAMES.SCAPEGOAT]: localMocks.gamePlaysMakerService.scapegoatBansVoting,
        [ROLE_NAMES.THIEF]: localMocks.gamePlaysMakerService.thiefChoosesCard,
        [PLAYER_GROUPS.ALL]: localMocks.gamePlaysMakerService.allPlay,
        [ROLE_NAMES.RAVEN]: localMocks.gamePlaysMakerService.ravenMarks,
        [PLAYER_ATTRIBUTE_NAMES.SHERIFF]: localMocks.gamePlaysMakerService.sheriffPlays,
      };
    });

    it("should call no play method when there are no upcoming game play.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      const gamePlaysMakerServiceMockKeys = Object.keys(localMocks.gamePlaysMakerService);
      for (const gamePlaysMakerServiceMockKey of gamePlaysMakerServiceMockKeys) {
        expect(localMocks.gamePlaysMakerService[gamePlaysMakerServiceMockKey]).not.toHaveBeenCalledOnce();
      }
    });

    it("should return game as is when there are no upcoming game play.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [] });
      const gameHistoryRecords: GameHistoryRecord[] = [];

      expect(services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords)).toStrictEqual<Game>(game);
    });

    it("should call no play method when source is not in available methods.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayTwoSistersMeetEachOther()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      const gamePlaysMakerServiceMockKeys = Object.keys(localMocks.gamePlaysMakerService);
      for (const gamePlaysMakerServiceMockKey of gamePlaysMakerServiceMockKeys) {
        expect(localMocks.gamePlaysMakerService[gamePlaysMakerServiceMockKey]).not.toHaveBeenCalledOnce();
      }
    });

    it("should return game as is when source is not in available methods.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayTwoSistersMeetEachOther()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];

      expect(services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords)).toStrictEqual<Game>(game);
    });

    it("should call werewolvesEat method when it's werewolves turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayWerewolvesEat()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);
      
      expect(localMocks.gamePlaysMakerService.werewolvesEat).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.werewolvesEat).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call bigBadWolfEats method when it's big bad wolf's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayBigBadWolfEats()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.bigBadWolfEats).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.bigBadWolfEats).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call whiteWerewolfEats method when it's white werewolf's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayWhiteWerewolfEats()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.whiteWerewolfEats).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.whiteWerewolfEats).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call seerLooks method when it's seer's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlaySeerLooks()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.seerLooks).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.seerLooks).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call cupidCharms method when it's cupid's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayCupidCharms()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.cupidCharms).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.cupidCharms).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call piedPiperCharms method when it's pied piper's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayPiedPiperCharms()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.piedPiperCharms).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.piedPiperCharms).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call witchUsesPotions method when it's witch's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayWitchUsesPotions()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.witchUsesPotions).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.witchUsesPotions).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call hunterShoots method when it's hunter's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayHunterShoots()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.hunterShoots).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.hunterShoots).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call guardProtects method when it's guard's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayGuardProtects()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.guardProtects).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.guardProtects).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call foxSniffs method when it's fox's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayFoxSniffs()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.foxSniffs).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.foxSniffs).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call wildChildChoosesModel method when it's wild child's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayWildChildChoosesModel()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.wildChildChoosesModel).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.wildChildChoosesModel).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call dogWolfChoosesSide method when it's dog wolf's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayDogWolfChoosesSide()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.dogWolfChoosesSide).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.dogWolfChoosesSide).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call scapegoatBansVoting method when it's scapegoat's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayScapegoatBansVoting()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.scapegoatBansVoting).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.scapegoatBansVoting).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call thiefChoosesCard method when it's thief's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayThiefChoosesCard()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.thiefChoosesCard).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.thiefChoosesCard).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call allPlay method when it's all's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayAllVote()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.allPlay).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.allPlay).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call ravenMarks method when it's raven's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayRavenMarks()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.ravenMarks).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.ravenMarks).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });

    it("should call sheriffPlays method when it's sheriff's turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlaySheriffDelegates()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);

      expect(localMocks.gamePlaysMakerService.sheriffPlays).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.sheriffPlays).toHaveBeenCalledWith(play, game, gameHistoryRecords);
    });
  });

  describe("sheriffSettlesVotes", () => {
    it("should return game as is when target count is not the one expected.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame();

      expect(services.gamePlaysMaker["sheriffSettlesVotes"](play, game, [])).toStrictEqual<Game>(game);
    });

    it("should call killPkillOrRevealPlayer method when sheriff delegates to a target.", () => {
      const targetedPlayer = createFakePlayer();
      const play = createFakeMakeGamePlayWithRelationsDto({ targets: [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })] });
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlaySheriffDelegates()] });
      services.gamePlaysMaker["sheriffSettlesVotes"](play, game, []);

      expect(mocks.playerKillerService.killOrRevealPlayer).toHaveBeenCalledOnce();
      expect(mocks.playerKillerService.killOrRevealPlayer).toHaveBeenCalledWith(targetedPlayer._id, game, createFakePlayerVoteBySheriffDeath(), []);
    });
  });

  describe("sheriffDelegates", () => {
    it("should return game as is when target count is not the one expected.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame();

      expect(services.gamePlaysMaker["sheriffDelegates"](play, game)).toStrictEqual<Game>(game);
    });

    it("should remove previous sheriff attribute and add it to the target when called.", () => {
      const players = bulkCreateFakePlayers(4, [{ attributes: [createFakeSheriffByAllPlayerAttribute()] }]);
      const play = createFakeMakeGamePlayWithRelationsDto({ targets: [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })] });
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer({ ...players[0], attributes: [] }),
          createFakePlayer({ ...players[1], attributes: [createFakeSheriffBySheriffPlayerAttribute()] }),
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlaysMaker["sheriffDelegates"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("sheriffPlays", () => {
    let localMocks: {
      gamePlaysMakerService: {
        sheriffDelegates: jest.SpyInstance;
        sheriffSettlesVotes: jest.SpyInstance;
      };
    };
    
    beforeEach(() => {
      localMocks = {
        gamePlaysMakerService: {
          sheriffDelegates: jest.spyOn(services.gamePlaysMaker as unknown as { sheriffDelegates }, "sheriffDelegates").mockImplementation(),
          sheriffSettlesVotes: jest.spyOn(services.gamePlaysMaker as unknown as { sheriffSettlesVotes }, "sheriffSettlesVotes").mockImplementation(),
        },
      };
    });
    
    it("should return game as is when there is no upcoming play.", () => {
      const game = createFakeGame();
      const play = createFakeMakeGamePlayWithRelationsDto();

      expect(services.gamePlaysMaker["sheriffPlays"](play, game, [])).toStrictEqual<Game>(game);
    });

    it("should return game as is when upcoming play is not for sheriff.", () => {
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayFoxSniffs()] });
      const play = createFakeMakeGamePlayWithRelationsDto();

      expect(services.gamePlaysMaker["sheriffPlays"](play, game, [])).toStrictEqual<Game>(game);
    });

    it("should call sheriffDelegates method when upcoming play is sheriff role delegation.", () => {
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlaySheriffDelegates()] });
      const play = createFakeMakeGamePlayWithRelationsDto();
      services.gamePlaysMaker["sheriffPlays"](play, game, []);

      expect(localMocks.gamePlaysMakerService.sheriffDelegates).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.sheriffDelegates).toHaveBeenCalledWith(play, game, []);
    });

    it("should call sheriffSettlesVotes method when upcoming play is sheriff settling vote.", () => {
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlaySheriffSettlesVotes()] });
      const play = createFakeMakeGamePlayWithRelationsDto();
      services.gamePlaysMaker["sheriffPlays"](play, game, []);

      expect(localMocks.gamePlaysMakerService.sheriffSettlesVotes).toHaveBeenCalledOnce();
      expect(localMocks.gamePlaysMakerService.sheriffSettlesVotes).toHaveBeenCalledWith(play, game, []);
    });
  });

  describe("addRavenMarkVoteToPlayerVoteCounts", () => {
    it("should return player vote counts as is when action is not vote.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players, upcomingPlays: [createFakeGamePlayFoxSniffs()] });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlaysMaker["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when there is no raven player in the game.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeFoxAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players, upcomingPlays: [createFakeGamePlayAllVote()] });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlaysMaker["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when raven player is not alive.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players, upcomingPlays: [createFakeGamePlayAllVote()] });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlaysMaker["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when raven player is powerless.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players, upcomingPlays: [createFakeGamePlayAllVote()] });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlaysMaker["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when there are no raven mark.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players, upcomingPlays: [createFakeGamePlayAllVote()] });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlaysMaker["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when the raven target is dead.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false, attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGame({ players, upcomingPlays: [createFakeGamePlayAllVote()] });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlaysMaker["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts with new player vote entry when raven target doesn't have vote.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ raven: createFakeRavenGameOptions({ markPenalty: 2 }) }) });
      const game = createFakeGame({ players, upcomingPlays: [createFakeGamePlayAllVote()], options });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];
      const expectedPlayerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
        [players[2], 2],
      ];

      expect(services.gamePlaysMaker["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(expectedPlayerVoteCounts);
    });

    it("should return player vote counts with updated player vote entry when raven target already has votes.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ raven: createFakeRavenGameOptions({ markPenalty: 5 }) }) });
      const game = createFakeGame({ players, upcomingPlays: [createFakeGamePlayAllVote()], options });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];
      const expectedPlayerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 7],
      ];

      expect(services.gamePlaysMaker["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(expectedPlayerVoteCounts);
    });
  });

  describe("getPlayerVoteCounts", () => {
    it("should get player vote counts with only simple votes when there is no sheriff.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ hasDoubledVote: true }) }) });
      const game = createFakeGame({ players, upcomingPlays: [createFakeGamePlayAllVote()], options });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[1], target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const expectedPlayerVoteCounts: PlayerVoteCount[] = [
        [players[0], 2],
        [players[1], 1],
      ];

      expect(services.gamePlaysMaker["getPlayerVoteCounts"](votes, game)).toContainAllValues<PlayerVoteCount>(expectedPlayerVoteCounts);
    });

    it("should get player vote counts with only simple votes when sheriff doesn't have double vote.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ hasDoubledVote: false }) }) });
      const game = createFakeGame({ players, upcomingPlays: [createFakeGamePlayAllVote()], options });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[1], target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const expectedPlayerVoteCounts: PlayerVoteCount[] = [
        [players[1], 1],
        [players[0], 2],
      ];

      expect(services.gamePlaysMaker["getPlayerVoteCounts"](votes, game)).toContainAllValues<PlayerVoteCount>(expectedPlayerVoteCounts);
    });

    it("should get player vote counts with simple only votes when game play is not vote.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ hasDoubledVote: true }) }) });
      const game = createFakeGame({ players, upcomingPlays: [createFakeGamePlayAllElectSheriff()], options });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[1], target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const expectedPlayerVoteCounts: PlayerVoteCount[] = [
        [players[1], 1],
        [players[0], 2],
      ];

      expect(services.gamePlaysMaker["getPlayerVoteCounts"](votes, game)).toContainAllValues<PlayerVoteCount>(expectedPlayerVoteCounts);
    });

    it("should get player vote counts with simple votes and one doubled vote when sheriff has double vote.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ hasDoubledVote: true }) }) });
      const game = createFakeGame({ players, upcomingPlays: [createFakeGamePlayAllVote()], options });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[1], target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const expectedPlayerVoteCounts: PlayerVoteCount[] = [
        [players[1], 2],
        [players[0], 2],
      ];

      expect(services.gamePlaysMaker["getPlayerVoteCounts"](votes, game)).toContainAllValues<PlayerVoteCount>(expectedPlayerVoteCounts);
    });
  });

  describe("getNominatedPlayers", () => {
    it("should get nominated players when called.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const sheriffOptions = createFakeSheriffGameOptions({ hasDoubledVote: true });
      const ravenOptions = createFakeRavenGameOptions({ markPenalty: 2 });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: sheriffOptions, raven: ravenOptions }) });
      const game = createFakeGame({ players, upcomingPlays: [createFakeGamePlayAllVote()], options });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const expectedNominatedPlayers = [
        players[1],
        players[2],
      ];

      expect(services.gamePlaysMaker["getNominatedPlayers"](votes, game)).toContainAllValues<Player>(expectedNominatedPlayers);
    });

    describe("handleTieInVotes", () => {
      it("should not kill scapegoat when he's not the game.", () => {
        const players: Player[] = [
          createFakeSeerAlivePlayer(),
          createFakeRavenAlivePlayer(),
          createFakeWerewolfAlivePlayer(),
          createFakeWerewolfAlivePlayer(),
        ];
        const game = createFakeGame({ players });
        const gameHistoryRecords: GameHistoryRecord[] = [];
        services.gamePlaysMaker["handleTieInVotes"](game, gameHistoryRecords);

        expect(mocks.playerKillerService.killOrRevealPlayer).not.toHaveBeenCalledOnce();
      });
    });
  });
});