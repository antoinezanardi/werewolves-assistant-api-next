import type { TransformFnParams } from "class-transformer";

import { toBoolean } from "@/shared/validation/transformers/validation.transformer";

describe("Validation Transformer", () => {
  describe("toBoolean", () => {
    it.each<{ input: { value: unknown }; output: unknown }>([
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
});