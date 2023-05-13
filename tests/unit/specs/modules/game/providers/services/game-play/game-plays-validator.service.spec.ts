import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { GAME_HISTORY_RECORD_VOTING_RESULTS } from "../../../../../../../../src/modules/game/enums/game-history-record.enum";
import { GAME_PLAY_ACTIONS, WITCH_POTIONS } from "../../../../../../../../src/modules/game/enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../../../../../../src/modules/game/enums/player.enum";
import * as GameHelper from "../../../../../../../../src/modules/game/helpers/game.helper";
import { GameHistoryRecordRepository } from "../../../../../../../../src/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "../../../../../../../../src/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "../../../../../../../../src/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlaysValidatorService } from "../../../../../../../../src/modules/game/providers/services/game-play/game-plays-validator.service";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../../../../src/modules/role/enums/role.enum";
import { BadGamePlayPayloadException } from "../../../../../../../../src/shared/exception/types/bad-game-play-payload-exception.type";
import { createFakeMakeGamePlayTargetWithRelationsDto } from "../../../../../../../factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-target-with-relations.dto.factory";
import { createFakeMakeGamePlayVoteWithRelationsDto } from "../../../../../../../factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-vote-with-relations.dto.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "../../../../../../../factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeGameAdditionalCard } from "../../../../../../../factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordAllVotePlay, createFakeGameHistoryRecordGuardProtectPlay, createFakeGameHistoryRecordWerewolvesEatPlay, createFakeGameHistoryRecordWitchUsePotionsPlay } from "../../../../../../../factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-options.schema.factory";
import { createFakePiedPiperGameOptions, createFakeRolesGameOptions } from "../../../../../../../factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakePlayerEatenByWerewolvesAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeDogWolfAlivePlayer, createFakeSeerAlivePlayer, createFakeStutteringJudgeAlivePlayer, createFakeVileFatherOfWolvesAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer, createFakeWildChildAlivePlayer, createFakeWitchAlivePlayer } from "../../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers, createFakePlayer } from "../../../../../../../factories/game/schemas/player/player.schema.factory";

jest.mock("../../../../../../../../src/shared/exception/types/bad-game-play-payload-exception.type");

