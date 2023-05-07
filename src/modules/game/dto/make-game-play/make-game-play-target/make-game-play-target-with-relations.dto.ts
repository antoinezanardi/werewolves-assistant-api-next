import { OmitType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Player } from "../../../schemas/player/player.schema";
import { MakeGamePlayTargetDto } from "./make-game-play-target.dto";

class MakeGamePlayTargetWithRelationsDto extends OmitType(MakeGamePlayTargetDto, ["playerId"] as const) {
  @Expose()
  public player: Player;
}

export { MakeGamePlayTargetWithRelationsDto };