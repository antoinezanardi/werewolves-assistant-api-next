import { Test } from "@nestjs/testing";
import { when } from "jest-when";
import type { TestingModule } from "@nestjs/testing";

import { GameHistoryRecordVotingResults } from "@/modules/game/enums/game-history-record.enum";
import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { PlayerGroups } from "@/modules/game/enums/player.enum";
import * as GameHelper from "@/modules/game/helpers/game.helper";
import { GameHistoryRecordRepository } from "@/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "@/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlayValidatorService } from "@/modules/game/providers/services/game-play/game-play-validator.service";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";
import { BadGamePlayPayloadException } from "@/shared/exception/types/bad-game-play-payload-exception.type";

import { createFakeMakeGamePlayTargetWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-target-with-relations.dto.factory";
import { createFakeMakeGamePlayVoteWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-vote-with-relations.dto.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordSurvivorsVotePlay, createFakeGameHistoryRecordGuardProtectPlay, createFakeGameHistoryRecordPlay, createFakeGameHistoryRecordPlayVoting, createFakeGameHistoryRecordWerewolvesEatPlay, createFakeGameHistoryRecordWitchUsePotionsPlay } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakePiedPiperGameOptions, createFakeRolesGameOptions, createFakeThiefGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeVotesGameOptions } from "@tests/factories/game/schemas/game-options/votes-game-options.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";
import { createFakeGamePlay, createFakeGamePlaySurvivorsElectSheriff, createFakeGamePlaySurvivorsVote, createFakeGamePlayBigBadWolfEats, createFakeGamePlayCupidCharms, createFakeGamePlayDogWolfChoosesSide, createFakeGamePlayFoxSniffs, createFakeGamePlayGuardProtects, createFakeGamePlayHunterShoots, createFakeGamePlayPiedPiperCharms, createFakeGamePlayRavenMarks, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySeerLooks, createFakeGamePlaySheriffDelegates, createFakeGamePlaySheriffSettlesVotes, createFakeGamePlayThiefChoosesCard, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWildChildChoosesModel, createFakeGamePlayWitchUsesPotions } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCantVoteBySurvivorsPlayerAttribute, createFakeEatenByWerewolvesPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeDogWolfAlivePlayer, createFakeIdiotAlivePlayer, createFakeSeerAlivePlayer, createFakeStutteringJudgeAlivePlayer, createFakeVileFatherOfWolvesAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers, createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

jest.mock("@/shared/exception/types/bad-game-play-payload-exception.type");

