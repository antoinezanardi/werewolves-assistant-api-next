import type { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { roles } from "../../../../role/constants/role.constant";
import type { Role } from "../../../../role/role.entity";
import type { CreateGamePlayerDto } from "../create-game-player/create-game-player.dto";
import type { CreateGameDto } from "../create-game.dto";

function areCompositionRolesMinInGameRespected(players?: CreateGamePlayerDto[]): boolean {
  if (!Array.isArray(players)) {
    return false;
  }
  return roles
    .filter((role): role is Role & { minInGame: number } => role.minInGame !== undefined)
    .every(role => {
      const roleCount = players.filter(player => player.role === role.name).length;
      return roleCount === 0 || roleCount >= role.minInGame;
    });
}

function getCompositionRolesMinInGameDefaultMessage(): string {
  return "players.role minimum occurrences in game must be reached. Please check `minInGame` property of roles";
}

function CompositionRolesMinInGame(validationOptions?: ValidationOptions) {
  return (object: CreateGameDto, propertyName: keyof CreateGameDto): void => {
    registerDecorator({
      name: "CompositionRolesMinInGame",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: areCompositionRolesMinInGameRespected,
        defaultMessage: getCompositionRolesMinInGameDefaultMessage,
      },
    });
  };
}

export { CompositionRolesMinInGame, areCompositionRolesMinInGameRespected, getCompositionRolesMinInGameDefaultMessage };