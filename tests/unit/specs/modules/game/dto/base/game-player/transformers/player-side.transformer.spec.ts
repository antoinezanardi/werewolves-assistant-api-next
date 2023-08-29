import type { TransformFnParams } from "class-transformer/types/interfaces";

import { playerSideTransformer } from "@/modules/game/dto/base/game-player/transformers/player-side.transformer";
import type { CreateGamePlayerSideDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player-side/create-game-player-side.dto";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Player Side Transformer", () => {
  describe("playerSideTransformer", () => {
    it("should return null when value is null.", () => {
      const player = createFakeCreateGamePlayerDto({ role: { name: RoleNames.WHITE_WEREWOLF } });

      expect(playerSideTransformer({ value: null, obj: player } as TransformFnParams)).toBeNull();
    });

    it("should return same value when value is not an object.", () => {
      const player = createFakeCreateGamePlayerDto({ role: { name: RoleNames.WHITE_WEREWOLF } });

      expect(playerSideTransformer({ value: "toto", obj: player } as TransformFnParams)).toBe("toto");
    });

    it("should return same value when obj is not an object.", () => {
      expect(playerSideTransformer({ value: {}, obj: null } as TransformFnParams)).toStrictEqual({});
    });

    it("should return same value when obj doesn't have the role.name field.", () => {
      expect(playerSideTransformer({ value: {}, obj: { role: { toto: RoleNames.WITCH } } } as TransformFnParams)).toStrictEqual({});
    });

    it("should return same value when role is unknown.", () => {
      expect(playerSideTransformer({ value: {}, obj: { role: { name: "hello" } } } as TransformFnParams)).toStrictEqual({});
    });

    it("should fill player side with werewolf data when role is white werewolf.", () => {
      const player = createFakeCreateGamePlayerDto({ role: { name: RoleNames.WHITE_WEREWOLF } });

      expect(playerSideTransformer({ value: {}, obj: player } as TransformFnParams)).toStrictEqual<CreateGamePlayerSideDto>({
        current: RoleSides.WEREWOLVES,
        original: RoleSides.WEREWOLVES,
      });
    });

    it("should fill player side with villager data when role is witch.", () => {
      const player = createFakeCreateGamePlayerDto({ role: { name: RoleNames.WITCH } });

      expect(playerSideTransformer({ value: {}, obj: player } as TransformFnParams)).toStrictEqual<CreateGamePlayerSideDto>({
        current: RoleSides.VILLAGERS,
        original: RoleSides.VILLAGERS,
      });
    });
  });
});