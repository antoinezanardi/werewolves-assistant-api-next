import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsIn, IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";

import { WitchPotion } from "@/modules/game/types/game-play/game-play.types";
import { WITCH_POTIONS } from "@/modules/game/constants/game-play/game-play.constants";

class MakeGamePlayTargetDto {
  @ApiProperty({ description: `Player's Id` })
  @Type(() => String)
  @IsMongoId()
  public playerId: Types.ObjectId;

  @ApiProperty({ description: `Can be set only if game's current action is \`use-potions\`. If set to \`life\`, the \`witch\` saves target's life from \`werewolves\` meal. If set to \`death\`, the \`witch\` kills the target` })
  @IsOptional()
  @IsIn(WITCH_POTIONS)
  @Expose()
  public drankPotion?: WitchPotion;
}

export { MakeGamePlayTargetDto };