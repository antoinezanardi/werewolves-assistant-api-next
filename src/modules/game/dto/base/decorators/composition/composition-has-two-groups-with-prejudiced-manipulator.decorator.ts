import type { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { has } from "lodash";

import type { RoleName } from "@/modules/role/types/role.types";

function doesCompositionHasTwoGroupsWithPrejudicedManipulator(value: unknown): boolean {
  if (!Array.isArray(value) || value.some(player => !has(player, ["role", "name"]))) {
    return false;
  }
  const players = value as { role: { name: RoleName }; group?: string }[];
  const doesCompositionHasPrejudicedManipulator = players.some(({ role }) => role.name === "prejudiced-manipulator");
  const distinctGroups = [...new Set(players.map(({ group }) => group))];
  const expectedDistinctGroupsCount = 2;

  return !doesCompositionHasPrejudicedManipulator || distinctGroups.length === expectedDistinctGroupsCount;
}

function getCompositionHasTwoGroupsWithPrejudicedManipulatorDefaultMessage(): string {
  return `there must be exactly two groups among players when \`prejudiced-manipulator\` in the game`;
}

function CompositionHasTwoGroupsWithPrejudicedManipulator(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: "CompositionHasTwoGroupsWithPrejudicedManipulator",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: doesCompositionHasTwoGroupsWithPrejudicedManipulator,
        defaultMessage: getCompositionHasTwoGroupsWithPrejudicedManipulatorDefaultMessage,
      },
    });
  };
}

export {
  CompositionHasTwoGroupsWithPrejudicedManipulator,
  doesCompositionHasTwoGroupsWithPrejudicedManipulator,
  getCompositionHasTwoGroupsWithPrejudicedManipulatorDefaultMessage,
};