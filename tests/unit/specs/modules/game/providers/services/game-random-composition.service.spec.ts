import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { doesCompositionHaveAtLeastOneVillager } from "../../../../../../../src/modules/game/dto/base/decorators/composition-has-villager.decorator";
import { doesCompositionHaveAtLeastOneWerewolf } from "../../../../../../../src/modules/game/dto/base/decorators/composition-has-werewolf.decorator";
import { areCompositionRolesMaxInGameRespected } from "../../../../../../../src/modules/game/dto/base/decorators/composition-roles-max-in-game.decorator";
import { areCompositionRolesMinInGameRespected } from "../../../../../../../src/modules/game/dto/base/decorators/composition-roles-min-in-game.decorator";
import type { CreateGamePlayerDto } from "../../../../../../../src/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import type { GetGameRandomCompositionDto } from "../../../../../../../src/modules/game/dto/get-game-random-composition/get-game-random-composition.dto";
import { GameRandomCompositionService } from "../../../../../../../src/modules/game/providers/services/game-random-composition.service";
import { roles } from "../../../../../../../src/modules/role/constants/role.constant";
import { ROLE_NAMES, ROLE_SIDES, ROLE_TYPES } from "../../../../../../../src/modules/role/enums/role.enum";
import type { Role } from "../../../../../../../src/modules/role/types/role.type";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeGetGameRandomCompositionDto } from "../../../../../../factories/game/dto/get-game-random-composition/get-game-random-composition.dto.factory";

