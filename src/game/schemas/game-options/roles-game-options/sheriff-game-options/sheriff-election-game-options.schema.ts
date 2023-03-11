import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Min } from "class-validator";
import { defaultGameOptions } from "../../../../constants/game-options/game-options.constant";
import { GAME_PHASES } from "../../../../enums/game.enum";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SheriffElectionGameOptions {
  @ApiProperty({
    description: "Game's turn when the `sheriff` is elected.",
    default: defaultGameOptions.roles.sheriff.electedAt.turn,
  })
  @Min(1)
  @Prop({
    default: defaultGameOptions.roles.sheriff.electedAt.turn,
    min: 1,
  })
  public turn: number;

  @ApiProperty({
    description: "Game's phase when the `sheriff` is elected",
    default: defaultGameOptions.roles.sheriff.electedAt.phase,
  })
  @Prop({ default: defaultGameOptions.roles.sheriff.electedAt.phase })
  public phase: GAME_PHASES;
}

const SheriffElectionGameOptionsSchema = SchemaFactory.createForClass(SheriffElectionGameOptions);

export { SheriffElectionGameOptions, SheriffElectionGameOptionsSchema };