import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { idiotGameOptionsApiProperties, idiotGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/idiot-game-options.constant";

class CreateIdiotGameOptionsDto {
  @ApiProperty({
    ...idiotGameOptionsApiProperties.doesDieOnAncientDeath,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public doesDieOnAncientDeath: boolean = idiotGameOptionsFieldsSpecs.doesDieOnAncientDeath.default;
}

export { CreateIdiotGameOptionsDto };