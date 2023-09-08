import type { TransformFnParams } from "class-transformer";

import { toBoolean, toObjectId } from "@/shared/validation/transformers/validation.transformer";

import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

describe("Validation Transformer", () => {
  describe("toBoolean", () => {
    it.each<{
      input: {
        value: unknown;
      };
      output: unknown;
    }>([
      { input: { value: "true" }, output: true },
      { input: { value: "false" }, output: false },
      { input: { value: "false2" }, output: "false2" },
      { input: { value: true }, output: true },
      { input: { value: false }, output: false },
      { input: { value: 0 }, output: 0 },
      { input: { value: 1 }, output: 1 },
    ])(`should return $output when input is $input [#$#].`, ({ input, output }) => {
      expect(toBoolean(input as TransformFnParams)).toBe(output);
    });
  });

  describe("toObjectId", () => {
    it.each<{
      input: { obj: unknown };
      output: unknown;
    }>([
      { input: { obj: null }, output: undefined },
      { input: { obj: { toto: "tata" } }, output: undefined },
      { input: { obj: { _id: null } }, output: null },
      { input: { obj: { _id: "5f9d7a3b9d6f9b1d6c6c6c6c" } }, output: createFakeObjectId("5f9d7a3b9d6f9b1d6c6c6c6c") },
    ])(`should return $output when input is $input [#$#].`, ({ input, output }) => {
      expect(toObjectId(input as TransformFnParams)).toStrictEqual(output);
    });
  });
});