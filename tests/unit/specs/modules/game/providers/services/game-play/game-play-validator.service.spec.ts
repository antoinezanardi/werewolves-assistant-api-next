import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { when } from "jest-when";

import type { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { MakeGamePlayWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play";
import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { PlayerGroups, PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import * as GamePlayHelper from "@/modules/game/helpers/game-play/game-play.helper";
import { GameHistoryRecordRepository } from "@/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "@/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlayValidatorService } from "@/modules/game/providers/services/game-play/game-play-validator.service";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { BadGamePlayPayloadReasons } from "@/shared/exception/enums/bad-game-play-payload-error.enum";
import { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enum";
import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";
import { BadGamePlayPayloadException } from "@/shared/exception/types/bad-game-play-payload-exception.type";
import { UnexpectedException } from "@/shared/exception/types/unexpected-exception.type";

import { createFakeMakeGamePlayTargetWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-target-with-relations.dto.factory";
import { createFakeMakeGamePlayVoteWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-vote-with-relations.dto.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordSurvivorsVotePlay, createFakeGameHistoryRecordWerewolvesEatPlay, createFakeGameHistoryRecordWitchUsePotionsPlay } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeDogWolfGameOptions, createFakePiedPiperGameOptions, createFakeRolesGameOptions, createFakeThiefGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGamePlayEligibleTargets } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/game-play-eligible-targets.schema.factory";
import { createFakeInteractablePlayer } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/interactable-player/interactable-player.schema.factory";
import { createFakePlayerInteraction } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/interactable-player/player-interaction/player-interaction.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";
import { createFakeGamePlayBigBadWolfEats, createFakeGamePlayCupidCharms, createFakeGamePlayDogWolfChoosesSide, createFakeGamePlayFoxSniffs, createFakeGamePlayDefenderProtects, createFakeGamePlayHunterShoots, createFakeGamePlayPiedPiperCharms, createFakeGamePlayScandalmongerMarks, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySeerLooks, createFakeGamePlaySheriffDelegates, createFakeGamePlaySheriffSettlesVotes, createFakeGamePlaySurvivorsVote, createFakeGamePlayThiefChoosesCard, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWildChildChoosesModel, createFakeGamePlayWitchUsesPotions } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCantVoteBySurvivorsPlayerAttribute, createFakeEatenByWerewolvesPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeDogWolfAlivePlayer, createFakeIdiotAlivePlayer, createFakeSeerAlivePlayer, createFakeStutteringJudgeAlivePlayer, createFakeVileFatherOfWolvesAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Play Validator Service", () => {
  let mocks: {
    gamePlayValidatorService: {
      validateGamePlayWithRelationsDtoJudgeRequest: jest.SpyInstance;
      validateGamePlayWithRelationsDtoChosenSide: jest.SpyInstance;
      validateGamePlayVotesWithRelationsDto: jest.SpyInstance;
      validateGamePlayTargetsWithRelationsDto: jest.SpyInstance;
      validateGamePlayWithRelationsDtoChosenCard: jest.SpyInstance;
      validateGamePlayWitchTargets: jest.SpyInstance;
      validateGamePlayWithRelationsDto: jest.SpyInstance;
      validateGamePlayThiefChosenCard: jest.SpyInstance;
      validateDrankLifePotionTargets: jest.SpyInstance;
      validateDrankDeathPotionTargets: jest.SpyInstance;
      validateGamePlayInfectedTargets: jest.SpyInstance;
      validateGamePlaySheriffTargets: jest.SpyInstance;
      validateGamePlayDefenderTargets: jest.SpyInstance;
      validateGamePlayPiedPiperTargets: jest.SpyInstance;
      validateGamePlayWildChildTargets: jest.SpyInstance;
      validateGamePlayScandalmongerTargets: jest.SpyInstance;
      validateGamePlaySeerTargets: jest.SpyInstance;
      validateGamePlayFoxTargets: jest.SpyInstance;
      validateGamePlayCupidTargets: jest.SpyInstance;
      validateGamePlayScapegoatTargets: jest.SpyInstance;
      validateGamePlayHunterTargets: jest.SpyInstance;
      validateGamePlayWerewolvesTargets: jest.SpyInstance;
      validateGamePlayTargetsBoundaries: jest.SpyInstance;
      validateInfectedTargetsAndPotionUsage: jest.SpyInstance;
      validateGamePlaySourceTargets: jest.SpyInstance;
      validateGamePlayVotesTieBreakerWithRelationsDto: jest.SpyInstance;
      validateGamePlayVotesWithRelationsDtoSourceAndTarget: jest.SpyInstance;
    };
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
      getLastGameHistoryDefenderProtectsRecord: jest.SpyInstance;
      getLastGameHistoryTieInVotesRecord: jest.SpyInstance;
      getGameHistoryWitchUsesSpecificPotionRecords: jest.SpyInstance;
      getGameHistoryVileFatherOfWolvesInfectedRecords: jest.SpyInstance;
      getGameHistoryJudgeRequestRecords: jest.SpyInstance;
      didJudgeMakeHisSign: jest.SpyInstance;
    };
    gamePlayHelper: {
      isPlayerInteractableWithInteractionType: jest.SpyInstance;
    };
    unexpectedExceptionFactory: {
      createNoCurrentGamePlayUnexpectedException: jest.SpyInstance;
    };
  };
  let services: { gamePlayValidator: GamePlayValidatorService };

  beforeEach(async() => {
    mocks = {
      gamePlayValidatorService: {
        validateGamePlayWithRelationsDtoJudgeRequest: jest.fn(),
        validateGamePlayWithRelationsDtoChosenSide: jest.fn(),
        validateGamePlayVotesWithRelationsDto: jest.fn(),
        validateGamePlayTargetsWithRelationsDto: jest.fn(),
        validateGamePlayWithRelationsDtoChosenCard: jest.fn(),
        validateGamePlayWitchTargets: jest.fn(),
        validateGamePlayWithRelationsDto: jest.fn(),
        validateGamePlayThiefChosenCard: jest.fn(),
        validateDrankLifePotionTargets: jest.fn(),
        validateDrankDeathPotionTargets: jest.fn(),
        validateGamePlayInfectedTargets: jest.fn(),
        validateGamePlaySheriffTargets: jest.fn(),
        validateGamePlayDefenderTargets: jest.fn(),
        validateGamePlayPiedPiperTargets: jest.fn(),
        validateGamePlayWildChildTargets: jest.fn(),
        validateGamePlayScandalmongerTargets: jest.fn(),
        validateGamePlaySeerTargets: jest.fn(),
        validateGamePlayFoxTargets: jest.fn(),
        validateGamePlayCupidTargets: jest.fn(),
        validateGamePlayScapegoatTargets: jest.fn(),
        validateGamePlayHunterTargets: jest.fn(),
        validateGamePlayWerewolvesTargets: jest.fn(),
        validateGamePlayTargetsBoundaries: jest.fn(),
        validateInfectedTargetsAndPotionUsage: jest.fn(),
        validateGamePlaySourceTargets: jest.fn(),
        validateGamePlayVotesTieBreakerWithRelationsDto: jest.fn(),
        validateGamePlayVotesWithRelationsDtoSourceAndTarget: jest.fn(),
      },
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
        getLastGameHistoryDefenderProtectsRecord: jest.fn(),
        getLastGameHistoryTieInVotesRecord: jest.fn(),
        getGameHistoryWitchUsesSpecificPotionRecords: jest.fn(),
        getGameHistoryVileFatherOfWolvesInfectedRecords: jest.fn(),
        getGameHistoryJudgeRequestRecords: jest.fn(),
        didJudgeMakeHisSign: jest.fn(),
      },
      gamePlayHelper: { isPlayerInteractableWithInteractionType: jest.spyOn(GamePlayHelper, "isPlayerInteractableWithInteractionType").mockImplementation() },
      unexpectedExceptionFactory: { createNoCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoCurrentGamePlayUnexpectedException").mockImplementation() },
    };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
        GamePlayValidatorService,
      ],
    }).compile();
    
    services = { gamePlayValidator: module.get<GamePlayValidatorService>(GamePlayValidatorService) };
  });
  
  describe("validateGamePlayWithRelationsDto", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayWithRelationsDtoJudgeRequest = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayWithRelationsDtoJudgeRequest }, "validateGamePlayWithRelationsDtoJudgeRequest").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayWithRelationsDtoChosenSide = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayWithRelationsDtoChosenSide }, "validateGamePlayWithRelationsDtoChosenSide").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayVotesWithRelationsDto = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayVotesWithRelationsDto }, "validateGamePlayVotesWithRelationsDto").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayTargetsWithRelationsDto = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsWithRelationsDto }, "validateGamePlayTargetsWithRelationsDto").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayWithRelationsDtoChosenCard = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayWithRelationsDtoChosenCard }, "validateGamePlayWithRelationsDtoChosenCard").mockImplementation();
    });
    
    it("should throw error when game's current play is not set.", async() => {
      const game = createFakeGame();
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      const interpolations = { gameId: game._id };
      const mockedError = new UnexpectedException("validateGamePlayWithRelationsDto", UnexpectedExceptionReasons.NO_CURRENT_GAME_PLAY, { gameId: game._id.toString() });
      mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayValidator.validateGamePlayWithRelationsDto(makeGamePlayWithRelationsDto, game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("validateGamePlayWithRelationsDto", interpolations);
    });

    it("should call validators when called.", async() => {
      const game = createFakeGame({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      await services.gamePlayValidator.validateGamePlayWithRelationsDto(makeGamePlayWithRelationsDto, game);
      
      expect(mocks.gamePlayValidatorService.validateGamePlayWithRelationsDtoJudgeRequest).toHaveBeenCalledOnce();
      expect(mocks.gamePlayValidatorService.validateGamePlayWithRelationsDtoChosenSide).toHaveBeenCalledOnce();
      expect(mocks.gamePlayValidatorService.validateGamePlayVotesWithRelationsDto).toHaveBeenCalledOnce();
      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsWithRelationsDto).toHaveBeenCalledOnce();
      expect(mocks.gamePlayValidatorService.validateGamePlayWithRelationsDtoChosenCard).toHaveBeenCalledOnce();
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
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.THIEF_MUST_CHOOSE_CARD);

      expect(() => services.gamePlayValidator["validateGamePlayThiefChosenCard"](chosenCard, game)).toThrow(expectedError);
    });
  });

  describe("validateGamePlayWithRelationsDtoChosenCard", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayThiefChosenCard = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayThiefChosenCard }, "validateGamePlayThiefChosenCard").mockImplementation();
    });

    it("should do nothing when chosen card is not defined and not expected.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDogWolfChoosesSide() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();
      
      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenCard"](makeGamePlayWithRelationsDto, game)).not.toThrow();
    });

    it("should throw error when chosen card is defined but not expected.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDogWolfChoosesSide() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenCard: createFakeGameAdditionalCard() });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_CHOSEN_CARD);

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenCard"](makeGamePlayWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should call validateGamePlayThiefChosenCard method when action is choose card.", () => {
      const chosenCard = createFakeGameAdditionalCard();
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayThiefChoosesCard() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenCard });
      services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenCard"](makeGamePlayWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayThiefChosenCard).toHaveBeenCalledExactlyOnceWith(chosenCard, game);
    });
  });

  describe("validateDrankLifePotionTargets", () => {
    it("should throw error when there are too much targets for life potion.", () => {
      const game = createFakeGameWithCurrentPlay();
      const drankLifePotionTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_DRANK_LIFE_POTION_TARGETS);

      expect(() => services.gamePlayValidator["validateDrankLifePotionTargets"](drankLifePotionTargets, game)).toThrow(expectedError);
    });

    it("should throw error when life potion target can't drink it.", () => {
      const game = createFakeGameWithCurrentPlay();
      const targetedPlayer = createFakePlayer({ isAlive: true, attributes: [] });
      const drankLifePotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WitchPotions.LIFE })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_LIFE_POTION_TARGET);

      expect(() => services.gamePlayValidator["validateDrankLifePotionTargets"](drankLifePotionTargets, game)).toThrow(expectedError);
    });

    it("should do nothing when there is no life potion target.", () => {
      const game = createFakeGameWithCurrentPlay();
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);

      expect(() => services.gamePlayValidator["validateDrankLifePotionTargets"]([], game)).not.toThrow();
    });

    it("should do nothing when life potion target is applied on valid target.", () => {
      const game = createFakeGameWithCurrentPlay();
      const targetedPlayer = createFakePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()], isAlive: true });
      const drankLifePotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WitchPotions.LIFE })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateDrankLifePotionTargets"](drankLifePotionTargets, game)).not.toThrow();
    });
  });

  describe("validateDrankDeathPotionTargets", () => {
    it("should throw error when there are too much targets for death potion.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const drankDeathPotionTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_DRANK_DEATH_POTION_TARGETS);

      expect(() => services.gamePlayValidator["validateDrankDeathPotionTargets"](drankDeathPotionTargets, game)).toThrow(expectedError);
    });

    it("should throw error when death potion target can't drink it.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const targetedPlayer = createFakePlayer({ isAlive: false });
      const drankDeathPotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WitchPotions.DEATH })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_DEATH_POTION_TARGET);

      expect(() => services.gamePlayValidator["validateDrankDeathPotionTargets"](drankDeathPotionTargets, game)).toThrow(expectedError);
    });

    it("should do nothing when there is no death potion target.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);

      expect(() => services.gamePlayValidator["validateDrankDeathPotionTargets"]([], game)).not.toThrow();
    });

    it("should do nothing when death potion target is applied on valid target.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const targetedPlayer = createFakePlayer({ isAlive: true });
      const drankDeathPotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WitchPotions.DEATH })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateDrankDeathPotionTargets"](drankDeathPotionTargets, game)).not.toThrow();
    });
  });

  describe("validateGamePlayWitchTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateDrankLifePotionTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateDrankLifePotionTargets }, "validateDrankLifePotionTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateDrankDeathPotionTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateDrankDeathPotionTargets }, "validateDrankDeathPotionTargets").mockImplementation();
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
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).rejects.toStrictEqual<BadGamePlayPayloadException>(expectedError);
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
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).rejects.toStrictEqual<BadGamePlayPayloadException>(expectedError);
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
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).rejects.toStrictEqual<BadGamePlayPayloadException>(expectedError);
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
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).rejects.toStrictEqual<BadGamePlayPayloadException>(expectedError);
    });

    it("should call potions validators without players when called with valid data but no target drank potions.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() })];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockResolvedValue([]);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue([]);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(mocks.gamePlayValidatorService.validateDrankLifePotionTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateDrankDeathPotionTargets).toHaveBeenCalledExactlyOnceWith([], game);
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
      expect(mocks.gamePlayValidatorService.validateDrankLifePotionTargets).toHaveBeenCalledExactlyOnceWith([makeGamePlayTargetsWithRelationsDto[0]], game);
      expect(mocks.gamePlayValidatorService.validateDrankDeathPotionTargets).toHaveBeenCalledExactlyOnceWith([makeGamePlayTargetsWithRelationsDto[1]], game);
    });

    it("should call potions validators with players when called for valid life potion data and some witch history.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE })];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH })];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) })];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockReturnValue([]);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue(gameHistoryRecords);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(mocks.gamePlayValidatorService.validateDrankLifePotionTargets).toHaveBeenCalledExactlyOnceWith([makeGamePlayTargetsWithRelationsDto[0]], game);
      expect(mocks.gamePlayValidatorService.validateDrankDeathPotionTargets).toHaveBeenCalledExactlyOnceWith([], game);
    });

    it("should call potions validators with players when called for valid death potion data and some witch history.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH })];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE })];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) })];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.LIFE).mockResolvedValue(gameHistoryRecords);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, WitchPotions.DEATH).mockResolvedValue([]);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(mocks.gamePlayValidatorService.validateDrankLifePotionTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateDrankDeathPotionTargets).toHaveBeenCalledExactlyOnceWith([makeGamePlayTargetsWithRelationsDto[0]], game);
    });
  });

  describe("validateGamePlayInfectedTargets", () => {
    it("should throw error when vile father of wolves is not in the game.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0], isInfected: true })];
      const gameHistoryRecords = [];
      mocks.gameHistoryRecordService.getGameHistoryVileFatherOfWolvesInfectedRecords.mockResolvedValue(gameHistoryRecords);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_INFECTED_TARGET);

      await expect(services.gamePlayValidator["validateGamePlayInfectedTargets"](makeGamePlayTargetsWithRelationsDto, game)).rejects.toStrictEqual<BadGamePlayPayloadException>(expectedError);
    });

    it("should throw error when vile father of wolves is dead.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer({ isAlive: false }),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0], isInfected: true })];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true })];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: gameHistoryRecordTargets }) })];
      mocks.gameHistoryRecordService.getGameHistoryVileFatherOfWolvesInfectedRecords.mockResolvedValue(gameHistoryRecords);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_INFECTED_TARGET);

      await expect(services.gamePlayValidator["validateGamePlayInfectedTargets"](makeGamePlayTargetsWithRelationsDto, game)).rejects.toStrictEqual<BadGamePlayPayloadException>(expectedError);
    });

    it("should throw error when vile father of wolves has already infected and some targets are infected.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true })];
      const gameHistoryRecordTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true }),
        createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: false }),
      ];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: gameHistoryRecordTargets }) })];
      mocks.gameHistoryRecordService.getGameHistoryVileFatherOfWolvesInfectedRecords.mockResolvedValue(gameHistoryRecords);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_INFECTED_TARGET);

      await expect(services.gamePlayValidator["validateGamePlayInfectedTargets"](makeGamePlayTargetsWithRelationsDto, game)).rejects.toStrictEqual<BadGamePlayPayloadException>(expectedError);
    });

    it("should do nothing when there is no infected target.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];

      await expect(services.gamePlayValidator["validateGamePlayInfectedTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });

    it("should do nothing when infected target data is valid.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0], isInfected: true })];
      mocks.gameHistoryRecordService.getGameHistoryVileFatherOfWolvesInfectedRecords.mockResolvedValue([]);

      await expect(services.gamePlayValidator["validateGamePlayInfectedTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });
  });

  describe("validateGamePlayWerewolvesTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayInfectedTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayInfectedTargets }, "validateGamePlayInfectedTargets").mockImplementation();
    });

    it("should do nothing when there is no target.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat() });
      const makeGamePlayTargetsWithRelationsDto = [];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });

    it("should throw error when source is WEREWOLVES and targeted player can't be eaten by them.", async() => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[1] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WEREWOLVES_TARGET);

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).rejects.toStrictEqual<BadGamePlayPayloadException>(expectedError);
    });

    it("should throw error when source is BIG_BAD_WOLF and targeted player can't be eaten by him.", async() => {
      const players = [
        createFakeVillagerAlivePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayBigBadWolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_BIG_BAD_WOLF_TARGET);

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).rejects.toStrictEqual<BadGamePlayPayloadException>(expectedError);
    });

    it("should throw error when source is WHITE_WEREWOLF and targeted player can't be eaten by him.", async() => {
      const whiteWerewolfPlayer = createFakeWhiteWerewolfAlivePlayer();
      const players = [
        whiteWerewolfPlayer,
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWhiteWerewolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: whiteWerewolfPlayer })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WHITE_WEREWOLF_TARGET);

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).rejects.toStrictEqual<BadGamePlayPayloadException>(expectedError);
    });

    it("should do nothing when white werewolf eaten target is valid.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWhiteWerewolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });

    it("should do nothing when big bad wolf eaten target is valid.", async() => {
      const players = [createFakeVillagerAlivePlayer()];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayBigBadWolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });

    it("should do nothing when werewolves eaten target is valid.", async() => {
      const players = [createFakeVillagerAlivePlayer()];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      await expect(services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
    });

    it("should validate game play infected targets when called.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0], isInfected: true })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);
      await services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayInfectedTargets).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, game);
    });
  });

  describe("validateGamePlayHunterTargets", () => {
    it("should throw error when targeted player can't be shot.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayHunterShoots() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_HUNTER_TARGET);

      expect(() => services.gamePlayValidator["validateGamePlayHunterTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should do nothing when targeted player for hunter is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayHunterShoots() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayHunterTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayScapeGoatTargets", () => {
    it("should throw error when one of the targeted player can't be banned from voting.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScapegoatBansVoting() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValueOnce(true);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValueOnce(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SCAPEGOAT_TARGETS);

      expect(() => services.gamePlayValidator["validateGamePlayScapegoatTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should do nothing when all scapegoat's targets are valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScapegoatBansVoting() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayScapegoatTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayCupidTargets", () => {
    it("should throw error when one of the targeted player can't be charmed.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayCupidCharms() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValueOnce(true);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValueOnce(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_CUPID_TARGETS);

      expect(() => services.gamePlayValidator["validateGamePlayCupidTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should do nothing when all cupid's targets are valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayCupidCharms() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayCupidTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayFoxTargets", () => {
    it("should throw error when targeted player can't be sniffed.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_FOX_TARGET);

      expect(() => services.gamePlayValidator["validateGamePlayFoxTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should do nothing when targeted player for fox is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayFoxTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlaySeerTargets", () => {
    it("should throw error when targeted player can't be seen.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SEER_TARGET);

      expect(() => services.gamePlayValidator["validateGamePlaySeerTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should do nothing when seer's targeted player is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlaySeerTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayScandalmongerTargets", () => {
    it("should throw error when targeted player can't be marked.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScandalmongerMarks() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SCANDALMONGER_TARGET);

      expect(() => services.gamePlayValidator["validateGamePlayScandalmongerTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should do nothing when there are no targets.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScandalmongerMarks() });
      const makeGamePlayTargetsWithRelationsDto = [];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);

      expect(() => services.gamePlayValidator["validateGamePlayScandalmongerTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when scandalmonger's target is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScandalmongerMarks() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayScandalmongerTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayWildChildTargets", () => {
    it("should throw error when targeted player can't be chosen as model.", () => {
      const wildChildPlayer = createFakeWildChildAlivePlayer();
      const players = [
        wildChildPlayer,
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWildChildChoosesModel(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: wildChildPlayer })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WILD_CHILD_TARGET);

      expect(() => services.gamePlayValidator["validateGamePlayWildChildTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should do nothing when wild child's targeted player is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWildChildChoosesModel() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayWildChildTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayPiedPiperTargets", () => {
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
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValueOnce(true);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValueOnce(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_PIED_PIPER_TARGETS);

      expect(() => services.gamePlayValidator["validateGamePlayPiedPiperTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
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
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayPiedPiperTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when pied piper targets are valid and limited to left players to charm count.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ charmedPeopleCountPerNight: 5 }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayPiedPiperCharms(), options });
      const leftToCharmPlayers = [createFakeWildChildAlivePlayer()];
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: leftToCharmPlayers[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayPiedPiperTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayDefenderTargets", () => {
    it("should throw error when targeted player can't be targeted.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDefenderProtects() });
      const targetedPlayer = createFakeVillagerAlivePlayer({ isAlive: false });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_DEFENDER_TARGET);

      expect(() => services.gamePlayValidator["validateGamePlayDefenderTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should do nothing when targeted player can be protected.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ defender: { canProtectTwice: false } }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDefenderProtects(), options });
      const targetedPlayer = createFakeVillagerAlivePlayer();
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayDefenderTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlaySheriffTargets", () => {
    it("should do nothing when game play action is not DELEGATE nor SETTLE_VOTES.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffDelegates({ action: GamePlayActions.USE_POTIONS }) });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when targeted player for sheriff delegation is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffDelegates() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should throw error when targeted player is not in last tie in votes and upcoming action is SETTLE_VOTES.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffSettlesVotes() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SHERIFF_SETTLE_VOTES_TARGET);

      expect(() => services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should throw error when targeted player is not in last tie in votes and upcoming action is DELEGATE.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffDelegates() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SHERIFF_DELEGATE_TARGET);

      expect(() => services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should do nothing when targeted player for sheriff settling votes is valid for delegate.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySheriffDelegates() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValueOnce(true);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValueOnce(false);

      expect(() => services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when targeted player for sheriff settling votes is valid for settle votes.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySheriffSettlesVotes() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValueOnce(false);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionType.mockReturnValueOnce(true);

      expect(() => services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayTargetsBoundaries", () => {
    it("should throw error when min boundary is not respected.", () => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_LESS_TARGETS);

      expect(() => services.gamePlayValidator["validateGamePlayTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, { min: 4, max: 4 })).toThrow(expectedError);
    });

    it("should throw error when max boundary is not respected.", () => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_TARGETS);

      expect(() => services.gamePlayValidator["validateGamePlayTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, { min: 2, max: 2 })).toThrow(expectedError);
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
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlaySheriffTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlaySheriffTargets }, "validateGamePlaySheriffTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayDefenderTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayDefenderTargets }, "validateGamePlayDefenderTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayPiedPiperTargets }, "validateGamePlayPiedPiperTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayWildChildTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayWildChildTargets }, "validateGamePlayWildChildTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayScandalmongerTargets }, "validateGamePlayScandalmongerTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlaySeerTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlaySeerTargets }, "validateGamePlaySeerTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayFoxTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayFoxTargets }, "validateGamePlayFoxTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayCupidTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayCupidTargets }, "validateGamePlayCupidTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayScapegoatTargets }, "validateGamePlayScapegoatTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayHunterTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayHunterTargets }, "validateGamePlayHunterTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayWerewolvesTargets }, "validateGamePlayWerewolvesTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayWitchTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayWitchTargets }, "validateGamePlayWitchTargets").mockImplementation();
    });

    it("should call sheriff validator when game current play is for the sheriff.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffSettlesVotes() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlayDefenderTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call werewolves validator when game current play is for the werewolves.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlayDefenderTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call werewolves validator when game current play is for the big bad wolf.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayBigBadWolfEats() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlayDefenderTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call werewolves validator when game current play is for the white werewolf.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWhiteWerewolfEats() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlayDefenderTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call defender validator when game current play is for the defender.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDefenderProtects() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayDefenderTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });
    
    it("should call pied piper validator when game current play is for the pied piper.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayPiedPiperCharms() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayDefenderTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });
    
    it("should call wild child validator when game current play is for the wild child.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWildChildChoosesModel() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayDefenderTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWildChildTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });
    
    it("should call scandalmonger validator when game current play is for the scandalmonger.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScandalmongerMarks() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayDefenderTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });
    
    it("should call seer validator when game current play is for the seer.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayDefenderTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySeerTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call fox validator when game current play is for the fox.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayDefenderTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayFoxTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call cupid validator when game current play is for the cupid.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayCupidCharms() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayDefenderTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayCupidTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call scapegoat validator when game current play is for the scapegoat.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScapegoatBansVoting() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayDefenderTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call hunter validator when game current play is for the hunter.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayHunterShoots() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayDefenderTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayHunterTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).not.toHaveBeenCalled();
    });

    it("should call witch validator when game current play is for the witch.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayDefenderTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayPiedPiperTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWildChildTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScandalmongerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySeerTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayFoxTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayCupidTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayScapegoatTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayHunterTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).toHaveBeenCalledExactlyOnceWith([], game);
    });
  });

  describe("validateInfectedTargetsAndPotionUsage", () => {
    it("should throw error when expected action is not EAT and some targets are infected.", () => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat({ action: GamePlayActions.CHOOSE_CARD }), players });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_INFECTED_TARGET);
      
      expect(() => services.gamePlayValidator["validateInfectedTargetsAndPotionUsage"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should throw error when expected source is not WEREWOLVES and some targets are infected.", () => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat({ source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS }) }), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true })];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_INFECTED_TARGET);
      
      expect(() => services.gamePlayValidator["validateInfectedTargetsAndPotionUsage"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should do nothing when there are infected targets and expected expected play is valid.", () => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ];
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
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);
      
      expect(() => services.gamePlayValidator["validateInfectedTargetsAndPotionUsage"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should throw error when expected source is not WITCH but targets drank potions.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions({ source: createFakeGamePlaySource({ name: RoleNames.THIEF }) }) });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);

      expect(() => services.gamePlayValidator["validateInfectedTargetsAndPotionUsage"](makeGamePlayTargetsWithRelationsDto, game)).toThrow(expectedError);
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
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
      mocks.gamePlayValidatorService.validateInfectedTargetsAndPotionUsage = jest.spyOn(services.gamePlayValidator as unknown as { validateInfectedTargetsAndPotionUsage }, "validateInfectedTargetsAndPotionUsage").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlaySourceTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlaySourceTargets }, "validateGamePlaySourceTargets").mockImplementation();
    });

    it("should do nothing when there are no targets defined and upcoming action doesn't require targets anyway.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });

      await expect(services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"](undefined, game)).toResolve();
      expect(mocks.gamePlayValidatorService.validateInfectedTargetsAndPotionUsage).not.toHaveBeenCalled();
    });

    it("should do nothing when there are no targets and upcoming action can be skipped.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs({ canBeSkipped: true }) });

      await expect(services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"]([], game)).toResolve();
      expect(mocks.gamePlayValidatorService.validateInfectedTargetsAndPotionUsage).not.toHaveBeenCalled();
    });

    it("should throw error when there is no targets but they are required cause action can't be skipped.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks({ canBeSkipped: false }) });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.REQUIRED_TARGETS);

      await expect(services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"]([], game)).rejects.toStrictEqual<BadGamePlayPayloadException>(expectedError);
    });

    it("should throw error when there are targets but they are not expected.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_TARGETS);

      await expect(services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"](makeGamePlayTargetsWithRelationsDto, game)).rejects.toStrictEqual<BadGamePlayPayloadException>(expectedError);
    });

    it("should validate game play targets boundaries when targets are expected and current play has eligible targets boundaries.", async() => {
      const currentPlay = createFakeGamePlayWerewolvesEat({ eligibleTargets: createFakeGamePlayEligibleTargets({ boundaries: { min: 1, max: 1 } }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];

      await expect(services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, currentPlay.eligibleTargets?.boundaries);
    });

    it("should not validate game play targets boundaries when targets are expected but current play doesn't have eligible targets boundaries.", async() => {
      const currentPlay = createFakeGamePlayWerewolvesEat();
      const game = createFakeGameWithCurrentPlay({ currentPlay });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];

      await expect(services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).not.toHaveBeenCalled();
    });

    it("should call targets validators when targets data is valid.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];

      await expect(services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(mocks.gamePlayValidatorService.validateGamePlaySourceTargets).toHaveBeenCalledOnce();
      expect(mocks.gamePlayValidatorService.validateInfectedTargetsAndPotionUsage).toHaveBeenCalledOnce();
    });
  });

  describe("validateGamePlayVotesTieBreakerWithRelationsDto", () => {
    it("should throw error when cause is previous votes were in tie but one voted player is not in the previous tie.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const interaction = createFakePlayerInteraction({
        source: PlayerGroups.SURVIVORS,
        type: PlayerInteractionTypes.VOTE,
      });
      const interactablePlayers = [
        createFakeInteractablePlayer({ player: players[0], interactions: [interaction] }),
        createFakeInteractablePlayer({ player: players[1], interactions: [interaction] }),
      ];
      const eligibleTargets = createFakeGamePlayEligibleTargets({ interactablePlayers });
      const source = createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS, players: [players[2]] });
      const currentPlay = createFakeGamePlaySurvivorsVote({ eligibleTargets, source, cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });
      const game = createFakeGameWithCurrentPlay({ currentPlay, players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[2] }),
      ];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_TARGET_FOR_TIE_BREAKER);

      expect(() => services.gamePlayValidator["validateGamePlayVotesTieBreakerWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should do nothing when cause is previous votes were in tie and all voted players were in previous tie.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const interaction = createFakePlayerInteraction({
        source: PlayerGroups.SURVIVORS,
        type: PlayerInteractionTypes.VOTE,
      });
      const interactablePlayers = [
        createFakeInteractablePlayer({ player: players[0], interactions: [interaction] }),
        createFakeInteractablePlayer({ player: players[1], interactions: [interaction] }),
      ];
      const eligibleTargets = createFakeGamePlayEligibleTargets({ interactablePlayers });
      const source = createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS, players: [players[2]] });
      const currentPlay = createFakeGamePlaySurvivorsVote({ eligibleTargets, source, cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });
      const game = createFakeGameWithCurrentPlay({ currentPlay, players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[1] }),
      ];

      expect(() => services.gamePlayValidator["validateGamePlayVotesTieBreakerWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when cause is not previous votes were in tie.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const interaction = createFakePlayerInteraction({
        source: PlayerGroups.SURVIVORS,
        type: PlayerInteractionTypes.VOTE,
      });
      const interactablePlayers = [
        createFakeInteractablePlayer({ player: players[0], interactions: [interaction] }),
        createFakeInteractablePlayer({ player: players[1], interactions: [interaction] }),
      ];
      const eligibleTargets = createFakeGamePlayEligibleTargets({ interactablePlayers });
      const source = createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS, players: [players[2]] });
      const currentPlay = createFakeGamePlaySurvivorsVote({ eligibleTargets, source, cause: GamePlayCauses.ANGEL_PRESENCE });
      const game = createFakeGameWithCurrentPlay({ currentPlay, players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[2] }),
      ];

      expect(() => services.gamePlayValidator["validateGamePlayVotesTieBreakerWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayVotesWithRelationsDtoSourceAndTarget", () => {
    it("should throw error when one vote source doesn't have the ability to vote.", () => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const interaction = createFakePlayerInteraction({
        source: PlayerGroups.SURVIVORS,
        type: PlayerInteractionTypes.VOTE,
      });
      const interactablePlayers = [
        createFakeInteractablePlayer({ player: players[0], interactions: [interaction] }),
        createFakeInteractablePlayer({ player: players[1], interactions: [interaction] }),
        createFakeInteractablePlayer({ player: players[2], interactions: [interaction] }),
      ];
      const eligibleTargets = createFakeGamePlayEligibleTargets({ interactablePlayers });
      const source = createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS, players: [players[2]] });
      const currentPlay = createFakeGamePlaySurvivorsVote({ eligibleTargets, source });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[1] }),
      ];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_SOURCE);

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDtoSourceAndTarget"](makeGamePlayVotesWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should throw error when one vote target is can't be voted against.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const interaction = createFakePlayerInteraction({
        source: PlayerGroups.SURVIVORS,
        type: PlayerInteractionTypes.VOTE,
      });
      const interactablePlayers = [
        createFakeInteractablePlayer({ player: players[0], interactions: [interaction] }),
        createFakeInteractablePlayer({ player: players[2], interactions: [interaction] }),
      ];
      const eligibleTargets = createFakeGamePlayEligibleTargets({ interactablePlayers });
      const source = createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS, players });
      const currentPlay = createFakeGamePlaySurvivorsVote({ eligibleTargets, source });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[3], target: players[0] }),
      ];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_TARGET);

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDtoSourceAndTarget"](makeGamePlayVotesWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should throw error when there are votes with the same source and target.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const interaction = createFakePlayerInteraction({
        source: PlayerGroups.SURVIVORS,
        type: PlayerInteractionTypes.VOTE,
      });
      const interactablePlayers = [
        createFakeInteractablePlayer({ player: players[0], interactions: [interaction] }),
        createFakeInteractablePlayer({ player: players[1], interactions: [interaction] }),
        createFakeInteractablePlayer({ player: players[2], interactions: [interaction] }),
      ];
      const eligibleTargets = createFakeGamePlayEligibleTargets({ interactablePlayers });
      const source = createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS, players });
      const currentPlay = createFakeGamePlaySurvivorsVote({ eligibleTargets, source });
      const game = createFakeGameWithCurrentPlay({ currentPlay, players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[1] }),
      ];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.SAME_SOURCE_AND_TARGET_VOTE);

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDtoSourceAndTarget"](makeGamePlayVotesWithRelationsDto, game)).toThrow(expectedError);
    });
  });

  describe("validateGamePlayVotesWithRelationsDto", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayVotesTieBreakerWithRelationsDto = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayVotesTieBreakerWithRelationsDto }, "validateGamePlayVotesTieBreakerWithRelationsDto").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayVotesWithRelationsDtoSourceAndTarget = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayVotesWithRelationsDtoSourceAndTarget }, "validateGamePlayVotesWithRelationsDtoSourceAndTarget").mockImplementation();
    });

    it("should do nothing when there are no votes defined but game play is not for votes anyway.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat() });

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](undefined, game)).not.toThrow();
    });

    it("should throw error when there are empty votes but they are not expected.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayWerewolvesEat() });
      const makeGamePlayVotesWithRelationsDto = [];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_VOTES);

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should throw error when there are votes but they are not expected.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayWerewolvesEat() });
      const makeGamePlayVotesWithRelationsDto = [createFakeMakeGamePlayVoteWithRelationsDto()];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_VOTES);

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should do nothing when there are no votes defined but game play of votes can be skipped.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ canBeSkipped: true }) });

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](undefined, game)).not.toThrow();
    });

    it("should do nothing when there are no votes (empty array) but game play of votes can be skipped.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ canBeSkipped: true }) });

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"]([], game)).not.toThrow();
    });

    it("should throw error when there are no votes (undefined) but game play of votes can't be skipped.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ canBeSkipped: false }) });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_VOTES);

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](undefined, game)).toThrow(expectedError);
    });

    it("should throw error when there are no votes (empty array) but game play of votes can't be skipped.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ canBeSkipped: false }) });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_VOTES);

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"]([], game)).toThrow(expectedError);
    });

    it("should call validateGamePlayVotesTieBreakerWithRelationsDto when current play is because of previous votes were in ties.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }) });
      const makeGamePlayVotesWithRelationsDto = [createFakeMakeGamePlayVoteWithRelationsDto({ source: game.players[0], target: game.players[1] })];

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).not.toThrow();
      expect(mocks.gamePlayValidatorService.validateGamePlayVotesTieBreakerWithRelationsDto).toHaveBeenCalledExactlyOnceWith(makeGamePlayVotesWithRelationsDto, game);
    });

    it("should not call validateGamePlayVotesTieBreakerWithRelationsDto when current play is not because of previous votes were in ties.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE }) });
      const makeGamePlayVotesWithRelationsDto = [createFakeMakeGamePlayVoteWithRelationsDto({ source: game.players[0], target: game.players[1] })];

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).not.toThrow();
      expect(mocks.gamePlayValidatorService.validateGamePlayVotesTieBreakerWithRelationsDto).not.toHaveBeenCalled();
    });

    it("should do nothing when votes are valid.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayVotesWithRelationsDto = [createFakeMakeGamePlayVoteWithRelationsDto({ source: game.players[0], target: game.players[1] })];

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayWithRelationsDtoChosenSide", () => {
    it("should throw error when chosenSide is defined and game play action is not CHOOSE_SIDE.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ dogWolf: createFakeDogWolfGameOptions({ isSideRandomlyChosen: false }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote(), options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenSide: RoleSides.WEREWOLVES });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_CHOSEN_SIDE);

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should throw error when chosenSide is defined and game play action is CHOOSE_SIDE but game options say that it is randomly chosen.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ dogWolf: createFakeDogWolfGameOptions({ isSideRandomlyChosen: true }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDogWolfChoosesSide(), options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenSide: RoleSides.WEREWOLVES });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_CHOSEN_SIDE);

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should throw error when chosenSide is not defined and game play action is CHOOSE_SIDE and game options say that side is not randomly chosen.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ dogWolf: createFakeDogWolfGameOptions({ isSideRandomlyChosen: false }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDogWolfChoosesSide(), options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.REQUIRED_CHOSEN_SIDE);

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game)).toThrow(expectedError);
    });

    it("should do nothing when chosenSide is defined and game play action is CHOOSE_SIDE and game options say that side is not randomly chosen.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ dogWolf: createFakeDogWolfGameOptions({ isSideRandomlyChosen: false }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDogWolfChoosesSide(), options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenSide: RoleSides.WEREWOLVES });

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when chosenSide is not defined and game play action is not CHOOSE_SIDE.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ dogWolf: createFakeDogWolfGameOptions({ isSideRandomlyChosen: false }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote(), options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when chosenSide is not defined and game play action CHOOSE_SIDE but game options say that side is randomly chosen.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ dogWolf: createFakeDogWolfGameOptions({ isSideRandomlyChosen: true }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote(), options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayWithRelationsDtoJudgeRequest", () => {
    beforeEach(() => {
      mocks.gameHistoryRecordService.didJudgeMakeHisSign.mockResolvedValue(true);
    });

    it.each<{
      test: string;
      game: GameWithCurrentPlay;
      makeGamePlayWithRelationsDto: MakeGamePlayWithRelationsDto;
      didJudgeMakeHisSignMockResolvedValue: boolean;
      getGameHistoryJudgeRequestRecordsMockResolvedValue: GameHistoryRecord[];
      expected: BadGamePlayPayloadException;
    }>([
      {
        test: "should throw error when judge request another vote but upcoming action is not vote.",
        game: createFakeGameWithCurrentPlay({
          currentPlay: createFakeGamePlayWitchUsesPotions(),
          players: [
            createFakeWitchAlivePlayer(),
            createFakeDogWolfAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeStutteringJudgeAlivePlayer(),
          ],
        }),
        makeGamePlayWithRelationsDto: createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true }),
        didJudgeMakeHisSignMockResolvedValue: true,
        getGameHistoryJudgeRequestRecordsMockResolvedValue: [],
        expected: new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_STUTTERING_JUDGE_VOTE_REQUEST),
      },
      {
        test: "should throw error when judge request another vote but he didn't make his sign.",
        game: createFakeGameWithCurrentPlay({
          currentPlay: createFakeGamePlaySurvivorsVote(),
          players: [
            createFakeWitchAlivePlayer(),
            createFakeDogWolfAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeStutteringJudgeAlivePlayer(),
          ],
        }),
        makeGamePlayWithRelationsDto: createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true }),
        didJudgeMakeHisSignMockResolvedValue: false,
        getGameHistoryJudgeRequestRecordsMockResolvedValue: [],
        expected: new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_STUTTERING_JUDGE_VOTE_REQUEST),
      },
      {
        test: "should throw error when judge request another vote but there is no judge in the game.",
        game: createFakeGameWithCurrentPlay({
          players: [
            createFakeWitchAlivePlayer(),
            createFakeDogWolfAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
          ],
          currentPlay: createFakeGamePlaySurvivorsVote(),
        }),
        makeGamePlayWithRelationsDto: createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true }),
        didJudgeMakeHisSignMockResolvedValue: true,
        getGameHistoryJudgeRequestRecordsMockResolvedValue: [],
        expected: new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_STUTTERING_JUDGE_VOTE_REQUEST),
      },
      {
        test: "should throw error when judge request another vote but he is dead.",
        game: createFakeGameWithCurrentPlay({
          currentPlay: createFakeGamePlaySurvivorsVote(),
          players: [
            createFakeWitchAlivePlayer(),
            createFakeDogWolfAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeStutteringJudgeAlivePlayer({ isAlive: false }),
          ],
        }),
        didJudgeMakeHisSignMockResolvedValue: true,
        getGameHistoryJudgeRequestRecordsMockResolvedValue: [],
        makeGamePlayWithRelationsDto: createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true }),
        expected: new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_STUTTERING_JUDGE_VOTE_REQUEST),
      },
      {
        test: "should throw error when judge request another vote but he has reach the request limit.",
        game: createFakeGameWithCurrentPlay({
          currentPlay: createFakeGamePlaySurvivorsVote(),
          players: [
            createFakeWitchAlivePlayer(),
            createFakeDogWolfAlivePlayer(),
            createFakeWerewolfAlivePlayer(),
            createFakeStutteringJudgeAlivePlayer(),
          ],
          options: createFakeGameOptions({ roles: createFakeRolesGameOptions({ stutteringJudge: { voteRequestsCount: 1 } }) }),
        }),
        makeGamePlayWithRelationsDto: createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true }),
        didJudgeMakeHisSignMockResolvedValue: true,
        getGameHistoryJudgeRequestRecordsMockResolvedValue: [createFakeGameHistoryRecord()],
        expected: new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_STUTTERING_JUDGE_VOTE_REQUEST),
      },
    ])("$test", async({ game, makeGamePlayWithRelationsDto, didJudgeMakeHisSignMockResolvedValue, getGameHistoryJudgeRequestRecordsMockResolvedValue, expected }) => {
      mocks.gameHistoryRecordService.didJudgeMakeHisSign.mockResolvedValue(didJudgeMakeHisSignMockResolvedValue);
      mocks.gameHistoryRecordService.getGameHistoryJudgeRequestRecords.mockResolvedValue(getGameHistoryJudgeRequestRecordsMockResolvedValue);

      await expect(services.gamePlayValidator["validateGamePlayWithRelationsDtoJudgeRequest"](makeGamePlayWithRelationsDto, game)).rejects.toStrictEqual<BadGamePlayPayloadException>(expected);
    });

    it("should do nothing when doesJudgeRequestAnotherVote is undefined.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();

      await expect(services.gamePlayValidator["validateGamePlayWithRelationsDtoJudgeRequest"](makeGamePlayWithRelationsDto, game)).toResolve();
    });

    it("should do nothing when judge request another vote and he can.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeStutteringJudgeAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ stutteringJudge: { voteRequestsCount: 2 } }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote(), players, options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      mocks.gameHistoryRecordService.getGameHistoryJudgeRequestRecords.mockResolvedValue([createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordSurvivorsVotePlay({ didJudgeRequestAnotherVote: true }) })]);

      await expect(services.gamePlayValidator["validateGamePlayWithRelationsDtoJudgeRequest"](makeGamePlayWithRelationsDto, game)).toResolve();
    });
  });
});