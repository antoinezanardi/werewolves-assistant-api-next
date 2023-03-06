import type { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { roles } from "../../../../role/constants/role.constant";
import type { CreateGamePlayerDto } from "../create-game-player/create-game-player.dto";
import type { CreateGameDto } from "../create-game.dto";

function areCompositionRolesMaxInGameRespected(players?: CreateGamePlayerDto[]): boolean {
  if (!Array.isArray(players)) {
    return false;
  }
  return roles.every(role => {
    const roleCount = players.filter(player => player.role === role.name).length;
    return roleCount <= role.maxInGame;
  });
}

function getCompositionRolesMaxInGameDefaultMessage(): string {
  return "players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles";
}

function CompositionRolesMaxInGame(validationOptions?: ValidationOptions) {
  return (object: CreateGameDto, propertyName: keyof CreateGameDto): void => {
    registerDecorator({
      name: "CompositionRolesMaxInGame",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: areCompositionRolesMaxInGameRespected,
        defaultMessage: getCompositionRolesMaxInGameDefaultMessage,
      },
    });
  };
}

export { CompositionRolesMaxInGame, areCompositionRolesMaxInGameRespected, getCompositionRolesMaxInGameDefaultMessage };