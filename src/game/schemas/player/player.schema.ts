import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import type { HydratedDocument } from "mongoose";

@Schema({ timestamps: true, versionKey: false, id: false, _id: false })
class Player {
  @Prop({ required: true })
  @ApiProperty({
    description: "Player's name",
    example: "Antoine",
  })
  public name: string;
}

const PlayerSchema = SchemaFactory.createForClass(Player);

type PlayerDocument = HydratedDocument<Player>;

export type { PlayerDocument };

export { Player, PlayerSchema };