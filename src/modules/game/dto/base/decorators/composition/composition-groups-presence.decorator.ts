import type { ValidationOptions, ValidationArguments } from "class-validator";
import { registerDecorator } from "class-validator";
import isObject from "isobject";
import { has } from "lodash";

import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { RoleNames } from "@/modules/role/enums/role.enum";

function isCompositionGroupsExistenceRespected(value: unknown): boolean {
  if (!Array.isArray(value) || value.some(player => !isObject(player) || !has(player, ["role", "name"]))) {
    return false;
  }
  const players = value as { role: { name: RoleNames }; group?: string }[];
  const doesCompositionHasPrejudicedManipulator = players.some(({ role }) => role.name === RoleNames.PREJUDICED_MANIPULATOR);
  const doesSomePlayerHaveAGroup = players.some(({ group }) => group !== undefined);
  const doesEveryPlayerHaveAGroup = players.every(({ group }) => group !== undefined);
  return doesCompositionHasPrejudicedManipulator && doesEveryPlayerHaveAGroup || !doesCompositionHasPrejudicedManipulator && !doesSomePlayerHaveAGroup;
}

function getCompositionGroupsPresenceDefaultMessage(validationArguments: ValidationArguments): string {
  const { players } = validationArguments.object as Partial<CreateGameDto>;
  const doesCompositionHasPrejudicedManipulator = players?.some(({ role }) => role.name === RoleNames.PREJUDICED_MANIPULATOR) === true;
  if (doesCompositionHasPrejudicedManipulator) {
    return `each player must have a group if there is a player with role \`${RoleNames.PREJUDICED_MANIPULATOR}\``;
  }
  return `any player can't have a group if there is no player with role \`${RoleNames.PREJUDICED_MANIPULATOR}\``;
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