describe("Game Random Composition Service", () => {
  let service: GameRandomCompositionService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [GameRandomCompositionService] }).compile();
    service = module.get<GameRandomCompositionService>(GameRandomCompositionService);
  });

  describe("getWerewolfCountForComposition", () => {
    it.each<{ playersCount: number; expectedWerewolvesCount: number }>([
      { playersCount: 4, expectedWerewolvesCount: 1 },
      { playersCount: 6, expectedWerewolvesCount: 1 },
      { playersCount: 7, expectedWerewolvesCount: 2 },
      { playersCount: 23, expectedWerewolvesCount: 4 },
      { playersCount: 24, expectedWerewolvesCount: 4 },
      { playersCount: 25, expectedWerewolvesCount: 5 },
    ])("should return $expectedWerewolvesCount when called with $playersCount players.", ({ playersCount, expectedWerewolvesCount }) => {
      expect(service.getWerewolfCountForComposition(playersCount)).toBe(expectedWerewolvesCount);
    });
  });

  describe("getAvailableRolesForGameRandomComposition", () => {
    const players = bulkCreateFakeCreateGamePlayerDto(60);
    it("should not include some roles when there are excluded.", () => {
      const excludedRoles: ROLE_NAMES[] = [ROLE_NAMES.SEER, ROLE_NAMES.WITCH, ROLE_NAMES.PIED_PIPER, ROLE_NAMES.WHITE_WEREWOLF];
      const result = service.getAvailableRolesForGameRandomComposition(createFakeGetGameRandomCompositionDto({ players, excludedRoles }));
      expect(result.every(role => !excludedRoles.includes(role.name))).toBe(true);
    });

    it("should not include default villager role when powerful villager roles are prioritized.", () => {
      const compositionDto = createFakeGetGameRandomCompositionDto({ players, arePowerfulVillagerRolesPrioritized: false });
      const result = service.getAvailableRolesForGameRandomComposition(compositionDto);
      expect(result.some(role => role.name === ROLE_NAMES.VILLAGER)).toBe(true);
    });

    it("should include default villager role when powerful villager roles are not prioritized.", () => {
      const compositionDto = createFakeGetGameRandomCompositionDto({ players, arePowerfulVillagerRolesPrioritized: true });
      const result = service.getAvailableRolesForGameRandomComposition(compositionDto);
      expect(result.some(role => role.name === ROLE_NAMES.VILLAGER)).toBe(false);
    });

    it("should not include default werewolf role when powerful werewolf roles are prioritized.", () => {
      const compositionDto = createFakeGetGameRandomCompositionDto({ players, arePowerfulWerewolfRolesPrioritized: false });
      const result = service.getAvailableRolesForGameRandomComposition(compositionDto);
      expect(result.some(role => role.name === ROLE_NAMES.WEREWOLF)).toBe(true);
    });

    it("should include default werewolf role when powerful werewolf roles are not prioritized.", () => {
      const compositionDto = createFakeGetGameRandomCompositionDto({ players, arePowerfulWerewolfRolesPrioritized: true });
      const result = service.getAvailableRolesForGameRandomComposition(compositionDto);
      expect(result.some(role => role.name === ROLE_NAMES.WEREWOLF)).toBe(false);
    });

    it("should not include roles with recommended minimum of players when areRecommendedMinPlayersRespected is true and not enough players.", () => {
      const rolesWithoutRecommendedMinPlayers = roles.filter(role => role.recommendedMinPlayers === undefined);
      const result = service.getAvailableRolesForGameRandomComposition(createFakeGetGameRandomCompositionDto({
        players: bulkCreateFakeCreateGamePlayerDto(10),
        excludedRoles: rolesWithoutRecommendedMinPlayers.map(({ name }) => name),
        areRecommendedMinPlayersRespected: true,
      }));
      const expectedRoleNames = [ROLE_NAMES.VILLAGER, ROLE_NAMES.WEREWOLF];
      expect(result.every(role => expectedRoleNames.includes(role.name))).toBe(true);
    });

    it("should include roles with recommended minimum of players when areRecommendedMinPlayersRespected is true when enough players.", () => {
      const rolesWithoutRecommendedMinPlayers = roles.filter(role => role.recommendedMinPlayers === undefined);
      const result = service.getAvailableRolesForGameRandomComposition(createFakeGetGameRandomCompositionDto({
        players: bulkCreateFakeCreateGamePlayerDto(12),
        excludedRoles: rolesWithoutRecommendedMinPlayers.map(({ name }) => name),
        areRecommendedMinPlayersRespected: true,
      }));
      const expectedRoleNames = [
        ROLE_NAMES.WEREWOLF,
        ROLE_NAMES.PIED_PIPER,
        ROLE_NAMES.FOX,
        ROLE_NAMES.TWO_SISTERS,
        ROLE_NAMES.WHITE_WEREWOLF,
        ROLE_NAMES.VILE_FATHER_OF_WOLVES,
      ];
      expect(result).toHaveLength(6);
      expect(result.every(role => expectedRoleNames.includes(role.name))).toBe(true);
    });

    describe("getRandomRolesForSide", () => {
      it("should get only werewolves when side is werewolves and no roles are available.", () => {
        const result = service.getRandomRolesForSide([], 10, ROLE_SIDES.WEREWOLVES);
        expect(result).toHaveLength(10);
        expect(result.every(role => role.name === ROLE_NAMES.WEREWOLF)).toBe(true);
      });

      it("should get only villagers when side is villagers and no roles are available.", () => {
        const result = service.getRandomRolesForSide([], 24, ROLE_SIDES.VILLAGERS);
        expect(result).toHaveLength(24);
        expect(result.every(role => role.name === ROLE_NAMES.VILLAGER)).toBe(true);
      });

      it("should get seer, witch, pied piper, and all others are villagers when side is villagers and only seer and witch are available.", () => {
        const availableRoles: Role[] = [
          { name: ROLE_NAMES.SEER, side: ROLE_SIDES.VILLAGERS, maxInGame: 1, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 1, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.PIED_PIPER, side: ROLE_SIDES.VILLAGERS, maxInGame: 1, type: ROLE_TYPES.VILLAGER },
        ];
        const result = service.getRandomRolesForSide(availableRoles, 10, ROLE_SIDES.VILLAGERS);
        expect(result).toIncludeAllMembers([
          { name: ROLE_NAMES.SEER, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.PIED_PIPER, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.VILLAGER, side: ROLE_SIDES.VILLAGERS, maxInGame: 99, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.VILLAGER, side: ROLE_SIDES.VILLAGERS, maxInGame: 99, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.VILLAGER, side: ROLE_SIDES.VILLAGERS, maxInGame: 99, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.VILLAGER, side: ROLE_SIDES.VILLAGERS, maxInGame: 99, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.VILLAGER, side: ROLE_SIDES.VILLAGERS, maxInGame: 99, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.VILLAGER, side: ROLE_SIDES.VILLAGERS, maxInGame: 99, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.VILLAGER, side: ROLE_SIDES.VILLAGERS, maxInGame: 99, type: ROLE_TYPES.VILLAGER },
        ]);
      });

      it("should not get fox when minInGame is too high for left to pick.", () => {
        const availableRoles: Role[] = [
          { name: ROLE_NAMES.SEER, side: ROLE_SIDES.VILLAGERS, maxInGame: 1, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 1, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.FOX, side: ROLE_SIDES.VILLAGERS, minInGame: 99, maxInGame: 1, type: ROLE_TYPES.VILLAGER },
        ];
        const result = service.getRandomRolesForSide(availableRoles, 90, ROLE_SIDES.VILLAGERS);
        expect(result).toHaveLength(90);
        expect(result.find(role => role.name === ROLE_NAMES.FOX)).toBeUndefined();
      });

      it("should get three brothers when minInGame is exactly left to pick count.", () => {
        const availableRoles: Role[] = [{ name: ROLE_NAMES.THREE_BROTHERS, side: ROLE_SIDES.VILLAGERS, minInGame: 3, maxInGame: 3, type: ROLE_TYPES.VILLAGER }];
        const result = service.getRandomRolesForSide(availableRoles, 3, ROLE_SIDES.VILLAGERS);
        expect(result).toHaveLength(3);
        expect(result).toIncludeAllMembers([
          { name: ROLE_NAMES.THREE_BROTHERS, side: ROLE_SIDES.VILLAGERS, minInGame: 3, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.THREE_BROTHERS, side: ROLE_SIDES.VILLAGERS, minInGame: 3, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.THREE_BROTHERS, side: ROLE_SIDES.VILLAGERS, minInGame: 3, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
        ]);
      });

      it("should get two sisters when minInGame is lower than left to pick count.", () => {
        const availableRoles: Role[] = [
          { name: ROLE_NAMES.TWO_SISTERS, side: ROLE_SIDES.VILLAGERS, minInGame: 2, maxInGame: 2, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.SEER, side: ROLE_SIDES.VILLAGERS, maxInGame: 1, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 1, type: ROLE_TYPES.VILLAGER },
        ];
        const result = service.getRandomRolesForSide(availableRoles, 4, ROLE_SIDES.VILLAGERS);
        expect(result).toHaveLength(4);
        expect(result).toIncludeAllMembers([
          { name: ROLE_NAMES.TWO_SISTERS, side: ROLE_SIDES.VILLAGERS, minInGame: 2, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.TWO_SISTERS, side: ROLE_SIDES.VILLAGERS, minInGame: 2, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.SEER, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
        ]);
      });

      it("should get full witches when maxInGame is equal to left to pick count.", () => {
        const availableRoles: Role[] = [{ name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 10, type: ROLE_TYPES.VILLAGER }];
        const result = service.getRandomRolesForSide(availableRoles, 10, ROLE_SIDES.VILLAGERS);
        expect(result).toHaveLength(10);
        expect(result).toIncludeAllMembers([
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
          { name: ROLE_NAMES.WITCH, side: ROLE_SIDES.VILLAGERS, maxInGame: 0, type: ROLE_TYPES.VILLAGER },
        ]);
      });
    });

    describe("getGameRandomComposition", () => {
      it.each<GetGameRandomCompositionDto>([
        createFakeGetGameRandomCompositionDto({ players: bulkCreateFakeCreateGamePlayerDto(4) }),
        createFakeGetGameRandomCompositionDto({ players: bulkCreateFakeCreateGamePlayerDto(40) }),
        createFakeGetGameRandomCompositionDto({ players: bulkCreateFakeCreateGamePlayerDto(40) }),
        createFakeGetGameRandomCompositionDto({ players: bulkCreateFakeCreateGamePlayerDto(75) }),
        createFakeGetGameRandomCompositionDto({ players: bulkCreateFakeCreateGamePlayerDto(100) }),
      ])("should return random composition when called [#$#].", getGameRandomCompositionDto => {
        const result = service.getGameRandomComposition(getGameRandomCompositionDto);
        expect(result).toSatisfyAll<CreateGamePlayerDto>(player => player.role.current === player.role.original);
        expect(doesCompositionHaveAtLeastOneWerewolf(result)).toBe(true);
        expect(doesCompositionHaveAtLeastOneVillager(result)).toBe(true);
        expect(areCompositionRolesMinInGameRespected(result)).toBe(true);
        expect(areCompositionRolesMaxInGameRespected(result)).toBe(true);
      });
    });
  });
});