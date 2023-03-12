import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { GAME_PHASES } from "../../../../../enums/game.enum";
import { sheriffElectionGameOptionsApiProperties } from "../../../../../schemas/game-options/constants/roles-game-options/sheriff-game-options/sheriff-election-game-options.constant";

class CreateSheriffElectionGameOptionsDto {
  @ApiProperty(sheriffElectionGameOptionsApiProperties.turn)
  @IsOptional()
  public turn?: number;

  @ApiProperty(sheriffElectionGameOptionsApiProperties.phase)
  @IsOptional()
  public phase?: GAME_PHASES;
}

export { CreateSheriffElectionGameOptionsDto };