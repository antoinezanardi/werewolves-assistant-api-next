import { applyDecorators } from "@nestjs/common";
import { ArrayMaxSize, ArrayMinSize } from "class-validator";
import { gameFieldsSpecs } from "../../../constants/game.constant";

function CompositionBounds(): <TFunction extends () => void, Y>(target: (TFunction | object), propertyKey?: (string | symbol), descriptor?: TypedPropertyDescriptor<Y>) => void {
  return applyDecorators(
    ArrayMinSize(gameFieldsSpecs.players.minItems),
    ArrayMaxSize(gameFieldsSpecs.players.maxItems),
  );
}

export { CompositionBounds };