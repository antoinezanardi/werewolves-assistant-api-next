import type { ValidationArguments, ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { ROLE_NAMES } from "../../../../../role/enums/role.enum";
import type { CreateGameDto } from "../../../create-game/create-game.dto";

function isAdditionalCardsPresenceRespected(value: unknown, validationArguments: ValidationArguments): boolean {
  const { players } = validationArguments.object as Partial<CreateGameDto>;
  const doSomePlayersNeedAdditionalCards = players?.some(player => player.role.name === ROLE_NAMES.THIEF) === true;
  return doSomePlayersNeedAdditionalCards ? Array.isArray(value) : value === undefined;
}

function getAdditionalCardsPresenceDefaultMessage(validationArguments: ValidationArguments): string {
  if (!Array.isArray(validationArguments.value)) {
    return "additionalCards must be set if there is a player with role `thief`";
  }
  return "additionalCards can't be set if there is no player with role `thief`";
}

function AdditionalCardsPresence(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: "AdditionalCardsForThiefSize",
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