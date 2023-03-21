import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, ArrayNotContains, ArrayUnique, IsArray, IsBoolean, IsOptional, ValidateNested } from "class-validator";
import { toBoolean } from "../../../../shared/validation/transformers/validation.transformer";
import { ROLE_NAMES } from "../../../role/enums/role.enum";
import { gameFieldsSpecs } from "../../constants/game.constant";
import { GetGameRandomCompositionPlayerDto } from "./get-game-random-composition-player/get-game-random-composition-player.dto";

class GetGameRandomCompositionDto {
  @ApiProperty({ description: "Game's players to get the random composition from", type: GetGameRandomCompositionPlayerDto, isArray: true })
  @IsArray()
  @ArrayMinSize(gameFieldsSpecs.players.minItems)
  @ArrayMaxSize(gameFieldsSpecs.players.maxItems)
  @ArrayUnique(({ name }: GetGameRandomCompositionPlayerDto) => name, { message: "players.name must be unique" })
  @Type(() => GetGameRandomCompositionPlayerDto)
  @ValidateNested({ each: true })
  public players: GetGameRandomCompositionPlayerDto[];

  @ApiProperty({
    description: "Roles that won't be given by game random composition. All roles can be excluded except `villager` and `werewolf`",
    enum: ROLE_NAMES,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotContains([ROLE_NAMES.VILLAGER, ROLE_NAMES.WEREWOLF])
  @ArrayUnique((role: ROLE_NAMES) => role, { message: "excluded roles must be unique" })
  public excludedRoles: ROLE_NAMES[] = [];

  @ApiProperty({
    description: "If set to `true`, game composition will make sure that roles distributed respect the recommend min players in the game",
    required: false,
  })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  public areRecommendedMinPlayersRespected: boolean = true;

  @ApiProperty({
    description: "If set to `true`, villager roles with powers will be given to players before simple villager roles",
    required: false,
  })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  public arePowerfulVillagerRolesPrioritized: boolean = true;

  @ApiProperty({
    description: "If set to `true`, werewolf roles with powers will be given to players before simple werewolf roles",
    required: false,
  })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  public arePowerfulWerewolfRolesPrioritized: boolean = false;
}

export { GetGameRandomCompositionDto };