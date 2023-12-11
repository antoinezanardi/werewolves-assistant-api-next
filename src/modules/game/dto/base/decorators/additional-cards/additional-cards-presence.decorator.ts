import { registerDecorator } from "class-validator";
import type { ValidationArguments, ValidationOptions } from "class-validator";

import { GAME_ADDITIONAL_CARDS_RECIPIENTS } from "@/modules/game/constants/game-additional-card/game-additional-card.constant";
import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import type { RoleNames } from "@/modules/role/enums/role.enum";

function isAdditionalCardsPresenceRespected(value: unknown, validationArguments: ValidationArguments): boolean {
  const { players } = validationArguments.object as Partial<CreateGameDto>;
  const gameAdditionalCardsRecipients = GAME_ADDITIONAL_CARDS_RECIPIENTS as Readonly<(RoleNames)[]>;
  const doSomePlayersNeedAdditionalCards = players?.some(player => gameAdditionalCardsRecipients.includes(player.role.name)) === true;
  return doSomePlayersNeedAdditionalCards ? Array.isArray(value) : value === undefined;
}

function getAdditionalCardsPresenceDefaultMessage(validationArguments: ValidationArguments): string {
  if (!Array.isArray(validationArguments.value)) {
    return `additionalCards must be set if there is a player with one of the following roles : ${GAME_ADDITIONAL_CARDS_RECIPIENTS.toString()}`;
  }
  return `additionalCards can't be set if there is no player with one of the following roles : ${GAME_ADDITIONAL_CARDS_RECIPIENTS.toString()}`;
}

function AdditionalCardsPresence(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: "AdditionalCardsPresence",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: isAdditionalCardsPresenceRespected,
        defaultMessage: getAdditionalCardsPresenceDefaultMessage,
      },
    });
  };
}

export {
  isAdditionalCardsPresenceRespected,
  getAdditionalCardsPresenceDefaultMessage,
  AdditionalCardsPresence,
};