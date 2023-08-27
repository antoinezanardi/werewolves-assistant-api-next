import { OmitType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { MakeGamePlayTargetDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target.dto";
import { Player } from "@/modules/game/schemas/player/player.schema";

class MakeGamePlayTargetWithRelationsDto extends OmitType(MakeGamePlayTargetDto, ["playerId"] as const) {
  @Type(() => Player)
  @Expose()
  public player: Player;
}

export { MakeGamePlayTargetWithRelationsDto };