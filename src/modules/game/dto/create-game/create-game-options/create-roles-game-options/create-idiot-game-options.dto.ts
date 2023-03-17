import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { idiotGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/idiot-game-options.constant";

class CreateIdiotGameOptionsDto {
  @ApiProperty(idiotGameOptionsApiProperties.doesDieOnAncientDeath)
  @IsOptional()
  public doesDieOnAncientDeath?: boolean;
}

export { CreateIdiotGameOptionsDto };