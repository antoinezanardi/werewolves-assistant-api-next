import { registerDecorator } from "class-validator";
import type { ValidationOptions } from "class-validator";

import { GAME_ADDITIONAL_CARDS_THIEF_ROLE_NAMES } from "@/modules/game/constants/game-additional-cards/game-additional-cards.constant";
import type { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";

function areAdditionalCardsForThiefRolesRespected(value: unknown): boolean {
  if (value === undefined) {
    return true;
  }
  const thiefAdditionalCards = value as CreateGameAdditionalCardDto[];
  return thiefAdditionalCards.every(({ roleName }) => GAME_ADDITIONAL_CARDS_THIEF_ROLE_NAMES.includes(roleName));
}

function getAdditionalCardsForThiefRolesDefaultMessage(): string {
  return `additionalCards.roleName must be one of the following values: ${GAME_ADDITIONAL_CARDS_THIEF_ROLE_NAMES.toString()}`;
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