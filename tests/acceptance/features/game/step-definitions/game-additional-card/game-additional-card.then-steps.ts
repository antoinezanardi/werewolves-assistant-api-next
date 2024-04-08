import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import type { RoleName } from "@/modules/role/types/role.types";
import type { GameAdditionalCardRecipientRoleName } from "@/modules/game/types/game-additional-card/game-additional-card.types";
import { getGameAdditionalCardWithRoleNameAndRecipientOrThrow } from "@/modules/game/helpers/game-additional-card/game-additional-card.helpers";

import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";

Then(
  /^the game's additional card with role (?<role>.+?) for (?<recipient>thief|actor) should (?<notUsed>not )?be used$/u,
  function(this: CustomWorld, role: RoleName, recipient: GameAdditionalCardRecipientRoleName, notUsed: string | null): void {
    const additionalCard = getGameAdditionalCardWithRoleNameAndRecipientOrThrow(role, recipient, this.game, new Error("Additional card not found"));

    expect(additionalCard.isUsed).toBe(notUsed === null);
  },
);