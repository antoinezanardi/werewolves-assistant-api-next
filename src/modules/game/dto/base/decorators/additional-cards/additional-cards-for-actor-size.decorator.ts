import { registerDecorator } from "class-validator";
import type { ValidationOptions, ValidationArguments } from "class-validator";
import { has } from "lodash";

import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { RoleNames } from "@/modules/role/enums/role.enum";

function isAdditionalCardsForActorSizeRespected(value: unknown, validationArguments: ValidationArguments): boolean {
  const { players } = validationArguments.object as CreateGameDto;
  const actorAdditionalCardsExpectedSize = 3;
  if (value === undefined || !players.some(player => player.role.name === RoleNames.ACTOR)) {
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