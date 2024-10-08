import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { doesCompositionHaveAtLeastOneVillager } from "@/modules/game/dto/base/decorators/composition/composition-has-villager.decorator";
import { doesCompositionHaveAtLeastOneWerewolf } from "@/modules/game/dto/base/decorators/composition/composition-has-werewolf.decorator";
import { areCompositionRolesMaxInGameRespected } from "@/modules/game/dto/base/decorators/composition/composition-roles-max-in-game.decorator";
import { areCompositionRolesMinInGameRespected } from "@/modules/game/dto/base/decorators/composition/composition-roles-min-in-game.decorator";
import type { CreateGamePlayerDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import type { GetGameRandomCompositionDto } from "@/modules/game/dto/get-game-random-composition/get-game-random-composition.dto";
import { GameRandomCompositionService } from "@/modules/game/providers/services/game-random-composition.service";
import { ROLES } from "@/modules/role/constants/role-set.constants";
import type { Role } from "@/modules/role/types/role.class";
import type { RoleName } from "@/modules/role/types/role.types";

import { bulkCreateFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeGetGameRandomCompositionDto } from "@tests/factories/game/dto/get-game-random-composition/get-game-random-composition.dto.factory";
import { createFakeRole } from "@tests/factories/role/types/role.type.factory";

describe("Game Random Composition Service", () => {
  let services: { gameRandomComposition: GameRandomCompositionService };

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [GameRandomCompositionService] }).compile();

    services = { gameRandomComposition: module.get<GameRandomCompositionService>(GameRandomCompositionService) };
  });

  describe("getGameRandomComposition", () => {
    it.each<{
      test: string;
      getGameRandomCompositionDto: GetGameRandomCompositionDto;
    }>([
      {
        test: "should return random composition when called with 4 players.",
        getGameRandomCompositionDto: createFakeGetGameRandomCompositionDto({ players: bulkCreateFakeCreateGamePlayerDto(4) }),
      },
      {
        test: "should return random composition when called with 40 players.",
        getGameRandomCompositionDto: createFakeGetGameRandomCompositionDto({ players: bulkCreateFakeCreateGamePlayerDto(40) }),
      },
      {
        test: "should return random composition when called with 75 players.",
        getGameRandomCompositionDto: createFakeGetGameRandomCompositionDto({ players: bulkCreateFakeCreateGamePlayerDto(75) }),
      },
      {
        test: "should return random composition when called with 100 players.",
        getGameRandomCompositionDto: createFakeGetGameRandomCompositionDto({ players: bulkCreateFakeCreateGamePlayerDto(100) }),
      },
    ])("$test", ({ getGameRandomCompositionDto }) => {
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
      const result = services.gameRandomComposition["getRandomRolesForSide"]([], 10, "werewolves");

      expect(result).toHaveLength(10);
      expect(result.every(role => role.name === "werewolf")).toBe(true);
    });

    it("should get only villagers when side is villagers and no roles are available.", () => {
      const result = services.gameRandomComposition["getRandomRolesForSide"]([], 24, "villagers");

      expect(result).toHaveLength(24);
      expect(result.every(role => role.name === "villager")).toBe(true);
    });

    it("should get seer, witch, pied piper, and all others are villagers when side is villagers and only seer and witch are available.", () => {
      const availableRoles = [
        createFakeRole({
          name: "seer",
          side: "villagers",
          maxInGame: 1,
          type: "villager",
          origin: "classic",
          additionalCardsEligibleRecipients: ["thief"],
        }),
        createFakeRole({
          name: "witch",
          side: "villagers",
          maxInGame: 1,
          type: "villager",
          origin: "classic",
          additionalCardsEligibleRecipients: ["thief"],
        }),
        createFakeRole({
          name: "pied-piper",
          side: "villagers",
          maxInGame: 1,
          type: "villager",
          origin: "classic",
          additionalCardsEligibleRecipients: ["thief"],
        }),
      ];
      const result = services.gameRandomComposition["getRandomRolesForSide"](availableRoles, 10, "villagers");

      expect(result).toIncludeAllMembers<Role>([
        createFakeRole({
          name: "seer",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
          additionalCardsEligibleRecipients: ["thief"],
        }),
        createFakeRole({
          name: "witch",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
          additionalCardsEligibleRecipients: ["thief"],
        }),
        createFakeRole({
          name: "pied-piper",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
          additionalCardsEligibleRecipients: ["thief"],
        }),
        createFakeRole({
          name: "villager",
          side: "villagers",
          maxInGame: 99,
          type: "villager",
          origin: "classic",
          additionalCardsEligibleRecipients: ["thief"],
        }),
        createFakeRole({
          name: "villager",
          side: "villagers",
          maxInGame: 99,
          type: "villager",
          origin: "classic",
          additionalCardsEligibleRecipients: ["thief"],
        }),
        createFakeRole({
          name: "villager",
          side: "villagers",
          maxInGame: 99,
          type: "villager",
          origin: "classic",
          additionalCardsEligibleRecipients: ["thief"],
        }),
        createFakeRole({
          name: "villager",
          side: "villagers",
          maxInGame: 99,
          type: "villager",
          origin: "classic",
          additionalCardsEligibleRecipients: ["thief"],
        }),
        createFakeRole({
          name: "villager",
          side: "villagers",
          maxInGame: 99,
          type: "villager",
          origin: "classic",
          additionalCardsEligibleRecipients: ["thief"],
        }),
        createFakeRole({
          name: "villager",
          side: "villagers",
          maxInGame: 99,
          type: "villager",
          origin: "classic",
          additionalCardsEligibleRecipients: ["thief"],
        }),
        createFakeRole({
          name: "villager",
          side: "villagers",
          maxInGame: 99,
          type: "villager",
          origin: "classic",
          additionalCardsEligibleRecipients: ["thief"],
        }),
      ]);
    });

    it("should not get fox when minInGame is too high for left to pick.", () => {
      const availableRoles = [
        createFakeRole({
          name: "seer",
          side: "villagers",
          maxInGame: 1,
          type: "villager",
          origin: "classic",
        }),
        createFakeRole({
          name: "witch",
          side: "villagers",
          maxInGame: 1,
          type: "villager",
          origin: "classic",
        }),
        createFakeRole({
          name: "fox",
          side: "villagers",
          minInGame: 99,
          maxInGame: 1,
          type: "villager",
          origin: "characters",
        }),
      ];
      const result = services.gameRandomComposition["getRandomRolesForSide"](availableRoles, 90, "villagers");

      expect(result).toHaveLength(90);
      expect(result.find(role => role.name === "fox")).toBeUndefined();
    });

    it("should get three brothers when minInGame is exactly left to pick count.", () => {
      const availableRoles = [
        createFakeRole({
          name: "three-brothers",
          side: "villagers",
          minInGame: 3,
          maxInGame: 3,
          type: "villager",
          origin: "characters",
        }),
      ];
      const result = services.gameRandomComposition["getRandomRolesForSide"](availableRoles, 3, "villagers");

      expect(result).toHaveLength(3);
      expect(result).toIncludeAllMembers([
        {
          name: "three-brothers",
          side: "villagers",
          minInGame: 3,
          maxInGame: 0,
          type: "villager",
          origin: "characters",
        },
        {
          name: "three-brothers",
          side: "villagers",
          minInGame: 3,
          maxInGame: 0,
          type: "villager",
          origin: "characters",
        },
        {
          name: "three-brothers",
          side: "villagers",
          minInGame: 3,
          maxInGame: 0,
          type: "villager",
          origin: "characters",
        },
      ]);
    });

    it("should get two sisters when minInGame is lower than left to pick count.", () => {
      const availableRoles = [
        createFakeRole({
          name: "two-sisters",
          side: "villagers",
          minInGame: 2,
          maxInGame: 2,
          type: "villager",
          origin: "classic",
        }),
        createFakeRole({
          name: "seer",
          side: "villagers",
          maxInGame: 1,
          type: "villager",
          origin: "classic",
        }),
        createFakeRole({
          name: "witch",
          side: "villagers",
          maxInGame: 1,
          type: "villager",
          origin: "classic",
        }),
      ];
      const result = services.gameRandomComposition["getRandomRolesForSide"](availableRoles, 4, "villagers");

      expect(result).toHaveLength(4);
      expect(result).toIncludeAllMembers([
        {
          name: "two-sisters",
          side: "villagers",
          minInGame: 2,
          maxInGame: 0,
          type: "villager",
          origin: "classic",
        },
        {
          name: "two-sisters",
          side: "villagers",
          minInGame: 2,
          maxInGame: 0,
          type: "villager",
          origin: "classic",
        },
        {
          name: "seer",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
        },
        {
          name: "witch",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
        },
      ]);
    });

    it("should get full witches when maxInGame is equal to left to pick count.", () => {
      const availableRoles = [
        createFakeRole({
          name: "witch",
          side: "villagers",
          maxInGame: 10,
          type: "villager",
          origin: "classic",
        }),
      ];
      const result = services.gameRandomComposition["getRandomRolesForSide"](availableRoles, 10, "villagers");

      expect(result).toHaveLength(10);
      expect(result).toIncludeAllMembers([
        {
          name: "witch",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
        },
        {
          name: "witch",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
        },
        {
          name: "witch",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
        },
        {
          name: "witch",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
        },
        {
          name: "witch",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
        },
        {
          name: "witch",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
        },
        {
          name: "witch",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
        },
        {
          name: "witch",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
        },
        {
          name: "witch",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
        },
        {
          name: "witch",
          side: "villagers",
          maxInGame: 0,
          type: "villager",
          origin: "classic",
        },
      ]);
    });
  });

  describe("getWerewolfCountForComposition", () => {
    it.each<{
      test: string;
      playersCount: number;
      expectedWerewolvesCount: number;
    }>([
      {
        test: "should return 1 when called with 4 players.",
        playersCount: 4,
        expectedWerewolvesCount: 1,
      },
      {
        test: "should return 2 when called with 6 players.",
        playersCount: 6,
        expectedWerewolvesCount: 1,
      },
      {
        test: "should return 2 when called with 7 players.",
        playersCount: 7,
        expectedWerewolvesCount: 2,
      },
      {
        test: "should return 4 when called with 23 players.",
        playersCount: 23,
        expectedWerewolvesCount: 4,
      },
      {
        test: "should return 4 when called with 24 players.",
        playersCount: 24,
        expectedWerewolvesCount: 4,
      },
      {
        test: "should return 5 when called with 25 players.",
        playersCount: 25,
        expectedWerewolvesCount: 5,
      },
    ])("$test", ({
      playersCount,
      expectedWerewolvesCount,
    }) => {
      expect(services.gameRandomComposition["getWerewolfCountForComposition"](playersCount)).toBe(expectedWerewolvesCount);
    });
  });

  describe("getAvailableRolesForGameRandomComposition", () => {
    const players = bulkCreateFakeCreateGamePlayerDto(60);

    it("should not include some roles when there are excluded.", () => {
      const excludedRoles: RoleName[] = [
        "seer",
        "witch",
        "pied-piper",
        "white-werewolf",
      ];
      const result = services.gameRandomComposition["getAvailableRolesForGameRandomComposition"](createFakeGetGameRandomCompositionDto({
        players,
        excludedRoles,
      }));

      expect(result.every(role => !excludedRoles.includes(role.name))).toBe(true);
    });

    it("should not include default villager role when powerful villager roles are prioritized.", () => {
      const compositionDto = createFakeGetGameRandomCompositionDto({
        players,
        arePowerfulVillagerRolesPrioritized: false,
      });
      const result = services.gameRandomComposition["getAvailableRolesForGameRandomComposition"](compositionDto);

      expect(result.some(role => role.name === "villager")).toBe(true);
    });

    it("should include default villager role when powerful villager roles are not prioritized.", () => {
      const compositionDto = createFakeGetGameRandomCompositionDto({
        players,
        arePowerfulVillagerRolesPrioritized: true,
      });
      const result = services.gameRandomComposition["getAvailableRolesForGameRandomComposition"](compositionDto);

      expect(result.some(role => role.name === "villager")).toBe(false);
    });

    it("should not include default werewolf role when powerful werewolf roles are prioritized.", () => {
      const compositionDto = createFakeGetGameRandomCompositionDto({
        players,
        arePowerfulWerewolfRolesPrioritized: false,
      });
      const result = services.gameRandomComposition["getAvailableRolesForGameRandomComposition"](compositionDto);

      expect(result.some(role => role.name === "werewolf")).toBe(true);
    });

    it("should include default werewolf role when powerful werewolf roles are not prioritized.", () => {
      const compositionDto = createFakeGetGameRandomCompositionDto({
        players,
        arePowerfulWerewolfRolesPrioritized: true,
      });
      const result = services.gameRandomComposition["getAvailableRolesForGameRandomComposition"](compositionDto);

      expect(result.some(role => role.name === "werewolf")).toBe(false);
    });

    it("should not include roles with recommended minimum of players when areRecommendedMinPlayersRespected is true and not enough players.", () => {
      const rolesWithoutRecommendedMinPlayers = ROLES.filter(role => role.recommendedMinPlayers === undefined);
      const result = services.gameRandomComposition["getAvailableRolesForGameRandomComposition"](createFakeGetGameRandomCompositionDto({
        players: bulkCreateFakeCreateGamePlayerDto(7),
        excludedRoles: rolesWithoutRecommendedMinPlayers.map(({ name }) => name),
        areRecommendedMinPlayersRespected: true,
      }));
      const expectedRoleNames: RoleName[] = [
        "villager",
        "werewolf",
      ];

      expect(result.every(role => expectedRoleNames.includes(role.name))).toBe(true);
    });

    it("should include roles with recommended minimum of players when areRecommendedMinPlayersRespected is true when enough players.", () => {
      const rolesWithoutRecommendedMinPlayers = ROLES.filter(role => role.recommendedMinPlayers === undefined);
      const result = services.gameRandomComposition["getAvailableRolesForGameRandomComposition"](createFakeGetGameRandomCompositionDto({
        players: bulkCreateFakeCreateGamePlayerDto(12),
        excludedRoles: rolesWithoutRecommendedMinPlayers.map(({ name }) => name),
        areRecommendedMinPlayersRespected: true,
      }));
      const expectedRoleNames: RoleName[] = [
        "werewolf",
        "pied-piper",
        "fox",
        "two-sisters",
        "white-werewolf",
        "accursed-wolf-father",
        "prejudiced-manipulator",
        "actor",
      ];

      expect(result).toHaveLength(8);
      expect(result.every(role => expectedRoleNames.includes(role.name))).toBe(true);
    });
  });
});