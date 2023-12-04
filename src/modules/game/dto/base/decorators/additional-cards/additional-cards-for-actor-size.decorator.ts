import { registerDecorator } from "class-validator";
import type { ValidationOptions } from "class-validator";
import { has } from "lodash";

import { RoleNames } from "@/modules/role/enums/role.enum";

function isAdditionalCardsForActorSizeRespected(value: unknown): boolean {
  const actorAdditionalCardsExpectedSize = 3;
  if (value === undefined) {
    return true;
  }
  if (!Array.isArray(value) || value.some(card => !has(card, "recipient"))) {
    return false;
  }
  const cards = value as { recipient: string }[];
  const actorAdditionalCards = cards.filter(card => card.recipient === RoleNames.ACTOR);
  return actorAdditionalCards.length === actorAdditionalCardsExpectedSize;
}

function getAdditionalCardsForActorSizeDefaultMessage(): string {
  return "additionalCards length for actor must be equal to 3";
}

function AdditionalCardsForActorSize(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: "AdditionalCardsForActorSize",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: isAdditionalCardsForActorSizeRespected,
        defaultMessage: getAdditionalCardsForActorSizeDefaultMessage,
      },
    });
  };
}

export {
  AdditionalCardsForActorSize,
  getAdditionalCardsForActorSizeDefaultMessage,
  isAdditionalCardsForActorSizeRespected,
};