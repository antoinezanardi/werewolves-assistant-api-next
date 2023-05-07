import { OmitType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { GameAdditionalCard } from "../../schemas/game-additional-card/game-additional-card.schema";
import { MakeGamePlayTargetWithRelationsDto } from "./make-game-play-target/make-game-play-target-with-relations.dto";
import { MakeGamePlayVoteWithRelationsDto } from "./make-game-play-vote/make-game-play-vote-with-relations.dto";
import { MakeGamePlayDto } from "./make-game-play.dto";

class MakeGamePlayWithRelationsDto extends OmitType(MakeGamePlayDto, ["targets", "votes", "chosenCardId"] as const) {
  @Expose()
  @Type(() => MakeGamePlayTargetWithRelationsDto)
  public targets?: MakeGamePlayTargetWithRelationsDto[];

  @Expose()
  @Type(() => MakeGamePlayVoteWithRelationsDto)
  public votes?: MakeGamePlayVoteWithRelationsDto[];

  @Expose()
  public chosenCard?: GameAdditionalCard;
}

export { MakeGamePlayWithRelationsDto };