import { doesArrayRespectBounds } from "@/shared/validation/helpers/validation.helpers";

describe("Validation Helper", () => {
  describe("doesArrayRespectBounds", () => {
    it.each<{
      test: string;
      array: number[];
      bounds: { minItems?: number; maxItems?: number };
      expected: boolean;
    }>([
      {
        test: "should return true when no bounds are provided.",
        array: [],
        bounds: {},
        expected: true,
      },
      {
        test: "should return false when min bound is not respected.",
        array: [],
        bounds: { minItems: 1 },
        expected: false,
      },
      {
        test: "should return false when max bound is not respected.",
        array: [1, 2],
        bounds: { maxItems: 1 },
        expected: false,
      },
      {
        test: "should return false when min and max bounds are respected.",
        array: [1, 2],
        bounds: { minItems: 1, maxItems: 2 },
        expected: true,
      },
    ])("$test", ({ array, bounds, expected }) => {
      expect(doesArrayRespectBounds(array, bounds)).toBe(expected);
    });
  });
});