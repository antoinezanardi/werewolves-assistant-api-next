import { arrayMaxSize, arrayMinSize } from "class-validator";

function doesArrayRespectBounds(array: unknown[], bounds: { minItems?: number; maxItems?: number }): boolean {
  const { minItems, maxItems } = bounds;

  return (minItems === undefined || arrayMinSize(array, minItems)) && (maxItems === undefined || arrayMaxSize(array, maxItems));
}

export { doesArrayRespectBounds };