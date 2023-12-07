import { getGameAdditionalCardWithRoleNameAndRecipient, getGameAdditionalCardWithRoleNameAndRecipientOrThrow } from "@/modules/game/helpers/game-additional-card/game-additional-card.helper";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";

describe("Game Additional Card Helper", () => {
  describe("getGameAdditionalCardWithRoleNameAndRecipient", () => {
    it("should return a game additional card with the given role name and recipient when called.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.BEAR_TAMER, recipient: RoleNames.THIEF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WITCH, recipient: RoleNames.ACTOR }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WITCH, recipient: RoleNames.THIEF }),
      ];
      const game = createFakeGame({ additionalCards });
      const result = getGameAdditionalCardWithRoleNameAndRecipient(RoleNames.WITCH, RoleNames.THIEF, game);

      expect(result).toStrictEqual<GameAdditionalCard>(additionalCards[2]);
    });

    it("should return undefined when there is no game additional card with the given role name and recipient.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.BEAR_TAMER, recipient: RoleNames.THIEF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.ACTOR }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WITCH, recipient: RoleNames.THIEF }),
      ];
      const game = createFakeGame({ additionalCards });
      const result = getGameAdditionalCardWithRoleNameAndRecipient(RoleNames.WEREWOLF, RoleNames.THIEF, game);

      expect(result).toBeUndefined();
    });
  });

  describe("getGameAdditionalCardWithRoleNameAndRecipientOrThrow", () => {
    it("should return a game additional card with the given role name and recipient when called.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.BEAR_TAMER, recipient: RoleNames.THIEF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WITCH, recipient: RoleNames.ACTOR }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WITCH, recipient: RoleNames.THIEF }),
      ];
      const game = createFakeGame({ additionalCards });
      const error = new Error("Test");
      const result = getGameAdditionalCardWithRoleNameAndRecipientOrThrow(RoleNames.WITCH, RoleNames.THIEF, game, error);

      expect(result).toStrictEqual<GameAdditionalCard>(additionalCards[2]);
    });

    it("should throw an error when there is no game additional card with the given role name and recipient.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard({ roleName: RoleNames.BEAR_TAMER, recipient: RoleNames.THIEF }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WEREWOLF, recipient: RoleNames.ACTOR }),
        createFakeGameAdditionalCard({ roleName: RoleNames.WITCH, recipient: RoleNames.THIEF }),
      ];
      const game = createFakeGame({ additionalCards });
      const error = new Error("Test");

      expect(() => getGameAdditionalCardWithRoleNameAndRecipientOrThrow(RoleNames.WEREWOLF, RoleNames.THIEF, game, error)).toThrow(error);
    });
  });
});