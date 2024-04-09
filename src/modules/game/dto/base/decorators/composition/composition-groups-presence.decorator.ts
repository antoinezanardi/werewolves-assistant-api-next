import type { ValidationArguments, ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { has } from "lodash";

import type { RoleName } from "@/modules/role/types/role.types";
import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";

function isCompositionGroupsExistenceRespected(value: unknown): boolean {
  if (!Array.isArray(value) || value.some(player => !has(player, ["role", "name"]))) {
    return false;
  }
  const players = value as { role: { name: RoleName }; group?: string }[];
  const doesCompositionHasPrejudicedManipulator = players.some(({ role }) => role.name === "prejudiced-manipulator");
  const doesSomePlayerHaveAGroup = players.some(({ group }) => group !== undefined);
  const doesEveryPlayerHaveAGroup = players.every(({ group }) => group !== undefined);
  return doesCompositionHasPrejudicedManipulator && doesEveryPlayerHaveAGroup || !doesCompositionHasPrejudicedManipulator && !doesSomePlayerHaveAGroup;
}

function getCompositionGroupsPresenceDefaultMessage(validationArguments: ValidationArguments): string {
  const { players } = validationArguments.object as Partial<CreateGameDto>;
  const doesCompositionHasPrejudicedManipulator = players?.some(({ role }) => role.name === "prejudiced-manipulator") === true;
  if (doesCompositionHasPrejudicedManipulator) {
    return `each player must have a group if there is a player with role \`${"prejudiced-manipulator"}\``;
  }
  return `any player can't have a group if there is no player with role \`${"prejudiced-manipulator"}\``;
}

function CompositionGroupsPresence(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: "CompositionGroupsConsistency",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: isCompositionGroupsExistenceRespected,
        defaultMessage: getCompositionGroupsPresenceDefaultMessage,
      },
    });
  };
}

export {
  CompositionGroupsPresence,
  isCompositionGroupsExistenceRespected,
  getCompositionGroupsPresenceDefaultMessage,
};