import { registerDecorator } from "class-validator";
import { has } from "lodash";
import type { ValidationOptions } from "class-validator";

import type { RoleName } from "@/modules/role/types/role.types";
import { ROLES } from "@/modules/role/constants/role-set.constants";

function areCompositionRolesMaxInGameRespected(value?: unknown): boolean {
  if (!Array.isArray(value) || value.some(player => !has(player, ["role", "name"]))) {
    return false;
  }
  const players = value as { role: { name: RoleName } }[];

  return ROLES.every(role => {
    const roleCount = players.filter(player => player.role.name === role.name).length;

    return roleCount <= role.maxInGame;
  });
}

function getCompositionRolesMaxInGameDefaultMessage(): string {
  return "players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles";
}

function CompositionRolesMaxInGame(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
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