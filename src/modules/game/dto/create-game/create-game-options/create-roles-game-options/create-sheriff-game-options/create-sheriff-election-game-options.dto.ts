import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { sheriffElectionGameOptionsApiProperties, sheriffElectionGameOptionsFieldsSpecs } from "../../../../../constants/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options.constant";
import { GAME_PHASES } from "../../../../../enums/game.enum";

class CreateSheriffElectionGameOptionsDto {
  @ApiProperty({
    ...sheriffElectionGameOptionsApiProperties.turn,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(sheriffElectionGameOptionsFieldsSpecs.turn.minimum)
  public turn: number = sheriffElectionGameOptionsFieldsSpecs.turn.default;

  @ApiProperty({
    ...sheriffElectionGameOptionsApiProperties.phase,
    required: false,
  })
  @IsOptional()
  @IsEnum(GAME_PHASES)
  public phase: GAME_PHASES = sheriffElectionGameOptionsFieldsSpecs.phase.default;
}

export { CreateSheriffElectionGameOptionsDto };