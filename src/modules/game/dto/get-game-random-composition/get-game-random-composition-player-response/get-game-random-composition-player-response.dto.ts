import { PickType } from "@nestjs/swagger";
import { GamePlayerBaseDto } from "../../base/game-player/game-player.base.dto";

class GetGameRandomCompositionPlayerResponseDto extends PickType(GamePlayerBaseDto, ["name", "role", "side"] as const) {}

export { GetGameRandomCompositionPlayerResponseDto };