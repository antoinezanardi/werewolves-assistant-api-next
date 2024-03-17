import { OmitType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { Game } from "@/modules/game/schemas/game.schema";

class GameWithCurrentPlay extends OmitType(Game, ["currentPlay"]) {
  @Type(() => GamePlay)
  @Expose()
  public currentPlay: GamePlay;
}

export { GameWithCurrentPlay };