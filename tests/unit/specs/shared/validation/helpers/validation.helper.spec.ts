import { doesArrayRespectBounds } from "../../../../../../src/shared/validation/helpers/validation.helper";

describe("Validation Helper", () => {
  describe("doesArrayRespectBounds", () => {
    it("should return true when no bounds are provided.", () => {
      expect(doesArrayRespectBounds([], {})).toBe(true);
    });

    it("should return false when min bound is not respected.", () => {
      expect(doesArrayRespectBounds([], { minItems: 1 })).toBe(false);
    });

    it("should return false when max bound is not respected.", () => {
      expect(doesArrayRespectBounds([1, 2], { maxItems: 1 })).toBe(false);
    });

    it("should return true when min and max bounds are respected.", () => {
      expect(doesArrayRespectBounds([1, 2], { minItems: 1, maxItems: 2 })).toBe(true);
    });
  });
});