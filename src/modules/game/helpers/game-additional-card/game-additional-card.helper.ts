import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { GameAdditionalCardRecipientRoleName } from "@/modules/game/types/game-additional-card.types";
import type { RoleNames } from "@/modules/role/enums/role.enum";

function getGameAdditionalCardWithRoleNameAndRecipient(roleName: RoleNames, recipient: GameAdditionalCardRecipientRoleName, game: Game): GameAdditionalCard | undefined {
  return game.additionalCards?.find(card => card.roleName === roleName && card.recipient === recipient);
}

function getGameAdditionalCardWithRoleNameAndRecipientOrThrow(
  roleName: RoleNames,
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