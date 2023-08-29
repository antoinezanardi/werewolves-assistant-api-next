import { applyDecorators } from "@nestjs/common";
import { ArrayMaxSize, ArrayMinSize } from "class-validator";

import { GAME_FIELDS_SPECS } from "@/modules/game/schemas/game.schema.constant";

function CompositionBounds(): <TFunction extends () => void, Y>(target: (TFunction | object), propertyKey?: (string | symbol), descriptor?: TypedPropertyDescriptor<Y>) => void {
  return applyDecorators(
    ArrayMinSize(GAME_FIELDS_SPECS.players.minItems),
    ArrayMaxSize(GAME_FIELDS_SPECS.players.maxItems),
  );
}

export { CompositionBounds };