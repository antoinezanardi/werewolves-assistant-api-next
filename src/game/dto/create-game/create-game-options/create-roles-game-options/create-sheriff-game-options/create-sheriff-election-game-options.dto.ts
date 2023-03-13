import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Min } from "class-validator";
import { GAME_PHASES } from "../../../../../enums/game.enum";
import { sheriffElectionGameOptionsApiProperties, sheriffElectionGameOptionsFieldsSpecs } from "../../../../../schemas/game-options/constants/roles-game-options/sheriff-game-options/sheriff-election-game-options.constant";

class CreateSheriffElectionGameOptionsDto {
  @ApiProperty(sheriffElectionGameOptionsApiProperties.turn)
  @IsOptional()
  @Min(sheriffElectionGameOptionsFieldsSpecs.turn.minimum)
  public turn?: number;

  @ApiProperty(sheriffElectionGameOptionsApiProperties.phase)
  @IsOptional()
  public phase?: GAME_PHASES;
}

export { CreateSheriffElectionGameOptionsDto };