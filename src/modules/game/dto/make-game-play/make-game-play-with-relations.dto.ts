import { OmitType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { MakeGamePlayTargetWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import { MakeGamePlayVoteWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import { MakeGamePlayDto } from "@/modules/game/dto/make-game-play/make-game-play.dto";
import { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";

class MakeGamePlayWithRelationsDto extends OmitType(MakeGamePlayDto, ["targets", "votes", "chosenCardId"] as const) {
  @Expose()
  @Type(() => MakeGamePlayTargetWithRelationsDto)
  public targets?: MakeGamePlayTargetWithRelationsDto[];

  @Expose()
  @Type(() => MakeGamePlayVoteWithRelationsDto)
  public votes?: MakeGamePlayVoteWithRelationsDto[];

  @Expose()
  @Type(() => GameAdditionalCard)
  public chosenCard?: GameAdditionalCard;
}

export { MakeGamePlayWithRelationsDto };