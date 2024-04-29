import { Test } from "@nestjs/testing";
import type { TestingModule } from "@nestjs/testing";

import { PlayerAttributeService } from "@/modules/game/providers/services/player/player-attribute.service";
import { PlayerKillerService } from "@/modules/game/providers/services/player/player-killer.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";

import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeSeerAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayerDeathPotionByWitchDeath, createFakePlayerDiseaseByRustySwordKnightDeath, createFakePlayerEatenByWerewolvesDeath } from "@tests/factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeCantVoteBySurvivorsPlayerAttribute, createFakeEatenByBigBadWolfPlayerAttribute, createFakePlayerAttribute, createFakePlayerAttributeActivation, createFakePowerlessByElderPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";

describe("Player Attribute Service", () => {
  let services: { playerAttribute: PlayerAttributeService };
  let mocks: { playerKillerService: { killOrRevealPlayer: jest.SpyInstance } };

  beforeEach(async() => {
    mocks = { playerKillerService: { killOrRevealPlayer: jest.fn() } };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PlayerKillerService,
          useValue: mocks.playerKillerService,
        },
        PlayerAttributeService,
      ],
    }).compile();

    services = { playerAttribute: module.get<PlayerAttributeService>(PlayerAttributeService) };
  });

  describe("applyEatenAttributeOutcomes", () => {
    it("should call killOrRevealPlayer when called.", async() => {
      const player = createFakePlayer();
      const game = createFakeGame();
      const attribute = createFakeEatenByBigBadWolfPlayerAttribute();
      const death = createFakePlayerEatenByWerewolvesDeath({ source: attribute.source });
      await services.playerAttribute.applyEatenAttributeOutcomes(player, game, attribute);

      expect(mocks.playerKillerService.killOrRevealPlayer).toHaveBeenCalledExactlyOnceWith(player._id, game, death);
    });
  });

  describe("applyDrankDeathPotionAttributeOutcomes", () => {
    it("should call killOrRevealPlayer when called.", async() => {
      const player = createFakePlayer();
      const game = createFakeGame();
      const death = createFakePlayerDeathPotionByWitchDeath();
      await services.playerAttribute.applyDrankDeathPotionAttributeOutcomes(player, game);

      expect(mocks.playerKillerService.killOrRevealPlayer).toHaveBeenCalledExactlyOnceWith(player._id, game, death);
    });
  });

  describe("applyContaminatedAttributeOutcomes", () => {
    it("should call killOrRevealPlayer when called.", async() => {
      const player = createFakePlayer();
      const game = createFakeGame();
      const death = createFakePlayerDiseaseByRustySwordKnightDeath();
      await services.playerAttribute.applyContaminatedAttributeOutcomes(player, game);

      expect(mocks.playerKillerService.killOrRevealPlayer).toHaveBeenCalledExactlyOnceWith(player._id, game, death);
    });
  });

  describe("decreaseAttributeRemainingPhase", () => {
    it("should return attribute as is when there is no remaining phases.", () => {
      const attribute = createFakePowerlessByElderPlayerAttribute();
      const game = createFakeGame();

      expect(services.playerAttribute["decreaseAttributeRemainingPhase"](attribute, game)).toStrictEqual<PlayerAttribute>(attribute);
    });

    it("should return attribute as is when attribute is not active yet.", () => {
      const attribute = createFakePowerlessByElderPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 2 }) });
      const game = createFakeGame({ turn: 1 });

      expect(services.playerAttribute["decreaseAttributeRemainingPhase"](attribute, game)).toStrictEqual<PlayerAttribute>(attribute);
    });
    
    it("should return decreased attribute when called.", () => {
      const attribute = createFakePowerlessByElderPlayerAttribute({ remainingPhases: 3 });
      const game = createFakeGame();
      const expectedAttribute = createFakePlayerAttribute({
        ...attribute,
        remainingPhases: 2,
      });

      expect(services.playerAttribute["decreaseAttributeRemainingPhase"](attribute, game)).toStrictEqual<PlayerAttribute>(expectedAttribute);
    });
  });

  describe("decreaseRemainingPhasesAndRemoveObsoleteAttributes", () => {
    it("should return player as is when he is dead.", () => {
      const player = createFakeSeerAlivePlayer({
        isAlive: false,
        attributes: [
          createFakeCantVoteBySurvivorsPlayerAttribute({ remainingPhases: 1 }),
          createFakeSheriffBySurvivorsPlayerAttribute({ remainingPhases: 2 }),
        ],
      });
      const game = createFakeGame();

      expect(services.playerAttribute["decreaseRemainingPhasesAndRemoveObsoleteAttributes"](player, game)).toStrictEqual<Player>(player);
    });

    it("should return player with one decreased attribute and other one removed when called.", () => {
      const player = createFakeSeerAlivePlayer({
        attributes: [
          createFakeCantVoteBySurvivorsPlayerAttribute(),
          createFakeCantVoteBySurvivorsPlayerAttribute({ remainingPhases: 1 }),
          createFakeSheriffBySurvivorsPlayerAttribute({ remainingPhases: 2 }),
        ],
      });
      const game = createFakeGame();
      const expectedPlayer = createFakePlayer({
        ...player,
        attributes: [
          player.attributes[0],
          createFakePlayerAttribute({ ...player.attributes[2], remainingPhases: 1 }),
        ],
      });

      expect(services.playerAttribute["decreaseRemainingPhasesAndRemoveObsoleteAttributes"](player, game)).toStrictEqual<Player>(expectedPlayer);
    });
  });

  describe("decreaseRemainingPhasesAndRemoveObsoletePlayerAttributes", () => {
    it("should decrease and remove attributes among players when called.", () => {
      const players = [
        createFakeSeerAlivePlayer({
          attributes: [
            createFakeCantVoteBySurvivorsPlayerAttribute(),
            createFakeCantVoteBySurvivorsPlayerAttribute({ remainingPhases: 1 }),
            createFakeSheriffBySurvivorsPlayerAttribute({ remainingPhases: 2 }),
          ],
        }),
      ];
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer({
            ...players[0],
            attributes: [
              players[0].attributes[0],
              createFakePlayerAttribute({ ...players[0].attributes[2], remainingPhases: 1 }),
            ],
          }),
        ],
      });
      
      expect(services.playerAttribute.decreaseRemainingPhasesAndRemoveObsoletePlayerAttributes(game)).toStrictEqual<Game>(expectedGame);
    });
  });
});