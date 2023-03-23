import { ApiProperty, PickType } from "@nestjs/swagger";
import { GamePlayerBaseDto } from "../../base/game-player/game-player.base.dto";

class GetGameRandomCompositionPlayerDto extends PickType(GamePlayerBaseDto, ["name"] as const) {
  @ApiProperty({ name: "players.name", description: "You must provide player names in query like this: `?players[0][name]=Antoine&players[1][name]=Damien`" })
  public name: string;
}

export { GetGameRandomCompositionPlayerDto };