import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";

import { GamePlayActions, WitchPotions } from "@/modules/game/enums/game-play.enum";

class MakeGamePlayTargetDto {
  @ApiProperty({ description: `Player's Id` })
  @Type(() => String)
  @IsMongoId()
  public playerId: Types.ObjectId;

  @ApiProperty({ description: `Can be set only if there is a \`accursed wolf-father\` in the game and game's upcoming action is \`${GamePlayActions.EAT}\`. If set to \`true\`, the \`werewolves\` victim will instantly join the \`werewolves\` side if possible.` })
  @IsOptional()
  @IsBoolean()
  @Expose()
  public isInfected?: boolean;

  @ApiProperty({ description: `Can be set only if game's upcoming action is \`${GamePlayActions.USE_POTIONS}\`. If set to \`${WitchPotions.LIFE}\`, the \`witch\` saves target's life from \`werewolves\` meal. If set to \`${WitchPotions.DEATH}\`, the \`witch\` kills the target` })
  @IsOptional()
  @IsEnum(WitchPotions)
  @Expose()
  public drankPotion?: WitchPotions;
}

export { MakeGamePlayTargetDto };