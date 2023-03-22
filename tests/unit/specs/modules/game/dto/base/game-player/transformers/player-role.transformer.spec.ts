import type { TransformFnParams } from "class-transformer/types/interfaces";
import { playerRoleTransformer } from "../../../../../../../../../src/modules/game/dto/base/game-player/transformers/player-role.transformer";
import type { CreateGamePlayerRoleDto } from "../../../../../../../../../src/modules/game/dto/create-game/create-game-player/create-game-player-role.dto/create-game-player-role.dto";
import { ROLE_NAMES } from "../../../../../../../../../src/modules/role/enums/role.enum";

describe("Player Role Transformer", () => {
  describe("playerRoleTransformer", () => {
    it("should fill player role (seer) fields when called.", () => {
      const createPlayerRoleDto: CreateGamePlayerRoleDto = { name: ROLE_NAMES.SEER };
      expect(playerRoleTransformer({ value: createPlayerRoleDto } as TransformFnParams)).toStrictEqual<CreateGamePlayerRoleDto>({
        name: ROLE_NAMES.SEER,
        original: ROLE_NAMES.SEER,
        current: ROLE_NAMES.SEER,
        isRevealed: false,
      });
    });

    it("should fill player role (white-werewolf) fields when called.", () => {
      const createPlayerRoleDto: CreateGamePlayerRoleDto = { name: ROLE_NAMES.WHITE_WEREWOLF };
      expect(playerRoleTransformer({ value: createPlayerRoleDto } as TransformFnParams)).toStrictEqual<CreateGamePlayerRoleDto>({
        name: ROLE_NAMES.WHITE_WEREWOLF,
        original: ROLE_NAMES.WHITE_WEREWOLF,
        current: ROLE_NAMES.WHITE_WEREWOLF,
        isRevealed: false,
      });
    });

    it("should fill player role fields with isRevealed true when role is villager villager.", () => {
      const createPlayerRoleDto: CreateGamePlayerRoleDto = { name: ROLE_NAMES.VILLAGER_VILLAGER };
      expect(playerRoleTransformer({ value: createPlayerRoleDto } as TransformFnParams)).toStrictEqual<CreateGamePlayerRoleDto>({
        name: ROLE_NAMES.VILLAGER_VILLAGER,
        original: ROLE_NAMES.VILLAGER_VILLAGER,
        current: ROLE_NAMES.VILLAGER_VILLAGER,
        isRevealed: true,
      });
    });
  });
});