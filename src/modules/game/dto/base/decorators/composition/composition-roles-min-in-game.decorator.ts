import { registerDecorator } from "class-validator";
import isObject from "isobject";
import { has } from "lodash";
import type { ValidationOptions } from "class-validator";

import { roles } from "@/modules/role/constants/role.constant";
import type { ROLE_NAMES } from "@/modules/role/enums/role.enum";
import type { Role } from "@/modules/role/types/role.type";

function areCompositionRolesMinInGameRespected(value?: unknown): boolean {
  if (!Array.isArray(value) || value.some(player => !isObject(player) || !has(player, ["role", "name"]))) {
    return false;
  }
  const players = value as { role: { name: ROLE_NAMES } }[];
  return roles
    .filter((role): role is Role & { minInGame: number } => role.minInGame !== undefined)
    .every(role => {
      const roleCount = players.filter(player => player.role.name === role.name).length;
      return roleCount === 0 || roleCount >= role.minInGame;
    });
}

function getCompositionRolesMinInGameDefaultMessage(): string {
  return "players.role minimum occurrences in game must be reached. Please check `minInGame` property of roles";
}

function CompositionRolesMinInGame(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
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