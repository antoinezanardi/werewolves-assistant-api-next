import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import type { HydratedDocument } from "mongoose";
import { GAME_PHASES, GAME_STATUSES } from "../enums/game.enum";
import type { Player } from "./player/player.schema";

@Schema({ timestamps: true, versionKey: false })
class Game {
  @ApiProperty({
    description: "Game's ID",
    example: "507f1f77bcf86cd799439011",
  })
  public _id: string;

  @ApiProperty({
    description: "Starting at `1`, a turn starts with the first phase (the `night`) and ends with the second phase (the `day`)",
    default: 1,
  })
  @Prop({
    required: true,
    default: 1,
  })
  public turn: number;

  @ApiProperty({
    description: "Each turn has two phases, `day` and `night`. Starting at `night`",
    default: GAME_PHASES.NIGHT,
  })
  @Prop({
    required: true,
    default: GAME_PHASES.NIGHT,
  })
  public phase: GAME_PHASES;

  @ApiProperty({
    description: "Starting at `1`, tick increments each time a play is made",
    default: 1,
  })
  @Prop({
    required: true,
    default: 1,
  })
  public tick: number;

  @ApiProperty({
    description: "Game's current status",
    default: GAME_STATUSES.PLAYING,
  })
  @Prop({
    required: true,
    default: GAME_STATUSES.PLAYING,
  })
  public status: GAME_STATUSES;

  @ApiProperty({ description: "Players of the game" })
  @Prop({ required: true })
  public players: Player[];

  @ApiProperty({ description: "When the game was created" })
  public createdAt: Date;

  @ApiProperty({ description: "When the game was updated" })
  public updatedAt: Date;
}

const GameSchema = SchemaFactory.createForClass(Game);

type GameDocument = HydratedDocument<Game>;

export type { GameDocument };

export { Game, GameSchema };