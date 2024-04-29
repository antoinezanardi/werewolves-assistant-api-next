import type { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { has } from "lodash";

import type { RoleName } from "@/modules/role/types/role.types";
import { ROLES } from "@/modules/role/constants/role-set.constants";

function doesCompositionHaveAtLeastOneWerewolf(value?: unknown): boolean {
  if (!Array.isArray(value) || value.some(player => !has(player, ["role", "name"]))) {
    return false;
  }
  const players = value as { role: { name: RoleName } }[];
  const werewolfRoles = ROLES.filter(role => role.side === "werewolves");

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