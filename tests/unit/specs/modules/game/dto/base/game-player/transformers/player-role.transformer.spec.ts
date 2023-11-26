import type { TransformFnParams } from "class-transformer/types/interfaces";

import { playerRoleTransformer } from "@/modules/game/dto/base/game-player/transformers/player-role.transformer";
import { RoleNames } from "@/modules/role/enums/role.enum";

describe("Player Role Transformer", () => {
  describe("playerRoleTransformer", () => {
    it.each<{
      test: string;
      value: unknown;
      expected: unknown;
    }>([
      {
        test: "should return null when value is null.",
        value: null,
        expected: null,
      },
      {
        test: "should return same value when value is not an object.",
        value: "toto",
        expected: "toto",
      },
      {
        test: "should return same value when value doesn't have the name field.",
        value: {},
        expected: {},
      },
      {
        test: "should return same value when role is unknown.",
        value: { name: "hello" },
        expected: { name: "hello" },
      },
      {
        test: "should fill player role (seer) fields when called.",
        value: { name: RoleNames.SEER },
        expected: {
          name: RoleNames.SEER,
          original: RoleNames.SEER,
          current: RoleNames.SEER,
          isRevealed: false,
        },
      },
      {
        test: "should fill player role (white-werewolf) fields when called.",
        value: { name: RoleNames.WHITE_WEREWOLF },
        expected: {
          name: RoleNames.WHITE_WEREWOLF,
          original: RoleNames.WHITE_WEREWOLF,
          current: RoleNames.WHITE_WEREWOLF,
          isRevealed: false,
        },
      },
      {
        test: "should fill player role fields with isRevealed true when role is villager villager.",
        value: { name: RoleNames.VILLAGER_VILLAGER },
        expected: {
          name: RoleNames.VILLAGER_VILLAGER,
          original: RoleNames.VILLAGER_VILLAGER,
          current: RoleNames.VILLAGER_VILLAGER,
          isRevealed: true,
        },
      },
    ])("$test", ({ value, expected }) => {
      expect(playerRoleTransformer({ value } as TransformFnParams)).toStrictEqual<unknown>(expected);
    });
  });
});