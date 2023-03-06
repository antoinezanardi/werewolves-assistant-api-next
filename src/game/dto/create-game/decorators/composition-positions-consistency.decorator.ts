import type { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import type { CreateGamePlayerDto } from "../create-game-player/create-game-player.dto";
import type { CreateGameDto } from "../create-game.dto";

function doesCompositionHaveConsistentPositions(players?: CreateGamePlayerDto[]): boolean {
  if (!Array.isArray(players)) {
    return false;
  }
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
  return (object: CreateGameDto, propertyName: keyof CreateGameDto): void => {
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