import { PickType } from "@nestjs/swagger";

import { GamePlayerBaseDto } from "@/modules/game/dto/base/game-player/game-player.base.dto";

class GetGameRandomCompositionPlayerResponseDto extends PickType(GamePlayerBaseDto, ["name", "role", "side"] as const) {}

export { GetGameRandomCompositionPlayerResponseDto };