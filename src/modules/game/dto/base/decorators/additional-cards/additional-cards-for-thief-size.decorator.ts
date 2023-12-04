import { registerDecorator } from "class-validator";
import type { ValidationArguments, ValidationOptions } from "class-validator";
import { has } from "lodash";

import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { RoleNames } from "@/modules/role/enums/role.enum";

function isAdditionalCardsForThiefSizeRespected(value: unknown, validationArguments: ValidationArguments): boolean {
  const { options } = validationArguments.object as CreateGameDto;
  if (value === undefined) {
    return true;
  }
  if (!Array.isArray(value) || value.some(card => !has(card, "recipient"))) {
    return false;
  }
  const cards = value as { recipient: string }[];
  const thiefAdditionalCards = cards.filter(card => card.recipient === RoleNames.THIEF);
  return thiefAdditionalCards.length === options.roles.thief.additionalCardsCount;
}

function getAdditionalCardsForThiefSizeDefaultMessage(): string {
  return "additionalCards length for thief must be equal to options.roles.thief.additionalCardsCount";
}

function AdditionalCardsForThiefSize(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: "AdditionalCardsForThiefSize",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: isAdditionalCardsForThiefSizeRespected,
        defaultMessage: getAdditionalCardsForThiefSizeDefaultMessage,
      },
    });
  };
}

export {
  AdditionalCardsForThiefSize,
  getAdditionalCardsForThiefSizeDefaultMessage,
  isAdditionalCardsForThiefSizeRespected,
};