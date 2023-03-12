import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { GAME_PHASES } from "../../../../../enums/game.enum";
import { sheriffElectionGameOptionsApiProperties } from "../../../constants/roles-game-options/sheriff-game-options/sheriff-election-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SheriffElectionGameOptions {
  @ApiProperty(sheriffElectionGameOptionsApiProperties.turn)
  @Prop({
    default: sheriffElectionGameOptionsApiProperties.turn.default as number,
    min: sheriffElectionGameOptionsApiProperties.turn.minimum,
  })
  public turn: number;

  @ApiProperty(sheriffElectionGameOptionsApiProperties.phase)
  @Prop({ default: sheriffElectionGameOptionsApiProperties.phase.default as GAME_PHASES })
  public phase: GAME_PHASES;
}

const SheriffElectionGameOptionsSchema = SchemaFactory.createForClass(SheriffElectionGameOptions);

export { SheriffElectionGameOptions, SheriffElectionGameOptionsSchema };