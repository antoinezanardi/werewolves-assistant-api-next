import { createGameAdditionalCard } from "@/modules/game/helpers/game-additional-card/game-additional-card.factory";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";

import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

describe("Game Additional Card Factory", () => {
  describe("createGameAdditionalCard", () => {
    it("should create an additional game card when called.", () => {
      const gameAdditionalCard: GameAdditionalCard = {
        _id: createFakeObjectId(),
        roleName: "bear-tamer",
        isUsed: false,
        recipient: "thief",
      };

      expect(createGameAdditionalCard(gameAdditionalCard)).toStrictEqual<GameAdditionalCard>(createFakeGameAdditionalCard(gameAdditionalCard));
    });

    it("should create a additional game card without extraneous properties when called.", () => {
      const gameAdditionalCard: GameAdditionalCard = {
        _id: createFakeObjectId(),
        roleName: "bear-tamer",
        isUsed: false,
        recipient: "thief",
      };
      const cardWithExtraProperties = { ...gameAdditionalCard, extra: "extra" };

      expect(createGameAdditionalCard(cardWithExtraProperties)).toStrictEqual<GameAdditionalCard>(createFakeGameAdditionalCard(gameAdditionalCard));
    });
  });
});