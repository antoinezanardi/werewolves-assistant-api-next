import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES, SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options.constant";
import { GamePhases } from "@/modules/game/enums/game.enum";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SheriffElectionGameOptions {
  @ApiProperty(SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES.turn)
  @Prop({
    default: SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.turn.default,
    min: SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.turn.minimum,
  })
  @Expose()
  public turn: number;

  @ApiProperty(SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES.phase)
  @Prop({ default: SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.phase.default })
  @Expose()
  public phase: GamePhases;
}

const SHERIFF_ELECTION_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(SheriffElectionGameOptions);

export {
  SheriffElectionGameOptions,
  SHERIFF_ELECTION_GAME_OPTIONS_SCHEMA,
};