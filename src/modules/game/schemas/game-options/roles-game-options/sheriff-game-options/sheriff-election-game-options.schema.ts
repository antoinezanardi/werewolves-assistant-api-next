import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { sheriffElectionGameOptionsApiProperties, sheriffElectionGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options.constant";
import { GAME_PHASES } from "@/modules/game/enums/game.enum";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SheriffElectionGameOptions {
  @ApiProperty(sheriffElectionGameOptionsApiProperties.turn)
  @Prop({
    default: sheriffElectionGameOptionsFieldsSpecs.turn.default,
    min: sheriffElectionGameOptionsFieldsSpecs.turn.minimum,
  })
  @Expose()
  public turn: number;

  @ApiProperty(sheriffElectionGameOptionsApiProperties.phase)
  @Prop({ default: sheriffElectionGameOptionsFieldsSpecs.phase.default })
  @Expose()
  public phase: GAME_PHASES;
}

const SheriffElectionGameOptionsSchema = SchemaFactory.createForClass(SheriffElectionGameOptions);

export { SheriffElectionGameOptions, SheriffElectionGameOptionsSchema };