import type { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import isObject from "isobject";
import { has } from "lodash";
import { roles } from "../../../../role/constants/role.constant";
import type { ROLE_NAMES } from "../../../../role/enums/role.enum";
import { ROLE_SIDES } from "../../../../role/enums/role.enum";

function doesCompositionHaveAtLeastOneWerewolf(value?: unknown): boolean {
  if (!Array.isArray(value) || value.some(player => !isObject(player) || !has(player, ["role", "name"]))) {
    return false;
  }
  const players = value as { role: { name: ROLE_NAMES } }[];
  const werewolfRoles = roles.filter(role => role.side === ROLE_SIDES.WEREWOLVES);
  return players.some(({ role }) => werewolfRoles.find(werewolfRole => role.name === werewolfRole.name));
}

function getCompositionHasWerewolfDefaultMessage(): string {
  return "one of the players.role must have at least one role from `werewolves` side";
}

function CompositionHasWerewolf(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
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