import type { ValidationArguments, ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { has } from "lodash";

import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";

function isAdditionalCardsForActorSizeRespected(value: unknown, validationArguments: ValidationArguments): boolean {
  const { players, options } = validationArguments.object as CreateGameDto;
  const { additionalCardsCount } = options.roles.actor;
  if (value === undefined || !players.some(player => player.role.name === "actor")) {
    return true;
  }
  if (!Array.isArray(value) || value.some(card => !has(card, "recipient"))) {
    return false;
  }
  const cards = value as { recipient: string }[];
  const actorAdditionalCards = cards.filter(card => card.recipient === "actor");
  return actorAdditionalCards.length === additionalCardsCount;
}

function getAdditionalCardsForActorSizeDefaultMessage(): string {
  return "additionalCards length for actor must be equal to options.roles.actor.additionalCardsCount";
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