import { registerDecorator } from "class-validator";
import type { ValidationArguments, ValidationOptions } from "class-validator";

import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";

function isAdditionalCardsForThiefSizeRespected(value: unknown, validationArguments: ValidationArguments): boolean {
  const { options } = validationArguments.object as CreateGameDto;
  if (value === undefined) {
    return true;
  }
  if (!Array.isArray(value)) {
    return false;
  }
  return options.roles.thief.additionalCardsCount === value.length;
}

function getAdditionalCardsForThiefSizeDefaultMessage(): string {
  return "additionalCards length must be equal to options.roles.thief.additionalCardsCount";
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