describe("Game Play Validator Service", () => {
  let mocks: {
    gameRepository: {
      find: jest.SpyInstance;
      findOne: jest.SpyInstance;
      create: jest.SpyInstance;
      updateOne: jest.SpyInstance;
    };
    gameHistoryRecordRepository: {
      find: jest.SpyInstance;
      create: jest.SpyInstance;
    };
    gameHistoryRecordService: {
      getLastGameHistoryGuardProtectsRecord: jest.SpyInstance;
      getLastGameHistoryTieInVotesRecord: jest.SpyInstance;
      getGameHistoryWitchUsesSpecificPotionRecords: jest.SpyInstance;
      getGameHistoryVileFatherOfWolvesInfectedRecords: jest.SpyInstance;
      getGameHistoryJudgeRequestRecords: jest.SpyInstance;
    };
  };
  let services: { gamePlayValidator: GamePlayValidatorService };

  beforeEach(async() => {
    mocks = {
      gameRepository: {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        updateOne: jest.fn(),
      },
      gameHistoryRecordRepository: {
        find: jest.fn(),
        create: jest.fn(),
      },
      gameHistoryRecordService: {
        getLastGameHistoryGuardProtectsRecord: jest.fn(),
        getLastGameHistoryTieInVotesRecord: jest.fn(),
        getGameHistoryWitchUsesSpecificPotionRecords: jest.fn(),
        getGameHistoryVileFatherOfWolvesInfectedRecords: jest.fn(),
        getGameHistoryJudgeRequestRecords: jest.fn(),
      },
    };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamePlayValidatorService,
        {
          provide: GameHistoryRecordService,
          useValue: mocks.gameHistoryRecordService,
        },
        {
          provide: GameRepository,
          useValue: mocks.gameRepository,
        },
        {
          provide: GameHistoryRecordRepository,
          useValue: mocks.gameHistoryRecordRepository,
        },
      ],
    }).compile();
    
    services = { gamePlayValidator: module.get<GamePlayValidatorService>(GamePlayValidatorService) };
  });
  
  describe("validateGamePlayWithRelationsDto", () => {
    let localMocks: {
      gamePlayValidatorService: {
        validateGamePlayWithRelationsDtoJudgeRequest: jest.SpyInstance;
        validateGamePlayWithRelationsDtoChosenSide: jest.SpyInstance;
        validateGamePlayVotesWithRelationsDto: jest.SpyInstance;
        validateGamePlayTargetsWithRelationsDto: jest.SpyInstance;
        validateGamePlayWithRelationsDtoChosenCard: jest.SpyInstance;
      };
      unexpectedExceptionFactory: { createNoCurrentGamePlayUnexpectedException: jest.SpyInstance };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayValidatorService: {
          validateGamePlayWithRelationsDtoJudgeRequest: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayWithRelationsDtoJudgeRequest }, "validateGamePlayWithRelationsDtoJudgeRequest").mockImplementation(),
          validateGamePlayWithRelationsDtoChosenSide: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayWithRelationsDtoChosenSide }, "validateGamePlayWithRelationsDtoChosenSide").mockImplementation(),
          validateGamePlayVotesWithRelationsDto: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayVotesWithRelationsDto }, "validateGamePlayVotesWithRelationsDto").mockImplementation(),
          validateGamePlayTargetsWithRelationsDto: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsWithRelationsDto }, "validateGamePlayTargetsWithRelationsDto").mockImplementation(),
          validateGamePlayWithRelationsDtoChosenCard: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayWithRelationsDtoChosenCard }, "validateGamePlayWithRelationsDtoChosenCard").mockImplementation(),
        },
        unexpectedExceptionFactory: { createNoCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoCurrentGamePlayUnexpectedException").mockImplementation() },
      };
    });
    
    it("should throw error when game's current play is not set.", async() => {
      const game = createFakeGame();
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      const interpolations = { gameId: game._id };
      
      await expect(services.gamePlayValidator.validateGamePlayWithRelationsDto(makeGamePlayWithRelationsDto, game)).toReject();
      expect(localMocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("validateGamePlayWithRelationsDto", interpolations);
    });

    it("should call validators when called.", async() => {
      const game = createFakeGame({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      await services.gamePlayValidator.validateGamePlayWithRelationsDto(makeGamePlayWithRelationsDto, game);
      
      expect(localMocks.gamePlayValidatorService.validateGamePlayWithRelationsDtoJudgeRequest).toHaveBeenCalledOnce();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWithRelationsDtoChosenSide).toHaveBeenCalledOnce();
      expect(localMocks.gamePlayValidatorService.validateGamePlayVotesWithRelationsDto).toHaveBeenCalledOnce();
      expect(localMocks.gamePlayValidatorService.validateGamePlayTargetsWithRelationsDto).toHaveBeenCalledOnce();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWithRelationsDtoChosenCard).toHaveBeenCalledOnce();
    });
  });

  describe("validateGamePlayThiefChosenCard", () => {
    it("should do nothing when game additional cards are not set.", () => {
      const chosenCard = createFakeGameAdditionalCard();
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: true }) }) });
      const game = createFakeGameWithCurrentPlay({ options });

      expect(() => services.gamePlayValidator["validateGamePlayThiefChosenCard"](chosenCard, game)).not.toThrow();
    });
    
    it("should do nothing when game additional cards are set but thief can skip even if all cards are werewolves.", () => {
      const chosenCard = createFakeGameAdditionalCard();
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: false }) }) });
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WHITE_WEREWOLF }),
      ];
      const game = createFakeGameWithCurrentPlay({ additionalCards, options });

      expect(() => services.gamePlayValidator["validateGamePlayThiefChosenCard"](chosenCard, game)).not.toThrow();
    });

    it("should do nothing when thief can't skip if all cards are werewolves but they are not so he can skip.", () => {
      const chosenCard = undefined;
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: true }) }) });
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.SEER }),
      ];
      const game = createFakeGameWithCurrentPlay({ additionalCards, options });

      expect(() => services.gamePlayValidator["validateGamePlayThiefChosenCard"](chosenCard, game)).not.toThrow();
    });

    it("should do nothing when thief can't skip if all cards are werewolves but he chose one anyway.", () => {
      const chosenCard = createFakeGameAdditionalCard();
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: true }) }) });
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WHITE_WEREWOLF }),
      ];
      const game = createFakeGameWithCurrentPlay({ additionalCards, options });

      expect(() => services.gamePlayValidator["validateGamePlayThiefChosenCard"](chosenCard, game)).not.toThrow();
    });

    it("should throw error when all additional cards are werewolves and thief didn't choose a card.", () => {
      const chosenCard = undefined;
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ thief: createFakeThiefGameOptions({ mustChooseBetweenWerewolves: true }) }) });
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WHITE_WEREWOLF }),
      ];
      const game = createFakeGameWithCurrentPlay({ additionalCards, options });

      expect(() => services.gamePlayValidator["validateGamePlayThiefChosenCard"](chosenCard, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Thief must choose a card (`chosenCard`)");
    });
  });

  describe("validateGamePlayWithRelationsDtoChosenCard", () => {
    let localMocks: {
      gamePlayValidatorService: {
        validateGamePlayThiefChosenCard: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = { gamePlayValidatorService: { validateGamePlayThiefChosenCard: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayThiefChosenCard }, "validateGamePlayThiefChosenCard").mockImplementation() } };
    });

    it("should do nothing when chosen card is not defined and not expected.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDogWolfChoosesSide() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();
      
      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenCard"](makeGamePlayWithRelationsDto, game)).not.toThrow();
    });

    it("should throw error when chosen card is defined but not expected.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDogWolfChoosesSide() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenCard: createFakeGameAdditionalCard() });
      
      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenCard"](makeGamePlayWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`chosenCard` can't be set on this current game's state");
    });

    it("should call validateGamePlayThiefChosenCard method when action is choose card.", () => {
      const chosenCard = createFakeGameAdditionalCard();
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayThiefChoosesCard() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenCard });
      services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenCard"](makeGamePlayWithRelationsDto, game);

      expect(localMocks.gamePlayValidatorService.validateGamePlayThiefChosenCard).toHaveBeenCalledExactlyOnceWith(chosenCard, game);
    });
  });

  describe("validateDrankLifePotionTargets", () => {
    it("should throw error when there are too much targets for life potion.", () => {
      const drankLifePotionTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
      ];
      const game = createFakeGame();
      
      expect(() => services.gamePlayValidator["validateDrankLifePotionTargets"](drankLifePotionTargets, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("There are too much targets which drank life potion (`targets.drankPotion`)");
    });

    it("should throw error when life potion target is not alive.", () => {
      const targetedPlayer = createFakePlayer({ isAlive: false, attributes: [createFakeEatenByWerewolvesPlayerAttribute()] });
      const drankLifePotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WitchPotions.LIFE })];
      const game = createFakeGame();
      
      expect(() => services.gamePlayValidator["validateDrankLifePotionTargets"](drankLifePotionTargets, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Life potion can't be applied to this target (`targets.drankPotion`)");
    });

    it("should throw error when life potion target is not eaten by werewolves.", () => {
      const targetedPlayer = createFakePlayer({ isAlive: true, attributes: [] });
      const drankLifePotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WitchPotions.LIFE })];
      const game = createFakeGame();
      
      expect(() => services.gamePlayValidator["validateDrankLifePotionTargets"](drankLifePotionTargets, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Life potion can't be applied to this target (`targets.drankPotion`)");
    });

    it("should do nothing when there is no life potion target.", () => {
      const game = createFakeGame();

      expect(() => services.gamePlayValidator["validateDrankLifePotionTargets"]([], game)).not.toThrow();
    });

    it("should do nothing when life potion target is applied on valid target.", () => {
      const targetedPlayer = createFakePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()], isAlive: true });
      const drankLifePotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WitchPotions.LIFE })];
      const game = createFakeGame();
      
      expect(() => services.gamePlayValidator["validateDrankLifePotionTargets"](drankLifePotionTargets, game)).not.toThrow();
    });
  });

  describe("validateDrankDeathPotionTargets", () => {
    it("should throw error when there are too much targets for death potion.", () => {
      const drankDeathPotionTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
      ];
      
      expect(() => services.gamePlayValidator["validateDrankDeathPotionTargets"](drankDeathPotionTargets)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("There are too much targets which drank death potion (`targets.drankPotion`)");
    });

    it("should throw error when death potion target is not alive.", () => {
      const targetedPlayer = createFakePlayer({ isAlive: false });
      const drankDeathPotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WitchPotions.DEATH })];
      
      expect(() => services.gamePlayValidator["validateDrankDeathPotionTargets"](drankDeathPotionTargets)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Death potion can't be applied to this target (`targets.drankPotion`)");
    });

    it("should do nothing when there is no death potion target.", () => {
      expect(() => services.gamePlayValidator["validateDrankDeathPotionTargets"]([])).not.toThrow();
    });

    it("should do nothing when death potion target is applied on valid target.", () => {
      const targetedPlayer = createFakePlayer({ isAlive: true });
      const drankDeathPotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WitchPotions.DEATH })];
      
      expect(() => services.gamePlayValidator["validateDrankDeathPotionTargets"](drankDeathPotionTargets)).not.toThrow();
    });
  });

  describe("validateGamePlayWitchTargets", () => {
    let localMocks: {
      gamePlayValidatorService: {
        validateDrankLifePotionTargets: jest.SpyInstance;
        validateDrankDeathPotionTargets: jest.SpyInstance;
      };
    };
    
    beforeEach(() => {
      localMocks = {
        gamePlayValidatorService: {
          validateDrankLifePotionTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateDrankLifePotionTargets }, "validateDrankLifePotionTargets").mockImplementation(),
          validateDrankDeathPotionTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateDrankDeathPotionTargets }, "validateDrankDeathPotionTargets").mockImplementation(),
        },
      };
    });
    
    it("should throw error when witch targeted someone with life potion but already used it with death potion before.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];
      const gameHistoryRecordTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
      ];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) }),
      ];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockResolvedValue(gameHistoryRecords);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue(gameHistoryRecords);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`targets.drankPotion` can't be set on this current game's state");
    });

    it("should throw error when witch targeted someone with life potion but already used it alone before.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({}),
      ];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE })];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) }),
      ];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockResolvedValue(gameHistoryRecords);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue([]);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`targets.drankPotion` can't be set on this current game's state");
    });

    it("should throw error when witch targeted someone with death potion but already used it with life potion before.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];
      const gameHistoryRecordTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
      ];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) }),
      ];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockResolvedValue(gameHistoryRecords);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue(gameHistoryRecords);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`targets.drankPotion` can't be set on this current game's state");
    });

    it("should throw error when witch targeted someone with death potion but already used it alone before.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[1], drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[2] }),
      ];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH })];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) }),
      ];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockResolvedValue([]);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue(gameHistoryRecords);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`targets.drankPotion` can't be set on this current game's state");
    });

    it("should call potions validators without players when called with valid data but no target drank potions.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() })];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockResolvedValue([]);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue([]);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(localMocks.gamePlayValidatorService.validateDrankLifePotionTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(localMocks.gamePlayValidatorService.validateDrankDeathPotionTargets).toHaveBeenCalledExactlyOnceWith([]);
    });

    it("should call potions validators with players when called without bad data and without witch history.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
      ];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockResolvedValue([]);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue([]);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(localMocks.gamePlayValidatorService.validateDrankLifePotionTargets).toHaveBeenCalledExactlyOnceWith([makeGamePlayTargetsWithRelationsDto[0]], game);
      expect(localMocks.gamePlayValidatorService.validateDrankDeathPotionTargets).toHaveBeenCalledExactlyOnceWith([makeGamePlayTargetsWithRelationsDto[1]]);
    });

    it("should call potions validators with players when called for valid life potion data and some witch history.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE })];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH })];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) })];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockReturnValue([]);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue(gameHistoryRecords);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(localMocks.gamePlayValidatorService.validateDrankLifePotionTargets).toHaveBeenCalledExactlyOnceWith([makeGamePlayTargetsWithRelationsDto[0]], game);
      expect(localMocks.gamePlayValidatorService.validateDrankDeathPotionTargets).toHaveBeenCalledExactlyOnceWith([]);
    });

    it("should call potions validators with players when called for valid death potion data and some witch history.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH })];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE })];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) })];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockResolvedValue(gameHistoryRecords);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue([]);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(localMocks.gamePlayValidatorService.validateDrankLifePotionTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(localMocks.gamePlayValidatorService.validateDrankDeathPotionTargets).toHaveBeenCalledExactlyOnceWith([makeGamePlayTargetsWithRelationsDto[0]]);
    });
  });

  describe("validateGamePlayInfectedTargets", () => {
    it("should throw error when vile father of wolves is not in the game.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ]);
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0], isInfected: true })];
      const gameHistoryRecords = [];
      mocks.gameHistoryRecordService.getGameHistoryVileFatherOfWolvesInfectedRecords.mockResolvedValue(gameHistoryRecords);

      await expect(services.gamePlayValidator["validateGamePlayInfectedTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`targets.isInfected` can't be set on this current game's state");
    });

    it("should throw error when vile father of wolves is dead.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0], isInfected: true })];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true })];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: gameHistoryRecordTargets }) })];
      mocks.gameHistoryRecordService.getGameHistoryVileFatherOfWolvesInfectedRecords.mockResolvedValue(gameHistoryRecords);

      await expect(services.gamePlayValidator["validateGamePlayInfectedTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`targets.isInfected` can't be set on this current game's state");
    });

    it("should throw error when vile father of wolves has already infected and some targets are infected.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ]);
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true })];
      const gameHistoryRecordTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true }),
        createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: false }),
      ];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: gameHistoryRecordTargets }) })];
      mocks.gameHistoryRecordService.getGameHistoryVileFatherOfWolvesInfectedRecords.mockResolvedValue(gameHistoryRecords);

      await expect(services.gamePlayValidator["validateGamePlayInfectedTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`targets.isInfected` can't be set on this current game's state");
    });

    it("should do nothing when there is no infected target.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];

      await expect(services.gamePlayValidator["validateGamePlayInfectedTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });

    it("should do nothing when infected target data is valid.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ]);
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0], isInfected: true })];
      mocks.gameHistoryRecordService.getGameHistoryVileFatherOfWolvesInfectedRecords.mockResolvedValue([]);

      await expect(services.gamePlayValidator["validateGamePlayInfectedTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });
  });

  describe("validateWerewolvesTargetsBoundaries", () => {
    let localMocks: {
      gamePlayValidatorService: { validateGamePlayTargetsBoundaries: jest.SpyInstance };
      gameHelper: {
        getLeftToEatByWerewolvesPlayers: jest.SpyInstance;
        getLeftToEatByWhiteWerewolfPlayers: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayValidatorService: { validateGamePlayTargetsBoundaries: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation() },
        gameHelper: {
          getLeftToEatByWerewolvesPlayers: jest.spyOn(GameHelper, "getLeftToEatByWerewolvesPlayers").mockReturnValue([]),
          getLeftToEatByWhiteWerewolfPlayers: jest.spyOn(GameHelper, "getLeftToEatByWhiteWerewolfPlayers").mockReturnValue([]),
        },
      };
    });

    it("should do nothing when game play source is not from available methods.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayThiefChoosesCard() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      services.gamePlayValidator["validateWerewolvesTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, game);

      expect(localMocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).not.toHaveBeenCalled();
    });

    it("should validate targets boundaries when game play source are werewolves.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      services.gamePlayValidator["validateWerewolvesTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, game);

      expect(localMocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    });

    it("should validate targets boundaries when game play source is big bad wolf and targets are available.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayBigBadWolfEats() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      localMocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([createFakeVillagerAlivePlayer(), createFakeVillagerAlivePlayer()]);
      services.gamePlayValidator["validateWerewolvesTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, game);

      expect(localMocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    });

    it("should validate targets boundaries when game play source is big bad wolf but targets are not available.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayBigBadWolfEats() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      localMocks.gameHelper.getLeftToEatByWerewolvesPlayers.mockReturnValue([]);
      services.gamePlayValidator["validateWerewolvesTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, game);

      expect(localMocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, { min: 0, max: 0 });
    });

    it("should validate targets boundaries when game play source is white werewolf and targets are available.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWhiteWerewolfEats() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      localMocks.gameHelper.getLeftToEatByWhiteWerewolfPlayers.mockReturnValue([createFakeVillagerAlivePlayer(), createFakeVillagerAlivePlayer()]);
      services.gamePlayValidator["validateWerewolvesTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, game);

      expect(localMocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, { min: 0, max: 1 });
    });

    it("should validate targets boundaries when game play source is white werewolf but targets are not available.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWhiteWerewolfEats() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      localMocks.gameHelper.getLeftToEatByWhiteWerewolfPlayers.mockReturnValue([]);
      services.gamePlayValidator["validateWerewolvesTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, game);

      expect(localMocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, { min: 0, max: 0 });
    });
  });

  describe("validateGamePlayWerewolvesTargets", () => {
    beforeEach(() => {
      jest.spyOn(services.gamePlayValidator as unknown as { validateWerewolvesTargetsBoundaries }, "validateWerewolvesTargetsBoundaries").mockImplementation();
    });

    it("should do nothing when there is no target.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat() });
      const makeGamePlayTargetsWithRelationsDto = [];
      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });

    it("should throw error when source is WEREWOLVES and targeted player is dead.", async() => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0] })];

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Werewolves can't eat this target");
    });

    it("should throw error when source is WEREWOLVES and targeted player is from werewolves side.", async() => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[1] })];

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Werewolves can't eat this target");
    });

    it("should throw error when source is BIG_BAD_WOLF and targeted player is dead.", async() => {
      const players = [
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayBigBadWolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0] })];

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Big bad wolf can't eat this target");
    });

    it("should throw error when source is BIG_BAD_WOLF and targeted player is from werewolves side.", async() => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayBigBadWolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[1] })];

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Big bad wolf can't eat this target");
    });

    it("should throw error when source is BIG_BAD_WOLF and targeted player is already eaten.", async() => {
      const players = [
        createFakeVillagerAlivePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayBigBadWolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0] })];

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Big bad wolf can't eat this target");
    });

    it("should throw error when source is WHITE_WEREWOLF and targeted player is dead.", async() => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWhiteWerewolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[1] })];

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("White werewolf can't eat this target");
    });

    it("should throw error when source is WHITE_WEREWOLF and targeted player is from villagers side.", async() => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWhiteWerewolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[2] })];

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("White werewolf can't eat this target");
    });

    it("should throw error when source is WHITE_WEREWOLF and targeted player is white werewolf himself.", async() => {
      const whiteWerewolfPlayer = createFakeWhiteWerewolfAlivePlayer();
      const players = bulkCreateFakePlayers(4, [whiteWerewolfPlayer]);
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWhiteWerewolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: whiteWerewolfPlayer })];

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("White werewolf can't eat this target");
    });

    it("should do nothing when white werewolf eaten target is valid.", async() => {
      const players = [createFakeWerewolfAlivePlayer()];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWhiteWerewolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[0] })];

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });

    it("should do nothing when big bad wolf eaten target is valid.", async() => {
      const players = [createFakeVillagerAlivePlayer()];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayBigBadWolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[0] })];

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });

    it("should do nothing when werewolves eaten target is valid.", async() => {
      const players = [createFakeVillagerAlivePlayer()];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[0] })];

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });
  });

  describe("validateGamePlayHunterTargets", () => {
    it("should throw error when targeted player is dead.", () => {
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];

      expect(() => services.gamePlayValidator["validateGamePlayHunterTargets"](makeGamePlayTargetsWithRelationsDto)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Hunter can't shoot this target");
    });

    it("should do nothing when targeted player for hunter is valid.", () => {
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() })];

      expect(() => services.gamePlayValidator["validateGamePlayHunterTargets"](makeGamePlayTargetsWithRelationsDto)).not.toThrow();
    });
  });

  describe("validateGamePlayScapeGoatTargets", () => {
    it("should throw error when one of the targeted player is dead.", () => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScapegoatBansVoting(), players });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];

      expect(() => services.gamePlayValidator["validateGamePlayScapegoatTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("At least one of the scapegoat targets can't be banned from voting");
    });

    it("should do nothing when all scapegoat's targets are valid.", () => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScapegoatBansVoting(), players });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];

      expect(() => services.gamePlayValidator["validateGamePlayScapegoatTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayCupidTargets", () => {
    it("should throw error when one of the targeted player is dead.", () => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) }),
      ];

      expect(() => services.gamePlayValidator["validateGamePlayCupidTargets"](makeGamePlayTargetsWithRelationsDto)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("At least one of the cupid targets can't be charmed");
    });

    it("should do nothing when all cupid's targets are valid.", () => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
      ];

      expect(() => services.gamePlayValidator["validateGamePlayCupidTargets"](makeGamePlayTargetsWithRelationsDto)).not.toThrow();
    });
  });

  describe("validateGamePlayFoxTargets", () => {
    it("should throw error when targeted player is dead.", () => {
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];

      expect(() => services.gamePlayValidator["validateGamePlayFoxTargets"](makeGamePlayTargetsWithRelationsDto)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Fox can't sniff this target");
    });

    it("should do nothing when targeted player for fox is valid.", () => {
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() })];

      expect(() => services.gamePlayValidator["validateGamePlayFoxTargets"](makeGamePlayTargetsWithRelationsDto)).not.toThrow();
    });
  });

  describe("validateGamePlaySeerTargets", () => {
    it("should throw error when targeted player is dead.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];

      expect(() => services.gamePlayValidator["validateGamePlaySeerTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Seer can't look at this target");
    });

    it("should throw error when targeted player is seer herself.", () => {
      const seerPlayer = createFakeSeerAlivePlayer();
      const players = bulkCreateFakePlayers(4, [seerPlayer]);
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: seerPlayer })];

      expect(() => services.gamePlayValidator["validateGamePlaySeerTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Seer can't look at this target");
    });

    it("should do nothing when seer's targeted player is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];

      expect(() => services.gamePlayValidator["validateGamePlaySeerTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayRavenTargets", () => {
    it("should throw error when targeted player is dead.", () => {
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];

      expect(() => services.gamePlayValidator["validateGamePlayRavenTargets"](makeGamePlayTargetsWithRelationsDto)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Raven can't mark this target");
    });

    it("should do nothing when there are no targets.", () => {
      const makeGamePlayTargetsWithRelationsDto = [];

      expect(() => services.gamePlayValidator["validateGamePlayRavenTargets"](makeGamePlayTargetsWithRelationsDto)).not.toThrow();
    });

    it("should do nothing when raven's target is valid.", () => {
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];

      expect(() => services.gamePlayValidator["validateGamePlayRavenTargets"](makeGamePlayTargetsWithRelationsDto)).not.toThrow();
    });
  });

  describe("validateGamePlayWildChildTargets", () => {
    it("should throw error when targeted player is dead.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWildChildChoosesModel() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];

      expect(() => services.gamePlayValidator["validateGamePlayWildChildTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Wild child can't choose this target as a model");
    });

    it("should throw error when targeted player is wild child himself.", () => {
      const wildChildPlayer = createFakeWildChildAlivePlayer();
      const players = bulkCreateFakePlayers(4, [wildChildPlayer]);
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWildChildChoosesModel(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: wildChildPlayer })];

      expect(() => services.gamePlayValidator["validateGamePlayWildChildTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Wild child can't choose this target as a model");
    });

    it("should do nothing when wild child's targeted player is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWildChildChoosesModel() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];

      expect(() => services.gamePlayValidator["validateGamePlayWildChildTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayPiedPiperTargets", () => {
    let validateGamePlayTargetsBoundariesMock: jest.SpyInstance;

    beforeEach(() => {
      validateGamePlayTargetsBoundariesMock = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
    });

    it("should throw error when one of the targeted player is not in the last to charm.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayPiedPiperCharms() });
      const leftToCharmPlayers = [
        createFakeWildChildAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeSeerAlivePlayer(),
      ];
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: leftToCharmPlayers[0] }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: leftToCharmPlayers[1] }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: leftToCharmPlayers[2] }),
      ];
      jest.spyOn(GameHelper, "getLeftToCharmByPiedPiperPlayers").mockReturnValue(leftToCharmPlayers);

      expect(() => services.gamePlayValidator["validateGamePlayPiedPiperTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("At least one of the pied piper targets can't be charmed");
    });

    it("should do nothing when pied piper targets are valid and limited to game options.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ charmedPeopleCountPerNight: 2 }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayPiedPiperCharms(), options });
      const leftToCharmPlayers = [
        createFakeWildChildAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: leftToCharmPlayers[0] }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: leftToCharmPlayers[1] }),
      ];
      jest.spyOn(GameHelper, "getLeftToCharmByPiedPiperPlayers").mockReturnValue(leftToCharmPlayers);

      expect(() => services.gamePlayValidator["validateGamePlayPiedPiperTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
      expect(validateGamePlayTargetsBoundariesMock).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, { min: 2, max: 2 });
    });

    it("should do nothing when pied piper targets are valid and limited to left players to charm count.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ charmedPeopleCountPerNight: 5 }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayPiedPiperCharms(), options });
      const leftToCharmPlayers = [createFakeWildChildAlivePlayer()];
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: leftToCharmPlayers[0] })];
      jest.spyOn(GameHelper, "getLeftToCharmByPiedPiperPlayers").mockReturnValue(leftToCharmPlayers);

      expect(() => services.gamePlayValidator["validateGamePlayPiedPiperTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
      expect(validateGamePlayTargetsBoundariesMock).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    });
  });

  describe("validateGamePlayGuardTargets", () => {
    it("should throw error when targeted player is dead.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayGuardProtects() });
      const targetedPlayer = createFakeVillagerAlivePlayer({ isAlive: false });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })];

      await expect(services.gamePlayValidator["validateGamePlayGuardTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Guard can't protect this target");
    });

    it("should throw error when targeted player is the same as previous guard play and game option doesn't allow this.", async() => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ guard: { canProtectTwice: false } }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayGuardProtects(), options });
      const targetedPlayer = createFakeVillagerAlivePlayer();
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })];
      mocks.gameHistoryRecordService.getLastGameHistoryGuardProtectsRecord.mockResolvedValue(createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordGuardProtectPlay({ targets: [{ player: targetedPlayer }] }) }));

      await expect(services.gamePlayValidator["validateGamePlayGuardTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Guard can't protect this target");
    });

    it("should do nothing when targeted player is the same as previous guard play and game option allow this.", async() => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ guard: { canProtectTwice: true } }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayGuardProtects(), options });
      const targetedPlayer = createFakeVillagerAlivePlayer();
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })];
      mocks.gameHistoryRecordService.getLastGameHistoryGuardProtectsRecord.mockResolvedValue(createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordGuardProtectPlay({ targets: [{ player: targetedPlayer }] }) }));

      await expect(services.gamePlayValidator["validateGamePlayGuardTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });

    it("should do nothing when targeted player is not the same as previous guard play.", async() => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ guard: { canProtectTwice: false } }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayGuardProtects(), options });
      const targetedPlayer = createFakeVillagerAlivePlayer();
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })];
      mocks.gameHistoryRecordService.getLastGameHistoryGuardProtectsRecord.mockResolvedValue(createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordGuardProtectPlay({ targets: [{ player: createFakeSeerAlivePlayer() }] }) }));

      await expect(services.gamePlayValidator["validateGamePlayGuardTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });
  });

  describe("validateGamePlaySheriffTargets", () => {
    it("should do nothing when game play action is not DELEGATE nor SETTLE_VOTES.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffDelegates({ action: GamePlayActions.USE_POTIONS }) });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      await expect(services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });

    it("should throw error when targeted player is dead and upcoming action is DELEGATE.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffDelegates() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];

      await expect(services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Sheriff can't delegate his role to this target");
    });

    it("should do nothing when targeted player for sheriff delegation is valid.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffDelegates() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() })];

      await expect(services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });

    it("should throw error when targeted player is not in last tie in votes and upcoming action is SETTLE_VOTES.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffSettlesVotes() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      const gameHistoryRecordPlayVoting = createFakeGameHistoryRecordPlayVoting({ result: GameHistoryRecordVotingResults.TIE, nominatedPlayers: [createFakeSeerAlivePlayer()] });
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValue(createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordSurvivorsVotePlay({ voting: gameHistoryRecordPlayVoting }) }));

      await expect(services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("Sheriff can't break the tie in votes with this target");
    });

    it("should do nothing when targeted player for sheriff settling votes is valid.", async() => {
      const game = createFakeGameWithCurrentPlay({ players: bulkCreateFakePlayers(4), currentPlay: createFakeGamePlaySheriffSettlesVotes() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0] })];
      const gameHistoryRecordPlayVoting = createFakeGameHistoryRecordPlayVoting({ result: GameHistoryRecordVotingResults.TIE, nominatedPlayers: [game.players[0]] });
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValue(createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordSurvivorsVotePlay({ voting: gameHistoryRecordPlayVoting }) }));

      await expect(services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });
  });

  describe("validateGamePlayTargetsBoundaries", () => {
    it("should throw error when min boundary is not respected.", () => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];

      expect(() => services.gamePlayValidator["validateGamePlayTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, { min: 4, max: 4 })).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("There are too less targets for this current game's state");
    });

    it("should throw error when max boundary is not respected.", () => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];

      expect(() => services.gamePlayValidator["validateGamePlayTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, { min: 2, max: 2 })).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("There are too much targets for this current game's state");
    });

    it("should do nothing when boundaries are respected, even equal to max.", () => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];

      expect(() => services.gamePlayValidator["validateGamePlayTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, { min: 1, max: 3 })).not.toThrow();
    });

    it("should do nothing when boundaries are respected, even equal to min.", () => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];

      expect(() => services.gamePlayValidator["validateGamePlayTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, { min: 3, max: 4 })).not.toThrow();
    });
  });

  describe("validateGamePlaySourceTargets", () => {
    let localMocks: {
      gamePlayValidatorService: {
        validateGamePlaySheriffTargets: jest.SpyInstance;
        validateGamePlayGuardTargets: jest.SpyInstance;
        validateGamePlayPiedPiperTargets: jest.SpyInstance;
        validateGamePlayWildChildTargets: jest.SpyInstance;
        validateGamePlayRavenTargets: jest.SpyInstance;
        validateGamePlaySeerTargets: jest.SpyInstance;
        validateGamePlayFoxTargets: jest.SpyInstance;
        validateGamePlayCupidTargets: jest.SpyInstance;
        validateGamePlayScapegoatTargets: jest.SpyInstance;
        validateGamePlayHunterTargets: jest.SpyInstance;
        validateGamePlayWerewolvesTargets: jest.SpyInstance;
        validateGamePlayWitchTargets: jest.SpyInstance;
      };
    };
    
    beforeEach(() => {
      localMocks = {
        gamePlayValidatorService: {
          validateGamePlaySheriffTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlaySheriffTargets }, "validateGamePlaySheriffTargets").mockImplementation(),
          validateGamePlayGuardTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayGuardTargets }, "validateGamePlayGuardTargets").mockImplementation(),
          validateGamePlayPiedPiperTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayPiedPiperTargets }, "validateGamePlayPiedPiperTargets").mockImplementation(),
          validateGamePlayWildChildTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayWildChildTargets }, "validateGamePlayWildChildTargets").mockImplementation(),
          validateGamePlayRavenTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayRavenTargets }, "validateGamePlayRavenTargets").mockImplementation(),
          validateGamePlaySeerTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlaySeerTargets }, "validateGamePlaySeerTargets").mockImplementation(),
          validateGamePlayFoxTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayFoxTargets }, "validateGamePlayFoxTargets").mockImplementation(),
          validateGamePlayCupidTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayCupidTargets }, "validateGamePlayCupidTargets").mockImplementation(),
          validateGamePlayScapegoatTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayScapegoatTargets }, "validateGamePlayScapegoatTargets").mockImplementation(),
          validateGamePlayHunterTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayHunterTargets }, "validateGamePlayHunterTargets").mockImplementation(),
          validateGamePlayWerewolvesTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayWerewolvesTargets }, "validateGamePlayWerewolvesTargets").mockImplementation(),
          validateGamePlayWitchTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayWitchTargets }, "validateGamePlayWitchTargets").mockImplementation(),
        },
      };
    });

    it("should do nothing when game source doesn't have a validation method.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlay({ source: createFakeGamePlaySource({ name: RoleNames.IDIOT }) }) });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call sheriff validator when game current play is for the sheriff.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffSettlesVotes() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call werewolves validator when game current play is for the werewolves.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call werewolves validator when game current play is for the big bad wolf.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayBigBadWolfEats() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call werewolves validator when game current play is for the white werewolf.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWhiteWerewolfEats() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call guard validator when game current play is for the guard.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayGuardProtects() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });
    
    it("should call pied piper validator when game current play is for the pied piper.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayPiedPiperCharms() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });
    
    it("should call wild child validator when game current play is for the wild child.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWildChildChoosesModel() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });
    
    it("should call raven validator when game current play is for the raven.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayRavenMarks() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).toHaveBeenCalledExactlyOnceWith([]);
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });
    
    it("should call seer validator when game current play is for the seer.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call fox validator when game current play is for the fox.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).toHaveBeenCalledExactlyOnceWith([]);
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call cupid validator when game current play is for the cupid.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayCupidCharms() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).toHaveBeenCalledExactlyOnceWith([]);
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call scapegoat validator when game current play is for the scapegoat.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScapegoatBansVoting() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call hunter validator when game current play is for the hunter.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayHunterShoots() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).toHaveBeenCalledExactlyOnceWith([]);
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call witch validator when game current play is for the witch.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(localMocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayGuardTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayRavenTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(localMocks.gamePlayValidatorService.validateGamePlayWitchTargets).toHaveBeenCalledExactlyOnceWith([], game);
    });
  });

  describe("validateInfectedTargetsAndPotionUsage", () => {
    it("should throw error when expected action is not EAT and some targets are infected.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ]);
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat({ action: GamePlayActions.CHOOSE_CARD }), players });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];
      
      expect(() => services.gamePlayValidator["validateInfectedTargetsAndPotionUsage"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`targets.isInfected` can't be set on this current game's state");
    });

    it("should throw error when expected source is not WEREWOLVES and some targets are infected.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ]);
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat({ source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS }) }), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true })];
      
      expect(() => services.gamePlayValidator["validateInfectedTargetsAndPotionUsage"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`targets.isInfected` can't be set on this current game's state");
    });

    it("should do nothing when there are infected targets and expected expected play is valid.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ]);
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true })];

      expect(() => services.gamePlayValidator["validateInfectedTargetsAndPotionUsage"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
    
    it("should throw error when expected action is not USE_POTIONS but targets drank potions.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions({ action: GamePlayActions.CHOOSE_CARD }) });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];
      
      expect(() => services.gamePlayValidator["validateInfectedTargetsAndPotionUsage"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`targets.drankPotion` can't be set on this current game's state");
    });

    it("should throw error when expected source is not WITCH but targets drank potions.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions({ source: createFakeGamePlaySource({ name: RoleNames.THIEF }) }) });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];
      
      expect(() => services.gamePlayValidator["validateInfectedTargetsAndPotionUsage"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`targets.drankPotion` can't be set on this current game's state");
    });

    it("should do nothing when expected some players drank potions and game play is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];

      expect(() => services.gamePlayValidator["validateInfectedTargetsAndPotionUsage"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayTargetsWithRelationsDto", () => {
    let localMocks: {
      gamePlayValidatorService: {
        validateInfectedTargetsAndPotionUsage: jest.SpyInstance;
        validateGamePlaySourceTargets: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayValidatorService: {
          validateInfectedTargetsAndPotionUsage: jest.spyOn(services.gamePlayValidator as unknown as { validateInfectedTargetsAndPotionUsage }, "validateInfectedTargetsAndPotionUsage").mockImplementation(),
          validateGamePlaySourceTargets: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlaySourceTargets }, "validateGamePlaySourceTargets").mockImplementation(),
        },
      };
    });

    it("should do nothing when there are no targets defined and upcoming action doesn't require targets anyway.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });

      await expect(services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"](undefined, game)).toResolve();
      expect(localMocks.gamePlayValidatorService.validateInfectedTargetsAndPotionUsage).not.toHaveBeenCalled();
    });

    it("should do nothing when there are no targets (empty array) and upcoming action doesn't require targets anyway.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });

      await expect(services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"]([], game)).toResolve();
      expect(localMocks.gamePlayValidatorService.validateInfectedTargetsAndPotionUsage).not.toHaveBeenCalled();
    });

    it("should throw error when there is no targets but they are required.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks() });

      await expect(services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"]([], game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`targets` is required on this current game's state");
    });

    it("should throw error when there are targets but they are not expected.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];

      await expect(services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"](makeGamePlayTargetsWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`targets` can't be set on this current game's state");
    });

    it("should call targets validators when targets data is valid.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];

      await expect(services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(localMocks.gamePlayValidatorService.validateGamePlaySourceTargets).toHaveBeenCalledOnce();
      expect(localMocks.gamePlayValidatorService.validateInfectedTargetsAndPotionUsage).toHaveBeenCalledOnce();
    });
  });

  describe("validateGamePlayVotesTieBreakerWithRelationsDto", () => {
    it("should throw error when there is no previous tie in votes record.", async() => {
      const players = bulkCreateFakePlayers(4);
      const game = createFakeGameWithCurrentPlay({ players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto(),
        createFakeMakeGamePlayVoteWithRelationsDto(),
        createFakeMakeGamePlayVoteWithRelationsDto(),
      ];

      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValue(null);

      await expect(services.gamePlayValidator["validateGamePlayVotesTieBreakerWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("One vote's target is not in the previous tie in votes");
    });

    it("should throw error when one voted player is not in the previous tie.", async() => {
      const players = bulkCreateFakePlayers(4);
      const game = createFakeGameWithCurrentPlay({ players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[2] }),
      ];

      const lastTieInVotesRecordPlayVoting = createFakeGameHistoryRecordPlayVoting({ nominatedPlayers: [players[0], players[1]] });
      const lastTieInVotesRecord = createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ voting: lastTieInVotesRecordPlayVoting }) });
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValue(lastTieInVotesRecord);

      await expect(services.gamePlayValidator["validateGamePlayVotesTieBreakerWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("One vote's target is not in the previous tie in votes");
    });

    it("should do nothing when all voted players were in previous tie.", async() => {
      const players = bulkCreateFakePlayers(4);
      const game = createFakeGameWithCurrentPlay({ players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[1] }),
      ];

      const lastTieInVotesRecordPlayVoting = createFakeGameHistoryRecordPlayVoting({ nominatedPlayers: [players[0], players[1]] });
      const lastTieInVotesRecord = createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordPlay({ voting: lastTieInVotesRecordPlayVoting }) });
      mocks.gameHistoryRecordService.getLastGameHistoryTieInVotesRecord.mockResolvedValue(lastTieInVotesRecord);

      await expect(services.gamePlayValidator["validateGamePlayVotesTieBreakerWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).toResolve();
    });
  });

  describe("validateGamePlayVotesWithRelationsDtoSourceAndTarget", () => {
    it("should throw error when one vote source is dead.", () => {
      const players = [
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[1] }),
      ];

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDtoSourceAndTarget"](makeGamePlayVotesWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("One source is not able to vote because he's dead or doesn't have the ability to do so");
    });

    it("should throw error when one vote source doesn't have the ability to vote.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[1] }),
      ];

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDtoSourceAndTarget"](makeGamePlayVotesWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("One source is not able to vote because he's dead or doesn't have the ability to do so");
    });

    it("should throw error when one vote target is dead.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[3], target: players[0] }),
      ];

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDtoSourceAndTarget"](makeGamePlayVotesWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("One target can't be voted because he's dead");
    });

    it("should throw error when there are votes with the same source and target.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGame({ players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[1] }),
      ];

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDtoSourceAndTarget"](makeGamePlayVotesWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("One vote has the same source and target");
    });
  });

  describe("validateUnsetGamePlayVotesWithRelationsDto", () => {
    it("should do nothing when there is no vote but nobody can votes.", () => {
      const players = [
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
        createFakeIdiotAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
      ];
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: false }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote(), options });

      expect(() => services.gamePlayValidator["validateUnsetGamePlayVotesWithRelationsDto"](game)).not.toThrow();
    });

    it("should do nothing when there is no vote but votes can be skipped.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
      ];
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote(), options });

      expect(() => services.gamePlayValidator["validateUnsetGamePlayVotesWithRelationsDto"](game)).not.toThrow();
    });

    it("should do nothing when there is no vote when angel presence but it's not a vote action.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE, action: GamePlayActions.CHOOSE_CARD }), options });

      expect(() => services.gamePlayValidator["validateUnsetGamePlayVotesWithRelationsDto"](game)).not.toThrow();
    });

    it("should throw error when there is no vote but they are required.", () => {
      const players = [
        createFakeSeerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: false }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote(), options });

      expect(() => services.gamePlayValidator["validateUnsetGamePlayVotesWithRelationsDto"](game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`votes` is required on this current game's state");
    });

    it("should throw error when there is no vote but it's sheriff election time.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsElectSheriff(), options });

      expect(() => services.gamePlayValidator["validateUnsetGamePlayVotesWithRelationsDto"](game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`votes` is required on this current game's state");
    });

    it("should throw error when there is no vote but votes are because of angel presence.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const options = createFakeGameOptions({ votes: createFakeVotesGameOptions({ canBeSkipped: true }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE }), options });

      expect(() => services.gamePlayValidator["validateUnsetGamePlayVotesWithRelationsDto"](game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledExactlyOnceWith("`votes` is required on this current game's state");
    });
  });

  describe("validateGamePlayVotesWithRelationsDto", () => {
    let localMocks: {
      gamePlayValidatorService: {
        validateGamePlayVotesTieBreakerWithRelationsDto: jest.SpyInstance;
        validateUnsetGamePlayVotesWithRelationsDto: jest.SpyInstance;
        validateGamePlayVotesWithRelationsDtoSourceAndTarget: jest.SpyInstance;
      };
    };

    beforeEach(() => {
      localMocks = {
        gamePlayValidatorService: {
          validateGamePlayVotesTieBreakerWithRelationsDto: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayVotesTieBreakerWithRelationsDto }, "validateGamePlayVotesTieBreakerWithRelationsDto").mockImplementation(),
          validateUnsetGamePlayVotesWithRelationsDto: jest.spyOn(services.gamePlayValidator as unknown as { validateUnsetGamePlayVotesWithRelationsDto }, "validateUnsetGamePlayVotesWithRelationsDto").mockImplementation(),
          validateGamePlayVotesWithRelationsDtoSourceAndTarget: jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayVotesWithRelationsDtoSourceAndTarget }, "validateGamePlayVotesWithRelationsDtoSourceAndTarget").mockImplementation(),
        },
      };
    });

    it("should resolve when there are no votes defined.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat() });

      await expect(services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](undefined, game)).toResolve();
    });

    it("should call validateGamePlayVotesWithRelationsDto method when there are no votes defined.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat() });
      await services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](undefined, game);

      expect(localMocks.gamePlayValidatorService.validateUnsetGamePlayVotesWithRelationsDto).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should call validateGamePlayVotesWithRelationsDto method when there are no votes (empty array).", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat() });
      await services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"]([], game);

      expect(localMocks.gamePlayValidatorService.validateUnsetGamePlayVotesWithRelationsDto).toHaveBeenCalledExactlyOnceWith(game);
    });

    it("should throw error when there are votes but they are not expected.", async() => {
      const game = createFakeGameWithCurrentPlay({ players: bulkCreateFakePlayers(4), currentPlay: createFakeGamePlayWerewolvesEat() });
      const makeGamePlayVotesWithRelationsDto = [createFakeMakeGamePlayVoteWithRelationsDto()];

      await expect(services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`votes` can't be set on this current game's state");
    });

    it("should call validateGamePlayVotesTieBreakerWithRelationsDto when current play is because of previous votes were in ties.", async() => {
      const game = createFakeGameWithCurrentPlay({ players: bulkCreateFakePlayers(4), currentPlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }) });
      const makeGamePlayVotesWithRelationsDto = [createFakeMakeGamePlayVoteWithRelationsDto({ source: game.players[0], target: game.players[1] })];

      await expect(services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).toResolve();
      expect(localMocks.gamePlayValidatorService.validateGamePlayVotesTieBreakerWithRelationsDto).toHaveBeenCalledExactlyOnceWith(makeGamePlayVotesWithRelationsDto, game);
    });

    it("should do nothing when votes are valid.", async() => {
      const game = createFakeGameWithCurrentPlay({ players: bulkCreateFakePlayers(4), currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayVotesWithRelationsDto = [createFakeMakeGamePlayVoteWithRelationsDto({ source: game.players[0], target: game.players[1] })];

      await expect(services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).toResolve();
    });
  });

  describe("validateGamePlayWithRelationsDtoChosenSide", () => {
    it("should throw error when chosenSide is not defined and game play action is CHOOSE_SIDE.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDogWolfChoosesSide() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`chosenSide` is required on this current game's state");
    });

    it("should throw error when chosenSide is defined and game play action is not CHOOSE_SIDE.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenSide: RoleSides.WEREWOLVES });

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`chosenSide` can't be set on this current game's state");
    });

    it("should do nothing when chosenSide is not defined and game play action is not CHOOSE_SIDE.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when chosenSide is defined and game play action is CHOOSE_SIDE.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDogWolfChoosesSide() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenSide: RoleSides.WEREWOLVES });

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayWithRelationsDtoJudgeRequest", () => {
    it("should do nothing when doesJudgeRequestAnotherVote is undefined.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();

      await expect(services.gamePlayValidator["validateGamePlayWithRelationsDtoJudgeRequest"](makeGamePlayWithRelationsDto, game)).toResolve();
    });

    it("should throw error when judge request another vote but upcoming action is not vote.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });

      await expect(services.gamePlayValidator["validateGamePlayWithRelationsDtoJudgeRequest"](makeGamePlayWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`doesJudgeRequestAnotherVote` can't be set on this current game's state");
    });

    it("should throw error when judge request another vote but there is no judge in the game.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ]);
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote(), players });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });

      await expect(services.gamePlayValidator["validateGamePlayWithRelationsDtoJudgeRequest"](makeGamePlayWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`doesJudgeRequestAnotherVote` can't be set on this current game's state");
    });

    it("should throw error when judge request another vote but he is dead.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeStutteringJudgeAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote(), players });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });

      await expect(services.gamePlayValidator["validateGamePlayWithRelationsDtoJudgeRequest"](makeGamePlayWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`doesJudgeRequestAnotherVote` can't be set on this current game's state");
    });

    it("should throw error when judge request another vote but he has reach the request limit.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeStutteringJudgeAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ stutteringJudge: { voteRequestsCount: 2 } }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote(), players, options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      mocks.gameHistoryRecordService.getGameHistoryJudgeRequestRecords.mockResolvedValue([
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: true }) }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: true }) }),
      ]);

      await expect(services.gamePlayValidator["validateGamePlayWithRelationsDtoJudgeRequest"](makeGamePlayWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`doesJudgeRequestAnotherVote` can't be set on this current game's state");
    });

    it("should do nothing when judge request another vote and he can.", async() => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeStutteringJudgeAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ stutteringJudge: { voteRequestsCount: 2 } }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote(), players, options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      mocks.gameHistoryRecordService.getGameHistoryJudgeRequestRecords.mockResolvedValue([createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: true }) })]);

      await expect(services.gamePlayValidator["validateGamePlayWithRelationsDtoJudgeRequest"](makeGamePlayWithRelationsDto, game)).toResolve();
    });
  });
});