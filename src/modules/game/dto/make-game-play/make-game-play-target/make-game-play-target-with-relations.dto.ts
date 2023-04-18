import { OmitType } from "@nestjs/swagger";
import type { Player } from "../../../schemas/player/player.schema";
import { MakeGamePlayTargetDto } from "./make-game-play-target.dto";

class MakeGamePlayTargetWithRelationsDto extends OmitType(MakeGamePlayTargetDto, ["playerId"] as const) {
  public player: Player;
}

export { MakeGamePlayTargetWithRelationsDto };