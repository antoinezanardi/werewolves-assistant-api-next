import { getPlayerName } from "@/modules/game/dto/base/decorators/composition/composition-unique-names.decorator";

describe("Composition Unique Names Decorator", () => {
  describe("getPlayerName", () => {
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
        test: "should return same value when value doesn't have name field.",
        value: {},
        expected: {},
      },
      {
        test: "should return name when called.",
        value: { name: "Antoine" },
        expected: "Antoine",
      },
    ])("$test", ({ value, expected }) => {
      expect(getPlayerName(value)).toStrictEqual<unknown>(expected);
    });
  });
});