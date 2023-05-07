import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";
import { GAME_PLAY_ACTIONS, WITCH_POTIONS } from "../../../enums/game-play.enum";

class MakeGamePlayTargetDto {
  @ApiProperty({ description: `Player's Id` })
  @Type(() => String)
  @IsMongoId()
  public playerId: Types.ObjectId;

  @ApiProperty({ description: `Can be set only if there is a \`vile father of wolves\` in the game and game's upcoming action is \`${GAME_PLAY_ACTIONS.EAT}\`. If set to \`true\`, the \`werewolves\` victim will instantly join the \`werewolves\` side if possible.` })
  @IsOptional()
  @IsBoolean()
  @Expose()
  public isInfected?: boolean;

  @ApiProperty({ description: `Can be set only if game's upcoming action is \`${GAME_PLAY_ACTIONS.USE_POTIONS}\`. If set to \`${WITCH_POTIONS.LIFE}\`, the \`witch\` saves target's life from \`werewolves\` meal. If set to \`${WITCH_POTIONS.DEATH}\`, the \`witch\` kills the target` })
  @IsOptional()
  @IsEnum(WITCH_POTIONS)
  @Expose()
  public drankPotion?: WITCH_POTIONS;
}

export { MakeGamePlayTargetDto };