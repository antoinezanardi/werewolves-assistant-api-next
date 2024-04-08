import { getGameAdditionalCardWithRoleNameAndRecipient, getGameAdditionalCardWithRoleNameAndRecipientOrThrow } from "@/modules/game/helpers/game-additional-card/game-additional-card.helpers";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";

import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";

describe("Game Additional Card Helper", () => {
  describe("getGameAdditionalCardWithRoleNameAndRecipient", () => {
    it("should return a game additional card with the given role name and recipient when called.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: "bear-tamer", recipient: "thief" }),
        createFakeGameAdditionalCard({ roleName: "witch", recipient: "actor" }),
        createFakeGameAdditionalCard({ roleName: "witch", recipient: "thief" }),
      ];
      const game = createFakeGame({ additionalCards });
      const result = getGameAdditionalCardWithRoleNameAndRecipient("witch", "thief", game);

      expect(result).toStrictEqual<GameAdditionalCard>(additionalCards[2]);
    });

    it("should return undefined when there is no game additional card with the given role name and recipient.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: "bear-tamer", recipient: "thief" }),
        createFakeGameAdditionalCard({ roleName: "werewolf", recipient: "actor" }),
        createFakeGameAdditionalCard({ roleName: "witch", recipient: "thief" }),
      ];
      const game = createFakeGame({ additionalCards });
      const result = getGameAdditionalCardWithRoleNameAndRecipient("werewolf", "thief", game);

      expect(result).toBeUndefined();
    });
  });

  describe("getGameAdditionalCardWithRoleNameAndRecipientOrThrow", () => {
    it("should return a game additional card with the given role name and recipient when called.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: "bear-tamer", recipient: "thief" }),
        createFakeGameAdditionalCard({ roleName: "witch", recipient: "actor" }),
        createFakeGameAdditionalCard({ roleName: "witch", recipient: "thief" }),
      ];
      const game = createFakeGame({ additionalCards });
      const error = new Error("Test");
      const result = getGameAdditionalCardWithRoleNameAndRecipientOrThrow("witch", "thief", game, error);

      expect(result).toStrictEqual<GameAdditionalCard>(additionalCards[2]);
    });

    it("should throw an error when there is no game additional card with the given role name and recipient.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: "bear-tamer", recipient: "thief" }),
        createFakeGameAdditionalCard({ roleName: "werewolf", recipient: "actor" }),
        createFakeGameAdditionalCard({ roleName: "witch", recipient: "thief" }),
      ];
      const game = createFakeGame({ additionalCards });
      const error = new Error("Test");

      expect(() => getGameAdditionalCardWithRoleNameAndRecipientOrThrow("werewolf", "thief", game, error)).toThrow(error);
    });
  });
});