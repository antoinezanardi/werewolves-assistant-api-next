import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { compositionGameOptionsApiProperties } from "../../../schemas/game-options/constants/composition-game-options.constant";

class CreateCompositionGameOptionsDto {
  @ApiProperty(compositionGameOptionsApiProperties.isHidden)
  @IsOptional()
  public isHidden?: boolean;
}

export { CreateCompositionGameOptionsDto };