import type { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import isObject from "isobject";

function doesCompositionHaveConsistentPositions(value?: unknown): boolean {
  if (!Array.isArray(value) || value.some(player => !isObject(player))) {
    return false;
  }
  const players = value as { position?: number }[];
  const uniquePositions = players.reduce<number[]>((acc, { position }) => {
    if (position !== undefined && !acc.includes(position) && position < players.length) {
      acc.push(position);
    }
    return acc;
  }, []);
  return uniquePositions.length === 0 || uniquePositions.length === players.length;
}

function getCompositionPositionsConsistencyDefaultMessage(): string {
  return "players.position must be all set or all undefined. Please check that every player has unique position, from 0 to players.length - 1";
}

function CompositionPositionsConsistency(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: "CompositionPositionsConsistency",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: doesCompositionHaveConsistentPositions,
        defaultMessage: getCompositionPositionsConsistencyDefaultMessage,
      },
    });
  };
}

export { CompositionPositionsConsistency, doesCompositionHaveConsistentPositions, getCompositionPositionsConsistencyDefaultMessage };