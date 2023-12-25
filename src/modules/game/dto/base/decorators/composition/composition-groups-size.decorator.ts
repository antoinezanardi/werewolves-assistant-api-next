import type { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import isObject from "isobject";

function isCompositionGroupsSizeRespected(value: unknown): boolean {
  if (!Array.isArray(value) || value.some(player => !isObject(player))) {
    return false;
  }
  const players = value as { group?: string }[];
  const groupPlayers: Record<string, number> = {};
  players.forEach(({ group }) => {
    if (group !== undefined) {
      if (!groupPlayers[group]) {
        groupPlayers[group] = 0;
      }
      groupPlayers[group]++;
    }
  });
  const minPlayersInGroupCount = 2;
  return Object.values(groupPlayers).every(groupPlayersCount => groupPlayersCount >= minPlayersInGroupCount);
}

function getCompositionGroupsSizeDefaultMessage(): string {
  return "groups among players must contain at least two players when there is a prejudiced manipulator in the game";
}

function CompositionGroupsSize(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: "CompositionGroupsSize",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: isCompositionGroupsSizeRespected,
        defaultMessage: getCompositionGroupsSizeDefaultMessage,
      },
    });
  };
}

export {
  CompositionGroupsSize,
  isCompositionGroupsSizeRespected,
  getCompositionGroupsSizeDefaultMessage,
};