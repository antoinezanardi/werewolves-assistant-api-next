import type { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import isObject from "isobject";
import { has } from "lodash";
import { roles } from "../../../../role/constants/role.constant";
import type { ROLE_NAMES } from "../../../../role/enums/role.enum";

function areCompositionRolesMaxInGameRespected(value?: unknown): boolean {
  if (!Array.isArray(value) || value.some(player => !isObject(player) || !has(player, ["role", "name"]))) {
    return false;
  }
  const players = value as { role: { name: ROLE_NAMES } }[];
  return roles.every(role => {
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