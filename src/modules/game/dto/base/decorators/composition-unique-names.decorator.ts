import { applyDecorators } from "@nestjs/common";
import { ArrayUnique } from "class-validator";
import type { GetGameRandomCompositionPlayerDto } from "../../get-game-random-composition/get-game-random-composition-player/get-game-random-composition-player.dto";

function CompositionUniqueNames():
<TFunction extends () => void, Y>(target: (TFunction | object), propertyKey?: (string | symbol), descriptor?: TypedPropertyDescriptor<Y>) => void {
  return applyDecorators(ArrayUnique(({ name }: GetGameRandomCompositionPlayerDto) => name, { message: "players.name must be unique" }));
}

export { CompositionUniqueNames };