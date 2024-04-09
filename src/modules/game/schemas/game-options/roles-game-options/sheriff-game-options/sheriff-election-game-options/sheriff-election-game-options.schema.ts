import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { GamePhase } from "@/modules/game/types/game.types";
import { SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES, SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options/sheriff-election-game-options.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SheriffElectionGameOptions {
  @ApiProperty(SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES.turn as ApiPropertyOptions)
  @Prop(SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.turn)
  @Expose()
  public turn: number;

  @ApiProperty(SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES.phase as ApiPropertyOptions)
  @Prop(SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.phase)
  @Expose()
  public phase: GamePhase;
}

const SHERIFF_ELECTION_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(SheriffElectionGameOptions);

export {
  SheriffElectionGameOptions,
  SHERIFF_ELECTION_GAME_OPTIONS_SCHEMA,
};