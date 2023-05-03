import { OmitType } from "@nestjs/swagger";
import type { GameAdditionalCard } from "../../schemas/game-additional-card/game-additional-card.schema";
import type { MakeGamePlayTargetWithRelationsDto } from "./make-game-play-target/make-game-play-target-with-relations.dto";
import type { MakeGamePlayVoteWithRelationsDto } from "./make-game-play-vote/make-game-play-vote-with-relations.dto";
import { MakeGamePlayDto } from "./make-game-play.dto";

class MakeGamePlayWithRelationsDto extends OmitType(MakeGamePlayDto, ["targets", "votes", "chosenCardId"] as const) {
  public targets?: MakeGamePlayTargetWithRelationsDto[];

  public votes?: MakeGamePlayVoteWithRelationsDto[];
  
  public chosenCard?: GameAdditionalCard;
}

export { MakeGamePlayWithRelationsDto };