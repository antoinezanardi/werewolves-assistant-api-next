import { OmitType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { MakeGamePlayVoteDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote.dto";
import { Player } from "@/modules/game/schemas/player/player.schema";

class MakeGamePlayVoteWithRelationsDto extends OmitType(MakeGamePlayVoteDto, ["sourceId", "targetId"] as const) {
  @Type(() => Player)
  @Expose()
  public source: Player;

  @Type(() => Player)
  @Expose()
  public target: Player;
}

export { MakeGamePlayVoteWithRelationsDto };