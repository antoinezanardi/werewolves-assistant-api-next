import { registerDecorator } from "class-validator";
import type { ValidationArguments, ValidationOptions } from "class-validator";

import type { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";
import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { roles } from "@/modules/role/constants/role.constant";

function areAdditionalCardsRolesMaxInGameRespected(value: unknown, validationArguments: ValidationArguments): boolean {
  if (value === undefined) {
    return true;
  }
  const { players } = validationArguments.object as Partial<CreateGameDto>;
  if (players === undefined) {
    return false;
  }
  const additionalCards = value as CreateGameAdditionalCardDto[];
  return roles.every(role => {
    const playersRoleCount = players.filter(player => player.role.name === role.name).length;
    const additionalCardsRoleCount = additionalCards.filter(additionalCard => additionalCard.roleName === role.name).length;
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