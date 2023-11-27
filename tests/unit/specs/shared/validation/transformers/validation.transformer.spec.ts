import type { TransformFnParams } from "class-transformer";

import { toBoolean, toObjectId } from "@/shared/validation/transformers/validation.transformer";

import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

describe("Validation Transformer", () => {
  describe("toBoolean", () => {
    it.each<{
      test: string;
      input: {
        value: unknown;
      };
      expected: unknown;
    }>([
      {
        test: "should return true when input is true as string.",
        input: { value: "true" },
        expected: true,
      },
      {
        test: "should return false when input is false as string.",
        input: { value: "false" },
        expected: false,
      },
      {
        test: "should return false2 when input is true as false2.",
        input: { value: "false2" },
        expected: "false2",
      },
      {
        test: "should return true when input is true.",
        input: { value: true },
        expected: true,
      },
      {
        test: "should return false when input is false.",
        input: { value: false },
        expected: false,
      },
      {
        test: "should return 0 when input is 0.",
        input: { value: 0 },
        expected: 0,
      },
      {
        test: "should return 1 when input is 1.",
        input: { value: 1 },
        expected: 1,
      },
    ])("$test", ({ input, expected }) => {
      expect(toBoolean(input as TransformFnParams)).toBe(expected);
    });
  });

  describe("toObjectId", () => {
    it.each<{
      test: string;
      input: { obj: unknown };
      expected: unknown;
    }>([
      {
        test: "should return undefined when input is null.",
        input: { obj: null },
        expected: undefined,
      },
      {
        test: "should return undefined when input is malformed.",
        input: { obj: { toto: "tata" } },
        expected: undefined,
      },
      {
        test: "should return null when input id is null.",
        input: { obj: { _id: null } },
        expected: null,
      },
      {
        test: "should return objectId when input id is valid objectId.",
        input: { obj: { _id: "5f9d7a3b9d6f9b1d6c6c6c6c" } },
        expected: createFakeObjectId("5f9d7a3b9d6f9b1d6c6c6c6c"),
      },
    ])("$test", ({ input, expected }) => {
      expect(toObjectId(input as TransformFnParams)).toStrictEqual<unknown>(expected);
    });
  });
});