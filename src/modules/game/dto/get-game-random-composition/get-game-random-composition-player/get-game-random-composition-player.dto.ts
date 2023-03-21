import { ApiProperty, PickType } from "@nestjs/swagger";
import { CreateGamePlayerDto } from "../../create-game/create-game-player/create-game-player.dto";

class GetGameRandomCompositionPlayerDto extends PickType(CreateGamePlayerDto, ["name"] as const) {
  @ApiProperty({ description: "You must provide player names in query like this: `?players[0][name]=Antoine&players[1][name]=Damien`" })
  public name: string;
}

export { GetGameRandomCompositionPlayerDto };