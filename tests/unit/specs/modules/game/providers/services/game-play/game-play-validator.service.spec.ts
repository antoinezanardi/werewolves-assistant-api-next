import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { when } from "jest-when";

import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { PlayerGroups, PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import * as GamePlayHelper from "@/modules/game/helpers/game-play/game-play.helpers";
import { GameHistoryRecordRepository } from "@/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "@/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlayValidatorService } from "@/modules/game/providers/services/game-play/game-play-validator.service";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { BadGamePlayPayloadReasons } from "@/shared/exception/enums/bad-game-play-payload-error.enum";
import { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enum";
import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";
import { BadGamePlayPayloadException } from "@/shared/exception/types/bad-game-play-payload-exception.types";
import { UnexpectedException } from "@/shared/exception/types/unexpected-exception.types";

import { createFakeMakeGamePlayTargetWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-target-with-relations.dto.factory";
import { createFakeMakeGamePlayVoteWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-vote-with-relations.dto.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordSurvivorsVotePlay, createFakeGameHistoryRecordWitchUsePotionsPlay } from "@tests/factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakePiedPiperGameOptions, createFakeRolesGameOptions, createFakeWolfHoundGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options/game-roles-options.schema.factory";
import { createFakeGamePlaySourceInteractionBoundaries } from "@tests/factories/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction-boundaries/game-play-source-interaction-boundaries.schema.factory";
import { createFakeGamePlaySourceInteraction } from "@tests/factories/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source/game-play-source.schema.factory";
import { createFakeGamePlayAccursedWolfFatherInfects, createFakeGamePlayActorChoosesCard, createFakeGamePlayBigBadWolfEats, createFakeGamePlayCupidCharms, createFakeGamePlayDefenderProtects, createFakeGamePlayFoxSniffs, createFakeGamePlayHunterShoots, createFakeGamePlayPiedPiperCharms, createFakeGamePlayScandalmongerMarks, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySeerLooks, createFakeGamePlaySheriffDelegates, createFakeGamePlaySheriffSettlesVotes, createFakeGamePlayStutteringJudgeRequestsAnotherVote, createFakeGamePlaySurvivorsBuryDeadBodies, createFakeGamePlaySurvivorsElectSheriff, createFakeGamePlaySurvivorsVote, createFakeGamePlayThiefChoosesCard, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlayWildChildChoosesModel, createFakeGamePlayWitchUsesPotions, createFakeGamePlayWolfHoundChoosesSide } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCantVoteBySurvivorsPlayerAttribute, createFakeEatenByWerewolvesPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakePowerlessByElderPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeDevotedServantAlivePlayer, createFakeIdiotAlivePlayer, createFakeSeerAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { getError } from "@tests/helpers/exception/exception.helpers";

describe("Game Play Validator Service", () => {
  let mocks: {
    gamePlayValidatorService: {
      validateGamePlayWithRelationsDtoJudgeRequest: jest.SpyInstance;
      validateGamePlayWithRelationsDtoChosenSide: jest.SpyInstance;
      validateGamePlayVotesWithRelationsDto: jest.SpyInstance;
      validateGamePlayTargetsWithRelationsDto: jest.SpyInstance;
      validateGamePlayWithRelationsDtoChosenCard: jest.SpyInstance;
      validateGamePlayActorChosenCard: jest.SpyInstance;
      validateGamePlayWitchTargets: jest.SpyInstance;
      validateGamePlayWithRelationsDto: jest.SpyInstance;
      validateGamePlayThiefChosenCard: jest.SpyInstance;
      validateDrankLifePotionTargets: jest.SpyInstance;
      validateDrankDeathPotionTargets: jest.SpyInstance;
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
      validateGamePlayAccursedWolfFatherTargets: jest.SpyInstance;
      validateGamePlayTargetsBoundaries: jest.SpyInstance;
      validateTargetsPotionUsage: jest.SpyInstance;
      validateGamePlaySourceTargets: jest.SpyInstance;
      validateGamePlayVotesTieBreakerWithRelationsDto: jest.SpyInstance;
      validateGamePlayVotesWithRelationsDtoSourceAndTarget: jest.SpyInstance;
      validateGamePlaySurvivorsTargets: jest.SpyInstance;
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
      getLastGameHistoryAccursedWolfFatherInfectsRecord: jest.SpyInstance;
      getGameHistoryStutteringJudgeRequestsAnotherVoteRecords: jest.SpyInstance;
      didJudgeMakeHisSign: jest.SpyInstance;
    };
    gamePlayHelper: {
      isPlayerInteractableWithInteractionTypeInCurrentGamePlay: jest.SpyInstance;
      isPlayerInteractableInCurrentGamePlay: jest.SpyInstance;
    };
    unexpectedExceptionFactory: {
      createNoCurrentGamePlayUnexpectedException: jest.SpyInstance;
      createCantFindPlayerWithCurrentRoleUnexpectedException: jest.SpyInstance;
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
        validateGamePlayActorChosenCard: jest.fn(),
        validateGamePlayWitchTargets: jest.fn(),
        validateGamePlayWithRelationsDto: jest.fn(),
        validateGamePlayThiefChosenCard: jest.fn(),
        validateDrankLifePotionTargets: jest.fn(),
        validateDrankDeathPotionTargets: jest.fn(),
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
        validateGamePlayAccursedWolfFatherTargets: jest.fn(),
        validateGamePlayTargetsBoundaries: jest.fn(),
        validateTargetsPotionUsage: jest.fn(),
        validateGamePlaySourceTargets: jest.fn(),
        validateGamePlayVotesTieBreakerWithRelationsDto: jest.fn(),
        validateGamePlayVotesWithRelationsDtoSourceAndTarget: jest.fn(),
        validateGamePlaySurvivorsTargets: jest.fn(),
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
        getLastGameHistoryAccursedWolfFatherInfectsRecord: jest.fn(),
        getGameHistoryStutteringJudgeRequestsAnotherVoteRecords: jest.fn(),
        didJudgeMakeHisSign: jest.fn(),
      },
      gamePlayHelper: {
        isPlayerInteractableInCurrentGamePlay: jest.spyOn(GamePlayHelper, "isPlayerInteractableInCurrentGamePlay").mockImplementation(),
        isPlayerInteractableWithInteractionTypeInCurrentGamePlay: jest.spyOn(GamePlayHelper, "isPlayerInteractableWithInteractionTypeInCurrentGamePlay").mockImplementation(),
      },
      unexpectedExceptionFactory: {
        createNoCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoCurrentGamePlayUnexpectedException").mockImplementation(),
        createCantFindPlayerWithCurrentRoleUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createCantFindPlayerWithCurrentRoleUnexpectedException").mockImplementation(),
      },
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

  describe("validateGamePlayActorChosenCard", () => {
    it("should do nothing when game additional cards are not set.", () => {
      const chosenCard = createFakeGameAdditionalCard({ isUsed: true });
      const game = createFakeGameWithCurrentPlay();

      expect(() => services.gamePlayValidator["validateGamePlayActorChosenCard"](chosenCard, game)).not.toThrow();
    });

    it("should do nothing when chosen card is not defined.", () => {
      const chosenCard = undefined;
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.ACTOR, isUsed: false }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WHITE_WEREWOLF, recipient: RoleNames.ACTOR, isUsed: false }),
      ];
      const game = createFakeGameWithCurrentPlay({ additionalCards });

      expect(() => services.gamePlayValidator["validateGamePlayActorChosenCard"](chosenCard, game)).not.toThrow();
    });

    it("should do nothing when chosen card is for actor.", () => {
      const chosenCard = createFakeGameAdditionalCard({ roleName: RoleNames.WHITE_WEREWOLF, recipient: RoleNames.ACTOR, isUsed: false });
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.ACTOR, isUsed: false }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WHITE_WEREWOLF, recipient: RoleNames.ACTOR, isUsed: false }),
      ];
      const game = createFakeGameWithCurrentPlay({ additionalCards });

      expect(() => services.gamePlayValidator["validateGamePlayActorChosenCard"](chosenCard, game)).not.toThrow();
    });

    it("should throw an error when chosen card is not for the actor.", async() => {
      const chosenCard = createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.THIEF, isUsed: false });
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.ACTOR, isUsed: false }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WHITE_WEREWOLF, recipient: RoleNames.ACTOR, isUsed: false }),
      ];
      const game = createFakeGameWithCurrentPlay({ additionalCards });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.CHOSEN_CARD_NOT_FOR_ACTOR);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayActorChosenCard"](chosenCard, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Chosen card is not for actor" });
    });

    it("should throw an error when chosen card is already used.", async() => {
      const chosenCard = createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.ACTOR, isUsed: true });
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.ACTOR, isUsed: false }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WHITE_WEREWOLF, recipient: RoleNames.ACTOR, isUsed: false }),
      ];
      const game = createFakeGameWithCurrentPlay({ additionalCards });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.CHOSEN_CARD_NOT_FOR_ACTOR);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayActorChosenCard"](chosenCard, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Chosen card is already used" });
    });
  });

  describe("validateGamePlayThiefChosenCard", () => {
    it("should do nothing when game additional cards are not set.", () => {
      const chosenCard = createFakeGameAdditionalCard({ recipient: RoleNames.ACTOR });
      const currentPlay = createFakeGamePlayThiefChoosesCard({ canBeSkipped: false });
      const game = createFakeGameWithCurrentPlay({ currentPlay });

      expect(() => services.gamePlayValidator["validateGamePlayThiefChosenCard"](chosenCard, game)).not.toThrow();
    });

    it("should do nothing when thief didn't choose a card but he can skip.", () => {
      const chosenCard = undefined;
      const currentPlay = createFakeGamePlayThiefChoosesCard({ canBeSkipped: true });
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.THIEF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.SEER, recipient: RoleNames.THIEF }),
      ];
      const game = createFakeGameWithCurrentPlay({ additionalCards, currentPlay });

      expect(() => services.gamePlayValidator["validateGamePlayThiefChosenCard"](chosenCard, game)).not.toThrow();
    });

    it("should do nothing when thief chose a card for him.", () => {
      const chosenCard = createFakeGameAdditionalCard({ recipient: RoleNames.THIEF });
      const currentPlay = createFakeGamePlayThiefChoosesCard({ canBeSkipped: false });
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.THIEF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WHITE_WEREWOLF, recipient: RoleNames.THIEF }),
      ];
      const game = createFakeGameWithCurrentPlay({ additionalCards, currentPlay });

      expect(() => services.gamePlayValidator["validateGamePlayThiefChosenCard"](chosenCard, game)).not.toThrow();
    });

    it("should throw error when thief can't skip and he didn't choose a card.", async() => {
      const chosenCard = undefined;
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.THIEF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WHITE_WEREWOLF, recipient: RoleNames.THIEF }),
      ];
      const currentPlay = createFakeGamePlayThiefChoosesCard({ canBeSkipped: false });
      const game = createFakeGameWithCurrentPlay({ additionalCards, currentPlay });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.THIEF_MUST_CHOOSE_CARD);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayThiefChosenCard"](chosenCard, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Thief must choose a card (`chosenCard`)" });
    });

    it("should throw error when chosen card is not for thief.", async() => {
      const chosenCard = createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.ACTOR });
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.THIEF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WHITE_WEREWOLF, recipient: RoleNames.THIEF }),
      ];
      const currentPlay = createFakeGamePlayThiefChoosesCard({ canBeSkipped: true });
      const game = createFakeGameWithCurrentPlay({ additionalCards, currentPlay });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.CHOSEN_CARD_NOT_FOR_THIEF);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayThiefChosenCard"](chosenCard, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Chosen card is not for thief" });
    });
  });

  describe("validateGamePlayWithRelationsDtoChosenCard", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayThiefChosenCard = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayThiefChosenCard }, "validateGamePlayThiefChosenCard").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayActorChosenCard = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayActorChosenCard }, "validateGamePlayActorChosenCard").mockImplementation();
    });

    it("should do nothing when chosen card is not defined and not expected.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenCard"](makeGamePlayWithRelationsDto, game)).not.toThrow();
    });

    it("should throw error when chosen card is defined but not expected.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenCard: createFakeGameAdditionalCard() });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_CHOSEN_CARD);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenCard"](makeGamePlayWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`chosenCard` can't be set on this current game's state" });
    });

    it("should call validateGamePlayThiefChosenCard method when action is choose card and source is thief.", () => {
      const chosenCard = createFakeGameAdditionalCard();
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayThiefChoosesCard() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenCard });
      services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenCard"](makeGamePlayWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayThiefChosenCard).toHaveBeenCalledExactlyOnceWith(chosenCard, game);
    });

    it("should call validateGamePlayActorChosenCard method when action is choose card and source is actor.", () => {
      const chosenCard = createFakeGameAdditionalCard();
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayActorChoosesCard() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenCard });
      services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenCard"](makeGamePlayWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayActorChosenCard).toHaveBeenCalledExactlyOnceWith(chosenCard, game);
    });

    it("should not call neither thief or actor validation methods when game source is any of them.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide({ action: GamePlayActions.CHOOSE_CARD }) });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();
      services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenCard"](makeGamePlayWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayThiefChosenCard).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayActorChosenCard).not.toHaveBeenCalled();
    });
  });

  describe("validateGamePlaySurvivorsTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
    });

    it("should do nothing when game's current play action is not bury dead bodies.", () => {
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlaySurvivorsTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should validate targets boundaries when game's current play action is bury dead bodies.", () => {
      const players = [
        createFakeDevotedServantAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
      ];
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsBuryDeadBodies(), players });
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      services.gamePlayValidator["validateGamePlaySurvivorsTargets"](makeGamePlayTargetsWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.STEAL_ROLE, game);
    });

    it("should do nothing when there is no target.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsBuryDeadBodies() });
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);

      expect(() => services.gamePlayValidator["validateGamePlaySurvivorsTargets"]([], game)).not.toThrow();
    });

    it("should throw error when there is a target but no devoted servant in the game.", async() => {
      const players = [
        createFakeDevotedServantAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
      ];
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsBuryDeadBodies(), players });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.DEVOTED_SERVANT_CANT_STEAL_ROLE);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const error = await getError(() => services.gamePlayValidator["validateGamePlaySurvivorsTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Devoted servant can't steal the role of this target because she's not in the game or dead or powerless or in love with another player" });
    });

    it("should throw error when there is a target but the devoted servant is dead.", async() => {
      const players = [
        createFakeDevotedServantAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
      ];
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsBuryDeadBodies(), players });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.DEVOTED_SERVANT_CANT_STEAL_ROLE);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const error = await getError(() => services.gamePlayValidator["validateGamePlaySurvivorsTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Devoted servant can't steal the role of this target because she's not in the game or dead or powerless or in love with another player" });
    });

    it("should throw error when there is a target but devoted servant is powerless.", async() => {
      const players = [
        createFakeDevotedServantAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
      ];
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsBuryDeadBodies(), players });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.DEVOTED_SERVANT_CANT_STEAL_ROLE);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      const error = await getError(() => services.gamePlayValidator["validateGamePlaySurvivorsTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Devoted servant can't steal the role of this target because she's not in the game or dead or powerless or in love with another player" });
    });

    it("should throw error when there is a target but devoted servant is in-love.", async() => {
      const players = [
        createFakeDevotedServantAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
      ];
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsBuryDeadBodies(), players });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.DEVOTED_SERVANT_CANT_STEAL_ROLE);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      const error = await getError(() => services.gamePlayValidator["validateGamePlaySurvivorsTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Devoted servant can't steal the role of this target because she's not in the game or dead or powerless or in love with another player" });
    });

    it("should throw error when there is a target but he can't be interacted with the devoted servant.", async() => {
      const players = [
        createFakeDevotedServantAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
      ];
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsBuryDeadBodies(), players });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_DEVOTED_SERVANT_TARGET);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const error = await getError(() => services.gamePlayValidator["validateGamePlaySurvivorsTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Devoted servant can't steal the role of this target because he's not about to be buried" });
    });

    it("should do nothing when target is valid for devoted servant.", () => {
      const players = [
        createFakeDevotedServantAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
      ];
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsBuryDeadBodies(), players });
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlaySurvivorsTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateDrankLifePotionTargets", () => {
    it("should throw error when there are too much targets for life potion.", async() => {
      const game = createFakeGameWithCurrentPlay();
      const drankLifePotionTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_DRANK_LIFE_POTION_TARGETS);
      const error = await getError(() => services.gamePlayValidator["validateDrankLifePotionTargets"](drankLifePotionTargets, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "There are too much targets which drank life potion (`targets.drankPotion`)" });
    });

    it("should throw error when life potion target can't drink it.", async() => {
      const game = createFakeGameWithCurrentPlay();
      const targetedPlayer = createFakePlayer({ isAlive: true, attributes: [] });
      const drankLifePotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WitchPotions.LIFE })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_LIFE_POTION_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateDrankLifePotionTargets"](drankLifePotionTargets, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Life potion can't be applied to this target (`targets.drankPotion`)" });
    });

    it("should do nothing when there is no life potion target.", () => {
      const game = createFakeGameWithCurrentPlay();
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);

      expect(() => services.gamePlayValidator["validateDrankLifePotionTargets"]([], game)).not.toThrow();
    });

    it("should do nothing when life potion target is applied on valid target.", () => {
      const game = createFakeGameWithCurrentPlay();
      const targetedPlayer = createFakePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()], isAlive: true });
      const drankLifePotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WitchPotions.LIFE })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateDrankLifePotionTargets"](drankLifePotionTargets, game)).not.toThrow();
    });
  });

  describe("validateDrankDeathPotionTargets", () => {
    it("should throw error when there are too much targets for death potion.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const drankDeathPotionTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_DRANK_DEATH_POTION_TARGETS);
      const error = await getError(() => services.gamePlayValidator["validateDrankDeathPotionTargets"](drankDeathPotionTargets, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "There are too much targets which drank death potion (`targets.drankPotion`)" });
    });

    it("should throw error when death potion target can't drink it.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const targetedPlayer = createFakePlayer({ isAlive: false });
      const drankDeathPotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WitchPotions.DEATH })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_DEATH_POTION_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateDrankDeathPotionTargets"](drankDeathPotionTargets, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Death potion can't be applied to this target (`targets.drankPotion`)" });
    });

    it("should do nothing when there is no death potion target.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);

      expect(() => services.gamePlayValidator["validateDrankDeathPotionTargets"]([], game)).not.toThrow();
    });

    it("should do nothing when death potion target is applied on valid target.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const targetedPlayer = createFakePlayer({ isAlive: true });
      const drankDeathPotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WitchPotions.DEATH })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateDrankDeathPotionTargets"](drankDeathPotionTargets, game)).not.toThrow();
    });
  });

  describe("validateGamePlayWitchTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateDrankLifePotionTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateDrankLifePotionTargets }, "validateDrankLifePotionTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateDrankDeathPotionTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateDrankDeathPotionTargets }, "validateDrankDeathPotionTargets").mockImplementation();
    });

    it("should throw error when witch is not in the game.", async() => {
      const players = [
        createFakeIdiotAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
      ];
      const mockedError = new UnexpectedException("validateGamePlayWitchTargets", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_CURRENT_ROLE_IN_GAME, { gameId: game._id.toString(), roleName: RoleNames.WITCH });
      mocks.unexpectedExceptionFactory.createCantFindPlayerWithCurrentRoleUnexpectedException.mockReturnValue(mockedError);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).rejects.toStrictEqual<UnexpectedException>(mockedError);
      expect(mocks.unexpectedExceptionFactory.createCantFindPlayerWithCurrentRoleUnexpectedException).toHaveBeenCalledExactlyOnceWith("validateGamePlayWitchTargets", { gameId: game._id, roleName: RoleNames.WITCH });
    });

    it("should throw error when witch targeted someone with life potion but already used it with death potion before.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayWitchUsesPotions() });
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
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.LIFE).mockResolvedValue(gameHistoryRecords);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.DEATH).mockResolvedValue(gameHistoryRecords);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);
      const error = await getError(async() => services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`targets.drankPotion` can't be set on this current game's state" });
    });

    it("should throw error when witch targeted someone with life potion but already used it alone before.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({}),
      ];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE })];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) }),
      ];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.LIFE).mockResolvedValue(gameHistoryRecords);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.DEATH).mockResolvedValue([]);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);
      const error = await getError(async() => services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`targets.drankPotion` can't be set on this current game's state" });
    });

    it("should throw error when witch targeted someone with death potion but already used it with life potion before.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayWitchUsesPotions() });
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
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.LIFE).mockResolvedValue(gameHistoryRecords);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.DEATH).mockResolvedValue(gameHistoryRecords);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);
      const error = await getError(async() => services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`targets.drankPotion` can't be set on this current game's state" });
    });

    it("should throw error when witch targeted someone with death potion but already used it alone before.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[1], drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[2] }),
      ];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH })];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordSurvivorsVotePlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) }),
      ];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.LIFE).mockResolvedValue([]);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.DEATH).mockResolvedValue(gameHistoryRecords);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);
      const error = await getError(async() => services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`targets.drankPotion` can't be set on this current game's state" });
    });

    it("should call potions validators without players when called with valid data but no target drank potions.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() })];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.LIFE).mockResolvedValue([]);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.DEATH).mockResolvedValue([]);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(mocks.gamePlayValidatorService.validateDrankLifePotionTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateDrankDeathPotionTargets).toHaveBeenCalledExactlyOnceWith([], game);
    });

    it("should call potions validators with players when called without bad data and without witch history.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
      ];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.LIFE).mockResolvedValue([]);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.DEATH).mockResolvedValue([]);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(mocks.gamePlayValidatorService.validateDrankLifePotionTargets).toHaveBeenCalledExactlyOnceWith([makeGamePlayTargetsWithRelationsDto[0]], game);
      expect(mocks.gamePlayValidatorService.validateDrankDeathPotionTargets).toHaveBeenCalledExactlyOnceWith([makeGamePlayTargetsWithRelationsDto[1]], game);
    });

    it("should call potions validators with players when called for valid life potion data and some witch history.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE })];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH })];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) })];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.LIFE).mockReturnValue([]);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.DEATH).mockResolvedValue(gameHistoryRecords);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(mocks.gamePlayValidatorService.validateDrankLifePotionTargets).toHaveBeenCalledExactlyOnceWith([makeGamePlayTargetsWithRelationsDto[0]], game);
      expect(mocks.gamePlayValidatorService.validateDrankDeathPotionTargets).toHaveBeenCalledExactlyOnceWith([], game);
    });

    it("should call potions validators with players when called for valid death potion data and some witch history.", async() => {
      const players = [
        createFakeWitchAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH })];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE })];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) })];
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.LIFE).mockResolvedValue(gameHistoryRecords);
      when(mocks.gameHistoryRecordService.getGameHistoryWitchUsesSpecificPotionRecords).calledWith(game._id, players[0]._id, WitchPotions.DEATH).mockResolvedValue([]);

      await expect(services.gamePlayValidator["validateGamePlayWitchTargets"](makeGamePlayTargetsWithRelationsDto, game)).toResolve();
      expect(mocks.gamePlayValidatorService.validateDrankLifePotionTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateDrankDeathPotionTargets).toHaveBeenCalledExactlyOnceWith([makeGamePlayTargetsWithRelationsDto[0]], game);
    });
  });

  describe("validateGamePlayAccursedWolfFatherTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
    });

    it("should call validateGamePlayTargetsBoundaries when called.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      services.gamePlayValidator["validateGamePlayAccursedWolfFatherTargets"](makeGamePlayTargetsWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.INFECT, game);
    });

    it("should do nothing when there is no target.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayAccursedWolfFatherInfects() });
      const makeGamePlayTargetsWithRelationsDto = [];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);

      expect(() => services.gamePlayValidator["validateGamePlayAccursedWolfFatherTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should throw error when there is a target but he can't be interacted with the accursed wolf father.", async() => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[1] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_ACCURSED_WOLF_FATHER_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayAccursedWolfFatherTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Accursed Wolf-father can't infect this target" });
    });

    it("should do nothing when target is valid for accursed wolf father.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayAccursedWolfFatherTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayWerewolvesTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
    });

    it("should call validateGamePlayTargetsBoundaries when called.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayAccursedWolfFatherInfects() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.EAT, game);
    });

    it("should do nothing when there is no target.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat() });
      const makeGamePlayTargetsWithRelationsDto = [];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);

      expect(() => services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when game's current play action is not werewolves eat.", () => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[1] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);

      expect(() => services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should throw error when source are werewolves and targeted player can't be eaten by them.", async() => {
      const players = [
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[1] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WEREWOLVES_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Werewolves can't eat this target" });
    });

    it("should throw error when source is big bad wolf and targeted player can't be eaten by him.", async() => {
      const players = [
        createFakeVillagerAlivePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayBigBadWolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_BIG_BAD_WOLF_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Big bad wolf can't eat this target" });
    });

    it("should throw error when source is white werewolf and targeted player can't be eaten by him.", async() => {
      const whiteWerewolfPlayer = createFakeWhiteWerewolfAlivePlayer();
      const players = [
        whiteWerewolfPlayer,
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWhiteWerewolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: whiteWerewolfPlayer })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_ACCURSED_WOLF_FATHER_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "White werewolf can't eat this target" });
    });

    it("should do nothing when white werewolf eaten target is valid.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWhiteWerewolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when big bad wolf eaten target is valid.", () => {
      const players = [createFakeVillagerAlivePlayer()];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayBigBadWolfEats(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when werewolves eaten target is valid.", () => {
      const players = [createFakeVillagerAlivePlayer()];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: players[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayWerewolvesTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayHunterTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
    });

    it("should call validateGamePlayTargetsBoundaries when called.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayHunterShoots() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      services.gamePlayValidator["validateGamePlayHunterTargets"](makeGamePlayTargetsWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.SHOOT, game);
    });

    it("should throw error when targeted player can't be shot.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayHunterShoots() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_HUNTER_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayHunterTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Hunter can't shoot this target" });
    });

    it("should do nothing when targeted player for hunter is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayHunterShoots() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayHunterTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayScapeGoatTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
    });

    it("should call validateGamePlayTargetsBoundaries when called.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScapegoatBansVoting() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      services.gamePlayValidator["validateGamePlayScapegoatTargets"](makeGamePlayTargetsWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.BAN_VOTING, game);
    });

    it("should throw error when one of the targeted player can't be banned from voting.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScapegoatBansVoting() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValueOnce(true);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValueOnce(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SCAPEGOAT_TARGETS);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayScapegoatTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "At least one of the scapegoat targets can't be banned from voting" });
    });

    it("should do nothing when all scapegoat's targets are valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScapegoatBansVoting() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayScapegoatTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayCupidTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
    });

    it("should call validateGamePlayTargetsBoundaries when called.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayCupidCharms() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      services.gamePlayValidator["validateGamePlayCupidTargets"](makeGamePlayTargetsWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.CHARM, game);
    });

    it("should throw error when one of the targeted player can't be charmed.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayCupidCharms() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValueOnce(true);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValueOnce(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_CUPID_TARGETS);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayCupidTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "At least one of the cupid targets can't be charmed" });
    });

    it("should do nothing when all cupid's targets are valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayCupidCharms() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayCupidTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayFoxTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
    });

    it("should call validateGamePlayTargetsBoundaries when called.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      services.gamePlayValidator["validateGamePlayFoxTargets"](makeGamePlayTargetsWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.SNIFF, game);
    });

    it("should do nothing when there are no targets.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs() });
      const makeGamePlayTargetsWithRelationsDto = [];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);

      expect(() => services.gamePlayValidator["validateGamePlayFoxTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should throw error when targeted player can't be sniffed.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_FOX_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayFoxTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Fox can't sniff this target" });
    });

    it("should do nothing when targeted player for fox is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayFoxTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlaySeerTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
    });

    it("should call validateGamePlayTargetsBoundaries when called.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      services.gamePlayValidator["validateGamePlaySeerTargets"](makeGamePlayTargetsWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.LOOK, game);
    });

    it("should throw error when targeted player can't be seen.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SEER_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateGamePlaySeerTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Seer can't look at this target" });
    });

    it("should do nothing when seer's targeted player is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlaySeerTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayScandalmongerTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
    });

    it("should call validateGamePlayTargetsBoundaries when called.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScandalmongerMarks() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      services.gamePlayValidator["validateGamePlayScandalmongerTargets"](makeGamePlayTargetsWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.MARK, game);
    });

    it("should throw error when targeted player can't be marked.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScandalmongerMarks() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SCANDALMONGER_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayScandalmongerTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Scandalmonger can't mark this target" });
    });

    it("should do nothing when there are no targets.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScandalmongerMarks() });
      const makeGamePlayTargetsWithRelationsDto = [];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);

      expect(() => services.gamePlayValidator["validateGamePlayScandalmongerTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when scandalmonger's target is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScandalmongerMarks() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayScandalmongerTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayWildChildTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
    });

    it("should call validateGamePlayTargetsBoundaries when called.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWildChildChoosesModel() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      services.gamePlayValidator["validateGamePlayWildChildTargets"](makeGamePlayTargetsWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.CHOOSE_AS_MODEL, game);
    });

    it("should throw error when targeted player can't be chosen as model.", async() => {
      const wildChildPlayer = createFakeWildChildAlivePlayer();
      const players = [
        wildChildPlayer,
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWildChildChoosesModel(), players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: wildChildPlayer })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_WILD_CHILD_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayWildChildTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Wild child can't choose this target as a model" });
    });

    it("should do nothing when wild child's targeted player is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWildChildChoosesModel() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayWildChildTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayPiedPiperTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
    });

    it("should call validateGamePlayTargetsBoundaries when called.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ charmedPeopleCountPerNight: 5 }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayPiedPiperCharms(), options });
      const leftToCharmPlayers = [createFakeWildChildAlivePlayer()];
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: leftToCharmPlayers[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      services.gamePlayValidator["validateGamePlayPiedPiperTargets"](makeGamePlayTargetsWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.CHARM, game);
    });

    it("should throw error when one of the targeted player is not in the last to charm.", async() => {
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
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValueOnce(true);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValueOnce(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_PIED_PIPER_TARGETS);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayPiedPiperTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "At least one of the pied piper targets can't be charmed" });
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
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayPiedPiperTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when pied piper targets are valid and limited to left players to charm count.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ charmedPeopleCountPerNight: 5 }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayPiedPiperCharms(), options });
      const leftToCharmPlayers = [createFakeWildChildAlivePlayer()];
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: leftToCharmPlayers[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayPiedPiperTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayDefenderTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
    });

    it("should call validateGamePlayTargetsBoundaries when called.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ defender: { canProtectTwice: false } }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDefenderProtects(), options });
      const targetedPlayer = createFakeVillagerAlivePlayer();
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      services.gamePlayValidator["validateGamePlayDefenderTargets"](makeGamePlayTargetsWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenCalledExactlyOnceWith(makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.PROTECT, game);
    });

    it("should throw error when targeted player can't be targeted.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDefenderProtects() });
      const targetedPlayer = createFakeVillagerAlivePlayer({ isAlive: false });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_DEFENDER_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayDefenderTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Defender can't protect this target" });
    });

    it("should do nothing when targeted player can be protected.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ defender: { canProtectTwice: false } }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDefenderProtects(), options });
      const targetedPlayer = createFakeVillagerAlivePlayer();
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayDefenderTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlaySheriffTargets", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
    });

    it("should call validateGamePlayTargetsBoundaries when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySheriffDelegates() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0] })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValueOnce(true);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValueOnce(false);
      services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game);

      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenNthCalledWith(1, makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE, game);
      expect(mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries).toHaveBeenNthCalledWith(2, makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.SENTENCE_TO_DEATH, game);
    });

    it("should do nothing when game play action is not DELEGATE nor SETTLE_VOTES.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffDelegates({ action: GamePlayActions.USE_POTIONS }) });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when targeted player for sheriff delegation is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffDelegates() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should throw error when targeted player is not in last tie in votes and upcoming action is SETTLE_VOTES.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffSettlesVotes() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SHERIFF_SETTLE_VOTES_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Sheriff can't break the tie in votes with this target" });
    });

    it("should throw error when targeted player is not in last tie in votes and upcoming action is DELEGATE.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffDelegates() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(false);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_SHERIFF_DELEGATE_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Sheriff can't delegate his role to this target" });
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
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValueOnce(true);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValueOnce(false);

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
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValueOnce(false);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValueOnce(true);

      expect(() => services.gamePlayValidator["validateGamePlaySheriffTargets"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayTargetsBoundaries", () => {
    it("should do nothing when interaction is not found.", () => {
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      const game = createFakeGameWithCurrentPlay({
        currentPlay: createFakeGamePlaySheriffDelegates({
          source: createFakeGamePlaySource({
            interactions: [
              createFakeGamePlaySourceInteraction({
                type: PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE,
                boundaries: createFakeGamePlaySourceInteractionBoundaries({ min: 4, max: 4 }),
              }),
            ],
          }),
        }),
      });

      expect(() => services.gamePlayValidator["validateGamePlayTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.CHARM, game)).not.toThrow();
    });

    it("should throw error when min boundary is not respected.", async() => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      const game = createFakeGameWithCurrentPlay({
        currentPlay: createFakeGamePlaySheriffDelegates({
          source: createFakeGamePlaySource({
            interactions: [
              createFakeGamePlaySourceInteraction({
                type: PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE,
                boundaries: createFakeGamePlaySourceInteractionBoundaries({ min: 4, max: 4 }),
              }),
            ],
          }),
        }),
      });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_LESS_TARGETS);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "There are too less targets for this current game's state" });
    });

    it("should throw error when max boundary is not respected.", async() => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      const game = createFakeGameWithCurrentPlay({
        currentPlay: createFakeGamePlaySheriffDelegates({
          source: createFakeGamePlaySource({
            interactions: [
              createFakeGamePlaySourceInteraction({
                type: PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE,
                boundaries: createFakeGamePlaySourceInteractionBoundaries({ min: 1, max: 2 }),
              }),
            ],
          }),
        }),
      });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_TARGETS);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "There are too much targets for this current game's state" });
    });

    it("should do nothing when boundaries are respected, even equal to max.", () => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      const game = createFakeGameWithCurrentPlay({
        currentPlay: createFakeGamePlaySheriffDelegates({
          source: createFakeGamePlaySource({
            interactions: [
              createFakeGamePlaySourceInteraction({
                type: PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE,
                boundaries: createFakeGamePlaySourceInteractionBoundaries({ min: 3, max: 3 }),
              }),
            ],
          }),
        }),
      });

      expect(() => services.gamePlayValidator["validateGamePlayTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE, game)).not.toThrow();
    });

    it("should do nothing when boundaries are respected, even equal to min.", () => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      const game = createFakeGameWithCurrentPlay({
        currentPlay: createFakeGamePlaySheriffDelegates({
          source: createFakeGamePlaySource({
            interactions: [
              createFakeGamePlaySourceInteraction({
                type: PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE,
                boundaries: createFakeGamePlaySourceInteractionBoundaries({ min: 3, max: 4 }),
              }),
            ],
          }),
        }),
      });

      expect(() => services.gamePlayValidator["validateGamePlayTargetsBoundaries"](makeGamePlayTargetsWithRelationsDto, PlayerInteractionTypes.TRANSFER_SHERIFF_ROLE, game)).not.toThrow();
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
      mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayAccursedWolfFatherTargets }, "validateGamePlayAccursedWolfFatherTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlayWitchTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayWitchTargets }, "validateGamePlayWitchTargets").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlaySurvivorsTargets }, "validateGamePlaySurvivorsTargets").mockImplementation();
    });

    it("should call sheriff validator when game current play is for the sheriff.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySheriffSettlesVotes() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
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
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
    });

    it("should call survivors validator when game current play is for the survivors.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).toHaveBeenCalledExactlyOnceWith([], game);
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
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
    });

    it("should call werewolves validator when game current play is for the werewolves.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWerewolvesEat() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).toHaveBeenCalledExactlyOnceWith([], game);
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
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

    it("should call accursed wolf-father validator when game current play is for the accursed wolf father.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayAccursedWolfFatherInfects() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySheriffTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWerewolvesTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).toHaveBeenCalledExactlyOnceWith([], game);
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

      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
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
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
    });

    it("should call werewolves validator when game current play is for the white werewolf.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWhiteWerewolfEats() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
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
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
    });

    it("should call defender validator when game current play is for the defender.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayDefenderProtects() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
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
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
    });

    it("should call pied piper validator when game current play is for the pied piper.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayPiedPiperCharms() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
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
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
    });

    it("should call wild child validator when game current play is for the wild child.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWildChildChoosesModel() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
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
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
    });

    it("should call scandalmonger validator when game current play is for the scandalmonger.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScandalmongerMarks() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
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
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
    });

    it("should call seer validator when game current play is for the seer.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
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
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
    });

    it("should call fox validator when game current play is for the fox.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
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
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
    });

    it("should call cupid validator when game current play is for the cupid.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayCupidCharms() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
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
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
    });

    it("should call scapegoat validator when game current play is for the scapegoat.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayScapegoatBansVoting() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
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
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
    });

    it("should call hunter validator when game current play is for the hunter.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayHunterShoots() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
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
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
    });

    it("should call witch validator when game current play is for the witch.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      await services.gamePlayValidator["validateGamePlaySourceTargets"]([], game);

      expect(mocks.gamePlayValidatorService.validateGamePlaySurvivorsTargets).not.toHaveBeenCalled();
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
      expect(mocks.gamePlayValidatorService.validateGamePlayAccursedWolfFatherTargets).not.toHaveBeenCalled();
      expect(mocks.gamePlayValidatorService.validateGamePlayWitchTargets).toHaveBeenCalledExactlyOnceWith([], game);
    });
  });

  describe("validateTargetsPotionUsage", () => {
    it("should throw error when expected action is not use potions but targets drank potions.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions({ action: GamePlayActions.CHOOSE_CARD }) });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateTargetsPotionUsage"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`targets.drankPotion` can't be set on this current game's state" });
    });

    it("should throw error when expected source is not witch but targets drank potions.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions({ source: createFakeGamePlaySource({ name: RoleNames.THIEF }) }) });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_DRANK_POTION_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateTargetsPotionUsage"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`targets.drankPotion` can't be set on this current game's state" });
    });

    it("should do nothing when expected some players drank potions and game play is valid.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWitchUsesPotions() });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WitchPotions.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];

      expect(() => services.gamePlayValidator["validateTargetsPotionUsage"](makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayTargetsWithRelationsDto", () => {
    beforeEach(() => {
      mocks.gamePlayValidatorService.validateGamePlayTargetsBoundaries = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlayTargetsBoundaries }, "validateGamePlayTargetsBoundaries").mockImplementation();
      mocks.gamePlayValidatorService.validateTargetsPotionUsage = jest.spyOn(services.gamePlayValidator as unknown as { validateTargetsPotionUsage }, "validateTargetsPotionUsage").mockImplementation();
      mocks.gamePlayValidatorService.validateGamePlaySourceTargets = jest.spyOn(services.gamePlayValidator as unknown as { validateGamePlaySourceTargets }, "validateGamePlaySourceTargets").mockImplementation();
    });

    it("should do nothing when there are no targets defined and upcoming action doesn't require targets anyway.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });

      await expect(services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"](undefined, game)).toResolve();
      expect(mocks.gamePlayValidatorService.validateTargetsPotionUsage).not.toHaveBeenCalled();
    });

    it("should do nothing when there are no targets and upcoming action can be skipped.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayFoxSniffs({ canBeSkipped: true }) });

      await expect(services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"]([], game)).toResolve();
      expect(mocks.gamePlayValidatorService.validateTargetsPotionUsage).not.toHaveBeenCalled();
    });

    it("should throw error when there is no targets but they are required cause action can't be skipped.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySeerLooks({ canBeSkipped: false }) });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.REQUIRED_TARGETS);
      const error = await getError(async() => services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"]([], game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`targets` is required on this current game's state" });
    });

    it("should throw error when there are targets but they are not expected.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_TARGETS);
      const error = await getError(async() => services.gamePlayValidator["validateGamePlayTargetsWithRelationsDto"](makeGamePlayTargetsWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`targets` can't be set on this current game's state" });
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
      expect(mocks.gamePlayValidatorService.validateTargetsPotionUsage).toHaveBeenCalledOnce();
    });
  });

  describe("validateGamePlayVotesTieBreakerWithRelationsDto", () => {
    it("should throw error when action is vote and cause is previous votes were in tie but one voted player is not in the previous tie.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const source = createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS, players: [players[2]] });
      const currentPlay = createFakeGamePlaySurvivorsVote({ source, cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });
      const game = createFakeGameWithCurrentPlay({ currentPlay, players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[2] }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValueOnce(false);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_TARGET_FOR_TIE_BREAKER);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayVotesTieBreakerWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "One vote's target is not in the previous tie in votes" });
    });

    it("should throw error when action is elect sheriff and cause is previous votes were in tie but one voted player is not in the previous tie.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const source = createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS, players: [players[2]] });
      const currentPlay = createFakeGamePlaySurvivorsElectSheriff({ source, cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });
      const game = createFakeGameWithCurrentPlay({ currentPlay, players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[2] }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValueOnce(false);
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_TARGET_FOR_TIE_BREAKER);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayVotesTieBreakerWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "One vote's target is not in the previous tie in votes" });
    });

    it("should call isPlayerInteractableWithInteractionTypeInCurrentGamePlay with vote interaction type when action is vote.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const currentPlay = createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });
      const game = createFakeGameWithCurrentPlay({ currentPlay, players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[1] }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      services.gamePlayValidator["validateGamePlayVotesTieBreakerWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game);

      expect(mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay).toHaveBeenNthCalledWith(1, players[0]._id, PlayerInteractionTypes.VOTE, game);
      expect(mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay).toHaveBeenNthCalledWith(2, players[1]._id, PlayerInteractionTypes.VOTE, game);
    });

    it("should call isPlayerInteractableWithInteractionTypeInCurrentGamePlay with choose as sheriff interaction type when action is elect sheriff.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const currentPlay = createFakeGamePlaySurvivorsElectSheriff({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });
      const game = createFakeGameWithCurrentPlay({ currentPlay, players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[1] }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);
      services.gamePlayValidator["validateGamePlayVotesTieBreakerWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game);

      expect(mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay).toHaveBeenNthCalledWith(1, players[0]._id, PlayerInteractionTypes.CHOOSE_AS_SHERIFF, game);
      expect(mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay).toHaveBeenNthCalledWith(2, players[1]._id, PlayerInteractionTypes.CHOOSE_AS_SHERIFF, game);
    });

    it("should do nothing when cause is previous votes were in tie and all voted players were in previous tie.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const currentPlay = createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES });
      const game = createFakeGameWithCurrentPlay({ currentPlay, players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ target: players[1] }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableWithInteractionTypeInCurrentGamePlay.mockReturnValue(true);

      expect(() => services.gamePlayValidator["validateGamePlayVotesTieBreakerWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when cause is not previous votes were in tie.", () => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const source = createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS, players: [players[2]] });
      const currentPlay = createFakeGamePlaySurvivorsVote({ source, cause: GamePlayCauses.ANGEL_PRESENCE });
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
    it("should throw error when one vote source doesn't have the ability to vote.", async() => {
      const players = [
        createFakeSeerAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const source = createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS, players: [players[2]] });
      const currentPlay = createFakeGamePlaySurvivorsVote({ source });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[1] }),
      ];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_SOURCE);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDtoSourceAndTarget"](makeGamePlayVotesWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "One source is not able to vote because he's dead or doesn't have the ability to do so" });
    });

    it("should throw error when one vote target can't be voted against.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const source = createFakeGamePlaySource({
        name: PlayerGroups.SURVIVORS,
        players,
        interactions: [
          createFakeGamePlaySourceInteraction({
            type: PlayerInteractionTypes.VOTE,
            source: PlayerGroups.SURVIVORS,
            eligibleTargets: [players[1], players[2], players[3]],
            boundaries: { min: 1, max: 1 },
          }),
        ],
      });
      const currentPlay = createFakeGamePlaySurvivorsVote({ source });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[3], target: players[0] }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableInCurrentGamePlay.mockReturnValueOnce(false);
      mocks.gamePlayHelper.isPlayerInteractableInCurrentGamePlay.mockReturnValueOnce(true);
      mocks.gamePlayHelper.isPlayerInteractableInCurrentGamePlay.mockReturnValueOnce(true);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.BAD_VOTE_TARGET);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDtoSourceAndTarget"](makeGamePlayVotesWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "One target can't be voted because he's dead" });
    });

    it("should throw error when there are votes with the same source and target.", async() => {
      const players = [
        createFakeSeerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeIdiotAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const source = createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS, players });
      const currentPlay = createFakeGamePlaySurvivorsVote({ source });
      const game = createFakeGameWithCurrentPlay({ currentPlay, players });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[1] }),
      ];
      mocks.gamePlayHelper.isPlayerInteractableInCurrentGamePlay.mockReturnValue(true);
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.SAME_SOURCE_AND_TARGET_VOTE);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDtoSourceAndTarget"](makeGamePlayVotesWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "One vote has the same source and target" });
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

    it("should throw error when there are empty votes but they are not expected.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayWerewolvesEat() });
      const makeGamePlayVotesWithRelationsDto = [];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_VOTES);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`votes` can't be set on this current game's state" });
    });

    it("should throw error when there are votes but they are not expected.", async() => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayWerewolvesEat() });
      const makeGamePlayVotesWithRelationsDto = [createFakeMakeGamePlayVoteWithRelationsDto()];
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_VOTES);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](makeGamePlayVotesWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`votes` can't be set on this current game's state" });
    });

    it("should do nothing when there are no votes defined but game play of votes can be skipped.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ canBeSkipped: true }) });

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](undefined, game)).not.toThrow();
    });

    it("should do nothing when there are no votes (empty array) but game play of votes can be skipped.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ canBeSkipped: true }) });

      expect(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"]([], game)).not.toThrow();
    });

    it("should throw error when there are no votes (undefined) but game play of votes can't be skipped.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ canBeSkipped: false }) });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_VOTES);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"](undefined, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`votes` is required on this current game's state" });
    });

    it("should throw error when there are no votes (empty array) but game play of votes can't be skipped.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote({ canBeSkipped: false }) });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_VOTES);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayVotesWithRelationsDto"]([], game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`votes` is required on this current game's state" });
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
    it("should throw error when chosenSide is defined and game play action is not CHOOSE_SIDE.", async() => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ wolfHound: createFakeWolfHoundGameOptions({ isSideRandomlyChosen: false }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote(), options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenSide: RoleSides.WEREWOLVES });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_CHOSEN_SIDE);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`chosenSide` can't be set on this current game's state" });
    });

    it("should throw error when chosenSide is defined and game play action is CHOOSE_SIDE but game options say that it is randomly chosen.", async() => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ wolfHound: createFakeWolfHoundGameOptions({ isSideRandomlyChosen: true }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide(), options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenSide: RoleSides.WEREWOLVES });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_CHOSEN_SIDE);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`chosenSide` can't be set on this current game's state" });
    });

    it("should throw error when chosenSide is not defined and game play action is CHOOSE_SIDE and game options say that side is not randomly chosen.", async() => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ wolfHound: createFakeWolfHoundGameOptions({ isSideRandomlyChosen: false }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide(), options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.REQUIRED_CHOSEN_SIDE);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`chosenSide` is required on this current game's state" });
    });

    it("should do nothing when chosenSide is defined and game play action is CHOOSE_SIDE and game options say that side is not randomly chosen.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ wolfHound: createFakeWolfHoundGameOptions({ isSideRandomlyChosen: false }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayWolfHoundChoosesSide(), options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenSide: RoleSides.WEREWOLVES });

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when chosenSide is not defined and game play action is not CHOOSE_SIDE.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ wolfHound: createFakeWolfHoundGameOptions({ isSideRandomlyChosen: false }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote(), options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when chosenSide is not defined and game play action CHOOSE_SIDE but game options say that side is randomly chosen.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ wolfHound: createFakeWolfHoundGameOptions({ isSideRandomlyChosen: true }) }) });
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote(), options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoChosenSide"](makeGamePlayWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayWithRelationsDtoJudgeRequest", () => {
    beforeEach(() => {
      mocks.gameHistoryRecordService.didJudgeMakeHisSign.mockResolvedValue(true);
    });

    it("should throw error when doesJudgeRequestAnotherVote is defined and game play action is not request another vote.", async() => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      const expectedError = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.UNEXPECTED_STUTTERING_JUDGE_VOTE_REQUEST);
      const error = await getError(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoJudgeRequest"](makeGamePlayWithRelationsDto, game));

      expect(error).toStrictEqual<BadGamePlayPayloadException>(expectedError);
      expect(error).toHaveProperty("options", { description: "`doesJudgeRequestAnotherVote` can't be set on this current game's state" });
    });

    it("should do nothing when doesJudgeRequestAnotherVote is undefined.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlaySurvivorsVote() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoJudgeRequest"](makeGamePlayWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when doesJudgeRequestAnotherVote defined and action is request another vote.", () => {
      const game = createFakeGameWithCurrentPlay({ currentPlay: createFakeGamePlayStutteringJudgeRequestsAnotherVote() });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });

      expect(() => services.gamePlayValidator["validateGamePlayWithRelationsDtoJudgeRequest"](makeGamePlayWithRelationsDto, game)).not.toThrow();
    });
  });
});