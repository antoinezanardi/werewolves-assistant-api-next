import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { ArrayNotContains, ArrayUnique, IsArray, IsBoolean, IsOptional, ValidateNested } from "class-validator";
import { toBoolean } from "../../../../shared/validation/transformers/validation.transformer";
import { ROLE_NAMES } from "../../../role/enums/role.enum";
import { CompositionBounds } from "../base/decorators/composition/composition-bounds.decorator";
import { CompositionUniqueNames } from "../base/decorators/composition/composition-unique-names.decorator";
import { GetGameRandomCompositionPlayerDto } from "./get-game-random-composition-player/get-game-random-composition-player.dto";

class GetGameRandomCompositionDto {
  @ApiProperty({ description: "Game's players to get the random composition from" })
  @Type(() => GetGameRandomCompositionPlayerDto)
  @ValidateNested({ each: true })
  @IsArray()
  @CompositionUniqueNames()
  @CompositionBounds()
  public players: GetGameRandomCompositionPlayerDto[];

  @ApiProperty({
    name: "excluded-roles",
    description: "Roles that won't be given by game random composition. All roles can be excluded except `villager` and `werewolf`",
    enum: ROLE_NAMES,
    required: false,
  })
  @Expose({ name: "excluded-roles" })
  @IsOptional()
  @IsArray()
  @ArrayNotContains([ROLE_NAMES.VILLAGER, ROLE_NAMES.WEREWOLF])
  @ArrayUnique((role: ROLE_NAMES) => role, { message: "excluded roles must be unique" })
  public excludedRoles: ROLE_NAMES[] = [];

  @ApiProperty({
    name: "are-recommended-min-players-respected",
    description: "If set to `true`, game composition will make sure that roles distributed respect the recommend min players in the game",
    required: false,
  })
  @Expose({ name: "are-recommended-min-players-respected" })
  @Transform(toBoolean)
  @IsOptional()
  @IsBoolean()
  public areRecommendedMinPlayersRespected: boolean = true;

  @ApiProperty({
    name: "are-powerful-villagers-roles-prioritized",
    description: "If set to `true`, villager roles with powers will be given to players before simple villager roles",
    required: false,
  })
  @Expose({ name: "are-powerful-villagers-roles-prioritized" })
  @Transform(toBoolean)
  @IsOptional()
  @IsBoolean()
  public arePowerfulVillagerRolesPrioritized: boolean = true;

  @ApiProperty({
    name: "are-powerful-werewolves-roles-prioritized",
    description: "If set to `true`, werewolf roles with powers will be given to players before simple werewolf roles",
    required: false,
  })
  @Expose({ name: "are-powerful-werewolves-roles-prioritized" })
  @Transform(toBoolean)
  @IsOptional()
  @IsBoolean()
  public arePowerfulWerewolfRolesPrioritized: boolean = false;
}

export { GetGameRandomCompositionDto };