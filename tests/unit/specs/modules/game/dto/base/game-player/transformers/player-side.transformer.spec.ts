import type { TransformFnParams } from "class-transformer/types/interfaces";

import { playerSideTransformer } from "@/modules/game/dto/base/game-player/transformers/player-side.transformer";
import { RoleSides } from "@/modules/role/enums/role.enum";

import { createFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Player Side Transformer", () => {
  describe("playerSideTransformer", () => {
    it.each<{
      test: string;
      value: unknown;
      obj: unknown;
      expected: unknown;
    }>([
      {
        test: "should return null when value is null.",
        value: null,
        obj: createFakeCreateGamePlayerDto({ role: { name: "white-werewolf" } }),
        expected: null,
      },
      {
        test: "should return same value when value is not an object.",
        value: "toto",
        obj: createFakeCreateGamePlayerDto({ role: { name: "white-werewolf" } }),
        expected: "toto",
      },
      {
        test: "should return same value when obj is not an object.",
        value: {},
        obj: null,
        expected: {},
      },
      {
        test: "should return same value when obj doesn't have the role.name field.",
        value: {},
        obj: { role: { toto: "witch" } },
        expected: {},
      },
      {
        test: "should return same value when role is unknown.",
        value: {},
        obj: { role: { name: "hello" } },
        expected: {},
      },
      {
        test: "should fill player side with werewolf data when role is white werewolf.",
        value: {},
        obj: createFakeCreateGamePlayerDto({ role: { name: "white-werewolf" } }),
        expected: {
          current: RoleSides.WEREWOLVES,
          original: RoleSides.WEREWOLVES,
        },
      },
      {
        test: "should fill player side with villager data when role is witch.",
        value: {},
        obj: createFakeCreateGamePlayerDto({ role: { name: "witch" } }),
        expected: {
          current: RoleSides.VILLAGERS,
          original: RoleSides.VILLAGERS,
        },
      },
    ])("$test", ({ value, obj, expected }) => {
      expect(playerSideTransformer({ value, obj } as TransformFnParams)).toStrictEqual<unknown>(expected);
    });
  });
});