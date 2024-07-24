import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import lodash from "lodash";

import type { MakeGamePlayVoteWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import * as GameMutator from "@/modules/game/helpers/game.mutators";
import * as PlayerHelper from "@/modules/game/helpers/player/player.helpers";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { DevotedServantGamePlayMakerService } from "@/modules/game/providers/services/game-play/game-play-maker/devoted-servant-game-play-maker.service";
import { GamePlayMakerService } from "@/modules/game/providers/services/game-play/game-play-maker/game-play-maker.service";
import { GamePlayVoteService } from "@/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import { PlayerKillerService } from "@/modules/game/providers/services/player/player-killer.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";

import { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enum";
import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";
import { UnexpectedException } from "@/shared/exception/types/unexpected-exception.types";

import { createFakeMakeGamePlayTargetWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-target-with-relations.dto.factory";
import { createFakeMakeGamePlayVoteWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-vote-with-relations.dto.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecord } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeActorGameOptions, createFakeFoxGameOptions, createFakeRolesGameOptions, createFakeSheriffGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options/game-roles-options.schema.factory";
import { createFakeGamePlayAccursedWolfFatherInfects, createFakeGamePlayActorChoosesCard, createFakeGamePlayBigBadWolfEats, createFakeGamePlayCharmedMeetEachOther, createFakeGamePlayCupidCharms, createFakeGamePlayDefenderProtects, createFakeGamePlayFoxSniffs, createFakeGamePlayHunterShoots, createFakeGamePlayLoversMeetEachOther, createFakeGamePlayPiedPiperCharms, createFakeGamePlayScandalmongerMarks, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySeerLooks, createFakeGamePlaySheriffDelegates, createFakeGamePlaySheriffSettlesVotes, createFakeGamePlayStutteringJudgeRequestsAnotherVote, createFakeGamePlaySurvivorsBuryDeadBodies, createFakeGamePlaySurvivorsElectSheriff, createFakeGamePlaySurvivorsVote, createFakeGamePlayThiefChoosesCard, createFakeGamePlayThreeBrothersMeetEachOther, createFakeGamePlayTwoSistersMeetEachOther, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWildChildChoosesModel, createFakeGamePlayWitchUsesPotions, createFakeGamePlayWolfHoundChoosesSide } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeActingByActorPlayerAttribute, createFakeCantVoteByScapegoatPlayerAttribute, createFakeCharmedByPiedPiperPlayerAttribute, createFakeDrankDeathPotionByWitchPlayerAttribute, createFakeDrankLifePotionByWitchPlayerAttribute, createFakeEatenByBigBadWolfPlayerAttribute, createFakeEatenByWerewolvesPlayerAttribute, createFakeEatenByWhiteWerewolfPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakePowerlessByAccursedWolfFatherPlayerAttribute, createFakePowerlessByActorPlayerAttribute, createFakePowerlessByElderPlayerAttribute, createFakePowerlessByFoxPlayerAttribute, createFakeProtectedByDefenderPlayerAttribute, createFakeScandalmongerMarkedByScandalmongerPlayerAttribute, createFakeSeenBySeerPlayerAttribute, createFakeSheriffBySheriffPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute, createFakeWorshipedByWildChildPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayerShotByHunterDeath, createFakePlayerVoteBySheriffDeath, createFakePlayerVoteBySurvivorsDeath, createFakePlayerVoteScapegoatedBySurvivorsDeath } from "@tests/factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeActorAlivePlayer, createFakeElderAlivePlayer, createFakeFoxAlivePlayer, createFakeScandalmongerAlivePlayer, createFakeScapegoatAlivePlayer, createFakeSeerAlivePlayer, createFakeStutteringJudgeAlivePlayer, createFakeThiefAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWolfHoundAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakeDeadPlayer, createFakePlayer, createFakePlayerRole } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Play Maker Service", () => {
  let services: { gamePlayMaker: GamePlayMakerService };
  let mocks: {
    gamePlayMakerService: {
      accursedWolfFatherInfects: jest.SpyInstance;
      werewolvesEat: jest.SpyInstance;
      bigBadWolfEats: jest.SpyInstance;
      whiteWerewolfEats: jest.SpyInstance;
      seerLooks: jest.SpyInstance;
      cupidCharms: jest.SpyInstance;
      piedPiperCharms: jest.SpyInstance;
      witchUsesPotions: jest.SpyInstance;
      hunterShoots: jest.SpyInstance;
      defenderProtects: jest.SpyInstance;
      foxSniffs: jest.SpyInstance;
      wildChildChoosesModel: jest.SpyInstance;
      wolfHoundChoosesSide: jest.SpyInstance;
      scapegoatBansVoting: jest.SpyInstance;
      thiefChoosesCard: jest.SpyInstance;
      survivorsPlay: jest.SpyInstance;
      scandalmongerMarks: jest.SpyInstance;
      sheriffPlays: jest.SpyInstance;
      sheriffDelegates: jest.SpyInstance;
      sheriffSettlesVotes: jest.SpyInstance;
      killPlayerAmongNominatedPlayers: jest.SpyInstance;
      handleTieInVotes: jest.SpyInstance;
      handleTieInSheriffElection: jest.SpyInstance;
      survivorsElectSheriff: jest.SpyInstance;
      survivorsVote: jest.SpyInstance;
      survivorsBuryDeadBodies: jest.SpyInstance;
      actorChoosesCard: jest.SpyInstance;
      stutteringJudgeRequestsAnotherVote: jest.SpyInstance;
    };
    gameHistoryRecordService: {
      getPreviousGameHistoryRecord: jest.SpyInstance;
    };
    playerKillerService: {
      killOrRevealPlayer: jest.SpyInstance;
      applyPlayerDeathOutcomes: jest.SpyInstance;
      isElderKillable: jest.SpyInstance;
      getElderLivesCountAgainstWerewolves: jest.SpyInstance;
      revealPlayerRole: jest.SpyInstance;
    };
    devotedServantGamePlayMakerService: {
      devotedServantStealsRole: jest.SpyInstance;
    };
    gamePlayVoteService: { getNominatedPlayers: jest.SpyInstance };
    gameMutator: { prependUpcomingPlayInGame: jest.SpyInstance };
    playerHelper: { isPlayerPowerlessOnWerewolvesSide: jest.SpyInstance };
    unexpectedExceptionFactory: {
      createNoCurrentGamePlayUnexpectedException: jest.SpyInstance;
      createCantFindLastDeadPlayersUnexpectedException: jest.SpyInstance;
    };
    lodash: { sample: jest.SpyInstance };
  };

  beforeEach(async() => {
    mocks = {
      gamePlayMakerService: {
        accursedWolfFatherInfects: jest.fn(),
        werewolvesEat: jest.fn(),
        bigBadWolfEats: jest.fn(),
        whiteWerewolfEats: jest.fn(),
        seerLooks: jest.fn(),
        cupidCharms: jest.fn(),
        piedPiperCharms: jest.fn(),
        witchUsesPotions: jest.fn(),
        hunterShoots: jest.fn(),
        defenderProtects: jest.fn(),
        foxSniffs: jest.fn(),
        wildChildChoosesModel: jest.fn(),
        wolfHoundChoosesSide: jest.fn(),
        scapegoatBansVoting: jest.fn(),
        thiefChoosesCard: jest.fn(),
        survivorsPlay: jest.fn(),
        scandalmongerMarks: jest.fn(),
        sheriffPlays: jest.fn(),
        sheriffDelegates: jest.fn(),
        sheriffSettlesVotes: jest.fn(),
        killPlayerAmongNominatedPlayers: jest.fn(),
        handleTieInVotes: jest.fn(),
        handleTieInSheriffElection: jest.fn(),
        survivorsElectSheriff: jest.fn(),
        survivorsVote: jest.fn(),
        survivorsBuryDeadBodies: jest.fn(),
        actorChoosesCard: jest.fn(),
        stutteringJudgeRequestsAnotherVote: jest.fn(),
      },
      playerKillerService: {
        killOrRevealPlayer: jest.fn(),
        applyPlayerDeathOutcomes: jest.fn(),
        isElderKillable: jest.fn(),
        getElderLivesCountAgainstWerewolves: jest.fn(),
        revealPlayerRole: jest.fn(),
      },
      devotedServantGamePlayMakerService: { devotedServantStealsRole: jest.fn() },
      gameHistoryRecordService: { getPreviousGameHistoryRecord: jest.fn() },
      gamePlayVoteService: { getNominatedPlayers: jest.fn() },
      gameMutator: { prependUpcomingPlayInGame: jest.spyOn(GameMutator, "prependUpcomingPlayInGame").mockImplementation() },
      playerHelper: { isPlayerPowerlessOnWerewolvesSide: jest.spyOn(PlayerHelper, "isPlayerPowerlessOnWerewolvesSide").mockImplementation() },
      unexpectedExceptionFactory: {
        createNoCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoCurrentGamePlayUnexpectedException").mockImplementation(),
        createCantFindLastDeadPlayersUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createCantFindLastDeadPlayersUnexpectedException").mockImplementation(),
      },
      lodash: { sample: jest.spyOn(lodash, "sample").mockImplementation() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GamePlayVoteService,
          useValue: mocks.gamePlayVoteService,
        },
        {
          provide: PlayerKillerService,
          useValue: mocks.playerKillerService,
        },
        {
          provide: GameHistoryRecordService,
          useValue: mocks.gameHistoryRecordService,
        },
        {
          provide: DevotedServantGamePlayMakerService,
          useValue: mocks.devotedServantGamePlayMakerService,
        },
        GamePlayMakerService,
      ],
    }).compile();

    services = { gamePlayMaker: module.get<GamePlayMakerService>(GamePlayMakerService) };
  });

  describe("makeGamePlay", () => {
    beforeEach(() => {
      mocks.gamePlayMakerService.werewolvesEat = jest.spyOn(services.gamePlayMaker as unknown as { werewolvesEat }, "werewolvesEat").mockImplementation();
      mocks.gamePlayMakerService.bigBadWolfEats = jest.spyOn(services.gamePlayMaker as unknown as { bigBadWolfEats }, "bigBadWolfEats").mockImplementation();
      mocks.gamePlayMakerService.whiteWerewolfEats = jest.spyOn(services.gamePlayMaker as unknown as { whiteWerewolfEats }, "whiteWerewolfEats").mockImplementation();
      mocks.gamePlayMakerService.seerLooks = jest.spyOn(services.gamePlayMaker as unknown as { seerLooks }, "seerLooks").mockImplementation();
      mocks.gamePlayMakerService.cupidCharms = jest.spyOn(services.gamePlayMaker as unknown as { cupidCharms }, "cupidCharms").mockImplementation();
      mocks.gamePlayMakerService.piedPiperCharms = jest.spyOn(services.gamePlayMaker as unknown as { piedPiperCharms }, "piedPiperCharms").mockImplementation();
      mocks.gamePlayMakerService.witchUsesPotions = jest.spyOn(services.gamePlayMaker as unknown as { witchUsesPotions }, "witchUsesPotions").mockImplementation();
      mocks.gamePlayMakerService.hunterShoots = jest.spyOn(services.gamePlayMaker as unknown as { hunterShoots }, "hunterShoots").mockImplementation();
      mocks.gamePlayMakerService.defenderProtects = jest.spyOn(services.gamePlayMaker as unknown as { defenderProtects }, "defenderProtects").mockImplementation();
      mocks.gamePlayMakerService.foxSniffs = jest.spyOn(services.gamePlayMaker as unknown as { foxSniffs }, "foxSniffs").mockImplementation();
      mocks.gamePlayMakerService.wildChildChoosesModel = jest.spyOn(services.gamePlayMaker as unknown as { wildChildChoosesModel }, "wildChildChoosesModel").mockImplementation();
      mocks.gamePlayMakerService.wolfHoundChoosesSide = jest.spyOn(services.gamePlayMaker as unknown as { wolfHoundChoosesSide }, "wolfHoundChoosesSide").mockImplementation();
      mocks.gamePlayMakerService.scapegoatBansVoting = jest.spyOn(services.gamePlayMaker as unknown as { scapegoatBansVoting }, "scapegoatBansVoting").mockImplementation();
      mocks.gamePlayMakerService.thiefChoosesCard = jest.spyOn(services.gamePlayMaker as unknown as { thiefChoosesCard }, "thiefChoosesCard").mockImplementation();
      mocks.gamePlayMakerService.survivorsPlay = jest.spyOn(services.gamePlayMaker as unknown as { survivorsPlay }, "survivorsPlay").mockImplementation();
      mocks.gamePlayMakerService.scandalmongerMarks = jest.spyOn(services.gamePlayMaker as unknown as { scandalmongerMarks }, "scandalmongerMarks").mockImplementation();
      mocks.gamePlayMakerService.sheriffPlays = jest.spyOn(services.gamePlayMaker as unknown as { sheriffPlays }, "sheriffPlays").mockImplementation();
      mocks.gamePlayMakerService.actorChoosesCard = jest.spyOn(services.gamePlayMaker as unknown as { actorChoosesCard }, "actorChoosesCard").mockImplementation();
      mocks.gamePlayMakerService.accursedWolfFatherInfects = jest.spyOn(services.gamePlayMaker as unknown as { accursedWolfFatherInfects }, "accursedWolfFatherInfects").mockImplementation();
      mocks.gamePlayMakerService.stutteringJudgeRequestsAnotherVote = jest.spyOn(services.gamePlayMaker as unknown as { stutteringJudgeRequestsAnotherVote }, "stutteringJudgeRequestsAnotherVote").mockImplementation();
    });

    it("should throw error when game's current play is not set.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame();
      const interpolations = { gameId: game._id };
      const mockedError = new UnexpectedException("makeGamePlay", UnexpectedExceptionReasons.NO_CURRENT_GAME_PLAY, { gameId: game._id.toString() });
      mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException.mockReturnValueOnce(mockedError);

      await expect(services.gamePlayMaker.makeGamePlay(play, game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("makeGamePlay", interpolations);
    });

    it("should call no play method when source is not in available methods.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayTwoSistersMeetEachOther() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      const gamePlayMakerServiceMockKeys = Object.keys(mocks.gamePlayMakerService);
      for (const gamePlayMakerServiceMockKey of gamePlayMakerServiceMockKeys) {
        expect(mocks.gamePlayMakerService[gamePlayMakerServiceMockKey]).not.toHaveBeenCalled();
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

      expect(mocks.gamePlayMakerService.werewolvesEat).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should return game as is when it's lovers turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayLoversMeetEachOther() });

      await expect(services.gamePlayMaker.makeGamePlay(play, game)).resolves.toStrictEqual<Game>(game);
    });

    it("should return game as is when it's charmed people turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayCharmedMeetEachOther() });

      await expect(services.gamePlayMaker.makeGamePlay(play, game)).resolves.toStrictEqual<Game>(game);
    });

    it("should call sheriffPlays method when it's sheriff's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlaySheriffDelegates() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.sheriffPlays).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call bigBadWolfEats method when it's big bad wolf's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayBigBadWolfEats() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.bigBadWolfEats).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call whiteWerewolfEats method when it's white werewolf's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayWhiteWerewolfEats() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.whiteWerewolfEats).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call seerLooks method when it's seer's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlaySeerLooks() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.seerLooks).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call cupidCharms method when it's cupid's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayCupidCharms() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.cupidCharms).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call piedPiperCharms method when it's pied piper's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayPiedPiperCharms() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.piedPiperCharms).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call witchUsesPotions method when it's witch's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.witchUsesPotions).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call hunterShoots method when it's hunter's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayHunterShoots() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.hunterShoots).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call defenderProtects method when it's defender's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayDefenderProtects() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.defenderProtects).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call foxSniffs method when it's fox's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayFoxSniffs() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.foxSniffs).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call wildChildChoosesModel method when it's wild child's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayWildChildChoosesModel() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.wildChildChoosesModel).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call wolfHoundChoosesSide method when it's wolf-hound's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayWolfHoundChoosesSide() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.wolfHoundChoosesSide).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call scapegoatBansVoting method when it's scapegoat's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayScapegoatBansVoting() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.scapegoatBansVoting).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call thiefChoosesCard method when it's thief's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayThiefChoosesCard() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.thiefChoosesCard).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call survivorsPlay method when it's all's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlaySurvivorsVote() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.survivorsPlay).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call scandalmongerMarks method when it's scandalmonger's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayScandalmongerMarks() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.scandalmongerMarks).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call actorChoosesCard method when it's actor's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayActorChoosesCard() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.actorChoosesCard).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should return game as is when it's two sisters turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayTwoSistersMeetEachOther() });

      await expect(services.gamePlayMaker.makeGamePlay(play, game)).resolves.toStrictEqual<Game>(game);
    });

    it("should return game as is when it's three brothers turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayThreeBrothersMeetEachOther() });

      await expect(services.gamePlayMaker.makeGamePlay(play, game)).resolves.toStrictEqual<Game>(game);
    });

    it("should call accursed wolf father infects method when it's accursed wolf father's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayAccursedWolfFatherInfects() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.accursedWolfFatherInfects).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call stuttering judge requests another vote method when it's stuttering judge's turn.", async() => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ currentPlay: createFakeGamePlayStutteringJudgeRequestsAnotherVote() });
      await services.gamePlayMaker.makeGamePlay(play, game);

      expect(mocks.gamePlayMakerService.stutteringJudgeRequestsAnotherVote).toHaveBeenCalledExactlyOnceWith(play, game);
    });
  });

  describe("actorChoosesCard", () => {
    it("should return game as is when actor is not in the game.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ isUsed: false }),
        createFakeGameAdditionalCard({ isUsed: false }),
        createFakeGameAdditionalCard({ isUsed: false }),
        createFakeGameAdditionalCard({ isUsed: false }),
      ];
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, additionalCards });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenCard: additionalCards[0] });
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["actorChoosesCard"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when actor didn't choose a card.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ isUsed: false }),
        createFakeGameAdditionalCard({ isUsed: false }),
        createFakeGameAdditionalCard({ isUsed: false }),
        createFakeGameAdditionalCard({ isUsed: false }),
      ];
      const players = [
        createFakeActorAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, additionalCards });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["actorChoosesCard"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when role from chosen card is not found.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ isUsed: false }),
        createFakeGameAdditionalCard({ isUsed: false }),
        createFakeGameAdditionalCard({ isUsed: false }),
        createFakeGameAdditionalCard({ isUsed: false }),
      ];
      const players = [
        createFakeActorAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, additionalCards });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenCard: createFakeGameAdditionalCard({}, { roleName: "unknown" }) });
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["actorChoosesCard"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game with actor having chosen card role, acting attribute and make it used when actor chose a card.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ isUsed: false }),
        createFakeGameAdditionalCard({ roleName: "seer", isUsed: false }),
        createFakeGameAdditionalCard({ isUsed: false }),
        createFakeGameAdditionalCard({ isUsed: false }),
      ];
      const players = [
        createFakeActorAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, additionalCards });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenCard: additionalCards[1] });
      const expectedActor = createFakePlayer({
        ...players[0],
        role: createFakePlayerRole({ ...players[0].role, current: additionalCards[1].roleName }),
        attributes: [createFakeActingByActorPlayerAttribute()],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          expectedActor,
          players[1],
          players[2],
          players[3],
        ],
        additionalCards: [
          additionalCards[0],
          createFakeGameAdditionalCard({ ...additionalCards[1], isUsed: true }),
          additionalCards[2],
          additionalCards[3],
        ],
      });

      expect(services.gamePlayMaker["actorChoosesCard"](play, game)).toStrictEqual<Game>(expectedGame);
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
      const players = [
        createFakePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
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
    beforeEach(() => {
      mocks.gamePlayMakerService.sheriffDelegates = jest.spyOn(services.gamePlayMaker as unknown as { sheriffDelegates }, "sheriffDelegates").mockImplementation();
      mocks.gamePlayMakerService.sheriffSettlesVotes = jest.spyOn(services.gamePlayMaker as unknown as { sheriffSettlesVotes }, "sheriffSettlesVotes").mockImplementation();
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

      expect(mocks.gamePlayMakerService.sheriffDelegates).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call sheriffSettlesVotes method when upcoming play is sheriff settling vote.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffSettlesVotes() });
      const play = createFakeMakeGamePlayWithRelationsDto();
      await services.gamePlayMaker["sheriffPlays"](play, game);

      expect(mocks.gamePlayMakerService.sheriffSettlesVotes).toHaveBeenCalledExactlyOnceWith(play, game);
    });
  });

  describe("survivorsBuryDeadBodies", () => {
    it("should throw error when previous game history record is not found.", async() => {
      const game = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const mockedError = new UnexpectedException("survivorsBuryDeadBodies", UnexpectedExceptionReasons.CANT_FIND_LAST_DEAD_PLAYERS, { gameId: game._id.toString() });
      mocks.gameHistoryRecordService.getPreviousGameHistoryRecord.mockReturnValueOnce(undefined);
      mocks.unexpectedExceptionFactory.createCantFindLastDeadPlayersUnexpectedException.mockReturnValueOnce(mockedError);

      await expect(services.gamePlayMaker["survivorsBuryDeadBodies"](play, game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastDeadPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("survivorsBuryDeadBodies", { gameId: game._id });
    });

    it("should throw error when previous game history record doesn't have dead players.", async() => {
      const game = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      const mockedError = new UnexpectedException("survivorsBuryDeadBodies", UnexpectedExceptionReasons.CANT_FIND_LAST_DEAD_PLAYERS, { gameId: game._id.toString() });
      mocks.gameHistoryRecordService.getPreviousGameHistoryRecord.mockReturnValueOnce(createFakeGameHistoryRecord({ deadPlayers: [] }));
      mocks.unexpectedExceptionFactory.createCantFindLastDeadPlayersUnexpectedException.mockReturnValueOnce(mockedError);

      await expect(services.gamePlayMaker["survivorsBuryDeadBodies"](play, game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindLastDeadPlayersUnexpectedException).toHaveBeenCalledExactlyOnceWith("survivorsBuryDeadBodies", { gameId: game._id });
    });

    it("should make devoted servant steal role game play when there is one target.", async() => {
      const game = createFakeGameWithCurrentPlay();
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto()];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      mocks.gameHistoryRecordService.getPreviousGameHistoryRecord.mockReturnValueOnce(createFakeGameHistoryRecord({ deadPlayers: [createFakeDeadPlayer()] }));
      mocks.devotedServantGamePlayMakerService.devotedServantStealsRole.mockReturnValueOnce(game);
      mocks.playerKillerService.revealPlayerRole.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerDeathOutcomes.mockReturnValue(game);
      await services.gamePlayMaker["survivorsBuryDeadBodies"](play, game);

      expect(mocks.devotedServantGamePlayMakerService.devotedServantStealsRole).toHaveBeenCalledExactlyOnceWith(targets[0].player, game);
    });

    it("should not make devoted servant steal role game play when there is no target.", async() => {
      const game = createFakeGameWithCurrentPlay();
      const play = createFakeMakeGamePlayWithRelationsDto();
      mocks.gameHistoryRecordService.getPreviousGameHistoryRecord.mockReturnValueOnce(createFakeGameHistoryRecord({ deadPlayers: [createFakeDeadPlayer()] }));
      mocks.devotedServantGamePlayMakerService.devotedServantStealsRole.mockReturnValueOnce(game);
      mocks.playerKillerService.revealPlayerRole.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerDeathOutcomes.mockReturnValue(game);
      await services.gamePlayMaker["survivorsBuryDeadBodies"](play, game);

      expect(mocks.devotedServantGamePlayMakerService.devotedServantStealsRole).not.toHaveBeenCalled();
    });

    it("should reveal role for each player when game options say that they must be revealed on death.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ areRevealedOnDeath: true }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const deadPlayers = [createFakeDeadPlayer(players[1] as DeadPlayer), createFakeDeadPlayer(players[2] as DeadPlayer)];
      mocks.gameHistoryRecordService.getPreviousGameHistoryRecord.mockReturnValueOnce(createFakeGameHistoryRecord({ deadPlayers }));
      mocks.devotedServantGamePlayMakerService.devotedServantStealsRole.mockReturnValueOnce(game);
      mocks.playerKillerService.revealPlayerRole.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerDeathOutcomes.mockReturnValue(game);
      await services.gamePlayMaker["survivorsBuryDeadBodies"](play, game);

      expect(mocks.playerKillerService.revealPlayerRole).toHaveBeenCalledTimes(deadPlayers.length);
      expect(mocks.playerKillerService.revealPlayerRole).toHaveBeenCalledWith(players[1], game);
      expect(mocks.playerKillerService.revealPlayerRole).toHaveBeenCalledWith(players[2], game);
    });

    it("should not reveal role for each player when game options say that they must not be revealed on death.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ areRevealedOnDeath: false }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const deadPlayers = [createFakeDeadPlayer(players[1] as DeadPlayer), createFakeDeadPlayer(players[2] as DeadPlayer)];
      mocks.gameHistoryRecordService.getPreviousGameHistoryRecord.mockReturnValueOnce(createFakeGameHistoryRecord({ deadPlayers }));
      mocks.devotedServantGamePlayMakerService.devotedServantStealsRole.mockReturnValueOnce(game);
      mocks.playerKillerService.revealPlayerRole.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerDeathOutcomes.mockReturnValue(game);
      await services.gamePlayMaker["survivorsBuryDeadBodies"](play, game);

      expect(mocks.playerKillerService.revealPlayerRole).not.toHaveBeenCalled();
    });

    it("should apply player death outcomes for each dead players from previous game history record when called.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ areRevealedOnDeath: false }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const deadPlayers = [createFakeDeadPlayer(players[1] as DeadPlayer), createFakeDeadPlayer(players[2] as DeadPlayer)];
      mocks.gameHistoryRecordService.getPreviousGameHistoryRecord.mockReturnValueOnce(createFakeGameHistoryRecord({ deadPlayers }));
      mocks.devotedServantGamePlayMakerService.devotedServantStealsRole.mockReturnValueOnce(game);
      mocks.playerKillerService.revealPlayerRole.mockReturnValue(game);
      mocks.playerKillerService.applyPlayerDeathOutcomes.mockReturnValue(game);
      await services.gamePlayMaker["survivorsBuryDeadBodies"](play, game);

      expect(mocks.playerKillerService.applyPlayerDeathOutcomes).toHaveBeenCalledTimes(deadPlayers.length);
      expect(mocks.playerKillerService.applyPlayerDeathOutcomes).toHaveBeenCalledWith(players[1], game);
      expect(mocks.playerKillerService.applyPlayerDeathOutcomes).toHaveBeenCalledWith(players[2], game);
    });
  });

  describe("killPlayerAmongNominatedPlayers", () => {
    it("should return game as is when there is no nominated player.", async() => {
      const game = createFakeGameWithCurrentPlay();
      const nominatedPlayers = [];
      const expectedGame = createFakeGame(game);

      await expect(services.gamePlayMaker["killPlayerAmongNominatedPlayers"](game, nominatedPlayers)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should kill nominated player when there is one nominated player in random way.", async() => {
      const nominatedPlayers = [
        createFakePlayer(),
        createFakePlayer(),
      ];
      mocks.lodash.sample.mockReturnValue(nominatedPlayers[0]);
      const game = createFakeGameWithCurrentPlay();
      const expectedPlayerDeath = createFakePlayerVoteBySurvivorsDeath();
      await services.gamePlayMaker["killPlayerAmongNominatedPlayers"](game, nominatedPlayers);

      expect(mocks.playerKillerService.killOrRevealPlayer).toHaveBeenCalledExactlyOnceWith(nominatedPlayers[0]._id, game, expectedPlayerDeath);
    });
  });

  describe("handleTieInVotes", () => {
    beforeEach(() => {
      mocks.gamePlayMakerService.killPlayerAmongNominatedPlayers = jest.spyOn(services.gamePlayMaker as unknown as { killPlayerAmongNominatedPlayers }, "killPlayerAmongNominatedPlayers").mockImplementation();
    });

    it("should not kill scapegoat when he's not the game.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      await services.gamePlayMaker["handleTieInVotes"](game, players);

      expect(mocks.playerKillerService.killOrRevealPlayer).not.toHaveBeenCalled();
    });

    it("should not kill scapegoat when he's dead.", async() => {
      const players = [
        createFakeScapegoatAlivePlayer({ isAlive: false }),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      await services.gamePlayMaker["handleTieInVotes"](game, players);

      expect(mocks.playerKillerService.killOrRevealPlayer).not.toHaveBeenCalled();
    });

    it("should not kill scapegoat when he's powerless.", async() => {
      const players = [
        createFakeScapegoatAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      await services.gamePlayMaker["handleTieInVotes"](game, players);

      expect(mocks.playerKillerService.killOrRevealPlayer).not.toHaveBeenCalled();
    });

    it("should kill scapegoat when he's in the game and alive.", async() => {
      const players = [
        createFakeScapegoatAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const playerDeath = createFakePlayerVoteScapegoatedBySurvivorsDeath();
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      await services.gamePlayMaker["handleTieInVotes"](game, players);

      expect(mocks.playerKillerService.killOrRevealPlayer).toHaveBeenCalledExactlyOnceWith(players[0]._id, game, playerDeath);
    });

    it("should not prepend sheriff settling tie in votes game play when sheriff is not in the game.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ mustSettleTieInVotes: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const gamePlaySheriffSettlesVotes = createFakeGamePlaySheriffSettlesVotes();
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      await services.gamePlayMaker["handleTieInVotes"](game, players);

      expect(mocks.gameMutator.prependUpcomingPlayInGame).not.toHaveBeenCalledExactlyOnceWith(gamePlaySheriffSettlesVotes, game);
    });

    it("should not prepend sheriff settling tie in votes game play when sheriff is dead.", async() => {
      const players = [
        createFakeSeerAlivePlayer({ isAlive: false, attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ mustSettleTieInVotes: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const gamePlaySheriffSettlesVotes = createFakeGamePlaySheriffSettlesVotes();
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      await services.gamePlayMaker["handleTieInVotes"](game, players);

      expect(mocks.gameMutator.prependUpcomingPlayInGame).not.toHaveBeenCalledExactlyOnceWith(gamePlaySheriffSettlesVotes, game);
    });

    it("should not prepend sheriff settling tie in votes game play when game options don't allow it.", async() => {
      const players = [
        createFakeSeerAlivePlayer({ isAlive: false, attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ mustSettleTieInVotes: false }) }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const gamePlaySheriffSettlesVotes = createFakeGamePlaySheriffSettlesVotes();
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      await services.gamePlayMaker["handleTieInVotes"](game, players);

      expect(mocks.gameMutator.prependUpcomingPlayInGame).not.toHaveBeenCalledExactlyOnceWith(gamePlaySheriffSettlesVotes, game);
    });

    it("should prepend sheriff delegation game play when sheriff is in the game.", async() => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ mustSettleTieInVotes: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const gamePlaySheriffSettlesVotes = createFakeGamePlaySheriffSettlesVotes();
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      await services.gamePlayMaker["handleTieInVotes"](game, players);

      expect(mocks.gameMutator.prependUpcomingPlayInGame).toHaveBeenCalledExactlyOnceWith(gamePlaySheriffSettlesVotes, game);
    });

    it("should prepend vote game play with only tie cause when previous play is not a tie without cause.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ mustSettleTieInVotes: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const gamePlaySurvivorsVote = createFakeGamePlaySurvivorsVote({ causes: ["previous-votes-were-in-ties"] });
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      await services.gamePlayMaker["handleTieInVotes"](game, players);

      expect(mocks.gameMutator.prependUpcomingPlayInGame).toHaveBeenCalledExactlyOnceWith(gamePlaySurvivorsVote, game);
    });

    it("should prepend vote game play with tie and previous play causes when previous play is not a tie with causes.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const currentPlay = createFakeGamePlaySurvivorsVote({ causes: ["angel-presence"] });
      const gamePlaySurvivorsVote = createFakeGamePlaySurvivorsVote({ causes: ["previous-votes-were-in-ties", "angel-presence"] });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay });
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      await services.gamePlayMaker["handleTieInVotes"](game, players);

      expect(mocks.gameMutator.prependUpcomingPlayInGame).toHaveBeenCalledWith(gamePlaySurvivorsVote, game);
    });

    it("should prepend vote game play when there is no game history records.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ mustSettleTieInVotes: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      const gamePlaySurvivorsVote = createFakeGamePlaySurvivorsVote({ causes: ["previous-votes-were-in-ties"], occurrence: "consequential" });
      await services.gamePlayMaker["handleTieInVotes"](game, players);

      expect(mocks.gameMutator.prependUpcomingPlayInGame).toHaveBeenCalledExactlyOnceWith(gamePlaySurvivorsVote, game);
    });

    it("should not prepend vote game play when current play is due to a tie and cause is not angel presence.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const currentPlay = createFakeGamePlaySurvivorsVote({ causes: ["previous-votes-were-in-ties"] });
      const gamePlaySurvivorsVote = createFakeGamePlaySurvivorsVote({ causes: ["previous-votes-were-in-ties"], occurrence: "consequential" });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay });
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      await services.gamePlayMaker["handleTieInVotes"](game, players);

      expect(mocks.gameMutator.prependUpcomingPlayInGame).not.toHaveBeenCalledExactlyOnceWith(gamePlaySurvivorsVote, game);
      expect(mocks.gamePlayMakerService.killPlayerAmongNominatedPlayers).not.toHaveBeenCalled();
    });

    it("should kill player among nominated players when current play is due to a tie and cause is angel presence.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const currentPlay = createFakeGamePlaySurvivorsVote({ causes: ["angel-presence", "previous-votes-were-in-ties"] });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay });
      const nominatedPlayers = [createFakePlayer()];
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      await services.gamePlayMaker["handleTieInVotes"](game, nominatedPlayers);

      expect(mocks.gamePlayMakerService.killPlayerAmongNominatedPlayers).toHaveBeenCalledExactlyOnceWith(game, nominatedPlayers);
    });
  });

  describe("survivorsVote", () => {
    beforeEach(() => {
      mocks.gamePlayMakerService.handleTieInVotes = jest.spyOn(services.gamePlayMaker as unknown as { handleTieInVotes }, "handleTieInVotes").mockImplementation();
    });

    it("should return game as is when there is no vote.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ causes: ["stuttering-judge-request"] }), players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue([]);

      await expect(services.gamePlayMaker["survivorsVote"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when there is no nominated players.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ causes: ["stuttering-judge-request"] }), players });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ votes, doesJudgeRequestAnotherVote: false });
      const nominatedPlayers = [];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      const expectedGame = createFakeGame(game);

      await expect(services.gamePlayMaker["survivorsVote"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should call handleTieInVotes method when there are several nominated players.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ causes: ["stuttering-judge-request"] }), players });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ votes, doesJudgeRequestAnotherVote: false });
      const nominatedPlayers = [players[1], players[2]];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      await services.gamePlayMaker["survivorsVote"](play, game);

      expect(mocks.gamePlayMakerService.handleTieInVotes).toHaveBeenCalledExactlyOnceWith(game, nominatedPlayers);
    });

    it("should remove scandalmonger mark when there is this attribute among players.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeScandalmongerMarkedByScandalmongerPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ causes: ["stuttering-judge-request"] }), players });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ votes, doesJudgeRequestAnotherVote: false });
      const nominatedPlayers = [players[1], players[2]];
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          players[1],
          createFakeWerewolfAlivePlayer({
            ...players[2],
            attributes: [],
          }),
          players[3],
        ],
      });
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      await services.gamePlayMaker["survivorsVote"](play, game);

      expect(mocks.gamePlayMakerService.handleTieInVotes).toHaveBeenCalledExactlyOnceWith(expectedGame, nominatedPlayers);
    });

    it("should prepend stuttering judge request another vote game play when current play cause is undefined.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto(),
        createFakeMakeGamePlayVoteWithRelationsDto(),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ votes });
      const nominatedPlayers = [createFakePlayer()];
      const gamePlayStutteringJudgeRequestsAnotherVote = createFakeGamePlayStutteringJudgeRequestsAnotherVote();
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      await services.gamePlayMaker["survivorsVote"](play, game);

      expect(mocks.gameMutator.prependUpcomingPlayInGame).toHaveBeenCalledExactlyOnceWith(gamePlayStutteringJudgeRequestsAnotherVote, game);
    });

    it("should prepend stuttering judge request another vote game play when current play cause is angel presence and there is no tie in votes.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ causes: ["angel-presence"] }) });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto(),
        createFakeMakeGamePlayVoteWithRelationsDto(),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ votes });
      const nominatedPlayers = [createFakePlayer()];
      const gamePlayStutteringJudgeRequestsAnotherVote = createFakeGamePlayStutteringJudgeRequestsAnotherVote();
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      mocks.gameMutator.prependUpcomingPlayInGame.mockReturnValue(game);
      await services.gamePlayMaker["survivorsVote"](play, game);

      expect(mocks.gameMutator.prependUpcomingPlayInGame).toHaveBeenCalledExactlyOnceWith(gamePlayStutteringJudgeRequestsAnotherVote, game);
    });

    it("should not prepend stuttering judge request another vote game play when current play cause is angel presence and there is a tie in votes.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ causes: ["angel-presence", "previous-votes-were-in-ties"] }) });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto(),
        createFakeMakeGamePlayVoteWithRelationsDto(),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ votes, doesJudgeRequestAnotherVote: false });
      const nominatedPlayers = [createFakePlayer()];
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      await services.gamePlayMaker["survivorsVote"](play, game);

      expect(mocks.gameMutator.prependUpcomingPlayInGame).not.toHaveBeenCalled();
    });

    it("should call killOrRevealPlayer method when there is one nominated player.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ causes: ["stuttering-judge-request"] }), players });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const play = createFakeMakeGamePlayWithRelationsDto({ votes, doesJudgeRequestAnotherVote: false });
      const nominatedPlayers = [players[1]];
      const playerVoteBySurvivorsDeath = createFakePlayerVoteBySurvivorsDeath();
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue(nominatedPlayers);
      await services.gamePlayMaker["survivorsVote"](play, game);

      expect(mocks.playerKillerService.killOrRevealPlayer).toHaveBeenCalledExactlyOnceWith(players[1]._id, game, playerVoteBySurvivorsDeath);
    });
  });

  describe("handleTieInSheriffElection", () => {
    it("should prepend survivors elect sheriff game play when current play is not due to a tie.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const currentPlay = createFakeGamePlaySurvivorsElectSheriff({ causes: ["stuttering-judge-request"] });
      const upcomingPlays = [createFakeGamePlayHunterShoots()];
      const game = createFakeGameWithCurrentPlay({ currentPlay, players, upcomingPlays });
      const nominatedPlayers = [players[0], players[1]];
      const prependedGamePlay = createFakeGamePlaySurvivorsElectSheriff({ causes: ["previous-votes-were-in-ties"] });
      services.gamePlayMaker["handleTieInSheriffElection"](nominatedPlayers, game);

      expect(mocks.gameMutator.prependUpcomingPlayInGame).toHaveBeenCalledExactlyOnceWith(prependedGamePlay, game);
    });

    it("should add sheriff attribute to a random nominated player when current play is due to a tie.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      mocks.lodash.sample.mockReturnValue(players[0]);
      const currentPlay = createFakeGamePlaySurvivorsElectSheriff({ causes: ["previous-votes-were-in-ties"] });
      const upcomingPlays = [createFakeGamePlayHunterShoots()];
      const game = createFakeGameWithCurrentPlay({ currentPlay, players, upcomingPlays });
      const nominatedPlayers = [players[0], players[1]];
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer({
            ...players[0],
            attributes: [createFakeSheriffBySurvivorsPlayerAttribute()],
          }),
          players[1],
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["handleTieInSheriffElection"](nominatedPlayers, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when it's not possible to choose a random nominated player.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      mocks.lodash.sample.mockReturnValue(undefined);
      const currentPlay = createFakeGamePlaySurvivorsElectSheriff({ causes: ["previous-votes-were-in-ties"] });
      const upcomingPlays = [createFakeGamePlayHunterShoots()];
      const game = createFakeGameWithCurrentPlay({ currentPlay, players, upcomingPlays });
      const nominatedPlayers = [players[0], players[1]];
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["handleTieInSheriffElection"](nominatedPlayers, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("survivorsElectSheriff", () => {
    beforeEach(() => {
      mocks.gamePlayMakerService.handleTieInSheriffElection = jest.spyOn(services.gamePlayMaker as unknown as { handleTieInSheriffElection }, "handleTieInSheriffElection").mockImplementation();
    });

    it("should return game as is when there is no vote.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);
      mocks.gamePlayVoteService.getNominatedPlayers.mockReturnValue([]);

      expect(services.gamePlayMaker["survivorsElectSheriff"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when there is no nominated players.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
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

      expect(services.gamePlayMaker["survivorsElectSheriff"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should call handleTieInSheriffElection method when there is a tie in votes.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
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
      services.gamePlayMaker["survivorsElectSheriff"](play, game);

      expect(mocks.gamePlayMakerService.handleTieInSheriffElection).toHaveBeenCalledExactlyOnceWith(nominatedPlayers, game);
    });

    it("should add sheriff attribute to nominated player when called.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
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
          createFakePlayer({ ...players[1], attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["survivorsElectSheriff"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("survivorsPlay", () => {
    beforeEach(() => {
      mocks.gamePlayMakerService.survivorsElectSheriff = jest.spyOn(services.gamePlayMaker as unknown as { survivorsElectSheriff }, "survivorsElectSheriff").mockImplementation();
      mocks.gamePlayMakerService.survivorsVote = jest.spyOn(services.gamePlayMaker as unknown as { survivorsVote }, "survivorsVote").mockImplementation();
      mocks.gamePlayMakerService.survivorsBuryDeadBodies = jest.spyOn(services.gamePlayMaker as unknown as { survivorsBuryDeadBodies }, "survivorsBuryDeadBodies").mockImplementation();
    });

    it("should return game as is when upcoming play is not for all.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs() });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      await expect(services.gamePlayMaker["survivorsPlay"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should call survivorsElectSheriff method when upcoming play is sheriff role delegation.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsElectSheriff() });
      const play = createFakeMakeGamePlayWithRelationsDto();
      await services.gamePlayMaker["survivorsPlay"](play, game);

      expect(mocks.gamePlayMakerService.survivorsElectSheriff).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call survivorsVote method when upcoming play is sheriff settling vote.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const play = createFakeMakeGamePlayWithRelationsDto();
      await services.gamePlayMaker["survivorsPlay"](play, game);

      expect(mocks.gamePlayMakerService.survivorsVote).toHaveBeenCalledExactlyOnceWith(play, game);
    });

    it("should call survivorsBuryDeadBodies method when upcoming play is burying dead bodies.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsBuryDeadBodies() });
      const play = createFakeMakeGamePlayWithRelationsDto();
      await services.gamePlayMaker["survivorsPlay"](play, game);

      expect(mocks.gamePlayMakerService.survivorsBuryDeadBodies).toHaveBeenCalledExactlyOnceWith(play, game);
    });
  });

  describe("thiefChoosesCard", () => {
    it("should return game as is when there is no thief player in game.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const additionalCards = [
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, additionalCards });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenCard: additionalCards[0] });
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["thiefChoosesCard"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when there is no chosen card.", () => {
      const players = [
        createFakeThiefAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const additionalCards = [
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, additionalCards });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["thiefChoosesCard"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when chosen card role is unknown.", () => {
      const players = [
        createFakeThiefAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const additionalCards = [
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, additionalCards });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenCard: createFakeGameAdditionalCard({}, { roleName: "Toto" }) });
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["thiefChoosesCard"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should update thief role and side and make his card used when called.", () => {
      const players = [
        createFakeThiefAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: "werewolf", isUsed: false }),
        createFakeGameAdditionalCard({ isUsed: false }),
        createFakeGameAdditionalCard({ isUsed: false }),
        createFakeGameAdditionalCard({ isUsed: false }),
      ];
      const game = createFakeGameWithCurrentPlay({ players, additionalCards });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenCard: additionalCards[0] });
      const expectedThiefPlayer = createFakePlayer({
        ...players[0],
        role: { ...players[0].role, current: "werewolf" },
        side: { ...players[0].side, current: "werewolves" },
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          expectedThiefPlayer,
          players[1],
          players[2],
          players[3],
        ],
        additionalCards: [
          createFakeGameAdditionalCard({ ...additionalCards[0], isUsed: true }),
          additionalCards[1],
          additionalCards[2],
          additionalCards[3],
        ],
      });

      expect(services.gamePlayMaker["thiefChoosesCard"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("scapegoatBansVoting", () => {
    it("should return game as is when there are no targets.", () => {
      const players = [
        createFakeThiefAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["scapegoatBansVoting"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add scapegoat ban voting attributes to targets when called.", () => {
      const players = [
        createFakeThiefAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
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

  describe("wolfHoundChoosesSide", () => {
    it("should return game as is when there is no wolf-hound in the game.", () => {
      const players = [
        createFakeThiefAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenSide: "werewolves" });
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["wolfHoundChoosesSide"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return wolf-hound on random side when chosen side is not set.", () => {
      const players = [
        createFakeScandalmongerAlivePlayer(),
        createFakeWolfHoundAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedWolfHoundPlayer = createFakePlayer({
        ...players[1],
        side: { ...players[1].side, current: "villagers" },
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedWolfHoundPlayer,
          players[2],
          players[3],
        ],
      });
      mocks.lodash.sample.mockReturnValue("villagers");

      expect(services.gamePlayMaker["wolfHoundChoosesSide"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should get a random side when chosen side is not set.", () => {
      const players = [
        createFakeScandalmongerAlivePlayer(),
        createFakeWolfHoundAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      services.gamePlayMaker["wolfHoundChoosesSide"](play, game);

      expect(mocks.lodash.sample).toHaveBeenCalledExactlyOnceWith(["villagers", "werewolves"]);
    });

    it("should return wolf-hound on the werewolves side when chosen side is werewolves.", () => {
      const players = [
        createFakeScandalmongerAlivePlayer(),
        createFakeWolfHoundAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenSide: "werewolves" });
      const expectedWolfHoundPlayer = createFakePlayer({
        ...players[1],
        side: { ...players[1].side, current: "werewolves" },
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedWolfHoundPlayer,
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["wolfHoundChoosesSide"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return wolf-hound on the werewolves side and add powerless attribute when chosen side is werewolves and wolf-hound is actor in disguise.", () => {
      const players = [
        createFakeScandalmongerAlivePlayer(),
        createFakeWolfHoundAlivePlayer({ role: createFakePlayerRole({ original: "actor", current: "wolf-hound" }) }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenSide: "werewolves" });
      const expectedWolfHoundPlayer = createFakePlayer({
        ...players[1],
        side: { ...players[1].side, current: "werewolves" },
        attributes: [createFakePowerlessByActorPlayerAttribute()],
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedWolfHoundPlayer,
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["wolfHoundChoosesSide"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return wolf-hound on the werewolves side but without powerless attribute when chosen side is werewolves and wolf-hound is actor in disguise but game options are changed.", () => {
      const players = [
        createFakeScandalmongerAlivePlayer(),
        createFakeWolfHoundAlivePlayer({ role: createFakePlayerRole({ original: "actor", current: "wolf-hound" }) }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: false }) }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenSide: "werewolves" });
      const expectedWolfHoundPlayer = createFakePlayer({
        ...players[1],
        side: { ...players[1].side, current: "werewolves" },
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedWolfHoundPlayer,
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["wolfHoundChoosesSide"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return wolf-hound on the villagers side when chosen side is villagers.", () => {
      const players = [
        createFakeScandalmongerAlivePlayer(),
        createFakeWolfHoundAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenSide: "villagers" });
      const expectedWolfHoundPlayer = createFakePlayer({
        ...players[1],
        side: { ...players[1].side, current: "villagers" },
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedWolfHoundPlayer,
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["wolfHoundChoosesSide"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return wolf-hound on the villagers side but without powerless attribute when chosen side is villagers and wolf-hound is actor in disguise.", () => {
      const players = [
        createFakeScandalmongerAlivePlayer(),
        createFakeWolfHoundAlivePlayer({ role: createFakePlayerRole({ original: "actor", current: "wolf-hound" }) }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ actor: createFakeActorGameOptions({ isPowerlessOnWerewolvesSide: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, options });
      const play = createFakeMakeGamePlayWithRelationsDto({ chosenSide: "villagers" });
      const expectedWolfHoundPlayer = createFakePlayer({
        ...players[1],
        side: { ...players[1].side, current: "villagers" },
      });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          players[0],
          expectedWolfHoundPlayer,
          players[2],
          players[3],
        ],
      });

      expect(services.gamePlayMaker["wolfHoundChoosesSide"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("wildChildChoosesModel", () => {
    it("should return game as is when expected target count is not reached.", () => {
      const players = [
        createFakeWolfHoundAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["wildChildChoosesModel"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add worshiped attribute to target when called.", () => {
      const players = [
        createFakeWolfHoundAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
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
      const players = [
        createFakeFoxAlivePlayer({ position: 0 }),
        createFakeScandalmongerAlivePlayer({ position: 1 }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeWerewolfAlivePlayer({ position: 3 }),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["foxSniffs"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when there is no fox in the game.", () => {
      const players = [
        createFakeSeerAlivePlayer({ position: 0 }),
        createFakeScandalmongerAlivePlayer({ position: 1 }),
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
      const players = [
        createFakeFoxAlivePlayer({ position: 0 }),
        createFakeScandalmongerAlivePlayer({ position: 1 }),
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
      const players = [
        createFakeFoxAlivePlayer({ position: 0 }),
        createFakeScandalmongerAlivePlayer({ position: 1 }),
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
      const players = [
        createFakeFoxAlivePlayer({ position: 0 }),
        createFakeScandalmongerAlivePlayer({ position: 1 }),
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

  describe("scandalmongerMarks", () => {
    it("should return game as is when expected target count is not reached.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["scandalmongerMarks"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add scandalmonger marked attribute to target when called.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        attributes: [createFakeScandalmongerMarkedByScandalmongerPlayerAttribute()],
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

      expect(services.gamePlayMaker["scandalmongerMarks"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("defenderProtects", () => {
    it("should return game as is when expected target count is not reached.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["defenderProtects"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add protected attribute to target when called.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        attributes: [createFakeProtectedByDefenderPlayerAttribute()],
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

      expect(services.gamePlayMaker["defenderProtects"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("hunterShoots", () => {
    it("should return game as is when expected target count is not reached.", async() => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      await expect(services.gamePlayMaker["hunterShoots"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should call killOrRevealPlayer method when called.", async() => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
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
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["witchUsesPotions"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add only one potion attributes to targets when called.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1], drankPotion: "life" })];
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
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1], drankPotion: "life" }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: players[2], drankPotion: "death" }),
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
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["piedPiperCharms"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when targets are empty.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto({ targets: [] });
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["piedPiperCharms"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add pied piper charmed attributes to targets when called.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
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
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["cupidCharms"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add in-love attribute to targets when called.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
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
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["seerLooks"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add seen attribute to target when called.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
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
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["whiteWerewolfEats"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add eaten attribute by white werewolf to target when called.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
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
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["bigBadWolfEats"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add eaten attribute by big bad wolf to target when called.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
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

  describe("accursedWolfFatherInfects", () => {
    it("should return game as is when target count is not reached.", async() => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedGame = createFakeGame(game);
      mocks.playerKillerService.isElderKillable.mockResolvedValueOnce(true);
      mocks.playerHelper.isPlayerPowerlessOnWerewolvesSide.mockReturnValue(true);

      await expect(services.gamePlayMaker["accursedWolfFatherInfects"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should return game as is when target is elder and is not killable.", async() => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeElderAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedGame = createFakeGame(game);
      mocks.playerKillerService.isElderKillable.mockResolvedValueOnce(false);
      mocks.playerHelper.isPlayerPowerlessOnWerewolvesSide.mockReturnValue(true);

      await expect(services.gamePlayMaker["accursedWolfFatherInfects"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should change target's side to werewolves and remove eaten by werewolves attribute when elder is killable.", async() => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeElderAlivePlayer({
          attributes: [
            createFakeEatenByWerewolvesPlayerAttribute(),
            createFakeEatenByWerewolvesPlayerAttribute({ source: "seer" }),
            createFakeEatenByWhiteWerewolfPlayerAttribute(),
          ],
        }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        side: { ...players[1].side, current: "werewolves" },
        attributes: [
          createFakeEatenByWerewolvesPlayerAttribute({ source: "seer" }),
          createFakeEatenByWhiteWerewolfPlayerAttribute(),
        ],
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
      mocks.playerKillerService.isElderKillable.mockResolvedValueOnce(true);
      mocks.playerHelper.isPlayerPowerlessOnWerewolvesSide.mockReturnValue(false);

      await expect(services.gamePlayMaker["accursedWolfFatherInfects"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should change target's side to werewolves and remove eaten by werewolves attribute when player is not elder.", async() => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer({
          attributes: [
            createFakeEatenByWerewolvesPlayerAttribute(),
            createFakeSeenBySeerPlayerAttribute(),
            createFakeWorshipedByWildChildPlayerAttribute({ source: "werewolves" }),
            createFakeEatenByWhiteWerewolfPlayerAttribute(),
          ],
        }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        side: { ...players[1].side, current: "werewolves" },
        attributes: [
          createFakeSeenBySeerPlayerAttribute(),
          createFakeWorshipedByWildChildPlayerAttribute({ source: "werewolves" }),
          createFakeEatenByWhiteWerewolfPlayerAttribute(),
        ],
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
      mocks.playerKillerService.getElderLivesCountAgainstWerewolves.mockResolvedValueOnce(2);
      mocks.playerHelper.isPlayerPowerlessOnWerewolvesSide.mockReturnValue(false);

      await expect(services.gamePlayMaker["accursedWolfFatherInfects"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });

    it("should change target's side to werewolves, remove eaten by werewolves attribute and add powerless by accursed wolf-father attribute when target is powerless on joining the werewolves side.", async() => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
      const expectedTargetedPlayer = createFakePlayer({
        ...players[1],
        side: { ...players[1].side, current: "werewolves" },
        attributes: [createFakePowerlessByAccursedWolfFatherPlayerAttribute()],
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
      mocks.playerKillerService.getElderLivesCountAgainstWerewolves.mockResolvedValueOnce(1);
      mocks.playerHelper.isPlayerPowerlessOnWerewolvesSide.mockReturnValue(true);

      await expect(services.gamePlayMaker["accursedWolfFatherInfects"](play, game)).resolves.toStrictEqual<Game>(expectedGame);
    });
  });

  describe("werewolvesEat", () => {
    it("should return game as is when expected target count is not reached.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto();
      const expectedGame = createFakeGame(game);
      mocks.gamePlayMakerService.accursedWolfFatherInfects.mockReturnValue(expectedGame);

      expect(services.gamePlayMaker["werewolvesEat"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should add eaten attribute by werewolves to the target when called.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const targets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[1] })];
      const play = createFakeMakeGamePlayWithRelationsDto({ targets });
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
      mocks.playerKillerService.getElderLivesCountAgainstWerewolves.mockReturnValue(2);
      mocks.gamePlayMakerService.accursedWolfFatherInfects.mockReturnValue(expectedGame);

      expect(services.gamePlayMaker["werewolvesEat"](play, game)).toStrictEqual<Game>(expectedGame);
    });
  });

  describe("stutteringJudgeRequestsAnotherVote", () => {
    it("should return game as is when stuttering judge does not request another vote.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeStutteringJudgeAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: false });
      const expectedGame = createFakeGame(game);

      expect(services.gamePlayMaker["stutteringJudgeRequestsAnotherVote"](play, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should return game with prepended vote of cause stuttering judge request when stuttering judge does request another vote.", () => {
      const players = [
        createFakeFoxAlivePlayer(),
        createFakeStutteringJudgeAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players });
      const play = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      services.gamePlayMaker["stutteringJudgeRequestsAnotherVote"](play, game);

      expect(mocks.gameMutator.prependUpcomingPlayInGame).toHaveBeenCalledExactlyOnceWith(createFakeGamePlaySurvivorsVote({ causes: ["stuttering-judge-request"] }), game);
    });
  });
});