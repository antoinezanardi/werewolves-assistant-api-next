import { applyDecorators } from "@nestjs/common";
import { ArrayUnique } from "class-validator";
import isObject from "isobject";
import { has } from "lodash";

function getPlayerName(value?: unknown): unknown {
  if (!isObject(value) || !has(value, "name")) {
    return value;
  }
  return (value as { name: unknown }).name;
}

function CompositionUniqueNames(): <TFunction extends () => void, Y>(
  target: (TFunction | object),
  propertyKey?: (string | symbol),
  descriptor?: TypedPropertyDescriptor<Y>
) => void {
  return applyDecorators(ArrayUnique(getPlayerName, { message: "players.name must be unique" }));
}

export { getPlayerName, CompositionUniqueNames };