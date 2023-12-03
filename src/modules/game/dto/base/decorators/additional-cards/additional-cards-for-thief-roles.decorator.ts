import { registerDecorator } from "class-validator";
import type { ValidationOptions } from "class-validator";

import { ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLES } from "@/modules/role/constants/role.constant";
import type { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";

function areAdditionalCardsForThiefRolesRespected(value: unknown): boolean {
  if (value === undefined) {
    return true;
  }
  const thiefAdditionalCards = value as CreateGameAdditionalCardDto[];
  const eligibleThiefAdditionalCardsRoleNames = ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLES.map(({ name }) => name);
  return thiefAdditionalCards.every(({ roleName }) => eligibleThiefAdditionalCardsRoleNames.includes(roleName));
}

function getAdditionalCardsForThiefRolesDefaultMessage(): string {
  return `additionalCards.roleName must be one of the following values: ${ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLES.toString()}`;
}

function AdditionalCardsForThiefRoles(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: "AdditionalCardsForThiefRoles",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: areAdditionalCardsForThiefRolesRespected,
        defaultMessage: getAdditionalCardsForThiefRolesDefaultMessage,
      },
    });
  };
}

export {
  AdditionalCardsForThiefRoles,
  getAdditionalCardsForThiefRolesDefaultMessage,
  areAdditionalCardsForThiefRolesRespected,
};