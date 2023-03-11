import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class FoxGameOptions {
  @ApiProperty({
    description: "If set to `true`, the `fox` will loose his power if he doesn't find a player from the `werewolves` side during his turn if he doesn't skip",
    default: defaultGameOptions.roles.fox.isPowerlessIfMissesWerewolf,
  })
  @Prop({ default: defaultGameOptions.roles.fox.isPowerlessIfMissesWerewolf })
  public isPowerlessIfMissesWerewolf: boolean;
}

const FoxGameOptionsSchema = SchemaFactory.createForClass(FoxGameOptions);

export { FoxGameOptions, FoxGameOptionsSchema };