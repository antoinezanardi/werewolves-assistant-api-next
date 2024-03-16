import { registerDecorator } from "class-validator";
import type { ValidationOptions } from "class-validator";

import { RoleNames } from "@/modules/role/enums/role.enum";
import { ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLE_NAMES, ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLES } from "@/modules/role/constants/role.constants";
import type { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";

function areAdditionalCardsForThiefRolesRespected(value: unknown): boolean {
  if (value === undefined) {
    return true;
  }
  const additionalCards = value as CreateGameAdditionalCardDto[];
  const thiefAdditionalCards = additionalCards.filter(({ recipient }) => recipient === RoleNames.THIEF);
  const eligibleThiefAdditionalCardsRoleNames = ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLES.map(({ name }) => name);
  return thiefAdditionalCards.every(({ roleName }) => eligibleThiefAdditionalCardsRoleNames.includes(roleName));
}

function getAdditionalCardsForThiefRolesDefaultMessage(): string {
  return `additionalCards.roleName for thief must be one of the following values: ${ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLE_NAMES.toString()}`;
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