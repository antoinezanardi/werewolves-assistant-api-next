import { getPlayerName } from "@/modules/game/dto/base/decorators/composition/composition-unique-names.decorator";

describe("Composition Unique Names Decorator", () => {
  describe("getPlayerName", () => {
    it("should return same value when value is null.", () => {
      expect(getPlayerName(null)).toBeNull();
    });

    it("should return same value when value is not an object.", () => {
      expect(getPlayerName("tata")).toBe("tata");
    });

    it("should return same value when value doesn't have name field.", () => {
      expect(getPlayerName({ toto: "tata" })).toStrictEqual({ toto: "tata" });
    });

    it("should return name when called.", () => {
      expect(getPlayerName({ name: "Antoine" })).toBe("Antoine");
    });
  });
});