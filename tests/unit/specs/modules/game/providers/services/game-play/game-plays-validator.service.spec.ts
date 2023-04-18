import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { MakeGamePlayTargetWithRelationsDto } from "../../../../../../../../src/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import type { MakeGamePlayVoteWithRelationsDto } from "../../../../../../../../src/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import { GAME_PLAY_ACTIONS, WITCH_POTIONS } from "../../../../../../../../src/modules/game/enums/game-play.enum";
import { PLAYER_GROUPS } from "../../../../../../../../src/modules/game/enums/player.enum";
import { GameHistoryRecordRepository } from "../../../../../../../../src/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "../../../../../../../../src/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "../../../../../../../../src/modules/game/providers/services/game-history/game-history-record.service";
import { GamePlaysValidatorService } from "../../../../../../../../src/modules/game/providers/services/game-play/game-plays-validator.service";
import { ROLE_NAMES } from "../../../../../../../../src/modules/role/enums/role.enum";
import { createFakeMakeGamePlayWithRelationsDto } from "../../../../../../../factories/game/dto/make-game-play/make-game-play-with-relations.dto.factory";
import { createFakeGameAdditionalCard } from "../../../../../../../factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGameHistoryRecord, createFakeGameHistoryRecordUseEatPlay, createFakeGameHistoryRecordUsePotionsPlay } from "../../../../../../../factories/game/schemas/game-history-record/game-history-record.schema.factory";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakePlayerEatenAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeWitchPlayer } from "../../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "../../../../../../../factories/game/schemas/player/player.schema.factory";

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

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamePlaysValidatorService,
        GameHistoryRecordService,
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
      expect(() => service.validateGamePlayWithRelationsDtoChosenCardData(makeGamePlayWithRelationsDto, game)).toThrow("Bad game play payload : `chosenCard` is required on this current game's state");
    });

    it("should do nothing when chosen card is not defined and not expected.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_SIDE, source: ROLE_NAMES.THIEF }] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto();
      expect(() => service.validateGamePlayWithRelationsDtoChosenCardData(makeGamePlayWithRelationsDto, game)).not.toThrow();
    });

    it("should throw error when chosen card is defined but not expected.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_SIDE, source: ROLE_NAMES.THIEF }] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenCard: createFakeGameAdditionalCard() });
      expect(() => service.validateGamePlayWithRelationsDtoChosenCardData(makeGamePlayWithRelationsDto, game)).toThrow("Bad game play payload : `chosenCard` can't be set on this current game's state");
    });

    it("should do nothing when chosen card is defined but expected.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_CARD, source: ROLE_NAMES.THIEF }] });
      const makeGamePlayWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({ chosenCard: createFakeGameAdditionalCard() });
      expect(() => service.validateGamePlayWithRelationsDtoChosenCardData(makeGamePlayWithRelationsDto, game)).not.toThrow();
    });
  });

  describe("validateDrankLifePotionTargets", () => {
    it("should throw error when there are too much targets for life potion.", () => {
      const drankLifePotionTargets: MakeGamePlayTargetWithRelationsDto[] = [
        { player: createFakePlayer(), drankPotion: WITCH_POTIONS.LIFE },
        { player: createFakePlayer(), drankPotion: WITCH_POTIONS.LIFE },
      ];
      expect(() => service.validateDrankLifePotionTargets(drankLifePotionTargets)).toThrow("Bad game play payload : There are too much targets which drank life potion (`targets.drankPotion`)");
    });

    it("should throw error when life potion target is not alive.", () => {
      const drankLifePotionTargets: MakeGamePlayTargetWithRelationsDto[] = [{ player: createFakePlayer({ isAlive: false, attributes: [createFakePlayerEatenAttribute()] }), drankPotion: WITCH_POTIONS.LIFE }];
      expect(() => service.validateDrankLifePotionTargets(drankLifePotionTargets)).toThrow("Bad game play payload : Life potion can't be applied to this target (`targets.drankPotion`)");
    });

    it("should throw error when life potion target is not eaten by werewolves.", () => {
      const drankLifePotionTargets: MakeGamePlayTargetWithRelationsDto[] = [{ player: createFakePlayer({ isAlive: true, attributes: [] }), drankPotion: WITCH_POTIONS.LIFE }];
      expect(() => service.validateDrankLifePotionTargets(drankLifePotionTargets)).toThrow("Bad game play payload : Life potion can't be applied to this target (`targets.drankPotion`)");
    });

    it("should do nothing when there is no life potion target.", () => {
      expect(() => service.validateDrankLifePotionTargets([])).not.toThrow();
    });

    it("should do nothing when life potion target is applied on valid target.", () => {
      const drankLifePotionTargets: MakeGamePlayTargetWithRelationsDto[] = [{ player: createFakePlayer({ attributes: [createFakePlayerEatenAttribute()], isAlive: true }), drankPotion: WITCH_POTIONS.LIFE }];
      expect(() => service.validateDrankLifePotionTargets(drankLifePotionTargets)).not.toThrow();
    });
  });

  describe("validateDrankDeathPotionTargets", () => {
    it("should throw error when there are too much targets for death potion.", () => {
      const drankDeathPotionTargets: MakeGamePlayTargetWithRelationsDto[] = [
        { player: createFakePlayer(), drankPotion: WITCH_POTIONS.DEATH },
        { player: createFakePlayer(), drankPotion: WITCH_POTIONS.DEATH },
      ];
      expect(() => service.validateDrankDeathPotionTargets(drankDeathPotionTargets)).toThrow("Bad game play payload : There are too much targets which drank death potion (`targets.drankPotion`)");
    });

    it("should throw error when death potion target is not alive.", () => {
      const drankDeathPotionTargets: MakeGamePlayTargetWithRelationsDto[] = [{ player: createFakePlayer({ isAlive: false }), drankPotion: WITCH_POTIONS.DEATH }];
      expect(() => service.validateDrankDeathPotionTargets(drankDeathPotionTargets)).toThrow("Bad game play payload : Death potion can't be applied to this target (`targets.drankPotion`)");
    });

    it("should do nothing when there is no death potion target.", () => {
      expect(() => service.validateDrankDeathPotionTargets([])).not.toThrow();
    });

    it("should do nothing when death potion target is applied on valid target.", () => {
      const drankDeathPotionTargets: MakeGamePlayTargetWithRelationsDto[] = [{ player: createFakePlayer({ isAlive: true }), drankPotion: WITCH_POTIONS.DEATH }];
      expect(() => service.validateDrankDeathPotionTargets(drankDeathPotionTargets)).not.toThrow();
    });
  });
  
  describe("validateGamePlayTargetsWithRelationsDtoDrankPotionData", () => {
    it("should throw error when expected action is not USE_POTIONS but targets drank potions.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_CARD, source: ROLE_NAMES.THIEF }] });
      const makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] = [
        { player: game.players[0], drankPotion: WITCH_POTIONS.LIFE },
        { player: game.players[1], drankPotion: WITCH_POTIONS.DEATH },
      ];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoDrankPotionData(makeGamePlayTargetsWithRelationsDto, game, [])).toThrow("Bad game play payload : `targets.drankPotion` can't be set on this current game's state");
    });
    
    it("should throw error when which targeted someone with life potion but already used it.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] = [
        { player: game.players[0], drankPotion: WITCH_POTIONS.LIFE },
        { player: game.players[1], drankPotion: WITCH_POTIONS.DEATH },
      ];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordUsePotionsPlay({ targets: [{ player: game.players[0], drankPotion: WITCH_POTIONS.LIFE }] }) })];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoDrankPotionData(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).toThrow("Bad game play payload : `targets.drankPotion` can't be set on this current game's state");
    });

    it("should throw error when which targeted someone with death potion but already used it.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] = [
        { player: game.players[0], drankPotion: WITCH_POTIONS.LIFE },
        { player: game.players[1], drankPotion: WITCH_POTIONS.DEATH },
      ];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordUsePotionsPlay({ targets: [{ player: game.players[0], drankPotion: WITCH_POTIONS.DEATH }] }) })];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoDrankPotionData(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).toThrow("Bad game play payload : `targets.drankPotion` can't be set on this current game's state");
    });

    it("should call potions validators without players when called without bad data but no target.", () => {
      const validateDrankLifePotionTargetsSpy = jest.spyOn(service, "validateDrankLifePotionTargets").mockImplementation();
      const validateDrankDeathPotionTargetsSpy = jest.spyOn(service, "validateDrankDeathPotionTargets").mockImplementation();
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] = [];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordUsePotionsPlay({ targets: [] }) })];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoDrankPotionData(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).not.toThrow();
      expect(validateDrankLifePotionTargetsSpy).toHaveBeenCalledWith([]);
      expect(validateDrankDeathPotionTargetsSpy).toHaveBeenCalledWith([]);
    });

    it("should call potions validators with players when called without bad data.", () => {
      const validateDrankLifePotionTargetsSpy = jest.spyOn(service, "validateDrankLifePotionTargets").mockImplementation();
      const validateDrankDeathPotionTargetsSpy = jest.spyOn(service, "validateDrankDeathPotionTargets").mockImplementation();
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.USE_POTIONS, source: ROLE_NAMES.WITCH }] });
      const makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] = [
        { player: game.players[0], drankPotion: WITCH_POTIONS.LIFE },
        { player: game.players[1], drankPotion: WITCH_POTIONS.DEATH },
      ];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordUsePotionsPlay({ targets: [] }) })];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoDrankPotionData(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).not.toThrow();
      expect(validateDrankLifePotionTargetsSpy).toHaveBeenCalledWith([makeGamePlayTargetsWithRelationsDto[0]]);
      expect(validateDrankDeathPotionTargetsSpy).toHaveBeenCalledWith([makeGamePlayTargetsWithRelationsDto[1]]);
    });
  });

  describe("validateGamePlayTargetsWithRelationsDtoIsInfectedData", () => {
    it("should throw error when expected action is not EAT and some targets are infected.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.CHOOSE_CARD, source: ROLE_NAMES.THIEF }] });
      const makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] = [{ player: game.players[0], isInfected: true }];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoIsInfectedData(makeGamePlayTargetsWithRelationsDto, game, [])).toThrow("Bad game play payload : `targets.isInfected` can't be set on this current game's state");
    });

    it("should throw error when vile father of wolves has already infected and some targets are infected.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }] });
      const makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] = [{ player: game.players[0], isInfected: true }];
      const gameHistoryRecords = [createFakeGameHistoryRecord({ play: createFakeGameHistoryRecordUseEatPlay({ targets: [{ player: createFakeWitchPlayer(), isInfected: true }] }) })];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoIsInfectedData(makeGamePlayTargetsWithRelationsDto, game, gameHistoryRecords)).toThrow("Bad game play payload : `targets.isInfected` can't be set on this current game's state");
    });
      
    it("should throw error when multiple targets are infected.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }] });
      const makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] = [
        { player: game.players[0], isInfected: true },
        { player: game.players[1], isInfected: true },
      ];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoIsInfectedData(makeGamePlayTargetsWithRelationsDto, game, [])).toThrow("Bad game play payload : There are too much infected targets (`targets.isInfected`)");
    });
      
    it("should do nothing when there is no infected target.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }] });
      const makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] = [{ player: game.players[0] }];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoIsInfectedData(makeGamePlayTargetsWithRelationsDto, game, [])).not.toThrow();
    });

    it("should do nothing when infected target data is valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }] });
      const makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] = [{ player: game.players[0], isInfected: true }];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoIsInfectedData(makeGamePlayTargetsWithRelationsDto, game, [])).not.toThrow();
    });
  });

  describe("validateGamePlayTargetsWithRelationsDtoData", () => {
    let validateGamePlayTargetsWithRelationsDtoDataSpy: jest.SpyInstance;
    let validateGamePlayTargetsWithRelationsDtoDrankPotionDataSpy: jest.SpyInstance;
        
    beforeEach(() => {
      validateGamePlayTargetsWithRelationsDtoDataSpy = jest.spyOn(service, "validateGamePlayTargetsWithRelationsDtoIsInfectedData").mockImplementation();
      validateGamePlayTargetsWithRelationsDtoDrankPotionDataSpy = jest.spyOn(service, "validateGamePlayTargetsWithRelationsDtoDrankPotionData").mockImplementation();
    });
        
    it("should do nothing when there is no upcoming action.", () => {
      const game = createFakeGame({ upcomingPlays: [] });
      const makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] = [{ player: game.players[0], isInfected: true }];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoData(makeGamePlayTargetsWithRelationsDto, game, [])).not.toThrow();
      expect(validateGamePlayTargetsWithRelationsDtoDataSpy).not.toHaveBeenCalled();
      expect(validateGamePlayTargetsWithRelationsDtoDrankPotionDataSpy).not.toHaveBeenCalled();
    });
  
    it("should do nothing when there are no targets defined and upcoming action doesn't require targets anyway.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      expect(() => service.validateGamePlayTargetsWithRelationsDtoData(undefined, game, [])).not.toThrow();
      expect(validateGamePlayTargetsWithRelationsDtoDataSpy).not.toHaveBeenCalled();
      expect(validateGamePlayTargetsWithRelationsDtoDrankPotionDataSpy).not.toHaveBeenCalled();
    });
  
    it("should do nothing when there are no targets (empty array) and upcoming action doesn't require targets anyway.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      expect(() => service.validateGamePlayTargetsWithRelationsDtoData([], game, [])).not.toThrow();
      expect(validateGamePlayTargetsWithRelationsDtoDataSpy).not.toHaveBeenCalled();
      expect(validateGamePlayTargetsWithRelationsDtoDrankPotionDataSpy).not.toHaveBeenCalled();
    });
  
    it("should throw error when there is no targets but they are required.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }] });
      expect(() => service.validateGamePlayTargetsWithRelationsDtoData([], game, [])).toThrow("Bad game play payload : `targets` is required on this current game's state");
    });
  
    it("should throw error when there are targets but they are not expected.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      const makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] = [{ player: game.players[0] }];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoData(makeGamePlayTargetsWithRelationsDto, game, [])).toThrow("Bad game play payload : `targets` can't be set on this current game's state");
    });
  
    it("should call targets validators when targets data is valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }] });
      const makeGamePlayTargetsWithRelationsDto: MakeGamePlayTargetWithRelationsDto[] = [{ player: game.players[0] }];
      expect(() => service.validateGamePlayTargetsWithRelationsDtoData(makeGamePlayTargetsWithRelationsDto, game, [])).not.toThrow();
      expect(validateGamePlayTargetsWithRelationsDtoDataSpy).toHaveBeenCalledOnce();
      expect(validateGamePlayTargetsWithRelationsDtoDrankPotionDataSpy).toHaveBeenCalledOnce();
    });
  });

  describe("validateGamePlayVotesWithRelationsDtoData", () => {
    it("should do nothing when there is no upcoming action.", () => {
      const game = createFakeGame({ upcomingPlays: [] });
      const makeGamePlayVotesWithRelationsDto: MakeGamePlayVoteWithRelationsDto[] = [{ source: game.players[0], target: game.players[1] }];
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
      expect(() => service.validateGamePlayVotesWithRelationsDtoData([], game)).toThrow("Bad game play payload : `votes` is required on this current game's state");
    });

    it("should throw error when there are votes but they are expected.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.EAT, source: PLAYER_GROUPS.WEREWOLVES }] });
      const makeGamePlayVotesWithRelationsDto: MakeGamePlayVoteWithRelationsDto[] = [{ source: game.players[0], target: game.players[1] }];
      expect(() => service.validateGamePlayVotesWithRelationsDtoData(makeGamePlayVotesWithRelationsDto, game)).toThrow("Bad game play payload : `votes` can't be set on this current game's state");
    });

    it("should throw error when there are votes with the same source and target.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      const makeGamePlayVotesWithRelationsDto: MakeGamePlayVoteWithRelationsDto[] = [{ source: game.players[0], target: game.players[0] }];
      expect(() => service.validateGamePlayVotesWithRelationsDtoData(makeGamePlayVotesWithRelationsDto, game)).toThrow("Bad game play payload : One vote has the same source and target");
    });

    it("should do nothing when votes are valid.", () => {
      const game = createFakeGame({ upcomingPlays: [{ action: GAME_PLAY_ACTIONS.VOTE, source: PLAYER_GROUPS.ALL }] });
      const makeGamePlayVotesWithRelationsDto: MakeGamePlayVoteWithRelationsDto[] = [{ source: game.players[0], target: game.players[1] }];
      expect(() => service.validateGamePlayVotesWithRelationsDtoData(makeGamePlayVotesWithRelationsDto, game)).not.toThrow();
    });
  });
});