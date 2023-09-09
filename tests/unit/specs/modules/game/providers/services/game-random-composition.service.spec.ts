import { Test } from "@nestjs/testing";
import type { TestingModule } from "@nestjs/testing";

import { doesCompositionHaveAtLeastOneVillager } from "@/modules/game/dto/base/decorators/composition/composition-has-villager.decorator";
import { doesCompositionHaveAtLeastOneWerewolf } from "@/modules/game/dto/base/decorators/composition/composition-has-werewolf.decorator";
import { areCompositionRolesMaxInGameRespected } from "@/modules/game/dto/base/decorators/composition/composition-roles-max-in-game.decorator";
import { areCompositionRolesMinInGameRespected } from "@/modules/game/dto/base/decorators/composition/composition-roles-min-in-game.decorator";
import type { CreateGamePlayerDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import type { GetGameRandomCompositionDto } from "@/modules/game/dto/get-game-random-composition/get-game-random-composition.dto";
import { GameRandomCompositionService } from "@/modules/game/providers/services/game-random-composition.service";
import { ROLES } from "@/modules/role/constants/role.constant";
import { RoleNames, RoleSides, RoleTypes } from "@/modules/role/enums/role.enum";
import type { Role } from "@/modules/role/types/role.type";

import { createFakeGetGameRandomCompositionDto } from "@tests/factories/game/dto/get-game-random-composition/get-game-random-composition.dto.factory";
import { bulkCreateFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Game Random Composition Service", () => {
  let services: { gameRandomComposition: GameRandomCompositionService };

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [GameRandomCompositionService] }).compile();

    services = { gameRandomComposition: module.get<GameRandomCompositionService>(GameRandomCompositionService) };
  });
  
  describe("getGameRandomComposition", () => {
    it.each<GetGameRandomCompositionDto>([
      createFakeGetGameRandomCompositionDto({ players: bulkCreateFakeCreateGamePlayerDto(4) }),
      createFakeGetGameRandomCompositionDto({ players: bulkCreateFakeCreateGamePlayerDto(40) }),
      createFakeGetGameRandomCompositionDto({ players: bulkCreateFakeCreateGamePlayerDto(40) }),
      createFakeGetGameRandomCompositionDto({ players: bulkCreateFakeCreateGamePlayerDto(75) }),
      createFakeGetGameRandomCompositionDto({ players: bulkCreateFakeCreateGamePlayerDto(100) }),
    ])("should return random composition when called [#$#].", getGameRandomCompositionDto => {
      const result = services.gameRandomComposition.getGameRandomComposition(getGameRandomCompositionDto);

      expect(result).toSatisfyAll<CreateGamePlayerDto>(player => player.role.current === player.role.original);
      expect(doesCompositionHaveAtLeastOneWerewolf(result)).toBe(true);
      expect(doesCompositionHaveAtLeastOneVillager(result)).toBe(true);
      expect(areCompositionRolesMinInGameRespected(result)).toBe(true);
      expect(areCompositionRolesMaxInGameRespected(result)).toBe(true);
    });
  });
  
  describe("getRandomRolesForSide", () => {
    it("should get only werewolves when side is werewolves and no roles are available.", () => {
      const result = services.gameRandomComposition["getRandomRolesForSide"]([], 10, RoleSides.WEREWOLVES);

      expect(result).toHaveLength(10);
      expect(result.every(role => role.name === RoleNames.WEREWOLF)).toBe(true);
    });

    it("should get only villagers when side is villagers and no roles are available.", () => {
      const result = services.gameRandomComposition["getRandomRolesForSide"]([], 24, RoleSides.VILLAGERS);

      expect(result).toHaveLength(24);
      expect(result.every(role => role.name === RoleNames.VILLAGER)).toBe(true);
    });

    it("should get seer, witch, pied piper, and all others are villagers when side is villagers and only seer and witch are available.", () => {
      const availableRoles: Role[] = [
        { name: RoleNames.SEER, side: RoleSides.VILLAGERS, maxInGame: 1, type: RoleTypes.VILLAGER },
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 1, type: RoleTypes.VILLAGER },
        { name: RoleNames.PIED_PIPER, side: RoleSides.VILLAGERS, maxInGame: 1, type: RoleTypes.VILLAGER },
      ];
      const result = services.gameRandomComposition["getRandomRolesForSide"](availableRoles, 10, RoleSides.VILLAGERS);

      expect(result).toIncludeAllMembers([
        { name: RoleNames.SEER, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.PIED_PIPER, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.VILLAGER, side: RoleSides.VILLAGERS, maxInGame: 99, type: RoleTypes.VILLAGER },
        { name: RoleNames.VILLAGER, side: RoleSides.VILLAGERS, maxInGame: 99, type: RoleTypes.VILLAGER },
        { name: RoleNames.VILLAGER, side: RoleSides.VILLAGERS, maxInGame: 99, type: RoleTypes.VILLAGER },
        { name: RoleNames.VILLAGER, side: RoleSides.VILLAGERS, maxInGame: 99, type: RoleTypes.VILLAGER },
        { name: RoleNames.VILLAGER, side: RoleSides.VILLAGERS, maxInGame: 99, type: RoleTypes.VILLAGER },
        { name: RoleNames.VILLAGER, side: RoleSides.VILLAGERS, maxInGame: 99, type: RoleTypes.VILLAGER },
        { name: RoleNames.VILLAGER, side: RoleSides.VILLAGERS, maxInGame: 99, type: RoleTypes.VILLAGER },
      ]);
    });

    it("should not get fox when minInGame is too high for left to pick.", () => {
      const availableRoles: Role[] = [
        { name: RoleNames.SEER, side: RoleSides.VILLAGERS, maxInGame: 1, type: RoleTypes.VILLAGER },
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 1, type: RoleTypes.VILLAGER },
        { name: RoleNames.FOX, side: RoleSides.VILLAGERS, minInGame: 99, maxInGame: 1, type: RoleTypes.VILLAGER },
      ];
      const result = services.gameRandomComposition["getRandomRolesForSide"](availableRoles, 90, RoleSides.VILLAGERS);

      expect(result).toHaveLength(90);
      expect(result.find(role => role.name === RoleNames.FOX)).toBeUndefined();
    });

    it("should get three brothers when minInGame is exactly left to pick count.", () => {
      const availableRoles: Role[] = [{ name: RoleNames.THREE_BROTHERS, side: RoleSides.VILLAGERS, minInGame: 3, maxInGame: 3, type: RoleTypes.VILLAGER }];
      const result = services.gameRandomComposition["getRandomRolesForSide"](availableRoles, 3, RoleSides.VILLAGERS);

      expect(result).toHaveLength(3);
      expect(result).toIncludeAllMembers([
        { name: RoleNames.THREE_BROTHERS, side: RoleSides.VILLAGERS, minInGame: 3, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.THREE_BROTHERS, side: RoleSides.VILLAGERS, minInGame: 3, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.THREE_BROTHERS, side: RoleSides.VILLAGERS, minInGame: 3, maxInGame: 0, type: RoleTypes.VILLAGER },
      ]);
    });

    it("should get two sisters when minInGame is lower than left to pick count.", () => {
      const availableRoles: Role[] = [
        { name: RoleNames.TWO_SISTERS, side: RoleSides.VILLAGERS, minInGame: 2, maxInGame: 2, type: RoleTypes.VILLAGER },
        { name: RoleNames.SEER, side: RoleSides.VILLAGERS, maxInGame: 1, type: RoleTypes.VILLAGER },
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 1, type: RoleTypes.VILLAGER },
      ];
      const result = services.gameRandomComposition["getRandomRolesForSide"](availableRoles, 4, RoleSides.VILLAGERS);

      expect(result).toHaveLength(4);
      expect(result).toIncludeAllMembers([
        { name: RoleNames.TWO_SISTERS, side: RoleSides.VILLAGERS, minInGame: 2, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.TWO_SISTERS, side: RoleSides.VILLAGERS, minInGame: 2, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.SEER, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
      ]);
    });

    it("should get full witches when maxInGame is equal to left to pick count.", () => {
      const availableRoles: Role[] = [{ name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 10, type: RoleTypes.VILLAGER }];
      const result = services.gameRandomComposition["getRandomRolesForSide"](availableRoles, 10, RoleSides.VILLAGERS);

      expect(result).toHaveLength(10);
      expect(result).toIncludeAllMembers([
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
        { name: RoleNames.WITCH, side: RoleSides.VILLAGERS, maxInGame: 0, type: RoleTypes.VILLAGER },
      ]);
    });
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
      expect(services.gameRandomComposition["getWerewolfCountForComposition"](playersCount)).toBe(expectedWerewolvesCount);
    });
  });

  describe("getAvailableRolesForGameRandomComposition", () => {
    const players = bulkCreateFakeCreateGamePlayerDto(60);
    it("should not include some roles when there are excluded.", () => {
      const excludedRoles: RoleNames[] = [RoleNames.SEER, RoleNames.WITCH, RoleNames.PIED_PIPER, RoleNames.WHITE_WEREWOLF];
      const result = services.gameRandomComposition["getAvailableRolesForGameRandomComposition"](createFakeGetGameRandomCompositionDto({ players, excludedRoles }));

      expect(result.every(role => !excludedRoles.includes(role.name))).toBe(true);
    });

    it("should not include default villager role when powerful villager roles are prioritized.", () => {
      const compositionDto = createFakeGetGameRandomCompositionDto({ players, arePowerfulVillagerRolesPrioritized: false });
      const result = services.gameRandomComposition["getAvailableRolesForGameRandomComposition"](compositionDto);

      expect(result.some(role => role.name === RoleNames.VILLAGER)).toBe(true);
    });

    it("should include default villager role when powerful villager roles are not prioritized.", () => {
      const compositionDto = createFakeGetGameRandomCompositionDto({ players, arePowerfulVillagerRolesPrioritized: true });
      const result = services.gameRandomComposition["getAvailableRolesForGameRandomComposition"](compositionDto);

      expect(result.some(role => role.name === RoleNames.VILLAGER)).toBe(false);
    });

    it("should not include default werewolf role when powerful werewolf roles are prioritized.", () => {
      const compositionDto = createFakeGetGameRandomCompositionDto({ players, arePowerfulWerewolfRolesPrioritized: false });
      const result = services.gameRandomComposition["getAvailableRolesForGameRandomComposition"](compositionDto);

      expect(result.some(role => role.name === RoleNames.WEREWOLF)).toBe(true);
    });

    it("should include default werewolf role when powerful werewolf roles are not prioritized.", () => {
      const compositionDto = createFakeGetGameRandomCompositionDto({ players, arePowerfulWerewolfRolesPrioritized: true });
      const result = services.gameRandomComposition["getAvailableRolesForGameRandomComposition"](compositionDto);

      expect(result.some(role => role.name === RoleNames.WEREWOLF)).toBe(false);
    });

    it("should not include roles with recommended minimum of players when areRecommendedMinPlayersRespected is true and not enough players.", () => {
      const rolesWithoutRecommendedMinPlayers = ROLES.filter(role => role.recommendedMinPlayers === undefined);
      const result = services.gameRandomComposition["getAvailableRolesForGameRandomComposition"](createFakeGetGameRandomCompositionDto({
        players: bulkCreateFakeCreateGamePlayerDto(10),
        excludedRoles: rolesWithoutRecommendedMinPlayers.map(({ name }) => name),
        areRecommendedMinPlayersRespected: true,
      }));
      const expectedRoleNames = [RoleNames.VILLAGER, RoleNames.WEREWOLF];

      expect(result.every(role => expectedRoleNames.includes(role.name))).toBe(true);
    });

    it("should include roles with recommended minimum of players when areRecommendedMinPlayersRespected is true when enough players.", () => {
      const rolesWithoutRecommendedMinPlayers = ROLES.filter(role => role.recommendedMinPlayers === undefined);
      const result = services.gameRandomComposition["getAvailableRolesForGameRandomComposition"](createFakeGetGameRandomCompositionDto({
        players: bulkCreateFakeCreateGamePlayerDto(12),
        excludedRoles: rolesWithoutRecommendedMinPlayers.map(({ name }) => name),
        areRecommendedMinPlayersRespected: true,
      }));
      const expectedRoleNames = [
        RoleNames.WEREWOLF,
        RoleNames.PIED_PIPER,
        RoleNames.FOX,
        RoleNames.TWO_SISTERS,
        RoleNames.WHITE_WEREWOLF,
        RoleNames.VILE_FATHER_OF_WOLVES,
      ];

      expect(result).toHaveLength(6);
      expect(result.every(role => expectedRoleNames.includes(role.name))).toBe(true);
    });
  });
});