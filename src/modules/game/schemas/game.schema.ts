import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { Types } from "mongoose";

import { GamePhases, GameStatuses } from "@/modules/game/enums/game.enum";
import { GAME_ADDITIONAL_CARD_SCHEMA, GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { GameOptions, GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/game-options.schema";
import { GAME_PLAY_SCHEMA, GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { GameVictory, GAME_VICTORY_SCHEMA } from "@/modules/game/schemas/game-victory/game-victory.schema";
import { GAME_API_PROPERTIES, GAME_FIELDS_SPECS } from "@/modules/game/schemas/game.schema.constant";
import { PLAYER_SCHEMA, Player } from "@/modules/game/schemas/player/player.schema";

@Schema({
  timestamps: true,
  versionKey: false,
})
class Game {
  @ApiProperty(GAME_API_PROPERTIES._id)
  @Type(() => String)
  @Expose()
  public _id: Types.ObjectId;

  @ApiProperty(GAME_API_PROPERTIES.turn)
  @Prop({ default: GAME_FIELDS_SPECS.turn.default })
  @Expose()
  public turn: number;

  @ApiProperty(GAME_API_PROPERTIES.phase)
  @Prop({ default: GAME_FIELDS_SPECS.phase.default })
  @Expose()
  public phase: GamePhases;

  @ApiProperty(GAME_API_PROPERTIES.tick)
  @Prop({ default: GAME_FIELDS_SPECS.tick.default })
  @Expose()
  public tick: number;

  @ApiProperty(GAME_API_PROPERTIES.status)
  @Prop({ default: GAME_FIELDS_SPECS.status.default })
  @Expose()
  public status: GameStatuses;

  @ApiProperty(GAME_API_PROPERTIES.players)
  @Prop({
    required: true,
    type: [PLAYER_SCHEMA],
  })
  @Type(() => Player)
  @Expose()
  public players: Player[];

  @ApiProperty(GAME_API_PROPERTIES.currentPlay)
  @Prop({
    required: true,
    type: GAME_PLAY_SCHEMA,
  })
  @Type(() => GamePlay)
  @Expose()
  public currentPlay: GamePlay | null;

  @ApiProperty(GAME_API_PROPERTIES.upcomingPlays)
  @Prop({
    required: true,
    type: [GAME_PLAY_SCHEMA],
  })
  @Type(() => GamePlay)
  @Expose()
  public upcomingPlays: GamePlay[];

  @ApiProperty(GAME_API_PROPERTIES.options)
  @Prop({
    type: GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => GameOptions)
  @Expose()
  public options: GameOptions;

  @ApiProperty(GAME_API_PROPERTIES.additionalCards)
  @Prop({ type: [GAME_ADDITIONAL_CARD_SCHEMA], default: undefined })
  @Type(() => GameAdditionalCard)
  @Expose()
  public additionalCards?: GameAdditionalCard[];

  @ApiProperty(GAME_API_PROPERTIES.victory)
  @Prop({ type: GAME_VICTORY_SCHEMA, default: undefined })
  @Type(() => GameVictory)
  @Expose()
  public victory?: GameVictory;

  @ApiProperty(GAME_API_PROPERTIES.createdAt)
  @Type(() => Date)
  @Expose()
  public createdAt: Date;

  @ApiProperty(GAME_API_PROPERTIES.updatedAt)
  @Type(() => Date)
  @Expose()
  public updatedAt: Date;
}

const GAME_SCHEMA = SchemaFactory.createForClass(Game);

export {
  Game,
  GAME_SCHEMA,
};