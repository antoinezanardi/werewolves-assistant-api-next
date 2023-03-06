import type { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { roles } from "../../../../role/constants/role.constant";
import { ROLE_SIDES } from "../../../../role/enums/role.enum";
import type { CreateGamePlayerDto } from "../create-game-player/create-game-player.dto";
import type { CreateGameDto } from "../create-game.dto";

function doesCompositionHaveAtLeastOneWerewolf(players?: CreateGamePlayerDto[]): boolean {
  if (!Array.isArray(players)) {
    return false;
  }
  const werewolfRoles = roles.filter(role => role.side === ROLE_SIDES.WEREWOLVES);
  return players.some(({ role }) => werewolfRoles.find(werewolfRole => role === werewolfRole.name));
}

function getCompositionHasWerewolfDefaultMessage(): string {
  return "one of the players.role must have at least one role from `werewolves` side";
}

function CompositionHasWerewolf(validationOptions?: ValidationOptions) {
  return (object: CreateGameDto, propertyName: keyof CreateGameDto): void => {
    registerDecorator({
      name: "CompositionHasWerewolf",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: doesCompositionHaveAtLeastOneWerewolf,
        defaultMessage: getCompositionHasWerewolfDefaultMessage,
      },
    });
  };
}

export { CompositionHasWerewolf, doesCompositionHaveAtLeastOneWerewolf, getCompositionHasWerewolfDefaultMessage };