import { OmitType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Player } from "../../../schemas/player/player.schema";
import { MakeGamePlayVoteDto } from "./make-game-play-vote.dto";

class MakeGamePlayVoteWithRelationsDto extends OmitType(MakeGamePlayVoteDto, ["sourceId", "targetId"] as const) {
  @Expose()
  public source: Player;

  @Expose()
  public target: Player;
}

export { MakeGamePlayVoteWithRelationsDto };