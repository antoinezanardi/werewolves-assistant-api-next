import { toJSON } from "@/shared/misc/helpers/object.helper";

import { createFakeGamePlay } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";

describe("Object Helper", () => {
  describe("toJSON", () => {
    it("should convert to plain object when called with object.", () => {
      const gamePlay = createFakeGamePlay();

      expect(toJSON(gamePlay)).toStrictEqual<unknown>(JSON.parse(JSON.stringify(gamePlay)));
    });

    it("should convert to plain object when called with array of objects.", () => {
      const gamePlays = [createFakeGamePlay(), createFakeGamePlay()];

      expect(toJSON(gamePlays)).toStrictEqual<unknown>(JSON.parse(JSON.stringify(gamePlays)));
    });
  });
});