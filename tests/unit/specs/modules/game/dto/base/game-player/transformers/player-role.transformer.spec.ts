import type { TransformFnParams } from "class-transformer/types/interfaces";

import { playerRoleTransformer } from "@/modules/game/dto/base/game-player/transformers/player-role.transformer";

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
        value: { name: "seer" },
        expected: {
          name: "seer",
          original: "seer",
          current: "seer",
          isRevealed: false,
        },
      },
      {
        test: "should fill player role (white-werewolf) fields when called.",
        value: { name: "white-werewolf" },
        expected: {
          name: "white-werewolf",
          original: "white-werewolf",
          current: "white-werewolf",
          isRevealed: false,
        },
      },
      {
        test: "should fill player role fields with isRevealed true when role is villager villager.",
        value: { name: "villager-villager" },
        expected: {
          name: "villager-villager",
          original: "villager-villager",
          current: "villager-villager",
          isRevealed: true,
        },
      },
    ])("$test", ({ value, expected }) => {
      expect(playerRoleTransformer({ value } as TransformFnParams)).toStrictEqual<unknown>(expected);
    });
  });
});