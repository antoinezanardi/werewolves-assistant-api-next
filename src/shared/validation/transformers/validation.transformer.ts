import type { TransformFnParams } from "class-transformer";

function toBoolean({ value }: TransformFnParams): unknown {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  }
  return value;
}

export { toBoolean };