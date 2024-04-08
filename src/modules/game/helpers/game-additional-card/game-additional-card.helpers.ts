import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { GameAdditionalCardRecipientRoleName } from "@/modules/game/types/game-additional-card/game-additional-card.types";
import type { RoleName } from "@/modules/role/types/role.types";

function getGameAdditionalCardWithRoleNameAndRecipient(roleName: RoleName, recipient: GameAdditionalCardRecipientRoleName, game: Game): GameAdditionalCard | undefined {
  return game.additionalCards?.find(card => card.roleName === roleName && card.recipient === recipient);
}

function getGameAdditionalCardWithRoleNameAndRecipientOrThrow(
  roleName: RoleName,
  recipient: GameAdditionalCardRecipientRoleName,
  game: Game,
  exception: Error,
): GameAdditionalCard {
  const card = getGameAdditionalCardWithRoleNameAndRecipient(roleName, recipient, game);
  if (!card) {
    throw exception;
  }
  return card;
}

export {
  getGameAdditionalCardWithRoleNameAndRecipient,
  getGameAdditionalCardWithRoleNameAndRecipientOrThrow,
};