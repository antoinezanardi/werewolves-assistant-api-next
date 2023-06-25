import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { PlayerAttributeService } from "../../../../../../../../src/modules/game/providers/services/player/player-attribute.service";
import type { Game } from "../../../../../../../../src/modules/game/schemas/game.schema";
import type { PlayerAttribute } from "../../../../../../../../src/modules/game/schemas/player/player-attribute/player-attribute.schema";
import type { Player } from "../../../../../../../../src/modules/game/schemas/player/player.schema";
import { createFakeGame } from "../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakeCantVoteByAllPlayerAttribute, createFakePlayerAttribute, createFakePlayerAttributeActivation, createFakePowerlessByAncientPlayerAttribute, createFakeSheriffByAllPlayerAttribute } from "../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeSeerAlivePlayer } from "../../../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "../../../../../../../factories/game/schemas/player/player.schema.factory";

describe("Player Attribute Service", () => {
  let services: { playerAttribute: PlayerAttributeService };

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [PlayerAttributeService] }).compile();

    services = { playerAttribute: module.get<PlayerAttributeService>(PlayerAttributeService) };
  });

  describe("decreaseAttributeRemainingPhase", () => {
    it("should return attribute as is when there is no remaining phases.", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute();
      const game = createFakeGame();

      expect(services.playerAttribute["decreaseAttributeRemainingPhase"](attribute, game)).toStrictEqual<PlayerAttribute>(attribute);
    });

    it("should return attribute as is when attribute is not active yet.", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute({ activeAt: createFakePlayerAttributeActivation({ turn: 2 }) });
      const game = createFakeGame({ turn: 1 });

      expect(services.playerAttribute["decreaseAttributeRemainingPhase"](attribute, game)).toStrictEqual<PlayerAttribute>(attribute);
    });
    
    it("should return decreased attribute when called.", () => {
      const attribute = createFakePowerlessByAncientPlayerAttribute({ remainingPhases: 3 });
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
        isAlive: false, attributes: [
          createFakeCantVoteByAllPlayerAttribute({ remainingPhases: 1 }),
          createFakeSheriffByAllPlayerAttribute({ remainingPhases: 2 }),
        ],
      });
      const game = createFakeGame();

      expect(services.playerAttribute["decreaseRemainingPhasesAndRemoveObsoleteAttributes"](player, game)).toStrictEqual<Player>(player);
    });

    it("should return player with one decreased attribute and other one removed when called.", () => {
      const player = createFakeSeerAlivePlayer({
        attributes: [
          createFakeCantVoteByAllPlayerAttribute(),
          createFakeCantVoteByAllPlayerAttribute({ remainingPhases: 1 }),
          createFakeSheriffByAllPlayerAttribute({ remainingPhases: 2 }),
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
            createFakeCantVoteByAllPlayerAttribute(),
            createFakeCantVoteByAllPlayerAttribute({ remainingPhases: 1 }),
            createFakeSheriffByAllPlayerAttribute({ remainingPhases: 2 }),
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