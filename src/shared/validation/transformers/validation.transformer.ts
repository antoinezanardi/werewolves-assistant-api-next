import type { TransformFnParams } from "class-transformer";
import isObject from "isobject";
import { has } from "lodash";
import { isValidObjectId, Types } from "mongoose";

function toBoolean({ value }: TransformFnParams): unknown {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  }
  return value;
}

function toObjectId({ obj }: TransformFnParams): unknown {
  if (!isObject(obj) || !has(obj, "_id")) {
    return undefined;
  }
  const { _id } = obj as { _id: unknown };
  if (!isValidObjectId(_id)) {
    return _id;
  }
  return new Types.ObjectId((_id as Types.ObjectId).toString());
}

export {
  toBoolean,
  toObjectId,
};