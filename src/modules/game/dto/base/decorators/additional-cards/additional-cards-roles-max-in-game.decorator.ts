import { registerDecorator } from "class-validator";
import type { ValidationArguments, ValidationOptions } from "class-validator";

import type { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";
import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { ROLES } from "@/modules/role/constants/role.constants";

function areAdditionalCardsRolesMaxInGameRespected(value: unknown, validationArguments: ValidationArguments): boolean {
  if (value === undefined) {
    return true;
  }
  const { players } = validationArguments.object as Partial<CreateGameDto>;
  if (players === undefined) {
    return false;
  }
  const additionalCards = value as CreateGameAdditionalCardDto[];
  return additionalCards.every(additionalCard => {
    const role = ROLES.find(({ name }) => name === additionalCard.roleName);
    if (role === undefined) {
      return false;
    }
    const playersRoleCount = players.filter(player => player.role.name === role.name).length;
    const additionalCardsRoleCount = additionalCards.filter(({ roleName }) => roleName === role.name).length;
    return playersRoleCount + additionalCardsRoleCount <= role.maxInGame;
  });
}

function getAdditionalCardsRolesMaxInGameDefaultMessage(): string {
  return "additionalCards.roleName can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles";
}

function AdditionalCardsRolesMaxInGame(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: "AdditionalCardsRolesMaxInGame",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: areAdditionalCardsRolesMaxInGameRespected,
        defaultMessage: getAdditionalCardsRolesMaxInGameDefaultMessage,
      },
    });
  };
}

export {
  AdditionalCardsRolesMaxInGame,
  areAdditionalCardsRolesMaxInGameRespected,
  getAdditionalCardsRolesMaxInGameDefaultMessage,
};