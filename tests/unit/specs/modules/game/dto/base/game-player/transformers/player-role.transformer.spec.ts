import type { TransformFnParams } from "class-transformer/types/interfaces";

import { playerRoleTransformer } from "@/modules/game/dto/base/game-player/transformers/player-role.transformer";
import type { CreateGamePlayerRoleDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player-role/create-game-player-role.dto";
import { RoleNames } from "@/modules/role/enums/role.enum";

describe("Player Role Transformer", () => {
  describe("playerRoleTransformer", () => {
    it("should return null when value is null.", () => {
      expect(playerRoleTransformer({ value: null } as TransformFnParams)).toBeNull();
    });

    it("should return same value when value is not an object.", () => {
      expect(playerRoleTransformer({ value: "toto" } as TransformFnParams)).toBe("toto");
    });

    it("should return same value when value doesn't have the name field.", () => {
      expect(playerRoleTransformer({ value: {} } as TransformFnParams)).toStrictEqual({});
    });

    it("should return same value when role is unknown.", () => {
      expect(playerRoleTransformer({ value: { name: "hello" } } as TransformFnParams)).toStrictEqual({ name: "hello" });
    });

    it("should fill player role (seer) fields when called.", () => {
      const createPlayerRoleDto: CreateGamePlayerRoleDto = { name: RoleNames.SEER };

      expect(playerRoleTransformer({ value: createPlayerRoleDto } as TransformFnParams)).toStrictEqual<CreateGamePlayerRoleDto>({
        name: RoleNames.SEER,
        original: RoleNames.SEER,
        current: RoleNames.SEER,
        isRevealed: false,
      });
    });

    it("should fill player role (white-werewolf) fields when called.", () => {
      const createPlayerRoleDto: CreateGamePlayerRoleDto = { name: RoleNames.WHITE_WEREWOLF };

      expect(playerRoleTransformer({ value: createPlayerRoleDto } as TransformFnParams)).toStrictEqual<CreateGamePlayerRoleDto>({
        name: RoleNames.WHITE_WEREWOLF,
        original: RoleNames.WHITE_WEREWOLF,
        current: RoleNames.WHITE_WEREWOLF,
        isRevealed: false,
      });
    });

    it("should fill player role fields with isRevealed true when role is villager villager.", () => {
      const createPlayerRoleDto: CreateGamePlayerRoleDto = { name: RoleNames.VILLAGER_VILLAGER };

      expect(playerRoleTransformer({ value: createPlayerRoleDto } as TransformFnParams)).toStrictEqual<CreateGamePlayerRoleDto>({
        name: RoleNames.VILLAGER_VILLAGER,
        original: RoleNames.VILLAGER_VILLAGER,
        current: RoleNames.VILLAGER_VILLAGER,
        isRevealed: true,
      });
    });
  });
});