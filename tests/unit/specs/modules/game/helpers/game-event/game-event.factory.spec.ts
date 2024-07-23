import { createGameEvent } from "@/modules/game/helpers/game-event/game-event.factory";
import type { GameEvent } from "@/modules/game/schemas/game-event/game-event.schema";
import { createFakeGameEvent } from "@tests/factories/game/schemas/game-event/game-event.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Event Factory", () => {
  describe("createGameEvent", () => {
    it("should create a game event when called.", () => {
      const gameEvent: GameEvent = {
        type: "elder-has-taken-revenge",
        players: [
          createFakePlayer(),
          createFakePlayer(),
          createFakePlayer(),
        ],
      };
      const gameEventWithExtraProperties = { ...gameEvent, extra: "extra" };

      expect(createGameEvent(gameEventWithExtraProperties)).toStrictEqual<GameEvent>(createFakeGameEvent(gameEvent));
    });
  });
});