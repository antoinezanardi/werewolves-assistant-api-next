import type { ValidationArguments, ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { has } from "lodash";

import { MAX_ADDITIONAL_CARDS_COUNT_FOR_RECIPIENT } from "@/modules/game/constants/game-additional-card/game-additional-card.constants";
import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";

function isAdditionalCardsForActorSizeRespected(value: unknown, validationArguments: ValidationArguments): boolean {
  const { players } = validationArguments.object as CreateGameDto;
  if (value === undefined || !players.some(player => player.role.name === "actor")) {
    return true;
  }
  if (!Array.isArray(value) || value.some(card => !has(card, "recipient"))) {
    return false;
  }
  const cards = value as { recipient: string }[];
  const actorAdditionalCards = cards.filter(card => card.recipient === "actor");

  return actorAdditionalCards.length !== 0 && actorAdditionalCards.length <= MAX_ADDITIONAL_CARDS_COUNT_FOR_RECIPIENT;
}

function getAdditionalCardsForActorSizeDefaultMessage(): string {
  return `additionalCards length for actor must be between 1 and ${MAX_ADDITIONAL_CARDS_COUNT_FOR_RECIPIENT}`;
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