describe("Game Plays Validator Service", () => {
  let service: GamePlaysValidatorService;

  const gameRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
  };

  const gameHistoryRecordRepositoryMock = {
    find: jest.fn(),
    create: jest.fn(),
  };

  const gameHistoryRecordServiceMock = { getGameHistoryRecordsByGameId: jest.fn() };

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamePlaysValidatorService,
        {
          provide: GameHistoryRecordService,
          useValue: gameHistoryRecordServiceMock,
        },
        {
          provide: GameRepository,
          useValue: gameRepositoryMock,
        },
        {
          provide: GameHistoryRecordRepository,
          useValue: gameHistoryRecordRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<GamePlaysValidatorService>(GamePlaysValidatorService);
  });

  describe("validateGamePlayWithRelationsDtoChosenCardData", () => {
    it("should do nothing when there's no upcoming play.", () => {
      const game = createFakeGame({ upcomingPlays: [] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();
      expect(() => service.validateGamePlayWithRelationsDtoChosenCardData(makeGamePlayWithRelationsDto, game)).not.toThrow();
    });

    it("should throw error when chosen card is not defined but expected.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_CARD, source: ROLE_NAMES.THIEF }] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();
      expect(() => service.validateGamePlayWithRelationsDtoChosenCardData(makeGamePlayWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`chosenCard` is required on this current game's state");
    });

    it("should do nothing when chosen card is not defined and not expected.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_SIDE, source: ROLE_NAMES.THIEF }] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();
      expect(() => service.validateGamePlayWithRelationsDtoChosenCardData(makeGamePlayWithRelationsDto, game)).not.toThrow();
    });

    it("should throw error when chosen card is defined but not expected.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_SIDE, source: ROLE_NAMES.THIEF }] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenCard: createFakeGameAdditionalCard() });
      expect(() => service.validateGamePlayWithRelationsDtoChosenCardData(makeGamePlayWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`chosenCard` can't be set on this current game's state");
    });

    it("should do nothing when chosen card is defined but expected.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_CARD, source: ROLE_NAMES.THIEF }] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenCard: createFakeGameAdditionalCard() });
      expect(() => service.validateGamePlayWithRelationsDtoChosenCardData(makeGamePlayWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateDrankLifePotionTargets", () => {
    it("should throw error when there are too much targets for life potion.", () => {
      const drankLifePotionTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.LIFE }),
      ];
      expect(() => service.validateDrankLifePotionTargets(drankLifePotionTargets)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("There are too much targets which drank life potion (`targets.drankPotion`)");
    });

    it("should throw error when life potion target is not alive.", () => {
      const targetedPlayer = createFakePlayer({ isAlive: false, attributes: [createFakePlayerEatenByWerewolvesAttribute()] });
      const drankLifePotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WITCH_POTIONS.LIFE })];
      expect(() => service.validateDrankLifePotionTargets(drankLifePotionTargets)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Life potion can't be applied to this target (`targets.drankPotion`)");
    });

    it("should throw error when life potion target is not eaten by werewolves.", () => {
      const targetedPlayer = createFakePlayer({ isAlive: true, attributes: [] });
      const drankLifePotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WITCH_POTIONS.LIFE })];
      expect(() => service.validateDrankLifePotionTargets(drankLifePotionTargets)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Life potion can't be applied to this target (`targets.drankPotion`)");
    });

    it("should do nothing when there is no life potion target.", () => {
      expect(() => service.validateDrankLifePotionTargets([])).not.toThrow();
    });

    it("should do nothing when life potion target is applied on valid target.", () => {
      const targetedPlayer = createFakePlayer({ attributes: [createFakePlayerEatenByWerewolvesAttribute()], isAlive: true });
      const drankLifePotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WITCH_POTIONS.LIFE })];
      expect(() => service.validateDrankLifePotionTargets(drankLifePotionTargets)).not.toThrow();
    });
  });

  describe("validateDrankDeathPotionTargets", () => {
    it("should throw error when there are too much targets for death potion.", () => {
      const drankDeathPotionTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.DEATH }),
      ];
      expect(() => service.validateDrankDeathPotionTargets(drankDeathPotionTargets)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("There are too much targets which drank death potion (`targets.drankPotion`)");
    });

    it("should throw error when death potion target is not alive.", () => {
      const targetedPlayer = createFakePlayer({ isAlive: false });
      const drankDeathPotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WITCH_POTIONS.DEATH })];
      expect(() => service.validateDrankDeathPotionTargets(drankDeathPotionTargets)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Death potion can't be applied to this target (`targets.drankPotion`)");
    });

    it("should do nothing when there is no death potion target.", () => {
      expect(() => service.validateDrankDeathPotionTargets([])).not.toThrow();
    });

    it("should do nothing when death potion target is applied on valid target.", () => {
      const targetedPlayer = createFakePlayer({ isAlive: true });
      const drankDeathPotionTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer, drankPotion: WITCH_POTIONS.DEATH })];
      expect(() => service.validateDrankDeathPotionTargets(drankDeathPotionTargets)).not.toThrow();
    });
  });

  describe("validateGamePlayWitchTargets", () => {
    it("should do nothing when none drank potions and action is not USE_POTIONS.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_CARD, source: ROLE_NAMES.THIEF }] });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto(),
        createFakeMakeGamePlayTargetWithRelationsDto(),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];
      expect(() => service.validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto, game, [])).not.toThrow();
    });

    it("should throw error when expected action is not USE_POTIONS but targets drank potions.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_CARD, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];
      expect(() => service.validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto, game, [])).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`targets.drankPotion` can't be set on this current game's state");
    });

    it("should throw error when expected source is not WITCH but targets drank potions.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.THIEF }] });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];
      expect(() => service.validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto, game, [])).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`targets.drankPotion` can't be set on this current game's state");
    });

    it("should throw error when witch targeted someone with life potion but already used it with death potion before.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];
      const gameHistoryRecordTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.LIFE }),
      ];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) }),
      ];
      expect(() => service.validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`targets.drankPotion` can't be set on this current game's state");
    });

    it("should throw error when witch targeted someone with life potion but already used it alone before.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({}),
      ];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.LIFE })];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) }),
      ];
      expect(() => service.validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`targets.drankPotion` can't be set on this current game's state");
    });

    it("should throw error when witch targeted someone with death potion but already used it wit life potion before.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto(),
      ];
      const gameHistoryRecordTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.LIFE }),
      ];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) }),
      ];
      expect(() => service.validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`targets.drankPotion` can't be set on this current game's state");
    });

    it("should throw error when witch targeted someone with death potion but already used it alone before.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[1], drankPotion: WITCH_POTIONS.DEATH }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[2] }),
      ];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.DEATH })];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) }),
      ];
      expect(() => service.validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`targets.drankPotion` can't be set on this current game's state");
    });

    it("should call potions validators without players when called with valid data but no target.", () => {
      const validateDrankLifePotionTargetsSpy = jest.spyOn(service, "validateDrankLifePotionTargets").mockImplementation();
      const validateDrankDeathPotionTargetsSpy = jest.spyOn(service, "validateDrankDeathPotionTargets").mockImplementation();
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: [] }) })];
      expect(() => service.validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).not.toThrow();
      expect(validateDrankLifePotionTargetsSpy).toHaveBeenCalledWith([]);
      expect(validateDrankDeathPotionTargetsSpy).toHaveBeenCalledWith([]);
    });

    it("should call potions validators with players when called without bad data and without witch history.", () => {
      const validateDrankLifePotionTargetsSpy = jest.spyOn(service, "validateDrankLifePotionTargets").mockImplementation();
      const validateDrankDeathPotionTargetsSpy = jest.spyOn(service, "validateDrankDeathPotionTargets").mockImplementation();
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.LIFE }),
        createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.DEATH }),
      ];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: [] }) })];
      expect(() => service.validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).not.toThrow();
      expect(validateDrankLifePotionTargetsSpy).toHaveBeenCalledWith([makeGamePlayTargetsWithRelationsDto[0]]);
      expect(validateDrankDeathPotionTargetsSpy).toHaveBeenCalledWith([makeGamePlayTargetsWithRelationsDto[1]]);
    });

    it("should call potions validators with players when called for valid life potion data and some witch history.", () => {
      const validateDrankLifePotionTargetsSpy = jest.spyOn(service, "validateDrankLifePotionTargets").mockImplementation();
      const validateDrankDeathPotionTargetsSpy = jest.spyOn(service, "validateDrankDeathPotionTargets").mockImplementation();
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.LIFE })];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.DEATH })];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) })];
      expect(() => service.validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).not.toThrow();
      expect(validateDrankLifePotionTargetsSpy).toHaveBeenCalledWith([makeGamePlayTargetsWithRelationsDto[0]]);
      expect(validateDrankDeathPotionTargetsSpy).toHaveBeenCalledWith([]);
    });

    it("should call potions validators with players when called for valid death potion data and some witch history.", () => {
      const validateDrankLifePotionTargetsSpy = jest.spyOn(service, "validateDrankLifePotionTargets").mockImplementation();
      const validateDrankDeathPotionTargetsSpy = jest.spyOn(service, "validateDrankDeathPotionTargets").mockImplementation();
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.DEATH })];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ drankPotion: WITCH_POTIONS.LIFE })];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay({ targets: gameHistoryRecordTargets }) })];
      expect(() => service.validateGamePlayWitchTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).not.toThrow();
      expect(validateDrankLifePotionTargetsSpy).toHaveBeenCalledWith([]);
      expect(validateDrankDeathPotionTargetsSpy).toHaveBeenCalledWith([makeGamePlayTargetsWithRelationsDto[0]]);
    });
  });

  describe("validateGamePlayInfectedTargets", () => {
    it("should throw error when expected action is not EAT and some targets are infected.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ]);
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_CARD, source: PLAYER_GROUPS.WEREWOLVES }], players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true })];
      expect(() => service.validateGamePlayInfectedTargets(makeGamePlayTargetsWithRelationsDto, game, [])).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`targets.isInfected` can't be set on this current game's state");
    });

    it("should throw error when expected source is not WEREWOLVES and some targets are infected.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ]);
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.ALL }], players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true })];
      expect(() => service.validateGamePlayInfectedTargets(makeGamePlayTargetsWithRelationsDto, game, [])).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`targets.isInfected` can't be set on this current game's state");
    });

    it("should throw error when vile father of wolves is not in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ]);
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }], players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0], isInfected: true })];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true })];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: gameHistoryRecordTargets }) })];
      expect(() => service.validateGamePlayInfectedTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`targets.isInfected` can't be set on this current game's state");
    });

    it("should throw error when vile father of wolves is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }], players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0], isInfected: true })];
      const gameHistoryRecordTargets = [createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true })];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: gameHistoryRecordTargets }) })];
      expect(() => service.validateGamePlayInfectedTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`targets.isInfected` can't be set on this current game's state");
    });

    it("should throw error when vile father of wolves has already infected and some targets are infected.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ]);
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }], players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true })];
      const gameHistoryRecordTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true }),
        createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: false }),
      ];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWerewolvesEatPlay({ targets: gameHistoryRecordTargets }) })];
      expect(() => service.validateGamePlayInfectedTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`targets.isInfected` can't be set on this current game's state");
    });

    it("should do nothing when there is no infected target.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      expect(() => service.validateGamePlayInfectedTargets(makeGamePlayTargetsWithRelationsDto, game, [])).not.toThrow();
    });

    it("should do nothing when infected target data is valid.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeVileFatherOfWolvesAlivePlayer(),
      ]);
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }], players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0], isInfected: true })];
      expect(() => service.validateGamePlayInfectedTargets(makeGamePlayTargetsWithRelationsDto, game, [])).not.toThrow();
    });
  });

  describe("validateGamePlayWerewolvesTargets", () => {
    let validateGamePlayTargetsBoundariesMock: jest.SpyInstance;

    beforeEach(() => {
      validateGamePlayTargetsBoundariesMock = jest.spyOn(service, "validateGamePlayTargetsBoundaries").mockReturnValue();
    });

    it("should do nothing when game play action is not EAT.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: PLAYER_GROUPS.WEREWOLVES }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should throw error when source is WEREWOLVES and targeted player is dead.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      expect(() => service.validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Werewolves can't eat this target");
    });

    it("should throw error when source is WEREWOLVES and targeted player is from werewolves side.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      expect(() => service.validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Werewolves can't eat this target");
    });

    it("should throw error when source is BIG_BAD_WOLF and targeted player is dead.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: ROLE_NAMES.BIG_BAD_WOLF }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      expect(() => service.validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Big bad wolf can't eat this target");
    });

    it("should throw error when source is BIG_BAD_WOLF and targeted player is from werewolves side.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: ROLE_NAMES.BIG_BAD_WOLF }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      expect(() => service.validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Big bad wolf can't eat this target");
    });

    it("should throw error when source is BIG_BAD_WOLF and targeted player is already eaten.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: ROLE_NAMES.BIG_BAD_WOLF }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ attributes: [createFakePlayerEatenByWerewolvesAttribute()] }) })];
      expect(() => service.validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Big bad wolf can't eat this target");
    });

    it("should throw error when source is WHITE_WEREWOLF and targeted player is dead.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: ROLE_NAMES.WHITE_WEREWOLF }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer({ isAlive: false }) })];
      expect(() => service.validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("White werewolf can't eat this target");
    });

    it("should throw error when source is WHITE_WEREWOLF and targeted player is from villagers side.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: ROLE_NAMES.WHITE_WEREWOLF }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() })];
      expect(() => service.validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("White werewolf can't eat this target");
    });

    it("should throw error when source is WHITE_WEREWOLF and targeted player is white werewolf himself.", () => {
      const whiteWerewolfPlayer = createFakeWhiteWerewolfAlivePlayer();
      const players = bulkCreateFakePlayers(4, [whiteWerewolfPlayer]);
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: ROLE_NAMES.WHITE_WEREWOLF }], players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: whiteWerewolfPlayer })];
      expect(() => service.validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("White werewolf can't eat this target");
    });

    it("should do nothing when white werewolf eaten target is valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: ROLE_NAMES.WHITE_WEREWOLF }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      expect(() => service.validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when big bad wolf eaten target is valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: ROLE_NAMES.BIG_BAD_WOLF }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() })];
      expect(() => service.validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when werewolves eaten target is valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() })];
      expect(() => service.validateGamePlayWerewolvesTargets(makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayHunterTargets", () => {
    let validateGamePlayTargetsBoundariesMock: jest.SpyInstance;

    beforeEach(() => {
      validateGamePlayTargetsBoundariesMock = jest.spyOn(service, "validateGamePlayTargetsBoundaries").mockReturnValue();
    });

    it("should do nothing when game play action is not SHOOT.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.HUNTER }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayHunterTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should do nothing when game play source is not HUNTER.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.SHOOT, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayHunterTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should throw error when targeted player is dead.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.SHOOT, source: ROLE_NAMES.HUNTER }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      expect(() => service.validateGamePlayHunterTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Hunter can't shoot this target");
    });

    it("should do nothing when targeted player for hunter is valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.SHOOT, source: ROLE_NAMES.HUNTER }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() })];
      expect(() => service.validateGamePlayHunterTargets(makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayScapeGoatTargets", () => {
    let validateGamePlayTargetsBoundariesMock: jest.SpyInstance;

    beforeEach(() => {
      validateGamePlayTargetsBoundariesMock = jest.spyOn(service, "validateGamePlayTargetsBoundaries").mockReturnValue();
    });

    it("should do nothing when game play action is not BAN_VOTING.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.SCAPEGOAT }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayScapegoatTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should do nothing when game play source is not SCAPEGOAT.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.BAN_VOTING, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayScapegoatTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should throw error when one of the targeted player is dead.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.BAN_VOTING, source: ROLE_NAMES.SCAPEGOAT }] });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      expect(() => service.validateGamePlayScapegoatTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("At least one of the scapegoat targets can't be banned from voting");
    });

    it("should do nothing when all scapegoat's targets are valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.BAN_VOTING, source: ROLE_NAMES.SCAPEGOAT }] });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      expect(() => service.validateGamePlayScapegoatTargets(makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayCupidTargets", () => {
    let validateGamePlayTargetsBoundariesMock: jest.SpyInstance;

    beforeEach(() => {
      validateGamePlayTargetsBoundariesMock = jest.spyOn(service, "validateGamePlayTargetsBoundaries").mockReturnValue();
    });

    it("should do nothing when game play action is not CHARM.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.CUPID }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayCupidTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should do nothing when game play source is not CUPID.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHARM, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayCupidTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should throw error when one of the targeted player is dead.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHARM, source: ROLE_NAMES.CUPID }] });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) }),
      ];
      expect(() => service.validateGamePlayCupidTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("At least one of the cupid targets can't be charmed");
    });

    it("should do nothing when all cupid's targets are valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHARM, source: ROLE_NAMES.CUPID }] });
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
      ];
      expect(() => service.validateGamePlayCupidTargets(makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayFoxTargets", () => {
    let validateGamePlayTargetsBoundariesMock: jest.SpyInstance;

    beforeEach(() => {
      validateGamePlayTargetsBoundariesMock = jest.spyOn(service, "validateGamePlayTargetsBoundaries").mockReturnValue();
    });

    it("should do nothing when game play action is not SNIFF.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.FOX }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayFoxTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should do nothing when game play source is not FOX.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.SNIFF, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayFoxTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should throw error when targeted player is dead.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.SNIFF, source: ROLE_NAMES.FOX }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      expect(() => service.validateGamePlayFoxTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Fox can't sniff this target");
    });

    it("should do nothing when targeted player for fox is valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.SNIFF, source: ROLE_NAMES.FOX }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() })];
      expect(() => service.validateGamePlayFoxTargets(makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlaySeerTargets", () => {
    let validateGamePlayTargetsBoundariesMock: jest.SpyInstance;

    beforeEach(() => {
      validateGamePlayTargetsBoundariesMock = jest.spyOn(service, "validateGamePlayTargetsBoundaries").mockReturnValue();
    });

    it("should do nothing when game play action is not LOOK.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.SEER }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlaySeerTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should do nothing when game play source is not SEER.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.LOOK, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlaySeerTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should throw error when targeted player is dead.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.LOOK, source: ROLE_NAMES.SEER }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      expect(() => service.validateGamePlaySeerTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Seer can't look at this target");
    });

    it("should throw error when targeted player is seer herself.", () => {
      const seerPlayer = createFakeSeerAlivePlayer();
      const players = bulkCreateFakePlayers(4, [seerPlayer]);
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.LOOK, source: ROLE_NAMES.SEER }], players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: seerPlayer })];
      expect(() => service.validateGamePlaySeerTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Seer can't look at this target");
    });

    it("should do nothing when seer's targeted player is valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.LOOK, source: ROLE_NAMES.SEER }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      expect(() => service.validateGamePlaySeerTargets(makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayRavenTargets", () => {
    let validateGamePlayTargetsBoundariesMock: jest.SpyInstance;

    beforeEach(() => {
      validateGamePlayTargetsBoundariesMock = jest.spyOn(service, "validateGamePlayTargetsBoundaries").mockReturnValue();
    });

    it("should do nothing when game play action is not MARK.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.RAVEN }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayRavenTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should do nothing when game play source is not RAVEN.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.MARK, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayRavenTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should throw error when targeted player is dead.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.MARK, source: ROLE_NAMES.RAVEN }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      expect(() => service.validateGamePlayRavenTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Raven can't mark this target");
    });

    it("should do nothing when there are no targets.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.MARK, source: ROLE_NAMES.RAVEN }] });
      const makeGamePlayTargetsWithRelationsDto = [];
      expect(() => service.validateGamePlayRavenTargets(makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when raven's target is valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.MARK, source: ROLE_NAMES.RAVEN }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      expect(() => service.validateGamePlayRavenTargets(makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayWildChildTargets", () => {
    let validateGamePlayTargetsBoundariesMock: jest.SpyInstance;

    beforeEach(() => {
      validateGamePlayTargetsBoundariesMock = jest.spyOn(service, "validateGamePlayTargetsBoundaries").mockReturnValue();
    });

    it("should do nothing when game play action is not CHOOSE_MODEL.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.WILD_CHILD }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayWildChildTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should do nothing when game play source is not WILD_CHILD.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_MODEL, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayWildChildTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should throw error when targeted player is dead.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_MODEL, source: ROLE_NAMES.WILD_CHILD }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      expect(() => service.validateGamePlayWildChildTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Wild child can't choose this target as a model");
    });

    it("should throw error when targeted player is wild child himself.", () => {
      const wildChildPlayer = createFakeWildChildAlivePlayer();
      const players = bulkCreateFakePlayers(4, [wildChildPlayer]);
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_MODEL, source: ROLE_NAMES.WILD_CHILD }], players });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: wildChildPlayer })];
      expect(() => service.validateGamePlayWildChildTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Wild child can't choose this target as a model");
    });

    it("should do nothing when wild child's targeted player is valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_MODEL, source: ROLE_NAMES.WILD_CHILD }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() })];
      expect(() => service.validateGamePlayWildChildTargets(makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayPiedPiperTargets", () => {
    let validateGamePlayTargetsBoundariesMock: jest.SpyInstance;

    beforeEach(() => {
      validateGamePlayTargetsBoundariesMock = jest.spyOn(service, "validateGamePlayTargetsBoundaries").mockReturnValue();
    });

    it("should do nothing when game play action is not CHARM.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.PIED_PIPER }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayPiedPiperTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should do nothing when game play source is not PIED_PIPER.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHARM, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayPiedPiperTargets(makeGamePlayTargetsWithRelationsDto, game);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should throw error when one of the targeted player is not in the last to charm.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHARM, source: ROLE_NAMES.PIED_PIPER }] });
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
      expect(() => service.validateGamePlayPiedPiperTargets(makeGamePlayTargetsWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("At least one of the pied piper targets can't be charmed");
    });

    it("should do nothing when pied piper targets are valid and limited to game options.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ charmedPeopleCountPerNight: 2 }) }) });
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHARM, source: ROLE_NAMES.PIED_PIPER }], options });
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
      expect(() => service.validateGamePlayPiedPiperTargets(makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
      expect(validateGamePlayTargetsBoundariesMock).toHaveBeenCalledWith(makeGamePlayTargetsWithRelationsDto, { min: 2, max: 2 });
    });

    it("should do nothing when pied piper targets are valid and limited to left players to charm count.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ piedPiper: createFakePiedPiperGameOptions({ charmedPeopleCountPerNight: 5 }) }) });
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHARM, source: ROLE_NAMES.PIED_PIPER }], options });
      const leftToCharmPlayers = [createFakeWildChildAlivePlayer()];
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: leftToCharmPlayers[0] })];
      jest.spyOn(GameHelper, "getLeftToCharmByPiedPiperPlayers").mockReturnValue(leftToCharmPlayers);
      expect(() => service.validateGamePlayPiedPiperTargets(makeGamePlayTargetsWithRelationsDto, game)).not.toThrow();
      expect(validateGamePlayTargetsBoundariesMock).toHaveBeenCalledWith(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 1 });
    });
  });

  describe("validateGamePlayGuardTargets", () => {
    let validateGamePlayTargetsBoundariesMock: jest.SpyInstance;

    beforeEach(() => {
      validateGamePlayTargetsBoundariesMock = jest.spyOn(service, "validateGamePlayTargetsBoundaries").mockReturnValue();
    });

    it("should do nothing when game play action is not PROTECT.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.GUARD }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayGuardTargets(makeGamePlayTargetsWithRelationsDto, game, []);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should do nothing when game play source is not GUARD.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.PROTECT, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlayGuardTargets(makeGamePlayTargetsWithRelationsDto, game, []);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should throw error when targeted player is dead.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.PROTECT, source: ROLE_NAMES.GUARD }] });
      const targetedPlayer = createFakeVillagerAlivePlayer({ isAlive: false });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })];
      expect(() => service.validateGamePlayGuardTargets(makeGamePlayTargetsWithRelationsDto, game, [])).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Guard can't protect this target");
    });

    it("should throw error when targeted player is the same as previous guard play and game option doesn't allow this.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ guard: { canProtectTwice: false } }) });
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.PROTECT, source: ROLE_NAMES.GUARD }], options });
      const targetedPlayer = createFakeVillagerAlivePlayer();
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordGuardProtectPlay({ targets: [{ player: targetedPlayer }] }) }),
      ];
      expect(() => service.validateGamePlayGuardTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Guard can't protect this target");
    });

    it("should do nothing when targeted player is the same as previous guard play and game option allow this.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ guard: { canProtectTwice: true } }) });
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.PROTECT, source: ROLE_NAMES.GUARD }], options });
      const targetedPlayer = createFakeVillagerAlivePlayer();
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordGuardProtectPlay({ targets: [{ player: targetedPlayer }] }) }),
      ];
      expect(() => service.validateGamePlayGuardTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).not.toThrow();
    });

    it("should do nothing when targeted player is not the same as previous guard play.", () => {
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ guard: { canProtectTwice: false } }) });
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.PROTECT, source: ROLE_NAMES.GUARD }], options });
      const targetedPlayer = createFakeVillagerAlivePlayer();
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: targetedPlayer })];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordGuardProtectPlay({ targets: [{ player: createFakeSeerAlivePlayer() }] }) }),
      ];
      expect(() => service.validateGamePlayGuardTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).not.toThrow();
    });
  });

  describe("validateGamePlaySheriffTargets", () => {
    let validateGamePlayTargetsBoundariesMock: jest.SpyInstance;

    beforeEach(() => {
      validateGamePlayTargetsBoundariesMock = jest.spyOn(service, "validateGamePlayTargetsBoundaries").mockReturnValue();
    });

    it("should do nothing when there is no upcoming gameplay.", () => {
      const game = createFakeGame({ upcomingPlays: [] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlaySheriffTargets(makeGamePlayTargetsWithRelationsDto, game, []);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should do nothing when game play action is not DELEGATE nor SETTLE_VOTES.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: PLAYER_ATTRIBUTE_NAMES.SHERIFF }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlaySheriffTargets(makeGamePlayTargetsWithRelationsDto, game, []);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should do nothing when game play source is not SHERIFF.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.SETTLE_VOTES, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      service.validateGamePlaySheriffTargets(makeGamePlayTargetsWithRelationsDto, game, []);
      expect(validateGamePlayTargetsBoundariesMock).not.toHaveBeenCalledOnce();
    });

    it("should throw error when targeted player is dead and upcoming action is DELEGATE.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.DELEGATE, source: PLAYER_ATTRIBUTE_NAMES.SHERIFF }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      expect(() => service.validateGamePlaySheriffTargets(makeGamePlayTargetsWithRelationsDto, game, [])).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Sheriff can't delegate his role to this target");
    });

    it("should do nothing when targeted player for sheriff delegation is valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.DELEGATE, source: PLAYER_ATTRIBUTE_NAMES.SHERIFF }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() })];
      expect(() => service.validateGamePlaySheriffTargets(makeGamePlayTargetsWithRelationsDto, game, [])).not.toThrow();
    });

    it("should throw error when targeted player is not in last tie in votes and upcoming action is SETTLE_VOTES.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.SETTLE_VOTES, source: PLAYER_ATTRIBUTE_NAMES.SHERIFF }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer({ isAlive: false }) })];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay({ votingResult: GAME_HISTORY_RECORD_VOTING_RESULTS.TIE, targets: [{ player: createFakeSeerAlivePlayer() }] }) }),
      ];
      expect(() => service.validateGamePlaySheriffTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Sheriff can't break the tie in votes with this target");
    });

    it("should do nothing when targeted player for sheriff settling votes is valid.", () => {
      const game = createFakeGame({ players: bulkCreateFakePlayers(4), upcomingPlays: [{ action: GAME_PLAY_ACTIONS.SETTLE_VOTES, source: PLAYER_ATTRIBUTE_NAMES.SHERIFF }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0] })];
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordWitchUsePotionsPlay() }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay({ votingResult: GAME_HISTORY_RECORD_VOTING_RESULTS.TIE, targets: [{ player: game.players[0] }] }) }),
      ];
      expect(() => service.validateGamePlaySheriffTargets(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).not.toThrow();
    });
  });

  describe("validateGamePlayTargetsBoundaries", () => {
    it("should throw error when min boundary is not respected.", () => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      expect(() => service.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 4, max: 4 })).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("There are too less targets for this current game's state");
    });

    it("should throw error when max boundary is not respected.", () => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      expect(() => service.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 2, max: 2 })).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("There are too much targets for this current game's state");
    });

    it("should do nothing when boundaries are respected, even equal to max.", () => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      expect(() => service.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 1, max: 3 })).not.toThrow();
    });

    it("should do nothing when boundaries are respected, even equal to min.", () => {
      const makeGamePlayTargetsWithRelationsDto = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeSeerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeVillagerAlivePlayer() }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: createFakeWerewolfAlivePlayer() }),
      ];
      expect(() => service.validateGamePlayTargetsBoundaries(makeGamePlayTargetsWithRelationsDto, { min: 3, max: 4 })).not.toThrow();
    });
  });

  describe("validateGamePlayRoleTargets", () => {
    it("should call targets validators when called.", () => {
      const validateGamePlaySheriffTargetsMock = jest.spyOn(service, "validateGamePlaySheriffTargets").mockImplementation();
      const validateGamePlayGuardTargetsMock = jest.spyOn(service, "validateGamePlayGuardTargets").mockImplementation();
      const validateGamePlayPiedPiperTargetsMock = jest.spyOn(service, "validateGamePlayPiedPiperTargets").mockImplementation();
      const validateGamePlayWildChildTargetsMock = jest.spyOn(service, "validateGamePlayWildChildTargets").mockImplementation();
      const validateGamePlayRavenTargetsMock = jest.spyOn(service, "validateGamePlayRavenTargets").mockImplementation();
      const validateGamePlaySeerTargetsMock = jest.spyOn(service, "validateGamePlaySeerTargets").mockImplementation();
      const validateGamePlayFoxTargetsMock = jest.spyOn(service, "validateGamePlayFoxTargets").mockImplementation();
      const validateGamePlayCupidTargetsMock = jest.spyOn(service, "validateGamePlayCupidTargets").mockImplementation();
      const validateGamePlayScapegoatTargetsMock = jest.spyOn(service, "validateGamePlayScapegoatTargets").mockImplementation();
      const validateGamePlayHunterTargetsMock = jest.spyOn(service, "validateGamePlayHunterTargets").mockImplementation();
      const validateGamePlayWerewolvesTargetsMock = jest.spyOn(service, "validateGamePlayWerewolvesTargets").mockImplementation();
      const validateGamePlayInfectedTargetsMock = jest.spyOn(service, "validateGamePlayInfectedTargets").mockImplementation();
      const validateGamePlayWitchTargetsMock = jest.spyOn(service, "validateGamePlayWitchTargets").mockImplementation();
      const game = createFakeGame();
      service.validateGamePlayRoleTargets([], game, []);
      expect(validateGamePlaySheriffTargetsMock).toHaveBeenCalledOnce();
      expect(validateGamePlaySheriffTargetsMock).toHaveBeenCalledOnce();
      expect(validateGamePlayGuardTargetsMock).toHaveBeenCalledOnce();
      expect(validateGamePlayPiedPiperTargetsMock).toHaveBeenCalledOnce();
      expect(validateGamePlayWildChildTargetsMock).toHaveBeenCalledOnce();
      expect(validateGamePlayRavenTargetsMock).toHaveBeenCalledOnce();
      expect(validateGamePlaySeerTargetsMock).toHaveBeenCalledOnce();
      expect(validateGamePlayFoxTargetsMock).toHaveBeenCalledOnce();
      expect(validateGamePlayCupidTargetsMock).toHaveBeenCalledOnce();
      expect(validateGamePlayScapegoatTargetsMock).toHaveBeenCalledOnce();
      expect(validateGamePlayHunterTargetsMock).toHaveBeenCalledOnce();
      expect(validateGamePlayWerewolvesTargetsMock).toHaveBeenCalledOnce();
      expect(validateGamePlayInfectedTargetsMock).toHaveBeenCalledOnce();
      expect(validateGamePlayWitchTargetsMock).toHaveBeenCalledOnce();
    });
  });

  describe("validateGamePlayTargetsWithRelationsDtoData", () => {
    let validateGamePlayInfectedTargetsSpy: jest.SpyInstance;
    let validateGamePlayWitchTargetsSpy: jest.SpyInstance;
    let validateGamePlayRoleTargetsSpy: jest.SpyInstance;

    beforeEach(() => {
      validateGamePlayInfectedTargetsSpy = jest.spyOn(service, "validateGamePlayInfectedTargets").mockImplementation();
      validateGamePlayWitchTargetsSpy = jest.spyOn(service, "validateGamePlayWitchTargets").mockImplementation();
      validateGamePlayRoleTargetsSpy = jest.spyOn(service, "validateGamePlayRoleTargets").mockImplementation();
    });

    it("should do nothing when there is no upcoming action.", () => {
      const game = createFakeGame({ upcomingPlays: [] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto({ isInfected: true })];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoData(makeGamePlayTargetsWithRelationsDto, game, [])).not.toThrow();
      expect(validateGamePlayInfectedTargetsSpy).not.toHaveBeenCalled();
      expect(validateGamePlayWitchTargetsSpy).not.toHaveBeenCalled();
    });

    it("should do nothing when there are no targets defined and upcoming action doesn't require targets anyway.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      expect(() => service.validateGamePlayTargetsWithRelationsDtoData(undefined, game, [])).not.toThrow();
      expect(validateGamePlayInfectedTargetsSpy).not.toHaveBeenCalled();
      expect(validateGamePlayWitchTargetsSpy).not.toHaveBeenCalled();
    });

    it("should do nothing when there are no targets (empty array) and upcoming action doesn't require targets anyway.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      expect(() => service.validateGamePlayTargetsWithRelationsDtoData([], game, [])).not.toThrow();
      expect(validateGamePlayInfectedTargetsSpy).not.toHaveBeenCalled();
      expect(validateGamePlayWitchTargetsSpy).not.toHaveBeenCalled();
    });

    it("should throw error when there is no targets but they are required.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.LOOK, source: ROLE_NAMES.SEER }] });
      expect(() => service.validateGamePlayTargetsWithRelationsDtoData([], game, [])).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`targets` is required on this current game's state");
    });

    it("should throw error when there are targets but they are not expected.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoData(makeGamePlayTargetsWithRelationsDto, game, [])).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`targets` can't be set on this current game's state");
    });

    it("should call targets validators when targets data is valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }] });
      const makeGamePlayTargetsWithRelationsDto = [createFakeMakeGamePlayTargetWithRelationsDto()];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoData(makeGamePlayTargetsWithRelationsDto, game, [])).not.toThrow();
      expect(validateGamePlayRoleTargetsSpy).toHaveBeenCalledOnce();
    });
  });

  describe("validateGamePlayVotesWithRelationsDtoData", () => {
    it("should do nothing when there is no upcoming action.", () => {
      const game = createFakeGame({ upcomingPlays: [] });
      const makeGamePlayVotesWithRelationsDto = [createFakeMakeGamePlayVoteWithRelationsDto()];
      expect(() => service.validateGamePlayVotesWithRelationsDtoData(makeGamePlayVotesWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when there are no votes defined and upcoming action doesn't require votes anyway.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }] });
      expect(() => service.validateGamePlayVotesWithRelationsDtoData(undefined, game)).not.toThrow();
    });

    it("should do nothing when there are no votes (empty array) and upcoming action doesn't require votes anyway.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }] });
      expect(() => service.validateGamePlayVotesWithRelationsDtoData([], game)).not.toThrow();
    });

    it("should throw error when there is no votes but they are required.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      expect(() => service.validateGamePlayVotesWithRelationsDtoData([], game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`votes` is required on this current game's state");
    });

    it("should throw error when there are votes but they are expected.", () => {
      const game = createFakeGame({ players: bulkCreateFakePlayers(4), upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }] });
      const makeGamePlayVotesWithRelationsDto = [createFakeMakeGamePlayVoteWithRelationsDto()];
      expect(() => service.validateGamePlayVotesWithRelationsDtoData(makeGamePlayVotesWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`votes` can't be set on this current game's state");
    });

    it("should throw error when there are votes with the same source and target.", () => {
      const game = createFakeGame({ players: bulkCreateFakePlayers(4), upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      const makeGamePlayVotesWithRelationsDto = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: game.players[0], target: game.players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: game.players[2], target: game.players[1] }),
      ];
      expect(() => service.validateGamePlayVotesWithRelationsDtoData(makeGamePlayVotesWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("One vote has the same source and target");
    });

    it("should do nothing when votes are valid.", () => {
      const game = createFakeGame({ players: bulkCreateFakePlayers(4), upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      const makeGamePlayVotesWithRelationsDto = [createFakeMakeGamePlayVoteWithRelationsDto({ source: game.players[0], target: game.players[1] })];
      expect(() => service.validateGamePlayVotesWithRelationsDtoData(makeGamePlayVotesWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayWithRelationsDtoChosenSideData", () => {
    it("should throw error when chosenSide is not defined and game play action is CHOOSE_SIDE.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_SIDE, source: ROLE_NAMES.DOG_WOLF }] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();
      expect(() => service.validateGamePlayWithRelationsDtoChosenSideData(makeGamePlayWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`chosenSide` is required on this current game's state");
    });

    it("should throw error when chosenSide is defined and game play action is not CHOOSE_SIDE.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenSide: ROLE_SIDES.WEREWOLVES });
      expect(() => service.validateGamePlayWithRelationsDtoChosenSideData(makeGamePlayWithRelationsDto, game)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`chosenSide` can't be set on this current game's state");
    });

    it("should do nothing when chosenSide is not defined and game play action is not CHOOSE_SIDE.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();
      expect(() => service.validateGamePlayWithRelationsDtoChosenSideData(makeGamePlayWithRelationsDto, game)).not.toThrow();
    });

    it("should do nothing when chosenSide is defined and game play action is CHOOSE_SIDE.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_SIDE, source: ROLE_NAMES.DOG_WOLF }] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenSide: ROLE_SIDES.WEREWOLVES });
      expect(() => service.validateGamePlayWithRelationsDtoChosenSideData(makeGamePlayWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateGamePlayWithRelationsDtoJudgeRequestData", () => {
    it("should do nothing when there is no upcoming game play action.", () => {
      const game = createFakeGame({ upcomingPlays: [] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      expect(() => service.validateGamePlayWithRelationsDtoJudgeRequestData(makeGamePlayWithRelationsDto, game, [])).not.toThrow();
    });

    it("should do nothing when doesJudgeRequestAnotherVote is undefined.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();
      expect(() => service.validateGamePlayWithRelationsDtoJudgeRequestData(makeGamePlayWithRelationsDto, game, [])).not.toThrow();
    });

    it("should throw error when judge request another vote but upcoming action is not vote.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      expect(() => service.validateGamePlayWithRelationsDtoJudgeRequestData(makeGamePlayWithRelationsDto, game, [])).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`doesJudgeRequestAnotherVote` can't be set on this current game's state");
    });

    it("should throw error when judge request another vote but there is no judge in the game.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ]);
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }], players });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      expect(() => service.validateGamePlayWithRelationsDtoJudgeRequestData(makeGamePlayWithRelationsDto, game, [])).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`doesJudgeRequestAnotherVote` can't be set on this current game's state");
    });

    it("should throw error when judge request another vote but he is dead.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeStutteringJudgeAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }], players });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      expect(() => service.validateGamePlayWithRelationsDtoJudgeRequestData(makeGamePlayWithRelationsDto, game, [])).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`doesJudgeRequestAnotherVote` can't be set on this current game's state");
    });

    it("should throw error when judge request another vote but he has reach the request limit.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeStutteringJudgeAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ stutteringJudge: { voteRequestsCount: 2 } }) });
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }], players, options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay({ didJudgeRequestAnotherVote: true }) }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay({ didJudgeRequestAnotherVote: true }) }),
      ];
      expect(() => service.validateGamePlayWithRelationsDtoJudgeRequestData(makeGamePlayWithRelationsDto, game, gameHistoryRecords)).toThrow(BadGamePlayPayloadException);
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("`doesJudgeRequestAnotherVote` can't be set on this current game's state");
    });

    it("should do nothing when judge request another vote and he can.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWitchAlivePlayer(),
        createFakeDogWolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeStutteringJudgeAlivePlayer(),
      ]);
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ stutteringJudge: { voteRequestsCount: 2 } }) });
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }], players, options });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      const gameHistoryRecords = [
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay({ didJudgeRequestAnotherVote: false }) }),
        createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordAllVotePlay({ didJudgeRequestAnotherVote: true }) }),
      ];
      expect(() => service.validateGamePlayWithRelationsDtoJudgeRequestData(makeGamePlayWithRelationsDto, game, gameHistoryRecords)).not.toThrow();
    });
  });

  describe("validateGamePlayWithRelationsDtoData", () => {
    let validateGamePlayWithRelationsDtoJudgeRequestDataSpy: jest.SpyInstance;
    let validateGamePlayWithRelationsDtoChosenSideDataSpy: jest.SpyInstance;
    let validateGamePlayVotesWithRelationsDtoDataSpy: jest.SpyInstance;
    let validateGamePlayTargetsWithRelationsDtoDataSpy: jest.SpyInstance;
    let validateGamePlayWithRelationsDtoChosenCardDataSpy: jest.SpyInstance;

    beforeEach(() => {
      validateGamePlayWithRelationsDtoJudgeRequestDataSpy = jest.spyOn(service, "validateGamePlayWithRelationsDtoJudgeRequestData").mockImplementation();
      validateGamePlayWithRelationsDtoChosenSideDataSpy = jest.spyOn(service, "validateGamePlayWithRelationsDtoChosenSideData").mockImplementation();
      validateGamePlayVotesWithRelationsDtoDataSpy = jest.spyOn(service, "validateGamePlayVotesWithRelationsDtoData").mockImplementation();
      validateGamePlayTargetsWithRelationsDtoDataSpy = jest.spyOn(service, "validateGamePlayTargetsWithRelationsDtoData").mockImplementation();
      validateGamePlayWithRelationsDtoChosenCardDataSpy = jest.spyOn(service, "validateGamePlayWithRelationsDtoChosenCardData").mockImplementation();
      gameHistoryRecordServiceMock.getGameHistoryRecordsByGameId.mockResolvedValue([]);
    });

    it("should throw error when there is no upcoming game play action.", async() => {
      const game = createFakeGame({ upcomingPlays: [] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      await expect(service.validateGamePlayWithRelationsDtoData(makeGamePlayWithRelationsDto, game)).toReject();
      expect(BadGamePlayPayloadException).toHaveBeenCalledWith("Game doesn't have upcoming plays");
    });

    it("should call validators when called.", async() => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ doesJudgeRequestAnotherVote: true });
      await service.validateGamePlayWithRelationsDtoData(makeGamePlayWithRelationsDto, game);
      expect(validateGamePlayWithRelationsDtoJudgeRequestDataSpy).toHaveBeenCalledOnce();
      expect(validateGamePlayWithRelationsDtoChosenSideDataSpy).toHaveBeenCalledOnce();
      expect(validateGamePlayVotesWithRelationsDtoDataSpy).toHaveBeenCalledOnce();
      expect(validateGamePlayTargetsWithRelationsDtoDataSpy).toHaveBeenCalledOnce();
      expect(validateGamePlayWithRelationsDtoChosenCardDataSpy).toHaveBeenCalledOnce();
    });
  });
});