import { MAX_ADDITIONAL_CARDS_COUNT_FOR_RECIPIENT } from "@/modules/game/constants/game-additional-card/game-additional-card.constants";
import type { ValidationArguments, ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { has } from "lodash";

import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";

function isAdditionalCardsForThiefSizeRespected(value: unknown, validationArguments: ValidationArguments): boolean {
  const { players } = validationArguments.object as CreateGameDto;
  if (value === undefined || !players.some(player => player.role.name === "thief")) {
    return true;
  }
  if (!Array.isArray(value) || value.some(card => !has(card, "recipient"))) {
    return false;
  }
  const cards = value as { recipient: string }[];
  const thiefAdditionalCards = cards.filter(card => card.recipient === "thief");

  return thiefAdditionalCards.length !== 0 && thiefAdditionalCards.length <= MAX_ADDITIONAL_CARDS_COUNT_FOR_RECIPIENT;
}

function getAdditionalCardsForThiefSizeDefaultMessage(): string {
  return `additionalCards length for thief must be between 1 and ${MAX_ADDITIONAL_CARDS_COUNT_FOR_RECIPIENT}`;
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