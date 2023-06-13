import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../../../../../../src/modules/game/enums/player.enum";
import { GamePlaysMakerService } from "../../../../../../../../src/modules/game/providers/services/game-play/game-plays-maker.service";
import { PlayerKillerService } from "../../../../../../../../src/modules/game/providers/services/player/player-killer.service";
import type { GameHistoryRecord } from "../../../../../../../../src/modules/game/schemas/game-history-record/game-history-record.schema";
import { ROLE_NAMES } from "../../../../../../../../src/modules/role/enums/role.enum";
import { createFakeMakeGamePlayWithRelationsDto } from "../../../../../../../factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeGamePlayWerewolvesEat } from "../../../../../../../factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";

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

    it("should call werewolvesEat method when it's werewolves turn.", () => {
      const play = createFakeMakeGamePlayWithRelationsDto();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayWerewolvesEat()] });
      const gameHistoryRecords: GameHistoryRecord[] = [];
      services.gamePlaysMaker.makeGamePlay(play, game, gameHistoryRecords);
      
      expect(localMocks.gamePlaysMakerService.werewolvesEat).toHaveBeenCalledOnce();
    });
  });
});